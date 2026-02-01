import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Copy,
  Check,
  Zap,
  Shield,
  Building2,
  ClipboardList,
  RotateCcw,
  Lock,
  Unlock,
  BookOpen,
} from "lucide-react";
import type { Company } from "@shared/schema";

const CL_PLAN = [
  "01. Kebijakan Anti Penyuapan (5.2)",
  "02. Identifikasi Risiko (4.5)",
  "03. Memahami Organisasi (4.1)",
  "04. Sasaran & Perencanaan (6.2)",
  "05. Sumber Daya & Struktur (7.1)",
  "06. Kompetensi & Pelatihan (7.2)",
  "07. Komunikasi & Partisipasi (7.4)",
  "08. Dokumentasi (7.5)",
  "09. Pengendalian Dokumen (7.5.3)",
  "10. Pengendalian Operasional (8.1)",
  "11. Kesiagaan Tanggap Darurat (8.8)",
  "12. Pengukuran & Pemantauan (9.1)",
  "13. Tinjauan Fungsi Kepatuhan (9.4)",
  "14. Pengendalian Info Terdokumentasi (7.5.3)",
  "15. Audit Internal (9.2)",
  "16. Tinjauan Manajemen (9.3)",
];

const CL_DO = [
  "01. Kepemimpinan & Komitmen (5.1)",
  "02. Komitmen Anti Penyuapan (8.6)",
  "03. Penilaian Risiko Penyuapan (4.5)",
  "04. Informasi Terdokumentasi (7.5)",
  "05. Pemantauan & Evaluasi (9.1)",
  "06. Laporan Hasil Audit Internal (9.2)",
];

const CL_CHECK = [
  "C.01. Komitmen Puncak Tertulis?",
  "C.02. Pakta Integritas Seluruh Pegawai?",
  "C.03. Kebijakan Berbasis ISO 37001?",
  "C.04. Definisi Penyuapan Jelas?",
  "C.05. Penjelasan Area Rawan Suap?",
  "C.06. Unit Kepatuhan (FKAP) Ada?",
  "C.07. Tanggung Jawab Audit Jelas?",
  "C.08. Sanksi & Penghargaan?",
  "C.09. Komunikasi & Latihan Berkala?",
  "C.10. Identifikasi Titik Rawan?",
  "C.11. Penilaian Risiko Seluruh Aktivitas?",
  "C.12. Penilaian Berkala & Terupdate?",
  "C.13. Uji Tuntas (Due Diligence)?",
  "C.14. Aturan Mengikat Eksternal?",
  "C.15. Sistem Pengawasan & Evaluasi?",
  "C.16. Aturan Gratifikasi & Politik?",
  "C.17. Sistem Laporan WBS Aman?",
  "C.18. Pencatatan Keuangan Transparan?",
  "C.19. Sosialisasi Berkala?",
  "C.20. Sistem Evaluasi Peraturan?",
  "C.21. Komunikasi Hasil ke Pegawai?",
  "C.22. Komunikasi Hasil ke Manajemen?",
  "C.23. Komite Audit Tersedia?",
];

const CL_ACT = [
  "01. Register Tindakan Korektif (10.1)",
  "02. Evaluasi Insiden Penyuapan",
  "03. Rencana Peningkatan Berkelanjutan (10.2)",
  "04. Audit Lanjutan (Follow-up NC)",
  "05. Lesson Learned Organisasi",
  "06. Inovasi Sistem SMAP",
];

