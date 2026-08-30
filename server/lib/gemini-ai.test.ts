import assert from "node:assert/strict";
import { test } from "node:test";
import { GoogleGenAI } from "@google/genai";
import { checkGeminiStatus, getGeminiClient } from "./gemini-ai";

const environmentKeys = [
  "GEMINI_API_KEY",
  "AI_INTEGRATIONS_GEMINI_API_KEY",
  "AI_INTEGRATIONS_GEMINI_BASE_URL",
] as const;

test("Gemini status reports configured credentials accurately and caches checks", async () => {
  const previousEnvironment = Object.fromEntries(
    environmentKeys.map((key) => [key, process.env[key]]),
  );
  const modelsPrototype = Object.getPrototypeOf(
    getGeminiClientWithTemporaryKey().models,
  ) as { get: (params: { model: string }) => Promise<unknown> };
  const originalGet = modelsPrototype.get;
  let healthChecks = 0;
  let providerError: Error | undefined;

  modelsPrototype.get = async () => {
    healthChecks += 1;
    if (providerError) {
      throw providerError;
    }
    return {};
  };

  try {
    clearGeminiEnvironment();
    const missing = await checkGeminiStatus();
    assert.deepEqual(missing, {
      available: false,
      configured: false,
      status: "missing",
      reason:
        "Gemini belum dikonfigurasi. Tambahkan GEMINI_API_KEY atau aktifkan integrasi Gemini.",
    });
    assert.equal(healthChecks, 0);

    clearGeminiEnvironment();
    process.env.GEMINI_API_KEY = "working-test-key";
    const working = await checkGeminiStatus();
    assert.deepEqual(working, {
      available: true,
      configured: true,
      status: "valid",
      model: "gemini-2.5-flash",
    });
    assert.equal(healthChecks, 1);
    assert.deepEqual(await checkGeminiStatus(), working);
    assert.equal(healthChecks, 1, "repeated checks should use the cache");

    clearGeminiEnvironment();
    process.env.GEMINI_API_KEY = "invalid-test-key";
    providerError = new Error(
      JSON.stringify({
        error: {
          status: "UNAUTHENTICATED",
          message: "The provided API key is invalid.",
        },
      }),
    );
    const invalid = await checkGeminiStatus();
    assert.equal(invalid.available, false);
    assert.equal(invalid.configured, true);
    assert.equal(invalid.status, "invalid");
    assert.match(invalid.reason ?? "", /tidak valid|ditolak/i);
    assert.doesNotMatch(invalid.reason ?? "", /invalid-test-key|provided API key/i);

    clearGeminiEnvironment();
    process.env.GEMINI_API_KEY = "unreachable-test-key";
    providerError = new Error("connect ECONNREFUSED provider.internal");
    const unreachable = await checkGeminiStatus();
    assert.equal(unreachable.available, false);
    assert.equal(unreachable.configured, true);
    assert.equal(unreachable.status, "unreachable");
    assert.match(unreachable.reason ?? "", /tidak dapat dijangkau/i);
    assert.doesNotMatch(
      unreachable.reason ?? "",
      /unreachable-test-key|provider\.internal|ECONNREFUSED/i,
    );
  } finally {
    modelsPrototype.get = originalGet;
    clearGeminiEnvironment();
    for (const key of environmentKeys) {
      if (previousEnvironment[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = previousEnvironment[key];
      }
    }
  }
});

function getGeminiClientWithTemporaryKey(): GoogleGenAI {
  clearGeminiEnvironment();
  process.env.GEMINI_API_KEY = "temporary-test-key";
  return getGeminiClient();
}

function clearGeminiEnvironment(): void {
  for (const key of environmentKeys) {
    delete process.env[key];
  }
}