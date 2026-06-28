import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  MessageSquare, Send, Sparkles, CheckCircle2, Circle,
  AlertCircle, Loader2, FileText, ChevronRight, RotateCcw,
  Download, Building2, Shield, Target, Clock, Users, FolderOpen,
  ArrowRight, Scale, ClipboardList, BarChart3, BookOpen,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

type DialogMode = "smap" | "pancek";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Blueprint {
  profilRisiko: { level: string; skor: number; faktorUtama: string[] };
  kondisiEksisting: { kekuatan: string[]; kelemahan: string[]; peluang: string[] };
  dokumenPrioritas: Array<{ nama: string; klausul: string; prioritas: string }>;
  rekomendasiFase: { fase: string; alasan: string; estimasiWaktu: string };
  roadmap: Array<{ periode: string; kegiatan: string }>;
  kesimpulan: string;
  namaPerusahaan: string;
}

interface PancekBlueprint {
  tipeBadanUsaha: string;
  jumlahKaryawan: number;
  profilRisiko: { level: string; skor: number; faktorUtama: string[] };
  kondisiEksisting: { dokumenAda: string[]; dokumenBelum: string[]; kekuatan: string[]; gap: string[] };
  skorKesiapan: { komitmen: number; perencanaan: number; pelaksanaan: number; evaluasi: number; perbaikan: number; total: number };
  dokumenPrioritas: Array<{ kode: string; nama: string; prioritas: string }>;
  rekomendasiFase: { fase: string; alasan: string; estimasiWaktu: string };
  roadmap: Array<{ periode: string; fokus: string; kegiatan: string }>;
  kesimpulan: string;
  namaPerusahaan: string;
}

const SMAP_TOPICS = [
  { id: "profil", label: "Profil Organisasi", icon: Building2, keywords: ["karyawan", "badan usaha", "struktur", "pegawai", "karyawan", "perusahaan"] },
  { id: "risiko", label: "Bidang Usaha & Risiko", icon: Shield, keywords: ["risiko", "tender", "pemerintah", "pengadaan", "perizinan", "sektor", "bisnis"] },
  { id: "dokumen", label: "Dokumen Eksisting", icon: FolderOpen, keywords: ["dokumen", "iso", "sop", "kebijakan", "prosedur", "manual"] },
  { id: "sdm", label: "SDM & Kompetensi", icon: Users, keywords: ["sdm", "sumber daya", "compliance officer", "pelatihan", "pic", "staf", "karyawan"] },
  { id: "komitmen", label: "Komitmen Pimpinan", icon: Target, keywords: ["pimpinan", "direktur", "top management", "dukungan", "sponsor", "komitmen"] },
  { id: "timeline", label: "Target & Timeline", icon: Clock, keywords: ["target", "sertifikasi", "kapan", "timeline", "bulan", "tahun", "deadline"] },
];

const PANCEK_TOPICS = [
  { id: "profil", label: "Profil Perusahaan", icon: Building2, keywords: ["karyawan", "badan usaha", "swasta", "bumn", "bujk", "konstruksi"] },
  { id: "tipe", label: "Tipe Badan Usaha", icon: Scale, keywords: ["bumn", "bujk", "swasta", "persero", "konstruksi"] },
  { id: "fungsi_kepatuhan", label: "Fungsi Kepatuhan", icon: Shield, keywords: ["fungsi kepatuhan", "compliance", "fkap", "sk", "sertifikat api", "cco"] },
  { id: "dokumen", label: "Dokumen Existing", icon: FolderOpen, keywords: ["dokumen", "kebijakan", "deklarasi", "pakta", "wbs", "risk register"] },
  { id: "risiko", label: "Risiko Korupsi", icon: BarChart3, keywords: ["risiko", "korupsi", "pengadaan", "tender", "perizinan", "penyuapan"] },
  { id: "target", label: "Target Jaga.id", icon: ClipboardList, keywords: ["jaga.id", "kuesioner", "verifikasi", "terverifikasi", "target"] },
];

// Keep backward compat
const TOPICS = SMAP_TOPICS;

const RISK_COLORS: Record<string, string> = {
  "Rendah": "text-green-700 bg-green-50 border-green-200",
  "Sedang": "text-yellow-700 bg-yellow-50 border-yellow-200",
  "Tinggi": "text-orange-700 bg-orange-50 border-orange-200",
  "Sangat Tinggi": "text-red-700 bg-red-50 border-red-200",
};

