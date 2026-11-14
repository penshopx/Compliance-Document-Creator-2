import assert from "node:assert/strict";
import { deflateSync } from "node:zlib";
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

test("extracts raw text from Word DOCX files", async () => {
  const result = await extractDocumentText(makeMinimalDocx(), "policy.docx");
  assert.equal(result.content, "Word anti bribery evidence");
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
