import assert from "node:assert/strict";
import { test } from "node:test";
import {
  extractDocumentPageNumbers,
  sanitizeFindingPageNumbers,
} from "./document-review-pages";

test("extracts distinct page numbers from source page markers", () => {
  assert.deepEqual(
    extractDocumentPageNumbers("Intro\n--- Halaman 2 ---\nEvidence\n--- Halaman 1 ---\nMore evidence\n--- Halaman 2 ---"),
    [1, 2],
  );
});

test("returns no page references when the source has no page markers", () => {
  assert.deepEqual(extractDocumentPageNumbers("Unpaginated pasted text"), []);
});

test("keeps only valid page numbers present in the source", () => {
  assert.deepEqual(
    sanitizeFindingPageNumbers([4, 2, 2, 99, 0, -1, 3.5], [2, 4]),
    [2, 4],
  );
});

test("does not invent references when a finding has no page numbers", () => {
  assert.deepEqual(sanitizeFindingPageNumbers(undefined, [1, 2]), []);
});
