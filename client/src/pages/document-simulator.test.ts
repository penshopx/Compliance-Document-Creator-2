import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import * as React from "react";
import { act, createElement } from "react";
import type { ComponentType } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { JSDOM } from "jsdom";
import { DOCUMENT_SIMULATOR_MAX_CONTENT_LENGTH, DOCUMENT_SIMULATOR_MAX_UPLOAD_BYTES } from "@shared/schema";
import { IndustryProvider } from "@/hooks/use-industry";
import { queryClient } from "@/lib/queryClient";

type FetchMock = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

let dom: JSDOM;
let root: Root;
let container: HTMLDivElement;
let reviewRequests: Array<Record<string, unknown>>;
let reviewResponseFindings: Array<Record<string, unknown>>;
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
    localStorage: { configurable: true, value: window.localStorage },
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
  dom.window.localStorage.setItem("compliance-hub-industry", "smap");
  originalFetch = globalThis.fetch;
  originalCreateObjectURL = URL.createObjectURL;
  originalRevokeObjectURL = URL.revokeObjectURL;
  URL.createObjectURL = (() => "blob:scan-preview") as typeof URL.createObjectURL;
  URL.revokeObjectURL = (() => undefined) as typeof URL.revokeObjectURL;
  reviewRequests = [];
  reviewResponseFindings = [];
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
          findings: reviewResponseFindings,
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
    root.render(createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(IndustryProvider, null, createElement(DocumentSimulatorPage)),
    ));
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

test("the simulator defaults to Pancek when the selected industry is Pancek", async () => {
  await act(async () => root.unmount());
  queryClient.clear();
  dom.window.localStorage.setItem("compliance-hub-industry", "pancek");
  container.innerHTML = "";
  root = createRoot(container);

  await act(async () => {
    root.render(createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(IndustryProvider, null, createElement(DocumentSimulatorPage)),
    ));
    await pause();
  });

  const standardTrigger = container.querySelector("#review-standard");
  assert.ok(standardTrigger);
  assert.match(standardTrigger.textContent || "", /Pancek/i);
});

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

test("downloading PDF text preserves page markers and leaves the review input unchanged", async () => {
  extractionResponse = {
    status: 200,
    body: {
      title: "Revisi / kebijakan",
      content: "--- Halaman 1 ---\nTeks OCR yang sudah diperbaiki\n\n--- Halaman 3 ---\nTeks halaman tiga",
      pageCount: 3,
    },
  };
  await switchToTextSource();
  await selectFile("policy.pdf", "binary file content");

  const editor = container.querySelector<HTMLTextAreaElement>("#pasted-content");
  assert.ok(editor);
  const editorText = editor.value;

  let downloadedBlob: Blob | undefined;
  let downloadedFilename = "";
  const originalAnchorClick = dom.window.HTMLAnchorElement.prototype.click;
  URL.createObjectURL = ((blob: Blob) => {
    downloadedBlob = blob;
    return "blob:edited-text";
  }) as typeof URL.createObjectURL;
  dom.window.HTMLAnchorElement.prototype.click = function () {
    downloadedFilename = this.download;
  };

  try {
    const downloadButton = Array.from(container.querySelectorAll("button"))
      .find((button) => button.textContent?.includes("Unduh TXT"));
    assert.ok(downloadButton, "the edited text download button should be available");
    await act(async () => {
      downloadButton.click();
      await pause();
    });
  } finally {
    dom.window.HTMLAnchorElement.prototype.click = originalAnchorClick;
  }

  assert.ok(downloadedBlob);
  assert.equal(await downloadedBlob.text(), editorText);
  assert.equal(downloadedFilename, "Revisi - kebijakan.txt");
  assert.equal(editor.value, editorText, "downloading must not change the editor");
  assert.equal(reviewRequests.length, 0, "downloading must not start or alter a review");

  await act(async () => {
    reviewButton().click();
    await pause();
  });
  assert.equal(reviewRequests[0].content, editorText, "review should still use the unchanged editor text");
});

test("scanned PDF can be compared page by page with its editable extracted text", async () => {
  extractionResponse = {
    status: 200,
    body: {
      title: "Scanned policy",
      content: "--- Halaman 2 ---\nOCR text from page two\n\n--- Halaman 4 ---\nOCR text from page four",
      pageCount: 4,
      ocrPageCount: 2,
      ocrPages: [
        { pageNumber: 2, confidence: 79, lowConfidenceWordPercent: 20, needsReview: true },
        { pageNumber: 4, confidence: 88, lowConfidenceWordPercent: 10, needsReview: false },
      ],
    },
  };
  await switchToTextSource();
  await selectFile("scanned-policy.pdf", "binary file content");

  const pageSelector = container.querySelector<HTMLSelectElement>("#scan-comparison-page");
  assert.ok(pageSelector, "scan comparison should provide a page selector");
  assert.equal(pageSelector.value, "2");
  assert.match(container.textContent || "", /20% kata rendah/);
  assert.match(container.textContent || "", /ada kata yang perlu dicocokkan/);
  assert.match(container.textContent || "", /10% kata rendah/);
  assert.match(container.textContent || "", /skor tinggi bukan jaminan/i);
  assert.equal(
    container.querySelector<HTMLIFrameElement>('iframe[title="Dokumen asli, halaman 2"]')?.getAttribute("src"),
    "blob:scan-preview#page=2&view=FitH",
  );
  assert.equal(container.querySelector<HTMLTextAreaElement>("#scan-extracted-page-text")?.value, "OCR text from page two");

  await act(async () => {
    pageSelector.value = "4";
    pageSelector.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
    await pause();
  });
  assert.equal(
    container.querySelector<HTMLIFrameElement>('iframe[title="Dokumen asli, halaman 4"]')?.getAttribute("src"),
    "blob:scan-preview#page=4&view=FitH",
  );
  assert.equal(container.querySelector<HTMLTextAreaElement>("#scan-extracted-page-text")?.value, "OCR text from page four");
});

