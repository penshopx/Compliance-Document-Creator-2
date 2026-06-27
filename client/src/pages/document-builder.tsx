import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useIndustry } from "@/hooks/use-industry";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Copy,
  Check,
  Sparkles,
  Building2,
  Users,
  FileCheck,
  BookOpen,
  ClipboardList,
  Scale,
  FileWarning,
  Briefcase,
  Shield,
  Wand2,
  Info,
  Download,
  Loader2,
  FileSignature,
} from "lucide-react";

const DOCUMENT_TEMPLATES = [
  {
    code: "PEDOMAN-SMAP",
    title: "Pedoman SMAP (Manual)",
    titleEn: "ABMS Manual/Guideline",
    description: "Dokumen induk SMAP lengkap dengan semua klausul ISO 37001",
    clause: "4-10",
    category: "Pedoman",
    icon: BookOpen,
    color: "bg-indigo-500",
    promptTemplate: `Buatkan dokumen PEDOMAN SISTEM MANAJEMEN ANTI PENYUAPAN (SMAP) lengkap berdasarkan SNI ISO 37001:2016 untuk perusahaan jasa konstruksi.

STRUKTUR DOKUMEN WAJIB:
1. COVER PAGE dengan:
   - Judul: "PEDOMAN SISTEM MANAJEMEN ANTI PENYUAPAN (SMAP)"
   - Logo placeholder: [LOGO PERUSAHAAN]
   - Nomor Dokumen: {{companyCode}}-P-SMAP-PK-01
   - Edisi/Revisi: 01/00
   - Tanggal Berlaku: {{currentDate}}

2. LEMBAR PENGESAHAN dengan tabel:
   - Disusun oleh: Ketua FKAP ({{ketuaFKAP}})
   - Diperiksa oleh: Staf Administrasi
   - Disahkan oleh: Direktur ({{director}})

3. LEMBAR PERUBAHAN (tabel kosong untuk tracking revisi)

4. DAFTAR ISI mengikuti klausul:
   - 1. Lingkup
   - 2. Acuan Normatif
   - 3. Istilah dan Definisi
   - 4. Konteks Organisasi (4.1-4.5)
   - 5. Kepemimpinan (5.1-5.3)
   - 6. Perencanaan (6.1-6.2)
   - 7. Pendukung (7.1-7.5)
   - 8. Operasi (8.1-8.10)
   - 9. Evaluasi Kinerja (9.1-9.4)
   - 10. Perbaikan (10.1-10.2)

5. ISI LENGKAP setiap klausul dengan penjelasan detail

6. LAMPIRAN WAJIB:
   - Konteks Organisasi
   - Komitmen Anti Penyuapan
   - Kebijakan Anti Penyuapan
   - Pakta Integritas
   - Sasaran dan Program Anti Penyuapan
   - Kebijakan Penerimaan Hadiah
   - Matriks Komunikasi
   - SK Struktur & FKAP

Format: Dokumen formal siap cetak dalam Bahasa Indonesia.`,
  },
  {
    code: "SK-FKAP",
    title: "SK Penetapan Tim FKAP",
    titleEn: "FKAP Team Appointment Decree",
    description: "Surat Keputusan penetapan tim Fungsi Kepatuhan Anti Penyuapan",
    clause: "5.3.2",
    category: "Surat Keputusan",
    icon: Users,
    color: "bg-blue-500",
    promptTemplate: `Buatkan SURAT KEPUTUSAN DIREKTUR tentang PENETAPAN TIM FUNGSI KEPATUHAN ANTI PENYUAPAN (FKAP) berdasarkan SNI ISO 37001:2016.

STRUKTUR DOKUMEN:
1. KOP SURAT dengan identitas perusahaan
2. Nomor SK: {{companyCode}}/SK-FKAP/{{year}}
3. MENIMBANG: Alasan pembentukan tim FKAP
4. MENGINGAT: Dasar hukum (UU Anti Korupsi, Permen PU 08/2022, SNI ISO 37001)
5. MEMUTUSKAN:
   - MENETAPKAN susunan Tim FKAP:
     * Ketua FKAP: {{ketuaFKAP}}
     * Wakil Ketua: [nama]
     * Sekretaris: [nama]
     * Anggota: [daftar nama]
   
6. TUGAS DAN WEWENANG FKAP:
   - Mengawasi pengembangan dan penerapan SMAP
   - Memberikan saran terkait isu penyuapan
   - Memastikan kesesuaian dengan SNI ISO 37001
   - Mengkomunikasikan Kebijakan Anti Penyuapan
   - Melakukan tinjauan berkelanjutan
   - Mengawasi investigasi insiden
   - Melaporkan kinerja SMAP kepada Direksi

7. PENUTUP dengan tanggal dan tanda tangan Direktur

Format: SK formal dengan penomoran paragraf yang jelas.`,
  },
  {
    code: "KEBIJAKAN-AP",
    title: "Kebijakan Anti Penyuapan",
    titleEn: "Anti-Bribery Policy",
    description: "Kebijakan zero tolerance terhadap penyuapan",
    clause: "5.2",
    category: "Kebijakan",
    icon: Shield,
    color: "bg-green-500",
    promptTemplate: `Buatkan dokumen KEBIJAKAN ANTI PENYUAPAN berdasarkan SNI ISO 37001:2016 Klausul 5.2.

STRUKTUR DOKUMEN:
1. HEADER dengan nomor dokumen: {{companyCode}}-K-SMAP-01
2. JUDUL: "KEBIJAKAN ANTI PENYUAPAN"
3. PERNYATAAN KOMITMEN Manajemen Puncak

4. ISI KEBIJAKAN meliputi:
   a) Larangan segala bentuk penyuapan (aktif dan pasif)
   b) Kepatuhan terhadap peraturan perundangan anti penyuapan
   c) Komitmen Zero Tolerance
   d) Peningkatan penerapan SMAP berkelanjutan
   e) Pemenuhan kewajiban kepatuhan
   f) Mendorong pelaporan pelanggaran (WBS)
   g) Tidak ada pembalasan terhadap pelapor
   h) Konsekuensi pelanggaran

5. RUANG LINGKUP:
   - Berlaku untuk seluruh personel
   - Berlaku untuk rekan bisnis/vendor
   - Berlaku untuk seluruh aktivitas operasional

6. TANGGUNG JAWAB:
   - Manajemen Puncak
   - FKAP
   - Seluruh Karyawan

7. PENUTUP dengan tanda tangan Direktur dan tanggal efektif

Format: Kebijakan formal dengan paragraf terstruktur.`,
  },
  {
    code: "PAKTA-INTEGRITAS",
    title: "Pakta Integritas Personel",
    titleEn: "Personnel Integrity Pact",
    description: "Formulir komitmen kepatuhan anti penyuapan untuk karyawan",
    clause: "7.2.2.3",
    category: "Formulir",
    icon: FileCheck,
    color: "bg-purple-500",
    promptTemplate: `Buatkan formulir PAKTA INTEGRITAS PERSONEL berdasarkan SNI ISO 37001:2016 Klausul 7.2.2.3.

STRUKTUR DOKUMEN:
1. HEADER dengan logo dan identitas perusahaan
2. Nomor Formulir: {{companyCode}}-F-SMAP-PI-01

3. JUDUL: "PAKTA INTEGRITAS ANTI PENYUAPAN"

4. PERNYATAAN yang berisi komitmen:
   - Tidak akan melakukan penyuapan dalam bentuk apapun
   - Tidak akan menawarkan/menerima gratifikasi
   - Akan melaporkan setiap dugaan penyuapan
   - Mematuhi Kebijakan Anti Penyuapan perusahaan
   - Tidak akan membalas dendam terhadap pelapor
   - Bersedia menerima sanksi jika melanggar

5. PERSETUJUAN dengan:
   - Nama lengkap: _______________
   - Jabatan: _______________
   - NIK: _______________
   - Tanggal: _______________
   - Tanda tangan: _______________

6. SAKSI (opsional):
   - Atasan langsung
   - FKAP

Format: Formulir satu halaman yang bisa dicetak dan ditandatangani.`,
  },
  {
    code: "SOP-UJI-TUNTAS",
    title: "SOP Uji Tuntas Mitra Bisnis",
    titleEn: "Business Partner Due Diligence SOP",
    description: "Prosedur due diligence untuk vendor dan mitra bisnis",
    clause: "8.2",
    category: "SOP",
    icon: ClipboardList,
    color: "bg-orange-500",
    promptTemplate: `Buatkan PROSEDUR OPERASIONAL STANDAR (SOP) UJI TUNTAS MITRA BISNIS berdasarkan SNI ISO 37001:2016 Klausul 8.2.

STRUKTUR DOKUMEN:
1. HEADER SOP:
   - Nomor: {{companyCode}}-SOP-SMAP-DD-01
   - Judul: "SOP Uji Tuntas (Due Diligence) Mitra Bisnis"
   - Revisi: 00
   - Tanggal Efektif: {{currentDate}}

2. TUJUAN: Memastikan mitra bisnis memiliki komitmen anti penyuapan

3. RUANG LINGKUP:
   - Vendor/Supplier baru
   - Subkontraktor
   - Konsultan eksternal
   - Agen/Perwakilan

4. REFERENSI:
   - SNI ISO 37001:2016 Klausul 8.2
   - Kebijakan Anti Penyuapan Perusahaan
   - Permen PU No. 08 Tahun 2022

5. DEFINISI istilah terkait

6. PROSEDUR DETAIL:
   a) Pengumpulan data awal mitra bisnis
   b) Verifikasi legalitas dan reputasi
   c) Penilaian risiko penyuapan (Rendah/Sedang/Tinggi)
   d) Penandatanganan Komitmen Anti Penyuapan
   e) Evaluasi berkala mitra existing

7. FLOWCHART prosedur (deskripsi alur)

8. FORMULIR TERKAIT:
   - Form Pendaftaran Vendor
   - Checklist Due Diligence
   - Form Penilaian Risiko
   - Surat Komitmen Anti Penyuapan Mitra

9. PENUTUP dengan tanda tangan pembuat dan penyetuju

Format: SOP formal dengan penomoran klausul yang jelas.`,
  },
  {
    code: "RISK-REGISTER",
    title: "Register Risiko Penyuapan",
    titleEn: "Bribery Risk Register",
    description: "Daftar identifikasi dan penilaian risiko penyuapan",
    clause: "4.5",
    category: "Register",
    icon: FileWarning,
    color: "bg-red-500",
    promptTemplate: `Buatkan dokumen REGISTER RISIKO PENYUAPAN berdasarkan SNI ISO 37001:2016 Klausul 4.5.

STRUKTUR DOKUMEN:
1. HEADER dengan nomor: {{companyCode}}-REG-SMAP-RR-01

2. PENDAHULUAN:
   - Tujuan penilaian risiko
   - Metodologi yang digunakan
   - Periode penilaian

3. TABEL IDENTIFIKASI RISIKO dengan kolom:
   - No
   - Area/Proses Bisnis
   - Deskripsi Risiko Penyuapan
   - Sumber Risiko
   - Dampak (1-5)
   - Kemungkinan (1-5)
   - Nilai Risiko (DxK)
   - Tingkat Risiko (Rendah/Sedang/Tinggi/Ekstrem)
   - Pengendalian Existing
   - Rencana Mitigasi
   - PIC
   - Target Penyelesaian
   - Status

4. AREA RISIKO YANG HARUS DIIDENTIFIKASI:
   a) Tender dan Pengadaan
   b) Perizinan dan Regulasi
   c) Hubungan dengan Pejabat Publik
   d) Rekrutmen Karyawan
   e) Pembayaran kepada Pihak Ketiga
   f) Penerimaan Hadiah/Gratifikasi
   g) Donasi dan Sponsorship
   h) Konflik Kepentingan

5. KRITERIA PENILAIAN:
   - Matriks Dampak vs Kemungkinan
   - Definisi setiap level

6. RINGKASAN HASIL:
   - Jumlah risiko per kategori
   - Risiko prioritas tertinggi
   - Rencana tindak lanjut

7. TANDA TANGAN:
   - Disusun oleh: FKAP
   - Disetujui oleh: Direktur

Format: Dokumen dengan tabel risiko yang lengkap.`,
  },
  {
    code: "AUDIT-CHECKLIST",
    title: "Checklist Audit Internal SMAP",
    titleEn: "ABMS Internal Audit Checklist",
    description: "Formulir pemeriksaan audit internal SMAP",
    clause: "9.2",
    category: "Formulir",
    icon: BookOpen,
    color: "bg-amber-500",
    promptTemplate: `Buatkan CHECKLIST AUDIT INTERNAL SMAP berdasarkan SNI ISO 37001:2016 Klausul 9.2.

STRUKTUR DOKUMEN:
1. HEADER AUDIT:
   - Nomor: {{companyCode}}-F-SMAP-AI-01
   - Periode Audit: ____________
   - Auditor: ____________
   - Auditee: ____________

2. TABEL CHECKLIST dengan kolom:
   - No
   - Klausul ISO 37001
   - Persyaratan
   - Pertanyaan Audit
   - Bukti yang Diperiksa
   - Temuan (Sesuai/Tidak Sesuai/Observasi)
   - Keterangan

3. ITEM CHECKLIST PER KLAUSUL:
   Klausul 4 - Konteks Organisasi
   - 4.1 Pemahaman organisasi dan konteksnya
   - 4.2 Kebutuhan pihak berkepentingan
   - 4.3 Lingkup SMAP
   - 4.4 Proses SMAP
   - 4.5 Penilaian risiko penyuapan

   Klausul 5 - Kepemimpinan
   - 5.1 Komitmen manajemen
   - 5.2 Kebijakan anti penyuapan
   - 5.3 Peran dan tanggung jawab (FKAP)

   Klausul 6 - Perencanaan
   - 6.1 Tindakan mengatasi risiko
   - 6.2 Sasaran dan program

   Klausul 7 - Pendukung
   - 7.1 Sumber daya
   - 7.2 Kompetensi
   - 7.3 Kepedulian
   - 7.4 Komunikasi
   - 7.5 Informasi terdokumentasi

   Klausul 8 - Operasi
   - 8.1-8.10 Pengendalian operasional

   Klausul 9 - Evaluasi Kinerja
   - 9.1 Pemantauan dan pengukuran
   - 9.2 Audit internal
   - 9.3 Tinjauan manajemen
   - 9.4 Tinjauan FKAP

   Klausul 10 - Perbaikan
   - 10.1 Tindakan korektif
   - 10.2 Peningkatan berkelanjutan

4. RINGKASAN TEMUAN:
   - Total Sesuai: ___
   - Total Tidak Sesuai: ___
   - Total Observasi: ___

5. KESIMPULAN DAN REKOMENDASI

6. TANDA TANGAN Auditor dan Auditee

Format: Formulir audit lengkap siap digunakan.`,
  },
  {
    code: "BERITA-ACARA-RTM",
    title: "Berita Acara RTM",
    titleEn: "Management Review Meeting Minutes",
    description: "Notulen Rapat Tinjauan Manajemen SMAP",
    clause: "9.3",
    category: "Berita Acara",
    icon: Briefcase,
    color: "bg-cyan-500",
    promptTemplate: `Buatkan template BERITA ACARA RAPAT TINJAUAN MANAJEMEN (RTM) SMAP berdasarkan SNI ISO 37001:2016 Klausul 9.3.

STRUKTUR DOKUMEN:
1. HEADER:
   - Nomor: {{companyCode}}-BA-SMAP-RTM-{{year}}-01
   - Judul: "BERITA ACARA RAPAT TINJAUAN MANAJEMEN SMAP"

2. INFORMASI RAPAT:
   - Hari/Tanggal: ____________
   - Waktu: ____________
   - Tempat: ____________
   - Pimpinan Rapat: Direktur ({{director}})
   - Notulis: ____________

3. DAFTAR HADIR (tabel):
   - No, Nama, Jabatan, Tanda Tangan

4. AGENDA RTM (sesuai klausul 9.3):
   a) Status tindak lanjut RTM sebelumnya
   b) Perubahan isu internal dan eksternal
   c) Informasi kinerja SMAP:
      - Hasil audit internal
      - Hasil tinjauan FKAP
      - Status tindakan korektif
      - Hasil pemantauan dan pengukuran
   d) Laporan investigasi penyuapan (jika ada)
   e) Peluang peningkatan berkelanjutan
   f) Kecukupan sumber daya

5. PEMBAHASAN setiap agenda

6. KEPUTUSAN DAN TINDAK LANJUT (tabel):
   - No, Keputusan/Tindakan, PIC, Target, Status

7. PENUTUP:
   - Ringkasan hasil rapat
   - Tanggal RTM berikutnya

8. TANDA TANGAN:
   - Pimpinan Rapat
   - Notulis
   - Ketua FKAP

Format: Berita acara formal dengan format rapat resmi.`,
  },
  {
    code: "SASARAN-PROGRAM",
    title: "Sasaran & Program Anti Penyuapan",
    titleEn: "Anti-Bribery Objectives & Programs",
    description: "Tabel sasaran dan program kerja anti penyuapan tahunan",
    clause: "6.2",
    category: "Register",
    icon: Scale,
    color: "bg-teal-500",
    promptTemplate: `Buatkan dokumen SASARAN DAN PROGRAM ANTI PENYUAPAN berdasarkan SNI ISO 37001:2016 Klausul 6.2.

STRUKTUR DOKUMEN:
1. HEADER dengan nomor: {{companyCode}}-REG-SMAP-SP-01
2. PERIODE: Tahun {{year}}

3. TABEL SASARAN SMAP dengan kolom:
   - No
   - Bagian/Fungsi
   - Sasaran SMAP
   - Indikator/Target
   - Program Kerja
   - Sumber Daya
   - PIC
   - Jadwal
   - Pemantauan

4. SASARAN YANG DIREKOMENDASIKAN:
   a) FKAP: Mendapatkan/mempertahankan Sertifikat ISO 37001
   b) Risk Management: Meningkatkan efektivitas mitigasi risiko
   c) Purchasing: Zero case penyuapan dari vendor
   d) Audit Internal: Meningkatkan efektivitas WBS
   e) HRD: Zero konflik kepentingan dalam rekrutmen
   f) HRD & FKAP: 100% karyawan ikut sosialisasi SMAP
   g) Marketing/Sales: Zero case penyuapan kepada pelanggan

5. KRITERIA PEMANTAUAN per sasaran

6. RINGKASAN ANGGARAN (jika ada)

7. TANDA TANGAN:
   - Disusun: Ketua FKAP
   - Disetujui: Direktur

Format: Dokumen dengan tabel sasaran yang terstruktur.`,
  },
];

