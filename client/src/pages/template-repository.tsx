import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  FileText,
  ClipboardList,
  BookOpen,
  FileCheck,
  Download,
  Copy,
  Check,
  Sparkles,
  Filter,
  ChevronDown,
  ChevronUp,
  Building2,
  AlertTriangle,
  Shield,
  Briefcase,
  Scale,
  Users,
  Folder,
  FileWarning,
  LayoutGrid,
  List,
  X,
} from "lucide-react";
import {
  SMAP_TEMPLATES,
  KATEGORI_DOKUMEN,
  KLAUSUL_ISO,
  AREA_BISNIS,
  type SMAPTemplate,
} from "@/data/smap-templates-full";

const TINGKAT_KRITIS = ["Wajib", "Penting", "Pendukung"] as const;

const kategoriIcons: Record<string, typeof FileText> = {
  Pedoman: BookOpen,
  Kebijakan: Shield,
  SK: Users,
  SOP: ClipboardList,
  "Instruksi Kerja": FileText,
  Formulir: FileCheck,
  Register: FileWarning,
  Laporan: FileText,
  "Berita Acara": Briefcase,
  Matriks: LayoutGrid,
  Program: Scale,
  Checklist: ClipboardList,
};

const kategoriColors: Record<string, string> = {
  Pedoman: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  Kebijakan: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  SK: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  SOP: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "Instruksi Kerja": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
  Formulir: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  Register: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  Laporan: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  "Berita Acara": "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
  Matriks: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  Program: "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300",
  Checklist: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
};

const kritisColors: Record<string, string> = {
  Wajib: "bg-red-500 text-white",
  Penting: "bg-amber-500 text-white",
  Pendukung: "bg-gray-400 text-white",
};

