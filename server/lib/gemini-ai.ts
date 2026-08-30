import { GoogleGenAI } from "@google/genai";
import { createHash } from "node:crypto";

/**
 * Creates a GoogleGenAI client using the best available credentials.
 *
 * Priority:
 * 1. GEMINI_API_KEY (user-provided direct Google Gemini API key) — preferred
 *    so the user's own quota is always used when the key is configured.
 * 2. AI_INTEGRATIONS_GEMINI_API_KEY + AI_INTEGRATIONS_GEMINI_BASE_URL
 *    (Replit AI credits – injected by the javascript_gemini_ai_integrations blueprint)
 *
 * Call fresh on every request — never cache the returned client, because
 * Replit integration tokens can be rotated at any time.
 */
export function getGeminiClient(): GoogleGenAI {
  const directKey = process.env.GEMINI_API_KEY;
  if (directKey) {
    // Prefer user-provided key — ensures direct Google API quota is used
    return new GoogleGenAI({ apiKey: directKey });
  }

  const integrationKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
  const integrationBase = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;

  if (integrationKey && integrationBase) {
    // Fall back to Replit AI credits via the Replit proxy
    return new GoogleGenAI({
      apiKey: integrationKey,
      httpOptions: {
        apiVersion: "",
        baseUrl: integrationBase,
      },
    });
  }

  throw new Error(
    "AI tidak tersedia. Silakan konfigurasi GEMINI_API_KEY atau hubungi administrator."
  );
}

/**
 * Returns true if at least one Gemini credential is configured.
 * Use this to guard routes before attempting AI calls.
 */
export function isGeminiAvailable(): boolean {
  return !!(
    (process.env.AI_INTEGRATIONS_GEMINI_API_KEY &&
      process.env.AI_INTEGRATIONS_GEMINI_BASE_URL) ||
    process.env.GEMINI_API_KEY
  );
}

/**
 * Gemini periodically retires preview model names. Keep the preferred model
 * first, but let streaming chat recover when the configured credential can
 * only access an older still-supported model.
 */
export const GEMINI_CHAT_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
] as const;

type GeminiStreamParameters = Parameters<
  GoogleGenAI["models"]["generateContentStream"]
>[0];
type GeminiGenerateParameters = Parameters<
  GoogleGenAI["models"]["generateContent"]
>[0];

function isModelUnavailableError(error: unknown): boolean {
  const value = error as {
    message?: unknown;
    status?: unknown;
    code?: unknown;
    response?: { status?: unknown; statusCode?: unknown };
  };
  const normalized = [
    value?.message,
    value?.status,
    value?.code,
    value?.response?.status,
    value?.response?.statusCode,
  ]
    .filter((item) => item !== undefined && item !== null)
    .join(" ")
    .toLowerCase();
  const mentionsModel =
    normalized.includes("model") || normalized.includes("models/");
  const hasModelUnavailableSignal =
    normalized.includes("not_found") ||
    normalized.includes("model not found") ||
    normalized.includes("unknown model") ||
    normalized.includes("unsupported model") ||
    normalized.includes("no longer available") ||
    normalized.includes("does not exist");

  return mentionsModel && hasModelUnavailableSignal;
}

function getGeminiModelCandidates(requestedModel?: string | null): string[] {
  const configuredModel = process.env.GEMINI_MODEL?.trim();
  return Array.from(
    new Set([
      ...(requestedModel?.trim() ? [requestedModel.trim()] : []),
      ...(configuredModel ? [configuredModel] : []),
      ...GEMINI_CHAT_MODELS,
    ]),
  );
}

/**
 * Opens a Gemini stream using the first model accepted by the configured
 * endpoint. Retries only model-availability errors; quota and credential
 * failures are surfaced immediately instead of hiding the real problem.
 */
export async function generateGeminiContentStream(
  params: Omit<GeminiStreamParameters, "model">,
  clientFactory: () => GoogleGenAI = getGeminiClient,
  requestedModel?: string | null,
): Promise<{
  stream: Awaited<
    ReturnType<GoogleGenAI["models"]["generateContentStream"]>
  >;
  model: string;
}> {
  let lastError: unknown;

  for (const model of getGeminiModelCandidates(requestedModel)) {
    try {
      const stream = await clientFactory().models.generateContentStream({
        ...params,
        model,
      });
      return { stream, model };
    } catch (error) {
      lastError = error;
      if (!isModelUnavailableError(error)) throw error;
    }
  }

  throw lastError ?? new Error("Tidak ada model Gemini yang tersedia.");
}

