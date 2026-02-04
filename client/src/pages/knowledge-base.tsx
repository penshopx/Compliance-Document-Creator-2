import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useIndustry } from "@/hooks/use-industry";
import {
  Search,
  BookOpen,
  FileText,
  Building2,
  HelpCircle,
  Scale,
  ClipboardCheck,
  Award,
  Briefcase,
  Cog,
  ChevronRight,
  Lightbulb,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const COMPLIANCE_DOMAINS = [
  {
    id: "legalitas",
    name: "Legalitas",
    shortName: "Legal",
    icon: Scale,
    color: "blue",
    description: "Dokumen dasar hukum perusahaan",
    scope: "Meliputi pendirian badan usaha, pendaftaran perizinan dasar, perpajakan, dan dokumen identitas perusahaan.",
    keyDocuments: [
      { name: "Akta Pendirian", desc: "Dokumen notaris pendirian badan usaha" },
      { name: "NIB", desc: "Nomor Induk Berusaha melalui OSS" },
      { name: "NPWP", desc: "Nomor Pokok Wajib Pajak" },
      { name: "TDP", desc: "Tanda Daftar Perusahaan" },
      { name: "Domisili", desc: "Surat Keterangan Domisili" },
      { name: "PKP", desc: "Pengusaha Kena Pajak" },
    ],
    tips: [
      "Pastikan akta pendirian sudah disahkan Kemenkumham",
      "NIB adalah pintu gerbang semua perizinan berusaha",
      "Perbarui data perusahaan di OSS secara berkala"
    ],
  },
  {
    id: "perijinan",
    name: "Perijinan",
    shortName: "Izin",
    icon: ClipboardCheck,
    color: "green",
    description: "Izin operasional dan sektoral",
    scope: "Meliputi izin usaha sektoral, izin lokasi, izin operasional, dan izin khusus berdasarkan jenis kegiatan usaha.",
    keyDocuments: [
      { name: "SBU", desc: "Sertifikat Badan Usaha (konstruksi)" },
      { name: "SIUP", desc: "Surat Izin Usaha Perdagangan" },
      { name: "IUPTL", desc: "Izin Usaha Penyediaan Tenaga Listrik" },
      { name: "Izin Lingkungan", desc: "Izin kegiatan berdampak lingkungan" },
      { name: "Izin Operasional", desc: "Izin menjalankan kegiatan usaha" },
      { name: "Izin Lokasi", desc: "Izin penggunaan lahan" },
    ],
    tips: [
      "Identifikasi KBLI yang tepat untuk usaha Anda",
      "Perhatikan tingkat risiko usaha (rendah/menengah/tinggi)",
      "Lengkapi persyaratan teknis sebelum mengajukan"
    ],
  },
  {
    id: "sertifikasi",
    name: "Sertifikasi",
    shortName: "Sertifikat",
    icon: Award,
    color: "amber",
    description: "Standar nasional dan internasional",
    scope: "Meliputi sertifikasi manajemen mutu, lingkungan, K3, anti-penyuapan, dan sertifikasi kompetensi profesional.",
    keyDocuments: [
      { name: "ISO 9001", desc: "Sistem Manajemen Mutu" },
      { name: "ISO 14001", desc: "Sistem Manajemen Lingkungan" },
      { name: "ISO 45001", desc: "Sistem Manajemen K3" },
      { name: "SNI ISO 37001", desc: "Sistem Manajemen Anti Penyuapan" },
      { name: "SKK", desc: "Sertifikat Kompetensi Kerja" },
      { name: "SKTTK", desc: "Sertifikat Keterampilan Tenaga Teknik" },
    ],
    tips: [
      "Pilih lembaga sertifikasi terakreditasi KAN",
      "Siapkan dokumentasi sesuai klausul standar",
      "Lakukan audit internal sebelum audit sertifikasi"
    ],
  },
  {
    id: "tender",
    name: "Tender",
    shortName: "Tender",
    icon: Briefcase,
    color: "purple",
    description: "Dokumen pengadaan barang/jasa",
    scope: "Meliputi dokumen kualifikasi, penawaran teknis dan harga, kontrak, dan administrasi pengadaan.",
    keyDocuments: [
      { name: "Dokumen Kualifikasi", desc: "Bukti kemampuan teknis dan administratif" },
      { name: "Proposal Teknis", desc: "Metode pelaksanaan dan pendekatan" },
      { name: "RAB", desc: "Rencana Anggaran Biaya" },
      { name: "Jaminan Penawaran", desc: "Garansi keseriusan peserta" },
      { name: "Kontrak/SPK", desc: "Dokumen perjanjian kerja" },
      { name: "TKDN", desc: "Tingkat Komponen Dalam Negeri" },
    ],
    tips: [
      "Daftar di LPSE dan SIKAP untuk tender pemerintah",
      "Pastikan semua dokumen kualifikasi masih berlaku",
      "Perhatikan jadwal tahapan tender dengan cermat"
    ],
  },
  {
    id: "operasional",
    name: "Operasional",
    shortName: "Ops",
    icon: Cog,
    color: "cyan",
    description: "Dokumen kerja dan operasional",
    scope: "Meliputi SOP, instruksi kerja, formulir operasional, laporan berkala, dan dokumentasi quality control.",
    keyDocuments: [
      { name: "SOP", desc: "Standard Operating Procedure" },
      { name: "Instruksi Kerja", desc: "Panduan detail pelaksanaan tugas" },
      { name: "Formulir Operasional", desc: "Format pencatatan kegiatan" },
      { name: "Laporan Berkala", desc: "Dokumentasi progress" },
      { name: "Checklist QC", desc: "Pemeriksaan kualitas" },
      { name: "Laporan HSE", desc: "Dokumentasi keselamatan kerja" },
    ],
    tips: [
      "Dokumentasikan semua proses secara konsisten",
      "Gunakan template standar untuk efisiensi",
      "Review dan update SOP secara berkala"
    ],
  },
];

const PLATFORM_FEATURES = [
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Halaman utama dengan ringkasan status kepatuhan perusahaan",
    howTo: [
      "Lihat ringkasan statistik perusahaan",
      "Akses cepat ke 5 Domain Kepatuhan",
      "Navigasi ke fitur-fitur utama"
    ],
  },
  {
    id: "template-repository",
    title: "Repository Template",
    description: "Pusat koleksi 270+ template dokumen kepatuhan untuk berbagai industri",
    howTo: [
      "Pilih industri yang relevan",
      "Filter berdasarkan domain kepatuhan",
      "Cari template dengan kata kunci",
      "Preview dan generate dokumen"
    ],
  },
  {
    id: "document-builder",
    title: "Document Builder",
    description: "Fitur untuk membuat dokumen kepatuhan dengan bantuan AI",
    howTo: [
      "Pilih jenis dokumen yang ingin dibuat",
      "Isi data perusahaan",
      "AI akan generate konten",
      "Edit dan export dokumen"
    ],
  },
  {
    id: "pdca-generator",
    title: "PDCA Generator",
    description: "Menyusun dokumen berdasarkan siklus Plan-Do-Check-Act dengan 51 klausul ISO 37001",
    howTo: [
      "Pilih fase PDCA (Plan/Do/Check/Act)",
      "Pilih klausul yang ingin dikerjakan",
      "Isi narasi konteks perusahaan",
      "Generate dokumen dengan AI"
    ],
  },
  {
    id: "company-profile",
    title: "Profil Perusahaan",
    description: "Pusat data master perusahaan yang digunakan di seluruh platform",
    howTo: [
      "Lengkapi data perusahaan dasar",
      "Tambahkan data pegawai",
      "Kelola kualifikasi dan sertifikasi",
      "Data otomatis tersedia untuk dokumen"
    ],
  },
];

