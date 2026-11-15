import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import * as React from "react";
import { act, createElement } from "react";
import type { ComponentType } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { JSDOM } from "jsdom";
import { queryClient } from "@/lib/queryClient";

type FetchMock = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

let dom: JSDOM;
let root: Root;
let container: HTMLDivElement;
let originalFetch: typeof fetch;
let progress: Record<string, boolean>;
let saveRequests: Array<Record<string, boolean>>;
let PancekPage: ComponentType<{ initialTab?: "overview" | "checklist" | "documents" }>;

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
    location: { configurable: true, value: window.location },
    history: { configurable: true, value: window.history },
    addEventListener: { configurable: true, value: window.addEventListener.bind(window) },
    removeEventListener: { configurable: true, value: window.removeEventListener.bind(window) },
    dispatchEvent: { configurable: true, value: window.dispatchEvent.bind(window) },
    requestAnimationFrame: { configurable: true, value: window.requestAnimationFrame.bind(window) },
    cancelAnimationFrame: { configurable: true, value: window.cancelAnimationFrame.bind(window) },
    navigator: { configurable: true, value: window.navigator },
    HTMLElement: { configurable: true, value: window.HTMLElement },
    Node: { configurable: true, value: window.Node },
    DocumentFragment: { configurable: true, value: window.DocumentFragment },
    MutationObserver: { configurable: true, value: window.MutationObserver },
    Event: { configurable: true, value: window.Event },
    MouseEvent: { configurable: true, value: window.MouseEvent },
    React: { configurable: true, value: React },
    getComputedStyle: { configurable: true, value: window.getComputedStyle.bind(window) },
    IS_REACT_ACT_ENVIRONMENT: { configurable: true, value: true },
  });
}

beforeEach(async () => {
  dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost/pancek",
    pretendToBeVisual: true,
  });
  setDomGlobals(dom.window as unknown as Window & typeof globalThis);
  originalFetch = globalThis.fetch;
  progress = { K01: true };
  saveRequests = [];
  queryClient.clear();

  globalThis.fetch = (async (input, init) => {
    const url = String(input);
    const method = init?.method || "GET";
    if (url.endsWith("/api/pancek/progress") && method === "GET") {
      return response({ progress });
    }
    if (url.endsWith("/api/pancek/progress") && method === "POST") {
      const body = JSON.parse(String(init?.body)) as { items: Record<string, boolean> };
      saveRequests.push(body.items);
      progress = { ...progress, ...body.items };
      return response({ ok: true });
    }
    return response([]);
  }) as FetchMock;

  ({ default: PancekPage } = await import("./pancek"));
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  await act(async () => {
    root.render(createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(PancekPage, { initialTab: "checklist" }),
    ));
    await pause(100);
  });
  await act(async () => pause(30));
});

afterEach(async () => {
  await act(async () => root?.unmount());
  queryClient.clear();
  dom?.window.close();
  globalThis.fetch = originalFetch;
});

test("loads saved checklist state and serializes edits into the progress API", async () => {
  const firstCheckbox = container.querySelector('[data-testid="checkbox-K01"]');
  const secondCheckbox = container.querySelector('[data-testid="checkbox-K02"]');
  assert.ok(firstCheckbox);
  assert.ok(secondCheckbox);
  assert.equal(firstCheckbox.getAttribute("data-state"), "checked");

  await act(async () => {
    firstCheckbox.click();
    secondCheckbox.click();
    await pause(80);
  });

  assert.equal(saveRequests.length, 2);
  assert.equal(saveRequests.at(-1)?.K01, false);
  assert.equal(saveRequests.at(-1)?.K02, true);
  assert.match(container.textContent || "", /Progres checklist tersimpan otomatis/);
});