const MEGA_REPOSITORY = [
  { cat: "1. Perencanaan SMAP (Permen PU 08)", title: "Manual SMAP ISO 37001", content: "PEDOMAN SMAP\nStatus: Dokumen Induk\nDiterbitkan untuk operasional SBU." },
  { cat: "1. Perencanaan SMAP (Permen PU 08)", title: "Kebijakan Anti Penyuapan", content: "KEBIJAKAN ZERO TOLERANCE\nKomitmen terhadap integritas dan transparansi." },
  { cat: "1. Perencanaan SMAP (Permen PU 08)", title: "SOP Identifikasi Risiko", content: "PROSEDUR ANALISIS RISIKO KLAUSUL 4.5\nMetodologi: Identifikasi, Analisis, Evaluasi." },
  { cat: "1. Perencanaan SMAP (Permen PU 08)", title: "Peta Risiko Penyuapan", content: "RISK REGISTER - TENDER & PENGADAAN" },
  { cat: "1. Perencanaan SMAP (Permen PU 08)", title: "Sasaran Anti Penyuapan", content: "KPI SMAP TAHUNAN - TARGET 0 INSIDEN" },
  { cat: "1. Perencanaan SMAP (Permen PU 08)", title: "SK Penetapan FKAP", content: "SURAT KEPUTUSAN DIREKTUR TENTANG TIM KEPATUHAN" },
  { cat: "1. Perencanaan SMAP (Permen PU 08)", title: "Prosedur Uji Tuntas (Personil)", content: "SOP REKRUTMEN & SCREENING KARYAWAN" },
  { cat: "1. Perencanaan SMAP (Permen PU 08)", title: "Prosedur Uji Tuntas (Mitra)", content: "SOP DUE DILIGENCE VENDOR & REKANAN" },
  { cat: "1. Perencanaan SMAP (Permen PU 08)", title: "Prosedur Kontrol Keuangan", content: "SOP OTORISASI PEMBAYARAN & AUDIT BIAYA" },
  { cat: "1. Perencanaan SMAP (Permen PU 08)", title: "Prosedur Kontrol Non-Keuangan", content: "SOP PENGADAAN BARANG & JASA (Procurement)" },
  { cat: "2. Rekaman Pelaksanaan (DO)", title: "Pakta Integritas Karyawan", content: "SURAT PERNYATAAN KEPATUHAN PERSONIL" },
  { cat: "2. Rekaman Pelaksanaan (DO)", title: "Pakta Integritas Rekanan", content: "KOMITMEN ANTI PENYUAPAN MITRA BISNIS" },
  { cat: "2. Rekaman Pelaksanaan (DO)", title: "Logbook Hadiah & Gratifikasi", content: "FORMULIR REKAMAN PENERIMAAN/PEMBERIAN" },
  { cat: "2. Rekaman Pelaksanaan (DO)", title: "Laporan Hasil Uji Tuntas", content: "RINGKASAN ASESMEN VENDOR BARU" },
  { cat: "2. Rekaman Pelaksanaan (DO)", title: "Berita Acara Sosialisasi", content: "REKAMAN PELATIHAN SMAP & WBS" },
  { cat: "2. Rekaman Pelaksanaan (DO)", title: "Logbook Pelaporan WBS", content: "DAFTAR PENGADUAN INSIDEN (CONFIDENTIAL)" },
  { cat: "3. Evaluasi Kinerja (CHECK)", title: "Checklist Audit Internal", content: "BORANG PEMERIKSAAN KLAUSUL 4 S.D 10" },
  { cat: "3. Evaluasi Kinerja (CHECK)", title: "Laporan Hasil Audit Internal", content: "SUMMARY TEMUAN AUDIT SMAP" },
  { cat: "3. Evaluasi Kinerja (CHECK)", title: "Berita Acara RTM", content: "NOTULEN RAPAT TINJAUAN MANAJEMEN" },
  { cat: "3. Evaluasi Kinerja (CHECK)", title: "Survey Budaya Anti Suap", content: "HASIL EVALUASI KESADARAN KARYAWAN" },
  { cat: "4. Perbaikan Berkelanjutan (ACT)", title: "Register NC & CAPA", content: "LOG TINDAKAN KOREKTIF & PERBAIKAN" },
  { cat: "4. Perbaikan Berkelanjutan (ACT)", title: "Laporan Peningkatan Sistem", content: "RENCANA STRATEGIS PENYEMPURNAAN SMAP" },
];

