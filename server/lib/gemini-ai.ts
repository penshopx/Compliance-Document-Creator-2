import { GoogleGenAI } from "@google/genai";

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

/**
 * Checks that the configured credential can access the model without
 * generating content or consuming model tokens.
 *
 * This is intentionally separate from isGeminiAvailable(), which remains a
 * synchronous presence check for request guards. A key can be present but
 * invalid, revoked, or unable to access the configured model.
 */
export async function checkGeminiStatus(): Promise<GeminiStatusResult> {
  if (!isGeminiAvailable()) {
    return {
      available: false,
      configured: false,
      status: "missing",
      reason: "GEMINI_API_KEY tidak dikonfigurasi.",
    };
  }

  try {
    await getGeminiClient().models.get({ model: "gemini-2.5-flash" });
    return {
      available: true,
      configured: true,
      status: "valid",
      model: "gemini-2.5-flash",
    };
  } catch (error) {
    const status = classifyGeminiStatus(error);
    return {
      available: false,
      configured: true,
      status,
      reason: parseGeminiError(error),
    };
  }
}

function classifyGeminiStatus(error: unknown): Exclude<GeminiStatus, "missing" | "valid"> {
  const message = error instanceof Error ? error.message : String(error);
  const normalized = message.toLowerCase();

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