const PRIORITY_BADGE: Record<string, string> = {
  "Kritis": "bg-red-100 text-red-700 border-red-200",
  "Tinggi": "bg-orange-100 text-orange-700 border-orange-200",
  "Sedang": "bg-yellow-100 text-yellow-700 border-yellow-200",
};

export default function GustafdaDialog() {
  const [mode, setMode] = useState<DialogMode>("smap");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
  const [isReadyForBlueprint, setIsReadyForBlueprint] = useState(false);
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [pancekBlueprint, setPancekBlueprint] = useState<PancekBlueprint | null>(null);
  const [isGeneratingBlueprint, setIsGeneratingBlueprint] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const activeTopics = mode === "pancek" ? PANCEK_TOPICS : SMAP_TOPICS;

  const { data: company } = useQuery<{ name?: string }>({
    queryKey: ["/api/company"],
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (messages.length < 4) return;
    const allText = messages.map(m => m.content.toLowerCase()).join(" ");
    const newCompleted = new Set<string>();
    for (const topic of activeTopics) {
      if (topic.keywords.some(k => allText.includes(k))) {
        newCompleted.add(topic.id);
      }
    }
    setCompletedTopics(newCompleted);

    const lastAI = messages.filter(m => m.role === "assistant").slice(-1)[0];
    if (
      lastAI?.content.toLowerCase().includes("generate blueprint") ||
      lastAI?.content.toLowerCase().includes("blueprint smap anda") ||
      lastAI?.content.toLowerCase().includes("blueprint pancek") ||
      (newCompleted.size >= 4 && messages.length >= 8)
    ) {
      setIsReadyForBlueprint(true);
    }
  }, [messages, activeTopics]);

  const callChat = async (history: Message[]) => {
    const response = await fetch("/api/gustafta/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history, companyName: company?.name || "", mode }),
      credentials: "include",
    });
    if (!response.ok) throw new Error("Gagal terhubung ke Gustafta");

    let text = "";
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                text += data.content;
                setMessages(prev => {
                  const updated = [...prev];
                  if (updated[updated.length - 1]?.role === "assistant") {
                    updated[updated.length - 1] = { role: "assistant", content: text };
                  }
                  return updated;
                });
              }
            } catch {}
          }
        }
      }
    }
    return text;
  };

  const startDialog = async () => {
    setIsStarted(true);
    setIsLoading(true);
    setMessages([{ role: "assistant", content: "" }]);
    try {
      await callChat([]);
    } catch {
      toast({ title: "Error", description: "Gagal memulai dialog Gustafta.", variant: "destructive" });
      setIsStarted(false);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setInput("");
    const withUser: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages([...withUser, { role: "assistant", content: "" }]);
    setIsLoading(true);
    try {
      await callChat(withUser);
    } catch {
      toast({ title: "Error", description: "Gagal mengirim pesan.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const generateBlueprint = async () => {
    setIsGeneratingBlueprint(true);
    try {
      const endpoint = mode === "pancek" ? "/api/gustafta/pancek-blueprint" : "/api/gustafta/blueprint";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, companyName: company?.name || "" }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Gagal generate blueprint");
      const data = await response.json();
      if (mode === "pancek") {
        setPancekBlueprint(data.blueprint);
      } else {
        setBlueprint(data.blueprint);
        // Auto-save SMAP blueprint to DB
        fetch("/api/gustafta/blueprint/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ blueprint: data.blueprint }),
          credentials: "include",
        }).catch(() => {});
      }
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch {
      toast({ title: "Error", description: "Gagal menghasilkan blueprint. Coba lagi.", variant: "destructive" });
    } finally {
      setIsGeneratingBlueprint(false);
    }
  };

  const resetDialog = () => {
    setMessages([]);
    setInput("");
    setIsStarted(false);
    setCompletedTopics(new Set());
    setIsReadyForBlueprint(false);
    setBlueprint(null);
    setPancekBlueprint(null);
  };

  const switchMode = (newMode: DialogMode) => {
    setMode(newMode);
    resetDialog();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="flex-none border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", mode === "pancek" ? "bg-emerald-600" : "bg-blue-600")}>
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">Gustafta Dialog</h1>
                <Badge className={cn("border-0 text-xs", mode === "pancek" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700")}>
                  {mode === "pancek" ? "Pancek KPK" : "SMAP ISO 37001"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {mode === "pancek"
                  ? "Pemetaan Blueprint Kesiapan Pancek KPK & Kuesioner Jaga.id"
                  : "Pemetaan Blueprint Kebutuhan SMAP melalui Dialog Socratic"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isStarted && (
              <div className="flex rounded-lg border overflow-hidden">
                <button
                  onClick={() => switchMode("smap")}
                  className={cn("px-3 py-1.5 text-xs font-medium transition-colors", mode === "smap" ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50")}
                  data-testid="button-mode-smap"
                >
                  SMAP
                </button>
                <button
                  onClick={() => switchMode("pancek")}
                  className={cn("px-3 py-1.5 text-xs font-medium transition-colors", mode === "pancek" ? "bg-emerald-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50")}
                  data-testid="button-mode-pancek"
                >
                  Pancek KPK
                </button>
              </div>
            )}
            {isStarted && (
              <Button variant="outline" size="sm" onClick={resetDialog} data-testid="button-reset-dialog">
                <RotateCcw className="h-4 w-4 mr-2" />
                Mulai Ulang
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {!isStarted ? (
            /* Welcome screen */
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="max-w-lg text-center space-y-6">
                <div className={cn("h-20 w-20 rounded-2xl flex items-center justify-center mx-auto shadow-lg", mode === "pancek" ? "bg-gradient-to-br from-emerald-600 to-teal-600" : "bg-gradient-to-br from-blue-600 to-cyan-600")}>
                  <MessageSquare className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">
                    {mode === "pancek" ? "Gustafta Dialog — Pancek KPK" : "Selamat Datang di Gustafta Dialog"}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {mode === "pancek" ? (
                      <>Gustafta akan menggali profil dan kesiapan perusahaan Anda untuk <strong>pengisian kuesioner Jaga.id</strong> — menghasilkan <strong>Blueprint Pancek</strong> dengan daftar dokumen lampiran yang harus disiapkan.</>
                    ) : (
                      <>Gustafta akan menggali profil, potensi, dan kebutuhan SMAP perusahaan Anda melalui <strong>dialog Socratic</strong> — menghasilkan <strong>Blueprint SMAP</strong> yang dipersonalisasi.</>
                    )}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-left">
                  {activeTopics.map(topic => {
                    const Icon = topic.icon;
                    return (
                      <div key={topic.id} className={cn("flex items-center gap-2 p-3 border rounded-lg", mode === "pancek" ? "bg-emerald-50 border-emerald-100" : "bg-blue-50 border-blue-100")}>
                        <Icon className={cn("h-4 w-4 flex-none", mode === "pancek" ? "text-emerald-600" : "text-blue-600")} />
                        <span className={cn("text-sm font-medium", mode === "pancek" ? "text-emerald-800" : "text-blue-800")}>{topic.label}</span>
                      </div>
                    );
                  })}
                </div>
                {mode === "pancek" && (
                  <div className="text-sm bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-left">
                    <strong className="text-emerald-700">📋 Output Blueprint Pancek:</strong>
                    <ul className="mt-1.5 space-y-0.5 text-muted-foreground">
                      <li>• Skor kesiapan per dimensi PDCAR</li>
                      <li>• Daftar 18 dokumen lampiran yang harus disiapkan</li>
                      <li>• Roadmap pengisian kuesioner Jaga.id (minggu per minggu)</li>
                      <li>• Rekomendasi fase: Siap Pengisian / Terverifikasi / Surveilance</li>
                    </ul>
                  </div>
                )}
                {mode === "smap" && (
                  <div className="text-sm text-muted-foreground bg-amber-50 border border-amber-200 rounded-lg p-3 text-left">
                    <strong>Cara kerja:</strong> Gustafta akan mengajukan pertanyaan satu per satu. Jawab sejujur mungkin tentang kondisi perusahaan saat ini. Semakin detail jawaban Anda, semakin akurat blueprint yang dihasilkan.
                  </div>
                )}
                <Button
                  size="lg"
                  onClick={startDialog}
                  className={cn("gap-2 w-full", mode === "pancek" ? "bg-emerald-600 hover:bg-emerald-700" : "")}
                  data-testid="button-start-dialog"
                >
                  <Sparkles className="h-5 w-5" />
                  {mode === "pancek" ? "Mulai Dialog Pancek KPK" : "Mulai Dialog Gustafta"}
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4 max-w-2xl mx-auto">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center flex-none text-xs font-bold",
                        msg.role === "assistant"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-200 text-slate-600"
                      )}>
                        {msg.role === "assistant" ? "G" : "A"}
                      </div>
                      <div className={cn(
                        "max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                        msg.role === "assistant"
                          ? "bg-white border shadow-sm text-slate-800"
                          : "bg-blue-600 text-white"
                      )}>
                        {msg.content ? (
                          <span className="whitespace-pre-wrap">{msg.content}</span>
                        ) : isLoading && idx === messages.length - 1 ? (
                          <span className="flex gap-1 py-1">
                            <span className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" />
                            <span className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                            <span className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input area */}
              <div className="flex-none border-t bg-white p-4">
                <div className="max-w-2xl mx-auto flex gap-3 items-end">
                  <Textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ketik jawaban Anda... (Enter untuk kirim, Shift+Enter untuk baris baru)"
                    className="resize-none min-h-[52px] max-h-[120px]"
                    disabled={isLoading}
                    data-testid="input-gustafta-message"
                    rows={2}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                    className="h-[52px] px-4 flex-none"
                    data-testid="button-gustafta-send"
                  >
                    {isLoading
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <Send className="h-4 w-4" />
                    }
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right sidebar — progress + generate button */}
        {isStarted && (
          <div className="w-64 flex-none border-l bg-white flex flex-col">
            <div className="p-4 border-b">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Progress Dialog</h3>
              <div className="space-y-1.5">
                {activeTopics.map(topic => {
                  const done = completedTopics.has(topic.id);
                  const Icon = topic.icon;
                  return (
                    <div key={topic.id} className={cn(
                      "flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs",
                      done ? (mode === "pancek" ? "bg-emerald-50 text-emerald-700" : "bg-green-50 text-green-700") : "text-slate-400"
                    )}>
                      {done
                        ? <CheckCircle2 className={cn("h-3.5 w-3.5 flex-none", mode === "pancek" ? "text-emerald-600" : "text-green-600")} />
                        : <Circle className="h-3.5 w-3.5 flex-none" />
                      }
                      <Icon className="h-3 w-3 flex-none" />
                      <span className="font-medium">{topic.label}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3">
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-700", mode === "pancek" ? "bg-emerald-600" : "bg-blue-600")}
                    style={{ width: `${(completedTopics.size / activeTopics.length) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {completedTopics.size}/{activeTopics.length} area tergali
                </p>
              </div>
            </div>

            <div className="p-4 border-b">
              {isReadyForBlueprint || completedTopics.size >= 4 ? (
                <Button
                  onClick={generateBlueprint}
                  disabled={isGeneratingBlueprint}
                  className={cn("w-full gap-2", mode === "pancek" ? "bg-emerald-600 hover:bg-emerald-700" : "")}
                  data-testid="button-generate-blueprint"
                >
                  {isGeneratingBlueprint ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Menyusun...</>
                  ) : (
                    <><Sparkles className="h-4 w-4" /> {mode === "pancek" ? "Generate Blueprint Pancek" : "Generate Blueprint"}</>
                  )}
                </Button>
              ) : (
                <div className="text-center p-3 bg-slate-50 rounded-lg border border-dashed">
                  <AlertCircle className="h-5 w-5 text-slate-300 mx-auto mb-1" />
                  <p className="text-xs text-slate-400 leading-snug">
                    Lanjutkan dialog hingga area tergali cukup
                  </p>
                </div>
              )}
              {(blueprint || pancekBlueprint) && (
                <p className="text-xs text-green-600 text-center mt-2 font-medium">✓ Blueprint tersedia di bawah</p>
              )}
            </div>

            <div className="p-4 flex-1">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Panduan</h4>
              <ul className="space-y-2">
                {[
                  "Jawab sejujur mungkin tentang kondisi perusahaan saat ini",
                  "Tidak perlu formal — percakapan natural lebih baik",
                  "Blueprint akan semakin akurat dengan informasi yang lengkap",
                ].map((tip, i) => (
                  <li key={i} className="flex gap-1.5 text-xs text-slate-500">
                    <ChevronRight className="h-3 w-3 mt-0.5 flex-none text-blue-400" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Blueprint panel */}
      {blueprint && mode === "smap" && (
        <div className="flex-none border-t bg-white max-h-[55vh] overflow-y-auto">
          <BlueprintPanel blueprint={blueprint} />
        </div>
      )}
      {pancekBlueprint && mode === "pancek" && (
        <div className="flex-none border-t bg-white max-h-[55vh] overflow-y-auto">
          <PancekBlueprintPanel blueprint={pancekBlueprint} />
        </div>
      )}
    </div>
  );
}

function PancekBlueprintPanel({ blueprint }: { blueprint: PancekBlueprint }) {
  const riskClass = RISK_COLORS[blueprint.profilRisiko.level] || RISK_COLORS["Sedang"];
  const riskTextClass = riskClass.split(" ")[0];

  const SCORE_LABELS: Record<string, string> = {
    komitmen: "K — Komitmen", perencanaan: "P — Perencanaan",
    pelaksanaan: "D — Pelaksanaan", evaluasi: "C — Evaluasi", perbaikan: "A — Perbaikan",
  };
  const scoreEntries = Object.entries(SCORE_LABELS);

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-emerald-600 flex items-center justify-center">
            <ClipboardList className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Blueprint Pancek KPK</h2>
            <p className="text-sm text-muted-foreground">{blueprint.namaPerusahaan} · {blueprint.tipeBadanUsaha}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.print()} data-testid="button-print-pancek-blueprint">
          <Download className="h-4 w-4 mr-2" />Print / Save PDF
        </Button>
      </div>

      <Separator />

      {/* Cards row */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Risk */}
        <Card className={cn("border", riskClass.split(" ").slice(2).join(" "))}>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Profil Risiko Korupsi</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className={cn("text-2xl font-bold mb-0.5", riskTextClass)}>{blueprint.profilRisiko.level}</div>
            <div className="text-sm text-muted-foreground mb-2">Skor: {blueprint.profilRisiko.skor}/10</div>
            {blueprint.profilRisiko.faktorUtama.slice(0, 3).map((f, i) => (
              <div key={i} className="text-xs text-slate-600 flex gap-1.5"><span className="text-slate-400">•</span><span>{f}</span></div>
            ))}
          </CardContent>
        </Card>

        {/* Recommended phase */}
        <Card className="border-emerald-200 bg-emerald-50">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Rekomendasi Fase Pancek</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-base font-bold text-emerald-700 leading-tight mb-1">{blueprint.rekomendasiFase.fase}</div>
            <div className="text-sm font-semibold text-emerald-600 mb-2">{blueprint.rekomendasiFase.estimasiWaktu}</div>
            <p className="text-xs text-slate-600 leading-relaxed">{blueprint.rekomendasiFase.alasan}</p>
          </CardContent>
        </Card>

        {/* Readiness score */}
        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Skor Kesiapan PDCAR</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-1.5">
            {scoreEntries.map(([key, label]) => {
              const score = blueprint.skorKesiapan[key as keyof typeof blueprint.skorKesiapan] as number;
              return (
                <div key={key}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-slate-600">{label}</span>
                    <span className="font-semibold text-slate-700">{score}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", score >= 70 ? "bg-emerald-500" : score >= 40 ? "bg-yellow-500" : "bg-red-400")} style={{ width: `${score}%` }} />
                  </div>
                </div>
              );
            })}
            <div className="pt-1 border-t text-xs flex justify-between">
              <span className="font-semibold text-slate-700">Total Kesiapan</span>
              <span className="font-bold text-emerald-700">{blueprint.skorKesiapan.total}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kondisi Existing */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-green-100">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-semibold text-green-600 uppercase tracking-wide">Dokumen yang Sudah Ada</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {blueprint.kondisiEksisting.dokumenAda.length === 0
              ? <p className="text-xs text-slate-400">Belum ada dokumen Pancek</p>
              : blueprint.kondisiEksisting.dokumenAda.map((d, i) => (
                <div key={i} className="text-xs text-slate-600 flex gap-1.5 mb-0.5"><span className="text-green-500">✓</span><span>{d}</span></div>
              ))}
          </CardContent>
        </Card>
        <Card className="border-red-100">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-semibold text-red-600 uppercase tracking-wide">Dokumen yang Masih Harus Dibuat</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {blueprint.kondisiEksisting.dokumenBelum.map((d, i) => (
              <div key={i} className="text-xs text-slate-600 flex gap-1.5 mb-0.5"><span className="text-red-400">△</span><span>{d}</span></div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Priority documents */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Dokumen Prioritas (Lampiran Jaga.id)</h3>
        <div className="grid md:grid-cols-2 gap-2">
          {blueprint.dokumenPrioritas.map((doc, i) => (
            <div key={i} className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg border">
              <Badge className={cn("text-xs flex-none border font-mono", PRIORITY_BADGE[doc.prioritas] || PRIORITY_BADGE["Sedang"])} variant="outline">
                {doc.kode}
              </Badge>
              <div>
                <div className="text-sm font-medium text-slate-800">{doc.nama}</div>
                <Badge className={cn("text-xs mt-0.5", PRIORITY_BADGE[doc.prioritas] || PRIORITY_BADGE["Sedang"])} variant="outline">{doc.prioritas}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Roadmap Pengisian Kuesioner Jaga.id</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {blueprint.roadmap.map((step, i) => (
            <div key={i} className="flex-none w-52 p-3 bg-gradient-to-b from-emerald-50 to-white rounded-lg border border-emerald-100">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="h-5 w-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold flex-none">{i + 1}</div>
                <div className="text-xs font-bold text-emerald-700">{step.periode}</div>
              </div>
              <div className="text-xs font-semibold text-emerald-800 mb-1">{step.fokus}</div>
              <div className="text-xs text-slate-600 leading-relaxed">{step.kegiatan}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Conclusion */}
      <Card className="bg-gradient-to-r from-slate-50 to-emerald-50 border-emerald-100">
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-600" />Kesimpulan
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">{blueprint.kesimpulan}</p>
        </CardContent>
      </Card>

      {/* CTA: Go to Pancek Collab */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5" />
              <h3 className="text-base font-bold">Lanjutkan ke Gustafta Collab — Mode Pancek</h3>
            </div>
            <p className="text-sm text-emerald-100 leading-relaxed mb-1">
              Blueprint Pancek Anda sudah tersimpan. Di Collab, pilih mode <strong>Pancek KPK</strong> — sub-agen spesialis siap membantu menyiapkan setiap lampiran dokumen yang dibutuhkan kuesioner Jaga.id.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {blueprint.dokumenPrioritas.slice(0, 3).map((d, i) => (
                <span key={i} className="text-xs bg-white/20 rounded-full px-2.5 py-0.5">{d.kode}: {d.nama}</span>
              ))}
              {blueprint.dokumenPrioritas.length > 3 && (
                <span className="text-xs bg-white/20 rounded-full px-2.5 py-0.5">+{blueprint.dokumenPrioritas.length - 3} lainnya</span>
              )}
            </div>
          </div>
          <Link href="/gustafta-collab" className="flex-none">
            <Button className="bg-white text-emerald-600 hover:bg-emerald-50 gap-2 font-semibold whitespace-nowrap" size="lg">
              Buka Collab Pancek<ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function BlueprintPanel({ blueprint }: { blueprint: Blueprint }) {
  const riskClass = RISK_COLORS[blueprint.profilRisiko.level] || RISK_COLORS["Sedang"];
  const riskTextClass = riskClass.split(" ")[0];

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Blueprint header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Blueprint SMAP</h2>
            <p className="text-sm text-muted-foreground">{blueprint.namaPerusahaan}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.print()} data-testid="button-print-blueprint">
          <Download className="h-4 w-4 mr-2" />
          Print / Save PDF
        </Button>
      </div>

      <Separator />

      {/* Cards row */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Risk profile */}
        <Card className={cn("border", riskClass.split(" ").slice(2).join(" "))}>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Profil Risiko Penyuapan
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className={cn("text-2xl font-bold mb-0.5", riskTextClass)}>
              {blueprint.profilRisiko.level}
            </div>
            <div className="text-sm text-muted-foreground mb-2">Skor: {blueprint.profilRisiko.skor}/10</div>
            <ul className="space-y-1">
              {blueprint.profilRisiko.faktorUtama.slice(0, 3).map((f, i) => (
                <li key={i} className="text-xs text-slate-600 flex gap-1.5">
                  <span className="text-slate-400">•</span><span>{f}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Recommended phase */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Rekomendasi Fase
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-base font-bold text-blue-700 leading-tight mb-1">
              {blueprint.rekomendasiFase.fase}
            </div>
            <div className="text-sm font-semibold text-blue-600 mb-2">
              {blueprint.rekomendasiFase.estimasiWaktu}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {blueprint.rekomendasiFase.alasan}
            </p>
          </CardContent>
        </Card>

        {/* Current state */}
        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Kondisi Saat Ini
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-2">
            <div>
              <div className="text-xs font-semibold text-green-600 mb-1">Kekuatan</div>
              {blueprint.kondisiEksisting.kekuatan.slice(0, 2).map((k, i) => (
                <div key={i} className="text-xs text-slate-600">✓ {k}</div>
              ))}
            </div>
            <div>
              <div className="text-xs font-semibold text-orange-600 mb-1">Gap Utama</div>
              {blueprint.kondisiEksisting.kelemahan.slice(0, 2).map((k, i) => (
                <div key={i} className="text-xs text-slate-600">△ {k}</div>
              ))}
            </div>
            {blueprint.kondisiEksisting.peluang.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-blue-600 mb-1">Peluang</div>
                {blueprint.kondisiEksisting.peluang.slice(0, 2).map((p, i) => (
                  <div key={i} className="text-xs text-slate-600">→ {p}</div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Priority documents */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Dokumen Prioritas</h3>
        <div className="grid md:grid-cols-2 gap-2">
          {blueprint.dokumenPrioritas.map((doc, i) => (
            <div key={i} className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg border">
              <Badge
                className={cn("text-xs flex-none border", PRIORITY_BADGE[doc.prioritas] || PRIORITY_BADGE["Sedang"])}
                variant="outline"
              >
                {doc.prioritas}
              </Badge>
              <div>
                <div className="text-sm font-medium text-slate-800">{doc.nama}</div>
                <div className="text-xs text-muted-foreground">{doc.klausul}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Roadmap Implementasi</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {blueprint.roadmap.map((step, i) => (
            <div key={i} className="flex-none w-52 p-3 bg-gradient-to-b from-blue-50 to-white rounded-lg border border-blue-100">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="h-5 w-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold flex-none">
                  {i + 1}
                </div>
                <div className="text-xs font-bold text-blue-700">{step.periode}</div>
              </div>
              <div className="text-xs text-slate-600 leading-relaxed">{step.kegiatan}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Conclusion */}
      <Card className="bg-gradient-to-r from-slate-50 to-blue-50 border-blue-100">
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            Kesimpulan
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">{blueprint.kesimpulan}</p>
        </CardContent>
      </Card>

      {/* CTA: Go to Collab */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5" />
              <h3 className="text-base font-bold">Lanjutkan ke Gustafta Collab</h3>
            </div>
            <p className="text-sm text-blue-100 leading-relaxed mb-1">
              Blueprint Anda telah tersimpan. Gustafta Collab akan membaca profil risiko dan dokumen prioritas dari blueprint ini — sub-agen spesialis siap membantu Anda membuat setiap dokumen SMAP tanpa perlu mengulang informasi perusahaan.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {blueprint.dokumenPrioritas.slice(0, 3).map((d, i) => (
                <span key={i} className="text-xs bg-white/20 rounded-full px-2.5 py-0.5">
                  {d.nama}
                </span>
              ))}
              {blueprint.dokumenPrioritas.length > 3 && (
                <span className="text-xs bg-white/20 rounded-full px-2.5 py-0.5">
                  +{blueprint.dokumenPrioritas.length - 3} lainnya
                </span>
              )}
            </div>
          </div>
          <Link href="/gustafta-collab" className="flex-none">
            <Button className="bg-white text-blue-600 hover:bg-blue-50 gap-2 font-semibold whitespace-nowrap" size="lg">
              Buka Collab
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
