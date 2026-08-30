import assert from "node:assert/strict";
import { test } from "node:test";
import type { Response } from "express";
import { sendSseFailure } from "./routes";

type ResponseCall =
  | { type: "write"; value: string }
  | { type: "end" }
  | { type: "status"; value: number }
  | { type: "json"; value: unknown };

interface MockResponse {
  response: Response;
  calls: ResponseCall[];
}

function createMockResponse(options: {
  contentType?: string;
  headersSent?: boolean;
} = {}): MockResponse {
  const calls: ResponseCall[] = [];
  const response = {
    writableEnded: false,
    destroyed: false,
    headersSent: options.headersSent ?? false,
    getHeader(name: string): string | undefined {
      return name.toLowerCase() === "content-type" ? options.contentType : undefined;
    },
    status(code: number) {
      calls.push({ type: "status", value: code });
      return response;
    },
    json(value: unknown) {
      calls.push({ type: "json", value });
      return response;
    },
    write(value: string) {
      calls.push({ type: "write", value });
      return true;
    },
    end() {
      calls.push({ type: "end" });
      response.writableEnded = true;
      return response;
    },
  } as unknown as Response;

  return { response, calls };
}

test("SSE failures emit a terminal error event and close the response", () => {
  const { response, calls } = createMockResponse({
    contentType: "text/event-stream; charset=utf-8",
    headersSent: true,
  });

  sendSseFailure(response, new Error("provider unavailable"));

  assert.deepEqual(calls, [
    {
      type: "write",
      value: `data: ${JSON.stringify({
        error: "provider unavailable",
        done: true,
      })}\n\n`,
    },
    { type: "end" },
  ]);

  const event = JSON.parse(
    (calls[0] as Extract<ResponseCall, { type: "write" }>).value
      .replace(/^data: /, "")
      .trim(),
  ) as { error: string; done: boolean };
  assert.deepEqual(event, {
    error: "provider unavailable",
    done: true,
  });
});

test("Failures before SSE starts remain ordinary JSON errors", () => {
  const { response, calls } = createMockResponse();

  sendSseFailure(response, new Error("provider unavailable"));

  assert.deepEqual(calls, [
    { type: "status", value: 500 },
    { type: "json", value: { error: "provider unavailable" } },
  ]);
  assert.equal(
    calls.some((call) => call.type === "write" || call.type === "end"),
    false,
  );
});