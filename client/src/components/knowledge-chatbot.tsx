import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIndustry } from "@/hooks/use-industry";
import {
  Sparkles,
  X,
  ExternalLink,
  Info,
} from "lucide-react";

const AI_OPTIONS = [
  {
    id: "gemini",
    label: "Google Gemini",
    badge: "Gratis · 15 req/menit",
    color: "bg-blue-600",
    hoverColor: "hover:bg-blue-700",
    borderColor: "border-blue-200 dark:border-blue-800",
    bgLight: "bg-blue-50 dark:bg-blue-950/30",
    textColor: "text-blue-800 dark:text-blue-200",
    url: "https://gemini.google.com",
    steps: [
      'Klik tombol "Buka Gemini" di bawah',
      "Login dengan akun Google (Gmail)",
      "Ketik pertanyaan compliance Anda",
    ],
    tip: 'Contoh: "Apa saja dokumen yang dibutuhkan untuk sertifikasi SMAP?"',
  },
  {
    id: "qwen",
    label: "Qwen (Alibaba)",
    badge: "Gratis · quota awal tersedia",
    color: "bg-purple-600",
    hoverColor: "hover:bg-purple-700",
    borderColor: "border-purple-200 dark:border-purple-800",
    bgLight: "bg-purple-50 dark:bg-purple-950/30",
    textColor: "text-purple-800 dark:text-purple-200",
    url: "https://chat.qwenlm.ai",
    steps: [
      'Klik tombol "Buka Qwen" di bawah',
      "Login dengan akun Alibaba / email",
      "Ketik pertanyaan compliance Anda",
    ],
    tip: 'Contoh: "Jelaskan klausul 6.1 SNI ISO 37001:2016 untuk perusahaan konstruksi"',
  },
];

export default function KnowledgeChatbot() {
  const { currentIndustry } = useIndustry();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const colorMap: Record<string, string> = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    amber: "bg-amber-600",
    yellow: "bg-yellow-600",
    orange: "bg-orange-600",
    purple: "bg-purple-600",
    indigo: "bg-indigo-600",
    red: "bg-red-600",
    cyan: "bg-cyan-600",
    emerald: "bg-emerald-600",
  };

  const bgColor = colorMap[currentIndustry?.color || "blue"] || colorMap.blue;
  const selectedAI = AI_OPTIONS.find((a) => a.id === selected);

  const handleOpenAI = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {isOpen && (
        <div className="absolute bottom-16 left-0 w-80 shadow-2xl rounded-xl overflow-hidden border bg-background">
          {/* Header */}
          <div className={`${bgColor} px-4 py-3 flex items-center justify-between`}>
            <div className="flex items-center gap-2 text-white">
              <Sparkles className="w-4 h-4" />
              <span className="font-semibold text-sm">Tanya AI Langsung</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
              data-testid="button-close-ai-selector"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-3">
            {/* Pilih model */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Pilih Model AI
              </p>
              <div className="grid grid-cols-2 gap-2">
                {AI_OPTIONS.map((ai) => (
                  <button
                    key={ai.id}
                    onClick={() => setSelected(ai.id === selected ? null : ai.id)}
                    className={`rounded-lg border-2 p-3 text-left transition-all focus:outline-none ${
                      selected === ai.id
                        ? `${ai.borderColor.replace("border-", "border-").split(" ")[0]} bg-primary/5 border-primary`
                        : "border-border hover:border-primary/40"
                    }`}
                    data-testid={`button-select-ai-${ai.id}`}
                  >
                    <div className={`w-6 h-6 rounded-md ${ai.color} flex items-center justify-center mb-1.5`}>
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <p className="font-semibold text-xs leading-tight">{ai.label}</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-0.5 font-medium leading-tight">
                      ✓ {ai.badge.split("·")[0].trim()}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Detail model yang dipilih */}
            {selectedAI ? (
              <div className={`rounded-lg border ${selectedAI.borderColor} ${selectedAI.bgLight} p-3 space-y-2`}>
                <p className={`text-xs font-semibold ${selectedAI.textColor}`}>
                  Cara pakai {selectedAI.label}:
                </p>
                <ol className={`space-y-1 text-xs ${selectedAI.textColor}`}>
                  {selectedAI.steps.map((step, i) => (
                    <li key={i} className="flex gap-2 items-start">
                      <span className={`shrink-0 w-4 h-4 rounded-full ${selectedAI.color} text-white flex items-center justify-center text-[10px] font-bold mt-0.5`}>
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                <p className={`text-xs italic opacity-75 ${selectedAI.textColor} border-t ${selectedAI.borderColor} pt-2 mt-1`}>
                  {selectedAI.tip}
                </p>
                <Button
                  onClick={() => handleOpenAI(selectedAI.url)}
                  className={`w-full gap-2 ${selectedAI.color} ${selectedAI.hoverColor} text-white border-0 mt-1`}
                  data-testid={`button-open-ai-${selectedAI.id}`}
                >
                  <ExternalLink className="w-4 h-4" />
                  Buka {selectedAI.label}
                </Button>
              </div>
            ) : (
              <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  Pilih Gemini atau Qwen di atas — keduanya <strong>gratis</strong> menggunakan akun Anda sendiri. Tidak perlu API key untuk bertanya langsung.
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating button */}
      <div
        onClick={() => setIsOpen((v) => !v)}
        className={`flex items-center justify-center rounded-full shadow-lg cursor-pointer ${bgColor} hover-elevate active-elevate-2`}
        style={{ width: 56, height: 56 }}
        title="Tanya AI Langsung — Gemini / Qwen"
        data-testid="button-open-ai-selector"
      >
        <Sparkles className="h-6 w-6 text-white" />
      </div>
    </div>
  );
}
