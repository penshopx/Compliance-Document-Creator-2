import assert from "node:assert/strict";
import { spawn, type ChildProcess } from "node:child_process";
import { once } from "node:events";
import { createServer, type Server as HttpServer } from "node:http";
import { test } from "node:test";
import { setTimeout as delay } from "node:timers/promises";

const startupTimeoutMs = 30_000;
const requestTimeoutMs = 10_000;

function getTestPort(): number {
  return 5100 + Math.floor(Math.random() * 100);
}

async function startFakeGeminiProvider(): Promise<HttpServer> {
  const responseChunksByRequest = [
    ["Balasan AI pertama ", "tetap tersimpan."],
    ["Balasan AI kedua ", "juga tetap tersimpan."],
  ];
  let requestCount = 0;

  const provider = createServer(async (request, response) => {
    if (request.method !== "POST" || !request.url?.includes("streamGenerateContent")) {
      response.writeHead(404).end();
      return;
    }

    response.writeHead(200, {
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream",
    });

    const chunks = responseChunksByRequest[requestCount] ?? ["Balasan AI tak terduga."];
    requestCount += 1;
    for (const content of chunks) {
      response.write(
        `data: ${JSON.stringify({
          candidates: [{ content: { parts: [{ text: content }] } }],
        })}\n\n`,
      );
      await delay(10);
    }
    response.end();
  });

  await new Promise<void>((resolve, reject) => {
    provider.once("error", reject);
    provider.listen(0, "127.0.0.1", () => resolve());
  });

  return provider;
}

function getProviderUrl(provider: HttpServer): string {
  const address = provider.address();
  if (!address || typeof address === "string") {
    throw new Error("Fake Gemini provider did not open a TCP port");
  }
  return `http://127.0.0.1:${address.port}`;
}

async function stopFakeGeminiProvider(provider: HttpServer): Promise<void> {
  if (!provider.listening) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    provider.close((error) => (error ? reject(error) : resolve()));
  });
}

function startServer(port: number, geminiBaseUrl: string): ChildProcess {
  const server = spawn(
    process.execPath,
    ["node_modules/tsx/dist/cli.mjs", "server/index.ts"],
    {
      env: {
        ...process.env,
        NODE_ENV: "development",
        PORT: String(port),
        GEMINI_API_KEY: "",
        AI_INTEGRATIONS_GEMINI_API_KEY: "smoke-test-key",
        AI_INTEGRATIONS_GEMINI_BASE_URL: geminiBaseUrl,
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

function parseSseEvents(raw: string): Array<Record<string, unknown>> {
  return raw
    .split("\n\n")
    .filter(Boolean)
    .map((event) => {
      assert.match(event, /^data: /);
      return JSON.parse(event.slice("data: ".length)) as Record<string, unknown>;
    });
}

test("chat conversations and streamed messages survive a server restart", async () => {
  const port = getTestPort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const fakeGeminiProvider = await startFakeGeminiProvider();
  const geminiBaseUrl = getProviderUrl(fakeGeminiProvider);
  let server: ChildProcess | undefined;
  let conversationId: number | undefined;

  try {
    server = startServer(port, geminiBaseUrl);
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

    const expectedMessages = [
      { role: "user", content: "Message written before restart" },
      { role: "assistant", content: "Balasan AI pertama tetap tersimpan." },
      { role: "user", content: "Message written immediately after first" },
      { role: "assistant", content: "Balasan AI kedua juga tetap tersimpan." },
    ];
    const messageContents = [
      "Message written before restart",
      "Message written immediately after first",
    ];
    const expectedResponseChunks = [
      ["Balasan AI pertama ", "tetap tersimpan."],
      ["Balasan AI kedua ", "juga tetap tersimpan."],
    ];

    for (let index = 0; index < messageContents.length; index += 1) {
      const messageResponse = await fetch(
        `${baseUrl}/api/conversations/${conversationId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: messageContents[index] }),
          signal: AbortSignal.timeout(requestTimeoutMs),
        },
      );
      assert.equal(messageResponse.status, 200);
      const sseEvents = parseSseEvents(await messageResponse.text());
      assert.deepEqual(
        sseEvents
          .filter((event) => typeof event.content === "string")
          .map((event) => event.content),
        expectedResponseChunks[index],
      );
      assert.deepEqual(sseEvents.at(-1), { done: true });
    }

    const fetchedBeforeRestart = await requestJson<{
      id: number;
      title: string;
      messages: Array<{ role: string; content: string }>;
    }>(`${baseUrl}/api/conversations/${conversationId}`);
    assert.equal(fetchedBeforeRestart.response.status, 200);
    assert.equal(fetchedBeforeRestart.body.id, conversationId);
    assert.deepEqual(
      fetchedBeforeRestart.body.messages.map(({ role, content }) => ({ role, content })),
      expectedMessages,
    );

    await stopServer(server);
    server = startServer(port, geminiBaseUrl);
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
      expectedMessages,
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
    await stopFakeGeminiProvider(fakeGeminiProvider);
  }
});