export default function PDCAGenerator() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("plan");
  const [selectedClause, setSelectedClause] = useState<string | null>(null);
  const [narasi, setNarasi] = useState("");
  const [generatedContent, setGeneratedContent] = useState<{ type: string; content: string } | null>(null);
  const [showRepository, setShowRepository] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data: company } = useQuery<Company>({
    queryKey: ["/api/company"],
  });

  const companyName = company?.name || "[NAMA PERUSAHAAN]";

  const getClauseList = useCallback(() => {
    switch (activeTab) {
      case "plan":
        return CL_PLAN;
      case "do":
        return CL_DO;
      case "check":
        return CL_CHECK;
      case "act":
        return CL_ACT;
      default:
        return CL_PLAN;
    }
  }, [activeTab]);

  const getTabColorClass = useCallback(() => {
    switch (activeTab) {
      case "plan":
        return "text-blue-700 dark:text-blue-400";
      case "do":
        return "text-green-700 dark:text-green-400";
      case "check":
        return "text-amber-700 dark:text-amber-400";
      case "act":
        return "text-red-700 dark:text-red-400";
      default:
        return "text-blue-700 dark:text-blue-400";
    }
  }, [activeTab]);

  const generateDraft = () => {
    if (!selectedClause) {
      toast({ title: "Pilih klausul terlebih dahulu", variant: "destructive" });
      return;
    }

    const content = `[DOKUMEN FORMAL SMAP - STANDAR ISO 37001]

JUDUL: ${selectedClause}
PERUSAHAAN: ${companyName.toUpperCase()}
LOKASI: [LOKASI]
TANGGAL: ${new Date().toLocaleDateString("id-ID")}

ISI PERNYATAAN:
Menimbang kepatuhan terhadap Permen PU No. 08 Tahun 2022, dengan ini Direktur menyatakan bahwa pelaksanaan butir "${selectedClause}" telah berjalan sebagai berikut:

"${narasi || "[Narasi belum diisi]"}"

Demikian pernyataan ini dibuat dengan komitmen Zero Tolerance terhadap penyuapan.

Disahkan oleh,
Direktur,



( [NAMA DIREKTUR] )
Licensed exclusively for ${companyName.toUpperCase()}`;

    setGeneratedContent({ type: "draft", content });
    setShowRepository(false);
    toast({ title: "Draf dokumen berhasil dibuat" });
  };

  const generateAIPrompt = () => {
    if (!selectedClause) {
      toast({ title: "Pilih klausul terlebih dahulu", variant: "destructive" });
      return;
    }

    const content = `TUGAS: Buat draf dokumen SMAP formal (SK/Laporan) sesuai Permen PU 08/2022 untuk butir "${selectedClause}".

IDENTITAS: ${companyName}.

NARASI: "${narasi}"

FORMAT: Bahasa Indonesia formal, sertakan klausul menimbang dan mengingat sesuai ISO 37001.

STANDAR REFERENSI:
- SNI ISO 37001:2016
- Permen PU No. 08 Tahun 2022
- Peraturan Anti Penyuapan Indonesia`;

    setGeneratedContent({ type: "prompt", content });
    setShowRepository(false);
    toast({ title: "AI Prompt berhasil dibuat" });
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast({ title: "Berhasil disalin ke clipboard" });
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast({ title: "Gagal menyalin", variant: "destructive" });
    }
  };

  const handleShowRepository = () => {
    setShowRepository(true);
    setGeneratedContent(null);
    toast({ title: "85+ Dokumen Repository berhasil dimuat" });
  };

  const groupedRepository = MEGA_REPOSITORY.reduce((acc, doc) => {
    if (!acc[doc.cat]) acc[doc.cat] = [];
    acc[doc.cat].push(doc);
    return acc;
  }, {} as Record<string, typeof MEGA_REPOSITORY>);

  return (
    <div className="flex h-[calc(100vh-65px)]">
      {/* Panel 1: PDCA Navigation */}
      <div className="w-72 border-r bg-background flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-sm">
              SR
            </div>
            <div>
              <h1 className="font-black text-sm tracking-tight" data-testid="text-pdca-title">SMAP READY</h1>
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest">
                Digital Assistant v7.2
              </p>
            </div>
          </div>

          {company ? (
            <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl">
              <div className="flex items-center gap-2">
                <Unlock className="w-4 h-4 text-green-600" />
                <span className="text-[10px] font-bold text-green-700 dark:text-green-400 uppercase">
                  Aktif: {company.name}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-600" />
                <span className="text-[10px] font-bold text-red-700 dark:text-red-400 uppercase">
                  Belum ada profil perusahaan
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4">
          <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setSelectedClause(null); }}>
            <TabsList className="grid grid-cols-4 w-full" data-testid="tabs-pdca">
              <TabsTrigger value="plan" className="text-[10px] font-bold" data-testid="tab-plan">Plan</TabsTrigger>
              <TabsTrigger value="do" className="text-[10px] font-bold" data-testid="tab-do">Do</TabsTrigger>
              <TabsTrigger value="check" className="text-[10px] font-bold" data-testid="tab-check">Check</TabsTrigger>
              <TabsTrigger value="act" className="text-[10px] font-bold" data-testid="tab-act">Act</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <ScrollArea className="flex-1 px-4">
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
            Daftar Klausul
          </h3>
          <div className="space-y-1 pb-4">
            {getClauseList().map((clause, index) => (
              <button
                key={index}
                onClick={() => setSelectedClause(clause)}
                className={`w-full text-left text-[11px] p-3 rounded-lg transition-all border-l-4 ${
                  selectedClause === clause
                    ? "bg-primary/10 border-primary font-bold text-primary"
                    : "border-transparent hover:bg-muted"
                }`}
                data-testid={`clause-${activeTab}-${index}`}
              >
                {clause}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Panel 2: Workspace */}
      <div className="flex-1 bg-muted/30 overflow-auto">
        <div className="p-6 max-w-4xl mx-auto">
          {/* Company Info Card */}
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-primary" />
                <CardTitle className="text-sm uppercase tracking-tight">Profil Perusahaan</CardTitle>
              </div>
              {company && (
                <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200">
                  Terhubung
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase mb-2 block">
                    Nama Perusahaan
                  </label>
                  <Input
                    value={companyName}
                    disabled
                    className="font-bold text-primary uppercase"
                    data-testid="input-company-name-display"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase mb-2 block">
                    NPWP
                  </label>
                  <Input
                    value={company?.npwp || "[NPWP]"}
                    disabled
                    data-testid="input-npwp-display"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workspace Area */}
          {selectedClause ? (
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <div>
                  <CardTitle className={`text-sm uppercase tracking-tight ${getTabColorClass()}`}>
                    {selectedClause}
                  </CardTitle>
                  <p className="text-[10px] text-muted-foreground uppercase mt-1">
                    Konfigurasi Standar Permen PU 08/2022
                  </p>
                </div>
                <Badge className="text-[9px] uppercase">PDCA Mode</Badge>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase mb-2 block">
                    Konteks Pelaksanaan di Lapangan
                  </label>
                  <Textarea
                    value={narasi}
                    onChange={(e) => setNarasi(e.target.value)}
                    placeholder="Jelaskan bagaimana butir ini diimplementasikan di perusahaan Anda..."
                    className="min-h-[180px]"
                    data-testid="textarea-narasi"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={generateDraft}
                    className="py-6 font-bold uppercase text-[11px] tracking-wider"
                    data-testid="button-generate-draft"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Hasilkan Draf Dokumen
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={generateAIPrompt}
                    className="py-6 font-bold uppercase text-[11px] tracking-wider"
                    data-testid="button-generate-prompt"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Prompt Master AI
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-6">
              <CardContent className="py-24 text-center">
                <Shield className="w-16 h-16 mx-auto mb-6 text-muted-foreground/20" />
                <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider">
                  Pilih Klausul untuk Memulai Generate Dokumen
                </p>
              </CardContent>
            </Card>
          )}

          {/* Mega Repository Button */}
          <Button
            onClick={handleShowRepository}
            className="w-full py-6 font-bold uppercase text-sm tracking-wider"
            variant="default"
            data-testid="button-mega-repository"
          >
            <BookOpen className="w-5 h-5 mr-3" />
            Mega Repositori (85+ Lampiran)
          </Button>
        </div>
      </div>

      {/* Panel 3: Output */}
      <div className="w-96 border-l bg-background flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter">Output</h2>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">
                {showRepository ? "Mega Repository" : generatedContent ? "Generated Draft" : "Document Hub"}
              </p>
            </div>
            {company ? (
              <Badge className="text-[9px] uppercase bg-green-600">Aktif</Badge>
            ) : (
              <Badge variant="destructive" className="text-[9px] uppercase">Terkunci</Badge>
            )}
          </div>
        </div>

        <ScrollArea className="flex-1 p-6">
          {showRepository ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase">
                  Repository Mega Hub
                </h3>
                <Badge variant="outline" className="text-[9px] bg-green-50 text-green-700">
                  Active
                </Badge>
              </div>

              {Object.entries(groupedRepository).map(([category, docs]) => (
                <div key={category}>
                  <div className="text-[11px] font-black text-primary uppercase bg-primary/10 p-3 rounded-lg mb-3 border-l-4 border-primary">
                    {category}
                  </div>
                  <div className="space-y-3">
                    {docs.map((doc, idx) => (
                      <Card key={idx} className="hover:border-primary/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-[11px] font-bold uppercase">{doc.title}</h4>
                            <Badge variant="secondary" className="text-[8px]">Template</Badge>
                          </div>
                          <div className="text-[10px] text-muted-foreground bg-muted p-3 rounded-lg font-mono whitespace-pre-wrap mb-3">
                            {doc.content}
                            {"\n\n"}[WATERMARK: LICENSED TO {companyName.toUpperCase()}]
                          </div>
                          <Button
                            size="sm"
                            className="w-full text-[10px] uppercase font-bold"
                            onClick={() => copyToClipboard(`${doc.content}\n\n[WATERMARK: LICENSED TO ${companyName.toUpperCase()}]`, `repo-${idx}`)}
                            data-testid={`button-copy-repo-${idx}`}
                          >
                            {copiedId === `repo-${idx}` ? (
                              <>
                                <Check className="w-3 h-3 mr-2" />
                                Tersalin
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 mr-2" />
                                Salin Draf
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : generatedContent ? (
            <div className="space-y-4">
              <Card className={`border-t-4 ${generatedContent.type === "draft" ? "border-t-primary" : "border-t-secondary"}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest">
                      {generatedContent.type === "draft" ? "Dokumen Draf Formal" : "AI Prompt Master"}
                    </h4>
                    <Badge variant="outline" className="text-[8px]">#Sync</Badge>
                  </div>
                  <div className="text-[11px] text-muted-foreground bg-muted p-4 rounded-xl font-mono whitespace-pre-wrap border leading-relaxed mb-4">
                    {generatedContent.content}
                  </div>
                  <Button
                    className="w-full text-[10px] uppercase font-bold"
                    onClick={() => copyToClipboard(generatedContent.content, "generated")}
                    data-testid="button-copy-generated"
                  >
                    {copiedId === "generated" ? (
                      <>
                        <Check className="w-3 h-3 mr-2" />
                        Tersalin
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-2" />
                        Salin {generatedContent.type === "draft" ? "Draf Dokumen" : "Prompt Master"}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Lock className="w-24 h-24 mb-8 text-muted-foreground/10" />
              <p className="text-[10px] italic font-bold text-muted-foreground uppercase tracking-widest px-8">
                Pilih Klausul dan Generate Dokumen untuk Melihat Output
              </p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
