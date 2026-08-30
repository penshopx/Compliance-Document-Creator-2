import assert from "node:assert/strict";
import { spawn, type ChildProcess } from "node:child_process";
import { once } from "node:events";
import { test } from "node:test";
import { setTimeout as delay } from "node:timers/promises";

const startupTimeoutMs = 30_000;
const requestTimeoutMs = 10_000;

function getTestPort(): number {
  return 5100 + Math.floor(Math.random() * 100);
}

function startServer(port: number): ChildProcess {
  const server = spawn(
    process.execPath,
    ["node_modules/tsx/dist/cli.mjs", "server/index.ts"],
    {
      env: {
        ...process.env,
        NODE_ENV: "development",
        PORT: String(port),
        // The persistence check should not call an external AI service. The
        // message endpoint stores the user message before checking availability.
        GEMINI_API_KEY: "",
        AI_INTEGRATIONS_GEMINI_API_KEY: "",
        AI_INTEGRATIONS_GEMINI_BASE_URL: "",
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  return server;
}

async function stopServer(server: ChildProcess): Promise<void> {
  if (server.exitCode !== null) {
    return;
  }

  server.kill("SIGTERM");
  await Promise.race([
    once(server, "exit"),
    delay(5_000).then(() => {
      if (server.exitCode === null) {
        server.kill("SIGKILL");
      }
    }),
  ]);
}

async function waitForServer(server: ChildProcess, port: number): Promise<void> {
  const startedAt = Date.now();
  let output = "";

  server.stdout?.on("data", (chunk: Buffer) => {
    output += chunk.toString();
  });
  server.stderr?.on("data", (chunk: Buffer) => {
    output += chunk.toString();
  });

  while (Date.now() - startedAt < startupTimeoutMs) {
    if (server.exitCode !== null) {
      throw new Error(`Chat server exited before startup:\n${output}`);
    }

    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/conversations`, {
        signal: AbortSignal.timeout(1_000),
      });
      if (response.ok) {
        return;
      }
    } catch {
      // The server may still be initializing auth, Vite, or the database.
    }

    await delay(250);
  }

  throw new Error(`Timed out waiting for chat server:\n${output}`);
}

async function requestJson<T>(
  url: string,
  init?: RequestInit,
): Promise<{ response: Response; body: T }> {
  const response = await fetch(url, {
    ...init,
    signal: AbortSignal.timeout(requestTimeoutMs),
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  const body = (await response.json()) as T;
  return { response, body };
}

test("chat conversations and messages survive a server restart", async () => {
  const port = getTestPort();
  const baseUrl = `http://127.0.0.1:${port}`;
  let server: ChildProcess | undefined;
  let conversationId: number | undefined;

  try {
    server = startServer(port);
    await waitForServer(server, port);

    const created = await requestJson<{
      id: number;
      title: string;
    }>(`${baseUrl}/api/conversations`, {
      method: "POST",
      body: JSON.stringify({ title: "Persistence smoke test" }),
    });
    assert.equal(created.response.status, 201);
    conversationId = created.body.id;
    assert.equal(created.body.title, "Persistence smoke test");

    const listedBeforeRestart = await requestJson<Array<{ id: number; title: string }>>(
      `${baseUrl}/api/conversations`,
    );
    assert.equal(listedBeforeRestart.response.status, 200);
    assert.ok(
      listedBeforeRestart.body.some(
        (conversation) =>
          conversation.id === conversationId &&
          conversation.title === "Persistence smoke test",
      ),
      "created conversation should be returned by the list endpoint",
    );

    const messageResponse = await fetch(
      `${baseUrl}/api/conversations/${conversationId}/messages`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "Message written before restart" }),
        signal: AbortSignal.timeout(requestTimeoutMs),
      },
    );
    assert.equal(messageResponse.status, 200);
    assert.match(await messageResponse.text(), /AI tidak tersedia/);

    const fetchedBeforeRestart = await requestJson<{
      id: number;
      title: string;
      messages: Array<{ role: string; content: string }>;
    }>(`${baseUrl}/api/conversations/${conversationId}`);
    assert.equal(fetchedBeforeRestart.response.status, 200);
    assert.equal(fetchedBeforeRestart.body.id, conversationId);
    assert.deepEqual(
      fetchedBeforeRestart.body.messages.map(({ role, content }) => ({ role, content })),
      [{ role: "user", content: "Message written before restart" }],
    );

    await stopServer(server);
    server = startServer(port);
    await waitForServer(server, port);

    const listedAfterRestart = await requestJson<Array<{ id: number; title: string }>>(
      `${baseUrl}/api/conversations`,
    );
    assert.equal(listedAfterRestart.response.status, 200);
    assert.ok(
      listedAfterRestart.body.some(
        (conversation) =>
          conversation.id === conversationId &&
          conversation.title === "Persistence smoke test",
      ),
      "conversation should remain available from the list endpoint after restart",
    );

    const fetchedAfterRestart = await requestJson<{
      id: number;
      title: string;
      messages: Array<{ role: string; content: string }>;
    }>(`${baseUrl}/api/conversations/${conversationId}`);
    assert.equal(fetchedAfterRestart.response.status, 200);
    assert.equal(fetchedAfterRestart.body.id, conversationId);
    assert.equal(fetchedAfterRestart.body.title, "Persistence smoke test");
    assert.deepEqual(
      fetchedAfterRestart.body.messages.map(({ role, content }) => ({ role, content })),
      [{ role: "user", content: "Message written before restart" }],
    );
  } finally {
    if (server) {
      if (conversationId !== undefined && server.exitCode === null) {
        try {
          await fetch(`${baseUrl}/api/conversations/${conversationId}`, {
            method: "DELETE",
            signal: AbortSignal.timeout(requestTimeoutMs),
          });
        } catch {
          // Cleanup should not hide the assertion or startup error.
        }
      }
      await stopServer(server);
    }
  }
});