export async function generateGeminiContent(
  params: Omit<GeminiGenerateParameters, "model">,
  clientFactory: () => GoogleGenAI = getGeminiClient,
  requestedModel?: string | null,
): Promise<{
  response: Awaited<ReturnType<GoogleGenAI["models"]["generateContent"]>>;
  model: string;
}> {
  let lastError: unknown;

  for (const model of getGeminiModelCandidates(requestedModel)) {
    try {
      const response = await clientFactory().models.generateContent({
        ...params,
        model,
      });
      return { response, model };
    } catch (error) {
      lastError = error;
      if (!isModelUnavailableError(error)) throw error;
    }
  }

  throw lastError ?? new Error("Tidak ada model Gemini yang tersedia.");
}

export type GeminiStatus =
  | "missing"
  | "valid"
  | "invalid"
  | "quota_exceeded"
  | "unreachable";

export interface GeminiStatusResult {
  available: boolean;
  configured: boolean;
  status: GeminiStatus;
  reason?: string;
  model?: string;
}

const GEMINI_STATUS_CACHE_TTL_MS = 60_000;
interface GeminiStatusCacheEntry {
  credentialFingerprint: string;
  expiresAt: number;
  result: GeminiStatusResult;
}

let geminiStatusCache: GeminiStatusCacheEntry | undefined;
let geminiStatusCheckInFlight:
  | {
      credentialFingerprint: string;
      promise: Promise<GeminiStatusResult>;
    }
  | undefined;

function getCredentialFingerprint(): string {
  // Store only a one-way fingerprint so cache metadata can never expose a credential.
  return createHash("sha256")
    .update(
      [
        process.env.GEMINI_API_KEY ?? "",
        process.env.AI_INTEGRATIONS_GEMINI_API_KEY ?? "",
        process.env.AI_INTEGRATIONS_GEMINI_BASE_URL ?? "",
      ].join("\u0000"),
    )
    .digest("hex");
}

/**
 * Checks that the configured credential can access the model without
 * generating content or consuming model tokens.
 *
 * This is intentionally separate from isGeminiAvailable(), which remains a
 * synchronous presence check for request guards. A key can be present but
 * invalid, revoked, or unable to access the configured model.
 */
export async function checkGeminiStatus(): Promise<GeminiStatusResult> {
  const credentialFingerprint = getCredentialFingerprint();
  const now = Date.now();

  if (
    geminiStatusCache &&
    geminiStatusCache.credentialFingerprint === credentialFingerprint &&
    geminiStatusCache.expiresAt > now
  ) {
    return geminiStatusCache.result;
  }

  if (geminiStatusCheckInFlight?.credentialFingerprint === credentialFingerprint) {
    return geminiStatusCheckInFlight.promise;
  }

  const promise = performGeminiStatusCheck();
  geminiStatusCheckInFlight = { credentialFingerprint, promise };

  try {
    const result = await promise;
    // Do not cache a result under a credential configuration that changed mid-request.
    if (getCredentialFingerprint() === credentialFingerprint) {
      geminiStatusCache = {
        credentialFingerprint,
        expiresAt: Date.now() + GEMINI_STATUS_CACHE_TTL_MS,
        result,
      };
    }
    return result;
  } finally {
    if (geminiStatusCheckInFlight?.promise === promise) {
      geminiStatusCheckInFlight = undefined;
    }
  }
}

async function checkConfiguredGeminiStatus(
  clientFactory: () => GoogleGenAI,
  requestedModel?: string | null,
): Promise<GeminiStatusResult> {
  let lastError: unknown;

  for (const model of getGeminiModelCandidates(requestedModel)) {
    try {
      await clientFactory().models.get({ model });
      return {
        available: true,
        configured: true,
        status: "valid",
        model,
      };
    } catch (error) {
      lastError = error;
      if (isModelUnavailableError(error)) continue;
      const status = classifyGeminiStatus(error);
      return {
        available: false,
        configured: true,
        status,
        reason: getGeminiStatusReason(status),
      };
    }
  }

  const status = classifyGeminiStatus(lastError);
  return {
    available: false,
    configured: true,
    status,
    reason: getGeminiStatusReason(status),
  };
}

