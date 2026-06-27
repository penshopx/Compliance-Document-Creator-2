export interface AiProviderMeta {
  id: string;
  label: string;
  defaultModel: string;
  models: string[];
  keyUrl: string;
  keyHint: string;
  note: string;
}

export const AI_PROVIDERS: AiProviderMeta[] = [
  {
    id: "gemini",
    label: "Google Gemini",
    defaultModel: "gemini-2.5-flash",
    models: ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash"],
    keyUrl: "https://aistudio.google.com/apikey",
    keyHint: "AIza...",
    note: "API key gratis tersedia di Google AI Studio.",
  },
  {
    id: "openai",
    label: "OpenAI (ChatGPT)",
    defaultModel: "gpt-4o-mini",
    models: ["gpt-4o-mini", "gpt-4o", "gpt-4.1-mini", "gpt-4.1"],
    keyUrl: "https://platform.openai.com/api-keys",
    keyHint: "sk-...",
    note: "Memerlukan saldo/billing aktif di akun OpenAI.",
  },
  {
    id: "openrouter",
    label: "OpenRouter",
    defaultModel: "openai/gpt-4o-mini",
    models: [
      "openai/gpt-4o-mini",
      "anthropic/claude-3.5-sonnet",
      "google/gemini-2.0-flash-001",
      "deepseek/deepseek-chat",
      "qwen/qwen-2.5-72b-instruct",
    ],
    keyUrl: "https://openrouter.ai/keys",
    keyHint: "sk-or-...",
    note: "Satu key untuk banyak model dari berbagai penyedia.",
  },
  {
    id: "deepseek",
    label: "DeepSeek",
    defaultModel: "deepseek-chat",
    models: ["deepseek-chat", "deepseek-reasoner"],
    keyUrl: "https://platform.deepseek.com/api_keys",
    keyHint: "sk-...",
    note: "Model hemat biaya, kompatibel format OpenAI.",
  },
  {
    id: "qwen",
    label: "Qwen (Alibaba)",
    defaultModel: "qwen-plus",
    models: ["qwen-plus", "qwen-turbo", "qwen-max"],
    keyUrl: "https://bailian.console.alibabacloud.com/",
    keyHint: "sk-...",
    note: "DashScope (mode kompatibel OpenAI).",
  },
];

export const AI_PROVIDER_IDS = AI_PROVIDERS.map((p) => p.id);

export function getProviderMeta(id: string): AiProviderMeta | undefined {
  return AI_PROVIDERS.find((p) => p.id === id);
}
