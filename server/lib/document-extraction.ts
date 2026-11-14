import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, extname, join } from "node:path";
import { promisify } from "node:util";
import mammoth from "mammoth";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

import {
  DOCUMENT_SIMULATOR_MAX_CONTENT_LENGTH,
  DOCUMENT_SIMULATOR_MAX_OCR_PAGES,
  DOCUMENT_SIMULATOR_MAX_PDF_PAGES,
  DOCUMENT_SIMULATOR_MAX_UPLOAD_BYTES,
} from "@shared/schema";

const execFileAsync = promisify(execFile);
export const MAX_DOCUMENT_UPLOAD_BYTES = DOCUMENT_SIMULATOR_MAX_UPLOAD_BYTES;
export const MAX_DOCUMENT_TEXT_LENGTH = DOCUMENT_SIMULATOR_MAX_CONTENT_LENGTH;
export const MAX_PDF_PAGES = DOCUMENT_SIMULATOR_MAX_PDF_PAGES;
const MAX_DOCX_EXPANDED_BYTES = 20 * 1024 * 1024;
const MAX_DOCX_ENTRIES = 500;
export const MAX_OCR_PAGES = DOCUMENT_SIMULATOR_MAX_OCR_PAGES;
const PDF_RENDER_TIMEOUT_MS = 20_000;
const OCR_TIMEOUT_MS = 30_000;
const LEGACY_WORD_TIMEOUT_MS = 15_000;

let ocrBusy = false;

export type DocumentExtractionErrorCode =
  | "invalid_file"
  | "empty_text"
  | "text_too_long"
  | "too_many_pages"
  | "ocr_limit"
  | "ocr_busy"
  | "ocr_failed"
  | "legacy_doc_failed"
  | "upload_too_large";

export class DocumentExtractionError extends Error {
  constructor(
    message: string,
    readonly code: DocumentExtractionErrorCode,
  ) {
    super(message);
    this.name = "DocumentExtractionError";
  }
}

async function recognizePdfPages(buffer: Buffer, pageNumbers: number[], maxTextLength: number): Promise<string[]> {
  if (pageNumbers.length > MAX_OCR_PAGES) {
    throw new DocumentExtractionError(
      `Ditemukan ${pageNumbers.length} halaman hasil scan. Batas OCR adalah ${MAX_OCR_PAGES} halaman per file; bagi dokumen menjadi beberapa bagian.`,
      "ocr_limit",
    );
  }
  if (ocrBusy) {
    throw new DocumentExtractionError("OCR sedang memproses dokumen lain. Coba lagi sebentar.", "ocr_busy");
  }

  ocrBusy = true;
  let workDirectory: string | undefined;
  try {
    workDirectory = await mkdtemp(join(tmpdir(), "document-simulator-"));
    const pdfPath = join(workDirectory, "source.pdf");
    await writeFile(pdfPath, buffer, { mode: 0o600 });

    const pageTexts: string[] = [];
    let extractedLength = 0;
    for (const pageNumber of pageNumbers) {
      const imagePrefix = join(workDirectory, `page-${pageNumber}`);
      await execFileAsync("pdftoppm", [
        "-f", String(pageNumber),
        "-l", String(pageNumber),
        "-singlefile",
        "-png",
        "-gray",
        "-scale-to", "2000",
        pdfPath,
        imagePrefix,
      ], { timeout: PDF_RENDER_TIMEOUT_MS, maxBuffer: 1024 * 1024 });

      const imagePath = `${imagePrefix}.png`;
      const { stdout } = await execFileAsync("tesseract", [
        imagePath,
        "stdout",
        "-l", "ind+eng",
        "--psm", "3",
      ], { timeout: OCR_TIMEOUT_MS, maxBuffer: 1024 * 1024 });
      const pageText = stdout.trim();
      extractedLength += pageText.length;
      if (extractedLength > maxTextLength) {
        throw new DocumentExtractionError(
          `Teks hasil ekstraksi melebihi batas ${MAX_DOCUMENT_TEXT_LENGTH.toLocaleString("id-ID")} karakter. Bagi dokumen menjadi beberapa bagian.`,
          "text_too_long",
        );
      }
      pageTexts.push(pageText);
      await rm(imagePath, { force: true });
    }
    return pageTexts;
  } catch (error) {
    if (error instanceof DocumentExtractionError) throw error;
    throw new DocumentExtractionError(
      "OCR lokal gagal membaca PDF scan. Coba file yang lebih jelas atau tempelkan teksnya.",
      "ocr_failed",
    );
  } finally {
    try {
      if (workDirectory) await rm(workDirectory, { recursive: true, force: true });
    } finally {
      ocrBusy = false;
    }
  }
}

