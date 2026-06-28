import { useState, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, Wand2, Copy, Download, CheckCircle2, Loader2,
  Search, Database, FileText, Zap, Building2, Users, Shield,
  ChevronRight, RotateCcw, BookOpen, AlertCircle,
} from "lucide-react";
import { PANCEK_PHASES, getAllPancekDocuments, type PancekDocument } from "@/data/pancek-data";

const PHASE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  komitmen:    { bg: "bg-red-50 dark:bg-red-950/20",     text: "text-red-700 dark:text-red-300",    border: "border-red-200 dark:border-red-800" },
  perencanaan: { bg: "bg-blue-50 dark:bg-blue-950/20",   text: "text-blue-700 dark:text-blue-300",  border: "border-blue-200 dark:border-blue-800" },
  pelaksanaan: { bg: "bg-green-50 dark:bg-green-950/20", text: "text-green-700 dark:text-green-300",border: "border-green-200 dark:border-green-800" },
  evaluasi:    { bg: "bg-amber-50 dark:bg-amber-950/20", text: "text-amber-700 dark:text-amber-300",border: "border-amber-200 dark:border-amber-800" },
  aksi:        { bg: "bg-purple-50 dark:bg-purple-950/20",text: "text-purple-700 dark:text-purple-300",border:"border-purple-200 dark:border-purple-800" },
  respon:      { bg: "bg-cyan-50 dark:bg-cyan-950/20",   text: "text-cyan-700 dark:text-cyan-300",  border: "border-cyan-200 dark:border-cyan-800" },
};

