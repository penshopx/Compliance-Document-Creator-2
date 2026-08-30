import assert from "node:assert/strict";
import { test } from "node:test";
import { consumeJsonSse } from "./sse";

const encoder = new TextEncoder();

function responseFromChunks(chunks: string[]): Response {
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });

  return new Response(body, {
    headers: { "Content-Type": "text/event-stream" },
  });
}

test("Pancek stops loading and keeps partial output unfinished on an SSE error", async () => {
  const response = responseFromChunks([
    'data: {"content":"Bagian ',
    'parsial"}\n\n',
    'data: {"error":"Model AI gagal setelah output parsial", ',
    '"done":true}\n\n',
  ]);
  let output = "";
  let isGenerating = true;
  let isDone = false;
  let surfacedError: Error | undefined;

  try {
    await consumeJsonSse(response, (event) => {
      if (event.content) output += event.content;
    });
    isDone = true;
  } catch (error) {
    surfacedError = error instanceof Error ? error : new Error(String(error));
    isDone = false;
  } finally {
    isGenerating = false;
  }

  assert.equal(output, "Bagian parsial");
  assert.equal(isGenerating, false, "Pancek must stop its loading state");
  assert.equal(isDone, false, "partial output must not be marked as complete");
  assert.equal(surfacedError?.message, "Model AI gagal setelah output parsial");
});

test("Gustafta dialog and collab consumers surface SSE errors and stop loading", async () => {
  const errorMessage = "Koneksi model terputus";

  for (const consumer of ["dialog", "collab"]) {
    const response = responseFromChunks([
      `data: ${JSON.stringify({ content: `Jawaban ${consumer} parsial` })}\n\n`,
      `data: ${JSON.stringify({ error: errorMessage, done: true })}\n\n`,
    ]);
    let loading = true;
    let partialReply = "";
    let surfacedError: Error | undefined;

    try {
      await consumeJsonSse(response, (event) => {
        if (event.content) partialReply += event.content;
      });
    } catch (error) {
      surfacedError = error instanceof Error ? error : new Error(String(error));
    } finally {
      loading = false;
    }

    assert.equal(partialReply, `Jawaban ${consumer} parsial`);
    assert.equal(loading, false, `${consumer} must stop loading after an SSE error`);
    assert.equal(surfacedError?.message, errorMessage);
  }
});

test("a stream that closes without done true is treated as interrupted", async () => {
  const response = responseFromChunks([
    'data: {"content":"Hasil belum selesai"}\n\n',
  ]);
  let output = "";

  await assert.rejects(
    consumeJsonSse(response, (event) => {
      if (event.content) output += event.content;
    }),
    (error: unknown) =>
      error instanceof Error &&
      error.message ===
        "Koneksi AI terputus sebelum proses selesai. Hasil sebagian tidak ditandai sebagai dokumen final.",
  );

  assert.equal(output, "Hasil belum selesai");
});