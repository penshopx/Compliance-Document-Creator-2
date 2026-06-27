import { getProviderMeta } from "@shared/ai-providers";

const MAX_OUTPUT_TOKENS = 8192;

const OPENAI_COMPATIBLE_BASE_URLS: Record<string, string> = {
  openai: "https://api.openai.com/v1",
  openrouter: "https://openrouter.ai/api/v1",
  deepseek: "https://api.deepseek.com/v1",
  qwen: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
};

export interface GenerateParams {
  provider: string;
  apiKey: string;
  model?: string | null;
  prompt: string;
}

function resolveModel(provider: string, model?: string | null): string {
  if (model && model.trim()) return model.trim();
  return getProviderMeta(provider)?.defaultModel || "";
}

async function generateWithGemini(params: GenerateParams): Promise<string> {
  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey: params.apiKey });
  const model = resolveModel("gemini", params.model);

  const response = await ai.models.generateContent({
    model,
    contents: [{ role: "user", parts: [{ text: params.prompt }] }],
    config: { maxOutputTokens: MAX_OUTPUT_TOKENS },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Model Gemini tidak mengembalikan teks. Periksa kuota/model API key Anda.");
  }
  return text;
}

async function generateWithOpenAICompatible(params: GenerateParams): Promise<string> {
  const baseUrl = OPENAI_COMPATIBLE_BASE_URLS[params.provider];
  if (!baseUrl) {
    throw new Error(`Provider tidak didukung: ${params.provider}`);
  }
  const model = resolveModel(params.provider, params.model);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${params.apiKey}`,
  };
  if (params.provider === "openrouter") {
    headers["HTTP-Referer"] = "https://replit.com";
    headers["X-Title"] = "Compliance Hub";
  }

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: params.prompt }],
      max_tokens: MAX_OUTPUT_TOKENS,
    }),
  });

  if (!res.ok) {
    let detail = "";
    try {
      const errBody = await res.json();
      detail = errBody?.error?.message || JSON.stringify(errBody);
    } catch {
      detail = await res.text().catch(() => "");
    }
    throw new Error(
      `Permintaan ke ${params.provider} gagal (${res.status}). ${detail || "Periksa API key & model Anda."}`
    );
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error(`Model ${params.provider} tidak mengembalikan teks. Periksa kuota/model API key Anda.`);
  }
  return content;
}

export async function generateDocumentWithProvider(params: GenerateParams): Promise<string> {
  if (params.provider === "gemini") {
    return generateWithGemini(params);
  }
  return generateWithOpenAICompatible(params);
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatParams {
  provider: string;
  apiKey: string;
  model?: string | null;
  systemPrompt: string;
  history: ChatMessage[];
  message: string;
}

async function chatWithGemini(params: ChatParams): Promise<string> {
  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey: params.apiKey });
  const model = resolveModel("gemini", params.model);

  const contents = [
    { role: "user", parts: [{ text: params.systemPrompt }] },
    { role: "model", parts: [{ text: "Baik, saya siap membantu." }] },
    ...params.history.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    })),
    { role: "user", parts: [{ text: params.message }] },
  ];

  const response = await ai.models.generateContent({
    model,
    contents,
    config: { maxOutputTokens: MAX_OUTPUT_TOKENS },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Model Gemini tidak mengembalikan teks. Periksa kuota/model API key Anda.");
  }
  return text;
}

async function chatWithOpenAICompatible(params: ChatParams): Promise<string> {
  const baseUrl = OPENAI_COMPATIBLE_BASE_URLS[params.provider];
  if (!baseUrl) {
    throw new Error(`Provider tidak didukung: ${params.provider}`);
  }
  const model = resolveModel(params.provider, params.model);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${params.apiKey}`,
  };
  if (params.provider === "openrouter") {
    headers["HTTP-Referer"] = "https://replit.com";
    headers["X-Title"] = "Compliance Hub";
  }

  const messages = [
    { role: "system", content: params.systemPrompt },
    ...params.history.map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.content,
    })),
    { role: "user", content: params.message },
  ];

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify({ model, messages, max_tokens: MAX_OUTPUT_TOKENS }),
  });

  if (!res.ok) {
    let detail = "";
    try {
      const errBody = await res.json();
      detail = errBody?.error?.message || JSON.stringify(errBody);
    } catch {
      detail = await res.text().catch(() => "");
    }
    throw new Error(
      `Permintaan ke ${params.provider} gagal (${res.status}). ${detail || "Periksa API key & model Anda."}`
    );
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error(`Model ${params.provider} tidak mengembalikan teks. Periksa kuota/model API key Anda.`);
  }
  return content;
}

export async function chatWithProvider(params: ChatParams): Promise<string> {
  if (params.provider === "gemini") {
    return chatWithGemini(params);
  }
  return chatWithOpenAICompatible(params);
}
