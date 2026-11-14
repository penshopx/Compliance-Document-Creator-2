import {
  DOCUMENT_SIMULATOR_MAX_CONTENT_LENGTH,
  DOCUMENT_SIMULATOR_MAX_UPLOAD_BYTES,
} from "@shared/schema";

const MAX_UPLOAD_SIZE_MESSAGE = "Ukuran file maksimal 8 MB.";

export function assertDocumentUploadSize(size: number): void {
  if (size > DOCUMENT_SIMULATOR_MAX_UPLOAD_BYTES) {
    throw new Error(MAX_UPLOAD_SIZE_MESSAGE);
  }
}

export function extractPlainTextDocument(fileName: string, content: string): {
  content: string;
  title: string;
} {
  const extension = fileName.split(".").pop()?.toLowerCase();
  if (extension !== "txt" && extension !== "md") {
    throw new Error("Format file tidak didukung. Pilih file .txt atau .md.");
  }
  if (!content.trim()) {
    throw new Error("File tidak berisi teks yang bisa dibaca.");
  }
  if (content.length > DOCUMENT_SIMULATOR_MAX_CONTENT_LENGTH) {
    throw new Error("Teks dokumen melebihi batas 30.000 karakter. Bagi dokumen menjadi beberapa bagian.");
  }

  return {
    content,
    title: fileName.replace(/\.(txt|md)$/i, "").slice(0, 200),
  };
}
