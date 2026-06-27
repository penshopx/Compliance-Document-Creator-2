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
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

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

const TOPICS = [
  { id: "profil", label: "Profil Organisasi", icon: Building2, keywords: ["karyawan", "badan usaha", "struktur", "pegawai", "karyawan", "perusahaan"] },
  { id: "risiko", label: "Bidang Usaha & Risiko", icon: Shield, keywords: ["risiko", "tender", "pemerintah", "pengadaan", "perizinan", "sektor", "bisnis"] },
  { id: "dokumen", label: "Dokumen Eksisting", icon: FolderOpen, keywords: ["dokumen", "iso", "sop", "kebijakan", "prosedur", "manual"] },
  { id: "sdm", label: "SDM & Kompetensi", icon: Users, keywords: ["sdm", "sumber daya", "compliance officer", "pelatihan", "pic", "staf", "karyawan"] },
  { id: "komitmen", label: "Komitmen Pimpinan", icon: Target, keywords: ["pimpinan", "direktur", "top management", "dukungan", "sponsor", "komitmen"] },
  { id: "timeline", label: "Target & Timeline", icon: Clock, keywords: ["target", "sertifikasi", "kapan", "timeline", "bulan", "tahun", "deadline"] },
];

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
  const [isReadyForBlueprint, setIsReadyForBlueprint] = useState(false);
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [isGeneratingBlueprint, setIsGeneratingBlueprint] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
    for (const topic of TOPICS) {
      if (topic.keywords.some(k => allText.includes(k))) {
        newCompleted.add(topic.id);
      }
    }
    setCompletedTopics(newCompleted);

    const lastAI = messages.filter(m => m.role === "assistant").slice(-1)[0];
    if (
      lastAI?.content.toLowerCase().includes("generate blueprint") ||
      lastAI?.content.toLowerCase().includes("blueprint smap anda") ||
      (newCompleted.size >= 5 && messages.length >= 10)
    ) {
      setIsReadyForBlueprint(true);
    }
  }, [messages]);

  const callChat = async (history: Message[]) => {
    const response = await fetch("/api/gustafta/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history, companyName: company?.name || "" }),
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
      const response = await fetch("/api/gustafta/blueprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, companyName: company?.name || "" }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Gagal generate blueprint");
      const data = await response.json();
      setBlueprint(data.blueprint);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      // Auto-save blueprint to DB (silent — no user action needed)
      fetch("/api/gustafta/blueprint/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blueprint: data.blueprint }),
        credentials: "include",
      }).catch(() => {});
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
            <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">Gustafta Dialog</h1>
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">Baru</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Pemetaan Blueprint Kebutuhan SMAP melalui Dialog Socratic</p>
            </div>
          </div>
          {isStarted && (
            <Button variant="outline" size="sm" onClick={resetDialog} data-testid="button-reset-dialog">
              <RotateCcw className="h-4 w-4 mr-2" />
              Mulai Ulang
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {!isStarted ? (
            /* Welcome screen */
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="max-w-lg text-center space-y-6">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mx-auto shadow-lg">
                  <MessageSquare className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">Selamat Datang di Gustafta Dialog</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Gustafta akan menggali profil, potensi, dan kebutuhan SMAP perusahaan Anda melalui{" "}
                    <strong>dialog Socratic</strong> — serangkaian pertanyaan reflektif yang menghasilkan{" "}
                    <strong>Blueprint SMAP</strong> yang dipersonalisasi.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-left">
                  {TOPICS.map(topic => {
                    const Icon = topic.icon;
                    return (
                      <div key={topic.id} className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                        <Icon className="h-4 w-4 text-blue-600 flex-none" />
                        <span className="text-sm font-medium text-blue-800">{topic.label}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="text-sm text-muted-foreground bg-amber-50 border border-amber-200 rounded-lg p-3 text-left">
                  <strong>Cara kerja:</strong> Gustafta akan mengajukan pertanyaan satu per satu. Jawab sejujur mungkin tentang kondisi perusahaan saat ini. Semakin detail jawaban Anda, semakin akurat blueprint yang dihasilkan.
                </div>
                <Button size="lg" onClick={startDialog} className="gap-2 w-full" data-testid="button-start-dialog">
                  <Sparkles className="h-5 w-5" />
                  Mulai Dialog Gustafta
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
                {TOPICS.map(topic => {
                  const done = completedTopics.has(topic.id);
                  const Icon = topic.icon;
                  return (
                    <div key={topic.id} className={cn(
                      "flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs",
                      done ? "bg-green-50 text-green-700" : "text-slate-400"
                    )}>
                      {done
                        ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600 flex-none" />
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
                    className="h-full bg-blue-600 rounded-full transition-all duration-700"
                    style={{ width: `${(completedTopics.size / TOPICS.length) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {completedTopics.size}/{TOPICS.length} area tergali
                </p>
              </div>
            </div>

            <div className="p-4 border-b">
              {isReadyForBlueprint || completedTopics.size >= 4 ? (
                <Button
                  onClick={generateBlueprint}
                  disabled={isGeneratingBlueprint}
                  className="w-full gap-2"
                  data-testid="button-generate-blueprint"
                >
                  {isGeneratingBlueprint ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Menyusun...</>
                  ) : (
                    <><Sparkles className="h-4 w-4" /> Generate Blueprint</>
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
              {blueprint && (
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
      {blueprint && (
        <div className="flex-none border-t bg-white max-h-[55vh] overflow-y-auto">
          <BlueprintPanel blueprint={blueprint} />
        </div>
      )}
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