test("review findings display source pages when page references are present", async () => {
  reviewResponseFindings = [{
    severity: "sedang",
    criterion: "Pengendalian dokumen",
    reference: "Klausul 7.5",
    evidence: "Prosedur berlaku pada halaman dua.",
    gap: "Belum ada bukti persetujuan.",
    recommendation: "Tambahkan catatan persetujuan.",
    pageNumbers: [2, 4],
  }];
  await switchToTextSource();
  await selectFile("policy.txt", "--- Halaman 2 ---\nPolicy text\n--- Halaman 4 ---\nMore text");
  await act(async () => {
    reviewButton().click();
    await pause();
  });

  assert.match(container.textContent || "", /Halaman sumber:\s*2,\s*4/);
});

test("review findings without page references do not show a page label", async () => {
  reviewResponseFindings = [{
    severity: "sedang",
    criterion: "Pengendalian dokumen",
    reference: "Klausul 7.5",
    evidence: "Prosedur disebutkan.",
    gap: "Halaman sumber tidak dapat dipastikan.",
    recommendation: "Verifikasi dokumen secara manual.",
  }];
  await switchToTextSource();
  await selectFile("policy.txt", "Policy text without page markers.");
  await act(async () => {
    reviewButton().click();
    await pause();
  });

  assert.doesNotMatch(container.textContent || "", /Halaman sumber:/);
});

test("saved review history retains and displays source page references", async () => {
  queryClient.setQueryData(["/api/document-simulator/reviews"], [{
    id: "saved-review-1",
    ownerId: "user-1",
    standard: "smap",
    sourceTitle: "Saved policy",
    overallScore: 82,
    overallStatus: "memadai",
    result: {
      overallScore: 82,
      overallStatus: "memadai",
      executiveSummary: "Saved review",
      findings: [{
        severity: "rendah",
        criterion: "Kontrol dokumen",
        reference: "Klausul 7.5",
        evidence: "Pernyataan pada halaman tiga.",
        gap: "",
        recommendation: "Pertahankan kontrol.",
        pageNumbers: [3],
      }],
      strengths: [],
      missingEvidence: [],
      sourceTitle: "Saved policy",
      createdAt: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
  }]);
  await act(async () => pause());

  const savedReviewButton = Array.from(container.querySelectorAll("button"))
    .find((button) => button.textContent?.includes("Saved policy"));
  assert.ok(savedReviewButton, "the saved review should appear in history");
  await act(async () => savedReviewButton.click());

  assert.match(container.textContent || "", /Halaman sumber:\s*3/);
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
      container.querySelector<HTMLIFrameElement>('iframe[title="Dokumen asli, halaman 2"]')?.getAttribute("src"),
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

test("a scanned PDF opens a side-by-side editor and syncs page edits to the document", async () => {
  extractionResponse = {
    status: 200,
    body: {
      title: "Scanned policy",
      content: "--- Halaman 1 ---\n[Halaman 1 — hasil OCR]\nSMAP policy text",
      pageCount: 1,
      ocrPageCount: 1,
      ocrPages: [{ pageNumber: 1, confidence: 55, needsReview: true }],
    },
  };
  await switchToTextSource();
  await selectFile("scanned-policy.pdf", "binary file content");

  const compare = container.querySelector("#scan-comparison-title");
  assert.ok(compare, "scan comparison should open for scanned PDF imports");
  const originalPage = container.querySelector<HTMLIFrameElement>('iframe[title="Dokumen asli, halaman 1"]');
  assert.ok(originalPage);
  assert.match(originalPage.src, /#page=1/);
  const pageEditor = container.querySelector<HTMLTextAreaElement>("#scan-extracted-page-text");
  assert.equal(pageEditor?.value, "[Halaman 1 — hasil OCR]\nSMAP policy text");
  const { replaceScannedPageText } = await import("../components/document-scan-comparison");
  const content = "--- Halaman 1 ---\nOriginal OCR\n\n--- Halaman 2 ---\nOther page";
  const updatedContent = replaceScannedPageText(content, 1, "Corrected OCR");
  assert.equal(updatedContent, "--- Halaman 1 ---\nCorrected OCR\n\n--- Halaman 2 ---\nOther page");
  assert.equal(replaceScannedPageText(content, 3, "Unexpected"), null);
});

test("plain text imports do not show scan comparison controls", async () => {
  await switchToTextSource();
  await selectFile("policy.txt", "Plain policy text.");

  assert.equal(container.querySelector("#scan-comparison-title"), null);
  assert.equal(container.querySelector("#scan-extracted-page-text"), null);
});
