import {
  DocumentExtractionError,
  type DocumentExtractionErrorCode,
} from "./document-extraction";

export type DocumentUploadFailureResponse = {
  status: number;
  error: string;
};

const extractionErrorStatuses: Record<DocumentExtractionErrorCode, number> = {
  invalid_file: 400,
  empty_text: 422,
  text_too_long: 413,
  too_many_pages: 413,
  ocr_limit: 413,
  ocr_busy: 429,
  ocr_failed: 422,
  legacy_doc_failed: 422,
  upload_too_large: 413,
};

export function mapDocumentExtractionFailure(error: unknown): DocumentUploadFailureResponse {
  if (error instanceof DocumentExtractionError) {
    return {
      status: extractionErrorStatuses[error.code],
      error: error.message,
    };
  }

  return {
    status: 500,
    error: "Dokumen gagal diproses. Coba lagi dengan file lain.",
  };
}

export function mapDocumentUploadMiddlewareFailure(error: unknown): DocumentUploadFailureResponse {
  const code = typeof error === "object" && error !== null && "code" in error
    ? (error as { code?: unknown }).code
    : undefined;

  if (code === "LIMIT_FILE_SIZE") {
    return { status: 413, error: "Ukuran file maksimal 8 MB." };
  }

  return {
    status: 400,
    error: "File tidak dapat diterima. Pilih satu file PDF atau Word.",
  };
}
