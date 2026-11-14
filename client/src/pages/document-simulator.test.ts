import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import * as React from "react";
import { act, createElement } from "react";
import type { ComponentType } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { JSDOM } from "jsdom";
import { DOCUMENT_SIMULATOR_MAX_CONTENT_LENGTH, DOCUMENT_SIMULATOR_MAX_UPLOAD_BYTES } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

type FetchMock = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

let dom: JSDOM;
let root: Root;
let container: HTMLDivElement;
let reviewRequests: Array<Record<string, unknown>>;
let extractionResponse: { status: number; body: Record<string, unknown> };
let DocumentSimulatorPage: ComponentType;
let originalFetch: typeof fetch;
let originalCreateObjectURL: typeof URL.createObjectURL;
let originalRevokeObjectURL: typeof URL.revokeObjectURL;

const pause = (milliseconds = 20) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function setDomGlobals(window: Window & typeof globalThis) {
  Object.defineProperties(globalThis, {
    window: { configurable: true, value: window },
    document: { configurable: true, value: window.document },
    navigator: { configurable: true, value: window.navigator },
    HTMLElement: { configurable: true, value: window.HTMLElement },
    Node: { configurable: true, value: window.Node },
    DocumentFragment: { configurable: true, value: window.DocumentFragment },
    MutationObserver: { configurable: true, value: window.MutationObserver },
    Event: { configurable: true, value: window.Event },
    MouseEvent: { configurable: true, value: window.MouseEvent },
    FormData: { configurable: true, value: window.FormData },
    File: { configurable: true, value: window.File },
    React: { configurable: true, value: React },
    getComputedStyle: { configurable: true, value: window.getComputedStyle.bind(window) },
    IS_REACT_ACT_ENVIRONMENT: { configurable: true, value: true },
  });
}

beforeEach(async () => {
  dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "http://localhost", pretendToBeVisual: true });
  setDomGlobals(dom.window as unknown as Window & typeof globalThis);
  originalFetch = globalThis.fetch;
  originalCreateObjectURL = URL.createObjectURL;
  originalRevokeObjectURL = URL.revokeObjectURL;
  URL.createObjectURL = (() => "blob:scan-preview") as typeof URL.createObjectURL;
  URL.revokeObjectURL = (() => undefined) as typeof URL.revokeObjectURL;
  reviewRequests = [];
  extractionResponse = { status: 200, body: { title: "Imported policy", content: "Extracted policy text." } };
  queryClient.clear();

  globalThis.fetch = (async (input, init) => {
    const url = String(input);
    const method = init?.method || "GET";
    if (url.endsWith("/api/document-simulator/extract")) {
      return response(extractionResponse.body, extractionResponse.status);
    }
    if (url.endsWith("/api/document-simulator/review") && method === "POST") {
      reviewRequests.push(JSON.parse(String(init?.body)) as Record<string, unknown>);
      return response({
        id: "review-1",
        ownerId: "user-1",
        standard: "smap",
        sourceTitle: "Imported policy",
        overallScore: 75,
        overallStatus: "perlu_perbaikan",
        result: {
          overallScore: 75,
          overallStatus: "perlu_perbaikan",
          executiveSummary: "Review test",
          findings: [],
          strengths: [],
          missingEvidence: [],
          sourceTitle: "Imported policy",
          createdAt: new Date().toISOString(),
        },
        createdAt: new Date().toISOString(),
        model: "test",
      });
    }
    return response([]);
  }) as FetchMock;

  ({ default: DocumentSimulatorPage } = await import("./document-simulator"));
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  await act(async () => {
    root.render(createElement(QueryClientProvider, { client: queryClient }, createElement(DocumentSimulatorPage)));
    await pause();
  });
});

afterEach(async () => {
  await act(async () => root?.unmount());
  queryClient.clear();
  dom?.window.close();
  globalThis.fetch = originalFetch;
  URL.createObjectURL = originalCreateObjectURL;
  URL.revokeObjectURL = originalRevokeObjectURL;
});

