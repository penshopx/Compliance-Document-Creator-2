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
