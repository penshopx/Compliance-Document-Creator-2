---
name: React component tests with tsx
description: Node test setup details for rendering React pages with jsdom and the tsx runner.
---

When a page is rendered through `tsx --test`, initialize jsdom globals before dynamically importing the page, expose the React namespace for JSX emitted by the test runner, and use the application's configured QueryClient so queries inherit its default query function. Radix-based UI can also need `DocumentFragment` and `MutationObserver` globals.

**Why:** The browser build supplies these globals and transforms JSX differently, while the Node test environment does not.

**How to apply:** For new component tests, render with React DOM under the project's QueryClientProvider, set up jsdom first, and restore global fetch after each test.
