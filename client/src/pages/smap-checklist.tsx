import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Shield,
  Target,
  Play,
  BarChart3,
  Download,
  RotateCcw,
  ClipboardCheck,
  Building2,
  Users,
  FileWarning,
} from "lucide-react";

interface ChecklistItem {
  id: string;
  no: number;
  pertanyaan: string;
  klausul?: string;
  status: "ada" | "tidak" | "pending";
}

interface ChecklistSection {
  id: string;
  title: string;
  titleEn: string;
  icon: typeof Shield;
  color: string;
  items: ChecklistItem[];
}

const CHECKLIST_DATA: ChecklistSection[] = [
  {
    id: "komitmen",
    title: "Komitmen",
    titleEn: "Commitment",
    icon: Shield,
    color: "text-blue-600",
    items: [
      { id: "K1", no: 1, pertanyaan: "Apakah manajemen puncak korporasi seperti pemilik, direksi, dan komisaris memiliki komitmen anti-penyuapan tertulis?", klausul: "5.1", status: "pending" },
      { id: "K2", no: 2, pertanyaan: "Apakah terdapat pernyataan anti-penyuapan yang harus ditandatangani seluruh pegawai korporasi seperti tercantum dalam kontrak kerja atau formulir pernyataan lainnya?", klausul: "7.2.2.3", status: "pending" },
      { id: "K3", no: 3, pertanyaan: "Apakah terdapat kebijakan dan/atau peraturan anti-korupsi tertulis yang mengacu kepada ISO 37001:2016 dan atau UU Tipikor yang wajib ditaati seluruh pegawai korporasi?", klausul: "5.2", status: "pending" },
      { id: "K4", no: 4, pertanyaan: "Apakah kebijakan dan/atau peraturan ini memiliki definisi tentang suap/penyuapan?", klausul: "5.2", status: "pending" },
      { id: "K5", no: 5, pertanyaan: "Apakah kebijakan dan/atau peraturan ini memberikan penjelasan di mana saja penyuapan kemungkinan besar terjadi?", klausul: "4.5", status: "pending" },
      { id: "K6", no: 6, pertanyaan: "Apakah korporasi mempunyai unit atau individu tertentu yang memastikan upaya kontrol dalam mencegah penyuapan?", klausul: "5.3.2", status: "pending" },
      { id: "K7", no: 7, pertanyaan: "Apakah unit atau individu tertentu ini bertanggung jawab atas audit internal?", klausul: "9.2", status: "pending" },
      { id: "K8", no: 8, pertanyaan: "Apakah unit atau individu tertentu ini melaksanakan pemberian sanksi dan penghargaan terhadap pegawai korporasi?", klausul: "7.2.2.2", status: "pending" },
      { id: "K9", no: 9, pertanyaan: "Apakah unit atau individu tertentu ini melaksanakan upaya komunikasi dan pelatihan atas upaya pencegahan penyuapan?", klausul: "7.2, 7.4", status: "pending" },
    ],
  },
  {
    id: "perencanaan",
    title: "Perencanaan",
    titleEn: "Planning",
    icon: Target,
    color: "text-green-600",
    items: [
      { id: "P1", no: 1, pertanyaan: "Apakah korporasi melakukan identifikasi dan pemetaan risiko yang mencakup titik rawan dan modus penyuapan?", klausul: "4.5", status: "pending" },
      { id: "P2", no: 2, pertanyaan: "Apakah penilaian risiko penyuapan dilakukan atas seluruh aktivitas organisasi korporasi?", klausul: "4.5", status: "pending" },
      { id: "P3", no: 3, pertanyaan: "Apakah penilaian risiko penyuapan dilakukan secara berkala dan diperbaharui berdasarkan perkembangan modus penyuapan?", klausul: "4.5", status: "pending" },
    ],
  },
  {
    id: "pelaksanaan",
    title: "Pelaksanaan",
    titleEn: "Implementation",
    icon: Play,
    color: "text-amber-600",
    items: [
      { id: "L1", no: 1, pertanyaan: "Apakah korporasi melakukan uji tuntas atas penilaian risiko korupsi atas karyawan, pelanggan, distributor, vendor, dan agen?", klausul: "8.2", status: "pending" },
      { id: "L2", no: 2, pertanyaan: "Apakah kebijakan dan/atau peraturan anti-korupsi juga mengikat pihak eksternal, seperti distributor, mitra usaha, perwakilan, agen, dan vendor yang berhubungan dengan korporasi?", klausul: "8.2, 8.3", status: "pending" },
      { id: "L3", no: 3, pertanyaan: "Apakah kebijakan dan/atau peraturan anti-korupsi mencakup sistem pengawasan, pemberian sanksi, dan evaluasi kepada pihak internal dan eksternal korporasi?", klausul: "8.1", status: "pending" },
      { id: "L4", no: 4, pertanyaan: "Apakah kebijakan dan/atau peraturan anti-korupsi memuat pengaturan gratifikasi swasta dan publik, kontribusi dana politik, dan konflik kepentingan?", klausul: "8.7, 8.9, 8.10", status: "pending" },
      { id: "L5", no: 5, pertanyaan: "Apakah korporasi mempunyai sistem pelaporan dan pengaduan atas suatu korupsi yang menjamin kerahasiaan, perlindungan, dan keamanan bagi pelapor, baik internal maupun eksternal?", klausul: "8.9", status: "pending" },
      { id: "L6", no: 6, pertanyaan: "Apakah korporasi mempunyai sistem pencatatan, dokumentasi, pengarsipan keuangan, dan administrasi lain yang transparan dan patuh terhadap UU Tipikor?", klausul: "7.5, 8.3", status: "pending" },
      { id: "L7", no: 7, pertanyaan: "Apakah korporasi mensosialisasikan kebijakan dan/atau peraturan anti-penyuapan secara berkala kepada seluruh pegawai?", klausul: "7.4", status: "pending" },
    ],
  },
  {
    id: "evaluasi",
    title: "Evaluasi",
    titleEn: "Evaluation",
    icon: BarChart3,
    color: "text-purple-600",
    items: [
      { id: "E1", no: 1, pertanyaan: "Apakah korporasi mempunyai sistem pemantauan dan evaluasi atas peraturan anti-penyuapan?", klausul: "9.1", status: "pending" },
      { id: "E2", no: 2, pertanyaan: "Apakah sistem pemantauan dan evaluasi anti-penyuapan dikomunikasikan secara berkala kepada seluruh pegawai korporasi?", klausul: "9.1, 7.4", status: "pending" },
      { id: "E3", no: 3, pertanyaan: "Apakah hasil pemantauan dan evaluasi terkait penyuapan dikomunikasikan secara berkala kepada seluruh manajemen korporasi sebagai pembelajaran?", klausul: "9.3", status: "pending" },
      { id: "E4", no: 4, pertanyaan: "Apakah korporasi mempunyai Komite Audit?", klausul: "9.2", status: "pending" },
    ],
  },
];

