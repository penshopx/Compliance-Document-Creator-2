import assert from "node:assert/strict";
import { test } from "node:test";
import {
  DocumentExtractionError,
  type DocumentExtractionErrorCode,
} from "./document-extraction";
import {
  mapDocumentExtractionFailure,
  mapDocumentUploadMiddlewareFailure,
} from "./document-upload-errors";

const expectedStatuses: Record<DocumentExtractionErrorCode, number> = {
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

test("extraction errors map to the expected client response status and message", () => {
  for (const [code, status] of Object.entries(expectedStatuses) as [DocumentExtractionErrorCode, number][]) {
    const error = new DocumentExtractionError(`detail:${code}`, code);
    assert.deepEqual(mapDocumentExtractionFailure(error), {
      status,
      error: `detail:${code}`,
    });
  }
});

test("unexpected extraction errors return a safe server error message", () => {
  assert.deepEqual(mapDocumentExtractionFailure(new Error("internal detail")), {
    status: 500,
    error: "Dokumen gagal diproses. Coba lagi dengan file lain.",
  });
});

test("oversized multipart uploads return a size-specific 413 response", () => {
  assert.deepEqual(mapDocumentUploadMiddlewareFailure({ code: "LIMIT_FILE_SIZE" }), {
    status: 413,
    error: "Ukuran file maksimal 8 MB.",
  });
});

test("other multipart failures return an actionable 400 response", () => {
  assert.deepEqual(mapDocumentUploadMiddlewareFailure({ code: "LIMIT_UNEXPECTED_FILE" }), {
    status: 400,
    error: "File tidak dapat diterima. Pilih satu file PDF atau Word.",
  });
});
