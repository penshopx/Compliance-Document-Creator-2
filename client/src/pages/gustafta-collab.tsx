import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  FileText, CheckCircle2, Circle, Send, Loader2, RotateCcw,
  Sparkles, ExternalLink, ChevronRight, Users, ClipboardCheck,
  Award, RefreshCw, BookOpen, Zap, MessageSquare,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

type AgentKey = "dokumen" | "internal" | "eksternal" | "surveilance";
interface Message { role: "user" | "assistant"; content: string; }

const AGENTS: Array<{
  key: AgentKey;
  label: string;
  fase: string;
  icon: typeof FileText;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeColor: string;
  opening: string;
  suggestions: string[];
  tasks: Array<{ label: string; klausul: string; done?: boolean }>;
  quickLinks: Array<{ label: string; url: string; icon: typeof FileText }>;
}> = [
  {
    key: "dokumen",
    label: "Agen Dokumen",
    fase: "Siap Dokumen SMAP",
    icon: FileText,
    color: "text-blue-700",
    bgColor: "bg-blue-600",
    borderColor: "border-blue-200",
    badgeColor: "bg-blue-100 text-blue-700",
    opening: "Halo! Saya Gustafta — Agen Dokumen SMAP. Saya siap membantu Anda menyiapkan seluruh dokumentasi wajib SNI ISO 37001:2016.\n\nDokumen apa yang ingin kita kerjakan terlebih dahulu? Atau jika Anda belum tahu harus mulai dari mana, saya bisa membantu membuat daftar prioritas dokumen berdasarkan kondisi perusahaan Anda saat ini.",
    suggestions: [
      "Buatkan outline Pedoman SMAP",
      "Jelaskan persyaratan Kebijakan Anti Penyuapan (Klausul 5.2)",
      "Apa saja dokumen wajib untuk fase Siap Dokumen?",
      "Bantu saya membuat Register Risiko Penyuapan",
      "Bagaimana struktur SOP Whistleblowing yang baik?",
    ],
    tasks: [
      { label: "Pedoman SMAP / Manual ABMS", klausul: "Klausul 4-10" },
      { label: "Kebijakan Anti Penyuapan", klausul: "Klausul 5.2" },
      { label: "SK Penetapan Tim FKAP", klausul: "Klausul 5.3.2" },
      { label: "Register Risiko Penyuapan", klausul: "Klausul 6.1" },
      { label: "Sasaran Anti Penyuapan", klausul: "Klausul 6.2" },
      { label: "Program Awareness & Pelatihan", klausul: "Klausul 7.2-7.3" },
      { label: "Prosedur Uji Tuntas Mitra Bisnis", klausul: "Klausul 8.2" },
      { label: "Prosedur Pengelolaan Gratifikasi", klausul: "Klausul 8.7" },
      { label: "Prosedur Donasi & Kontribusi Politik", klausul: "Klausul 8.8" },
      { label: "SOP Whistleblowing & Pelaporan", klausul: "Klausul 8.9" },
    ],
    quickLinks: [
      { label: "Template Repository", url: "/template-repository", icon: BookOpen },
      { label: "Document Builder", url: "/document-builder", icon: FileText },
      { label: "PDCA Generator", url: "/pdca", icon: Zap },
    ],
  },
  {
    key: "internal",
    label: "Agen Audit Internal",
    fase: "Siap Audit Internal",
    icon: ClipboardCheck,
    color: "text-emerald-700",
    bgColor: "bg-emerald-600",
    borderColor: "border-emerald-200",
    badgeColor: "bg-emerald-100 text-emerald-700",
    opening: "Halo! Saya Gustafta — Agen Audit Internal. Saya membantu Anda mempersiapkan dan menjalankan audit internal SMAP yang efektif.\n\nApakah Anda sedang berperan sebagai auditor yang perlu menyiapkan program audit, atau sebagai auditee yang perlu berlatih menghadapi pertanyaan audit?",
    suggestions: [
      "Buatkan checklist audit klausul 5 (Kepemimpinan)",
      "Simulasikan pertanyaan auditor untuk klausul 8.2",
      "Bagaimana cara menulis temuan NCR yang baik?",
      "Bantu buat Program Audit Internal Tahunan",
      "Apa perbedaan NCR Major dan Minor?",
    ],
    tasks: [
      { label: "Prosedur Audit Internal", klausul: "Klausul 9.2" },
      { label: "Program Audit Internal Tahunan", klausul: "Klausul 9.2" },
      { label: "Checklist Audit per Klausul (10 klausul)", klausul: "Klausul 4-10" },
      { label: "Formulir Temuan Audit (NCR Form)", klausul: "Klausul 9.2" },
      { label: "Laporan Hasil Audit Internal", klausul: "Klausul 9.2" },
      { label: "Log Tindakan Korektif (CAPA Log)", klausul: "Klausul 10.1" },
      { label: "Bukti Penyelesaian Temuan", klausul: "Klausul 10.1" },
      { label: "Laporan Tinjauan Manajemen", klausul: "Klausul 9.3" },
    ],
    quickLinks: [
      { label: "Checklist SMAP", url: "/smap-checklist", icon: ClipboardCheck },
      { label: "Tim Audit Internal", url: "/audit-internal", icon: Users },
      { label: "PDCA Generator", url: "/pdca", icon: Zap },
    ],
  },
  {
    key: "eksternal",
    label: "Agen Sertifikasi",
    fase: "Siap Audit Eksternal",
    icon: Award,
    color: "text-purple-700",
    bgColor: "bg-purple-600",
    borderColor: "border-purple-200",
    badgeColor: "bg-purple-100 text-purple-700",
    opening: "Halo! Saya Gustafta — Agen Sertifikasi. Saya membantu Anda mempersiapkan diri untuk audit eksternal dan meraih sertifikat SNI ISO 37001:2016.\n\nSebaiknya kita mulai dengan Gap Analysis — memetakan seberapa siap perusahaan Anda. Apakah sudah ada dokumen SMAP yang selesai? Atau ingin saya simulasikan pertanyaan audit Stage 1 terlebih dahulu?",
    suggestions: [
      "Lakukan Gap Analysis kesiapan sertifikasi saya",
      "Simulasikan audit Stage 1 (document review)",
      "Apa saja yang dicari auditor eksternal di klausul 5?",
      "Bantu buat Matriks Pemenuhan Klausul",
      "Rekomendasi lembaga sertifikasi ISO 37001 di Indonesia",
    ],
    tasks: [
      { label: "Checklist Kesiapan Sertifikasi", klausul: "Semua Klausul" },
      { label: "Matriks Pemenuhan Klausul 4-10", klausul: "Klausul 4-10" },
      { label: "Daftar Bukti Implementasi per Klausul", klausul: "Klausul 4-10" },
      { label: "Daftar Personil untuk Wawancara", klausul: "Klausul 5.3" },
      { label: "Jadwal Audit Sertifikasi Stage 1 & 2", klausul: "Proses CB" },
      { label: "Template Tanggapan Temuan CB", klausul: "Klausul 10.1" },
      { label: "Surat Pernyataan Komitmen Manajemen", klausul: "Klausul 5.1" },
      { label: "Profil Perusahaan untuk Lembaga Sertifikasi", klausul: "Klausul 4.1-4.2" },
    ],
    quickLinks: [
      { label: "Produk Siap SMAP", url: "/produk-siap", icon: Award },
      { label: "Referensi Dokumen", url: "/smap-reference", icon: BookOpen },
      { label: "Template Repository", url: "/template-repository", icon: BookOpen },
    ],
  },
  {
    key: "surveilance",
    label: "Agen Surveilance",
    fase: "Siap Surveilance",
    icon: RefreshCw,
    color: "text-orange-700",
    bgColor: "bg-orange-600",
    borderColor: "border-orange-200",
    badgeColor: "bg-orange-100 text-orange-700",
    opening: "Halo! Saya Gustafta — Agen Surveilance. Saya membantu Anda menjaga sertifikat SNI ISO 37001:2016 tetap efektif melalui monitoring berkelanjutan.\n\nUntuk membantu dengan tepat, boleh saya tahu: kapan sertifikat SMAP Anda diperoleh? Dan kapan jadwal audit surveilance berikutnya?",
    suggestions: [
      "Bantu buat KPI monitoring SMAP tahunan",
      "Apa saja yang diperiksa di audit surveilance?",
      "Bantu buat Laporan Kinerja SMAP tahunan",
      "Bagaimana mengelola insiden penyuapan yang dilaporkan?",
      "Persiapan re-sertifikasi 3 tahunan",
    ],
    tasks: [
      { label: "Laporan Kinerja SMAP Tahunan", klausul: "Klausul 9.1" },
      { label: "Update Register Risiko (revisi tahunan)", klausul: "Klausul 6.1" },
      { label: "Bukti Perbaikan Berkelanjutan", klausul: "Klausul 10.2" },
      { label: "Statistik Pelaporan Pelanggaran", klausul: "Klausul 8.9" },
      { label: "Analisis Tren Kepatuhan", klausul: "Klausul 9.1" },
      { label: "Dokumen Review Manajemen Tahunan", klausul: "Klausul 9.3" },
      { label: "Rencana Surveilance", klausul: "Klausul 9.2" },
      { label: "Dokumen Persiapan Re-sertifikasi", klausul: "Siklus 3 Tahun" },
    ],
    quickLinks: [
      { label: "Checklist SMAP", url: "/smap-checklist", icon: ClipboardCheck },
      { label: "PDCA Generator", url: "/pdca", icon: Zap },
      { label: "Referensi Dokumen", url: "/smap-reference", icon: BookOpen },
    ],
  },
];

