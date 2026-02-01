import { GoogleGenAI } from "@google/genai";

/**
 * Gemini AI Client for SMAP Document Generation
 * Uses Replit AI Integrations - no API key required (uses Replit credits)
 * 
 * Supported models:
 * - gemini-2.5-flash: Fast, efficient for daily use
 * - gemini-2.5-pro: Advanced reasoning for complex tasks
 */

export const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY || "",
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL || "",
  },
});

/**
 * Generate document content using Gemini AI
 * @param prompt - The document generation prompt
 * @param model - Model to use (default: gemini-2.5-flash)
 * @returns Generated text content
 */
export async function generateDocumentContent(
  prompt: string,
  model: "gemini-2.5-flash" | "gemini-2.5-pro" = "gemini-2.5-flash"
): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    return response.text || "";
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to generate content"
    );
  }
}

/**
 * Generate SMAP document with company context
 * @param templateType - Type of SMAP document to generate
 * @param context - Company and organizational context
 * @returns Generated document content in Indonesian
 */
export async function generateSMAPDocument(
  templateType: string,
  context: {
    companyName?: string;
    director?: string;
    address?: string;
    ketuaFKAP?: string;
    additionalInfo?: string;
  }
): Promise<string> {
  const systemPrompt = `Anda adalah ahli Sistem Manajemen Anti Penyuapan (SMAP) berdasarkan SNI ISO 37001:2016.
Buatkan dokumen ${templateType} dalam format profesional menggunakan Bahasa Indonesia.

Konteks Perusahaan:
- Nama Perusahaan: ${context.companyName || "[Nama Perusahaan]"}
- Direktur: ${context.director || "[Nama Direktur]"}
- Alamat: ${context.address || "[Alamat Perusahaan]"}
- Ketua FKAP: ${context.ketuaFKAP || "[Nama Ketua FKAP]"}
${context.additionalInfo ? `\nInformasi Tambahan:\n${context.additionalInfo}` : ""}

Buatkan dokumen yang lengkap, profesional, dan sesuai dengan standar SNI ISO 37001:2016.`;

  return generateDocumentContent(systemPrompt, "gemini-2.5-flash");
}
