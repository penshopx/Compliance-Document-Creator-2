import { useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowDownToLine,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileText,
  Info,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { assertDocumentUploadSize, extractPlainTextDocument } from "@/lib/document-extraction";
import {
  DOCUMENT_SIMULATOR_MAX_CONTENT_LENGTH,
  DOCUMENT_SIMULATOR_MAX_OCR_PAGES,
  DOCUMENT_SIMULATOR_MAX_PDF_PAGES,
} from "@shared/schema";

type Standard = "smap" | "pancek";
type SourceType = "saved" | "pasted";

type SavedDocument = {
  id: string;
  title: string;
  content: string;
  clause?: string | null;
  type?: string;
  templateType?: string;
  category?: string;
  createdAt?: string;
  generatedAt?: string;
};

type Finding = {
  severity: string;
  criterion: string;
  reference: string;
  evidence: string;
  gap: string;
  recommendation: string;
};

type AssessmentResult = {
  overallScore: number;
  overallStatus: string;
  executiveSummary: string;
  findings: Finding[];
  strengths: string[];
  missingEvidence: string[];
  sourceTitle: string;
  createdAt: string;
  model?: string;
};

type SavedReview = {
  id: string;
  ownerId: string;
  standard: Standard;
  sourceTitle: string;
  overallScore: number;
  overallStatus: string;
  result: AssessmentResult | string;
  createdAt: string;
  model?: string;
};

type ReviewResponse = SavedReview & { model: string };
type OcrPageQuality = {
  pageNumber: number;
  confidence: number | null;
  needsReview: boolean;
};
type FileFeedback = {
  kind: "success" | "warning";
  message: string;
  ocrPages?: OcrPageQuality[];
};

const severityStyles: Record<string, string> = {
  kritis: "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200",
  tinggi: "border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-200",
  sedang: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200",
  rendah: "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-200",
};

function parseAssessment(result: AssessmentResult | string | undefined): AssessmentResult | null {
  if (!result) return null;
  if (typeof result === "string") {
    try {
      return JSON.parse(result) as AssessmentResult;
    } catch {
      return null;
    }
  }
  return result;
}

function formatDate(value?: string) {
  if (!value) return "Tanggal tidak tersedia";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Tanggal tidak tersedia";
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function severityClass(severity: string) {
  return severityStyles[severity.toLowerCase()] || "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200";
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    memadai: "Memadai untuk review awal",
    perlu_perbaikan: "Perlu perbaikan",
    belum_memadai: "Belum memadai",
  };
  return labels[status] || status.replaceAll("_", " ");
}

export default function DocumentSimulatorPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [standard, setStandard] = useState<Standard>("smap");
  const [sourceType, setSourceType] = useState<SourceType>("saved");
  const [selectedDocumentId, setSelectedDocumentId] = useState("");
  const [pastedContent, setPastedContent] = useState("");
  const [pastedTitle, setPastedTitle] = useState("");
  const [isExtractingFile, setIsExtractingFile] = useState(false);
  const [fileFeedback, setFileFeedback] = useState<FileFeedback | null>(null);
  const [activeReview, setActiveReview] = useState<SavedReview | ReviewResponse | null>(null);
  const [historySearch, setHistorySearch] = useState("");

  const generatedQuery = useQuery<SavedDocument[]>({ queryKey: ["/api/generated-documents"] });
  const documentsQuery = useQuery<SavedDocument[]>({ queryKey: ["/api/documents"] });
  const historyQuery = useQuery<SavedReview[]>({ queryKey: ["/api/document-simulator/reviews"] });

  const savedDocuments = useMemo(() => {
    const all = [...(generatedQuery.data || []), ...(documentsQuery.data || [])];
    const unique = new Map<string, SavedDocument>();
    all.forEach((document) => {
      const key = `${document.id}:${document.title}`;
      if (!unique.has(key)) unique.set(key, document);
    });
    return Array.from(unique.values());
  }, [generatedQuery.data, documentsQuery.data]);

  const selectedDocument = savedDocuments.find((document) => document.id === selectedDocumentId);
  const sourceReady = sourceType === "saved"
    ? Boolean(selectedDocument?.content?.trim()) && (selectedDocument?.content.length ?? 0) <= DOCUMENT_SIMULATOR_MAX_CONTENT_LENGTH
    : Boolean(pastedContent.trim()) && pastedContent.length <= DOCUMENT_SIMULATOR_MAX_CONTENT_LENGTH;

  const reviewMutation = useMutation({
    mutationFn: async () => {
      const payload = sourceType === "saved"
        ? {
            standard,
            sourceType,
            sourceId: selectedDocument?.id,
            sourceTitle: selectedDocument?.title,
          }
        : {
            standard,
            sourceType,
            sourceTitle: pastedTitle.trim() || "Teks yang ditempel",
            content: pastedContent.trim(),
          };
      const response = await apiRequest("POST", "/api/document-simulator/review", payload);
      return response.json() as Promise<ReviewResponse>;
    },
    onSuccess: (review) => {
      setActiveReview(review);
      queryClient.invalidateQueries({ queryKey: ["/api/document-simulator/reviews"] });
      toast({
        title: "Review tersimpan",
        description: "Hasil simulasi telah ditambahkan ke riwayat Anda.",
      });
    },
    onError: (error) => {
      toast({
        title: "Review tidak dapat dijalankan",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat memproses dokumen.",
        variant: "destructive",
      });
    },
  });

  const filteredReviews = useMemo(() => {
    const query = historySearch.trim().toLowerCase();
    return (historyQuery.data || []).filter((review) =>
      !query || review.sourceTitle.toLowerCase().includes(query) || review.standard.toLowerCase().includes(query),
    );
  }, [historyQuery.data, historySearch]);

  const handleFile = async (file?: File) => {
    if (!file) return;
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !["txt", "md", "pdf", "doc", "docx"].includes(extension)) {
      const message = "Pilih file .txt, .md, .pdf, .doc, atau .docx.";
      setFileFeedback({ kind: "warning", message });
      toast({ title: "Format file tidak didukung", description: message, variant: "destructive" });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    try {
      assertDocumentUploadSize(file.size);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ukuran file maksimal 8 MB.";
      setFileFeedback({ kind: "warning", message });
      toast({ title: "File terlalu besar", description: message, variant: "destructive" });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setIsExtractingFile(true);
    setFileFeedback(null);
    try {
      let content: string;
      let title = file.name.replace(/\.(txt|md|pdf|docx?)$/i, "").slice(0, 200);
      let pageCount: number | undefined;
      let ocrPageCount: number | undefined;
      let ocrPages: OcrPageQuality[] | undefined;
      if (extension === "txt" || extension === "md") {
        const extracted = extractPlainTextDocument(file.name, await file.text());
        content = extracted.content;
        title = extracted.title;
      } else {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/api/document-simulator/extract", {
          method: "POST",
          body: formData,
        });
        const result = await response.json().catch(() => ({})) as {
          content?: string;
          title?: string;
          pageCount?: number;
          ocrPageCount?: number;
          ocrPages?: OcrPageQuality[];
          error?: string;
        };
        if (!response.ok) throw new Error(result.error || "Dokumen gagal diproses.");
        if (!result.content?.trim()) throw new Error("Tidak ada teks yang dapat diekstrak dari dokumen.");
        content = result.content;
        title = result.title || title;
        pageCount = result.pageCount;
        ocrPageCount = result.ocrPageCount;
        ocrPages = result.ocrPages;
      }
      if (!content.trim()) {
        throw new Error("File tidak berisi teks yang bisa dibaca.");
      }
      if (content.length > DOCUMENT_SIMULATOR_MAX_CONTENT_LENGTH) {
        throw new Error("Teks dokumen melebihi batas 30.000 karakter. Bagi dokumen menjadi beberapa bagian.");
      }
      setSourceType("pasted");
      setPastedTitle(title);
      setPastedContent(content);
      const pageInfo = pageCount ? ` ${pageCount} halaman berhasil dibaca.` : "";
      const ocrInfo = ocrPageCount ? ` OCR lokal mengenali teks pada ${ocrPageCount} halaman scan.` : "";
      const feedback = `${file.name} berhasil dimuat.${pageInfo}${ocrInfo} Periksa teks hasil ekstraksi, lalu jalankan review.`;
      setFileFeedback({ kind: "success", message: feedback, ocrPages });
      toast({ title: "Dokumen berhasil dimuat", description: feedback });
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : "Pastikan format file didukung dan dokumen tidak rusak.";
      setFileFeedback({ kind: "warning", message });
      toast({ title: "Dokumen tidak dapat dibaca", description: message, variant: "destructive" });
    } finally {
      setIsExtractingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const openReview = (review: SavedReview) => setActiveReview(review);
  const displayedResult = parseAssessment(activeReview?.result);
  const isLoadingDocuments = generatedQuery.isLoading || documentsQuery.isLoading;
  const documentLoadError = generatedQuery.isError && documentsQuery.isError;

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-6 pb-10">
      <header className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 px-5 py-6 text-slate-50 shadow-lg sm:px-8 sm:py-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full border border-blue-400/15" />
        <div className="pointer-events-none absolute -right-4 -top-8 h-48 w-48 rounded-full border border-blue-300/10" />
        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">
              <ShieldCheck className="h-3.5 w-3.5" />
              Compliance Hub / Pemeriksaan dokumen
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Simulator dokumen</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Tinjauan awal berbantuan AI untuk membantu memetakan bukti SMAP dan Pancek sebelum ditindaklanjuti oleh tim Anda.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-400/15 text-blue-200">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400">Ruang kerja</div>
              <div className="mt-0.5 text-sm font-semibold">Review awal · {historyQuery.data?.length ?? "—"} tersimpan</div>
            </div>
          </div>
        </div>
      </header>

      <Alert className="border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950/35 dark:text-amber-100">
        <Info className="h-4 w-4" />
        <AlertTitle>Simulasi saja — bukan sertifikasi atau audit resmi</AlertTitle>
        <AlertDescription className="text-amber-900/80 dark:text-amber-100/75">
          Hasil AI bersifat indikatif dan perlu diverifikasi oleh personel yang berwenang. Ini bukan keputusan sertifikasi ISO 37001:2016, audit resmi, maupun penilaian resmi KPK/Jaga.id.
        </AlertDescription>
      </Alert>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <Card className="overflow-hidden border-slate-200 shadow-sm dark:border-slate-800">
          <CardHeader className="border-b bg-slate-50/80 pb-5 dark:bg-slate-900/40">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                  Siapkan peninjauan
                </CardTitle>
                <CardDescription className="mt-1.5">Pilih kerangka dan sumber dokumen untuk memulai.</CardDescription>
              </div>
              <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">AI-assisted</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold" htmlFor="review-standard">Standar / kerangka</label>
                <Select value={standard} onValueChange={(value) => setStandard(value as Standard)}>
                  <SelectTrigger id="review-standard" aria-label="Pilih standar">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smap">SMAP · ISO 37001:2016</SelectItem>
                    <SelectItem value="pancek">Pancek · KPK / Jaga.id</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Sumber dokumen</label>
                <div className="grid grid-cols-2 rounded-lg border bg-muted/40 p-1">
                  <button
                    type="button"
                    onClick={() => setSourceType("saved")}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${sourceType === "saved" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Tersimpan
                  </button>
                  <button
                    type="button"
                    onClick={() => setSourceType("pasted")}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${sourceType === "pasted" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Tempel teks
                  </button>
                </div>
              </div>
            </div>

            {sourceType === "saved" ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-sm font-semibold" htmlFor="saved-document">Dokumen Anda</label>
                  <span className="text-xs text-muted-foreground">{savedDocuments.length} tersedia</span>
                </div>
                {isLoadingDocuments ? (
                  <div className="space-y-2" aria-label="Memuat dokumen">
                    <div className="h-10 animate-pulse rounded-md bg-muted" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                  </div>
                ) : documentLoadError ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm dark:border-red-900 dark:bg-red-950/30">
                    <div className="flex items-start gap-2 text-red-800 dark:text-red-200">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium">Dokumen gagal dimuat</p>
                        <p className="mt-1 text-red-700/80 dark:text-red-200/70">Periksa koneksi, lalu coba lagi.</p>
                        <Button
                          className="mt-3"
                          size="sm"
                          variant="outline"
                          onClick={() => { generatedQuery.refetch(); documentsQuery.refetch(); }}
                        >
                          <RefreshCw className="mr-2 h-3.5 w-3.5" /> Muat ulang
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : savedDocuments.length ? (
                  <>
                    <Select value={selectedDocumentId} onValueChange={setSelectedDocumentId}>
                      <SelectTrigger id="saved-document" aria-label="Pilih dokumen tersimpan">
                        <SelectValue placeholder="Pilih dokumen untuk ditinjau" />
                      </SelectTrigger>
                      <SelectContent>
                        {savedDocuments.map((document, index) => (
                          <SelectItem key={`${document.id}-${index}`} value={document.id}>
                            {document.title}{document.clause ? ` · ${document.clause}` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedDocument && (
                      <div className="flex items-center gap-2 rounded-md bg-blue-50 px-3 py-2 text-xs text-blue-900 dark:bg-blue-950/35 dark:text-blue-200">
                        <FileText className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{selectedDocument.title}</span>
                        <span className="ml-auto shrink-0 text-blue-800/65 dark:text-blue-200/60">{selectedDocument.content.length.toLocaleString("id-ID")} / {DOCUMENT_SIMULATOR_MAX_CONTENT_LENGTH.toLocaleString("id-ID")} karakter</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="rounded-lg border border-dashed p-5 text-center">
                    <FileText className="mx-auto h-7 w-7 text-muted-foreground/70" />
                    <p className="mt-2 text-sm font-medium">Belum ada dokumen tersimpan</p>
                    <p className="mt-1 text-xs text-muted-foreground">Tempel isi dokumen atau impor file teks untuk melanjutkan.</p>
                    <Button variant="outline" size="sm" className="mt-3" onClick={() => setSourceType("pasted")}>Gunakan teks</Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-semibold" htmlFor="source-title">Judul sumber <span className="font-normal text-muted-foreground">(opsional)</span></label>
                  <input
                    id="source-title"
                    value={pastedTitle}
                    onChange={(event) => setPastedTitle(event.target.value)}
                    placeholder="Contoh: Prosedur uji tuntas mitra"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-sm font-semibold" htmlFor="pasted-content">Isi dokumen</label>
                    <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isExtractingFile}>
                      {isExtractingFile
                        ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                        : <Upload className="mr-2 h-3.5 w-3.5" />}
                      {isExtractingFile ? "Mengekstrak teks…" : "Impor PDF / Word / teks"}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt,.md,.pdf,.doc,.docx,text/plain,text/markdown,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="hidden"
                      onChange={(event) => void handleFile(event.target.files?.[0])}
                      aria-label="Impor file PDF, DOC, DOCX, TXT, atau Markdown"
                    />
                  </div>
                  {fileFeedback && (
                    <div
                      className={`rounded-md border px-3 py-2.5 text-sm ${fileFeedback.kind === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200" : "border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100"}`}
                      role={fileFeedback.kind === "warning" ? "alert" : "status"}
                    >
                      {fileFeedback.message}
                    </div>
                  )}
                  {fileFeedback?.ocrPages?.length ? (
                    <div
                      className={`rounded-md border px-3 py-2.5 text-sm ${
                        fileFeedback.ocrPages.some((page) => page.needsReview)
                          ? "border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100"
                          : "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200"
                      }`}
                      role="status"
                      aria-label="Kualitas OCR per halaman"
                    >
                      <p className="font-semibold">Pemeriksaan halaman hasil scan</p>
                      <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                        {fileFeedback.ocrPages.map((page) => (
                          <li key={page.pageNumber}>
                            Halaman {page.pageNumber}: {page.needsReview ? "perlu diperiksa ulang" : "keyakinan baik"}
                            {page.confidence !== null ? ` (${page.confidence}%)` : " (teks tidak terbaca)"}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-1 text-xs opacity-80">Penanda halaman dan teks hasil OCR tetap dapat diedit di bawah ini sebelum menjalankan review.</p>
                    </div>
                  ) : null}
                  <Textarea
                    id="pasted-content"
                    value={pastedContent}
                    maxLength={DOCUMENT_SIMULATOR_MAX_CONTENT_LENGTH}
                    onChange={(event) => setPastedContent(event.target.value)}
                    placeholder="Tempelkan isi dokumen yang ingin ditinjau…"
                    className="min-h-[230px] resize-y leading-6"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>PDF/Word maksimal 8 MB; PDF maksimal {DOCUMENT_SIMULATOR_MAX_PDF_PAGES} halaman. OCR Indonesia/Inggris maksimal {DOCUMENT_SIMULATOR_MAX_OCR_PAGES} halaman scan; periksa ulang teks hasilnya.</span>
                    <span>{pastedContent.length.toLocaleString("id-ID")} / {DOCUMENT_SIMULATOR_MAX_CONTENT_LENGTH.toLocaleString("id-ID")} karakter</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Penanda halaman PDF ditambahkan ke isi dokumen dan dapat diedit sebelum review.</p>
                </div>
              </div>
            )}

            <Separator />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-sm text-xs leading-5 text-muted-foreground">
                AI menilai indikasi bukti dan kesenjangan berdasarkan materi yang diberikan, bukan menetapkan kepatuhan final.
              </p>
              <Button
                onClick={() => reviewMutation.mutate()}
                disabled={!sourceReady || isLoadingDocuments || reviewMutation.isPending || (sourceType === "saved" && documentLoadError)}
                className="h-11 shrink-0 bg-blue-700 px-5 text-white hover:bg-blue-800 dark:bg-blue-500 dark:text-slate-950 dark:hover:bg-blue-400"
              >
                {reviewMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                {reviewMutation.isPending ? "Meninjau dokumen…" : "Jalankan review"}
                {!reviewMutation.isPending && <ArrowUpRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
            {reviewMutation.isError && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200" role="alert">
                Review gagal disimpan. Periksa sumber dokumen dan coba kembali.
              </div>
            )}
            {reviewMutation.isSuccess && (
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300" role="status">
                <Check className="h-4 w-4" /> Review berhasil disimpan ke riwayat.
              </div>
            )}
          </CardContent>
        </Card>

        <section className="min-w-0 space-y-6" aria-label="Hasil peninjauan">
          {activeReview && displayedResult ? (
            <AssessmentPanel review={activeReview} result={displayedResult} />
          ) : activeReview ? (
            <Card className="border-amber-300">
              <CardContent className="flex gap-3 p-5">
                <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
                <div>
                  <h2 className="font-semibold">Hasil review tidak dapat ditampilkan</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Data hasil tersimpan, tetapi formatnya tidak dapat dibaca.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="overflow-hidden border-slate-200 dark:border-slate-800">
              <CardContent className="flex min-h-[280px] flex-col items-center justify-center px-6 py-10 text-center">
                <div className="grid h-14 w-14 place-items-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
                  <Search className="h-6 w-6" />
                </div>
                <h2 className="mt-4 text-lg font-semibold">Hasil akan tampil di sini</h2>
                <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">Pilih sumber dokumen dan jalankan simulasi. Penilaian yang berhasil akan disimpan untuk ditinjau kembali.</p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <Badge variant="outline">Skor & status</Badge>
                  <Badge variant="outline">Temuan per kriteria</Badge>
                  <Badge variant="outline">Bukti yang perlu dilengkapi</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-slate-200 shadow-sm dark:border-slate-800">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg"><Clock3 className="h-4 w-4 text-blue-600 dark:text-blue-300" />Riwayat penilaian</CardTitle>
                  <CardDescription className="mt-1">Maksimal 20 review tersimpan terbaru.</CardDescription>
                </div>
                <Button variant="ghost" size="icon" aria-label="Muat ulang riwayat" onClick={() => historyQuery.refetch()} disabled={historyQuery.isFetching}>
                  <RefreshCw className={`h-4 w-4 ${historyQuery.isFetching ? "animate-spin" : ""}`} />
                </Button>
              </div>
              {!historyQuery.isLoading && !historyQuery.isError && (historyQuery.data?.length ?? 0) > 0 && (
                <div className="relative mt-3">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={historySearch}
                    onChange={(event) => setHistorySearch(event.target.value)}
                    placeholder="Cari judul atau standar…"
                    aria-label="Cari riwayat review"
                    className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              {historyQuery.isLoading ? (
                <div className="space-y-2" aria-label="Memuat riwayat penilaian">
                  {[0, 1, 2].map((item) => <div key={item} className="h-[68px] animate-pulse rounded-lg bg-muted" />)}
                </div>
              ) : historyQuery.isError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
                  <div className="flex items-start gap-2 text-red-800 dark:text-red-200">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <div className="flex-1 text-sm">
                      <p className="font-medium">Riwayat gagal dimuat</p>
                      <Button variant="outline" size="sm" className="mt-3" onClick={() => historyQuery.refetch()}>Coba lagi</Button>
                    </div>
                  </div>
                </div>
              ) : !historyQuery.data?.length ? (
                <div className="rounded-lg border border-dashed p-6 text-center">
                  <Clock3 className="mx-auto h-6 w-6 text-muted-foreground/70" />
                  <p className="mt-2 text-sm font-medium">Belum ada penilaian tersimpan</p>
                  <p className="mt-1 text-xs text-muted-foreground">Review yang berhasil akan muncul di daftar ini.</p>
                </div>
              ) : filteredReviews.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">Tidak ada riwayat yang cocok dengan pencarian.</div>
              ) : (
                <ScrollArea className="max-h-[420px] pr-3">
                  <div className="space-y-2">
                    {filteredReviews.map((review) => (
                      <button
                        type="button"
                        key={review.id}
                        onClick={() => openReview(review)}
                        className={`group w-full rounded-lg border p-3 text-left transition-colors hover:border-blue-300 hover:bg-blue-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:border-blue-800 dark:hover:bg-blue-950/25 ${activeReview?.id === review.id ? "border-blue-400 bg-blue-50/70 dark:border-blue-700 dark:bg-blue-950/30" : "border-border"}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="truncate text-sm font-semibold">{review.sourceTitle || "Dokumen tanpa judul"}</span>
                              <Badge variant="outline" className="shrink-0 text-[10px] uppercase">{review.standard}</Badge>
                            </div>
                            <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{formatDate(review.createdAt)}</span><span aria-hidden="true">·</span><span>{statusLabel(review.overallStatus)}</span>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <span className="font-mono text-sm font-semibold tabular-nums">{review.overallScore}<span className="text-xs text-muted-foreground">/100</span></span>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

function AssessmentPanel({ review, result }: { review: SavedReview | ReviewResponse; result: AssessmentResult }) {
  const score = Number(result.overallScore ?? review.overallScore);
  const status = result.overallStatus || review.overallStatus || "Status tidak tersedia";
  const findings = Array.isArray(result.findings) ? result.findings : [];
  const strengths = Array.isArray(result.strengths) ? result.strengths : [];
  const missingEvidence = Array.isArray(result.missingEvidence) ? result.missingEvidence : [];
  const model = result.model || review.model;
  const scoreTone = score >= 80 ? "text-emerald-700 dark:text-emerald-300" : score >= 50 ? "text-amber-700 dark:text-amber-300" : "text-red-700 dark:text-red-300";

  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm dark:border-slate-800" data-testid="card-assessment-result">
      <CardHeader className="border-b bg-slate-50/80 dark:bg-slate-900/40">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge className="bg-blue-700 text-white hover:bg-blue-700 dark:bg-blue-400 dark:text-slate-950">{review.standard.toUpperCase()}</Badge>
              <Badge variant="outline">{statusLabel(status)}</Badge>
            </div>
            <CardTitle className="truncate text-xl">{result.sourceTitle || review.sourceTitle || "Dokumen tanpa judul"}</CardTitle>
            <CardDescription className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>{formatDate(result.createdAt || review.createdAt)}</span>
              {model && <span>Model: {model}</span>}
            </CardDescription>
          </div>
          <div className="flex items-center gap-3 rounded-xl border bg-background px-4 py-3 sm:min-w-[150px]">
            <div className={`font-mono text-3xl font-semibold tracking-tight ${scoreTone}`}>{Number.isFinite(score) ? score : "—"}</div>
            <div className="text-xs leading-4 text-muted-foreground">Skor simulasi<br />dari 100</div>
          </div>
        </div>
        <Progress value={Number.isFinite(score) ? Math.max(0, Math.min(100, score)) : 0} className="mt-4 h-1.5" />
      </CardHeader>
      <CardContent className="space-y-5 p-5 sm:p-6">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><Info className="h-4 w-4 text-blue-600 dark:text-blue-300" />Ringkasan eksekutif</div>
          <p className="text-sm leading-6 text-muted-foreground">{result.executiveSummary || "Ringkasan tidak tersedia pada hasil ini."}</p>
        </div>

        <Separator />
        <div>
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">Temuan peninjauan</h3>
            <Badge variant="secondary">{findings.length} temuan</Badge>
          </div>
          {findings.length ? (
            <div className="space-y-3">
              {findings.map((finding, index) => (
                <article key={`${finding.criterion}-${index}`} className="rounded-lg border p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-semibold">{finding.criterion || `Temuan ${index + 1}`}</h4>
                      {finding.reference && <p className="mt-1 text-xs font-mono text-muted-foreground">{finding.reference}</p>}
                    </div>
                    <Badge variant="outline" className={`capitalize ${severityClass(finding.severity || "")}`}>{finding.severity || "Belum ditentukan"}</Badge>
                  </div>
                  <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
                    {finding.evidence && <Detail label="Bukti teridentifikasi" value={finding.evidence} />}
                    {finding.gap && <Detail label="Kesenjangan" value={finding.gap} />}
                    {finding.recommendation && <Detail label="Rekomendasi" value={finding.recommendation} />}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">Tidak ada temuan yang tercantum dalam hasil ini.</div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <section className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-emerald-900 dark:text-emerald-200"><CheckCircle2 className="h-4 w-4" />Kekuatan</h3>
            {strengths.length ? (
              <ul className="mt-3 space-y-2 text-sm leading-5 text-emerald-950/80 dark:text-emerald-100/80">
                {strengths.map((strength, index) => <li key={`${strength}-${index}`} className="flex gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0" /><span>{strength}</span></li>)}
              </ul>
            ) : <p className="mt-2 text-sm text-muted-foreground">Tidak ada kekuatan yang dicatat.</p>}
          </section>
          <section className="rounded-lg border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900 dark:bg-amber-950/20">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-950 dark:text-amber-200"><ArrowDownToLine className="h-4 w-4" />Bukti yang perlu dilengkapi</h3>
            {missingEvidence.length ? (
              <ul className="mt-3 space-y-2 text-sm leading-5 text-amber-950/80 dark:text-amber-100/80">
                {missingEvidence.map((item, index) => <li key={`${item}-${index}`} className="flex gap-2"><X className="mt-0.5 h-3.5 w-3.5 shrink-0" /><span>{item}</span></li>)}
              </ul>
            ) : <p className="mt-2 text-sm text-muted-foreground">Tidak ada item tambahan yang dicatat.</p>}
          </section>
        </div>

        <div className="flex items-start gap-2 rounded-md bg-muted/60 px-3 py-2.5 text-xs leading-5 text-muted-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Hasil ini adalah simulasi awal dan tidak menggantikan penilaian profesional, audit, sertifikasi, atau verifikasi resmi.
        </div>
      </CardContent>
    </Card>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
      <p className="leading-5 text-foreground/85">{value}</p>
    </div>
  );
}
