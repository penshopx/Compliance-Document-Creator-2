import assert from "node:assert/strict";
import { deflateSync, gunzipSync } from "node:zlib";
import { test } from "node:test";
import { DocumentExtractionError, extractDocumentText } from "./document-extraction";

function makePdf(objects: Buffer[]): Buffer {
  const chunks = [Buffer.from("%PDF-1.4\n")];
  const offsets: number[] = [];
  let offset = chunks[0].length;
  objects.forEach((object, index) => {
    offsets.push(offset);
    const chunk = Buffer.concat([Buffer.from(`${index + 1} 0 obj\n`), object, Buffer.from("\nendobj\n")]);
    chunks.push(chunk);
    offset += chunk.length;
  });
  const xref = [
    `xref\n0 ${objects.length + 1}\n`,
    "0000000000 65535 f \n",
    ...offsets.map((position) => `${String(position).padStart(10, "0")} 00000 n \n`),
    `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${offset}\n%%EOF\n`,
  ].join("");
  chunks.push(Buffer.from(xref));
  return Buffer.concat(chunks);
}

function makeNativePdf(text: string): Buffer {
  const escaped = text.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
  const stream = Buffer.from(`BT /F1 12 Tf 72 720 Td (${escaped}) Tj ET`);
  return makePdf([
    Buffer.from("<< /Type /Catalog /Pages 2 0 R >>"),
    Buffer.from("<< /Type /Pages /Kids [3 0 R] /Count 1 >>"),
    Buffer.from("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>"),
    Buffer.from("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"),
    Buffer.concat([Buffer.from(`<< /Length ${stream.length} >>\nstream\n`), stream, Buffer.from("\nendstream")]),
  ]);
}

function makeScannedPdf(): Buffer {
  const glyphs = {
    S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
    M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
    A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
    P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  };
  const scale = 14;
  const text = "SMAP";
  const width = text.length * 6 * scale;
  const height = 7 * scale;
  const pixels = Buffer.alloc(width * height * 3, 255);
  [...text].forEach((character, characterIndex) => {
    glyphs[character as keyof typeof glyphs].forEach((row, rowIndex) => {
      [...row].forEach((bit, columnIndex) => {
        if (bit !== "1") return;
        for (let y = 0; y < scale; y += 1) {
          for (let x = 0; x < scale; x += 1) {
            const pixel = ((rowIndex * scale + y) * width + (characterIndex * 6 + columnIndex) * scale + x) * 3;
            pixels[pixel] = 0;
            pixels[pixel + 1] = 0;
            pixels[pixel + 2] = 0;
          }
        }
      });
    });
  });

  const image = deflateSync(pixels);
  const pageContent = Buffer.from(`q ${width} 0 0 ${height} 60 300 cm /Im1 Do Q`);
  return makePdf([
    Buffer.from("<< /Type /Catalog /Pages 2 0 R >>"),
    Buffer.from("<< /Type /Pages /Kids [3 0 R] /Count 1 >>"),
    Buffer.from("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>"),
    Buffer.concat([
      Buffer.from(`<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /Length ${image.length} >>\nstream\n`),
      image,
      Buffer.from("\nendstream"),
    ]),
    Buffer.concat([Buffer.from(`<< /Length ${pageContent.length} >>\nstream\n`), pageContent, Buffer.from("\nendstream")]),
  ]);
}

function makeBlankPdf(pageCount: number): Buffer {
  const pageReferences = Array.from({ length: pageCount }, (_, index) => `${index + 3} 0 R`).join(" ");
  return makePdf([
    Buffer.from("<< /Type /Catalog /Pages 2 0 R >>"),
    Buffer.from(`<< /Type /Pages /Kids [${pageReferences}] /Count ${pageCount} >>`),
    ...Array.from({ length: pageCount }, () =>
      Buffer.from("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>"),
    ),
  ]);
}

function crc32(buffer: Buffer): number {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeMinimalDocx(): Buffer {
  const entries = [
    ["[Content_Types].xml", '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'],
    ["_rels/.rels", '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'],
    ["word/document.xml", '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>Word anti bribery evidence</w:t></w:r></w:p></w:body></w:document>'],
  ];
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let localOffset = 0;
  for (const [path, value] of entries) {
    const name = Buffer.from(path);
    const data = Buffer.from(value);
    const checksum = crc32(data);
    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt32LE(checksum, 14);
    localHeader.writeUInt32LE(data.length, 18);
    localHeader.writeUInt32LE(data.length, 22);
    localHeader.writeUInt16LE(name.length, 26);
    localParts.push(localHeader, name, data);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt32LE(checksum, 16);
    centralHeader.writeUInt32LE(data.length, 20);
    centralHeader.writeUInt32LE(data.length, 24);
    centralHeader.writeUInt16LE(name.length, 28);
    centralHeader.writeUInt32LE(localOffset, 42);
    centralParts.push(centralHeader, name);
    localOffset += localHeader.length + name.length + data.length;
  }

  const centralDirectory = Buffer.concat(centralParts);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralDirectory.length, 12);
  end.writeUInt32LE(localOffset, 16);
  return Buffer.concat([...localParts, centralDirectory, end]);
}

// Apache POI test-data/document/simple.doc (Apache-2.0); gzip-compressed for this fixture.
const legacyWordSample = gunzipSync(Buffer.from(
  "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",
  "base64",
));

test("extracts selectable PDF text without invoking OCR", async () => {
  const result = await extractDocumentText(makeNativePdf("SMAP evidence"), "policy.pdf");
  assert.equal(result.content, "SMAP evidence");
  assert.equal(result.pageCount, 1);
  assert.equal(result.ocrPageCount, undefined);
});

test("recognizes Indonesian and English text from scanned PDF pages", async () => {
  const result = await extractDocumentText(makeScannedPdf(), "scanned-policy.pdf");
  assert.match(result.content.toUpperCase(), /SMAP/);
  assert.equal(result.pageCount, 1);
  assert.equal(result.ocrPageCount, 1);
});

test("rejects PDFs with more scanned pages than the OCR limit", async () => {
  await assert.rejects(
    extractDocumentText(makeBlankPdf(21), "large-scan.pdf"),
    (error: unknown) => error instanceof DocumentExtractionError && error.code === "ocr_limit",
  );
});

test("extracts raw text from Word DOCX files", async () => {
  const result = await extractDocumentText(makeMinimalDocx(), "policy.docx");
  assert.equal(result.content, "Word anti bribery evidence");
  assert.equal(result.pageCount, undefined);
});

test("extracts raw text from legacy Word DOC files", async () => {
  const result = await extractDocumentText(legacyWordSample, "policy.doc");
  assert.equal(result.content, "This is a simple file created with Word 97-SR2.");
  assert.equal(result.pageCount, undefined);
});

test("rejects invalid file signatures and unsupported formats", async () => {
  await assert.rejects(
    extractDocumentText(Buffer.from("not a pdf"), "policy.pdf"),
    (error: unknown) => error instanceof DocumentExtractionError && error.code === "invalid_file",
  );
  await assert.rejects(
    extractDocumentText(Buffer.from("plain text"), "policy.doc"),
    (error: unknown) => error instanceof DocumentExtractionError && error.code === "invalid_file",
  );
});

test("reports a corrupt legacy Word file without returning arbitrary bytes", async () => {
  const oleHeader = Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
  const corruptDoc = Buffer.concat([oleHeader, Buffer.alloc(1024)]);
  await assert.rejects(
    extractDocumentText(corruptDoc, "damaged.doc"),
    (error: unknown) => error instanceof DocumentExtractionError && error.code === "legacy_doc_failed",
  );
});
