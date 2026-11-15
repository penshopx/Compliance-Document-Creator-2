import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildDocumentReviewPayload,
  createEditableDocument,
  getDefaultDocumentReviewStandard,
  getDocumentPageText,
  isPastedDocumentReady,
} from "./document-simulator";

test("an imported document keeps its title and extracted text for the editor", () => {
  const imported = createEditableDocument("Policy", "--- Halaman 2 ---\nOCR text");

  assert.equal(imported.title, "Policy");
  assert.equal(imported.content, "--- Halaman 2 ---\nOCR text");
});

test("review is ready only when editable text is present and within the limit", () => {
  assert.equal(isPastedDocumentReady("", 100), false);
  assert.equal(isPastedDocumentReady(" \n ", 100), false);
  assert.equal(isPastedDocumentReady("abc", 3), true);
  assert.equal(isPastedDocumentReady("abcd", 3), false);
});

test("the review standard follows the selected compliance framework", () => {
  assert.equal(getDefaultDocumentReviewStandard("pancek"), "pancek");
  assert.equal(getDefaultDocumentReviewStandard("smap"), "smap");
  assert.equal(getDefaultDocumentReviewStandard("other"), "smap");
});

test("gets the editable text for one marked PDF page", () => {
  const content = "--- Halaman 1 ---\nCover\n\n--- Halaman 3 ---\nOCR evidence\nMore evidence";

  assert.equal(getDocumentPageText(content, 3), "OCR evidence\nMore evidence");
  assert.equal(getDocumentPageText(content, 2), null);
});

test("the review request uses the edited text and preserves page markers", () => {
  const payload = buildDocumentReviewPayload({
    standard: "pancek",
    sourceType: "pasted",
    pastedDocument: createEditableDocument(
      "Imported policy",
      "  --- Halaman 2 ---\nEdited OCR text  ",
    ),
  });

  assert.deepEqual(payload, {
    standard: "pancek",
    sourceType: "pasted",
    sourceTitle: "Imported policy",
    content: "--- Halaman 2 ---\nEdited OCR text",
  });
});

test("saved-document review requests retain the selected document reference", () => {
  const payload = buildDocumentReviewPayload({
    standard: "smap",
    sourceType: "saved",
    selectedDocument: { id: "doc-1", title: "Saved policy" },
    pastedDocument: createEditableDocument("", ""),
  });

  assert.deepEqual(payload, {
    standard: "smap",
    sourceType: "saved",
    sourceId: "doc-1",
    sourceTitle: "Saved policy",
  });
});

test("a missing saved document cannot produce a review request", () => {
  assert.throws(
    () => buildDocumentReviewPayload({
      standard: "smap",
      sourceType: "saved",
      pastedDocument: createEditableDocument("", ""),
    }),
    /Pilih dokumen tersimpan/i,
  );
});