const DOKUMEN_PERENCANAAN = [
  { no: 1, nama: "Kebijakan anti penyuapan", klausul: "5.2", besar: true, menengah: true, kecil: true },
  { no: 2, nama: "Identifikasi risiko", klausul: "4.5", besar: true, menengah: true, kecil: true },
  { no: 3, nama: "Memahami organisasi, dan konteksnya", klausul: "4.1", besar: true, menengah: true, kecil: true },
  { no: 4, nama: "Sasaran anti penyuapan dan perencanaan untuk mencapainya", klausul: "6.2", besar: true, menengah: true, kecil: true },
  { no: 5, nama: "Sumber daya, Struktur organisasi, dan Pertanggungjawaban", klausul: "7.1", besar: true, menengah: true, kecil: true },
  { no: 6, nama: "Kompetensi, Pelatihan, dan Kepedulian", klausul: "7.2", besar: true, menengah: true, kecil: true },
  { no: 7, nama: "Komunikasi, Partisipasi, dan Konsultasi", klausul: "7.4", besar: true, menengah: true, kecil: true },
  { no: 8, nama: "Dokumentasi", klausul: "7.5", besar: true, menengah: true, kecil: true },
  { no: 9, nama: "Pengendalian Dokumen", klausul: "7.5.3", besar: true, menengah: true, kecil: true },
  { no: 10, nama: "Pengendalian Operasional", klausul: "8.1", besar: true, menengah: true, kecil: true },
  { no: 11, nama: "Kesiagaan dan Tanggap Darurat", klausul: "8.8", besar: true, menengah: true, kecil: true },
  { no: 12, nama: "Pengukuran dan Pemantauan", klausul: "9.1", besar: true, menengah: true, kecil: true },
  { no: 13, nama: "Tinjauan fungsi kepatuhan anti Penyuapan", klausul: "9.4", besar: true, menengah: true, kecil: true },
  { no: 14, nama: "Pengendalian informasi terdokumentasi", klausul: "7.5.3", besar: true, menengah: true, kecil: true },
  { no: 15, nama: "Audit Internal", klausul: "9.2", besar: true, menengah: true, kecil: true },
  { no: 16, nama: "Tinjauan Manajemen", klausul: "9.3", besar: true, menengah: true, kecil: true },
];