async function extractLegacyWordText(buffer: Buffer): Promise<string> {
  const oleSignature = Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
  if (buffer.length < oleSignature.length || !buffer.subarray(0, oleSignature.length).equals(oleSignature)) {
    throw new DocumentExtractionError("File bukan dokumen Word lama .doc yang valid.", "invalid_file");
  }

  let workDirectory: string | undefined;
  try {
    workDirectory = await mkdtemp(join(tmpdir(), "document-simulator-word-"));
    const filePath = join(workDirectory, "document.doc");
    await writeFile(filePath, buffer, { mode: 0o600 });
    const { stdout } = await execFileAsync("antiword", ["-m", "UTF-8.txt", "-t", filePath], {
      timeout: LEGACY_WORD_TIMEOUT_MS,
      maxBuffer: 1024 * 1024,
    });
    return stdout.trim();
  } catch {
    throw new DocumentExtractionError(
      "Dokumen Word .doc tidak dapat dibaca. Pastikan file tidak rusak atau dikunci kata sandi.",
      "legacy_doc_failed",
    );
  } finally {
    if (workDirectory) await rm(workDirectory, { recursive: true, force: true });
  }
}

function validateDocxArchive(buffer: Buffer) {
  const minimumEndRecordLength = 22;
  const searchStart = Math.max(0, buffer.length - 65_557);
  let endRecord = -1;
  for (let offset = buffer.length - minimumEndRecordLength; offset >= searchStart; offset -= 1) {
    if (buffer.readUInt32LE(offset) === 0x06054b50) {
      endRecord = offset;
      break;
    }
  }
  if (endRecord < 0) {
    throw new DocumentExtractionError("File DOCX tidak valid atau tidak dapat dibaca.", "invalid_file");
  }

  const entryCount = buffer.readUInt16LE(endRecord + 10);
  const directorySize = buffer.readUInt32LE(endRecord + 12);
  const directoryOffset = buffer.readUInt32LE(endRecord + 16);
  if (
    entryCount === 0xffff ||
    directorySize === 0xffffffff ||
    directoryOffset === 0xffffffff ||
    entryCount > MAX_DOCX_ENTRIES ||
    directoryOffset + directorySize > buffer.length
  ) {
    throw new DocumentExtractionError("Struktur DOCX terlalu besar atau tidak didukung.", "invalid_file");
  }

  let offset = directoryOffset;
  let expandedBytes = 0;
  let hasMainDocument = false;
  for (let entry = 0; entry < entryCount; entry += 1) {
    if (offset + 46 > buffer.length || buffer.readUInt32LE(offset) !== 0x02014b50) {
      throw new DocumentExtractionError("File DOCX tidak valid atau tidak dapat dibaca.", "invalid_file");
    }
    const uncompressedSize = buffer.readUInt32LE(offset + 24);
    const fileNameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const nameStart = offset + 46;
    const nextEntry = nameStart + fileNameLength + extraLength + commentLength;
    if (nextEntry > buffer.length) {
      throw new DocumentExtractionError("File DOCX tidak valid atau tidak dapat dibaca.", "invalid_file");
    }
    const fileName = buffer.toString("utf8", nameStart, nameStart + fileNameLength);
    if (fileName === "word/document.xml") hasMainDocument = true;
    expandedBytes += uncompressedSize;
    if (expandedBytes > MAX_DOCX_EXPANDED_BYTES) {
      throw new DocumentExtractionError("Isi DOCX terlalu besar untuk diproses dengan aman.", "invalid_file");
    }
    offset = nextEntry;
  }
  if (!hasMainDocument) {
    throw new DocumentExtractionError("File bukan dokumen Word DOCX yang valid.", "invalid_file");
  }
}