export default function TemplateRepository() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("all");
  const [selectedKlausul, setSelectedKlausul] = useState("all");
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedKritis, setSelectedKritis] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTemplate, setSelectedTemplate] = useState<SMAPTemplate | null>(null);
  const [showPromptDialog, setShowPromptDialog] = useState(false);
  const [additionalContext, setAdditionalContext] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Use placeholders only - no internal company data
  const companyName = "[NAMA PERUSAHAAN]";
  const companyCode = "[KODE]";
  const director = "[NAMA DIREKTUR]";
  const companyAddress = "[ALAMAT PERUSAHAAN]";
  const ketuaFKAP = "[KETUA FKAP]";

  const filteredTemplates = useMemo(() => {
    return SMAP_TEMPLATES.filter((template) => {
      const matchesSearch =
        template.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.klausul.includes(searchTerm);

      const matchesKategori = selectedKategori === "all" || template.kategori === selectedKategori;
      
      const matchesKlausul = selectedKlausul === "all" || template.klausul.startsWith(selectedKlausul);
      
      const matchesArea = selectedArea === "all" || template.areaBisnis.includes(selectedArea);
      
      const matchesKritis = selectedKritis === "all" || template.tingkatKritis === selectedKritis;

      return matchesSearch && matchesKategori && matchesKlausul && matchesArea && matchesKritis;
    });
  }, [searchTerm, selectedKategori, selectedKlausul, selectedArea, selectedKritis]);

  const stats = useMemo(() => {
    const result: Record<string, number> = { total: SMAP_TEMPLATES.length };
    KATEGORI_DOKUMEN.forEach((cat) => {
      result[cat] = SMAP_TEMPLATES.filter((t) => t.kategori === cat).length;
    });
    // Count by tingkat kritis
    result["Wajib"] = SMAP_TEMPLATES.filter((t) => t.tingkatKritis === "Wajib").length;
    result["Penting"] = SMAP_TEMPLATES.filter((t) => t.tingkatKritis === "Penting").length;
    result["Pendukung"] = SMAP_TEMPLATES.filter((t) => t.tingkatKritis === "Pendukung").length;
    return result;
  }, []);

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

  const generatePrompt = (template: SMAPTemplate) => {
    const currentDate = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const year = new Date().getFullYear();

    let prompt = `=== PROMPT GENERATOR DOKUMEN SMAP ===
Gunakan prompt ini di dokumenttender.com atau AI model lainnya (ChatGPT, Gemini, Claude)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

KONTEKS PERUSAHAAN:
- Nama Perusahaan: ${companyName}
- Kode Perusahaan: ${companyCode}
- Direktur: ${director}
- Alamat: ${companyAddress}
- Ketua FKAP: ${ketuaFKAP}
- Bidang Usaha: Jasa Konstruksi
- Standar: SNI ISO 37001:2016

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TUGAS PEMBUATAN DOKUMEN:

Jenis Dokumen: ${template.kategori}
Kode Dokumen: ${template.kode.replace("XYZ", companyCode)}
Nama Dokumen: ${template.nama}
Klausul ISO 37001: ${template.klausul}
Penanggung Jawab: ${template.penanggungJawab}
Frekuensi: ${template.frekuensi}
Tingkat Kritis: ${template.tingkatKritis}
Tanggal: ${currentDate}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INSTRUKSI PEMBUATAN:

${template.promptTemplate}

`;

    if (additionalContext) {
      prompt += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

KONTEKS TAMBAHAN:
${additionalContext}

`;
    }

    prompt += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DASAR HUKUM YANG HARUS DIREFERENSIKAN:
1. UU No. 31 Tahun 1999 jo. UU No. 20 Tahun 2001 tentang Pemberantasan Tindak Pidana Korupsi
2. UU No. 2 Tahun 2017 tentang Jasa Konstruksi
3. PP No. 14 Tahun 2021 tentang Perubahan PP No. 22 Tahun 2020 tentang Peraturan Pelaksanaan UU Jasa Konstruksi
4. Permen PUPR No. 8 Tahun 2022 tentang Standar Kemampuan Usaha Jasa Konstruksi
5. SNI ISO 37001:2016 Sistem Manajemen Anti Penyuapan

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FORMAT OUTPUT:
- Bahasa Indonesia formal dan profesional
- Siap cetak untuk dokumentasi SMAP
- Sesuai standar dokumen konstruksi Indonesia
- Sertakan header, nomor dokumen, tanggal, dan tanda tangan

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    return prompt;
  };

  const handleGeneratePrompt = (template: SMAPTemplate) => {
    setSelectedTemplate(template);
    setShowPromptDialog(true);
  };

  const handleCopyPrompt = () => {
    if (selectedTemplate) {
      const prompt = generatePrompt(selectedTemplate);
      copyToClipboard(prompt, `prompt-${selectedTemplate.id}`);
      toast({
        title: "Prompt berhasil disalin",
        description: "Gunakan di dokumenttender.com atau AI model lainnya",
      });
    }
  };

  const downloadCSV = () => {
    const headers = [
      "ID",
      "Kode Dokumen",
      "Nama Dokumen",
      "Nama (EN)",
      "Kategori",
      "Klausul",
      "Deskripsi",
      "Penanggung Jawab",
      "Frekuensi",
      "Tingkat Kritis",
      "Area Bisnis",
    ];
    const rows = filteredTemplates.map((t) => [
      t.id,
      t.kode,
      t.nama,
      t.namaEn,
      t.kategori,
      t.klausul,
      t.deskripsi,
      t.penanggungJawab,
      t.frekuensi,
      t.tingkatKritis,
      t.areaBisnis,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "template_smap_repository.csv";
    link.click();

    toast({
      title: "Berhasil!",
      description: `${filteredTemplates.length} template berhasil diunduh`,
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedKategori("all");
    setSelectedKlausul("all");
    setSelectedArea("all");
    setSelectedKritis("all");
  };

  const hasActiveFilters =
    searchTerm ||
    selectedKategori !== "all" ||
    selectedKlausul !== "all" ||
    selectedArea !== "all" ||
    selectedKritis !== "all";

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">
              Template Repository SMAP
            </h1>
            <p className="text-muted-foreground">
              200 template dokumen Sistem Manajemen Anti Penyuapan berdasarkan SNI ISO 37001:2016
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              data-testid="button-toggle-view"
            >
              {viewMode === "grid" ? <List className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={downloadCSV} data-testid="button-download-csv">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-2">
        <Card
          className="hover-elevate cursor-pointer col-span-1"
          onClick={() => setSelectedKategori("all")}
        >
          <CardContent className="p-2 text-center">
            <p className="text-xl font-bold text-primary">{stats.total}</p>
            <p className="text-[10px] text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        {KATEGORI_DOKUMEN.map((cat) => {
          const Icon = kategoriIcons[cat] || FileText;
          return (
            <Card
              key={cat}
              className={`hover-elevate cursor-pointer col-span-1 ${selectedKategori === cat ? "ring-2 ring-primary" : ""}`}
              onClick={() => setSelectedKategori(cat)}
            >
              <CardContent className="p-2 text-center">
                <p className="text-xl font-bold">{stats[cat] || 0}</p>
                <p className="text-[10px] text-muted-foreground truncate">{cat}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari template, kode, klausul..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
              data-testid="button-toggle-filters"
            >
              <Filter className="h-4 w-4" />
              Filter
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1">
                  Aktif
                </Badge>
              )}
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} data-testid="button-clear-filters">
                <X className="h-4 w-4 mr-1" />
                Reset
              </Button>
            )}
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Klausul ISO 37001</Label>
                <Select value={selectedKlausul} onValueChange={setSelectedKlausul}>
                  <SelectTrigger data-testid="select-klausul">
                    <SelectValue placeholder="Pilih klausul" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Klausul</SelectItem>
                    {KLAUSUL_ISO.filter(k => !k.kode.includes(".")).map((k) => (
                      <SelectItem key={k.kode} value={k.kode}>
                        {k.kode} - {k.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Area Bisnis</Label>
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger data-testid="select-area">
                    <SelectValue placeholder="Pilih area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Area</SelectItem>
                    {AREA_BISNIS.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Tingkat Kritis</Label>
                <Select value={selectedKritis} onValueChange={setSelectedKritis}>
                  <SelectTrigger data-testid="select-kritis">
                    <SelectValue placeholder="Pilih tingkat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tingkat</SelectItem>
                    {TINGKAT_KRITIS.map((k) => (
                      <SelectItem key={k.id} value={k.id}>
                        {k.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Kategori</Label>
                <Select value={selectedKategori} onValueChange={setSelectedKategori}>
                  <SelectTrigger data-testid="select-kategori">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {TEMPLATE_CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Menampilkan {filteredTemplates.length} dari {SMAP_TEMPLATES.length} template
        </p>
      </div>

      {/* Template Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => {
            const Icon = kategoriIcons[template.kategori] || FileText;
            return (
              <Card
                key={template.id}
                className="hover-elevate cursor-pointer"
                onClick={() => handleGeneratePrompt(template)}
                data-testid={`card-template-${template.id}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${kategoriColors[template.kategori]}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <code className="text-[10px] text-muted-foreground">{template.kode}</code>
                        <CardTitle className="text-sm line-clamp-2">{template.nama}</CardTitle>
                      </div>
                    </div>
                    <Badge className={`text-[10px] ${kritisColors[template.tingkatKritis]}`}>
                      {template.tingkatKritis}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <p className="text-xs text-muted-foreground line-clamp-2">{template.deskripsi}</p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-[10px]">
                      {template.klausul}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px]">
                      {template.areaBisnis}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-[10px] text-muted-foreground">{template.penanggungJawab}</span>
                    <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
                      <Sparkles className="h-3 w-3" />
                      Generate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <ScrollArea className="h-[600px]">
            <div className="divide-y">
              {filteredTemplates.map((template, index) => {
                const Icon = kategoriIcons[template.kategori] || FileText;
                return (
                  <div
                    key={template.id}
                    className="p-4 hover-elevate cursor-pointer flex items-center gap-4"
                    onClick={() => handleGeneratePrompt(template)}
                    data-testid={`row-template-${template.id}`}
                  >
                    <div className="text-xs text-muted-foreground w-8">{index + 1}</div>
                    <div className={`p-2 rounded-lg ${kategoriColors[template.kategori]}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <code className="text-xs text-muted-foreground">{template.kode}</code>
                        <Badge variant="outline" className="text-[10px]">
                          {template.klausul}
                        </Badge>
                      </div>
                      <p className="font-medium text-sm truncate">{template.nama}</p>
                      <p className="text-xs text-muted-foreground truncate">{template.deskripsi}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-[10px] ${kritisColors[template.tingkatKritis]}`}>
                        {template.tingkatKritis}
                      </Badge>
                      <Button size="sm" variant="ghost" className="h-7">
                        <Sparkles className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </Card>
      )}

      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">Tidak ada template ditemukan</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Coba ubah filter atau kata kunci pencarian
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Reset Filter
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Generate Prompt Dialog */}
      <Dialog open={showPromptDialog} onOpenChange={setShowPromptDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Generate Prompt: {selectedTemplate?.nama}
            </DialogTitle>
            <DialogDescription>
              Klausul {selectedTemplate?.klausul} - {selectedTemplate?.kategori}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 flex-1 overflow-auto">
            <div>
              <Label className="text-sm">Konteks Tambahan (Opsional)</Label>
              <Textarea
                placeholder="Tambahkan konteks spesifik seperti: jenis proyek, lokasi, nilai kontrak, struktur organisasi khusus, dll..."
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                className="mt-1.5 h-20"
                data-testid="input-additional-context"
              />
            </div>

            <div>
              <Label className="text-sm">Preview Prompt</Label>
              <ScrollArea className="h-[300px] mt-1.5 rounded-md border bg-muted/50 p-4">
                <pre className="text-xs whitespace-pre-wrap font-mono">
                  {selectedTemplate ? generatePrompt(selectedTemplate) : ""}
                </pre>
              </ScrollArea>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Building2 className="h-4 w-4" />
              {companyName}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowPromptDialog(false)}>
                Tutup
              </Button>
              <Button onClick={handleCopyPrompt} className="gap-2" data-testid="button-copy-prompt">
                {copiedId === `prompt-${selectedTemplate?.id}` ? (
                  <>
                    <Check className="h-4 w-4" />
                    Tersalin!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Salin Prompt
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