const FAQ_ITEMS = [
  {
    question: "Bagaimana cara memulai menggunakan Compliance Hub?",
    answer: "1. Login dengan akun Anda\n2. Lengkapi profil perusahaan di menu Company\n3. Pilih industri yang sesuai\n4. Eksplorasi template di Repository\n5. Mulai generate dokumen yang dibutuhkan"
  },
  {
    question: "Apa itu SMAP dan siapa yang membutuhkannya?",
    answer: "SMAP (Sistem Manajemen Anti Penyuapan) adalah sistem berdasarkan SNI ISO 37001:2016. Wajib untuk vendor/kontraktor Kementerian PUPR dan direkomendasikan untuk perusahaan yang ingin membuktikan komitmen anti korupsi."
  },
  {
    question: "Apa perbedaan SKA/SKT dengan SKK?",
    answer: "SKA (Sertifikat Keahlian) dan SKT (Sertifikat Keterampilan) sudah digantikan oleh SKK (Sertifikat Kompetensi Kerja) sejak berlakunya PP 22/2020. SKK menggabungkan keduanya dalam satu sistem sertifikasi."
  },
  {
    question: "Apakah SIUJK masih diperlukan?",
    answer: "SIUJK (Surat Izin Usaha Jasa Konstruksi) sudah tidak berlaku sejak adanya OSS. Sekarang digantikan oleh NIB (Nomor Induk Berusaha) yang diterbitkan melalui sistem OSS."
  },
  {
    question: "Industri apa saja yang didukung platform ini?",
    answer: "Compliance Hub mendukung 20 industri: SMAP, Pancek, Konstruksi, Energi, Migas, Lingkungan, UMKM, ISO, K3, Tender, Keuangan, Kesehatan, Pendidikan, Teknologi, Pertanian, Manufaktur, Properti, Logistik, Pariwisata, dan Telekomunikasi."
  },
  {
    question: "Bagaimana sistem pembayaran dan berlangganan?",
    answer: "Tersedia paket SMAP (Rp 2,5jt - 5jt/bulan) dan Pancek (Rp 1,5jt - 2,5jt/bulan). Pembayaran via transfer bank atau e-wallet/QRIS. Konfirmasi pembayaran via app atau WhatsApp."
  },
];