export default function GustafdaCollab() {
  const [activeAgent, setActiveAgent] = useState<AgentKey>("dokumen");
  const [sessionMessages, setSessionMessages] = useState<Record<AgentKey, Message[]>>({
    dokumen: [], internal: [], eksternal: [], surveilance: [],
  });
  const [checkedTasks, setCheckedTasks] = useState<Record<AgentKey, Set<number>>>({
    dokumen: new Set(), internal: new Set(), eksternal: new Set(), surveilance: new Set(),
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStarted, setIsStarted] = useState<Record<AgentKey, boolean>>({
    dokumen: false, internal: false, eksternal: false, surveilance: false,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { data: company } = useQuery<{ name?: string }>({ queryKey: ["/api/company"] });

  const agent = AGENTS.find(a => a.key === activeAgent)!;
  const messages = sessionMessages[activeAgent];
  const AgentIcon = agent.icon;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessionMessages, isLoading, activeAgent]);

  useEffect(() => {
    setInput("");
  }, [activeAgent]);

  const startAgent = async () => {
    setIsStarted(prev => ({ ...prev, [activeAgent]: true }));
    const openingMsg: Message = { role: "assistant", content: agent.opening };
    setSessionMessages(prev => ({ ...prev, [activeAgent]: [openingMsg] }));
  };

  const callCollab = async (history: Message[]) => {
    const response = await fetch("/api/gustafta/collab", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: history,
        agent: activeAgent,
        companyName: company?.name || "",
      }),
      credentials: "include",
    });
    if (!response.ok) throw new Error("Gagal terhubung");

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
                setSessionMessages(prev => {
                  const updated = [...prev[activeAgent]];
                  updated[updated.length - 1] = { role: "assistant", content: text };
                  return { ...prev, [activeAgent]: updated };
                });
              }
            } catch {}
          }
        }
      }
    }
    return text;
  };

  const sendMessage = async (messageText?: string) => {
    const userText = (messageText || input).trim();
    if (!userText || isLoading) return;
    setInput("");

    const withUser: Message[] = [...messages, { role: "user", content: userText }];
    setSessionMessages(prev => ({
      ...prev,
      [activeAgent]: [...withUser, { role: "assistant", content: "" }],
    }));
    setIsLoading(true);

    try {
      await callCollab(withUser);
    } catch {
      toast({ title: "Error", description: "Gagal mengirim pesan.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const resetAgent = () => {
    setIsStarted(prev => ({ ...prev, [activeAgent]: false }));
    setSessionMessages(prev => ({ ...prev, [activeAgent]: [] }));
    setInput("");
  };

  const toggleTask = (agentKey: AgentKey, idx: number) => {
    setCheckedTasks(prev => {
      const updated = new Set(prev[agentKey]);
      if (updated.has(idx)) updated.delete(idx);
      else updated.add(idx);
      return { ...prev, [agentKey]: updated };
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const completedCount = checkedTasks[activeAgent].size;
  const totalTasks = agent.tasks.length;

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="flex-none border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", agent.bgColor)}>
              <AgentIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">Gustafta Collab</h1>
                <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">Multi-Agent</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Implementasi SMAP bersama 4 Agen AI Spesialis</p>
            </div>
          </div>
          {isStarted[activeAgent] && (
            <Button variant="outline" size="sm" onClick={resetAgent}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Sesi
            </Button>
          )}
        </div>

        {/* Agent tabs */}
        <div className="mt-4">
          <Tabs value={activeAgent} onValueChange={v => setActiveAgent(v as AgentKey)}>
            <TabsList className="grid w-full grid-cols-4 h-auto">
              {AGENTS.map(a => {
                const Icon = a.icon;
                const done = checkedTasks[a.key].size;
                const total = a.tasks.length;
                return (
                  <TabsTrigger
                    key={a.key}
                    value={a.key}
                    className="flex-col py-2 gap-0.5 h-auto"
                    data-testid={`tab-agent-${a.key}`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Icon className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium hidden sm:block">{a.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{done}/{total}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {!isStarted[activeAgent] ? (
            /* Welcome for this agent */
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="max-w-md text-center space-y-5">
                <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center mx-auto shadow-md", agent.bgColor)}>
                  <AgentIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <Badge className={cn("text-xs mb-2", agent.badgeColor)}>{agent.fase}</Badge>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">{agent.label}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {agent.opening.slice(0, 180)}...
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-1.5 text-left">
                  {agent.suggestions.slice(0, 3).map((s, i) => (
                    <button
                      key={i}
                      onClick={() => { startAgent().then(() => sendMessage(s)); }}
                      className="text-left text-xs p-2.5 bg-white border rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center gap-2"
                    >
                      <ChevronRight className={cn("h-3.5 w-3.5 flex-none", agent.color)} />
                      <span>{s}</span>
                    </button>
                  ))}
                </div>
                <Button onClick={startAgent} className={cn("gap-2 w-full", agent.bgColor)} data-testid={`button-start-${activeAgent}`}>
                  <Sparkles className="h-4 w-4" />
                  Mulai dengan {agent.label}
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4 max-w-2xl mx-auto">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center flex-none text-xs font-bold",
                        msg.role === "assistant" ? `${agent.bgColor} text-white` : "bg-slate-200 text-slate-600"
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
                            <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" />
                            <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                            <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Quick suggestions */}
              {messages.length <= 2 && (
                <div className="flex-none px-4 pb-2">
                  <div className="max-w-2xl mx-auto flex flex-wrap gap-2">
                    {agent.suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(s)}
                        disabled={isLoading}
                        className="text-xs px-3 py-1.5 bg-white border rounded-full hover:bg-slate-50 hover:border-slate-300 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="flex-none border-t bg-white p-4">
                <div className="max-w-2xl mx-auto flex gap-3 items-end">
                  <Textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Tanyakan kepada ${agent.label}... (Enter untuk kirim)`}
                    className="resize-none min-h-[52px] max-h-[120px]"
                    disabled={isLoading}
                    data-testid="input-collab-message"
                    rows={2}
                  />
                  <Button
                    onClick={() => sendMessage()}
                    disabled={isLoading || !input.trim()}
                    className={cn("h-[52px] px-4 flex-none", agent.bgColor)}
                    data-testid="button-collab-send"
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

        {/* Right sidebar */}
        <div className="w-64 flex-none border-l bg-white flex flex-col">
          {/* Phase info */}
          <div className="p-4 border-b">
            <Badge className={cn("text-xs w-full justify-center py-1", agent.badgeColor)}>
              {agent.fase}
            </Badge>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Progress</span>
                <span className="font-medium">{completedCount}/{totalTasks}</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-500", agent.bgColor)}
                  style={{ width: `${(completedCount / totalTasks) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Task checklist */}
          <div className="flex-1 overflow-y-auto p-3">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 px-1">
              Deliverables
            </h4>
            <div className="space-y-1">
              {agent.tasks.map((task, idx) => {
                const done = checkedTasks[activeAgent].has(idx);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleTask(activeAgent, idx)}
                    className={cn(
                      "w-full flex items-start gap-2 p-2 rounded-lg text-left transition-colors",
                      done ? "bg-green-50" : "hover:bg-slate-50"
                    )}
                    data-testid={`task-${activeAgent}-${idx}`}
                  >
                    {done
                      ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-none" />
                      : <Circle className="h-3.5 w-3.5 text-slate-300 mt-0.5 flex-none" />
                    }
                    <div className="min-w-0">
                      <div className={cn("text-xs font-medium leading-tight", done ? "text-green-700 line-through" : "text-slate-700")}>
                        {task.label}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{task.klausul}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick links */}
          <div className="p-3 border-t">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 px-1">
              Tools Terkait
            </h4>
            <div className="space-y-1">
              {agent.quickLinks.map((link, i) => {
                const Icon = link.icon;
                return (
                  <Link key={i} href={link.url}>
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                      <Icon className={cn("h-3.5 w-3.5 flex-none", agent.color)} />
                      <span className="text-xs text-slate-600">{link.label}</span>
                      <ExternalLink className="h-3 w-3 text-slate-400 ml-auto flex-none" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Link to Dialog */}
      {!isStarted[activeAgent] && (
        <div className="flex-none border-t bg-white px-6 py-3">
          <div className="flex items-center justify-between max-w-2xl mx-auto text-sm text-muted-foreground">
            <span>Belum punya Blueprint SMAP?</span>
            <Link href="/gustafta-dialog">
              <Button variant="ghost" size="sm" className="gap-1.5 text-blue-600">
                <MessageSquare className="h-3.5 w-3.5" />
                Mulai dengan Gustafta Dialog
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