export async function checkGeminiCredentialStatus(
  apiKey: string,
  requestedModel?: string | null,
): Promise<GeminiStatusResult> {
  return checkConfiguredGeminiStatus(
    () => new GoogleGenAI({ apiKey }),
    requestedModel,
  );
}

async function performGeminiStatusCheck(): Promise<GeminiStatusResult> {
  if (!isGeminiAvailable()) {
    return {
      available: false,
      configured: false,
      status: "missing",
      reason:
        "Gemini belum dikonfigurasi. Tambahkan GEMINI_API_KEY atau aktifkan integrasi Gemini.",
    };
  }

  return checkConfiguredGeminiStatus(getGeminiClient);
}

function getGeminiStatusReason(
  status: Exclude<GeminiStatus, "missing" | "valid">,
): string {
  switch (status) {
    case "invalid":
      return "Kredensial Gemini tidak valid atau aksesnya ditolak. Perbarui API key Gemini atau periksa konfigurasi integrasinya.";
    case "quota_exceeded":
      return "Kuota Gemini API habis atau batas laju tercapai. Coba lagi nanti atau periksa batas penggunaan.";
    case "unreachable":
      return "Layanan Gemini tidak dapat dijangkau saat ini. Periksa koneksi atau konfigurasi endpoint, lalu coba lagi.";
  }
}

function classifyGeminiStatus(error: unknown): Exclude<GeminiStatus, "missing" | "valid"> {
  const errorRecord =
    error && typeof error === "object"
      ? (error as {
          status?: unknown;
          code?: unknown;
          response?: { status?: unknown; statusCode?: unknown };
        })
      : undefined;
  const message = error instanceof Error ? error.message : String(error);
  const normalized = [
    message,
    errorRecord?.status,
    errorRecord?.code,
    errorRecord?.response?.status,
    errorRecord?.response?.statusCode,
  ]
    .filter((value) => value !== undefined && value !== null)
    .join(" ")
    .toLowerCase();

  if (
    normalized.includes("resource_exhausted") ||
    normalized.includes("resource exhausted") ||
    normalized.includes("quota") ||
    normalized.includes("rate limit") ||
    normalized.includes("too many requests") ||
    normalized.includes("429")
  ) {
    return "quota_exceeded";
  }

  if (
    normalized.includes("unauthenticated") ||
    normalized.includes("invalid api key") ||
    normalized.includes("api key not valid") ||
    normalized.includes("api_key_invalid") ||
    normalized.includes("permission_denied") ||
    normalized.includes("permission denied") ||
    normalized.includes("unauthorized") ||
    normalized.includes("401") ||
    normalized.includes("403")
  ) {
    return "invalid";
  }

  return "unreachable";
}

/**
 * Parses a Gemini SDK error and returns a clean, human-readable message.
 *
 * The SDK throws errors where `error.message` is already a JSON string
 * (e.g. `{"error":{"code":403,"message":"...","status":"PERMISSION_DENIED"}}`).
 * Wrapping that directly into `res.json({ error: error.message })` produces
 * double-encoded JSON that is unreadable.  This helper extracts the real
 * message so callers can do `res.json({ error: parseGeminiError(e) })`.
 */
export function parseGeminiError(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Terjadi kesalahan pada layanan AI.";
  }

  // Try to parse JSON embedded in the error message (SDK style)
  try {
    const parsed = JSON.parse(error.message);
    const inner = parsed?.error;
    if (inner) {
      const status: string = inner.status || "";
      const msg: string = inner.message || "";
      switch (status) {
        case "PERMISSION_DENIED":
          return "Akses Gemini API ditolak. Pastikan GEMINI_API_KEY valid dan proyek Anda memiliki akses ke model yang diminta.";
        case "UNAUTHENTICATED":
          return "API key Gemini tidak valid atau telah kedaluwarsa.";
        case "RESOURCE_EXHAUSTED":
          return "Kuota Gemini API habis. Coba lagi beberapa saat atau periksa batas penggunaan Anda.";
        case "NOT_FOUND":
          return `Model AI tidak ditemukan: ${msg}`;
        case "INVALID_ARGUMENT":
          return `Permintaan tidak valid: ${msg}`;
        default:
          return msg || error.message;
      }
    }
  } catch {
    // Not a JSON error message — fall through to raw message
  }

  return error.message;
}