const CATEGORIES = [
  { id: "all", label: "Semua" },
  { id: "Pedoman", label: "Pedoman" },
  { id: "Surat Keputusan", label: "SK" },
  { id: "Kebijakan", label: "Kebijakan" },
  { id: "SOP", label: "SOP" },
  { id: "Formulir", label: "Formulir" },
  { id: "Register", label: "Register" },
  { id: "Berita Acara", label: "Berita Acara" },
];

export default function DocumentBuilder() {
  const { toast } = useToast();
  const { currentIndustry, getAllTemplates } = useIndustry();
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<typeof DOCUMENT_TEMPLATES[0] | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [additionalContext, setAdditionalContext] = useState("");
  const [generatedDocument, setGeneratedDocument] = useState<string>("");
  const [copiedDocument, setCopiedDocument] = useState(false);
  const [activeView, setActiveView] = useState<"document" | "prompt">("document");

  const industryTemplates = getAllTemplates();

  const generateDocMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const res = await apiRequest("POST", "/api/ai/generate", {
        prompt,
        model: "gemini-2.5-flash",
      });
      return (await res.json()) as { content: string };
    },
    onSuccess: (data) => {
      setGeneratedDocument(data.content || "");
      setActiveView("document");
      toast({
        title: "Dokumen berhasil dibuat!",
        description: "Dokumen lengkap siap disalin atau diunduh.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal membuat dokumen",
        description: error.message || "Terjadi kesalahan saat menghubungi AI.",
        variant: "destructive",
      });
    },
  });

  // Use placeholders only - no internal company data
  const companyName = "[NAMA PERUSAHAAN]";
  const companyCode = "[KODE]";
  const companyAddress = "[ALAMAT PERUSAHAAN]";
  const director = "[NAMA DIREKTUR]";
  const ketuaFKAP = "[KETUA FKAP]";

  const filteredTemplates = activeCategory === "all"
    ? DOCUMENT_TEMPLATES
    : DOCUMENT_TEMPLATES.filter(t => t.category === activeCategory);
  const currentDate = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const currentYear = new Date().getFullYear().toString();

  const generatePrompt = useCallback((template: typeof DOCUMENT_TEMPLATES[0]) => {
    let prompt = template.promptTemplate;
    
    // Replace placeholders with placeholder values
    prompt = prompt.replace(/\{\{companyCode\}\}/g, companyCode);
    prompt = prompt.replace(/\{\{companyName\}\}/g, companyName);
    prompt = prompt.replace(/\{\{director\}\}/g, director);
    prompt = prompt.replace(/\{\{ketuaFKAP\}\}/g, ketuaFKAP);
    prompt = prompt.replace(/\{\{currentDate\}\}/g, currentDate);
    prompt = prompt.replace(/\{\{year\}\}/g, currentYear);
    prompt = prompt.replace(/\{\{address\}\}/g, companyAddress);

    // Build complete prompt with placeholder company context
    const fullPrompt = `=== PROMPT GENERATOR DOKUMEN SMAP ===
Gunakan prompt ini di AI model (ChatGPT, Gemini, Claude) atau dokumenttender.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

KONTEKS PERUSAHAAN:
- Nama Perusahaan: ${companyName}
- Alamat: ${companyAddress}
- Direktur: ${director}
- Ketua FKAP: ${ketuaFKAP}
- Bidang Usaha: Jasa Konstruksi
- Standar: SNI ISO 37001:2016 (Sistem Manajemen Anti Penyuapan)

TIM FKAP:
1. [KETUA FKAP] - Ketua
2. [ANGGOTA FKAP 1] - Anggota
3. [ANGGOTA FKAP 2] - Anggota

MANAJEMEN:
1. [DIREKTUR UTAMA] - Direktur Utama
2. [DIREKTUR OPERASIONAL] - Direktur Operasional
3. [DIREKTUR KEUANGAN] - Direktur Keuangan

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INSTRUKSI PEMBUATAN DOKUMEN:

Jenis Dokumen: ${template.title}
Klausul ISO 37001: ${template.clause}
Kategori: ${template.category}

${prompt}

${additionalContext ? `\nKONTEKS TAMBAHAN DARI USER:\n${additionalContext}\n` : ""}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CATATAN PENTING:
- Gunakan Bahasa Indonesia yang formal dan profesional
- Ikuti format dokumen SMAP standar konstruksi Indonesia
- Sesuaikan dengan Permen PU No. 08 Tahun 2022
- Hasilkan dokumen lengkap siap cetak

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    setGeneratedPrompt(fullPrompt);
    setSelectedTemplate(template);
    setGeneratedDocument("");
    setActiveView("document");
    return fullPrompt;
  }, [companyName, director, ketuaFKAP, companyCode, companyAddress, currentDate, currentYear, additionalContext]);

  const handleSelectTemplate = useCallback((template: typeof DOCUMENT_TEMPLATES[0]) => {
    const fullPrompt = generatePrompt(template);
    generateDocMutation.mutate(fullPrompt);
  }, [generatePrompt, generateDocMutation]);

  const handleCopyDocument = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generatedDocument);
      setCopiedDocument(true);
      toast({ title: "Dokumen disalin!", description: "Tempelkan ke Word atau editor Anda." });
      setTimeout(() => setCopiedDocument(false), 3000);
    } catch {
      toast({ title: "Gagal menyalin", variant: "destructive" });
    }
  }, [generatedDocument, toast]);

  const handleDownloadDocument = useCallback(() => {
    if (!generatedDocument) return;
    const blob = new Blob([generatedDocument], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const fileName = (selectedTemplate?.code || "dokumen-smap").toLowerCase();
    link.href = url;
    link.download = `${fileName}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: "Dokumen diunduh!", description: "File .doc dapat dibuka di Microsoft Word." });
  }, [generatedDocument, selectedTemplate, toast]);

  const handleCopyPrompt = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopiedPrompt(true);
      toast({ 
        title: "Prompt disalin!", 
        description: "Tempelkan di dokumenttender.com atau AI model lainnya" 
      });
      setTimeout(() => setCopiedPrompt(false), 3000);
    } catch {
      toast({ title: "Gagal menyalin", variant: "destructive" });
    }
  }, [generatedPrompt, toast]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Wand2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-page-title">
                AI Document Builder {currentIndustry?.shortName || ""}
              </h1>
              <p className="text-muted-foreground text-sm">
                Buat dokumen {currentIndustry?.shortName || "kepatuhan"} lengkap langsung dengan AI - {industryTemplates.length} template tersedia
              </p>
            </div>
          </div>
          
          <Card className="mt-4 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-800 dark:text-blue-300">Cara Penggunaan:</p>
                  <ol className="mt-1 text-blue-700 dark:text-blue-400 space-y-1 list-decimal list-inside">
                    <li>Pilih template dokumen yang ingin dibuat</li>
                    <li>AI akan langsung membuat dokumen lengkap untuk Anda</li>
                    <li>Salin atau unduh dokumen (.doc) yang dihasilkan</li>
                    <li>Tidak perlu pindah aplikasi — semua selesai di sini</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-2 mt-3 p-3 bg-muted/50 rounded-lg">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              Template menggunakan placeholder (ganti sesuai data perusahaan Anda)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Template Dokumen
                </CardTitle>
                <CardDescription>
                  Pilih template untuk generate prompt AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                  <TabsList className="flex-wrap h-auto gap-1 mb-4" data-testid="tabs-categories">
                    {CATEGORIES.map(cat => (
                      <TabsTrigger 
                        key={cat.id} 
                        value={cat.id}
                        className="text-xs"
                        data-testid={`tab-category-${cat.id}`}
                      >
                        {cat.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <TabsContent value={activeCategory} className="mt-0">
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-2 pr-4">
                        {filteredTemplates.map((template) => {
                          const Icon = template.icon;
                          const isSelected = selectedTemplate?.code === template.code;
                          return (
                            <Card 
                              key={template.code}
                              className={`hover-elevate cursor-pointer transition-all ${isSelected ? "border-primary bg-primary/5" : ""}`}
                              onClick={() => handleSelectTemplate(template)}
                              data-testid={`card-template-${template.code}`}
                            >
                              <CardContent className="p-3">
                                <div className="flex items-start gap-3">
                                  <div className={`p-2 rounded-lg ${template.color} text-white shrink-0`}>
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-sm">{template.title}</h3>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                      {template.description}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                                      <Badge variant="outline" className="text-xs">
                                        {template.clause}
                                      </Badge>
                                      <Badge variant="secondary" className="text-xs">
                                        {template.category}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Konteks Tambahan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="additional-context" className="text-xs text-muted-foreground">
                  Tambahkan instruksi khusus (opsional)
                </Label>
                <Textarea
                  id="additional-context"
                  placeholder="Contoh: Fokus pada proyek infrastruktur jalan, atau tambahkan klausul tentang donasi politik..."
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                  className="mt-2 min-h-[100px] text-sm"
                  data-testid="textarea-additional-context"
                />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="sticky top-6">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileSignature className="w-5 h-5" />
                    Dokumen yang Dihasilkan
                  </CardTitle>
                  {selectedTemplate && (
                    <div className="flex items-center gap-2">
                      {activeView === "document" && generatedDocument && !generateDocMutation.isPending && (
                        <>
                          <Button
                            onClick={handleCopyDocument}
                            className="gap-2"
                            data-testid="button-copy-document"
                          >
                            {copiedDocument ? (
                              <>
                                <Check className="w-4 h-4" />
                                Tersalin!
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                Salin
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleDownloadDocument}
                            className="gap-2"
                            data-testid="button-download-document"
                          >
                            <Download className="w-4 h-4" />
                            Unduh .doc
                          </Button>
                        </>
                      )}
                      {activeView === "prompt" && generatedPrompt && (
                        <Button
                          onClick={handleCopyPrompt}
                          variant="outline"
                          className="gap-2"
                          data-testid="button-copy-prompt"
                        >
                          {copiedPrompt ? (
                            <>
                              <Check className="w-4 h-4" />
                              Tersalin!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Salin Prompt
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                {selectedTemplate && (
                  <CardDescription>
                    Template: {selectedTemplate.title} (Klausul {selectedTemplate.clause})
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {selectedTemplate ? (
                  <Tabs value={activeView} onValueChange={(v) => setActiveView(v as "document" | "prompt")}>
                    <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                      <TabsList data-testid="tabs-output">
                        <TabsTrigger value="document" className="gap-1.5" data-testid="tab-document">
                          <FileSignature className="w-4 h-4" />
                          Dokumen AI
                        </TabsTrigger>
                        <TabsTrigger value="prompt" className="gap-1.5" data-testid="tab-prompt">
                          <Sparkles className="w-4 h-4" />
                          Prompt
                        </TabsTrigger>
                      </TabsList>
                      {generatedDocument && !generateDocMutation.isPending && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => generateDocMutation.mutate(generatedPrompt)}
                          className="gap-2"
                          data-testid="button-regenerate-document"
                        >
                          <Wand2 className="w-4 h-4" />
                          Buat Ulang
                        </Button>
                      )}
                    </div>

                    <TabsContent value="document" className="mt-0">
                      {generateDocMutation.isPending ? (
                        <div className="h-[560px] rounded-lg border bg-muted/30 flex items-center justify-center">
                          <div className="text-center text-muted-foreground p-8">
                            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
                            <p className="font-medium">AI sedang menyusun dokumen...</p>
                            <p className="text-sm mt-2">
                              Mohon tunggu beberapa saat, dokumen lengkap sedang dibuat.
                            </p>
                          </div>
                        </div>
                      ) : generatedDocument ? (
                        <ScrollArea className="h-[560px] rounded-lg border bg-background p-6">
                          <div className="text-sm whitespace-pre-wrap leading-relaxed" data-testid="text-generated-document">
                            {generatedDocument}
                          </div>
                        </ScrollArea>
                      ) : (
                        <div className="h-[560px] rounded-lg border bg-muted/30 flex items-center justify-center">
                          <div className="text-center text-muted-foreground p-8">
                            <FileSignature className="w-16 h-16 mx-auto mb-4 opacity-20" />
                            <p className="font-medium">Dokumen belum dibuat</p>
                            <Button
                              onClick={() => generateDocMutation.mutate(generatedPrompt)}
                              className="gap-2 mt-4"
                              data-testid="button-generate-document"
                            >
                              <Wand2 className="w-4 h-4" />
                              Buat Dokumen Sekarang
                            </Button>
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="prompt" className="mt-0">
                      <ScrollArea className="h-[560px] rounded-lg border bg-muted/30 p-4">
                        <pre className="text-xs whitespace-pre-wrap font-mono leading-relaxed" data-testid="text-generated-prompt">
                          {generatedPrompt}
                        </pre>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="h-[600px] rounded-lg border bg-muted/30 flex items-center justify-center">
                    <div className="text-center text-muted-foreground p-8">
                      <Wand2 className="w-16 h-16 mx-auto mb-4 opacity-20" />
                      <p className="font-medium">Pilih template untuk membuat dokumen</p>
                      <p className="text-sm mt-2">
                        Klik template di sebelah kiri dan AI akan langsung membuat dokumen lengkap untuk Anda
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
