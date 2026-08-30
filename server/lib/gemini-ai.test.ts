import assert from "node:assert/strict";
import { test } from "node:test";
import { GoogleGenAI } from "@google/genai";
import {
  checkGeminiCredentialStatus,
  checkGeminiStatus,
  generateGeminiContent,
  generateGeminiContentStream,
  getGeminiClient,
} from "./gemini-ai";

const environmentKeys = [
  "GEMINI_API_KEY",
  "AI_INTEGRATIONS_GEMINI_API_KEY",
  "AI_INTEGRATIONS_GEMINI_BASE_URL",
  "GEMINI_MODEL",
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
  const unavailableModels = new Set<string>();

  modelsPrototype.get = async ({ model }) => {
    healthChecks += 1;
    if (unavailableModels.has(model)) {
      throw new Error(
        JSON.stringify({
          error: {
            code: 404,
            status: "NOT_FOUND",
            message: `Model ${model} not found`,
          },
        }),
      );
    }
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
      model: "gemini-3.5-flash",
    });
    assert.equal(healthChecks, 1);
    assert.deepEqual(await checkGeminiStatus(), working);
    assert.equal(healthChecks, 1, "repeated checks should use the cache");

    clearGeminiEnvironment();
    process.env.GEMINI_API_KEY = "fallback-test-key";
    unavailableModels.add("gemini-3.5-flash");
    const fallback = await checkGeminiStatus();
    assert.deepEqual(fallback, {
      available: true,
      configured: true,
      status: "valid",
      model: "gemini-3.1-flash-lite",
    });
    assert.equal(healthChecks, 3);
    unavailableModels.clear();

    unavailableModels.add("retired-model");
    unavailableModels.add("gemini-3.5-flash");
    const byokFallback = await checkGeminiCredentialStatus(
      "byok-test-key",
      "retired-model",
    );
    assert.deepEqual(byokFallback, {
      available: true,
      configured: true,
      status: "valid",
      model: "gemini-3.1-flash-lite",
    });
    unavailableModels.clear();

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

test("Gemini streaming falls back only when a model is unavailable", async () => {
  const previousEnvironment = Object.fromEntries(
    environmentKeys.map((key) => [key, process.env[key]]),
  );
  const requestedModels: string[] = [];

  try {
    clearGeminiEnvironment();
    process.env.GEMINI_API_KEY = "stream-test-key";
    let failure: "none" | "quota" | "generic-404" = "none";
    const clientFactory = () =>
      ({
        models: {
          generateContentStream: async ({ model }: { model: string }) => {
            requestedModels.push(model);
            if (failure === "quota") {
              throw new Error(
                JSON.stringify({
                  error: {
                    code: 429,
                    status: "RESOURCE_EXHAUSTED",
                    message: "Quota exhausted",
                  },
                }),
              );
            }
            if (failure === "generic-404") {
              throw new Error(
                JSON.stringify({
                  error: {
                    code: 404,
                    status: "NOT_FOUND",
                    message: "Requested endpoint was not found",
                  },
                }),
              );
            }
            if (model === "gemini-3.5-flash") {
              throw new Error(
                JSON.stringify({
                  error: {
                    code: 404,
                    status: "NOT_FOUND",
                    message: "Model not found",
                  },
                }),
              );
            }
            return (async function* emptyStream() {})();
          },
        },
      }) as unknown as GoogleGenAI;

    const result = await generateGeminiContentStream(
      { contents: "test" },
      clientFactory,
    );
    assert.equal(result.model, "gemini-3.1-flash-lite");
    assert.deepEqual(requestedModels, [
      "gemini-3.5-flash",
      "gemini-3.1-flash-lite",
    ]);

    requestedModels.length = 0;
    failure = "quota";

    await assert.rejects(
      () => generateGeminiContentStream({ contents: "test" }, clientFactory),
      /RESOURCE_EXHAUSTED/,
    );
    assert.deepEqual(requestedModels, ["gemini-3.5-flash"]);

    requestedModels.length = 0;
    failure = "generic-404";
    await assert.rejects(
      () => generateGeminiContentStream({ contents: "test" }, clientFactory),
      /endpoint was not found/,
    );
    assert.deepEqual(requestedModels, ["gemini-3.5-flash"]);
  } finally {
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

test("Gemini non-streaming chat uses the next available model", async () => {
  const requestedModels: string[] = [];
  const clientFactory = () =>
    ({
      models: {
        generateContent: async ({ model }: { model: string }) => {
          requestedModels.push(model);
          if (model === "gemini-3.5-flash") {
            throw new Error(
              JSON.stringify({
                error: {
                  code: 404,
                  status: "NOT_FOUND",
                  message: "Model not found",
                },
              }),
            );
          }
          return { text: "Balasan tersedia" };
        },
      },
    }) as unknown as GoogleGenAI;

  const result = await generateGeminiContent(
    { contents: "test" },
    clientFactory,
  );

  assert.equal(result.model, "gemini-3.1-flash-lite");
  assert.equal(result.response.text, "Balasan tersedia");
  assert.deepEqual(requestedModels, [
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
  ]);
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