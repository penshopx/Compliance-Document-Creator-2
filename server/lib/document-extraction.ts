import mammoth from "mammoth";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

export const MAX_DOCUMENT_UPLOAD_BYTES = 8 * 1024 * 1024;
export const MAX_DOCUMENT_TEXT_LENGTH = 30_000;
export const MAX_PDF_PAGES = 60;

export type DocumentExtractionErrorCode =
  | "invalid_file"
  | "empty_text"
  | "text_too_long"
  | "too_many_pages";

export class DocumentExtractionError extends Error {
  constructor(
    message: string,
    readonly code: DocumentExtractionErrorCode,
  ) {
    super(message);
    this.name = "DocumentExtractionError";
  }
}

export async function extractDocumentText(
  buffer: Buffer,
  fileName: string,
): Promise<{ content: string; pageCount?: number }> {
  const extension = fileName.toLowerCase().split(".").pop();
  let content: string;
  let pageCount: number | undefined;

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
      let textLength = 0;
      for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .filter((item): item is typeof item & { str: string } => "str" in item)
          .map((item) => item.str)
          .join(" ")
          .trim();
        pageTexts.push(pageText);
        textLength += pageText.length;
        if (textLength > MAX_DOCUMENT_TEXT_LENGTH) break;
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
      const result = await mammoth.extractRawText({ buffer });
      content = result.value.trim();
    } catch {
      throw new DocumentExtractionError(
        "Dokumen Word tidak dapat dibaca. Pastikan file berformat .docx dan tidak rusak.",
        "invalid_file",
      );
    }
  } else {
    throw new DocumentExtractionError("Format file tidak didukung. Pilih PDF atau Word .docx.", "invalid_file");
  }

  if (!content.trim()) {
    throw new DocumentExtractionError(
      "Tidak ada teks yang dapat diekstrak. PDF hasil pindai/foto belum didukung; gunakan dokumen dengan teks yang dapat dipilih.",
      "empty_text",
    );
  }
  if (content.length > MAX_DOCUMENT_TEXT_LENGTH) {
    throw new DocumentExtractionError(
      `Teks hasil ekstraksi melebihi batas ${MAX_DOCUMENT_TEXT_LENGTH.toLocaleString("id-ID")} karakter. Bagi dokumen menjadi beberapa bagian.`,
      "text_too_long",
    );
  }

  return { content, pageCount };
}