async function switchToTextSource() {
  const switchButton = Array.from(container.querySelectorAll("button"))
    .find((button) => button.textContent?.includes("Tempel teks"));
  assert.ok(switchButton, "the source selector should offer text input");
  await act(async () => switchButton.click());
  assert.ok(container.querySelector("#source-title"));
}

async function selectFile(name: string, content: string, size?: number) {
  const fileInput = container.querySelector<HTMLInputElement>('input[type="file"]');
  assert.ok(fileInput, "file input should be available");
  const file = new dom.window.File([content], name, { type: "text/plain" });
  if (size !== undefined) Object.defineProperty(file, "size", { configurable: true, value: size });
  Object.defineProperty(file, "text", { configurable: true, value: async () => content });
  Object.defineProperty(fileInput, "files", { configurable: true, value: [file] });
  await act(async () => {
    fileInput.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
    await pause();
  });
}

function reviewButton() {
  const button = Array.from(container.querySelectorAll("button"))
    .find((candidate) => candidate.textContent?.includes("Jalankan review"));
  assert.ok(button, "review button should be visible");
  return button;
}

async function assertReviewBlockedByImport() {
  const button = reviewButton();
  assert.equal(button.disabled, true, "review should remain disabled until valid imported text is loaded");
  await act(async () => button.click());
  assert.equal(reviewRequests.length, 0, "invalid imported text must not start a review request");
}

for (const filename of ["policy.txt", "policy.md"]) {
  test(`${filename} selection updates the visible title and text before review`, async () => {
    await switchToTextSource();
    await selectFile(filename, "Imported text for review.");

    assert.equal((container.querySelector<HTMLInputElement>("#source-title"))?.value, "policy");
    assert.equal((container.querySelector<HTMLTextAreaElement>("#pasted-content"))?.value, "Imported text for review.");
    assert.match(container.querySelector('[role="status"]')?.textContent || "", /berhasil dimuat/);
    assert.equal(reviewButton().disabled, false);
  });
}

for (const filename of ["policy.pdf", "policy.docx"]) {
  test(`${filename} extraction fills the visible review input and request`, async () => {
    extractionResponse = {
      status: 200,
      body: { title: "Imported policy", content: "PDF/Word extracted text.", pageCount: 2 },
    };
    await switchToTextSource();
    await selectFile(filename, "binary file content");

    assert.equal((container.querySelector<HTMLInputElement>("#source-title"))?.value, "Imported policy");
    assert.equal((container.querySelector<HTMLTextAreaElement>("#pasted-content"))?.value, "PDF/Word extracted text.");
    assert.equal(reviewButton().disabled, false);

    await act(async () => {
      reviewButton().click();
      await pause();
    });
    assert.equal(reviewRequests.length, 1);
    assert.equal(reviewRequests[0].sourceTitle, "Imported policy");
    assert.equal(reviewRequests[0].content, "PDF/Word extracted text.");
  });
}

test("scanned PDF can be compared page by page with its editable extracted text", async () => {
  extractionResponse = {
    status: 200,
    body: {
      title: "Scanned policy",
      content: "--- Halaman 2 ---\nOCR text from page two\n\n--- Halaman 4 ---\nOCR text from page four",
      pageCount: 4,
      ocrPageCount: 2,
      ocrPages: [
        { pageNumber: 2, confidence: 54, needsReview: true },
        { pageNumber: 4, confidence: 88, needsReview: false },
      ],
    },
  };
  await switchToTextSource();
  await selectFile("scanned-policy.pdf", "binary file content");

  const pageSelector = container.querySelector<HTMLSelectElement>("#scan-preview-page");
  assert.ok(pageSelector, "scan comparison should provide a page selector");
  assert.equal(pageSelector.value, "2");
  assert.equal(
    container.querySelector<HTMLIFrameElement>('iframe[title="Scan asli halaman 2"]')?.getAttribute("src"),
    "blob:scan-preview#page=2&view=FitH",
  );
  assert.equal(container.querySelector('[data-testid="ocr-page-comparison-text"]')?.textContent, "OCR text from page two");

  await act(async () => {
    pageSelector.value = "4";
    pageSelector.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
    await pause();
  });
  assert.equal(
    container.querySelector<HTMLIFrameElement>('iframe[title="Scan asli halaman 4"]')?.getAttribute("src"),
    "blob:scan-preview#page=4&view=FitH",
  );
  assert.equal(container.querySelector('[data-testid="ocr-page-comparison-text"]')?.textContent, "OCR text from page four");
});