const DOKUMEN_REKAMAN = [
  { no: 1, nama: "Kepemimpinan dan komitmen", klausul: "5.1", besar: true, menengah: true, kecil: true },
  { no: 2, nama: "Komitmen anti penyuapan", klausul: "8.6", besar: true, menengah: true, kecil: true },
  { no: 3, nama: "Penilaian risiko penyuapan", klausul: "4.5", besar: true, menengah: true, kecil: true },
  { no: 4, nama: "Informasi terdokumentasi", klausul: "7.5", besar: true, menengah: true, kecil: true },
  { no: 5, nama: "Pemantauan, pengukuran, analisis, dan evaluasi", klausul: "9.1", besar: true, menengah: true, kecil: true },
  { no: 6, nama: "Laporan hasil audit internal", klausul: "9.2", besar: true, menengah: true, kecil: true },
];

export default function SMAPChecklist() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("checklist");
  const [checklistData, setChecklistData] = useState<ChecklistSection[]>(CHECKLIST_DATA);

  const updateStatus = (sectionId: string, itemId: string, status: "ada" | "tidak" | "pending") => {
    setChecklistData(prev => prev.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: section.items.map(item => {
            if (item.id === itemId) {
              return { ...item, status };
            }
            return item;
          })
        };
      }
      return section;
    }));
  };

  const stats = useMemo(() => {
    let total = 0;
    let ada = 0;
    let tidak = 0;
    let pending = 0;

    checklistData.forEach(section => {
      section.items.forEach(item => {
        total++;
        if (item.status === "ada") ada++;
        else if (item.status === "tidak") tidak++;
        else pending++;
      });
    });

    const compliance = total > 0 ? Math.round((ada / total) * 100) : 0;
    return { total, ada, tidak, pending, compliance };
  }, [checklistData]);

  const sectionStats = useMemo(() => {
    return checklistData.map(section => {
      const total = section.items.length;
      const ada = section.items.filter(i => i.status === "ada").length;
      const compliance = total > 0 ? Math.round((ada / total) * 100) : 0;
      return { id: section.id, total, ada, compliance };
    });
  }, [checklistData]);

  const resetChecklist = () => {
    setChecklistData(CHECKLIST_DATA);
    toast({ title: "Checklist berhasil direset" });
  };

  const exportToCSV = () => {
    const headers = ["Bagian", "No", "Pertanyaan", "Klausul", "Status"];
    const rows: string[][] = [];

    checklistData.forEach(section => {
      section.items.forEach(item => {
        rows.push([
          section.title,
          item.no.toString(),
          item.pertanyaan,
          item.klausul || "-",
          item.status === "ada" ? "ADA" : item.status === "tidak" ? "TIDAK" : "BELUM DINILAI"
        ]);
      });
    });

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "checklist_smap_permen_pu_08_2022.csv";
    link.click();

    toast({ title: "Berhasil!", description: "Checklist berhasil diunduh" });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2" data-testid="text-page-title">
              <ClipboardCheck className="h-6 w-6 text-primary" />
              Checklist SMAP - Permen PU 08/2022
            </h1>
            <p className="text-muted-foreground">
              Standar Dokumen Penerapan Sistem Manajemen Anti Penyuapan berdasarkan Permen PUPR No. 8 Tahun 2022
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={resetChecklist} data-testid="button-reset">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={exportToCSV} data-testid="button-export">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">{stats.compliance}%</p>
                <p className="text-xs text-muted-foreground">Tingkat Kepatuhan</p>
              </div>
              <Shield className="h-8 w-8 text-primary/20" />
            </div>
            <Progress value={stats.compliance} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.ada}</p>
                <p className="text-xs text-muted-foreground">Terpenuhi</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.tidak}</p>
                <p className="text-xs text-muted-foreground">Tidak Terpenuhi</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Belum Dinilai</p>
              </div>
              <AlertCircle className="h-8 w-8 text-amber-600/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Item</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-lg">
          <TabsTrigger value="checklist" className="gap-2" data-testid="tab-checklist">
            <ClipboardCheck className="h-4 w-4" />
            Cek List
          </TabsTrigger>
          <TabsTrigger value="perencanaan" className="gap-2" data-testid="tab-perencanaan">
            <Target className="h-4 w-4" />
            Perencanaan
          </TabsTrigger>
          <TabsTrigger value="rekaman" className="gap-2" data-testid="tab-rekaman">
            <FileText className="h-4 w-4" />
            Rekaman
          </TabsTrigger>
        </TabsList>

        <TabsContent value="checklist" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {checklistData.map((section, sIdx) => {
              const Icon = section.icon;
              const sStats = sectionStats.find(s => s.id === section.id);
              return (
                <Card key={section.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Icon className={`h-5 w-5 ${section.color}`} />
                        {section.title}
                      </CardTitle>
                      <Badge variant="outline">
                        {sStats?.ada}/{sStats?.total} ({sStats?.compliance}%)
                      </Badge>
                    </div>
                    <CardDescription>{section.titleEn}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-3">
                        {section.items.map((item) => (
                          <div
                            key={item.id}
                            className={`p-3 rounded-lg border transition-colors ${
                              item.status === "ada"
                                ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                                : item.status === "tidak"
                                ? "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
                                : "bg-muted/50"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-xs font-bold text-muted-foreground w-6">
                                {item.no}.
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm leading-relaxed">{item.pertanyaan}</p>
                                {item.klausul && (
                                  <Badge variant="secondary" className="text-[10px] mt-2">
                                    Klausul {item.klausul}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-3 pl-9">
                              <Button
                                size="sm"
                                variant={item.status === "ada" ? "default" : "outline"}
                                className="h-7 text-xs gap-1"
                                onClick={() => updateStatus(section.id, item.id, "ada")}
                                data-testid={`button-ada-${item.id}`}
                              >
                                <CheckCircle2 className="h-3 w-3" />
                                Ada
                              </Button>
                              <Button
                                size="sm"
                                variant={item.status === "tidak" ? "destructive" : "outline"}
                                className="h-7 text-xs gap-1"
                                onClick={() => updateStatus(section.id, item.id, "tidak")}
                                data-testid={`button-tidak-${item.id}`}
                              >
                                <XCircle className="h-3 w-3" />
                                Tidak
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="perencanaan" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Dokumen Perencanaan SMAP
              </CardTitle>
              <CardDescription>
                16 dokumen perencanaan yang wajib dimiliki sesuai Permen PU No. 08/2022
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">No</th>
                      <th className="text-left p-3 font-semibold">Prinsip SMAP</th>
                      <th className="text-left p-3 font-semibold">Klausul</th>
                      <th className="text-center p-3 font-semibold">Besar</th>
                      <th className="text-center p-3 font-semibold">Menengah/Spesialis</th>
                      <th className="text-center p-3 font-semibold">Kecil</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DOKUMEN_PERENCANAAN.map((doc) => (
                      <tr key={doc.no} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-medium">{doc.no}</td>
                        <td className="p-3">{doc.nama}</td>
                        <td className="p-3">
                          <Badge variant="outline" className="text-xs">
                            {doc.klausul}
                          </Badge>
                        </td>
                        <td className="p-3 text-center">
                          {doc.besar && <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />}
                        </td>
                        <td className="p-3 text-center">
                          {doc.menengah && <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />}
                        </td>
                        <td className="p-3 text-center">
                          {doc.kecil && <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rekaman" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Dokumen Rekaman Pelaksanaan SMAP
              </CardTitle>
              <CardDescription>
                6 dokumen rekaman pelaksanaan yang wajib dimiliki sesuai Permen PU No. 08/2022
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">No</th>
                      <th className="text-left p-3 font-semibold">Prinsip SMAP</th>
                      <th className="text-left p-3 font-semibold">Klausul</th>
                      <th className="text-center p-3 font-semibold">Besar</th>
                      <th className="text-center p-3 font-semibold">Menengah/Spesialis</th>
                      <th className="text-center p-3 font-semibold">Kecil</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DOKUMEN_REKAMAN.map((doc) => (
                      <tr key={doc.no} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-medium">{doc.no}</td>
                        <td className="p-3">{doc.nama}</td>
                        <td className="p-3">
                          <Badge variant="outline" className="text-xs">
                            {doc.klausul}
                          </Badge>
                        </td>
                        <td className="p-3 text-center">
                          {doc.besar && <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />}
                        </td>
                        <td className="p-3 text-center">
                          {doc.menengah && <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />}
                        </td>
                        <td className="p-3 text-center">
                          {doc.kecil && <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Reference Info */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <FileWarning className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold mb-1">Referensi Regulasi:</p>
              <ul className="text-muted-foreground space-y-1">
                <li>Peraturan Menteri PUPR No. 8 Tahun 2022 tentang Standar Kemampuan Usaha Jasa Konstruksi</li>
                <li>SNI ISO 37001:2016 - Sistem Manajemen Anti Penyuapan</li>
                <li>UU No. 31 Tahun 1999 jo. UU No. 20 Tahun 2001 tentang Pemberantasan Tindak Pidana Korupsi</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