export async function extractDocumentText(
  buffer: Buffer,
  fileName: string,
): Promise<{ content: string; pageCount?: number; ocrPageCount?: number }> {
  const extension = fileName.toLowerCase().split(".").pop();
  let content: string;
  let pageCount: number | undefined;
  let ocrPageCount: number | undefined;

  if (extension === "pdf") {
    if (buffer.length < 5 || buffer.subarray(0, 5).toString("ascii") !== "%PDF-") {
      throw new DocumentExtractionError("File bukan PDF yang valid.", "invalid_file");
    }

    const loadingTask = getDocument({
      data: new Uint8Array(buffer),
      isEvalSupported: false,
      useSystemFonts: true,
      verbosity: 0,
    });

    try {
      const pdf = await loadingTask.promise;
      pageCount = pdf.numPages;
      if (pageCount > MAX_PDF_PAGES) {
        throw new DocumentExtractionError(
          `PDF memiliki ${pageCount} halaman. Batas yang didukung adalah ${MAX_PDF_PAGES} halaman.`,
          "too_many_pages",
        );
      }

      const pageTexts: string[] = [];
      const pagesNeedingOcr: number[] = [];
      let nativeTextLength = 0;
      for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .filter((item): item is typeof item & { str: string } => "str" in item)
          .map((item) => item.str)
          .join(" ")
          .trim();
        pageTexts.push(pageText);
        nativeTextLength += pageText.length;
        if (nativeTextLength > MAX_DOCUMENT_TEXT_LENGTH) {
          throw new DocumentExtractionError(
            `Teks hasil ekstraksi melebihi batas ${MAX_DOCUMENT_TEXT_LENGTH.toLocaleString("id-ID")} karakter. Bagi dokumen menjadi beberapa bagian.`,
            "text_too_long",
          );
        }
        if (!pageText) pagesNeedingOcr.push(pageNumber);
      }

      if (pagesNeedingOcr.length) {
        const recognizedPages = await recognizePdfPages(
          buffer,
          pagesNeedingOcr,
          MAX_DOCUMENT_TEXT_LENGTH - nativeTextLength,
        );
        ocrPageCount = pagesNeedingOcr.length;
        recognizedPages.forEach((text, index) => { pageTexts[pagesNeedingOcr[index] - 1] = text; });
      }
      content = pageTexts.join("\n\n").trim();
    } catch (error) {
      if (error instanceof DocumentExtractionError) throw error;
      throw new DocumentExtractionError(
        "PDF tidak dapat dibaca. Pastikan file tidak rusak dan coba lagi.",
        "invalid_file",
      );
    } finally {
      await loadingTask.destroy();
    }
  } else if (extension === "docx") {
    if (buffer.length < 4 || buffer[0] !== 0x50 || buffer[1] !== 0x4b) {
      throw new DocumentExtractionError("File bukan dokumen Word .docx yang valid.", "invalid_file");
    }
    try {
      validateDocxArchive(buffer);
      const result = await mammoth.extractRawText({ buffer });
      content = result.value.trim();
    } catch (error) {
      if (error instanceof DocumentExtractionError) throw error;
      throw new DocumentExtractionError(
        "Dokumen Word tidak dapat dibaca. Pastikan file berformat .docx dan tidak rusak.",
        "invalid_file",
      );
    }
  } else if (extension === "doc") {
    content = await extractLegacyWordText(buffer);
  } else {
    throw new DocumentExtractionError("Format file tidak didukung. Pilih PDF atau Word .doc/.docx.", "invalid_file");
  }

  if (!content.trim()) {
    throw new DocumentExtractionError(
      "Tidak ada teks yang dapat diekstrak. Periksa kualitas pindai atau tempelkan teks dokumen secara manual.",
      "empty_text",
    );
  }
  if (content.length > MAX_DOCUMENT_TEXT_LENGTH) {
    throw new DocumentExtractionError(
      `Teks hasil ekstraksi melebihi batas ${MAX_DOCUMENT_TEXT_LENGTH.toLocaleString("id-ID")} karakter. Bagi dokumen menjadi beberapa bagian.`,
      "text_too_long",
    );
  }

  return { content, pageCount, ocrPageCount };
}

export async function extractUploadedDocument(
  buffer: Buffer,
  originalName: string,
): Promise<{ title: string; fileName: string; content: string; pageCount?: number; ocrPageCount?: number }> {
  if (buffer.length > MAX_DOCUMENT_UPLOAD_BYTES) {
    throw new DocumentExtractionError(
      `Ukuran file maksimal ${MAX_DOCUMENT_UPLOAD_BYTES / (1024 * 1024)} MB.`,
      "upload_too_large",
    );
  }

  const fileName = basename(originalName.replaceAll("\\", "/"))
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim();
  const extension = extname(fileName).toLowerCase();
  if (!fileName || ![".pdf", ".doc", ".docx"].includes(extension)) {
    throw new DocumentExtractionError(
      "Format file tidak didukung. Pilih PDF atau Word .doc/.docx.",
      "invalid_file",
    );
  }

  const extracted = await extractDocumentText(buffer, fileName);
  const title = fileName.slice(0, -extension.length).trim().slice(0, 200) || "Dokumen impor";
  return { title, fileName, ...extracted };
}
