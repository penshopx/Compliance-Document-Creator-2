import assert from "node:assert/strict";
import { createServer } from "node:http";
import express from "express";
import { test } from "node:test";

import { MAX_DOCUMENT_UPLOAD_BYTES } from "./document-extraction";
import { registerDocumentExtractionRoute } from "./document-extraction-route";

function makePdf(text: string): Buffer {
  const escapedText = text.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
  const stream = Buffer.from(`BT /F1 12 Tf 72 720 Td (${escapedText}) Tj ET`);
  const objects = [
    Buffer.from("<< /Type /Catalog /Pages 2 0 R >>"),
    Buffer.from("<< /Type /Pages /Kids [3 0 R] /Count 1 >>"),
    Buffer.from("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>"),
    Buffer.concat([
      Buffer.from(`<< /Length ${stream.length} >>\nstream\n`),
      stream,
      Buffer.from("\nendstream"),
    ]),
    Buffer.from("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"),
  ];
  const chunks = [Buffer.from("%PDF-1.4\n")];
  const offsets: number[] = [];
  let offset = chunks[0].length;

  objects.forEach((object, index) => {
    offsets.push(offset);
    const chunk = Buffer.concat([
      Buffer.from(`${index + 1} 0 obj\n`),
      object,
      Buffer.from("\nendobj\n"),
    ]);
    chunks.push(chunk);
    offset += chunk.length;
  });

  const xrefOffset = offset;
  const xref = [
    `xref\n0 ${objects.length + 1}\n`,
    "0000000000 65535 f \n",
    ...offsets.map((position) => `${String(position).padStart(10, "0")} 00000 n \n`),
    `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`,
  ].join("");
  chunks.push(Buffer.from(xref));
  return Buffer.concat(chunks);
}

async function withExtractionEndpoint(
  run: (baseUrl: string) => Promise<void>,
): Promise<void> {
  const app = express();
  registerDocumentExtractionRoute(app, (_req, _res, next) => next());
  const server = createServer(app);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));

  try {
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  }
}

async function uploadFile(
  baseUrl: string,
  fileName: string,
  content: Buffer,
): Promise<Response> {
  const form = new FormData();
  form.append("file", new Blob([content]), fileName);
  return fetch(`${baseUrl}/api/document-simulator/extract`, {
    method: "POST",
    body: form,
  });
}

test("returns 413 and a useful message when an upload exceeds the size limit", async () => {
  await withExtractionEndpoint(async (baseUrl) => {
    const response = await uploadFile(
      baseUrl,
      "large.pdf",
      Buffer.alloc(MAX_DOCUMENT_UPLOAD_BYTES + 1),
    );

    assert.equal(response.status, 413);
    assert.deepEqual(await response.json(), { error: "Ukuran file maksimal 8 MB." });
  });
});

test("returns 400 and the extraction message for a malformed PDF", async () => {
  await withExtractionEndpoint(async (baseUrl) => {
    const response = await uploadFile(baseUrl, "damaged.pdf", Buffer.from("not a PDF"));

    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { error: "File bukan PDF yang valid." });
  });
});

test("returns 422 and the extraction message for an unreadable Word document", async () => {
  await withExtractionEndpoint(async (baseUrl) => {
    const oleSignature = Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
    const response = await uploadFile(
      baseUrl,
      "damaged.doc",
      Buffer.concat([oleSignature, Buffer.alloc(1024)]),
    );

    assert.equal(response.status, 422);
    assert.deepEqual(await response.json(), {
      error: "Dokumen Word .doc tidak dapat dibaca. Pastikan file tidak rusak atau dikunci kata sandi.",
    });
  });
});

test("returns extracted text and page metadata for a valid PDF upload", async () => {
  await withExtractionEndpoint(async (baseUrl) => {
    const response = await uploadFile(baseUrl, "policy.pdf", makePdf("SMAP evidence"));
    const body = await response.json() as {
      fileName: string;
      title: string;
      content: string;
      pageCount: number;
      ocrPageCount?: number;
      ocrPages?: unknown[];
    };

    assert.equal(response.status, 200);
    assert.equal(body.fileName, "policy.pdf");
    assert.equal(body.title, "policy");
    assert.equal(body.content, "--- Halaman 1 ---\nSMAP evidence");
    assert.equal(body.pageCount, 1);
    assert.equal(body.ocrPageCount, undefined);
    assert.equal(body.ocrPages, undefined);
  });
});