export default function PancekGenerator() {
  const { toast } = useToast();
  const [selectedPhase, setSelectedPhase] = useState<string>("komitmen");
  const [selectedDoc, setSelectedDoc] = useState<PancekDocument | null>(null);
  const [additionalContext, setAdditionalContext] = useState("");
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const { data: companyData } = useQuery<{ name?: string; address?: string; city?: string; npwp?: string; nib?: string; directorName?: string }>({
    queryKey: ["/api/company"], retry: false,
  });
  const { data: fkapData } = useQuery<Array<{ name: string; position: string; role?: string }>>({
    queryKey: ["/api/fkap"], retry: false,
  });
  const { data: managementData } = useQuery<Array<{ name: string; position: string }>>({
    queryKey: ["/api/management"], retry: false,
  });

  const hasCompanyData = !!companyData?.name;
  const currentPhase = PANCEK_PHASES.find(p => p.id === selectedPhase);
  const phaseDocs = currentPhase?.documents || [];

  const handleSelectDoc = useCallback((doc: PancekDocument) => {
    setSelectedDoc(doc);
    setOutput("");
    setIsDone(false);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!selectedDoc) return;
    if (isGenerating) {
      abortRef.current?.abort();
      return;
    }

    setIsGenerating(true);
    setIsDone(false);
    setOutput("");

    abortRef.current = new AbortController();

    try {
      const response = await fetch("/api/pancek/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        signal: abortRef.current.signal,
        body: JSON.stringify({
          docId: selectedDoc.id,
          docName: selectedDoc.nama,
          kode: selectedDoc.kode,
          phaseId: selectedDoc.phaseId,
          promptTemplate: selectedDoc.promptTemplate,
          dasarHukum: selectedDoc.dasarHukum || "",
          penanggungJawab: selectedDoc.penanggungJawab,
          additionalContext,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Gagal terhubung ke server");
      }

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
                  setOutput(text);
                  if (outputRef.current) {
                    outputRef.current.scrollTop = outputRef.current.scrollHeight;
                  }
                }
                if (data.done) setIsDone(true);
              } catch {}
            }
          }
        }
      }
      setIsDone(true);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        toast({ title: "Gagal generate", description: err.message, variant: "destructive" });
      }
    } finally {
      setIsGenerating(false);
    }
  }, [selectedDoc, additionalContext, isGenerating, toast]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast({ title: "Dokumen disalin!", description: "Tempel di Word atau Google Docs." });
  }, [output]);

  const handleDownload = useCallback(() => {
    if (!output || !selectedDoc) return;
    const header = `${selectedDoc.kode} — ${selectedDoc.nama}\nDibuat oleh Pancek Generator | Compliance Hub\nTanggal: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}\n${"═".repeat(60)}\n\n`;
    const blob = new Blob([header + output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedDoc.kode}-${selectedDoc.nama.replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Dokumen diunduh!", description: selectedDoc.nama });
  }, [output, selectedDoc, toast]);

  const handleReset = useCallback(() => {
    setOutput("");
    setIsDone(false);
    setAdditionalContext("");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-6">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Link href="/pancek">
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                Pancek
              </Button>
            </Link>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                  <Wand2 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <h1 className="text-2xl font-bold">Pancek Document Generator</h1>
              </div>
              <p className="text-muted-foreground text-sm">
                Mini apps pipeline — AI generate dokumen Pancek lengkap siap pakai berdasarkan data perusahaan Anda
              </p>
            </div>

            {/* Company status badge */}
            {hasCompanyData ? (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 shrink-0">
                <Building2 className="w-3 h-3 mr-1" />
                {companyData!.name}
              </Badge>
            ) : (
              <Badge variant="outline" className="border-yellow-400 text-yellow-700 dark:text-yellow-400 shrink-0">
                <AlertCircle className="w-3 h-3 mr-1" />
                Data perusahaan belum diisi
              </Badge>
            )}
          </div>

          {/* Pipeline visual */}
          <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground bg-muted/40 rounded-lg p-3 flex-wrap">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-background rounded border">
              <Database className="w-3.5 h-3.5 text-blue-500" />
              <span className="font-medium">Researcher</span>
              <span className="text-muted-foreground/70">Data perusahaan + regulasi</span>
            </div>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <div className="flex items-center gap-1.5 px-2 py-1 bg-background rounded border">
              <Zap className="w-3.5 h-3.5 text-orange-500" />
              <span className="font-medium">Narrator</span>
              <span className="text-muted-foreground/70">Gemini AI generate dokumen</span>
            </div>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <div className="flex items-center gap-1.5 px-2 py-1 bg-background rounded border">
              <Download className="w-3.5 h-3.5 text-green-500" />
              <span className="font-medium">Distributor</span>
              <span className="text-muted-foreground/70">Copy / Download siap pakai</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* LEFT: Document selector */}
          <div className="lg:col-span-2 space-y-4">

            {/* Phase tabs */}
            <div className="flex flex-wrap gap-1.5">
              {PANCEK_PHASES.map(phase => {
                const col = PHASE_COLORS[phase.id] || PHASE_COLORS.komitmen;
                const isActive = selectedPhase === phase.id;
                return (
                  <button
                    key={phase.id}
                    onClick={() => setSelectedPhase(phase.id)}
                    data-testid={`tab-phase-${phase.id}`}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      isActive
                        ? `${col.bg} ${col.text} ${col.border}`
                        : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted"
                    }`}
                  >
                    {phase.order}. {phase.name}
                  </button>
                );
              })}
            </div>

            {/* Document cards */}
            <Card>
              <CardHeader className="pb-2 pt-3 px-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  {currentPhase?.name} — {phaseDocs.length} dokumen
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2 pb-2">
                <ScrollArea className="h-[calc(100vh-20rem)]">
                  <div className="space-y-1.5 pr-2">
                    {phaseDocs.map(doc => {
                      const isSelected = selectedDoc?.id === doc.id;
                      const col = PHASE_COLORS[doc.phaseId] || PHASE_COLORS.komitmen;
                      return (
                        <button
                          key={doc.id}
                          onClick={() => handleSelectDoc(doc)}
                          data-testid={`card-doc-${doc.id}`}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${
                            isSelected
                              ? `${col.bg} ${col.border} shadow-sm`
                              : "bg-background hover:bg-muted/50 border-border"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="text-xs font-mono text-muted-foreground">{doc.kode}</span>
                            <Badge
                              variant="outline"
                              className={`text-xs shrink-0 ${
                                doc.tingkatKritis === "Wajib"
                                  ? "border-red-300 text-red-700 dark:text-red-400"
                                  : doc.tingkatKritis === "Penting"
                                  ? "border-amber-300 text-amber-700 dark:text-amber-400"
                                  : "border-gray-300 text-gray-600"
                              }`}
                            >
                              {doc.tingkatKritis}
                            </Badge>
                          </div>
                          <p className={`text-sm font-medium leading-tight mb-1 ${isSelected ? col.text : ""}`}>
                            {doc.nama}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{doc.deskripsi}</p>
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: Generation panel */}
          <div className="lg:col-span-3 space-y-4">

            {!selectedDoc ? (
              <Card className="flex items-center justify-center h-[400px] border-dashed">
                <div className="text-center text-muted-foreground">
                  <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="font-medium">Pilih dokumen di sebelah kiri</p>
                  <p className="text-sm mt-1">AI akan generate dokumen lengkap untuk Anda</p>
                </div>
              </Card>
            ) : (
              <>
                {/* Selected doc info */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-muted-foreground">{selectedDoc.kode}</span>
                          <Badge
                            className={`text-xs ${
                              selectedDoc.tingkatKritis === "Wajib"
                                ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                            }`}
                          >
                            {selectedDoc.tingkatKritis}
                          </Badge>
                        </div>
                        <h2 className="font-bold text-base">{selectedDoc.nama}</h2>
                        <p className="text-sm text-muted-foreground mt-0.5">{selectedDoc.deskripsi}</p>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Users className="w-3.5 h-3.5" />
                        <span>PJ: {selectedDoc.penanggungJawab}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Shield className="w-3.5 h-3.5" />
                        <span>{selectedDoc.frekuensi}</span>
                      </div>
                      {selectedDoc.dasarHukum && (
                        <div className="col-span-2 flex items-start gap-1.5 text-muted-foreground">
                          <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>{selectedDoc.dasarHukum}</span>
                        </div>
                      )}
                    </div>

                    {/* Researcher data status */}
                    <div className={`mt-3 rounded-md p-2.5 text-xs ${hasCompanyData ? "bg-green-50 dark:bg-green-950/20" : "bg-yellow-50 dark:bg-yellow-950/20"}`}>
                      <div className={`flex items-center gap-1.5 font-medium mb-1 ${hasCompanyData ? "text-green-700 dark:text-green-400" : "text-yellow-700 dark:text-yellow-400"}`}>
                        <Database className="w-3.5 h-3.5" />
                        Researcher — Data otomatis tersedia:
                      </div>
                      <div className="space-y-0.5 text-muted-foreground">
                        <div>• Perusahaan: <span className="font-medium text-foreground">{companyData?.name || "—"}</span></div>
                        <div>• Direktur: <span className="font-medium text-foreground">{companyData?.directorName || managementData?.[0]?.name || "—"}</span></div>
                        <div>• Tim FKAP: <span className="font-medium text-foreground">{fkapData && fkapData.length > 0 ? `${fkapData.length} anggota` : "—"}</span></div>
                        <div>• Manajemen: <span className="font-medium text-foreground">{managementData && managementData.length > 0 ? `${managementData.length} orang` : "—"}</span></div>
                      </div>
                      {!hasCompanyData && (
                        <Link href="/company">
                          <span className="text-yellow-700 dark:text-yellow-400 underline cursor-pointer">Isi data perusahaan →</span>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Additional context input */}
                <Card>
                  <CardContent className="p-4">
                    <label className="text-sm font-medium block mb-2">
                      Konteks tambahan <span className="text-muted-foreground font-normal">(opsional)</span>
                    </label>
                    <Textarea
                      placeholder="Contoh: Perusahaan bergerak di konstruksi jalan raya. Direktur: Budi Santoso. Fokus pada proyek pemerintah APBN..."
                      value={additionalContext}
                      onChange={e => setAdditionalContext(e.target.value)}
                      className="text-sm min-h-[72px]"
                      data-testid="input-additional-context"
                    />
                  </CardContent>
                </Card>

                {/* Generate button */}
                <div className="flex gap-2">
                  <Button
                    onClick={handleGenerate}
                    disabled={false}
                    className="flex-1 gap-2"
                    variant={isGenerating ? "outline" : "default"}
                    data-testid="button-generate"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating... (klik untuk stop)
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        Generate {selectedDoc.nama}
                      </>
                    )}
                  </Button>
                  {(output || additionalContext) && (
                    <Button variant="outline" size="icon" onClick={handleReset} title="Reset" data-testid="button-reset">
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Output panel */}
                {(output || isGenerating) && (
                  <Card className="border-2 border-primary/20">
                    <CardHeader className="pb-2 pt-3 px-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Zap className="w-4 h-4 text-orange-500" />
                          Output — {selectedDoc.nama}
                          {isDone && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 text-xs ml-1">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Selesai
                            </Badge>
                          )}
                          {isGenerating && !isDone && (
                            <span className="text-xs text-muted-foreground animate-pulse">● sedang menulis...</span>
                          )}
                        </CardTitle>

                        {isDone && (
                          <div className="flex gap-1.5">
                            <Button size="sm" variant="outline" onClick={handleCopy} className="gap-1 text-xs h-7" data-testid="button-copy-output">
                              <Copy className="w-3 h-3" />
                              Salin
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleDownload} className="gap-1 text-xs h-7" data-testid="button-download-output">
                              <Download className="w-3 h-3" />
                              Unduh .txt
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="px-4 pb-4">
                      <div
                        ref={outputRef}
                        className="bg-muted/30 rounded-md p-4 text-sm font-mono whitespace-pre-wrap leading-relaxed max-h-[520px] overflow-y-auto"
                        data-testid="output-generated-document"
                      >
                        {output || <span className="text-muted-foreground">Memulai generasi...</span>}
                        {isGenerating && <span className="inline-block w-1.5 h-4 bg-primary ml-0.5 animate-pulse rounded-sm" />}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