export default function KnowledgeBasePage() {
  const { currentIndustry } = useIndustry();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("domains");

  const colorClasses: Record<string, { bg: string; icon: string; badge: string }> = {
    blue: { bg: "bg-blue-100 dark:bg-blue-900/30", icon: "text-blue-600 dark:text-blue-400", badge: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
    green: { bg: "bg-green-100 dark:bg-green-900/30", icon: "text-green-600 dark:text-green-400", badge: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
    amber: { bg: "bg-amber-100 dark:bg-amber-900/30", icon: "text-amber-600 dark:text-amber-400", badge: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" },
    purple: { bg: "bg-purple-100 dark:bg-purple-900/30", icon: "text-purple-600 dark:text-purple-400", badge: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" },
    cyan: { bg: "bg-cyan-100 dark:bg-cyan-900/30", icon: "text-cyan-600 dark:text-cyan-400", badge: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300" },
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2" data-testid="text-knowledge-title">
          Knowledge Base
        </h1>
        <p className="text-muted-foreground">
          Pusat informasi tentang kepatuhan, regulasi, dan panduan penggunaan platform
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari topik, fitur, atau pertanyaan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-knowledge-search"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="domains" data-testid="tab-domains">
            <Scale className="h-4 w-4 mr-2" />
            5 Domain
          </TabsTrigger>
          <TabsTrigger value="features" data-testid="tab-features">
            <Cog className="h-4 w-4 mr-2" />
            Fitur
          </TabsTrigger>
          <TabsTrigger value="faq" data-testid="tab-faq">
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="tips" data-testid="tab-tips">
            <Lightbulb className="h-4 w-4 mr-2" />
            Tips
          </TabsTrigger>
        </TabsList>

        <TabsContent value="domains">
          <div className="grid gap-6">
            {COMPLIANCE_DOMAINS.map((domain) => {
              const colors = colorClasses[domain.color] || colorClasses.blue;
              const Icon = domain.icon;
              return (
                <Card key={domain.id} data-testid={`card-domain-${domain.id}`}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}>
                        <Icon className={`h-6 w-6 ${colors.icon}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">{domain.name}</CardTitle>
                          <Badge className={colors.badge}>{domain.shortName}</Badge>
                        </div>
                        <CardDescription>{domain.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          Ruang Lingkup
                        </h4>
                        <p className="text-sm text-muted-foreground">{domain.scope}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Dokumen Utama
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {domain.keyDocuments.map((doc, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm">
                              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                              <div>
                                <span className="font-medium">{doc.name}</span>
                                <span className="text-muted-foreground"> - {doc.desc}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <Lightbulb className="h-4 w-4" />
                          Tips
                        </h4>
                        <ul className="space-y-1">
                          {domain.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="features">
          <div className="grid gap-4">
            {PLATFORM_FEATURES.map((feature) => (
              <Card key={feature.id} data-testid={`card-feature-${feature.id}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    {feature.title}
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <h4 className="font-medium text-sm mb-2">Cara Menggunakan:</h4>
                  <ol className="space-y-1">
                    {feature.howTo.map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="font-medium text-primary">{i + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Pertanyaan Umum (FAQ)
              </CardTitle>
              <CardDescription>
                Jawaban untuk pertanyaan yang sering diajukan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {FAQ_ITEMS.map((item, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left" data-testid={`accordion-faq-${i}`}>
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="text-muted-foreground whitespace-pre-line">
                        {item.answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">1.</span>
                    <span>Lengkapi profil perusahaan terlebih dahulu untuk memaksimalkan fitur auto-populate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">2.</span>
                    <span>Gunakan filter industri dan domain untuk menemukan template yang tepat</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">3.</span>
                    <span>Review dan sesuaikan output AI dengan konteks spesifik perusahaan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">4.</span>
                    <span>Simpan dokumen yang sudah di-generate untuk referensi di masa depan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">5.</span>
                    <span>Perbarui data perusahaan secara berkala agar dokumen selalu akurat</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  Perhatian Penting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500">!</span>
                    <span>SKA/SKT sudah diganti SKK - gunakan istilah yang benar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500">!</span>
                    <span>SIUJK sudah diganti NIB melalui OSS</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500">!</span>
                    <span>SMAP wajib untuk vendor PUPR sejak 2022</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500">!</span>
                    <span>Pastikan semua dokumen masih berlaku sebelum tender</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500">!</span>
                    <span>Konsultasikan dengan ahli untuk kasus kepatuhan kompleks</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