test("failed replacement imports preserve the current draft and scan preview", async () => {
  extractionResponse = {
    status: 200,
    body: {
      title: "Current policy",
      content: "--- Halaman 2 ---\nCurrent OCR text",
      pageCount: 2,
      ocrPageCount: 1,
      ocrPages: [{ pageNumber: 2, confidence: 60, needsReview: true }],
    },
  };
  await switchToTextSource();
  await selectFile("current-policy.pdf", "binary file content");

  const assertDraftRetained = () => {
    assert.equal((container.querySelector<HTMLInputElement>("#source-title"))?.value, "Current policy");
    assert.equal((container.querySelector<HTMLTextAreaElement>("#pasted-content"))?.value, "--- Halaman 2 ---\nCurrent OCR text");
    assert.equal(
      container.querySelector<HTMLIFrameElement>('iframe[title="Scan asli halaman 2"]')?.getAttribute("src"),
      "blob:scan-preview#page=2&view=FitH",
    );
    assert.match(container.textContent || "", /Draf sebelumnya tetap tersedia dan tidak diubah/i);
    assert.equal(reviewButton().disabled, false);
  };

  await selectFile("unsupported.rtf", "replacement content");
  assertDraftRetained();

  await selectFile("too-large.pdf", "", DOCUMENT_SIMULATOR_MAX_UPLOAD_BYTES + 1);
  assertDraftRetained();

  extractionResponse = { status: 422, body: { error: "Dokumen pengganti rusak." } };
  await selectFile("broken-replacement.pdf", "binary file content");
  assertDraftRetained();
});

test("an empty text file shows feedback and cannot start a review", async () => {
  await switchToTextSource();
  await selectFile("empty.txt", " \n ");

  assert.match(container.textContent || "", /tidak berisi teks/i);
  await assertReviewBlockedByImport();
});

test("text beyond the content limit shows feedback and cannot start a review", async () => {
  await switchToTextSource();
  await selectFile("oversized.txt", "x".repeat(DOCUMENT_SIMULATOR_MAX_CONTENT_LENGTH + 1));

  assert.match(container.textContent || "", /melebihi batas/i);
  await assertReviewBlockedByImport();
});

test("a file above the upload limit shows feedback and cannot start a review", async () => {
  await switchToTextSource();
  await selectFile("oversized.pdf", "", DOCUMENT_SIMULATOR_MAX_UPLOAD_BYTES + 1);

  assert.match(container.textContent || "", /maksimal 8 MB/i);
  await assertReviewBlockedByImport();
});

test("a failed PDF extraction shows feedback and cannot start a review", async () => {
  extractionResponse = { status: 422, body: { error: "Dokumen rusak." } };
  await switchToTextSource();
  await selectFile("broken.pdf", "binary file content");

  assert.match(container.textContent || "", /Dokumen rusak/i);
  await assertReviewBlockedByImport();
});

test("an extraction response without readable text shows feedback and cannot start a review", async () => {
  extractionResponse = { status: 200, body: { title: "Scanned policy", content: "  \n " } };
  await switchToTextSource();
  await selectFile("empty-scan.pdf", "binary file content");

  assert.match(container.textContent || "", /Tidak ada teks/i);
  await assertReviewBlockedByImport();
});
