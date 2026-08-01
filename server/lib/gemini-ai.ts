import { GoogleGenAI } from "@google/genai";

/**
 * Creates a GoogleGenAI client using the best available credentials.
 *
 * Priority:
 * 1. AI_INTEGRATIONS_GEMINI_API_KEY + AI_INTEGRATIONS_GEMINI_BASE_URL
 *    (Replit AI credits – injected by the javascript_gemini_ai_integrations blueprint)
 * 2. GEMINI_API_KEY (user-provided direct Google Gemini API key)
 *
 * Call fresh on every request — never cache the returned client, because
 * Replit integration tokens can be rotated at any time.
 */
export function getGeminiClient(): GoogleGenAI {
  const integrationKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
  const integrationBase = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;

  if (integrationKey && integrationBase) {
    // Use Replit AI credits via the Replit proxy
    return new GoogleGenAI({
      apiKey: integrationKey,
      httpOptions: {
        apiVersion: "",
        baseUrl: integrationBase,
      },
    });
  }

  const directKey = process.env.GEMINI_API_KEY;
  if (directKey) {
    // Use user-provided key directly against Google's API
    return new GoogleGenAI({ apiKey: directKey });
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
