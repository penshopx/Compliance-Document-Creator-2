import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  FileText, CheckCircle2, Circle, Send, Loader2, RotateCcw,
  Sparkles, ExternalLink, Users, ClipboardCheck, Award, RefreshCw,
  BookOpen, Zap, MessageSquare, ChevronRight, ArrowLeft,
  FileCheck, Shield, UserCog, BarChart3, AlertTriangle, GraduationCap,
  Search, Presentation, ListChecks, FileX, Wrench, TrendingUp,
  FileBarChart, ShieldAlert, RotateCw, Star, ArrowRight, Info, X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

type AgentKey = "dokumen" | "internal" | "sertifikasi" | "surveilance";
interface Message { role: "user" | "assistant"; content: string; }

interface SubAgent {
  key: string;
  label: string;
  shortLabel: string;
  description: string;
  deliverable: string;
  icon: typeof FileText;
  opening: string;
  suggestions: string[];
}

interface MainAgent {
  key: AgentKey;
  label: string;
  fase: string;
  icon: typeof FileText;
  color: string;
  bgColor: string;
  badgeColor: string;
  subAgents: SubAgent[];
  quickLinks: Array<{ label: string; url: string; icon: typeof FileText }>;
}

const AGENTS: MainAgent[] = [
  {
    key: "dokumen",
    label: "Agen Dokumen",
    fase: "Siap Dokumen SMAP",
    icon: FileText,
    color: "text-blue-700",
    bgColor: "bg-blue-600",
    badgeColor: "bg-blue-100 text-blue-700",
    quickLinks: [
      { label: "Template Repository", url: "/template-repository", icon: BookOpen },
      { label: "Document Builder", url: "/document-builder", icon: FileText },
      { label: "PDCA Generator", url: "/pdca", icon: Zap },
    ],
    subAgents: [
      {
        key: "pedoman",
        label: "Sub-Agen Pedoman SMAP",
        shortLabel: "Pedoman SMAP",
        description: "Draf Pedoman SMAP / Manual ABMS lengkap",
        deliverable: "Pedoman SMAP 7 Bab",
        icon: BookOpen,
        opening: "Saya Sub-Agen Pedoman SMAP. Saya akan membantu Anda membuat draf **Pedoman SMAP (Manual ABMS)** lengkap yang mencakup semua klausul ISO 37001:2016 (Bab 1-7 + Lampiran).\n\nDokumen ini adalah dokumen induk SMAP Anda. Mari kita mulai!\n\n**Saya perlu info berikut:**\n1. Nama perusahaan\n2. Bidang usaha\n3. Kota\n4. Jumlah karyawan (perkiraan)\n5. Nama Direktur/Pimpinan Tertinggi\n6. Nama Pimpinan FKAP\n\nSilakan isi informasi tersebut, atau ketik **\"langsung buat\"** jika ingin saya mulai dengan placeholder yang bisa Anda isi nanti.",
        suggestions: ["Langsung buat dengan placeholder", "Apa itu Pedoman SMAP?", "Berapa panjang Pedoman SMAP yang ideal?"],
      },
      {
        key: "kebijakan",
        label: "Sub-Agen Kebijakan Anti Penyuapan",
        shortLabel: "Kebijakan Anti Penyuapan",
        description: "Dokumen Kebijakan Anti Penyuapan resmi (Klausul 5.2)",
        deliverable: "Kebijakan Anti Penyuapan",
        icon: Shield,
        opening: "Saya Sub-Agen Kebijakan Anti Penyuapan. Saya akan membantu Anda membuat **Kebijakan Anti Penyuapan** resmi sesuai Klausul 5.2 SNI ISO 37001:2016 — dokumen yang ditandatangani Direktur sebagai komitmen tertinggi.\n\n**Info yang dibutuhkan:**\n1. Nama perusahaan\n2. Bidang usaha\n3. Nama & jabatan Direktur\n4. Kota\n5. Tanggal berlaku\n\nAtau ketik **\"langsung buat\"** untuk versi dengan placeholder.",
        suggestions: ["Langsung buat dengan placeholder", "Apa yang harus ada di Kebijakan Anti Penyuapan?", "Contoh Kebijakan yang baik"],
      },
      {
        key: "sk_fkap",
        label: "Sub-Agen SK Tim FKAP",
        shortLabel: "SK Tim FKAP",
        description: "Surat Keputusan Penetapan Tim FKAP (Klausul 5.3.2)",
        deliverable: "SK Penetapan FKAP",
        icon: UserCog,
        opening: "Saya Sub-Agen SK Tim FKAP. Saya akan membuat **Surat Keputusan Penetapan Tim FKAP** — dokumen resmi yang mengangkat tim Fungsi Kepatuhan Anti Penyuapan sesuai Klausul 5.3.2.\n\n**Info yang dibutuhkan:**\n1. Nama perusahaan\n2. Nomor SK (contoh: 001/SK/DIR/VI/2025)\n3. Tanggal SK\n4. Nama Direktur\n5. Nama & jabatan Pimpinan FKAP\n6. Nama & jabatan Sekretaris FKAP\n7. Nama & jabatan Anggota FKAP (2-3 orang)\n\nAtau ketik **\"langsung buat\"** untuk template dengan placeholder.",
        suggestions: ["Langsung buat template SK FKAP", "Apa tugas Tim FKAP?", "Berapa orang idealnya Tim FKAP?"],
      },
      {
        key: "sasaran",
        label: "Sub-Agen Tabel Sasaran",
        shortLabel: "Tabel Sasaran",
        description: "Tabel Sasaran Anti Penyuapan & Rencana Pencapaian (Klausul 6.2)",
        deliverable: "Tabel Sasaran SMAP",
        icon: Star,
        opening: "Saya Sub-Agen Tabel Sasaran Anti Penyuapan. Saya akan membuat **Tabel Sasaran SMAP & Rencana Pencapaian** yang terukur dan SMART sesuai Klausul 6.2 SNI ISO 37001:2016.\n\nIni adalah dokumen penting yang menjadi lampiran Pedoman SMAP — menunjukkan KPI dan target konkret implementasi SMAP.\n\n**Info yang dibutuhkan:**\n1. Bidang usaha dan profil risiko utama\n2. Nama PIC utama (Pimpinan FKAP)\n3. Berapa karyawan total?\n4. Sasaran prioritas (dari Kebijakan AP yang sudah ada?)\n\nAtau ketik **\"langsung buat\"** untuk versi standar dengan placeholder.",
        suggestions: ["Langsung buat tabel sasaran standar", "Saya perusahaan konstruksi, risiko tinggi", "Apa itu sasaran SMART dalam SMAP?"],
      },
      {
        key: "register_risiko",
        label: "Sub-Agen Register Risiko",
        shortLabel: "Register Risiko",
        description: "Register Risiko Penyuapan sesuai konteks bisnis (Klausul 6.1)",
        deliverable: "Register Risiko Penyuapan",
        icon: BarChart3,
        opening: "Saya Sub-Agen Register Risiko Penyuapan. Saya akan membuat **Register Risiko Penyuapan** yang disesuaikan dengan proses bisnis Anda sesuai Klausul 6.1 — mencakup identifikasi, analisis, dan pengendalian risiko.\n\n**Info yang dibutuhkan:**\n1. Bidang usaha/industri\n2. Proses bisnis utama (pengadaan? tender? penjualan? perizinan?)\n3. Jenis mitra/pelanggan utama\n4. Ada transaksi dengan instansi pemerintah? (ya/tidak)\n\nSaya akan mengidentifikasi 8-12 risiko penyuapan yang paling relevan untuk bisnis Anda.",
        suggestions: ["Saya perusahaan konstruksi", "Saya perusahaan jasa konsultan", "Saya perusahaan manufaktur/perdagangan"],
      },
      {
        key: "sop_whistleblowing",
        label: "Sub-Agen SOP Whistleblowing",
        shortLabel: "SOP Whistleblowing",
        description: "SOP Sistem Pelaporan Pelanggaran (Klausul 8.9)",
        deliverable: "SOP + Formulir WBS",
        icon: AlertTriangle,
        opening: "Saya Sub-Agen SOP Whistleblowing. Saya akan membuat **SOP Sistem Pelaporan Pelanggaran (Whistleblowing System)** lengkap dengan formulir pelaporan sesuai Klausul 8.9.\n\n**Info yang dibutuhkan:**\n1. Nama perusahaan\n2. Channel pelaporan yang tersedia:\n   - Email khusus? (contoh: laporkan@perusahaan.com)\n   - Kotak saran fisik?\n   - Nomor telepon/WhatsApp rahasia?\n3. Nama Pimpinan FKAP (penerima laporan)\n\nAtau ketik **\"langsung buat\"** untuk template standar.",
        suggestions: ["Langsung buat template SOP WBS", "Channel pelaporan apa yang paling efektif untuk UKM?", "Bagaimana melindungi pelapor?"],
      },
      {
        key: "program_pelatihan",
        label: "Sub-Agen Program Pelatihan",
        shortLabel: "Program Pelatihan",
        description: "Program Pelatihan & Awareness SMAP Tahunan (Klausul 7.2-7.3)",
        deliverable: "Program Pelatihan 1 Tahun",
        icon: GraduationCap,
        opening: "Saya Sub-Agen Program Pelatihan SMAP. Saya akan membuat **Program Pelatihan & Awareness Anti Penyuapan** tahunan yang realistis untuk kapasitas UKM sesuai Klausul 7.2-7.3.\n\n**Info yang dibutuhkan:**\n1. Jumlah karyawan total\n2. Level jabatan yang ada (Direksi, Manajer, Staf, Lapangan)\n3. Apakah punya anggaran pelatihan? (besar/terbatas/sangat terbatas)\n4. Sudah ada staf HR/SDM? (ya/tidak)\n\nSaya akan sesuaikan program dengan kapasitas nyata Anda.",
        suggestions: ["Kami UKM 20 karyawan, anggaran terbatas", "Kami 50-100 karyawan", "Materi awareness 1 jam untuk semua karyawan"],
      },
      {
        key: "uji_tuntas",
        label: "Sub-Agen Uji Tuntas Mitra",
        shortLabel: "Uji Tuntas Mitra",
        description: "Prosedur Due Diligence Mitra Bisnis (Klausul 8.2)",
        deliverable: "Prosedur + Formulir Penilaian Mitra",
        icon: Search,
        opening: "Saya Sub-Agen Uji Tuntas Mitra Bisnis. Saya akan membuat **Prosedur Uji Tuntas (Due Diligence)** untuk menilai risiko penyuapan dari mitra bisnis Anda sesuai Klausul 8.2.\n\n**Info yang dibutuhkan:**\n1. Jenis mitra utama (vendor, subkontraktor, agen, distributor, dll)\n2. Proses pengadaan saat ini (ada SOP pengadaan sebelumnya?)\n3. Berapa rata-rata jumlah vendor/mitra per tahun?\n4. Ada mitra dari luar negeri? (ya/tidak)\n\nSaya akan buat prosedur + formulir Due Diligence Questionnaire (DDQ) yang siap digunakan.",
        suggestions: ["Kami punya banyak vendor lokal", "Kami gunakan subkontraktor untuk proyek", "Buat template formulir penilaian mitra"],
      },
    ],
  },
  {
    key: "internal",
    label: "Agen Audit Internal",
    fase: "Siap Audit Internal",
    icon: ClipboardCheck,
    color: "text-emerald-700",
    bgColor: "bg-emerald-600",
    badgeColor: "bg-emerald-100 text-emerald-700",
    quickLinks: [
      { label: "Checklist SMAP", url: "/smap-checklist", icon: ClipboardCheck },
      { label: "Tim Audit Internal", url: "/audit-internal", icon: Users },
      { label: "PDCA Generator", url: "/pdca", icon: Zap },
    ],
    subAgents: [
      {
        key: "program",
        label: "Sub-Agen Program Audit",
        shortLabel: "Program Audit",
        description: "Program & Jadwal Audit Internal Tahunan (Klausul 9.2)",
        deliverable: "Program Audit Tahunan",
        icon: ListChecks,
        opening: "Saya Sub-Agen Program Audit Internal. Saya akan membuat **Program Audit Internal SMAP Tahunan** lengkap dengan jadwal, klausul yang diaudit, dan penugasan auditor sesuai Klausul 9.2.\n\n**Info yang dibutuhkan:**\n1. Nama auditor internal yang sudah ditetapkan (1-3 orang)\n2. Departemen/fungsi yang ada di perusahaan\n3. Bulan target pelaksanaan audit (kapan rencananya?)\n4. Frekuensi audit: 1x atau 2x per tahun?\n\nSaya akan buat program yang realistis dan mencakup semua klausul 4-10.",
        suggestions: ["Kami rencanakan audit bulan Oktober", "Buat program audit 2x setahun", "Auditor kami 2 orang dari internal"],
      },
      {
        key: "checklist",
        label: "Sub-Agen Checklist Audit",
        shortLabel: "Checklist Audit",
        description: "Checklist audit per klausul ISO 37001:2016 siap pakai",
        deliverable: "Checklist per Klausul",
        icon: FileCheck,
        opening: "Saya Sub-Agen Checklist Audit Internal. Saya akan membuat **checklist audit** yang komprehensif per klausul SNI ISO 37001:2016 — siap langsung digunakan auditor di lapangan.\n\n**Pilih klausul yang ingin dibuat checklistnya:**\n- Klausul 4 (Konteks Organisasi)\n- Klausul 5 (Kepemimpinan)\n- Klausul 6 (Perencanaan)\n- Klausul 7 (Dukungan)\n- Klausul 8 (Operasi)\n- Klausul 9 (Evaluasi Kinerja)\n- Klausul 10 (Perbaikan)\n- **Semua klausul sekaligus**\n\nSetiap checklist berisi 10-15 pertanyaan audit dengan metode (wawancara/observasi/review dokumen) dan bukti yang dibutuhkan.",
        suggestions: ["Buat checklist semua klausul", "Klausul 5 (Kepemimpinan)", "Klausul 8 (Operasi) yang paling kritis"],
      },
      {
        key: "laporan",
        label: "Sub-Agen Laporan & Temuan",
        shortLabel: "Laporan & NCR",
        description: "Template Laporan Audit & Formulir Temuan NCR",
        deliverable: "Laporan Audit + NCR Form",
        icon: FileX,
        opening: "Saya Sub-Agen Laporan & Temuan Audit. Saya akan membantu Anda:\n1. **Menulis temuan NCR** yang benar dan kuat\n2. **Membuat template** Laporan Hasil Audit Internal\n3. **Mengklasifikasi temuan** (NCR Major, NCR Minor, Observasi, OFI)\n\nApakah Anda sedang:\n- **A)** Ingin template laporan & formulir NCR kosong\n- **B)** Punya temuan dan perlu bantuan menuliskannya dengan benar\n\nPilih A atau B, atau ceritakan situasi Anda.",
        suggestions: ["A - Saya butuh template laporan audit", "B - Bantu tulis temuan ini...", "Apa bedanya NCR Major dan Minor?"],
      },
      {
        key: "capa",
        label: "Sub-Agen CAPA",
        shortLabel: "CAPA",
        description: "Rencana Tindakan Korektif & Preventif (Klausul 10.1)",
        deliverable: "Log CAPA + Rencana Tindakan",
        icon: Wrench,
        opening: "Saya Sub-Agen CAPA (Corrective Action & Preventive Action). Saya akan membantu:\n1. **Analisis akar penyebab** temuan menggunakan metode 5-Why\n2. **Menyusun rencana tindakan korektif** yang SMART\n3. **Membuat Log CAPA** untuk tracking semua temuan\n\n**Langkah pertama:** Ceritakan temuan NCR atau permasalahan SMAP yang perlu ditindaklanjuti, atau minta template Log CAPA kosong.",
        suggestions: ["Bantu analisis akar penyebab temuan ini...", "Buat template Log CAPA", "Apa itu metode 5-Why untuk SMAP?"],
      },
    ],
  },
  {
    key: "sertifikasi",
    label: "Agen Sertifikasi",
    fase: "Siap Audit Eksternal",
    icon: Award,
    color: "text-purple-700",
    bgColor: "bg-purple-600",
    badgeColor: "bg-purple-100 text-purple-700",
    quickLinks: [
      { label: "Produk Siap SMAP", url: "/produk-siap", icon: Award },
      { label: "Referensi Dokumen", url: "/smap-reference", icon: BookOpen },
      { label: "Template Repository", url: "/template-repository", icon: BookOpen },
    ],
    subAgents: [
      {
        key: "gap",
        label: "Sub-Agen Gap Analysis",
        shortLabel: "Gap Analysis",
        description: "Analisis kesenjangan kesiapan sertifikasi per klausul",
        deliverable: "Laporan Gap Analysis",
        icon: Search,
        opening: "Saya Sub-Agen Gap Analysis Sertifikasi. Saya akan melakukan **analisis kesenjangan (gap analysis)** antara kondisi SMAP Anda saat ini vs persyaratan SNI ISO 37001:2016 — klausul per klausul.\n\nOutput: laporan gap analysis dengan % kesiapan, daftar gap, dan prioritas pengisian.\n\n**Untuk memulai, ceritakan kondisi saat ini:**\n1. Dokumen apa saja yang sudah selesai dibuat?\n2. Apakah sudah ada audit internal?\n3. Sudah berapa lama SMAP diimplementasikan?\n4. Apa kendala terbesar saat ini?\n\nJika belum tahu apa yang ada, ketik **\"mulai dari nol\"**.",
        suggestions: ["Mulai dari nol, baru implementasi", "Sudah punya beberapa dokumen", "Sudah audit internal, siap sertifikasi"],
      },
      {
        key: "mock",
        label: "Sub-Agen Mock Audit",
        shortLabel: "Mock Audit",
        description: "Simulasi wawancara auditor eksternal",
        deliverable: "Simulasi Audit + Feedback",
        icon: Presentation,
        opening: "Saya Sub-Agen Mock Audit — Simulasi Auditor Eksternal. Saya akan **mensimulasikan pertanyaan dan teknik audit** yang digunakan auditor Certification Body (CB) saat audit Stage 1 & Stage 2.\n\nPilih mode simulasi:\n- **A)** Saya sebagai auditor, Anda menjawab\n- **B)** Berikan daftar pertanyaan sulit tanpa simulasi langsung\n- **C)** Fokus pada klausul/area tertentu\n\nPilih role Anda: Direktur, Pimpinan FKAP, atau Staf Operasional?",
        suggestions: ["A - Simulasi: saya Pimpinan FKAP", "A - Simulasi: saya Direktur", "B - Berikan 20 pertanyaan terberat auditor"],
      },
      {
        key: "matriks",
        label: "Sub-Agen Matriks Klausul",
        shortLabel: "Matriks Klausul",
        description: "Matriks pemenuhan klausul 4-10 ISO 37001",
        deliverable: "Matriks Pemenuhan Klausul",
        icon: FileBarChart,
        opening: "Saya Sub-Agen Matriks Pemenuhan Klausul. Saya akan membuat **Matriks Pemenuhan Klausul** SNI ISO 37001:2016 yang komprehensif — dokumen yang biasanya diminta lembaga sertifikasi saat Stage 1.\n\nMatriks ini menunjukkan: untuk setiap klausul, dokumen apa yang jadi buktinya, di mana lokasinya, dan status pemenuhannya.\n\n**Ceritakan dokumen yang sudah Anda miliki** (nama dan nomor dokumen jika ada), atau ketik **\"buat dari awal\"** untuk template kosong yang bisa diisi.",
        suggestions: ["Buat matriks kosong siap isi", "Saya punya Pedoman, Kebijakan, dan SK FKAP", "Jelaskan cara menggunakan matriks ini"],
      },
      {
        key: "stage",
        label: "Sub-Agen Persiapan Stage",
        shortLabel: "Persiapan Stage 1 & 2",
        description: "Checklist & panduan persiapan Stage 1 dan Stage 2",
        deliverable: "Checklist Kesiapan Stage 1 & 2",
        icon: ListChecks,
        opening: "Saya Sub-Agen Persiapan Stage 1 & 2. Saya akan membantu Anda **mempersiapkan audit sertifikasi** dengan Lembaga Sertifikasi (CB).\n\n**Stage 1** = Document review (biasanya online/di kantor CB)\n**Stage 2** = On-site audit (auditor datang ke tempat Anda)\n\nApakah Anda sedang mempersiapkan:\n- **A)** Stage 1 saja\n- **B)** Stage 2 saja\n- **C)** Keduanya sekaligus\n- **D)** Belum tahu, ingin penjelasan prosesnya dulu",
        suggestions: ["A - Siapkan Stage 1", "B - Siapkan Stage 2", "D - Jelaskan proses sertifikasi lengkap"],
      },
    ],
  },
  {
    key: "surveilance",
    label: "Agen Surveilance",
    fase: "Siap Surveilance",
    icon: RefreshCw,
    color: "text-orange-700",
    bgColor: "bg-orange-600",
    badgeColor: "bg-orange-100 text-orange-700",
    quickLinks: [
      { label: "Checklist SMAP", url: "/smap-checklist", icon: ClipboardCheck },
      { label: "PDCA Generator", url: "/pdca", icon: Zap },
      { label: "Referensi Dokumen", url: "/smap-reference", icon: BookOpen },
    ],
    subAgents: [
      {
        key: "kpi",
        label: "Sub-Agen KPI & Monitoring",
        shortLabel: "KPI SMAP",
        description: "Set KPI monitoring efektivitas SMAP (Klausul 9.1)",
        deliverable: "Set KPI + Dashboard Sederhana",
        icon: TrendingUp,
        opening: "Saya Sub-Agen KPI & Monitoring SMAP. Saya akan membantu Anda merancang **Key Performance Indicators (KPI)** untuk mengukur efektivitas SMAP secara berkelanjutan sesuai Klausul 9.1.\n\nOutput: 8-12 KPI yang terukur, realistis untuk UKM, lengkap dengan target dan cara pengukurannya.\n\n**Info yang dibutuhkan:**\n1. Bidang usaha\n2. Risiko penyuapan utama\n3. Tools yang tersedia (Excel saja? atau ada sistem lain?)\n4. Siapa PIC monitoring SMAP?\n\nAtau ketik **\"rekomendasi KPI standar\"** untuk KPI umum yang cocok untuk UKM.",
        suggestions: ["Rekomendasi KPI standar untuk UKM", "Buat dashboard monitoring di Excel", "KPI apa yang paling penting untuk surveilance?"],
      },
      {
        key: "laporan",
        label: "Sub-Agen Laporan Kinerja",
        shortLabel: "Laporan Kinerja",
        description: "Laporan Kinerja SMAP Tahunan untuk Tinjauan Manajemen",
        deliverable: "Laporan Kinerja SMAP Tahunan",
        icon: FileBarChart,
        opening: "Saya Sub-Agen Laporan Kinerja SMAP. Saya akan membantu membuat **Laporan Kinerja SMAP Tahunan** yang disampaikan dalam Tinjauan Manajemen sesuai Klausul 9.3.\n\nLaporan ini menunjukkan efektivitas SMAP kepada manajemen puncak.\n\n**Info yang dibutuhkan:**\n1. Tahun laporan\n2. Data yang tersedia:\n   - KPI SMAP yang sudah ada?\n   - Jumlah temuan audit internal?\n   - Jumlah laporan pelanggaran?\n   - Jumlah pelatihan yang dilaksanakan?\n\nJika data belum ada, ketik **\"buat template dengan placeholder\"**.",
        suggestions: ["Buat template laporan dengan placeholder", "Saya punya data ini...", "Apa yang harus ada di Tinjauan Manajemen?"],
      },
      {
        key: "insiden",
        label: "Sub-Agen Pengelolaan Insiden",
        shortLabel: "Insiden Penyuapan",
        description: "Pengelolaan laporan dan insiden penyuapan (Klausul 8.9 & 10.1)",
        deliverable: "Log Insiden + SOP Investigasi",
        icon: ShieldAlert,
        opening: "Saya Sub-Agen Pengelolaan Insiden Penyuapan. Saya membantu mengelola laporan dugaan penyuapan yang masuk — dari penerimaan hingga penyelesaian.\n\nApakah Anda sedang:\n- **A)** Ada insiden/laporan yang perlu ditangani sekarang → ceritakan kasusnya (tanpa identitas spesifik)\n- **B)** Butuh SOP pengelolaan insiden dan log insiden\n- **C)** Ingin memahami alur investigasi yang benar\n\nSemua informasi sensitif yang Anda bagikan di sini bersifat konfidensial dalam konteks pelatihan ini.",
        suggestions: ["B - Buat SOP + Log Insiden", "C - Jelaskan alur investigasi", "A - Ada laporan masuk, bagaimana prosedurnya?"],
      },
      {
        key: "resertifikasi",
        label: "Sub-Agen Re-sertifikasi",
        shortLabel: "Re-sertifikasi",
        description: "Persiapan audit re-sertifikasi 3 tahunan",
        deliverable: "Rencana Persiapan Re-sertifikasi",
        icon: RotateCw,
        opening: "Saya Sub-Agen Persiapan Re-sertifikasi. Saya membantu Anda mempersiapkan **audit re-sertifikasi SNI ISO 37001:2016** yang dilakukan setiap 3 tahun.\n\nRe-sertifikasi lebih menyeluruh dari surveilance — auditor akan mengaudit semua klausul dan memastikan SMAP masih efektif selama 3 tahun terakhir.\n\n**Info yang dibutuhkan:**\n1. Kapan sertifikat berakhir?\n2. Hasil surveilance terakhir (ada NCR yang open?)\n3. Perubahan besar perusahaan 3 tahun terakhir (merger, restrukturisasi, dll)?\n\nSaya akan buat rencana persiapan 6 bulan sebelum audit.",
        suggestions: ["Sertifikat berakhir 6 bulan lagi", "Tidak ada NCR, kondisi baik", "Buat timeline persiapan re-sertifikasi"],
      },
    ],
  },
];

export default function GustafdaCollab() {
  const [activeAgent, setActiveAgent] = useState<AgentKey>("dokumen");
  const [activeSubKey, setActiveSubKey] = useState<string | null>(null);
  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>({});
  const [completedDocs, setCompletedDocs] = useState<Set<string>>(new Set());
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { data: company } = useQuery<{ name?: string }>({ queryKey: ["/api/company"] });

  // Load Blueprint from Dialog
  const { data: blueprintData } = useQuery<{
    blueprint: {
      namaPerusahaan: string;
      profilRisiko: { level: string; skor: number; faktorUtama: string[] };
      rekomendasiFase: { fase: string; estimasiWaktu: string; alasan: string };
      dokumenPrioritas: Array<{ nama: string; klausul: string; prioritas: string }>;
      kondisiEksisting: { kekuatan: string[]; kelemahan: string[]; peluang: string[] };
      kesimpulan: string;
    } | null;
    meta: { companyName: string | null; riskLevel: string | null; riskScore: number | null; recommendedPhase: string | null; priorityDocs: Array<{ nama: string; klausul: string; prioritas: string }> | null; savedAt: string | null } | null;
  }>({ queryKey: ["/api/gustafta/blueprint/latest"], retry: false });
  const [showBlueprintBanner, setShowBlueprintBanner] = useState(true);

  const latestBlueprint = blueprintData?.blueprint;
  const blueprintMeta = blueprintData?.meta;

  // Build context string from blueprint for sub-agents
  const blueprintContext = latestBlueprint ? `
BLUEPRINT SMAP PERUSAHAAN (dari Gustafta Dialog):
- Perusahaan: ${latestBlueprint.namaPerusahaan}
- Profil Risiko: ${latestBlueprint.profilRisiko.level} (Skor ${latestBlueprint.profilRisiko.skor}/10)
- Faktor Risiko Utama: ${latestBlueprint.profilRisiko.faktorUtama.join(", ")}
- Rekomendasi Fase: ${latestBlueprint.rekomendasiFase.fase} (${latestBlueprint.rekomendasiFase.estimasiWaktu})
- Dokumen Prioritas: ${latestBlueprint.dokumenPrioritas.map(d => `${d.nama} [${d.prioritas}]`).join("; ")}
- Kekuatan Saat Ini: ${latestBlueprint.kondisiEksisting.kekuatan.join(", ")}
- Gap Utama: ${latestBlueprint.kondisiEksisting.kelemahan.join(", ")}
INSTRUKSI: Gunakan konteks blueprint di atas. JANGAN tanya informasi perusahaan yang sudah ada di blueprint. Langsung personalkan output berdasarkan data di atas.
  `.trim() : "";

  // Match blueprint priority docs to sub-agents
  const PRIORITY_KEYWORDS: Record<string, string[]> = {
    pedoman: ["pedoman", "manual abms", "manual smap"],
    kebijakan: ["kebijakan", "policy anti"],
    sk_fkap: ["fkap", "sk tim", "penetapan tim", "fungsi kepatuhan"],
    sasaran: ["sasaran", "tabel sasaran", "kpi smap", "pencapaian smap"],
    register_risiko: ["register risiko", "risiko penyuapan"],
    sop_whistleblowing: ["whistleblowing", "wbs", "pelaporan pelanggaran"],
    program_pelatihan: ["pelatihan", "awareness", "training"],
    uji_tuntas: ["uji tuntas", "due diligence", "mitra bisnis"],
    program: ["program audit", "jadwal audit"],
    checklist: ["checklist audit"],
    laporan: ["laporan audit", "ncr", "temuan"],
    capa: ["capa", "tindakan korektif"],
    gap: ["gap analysis", "kesenjangan"],
    mock: ["mock audit", "simulasi audit"],
    matriks: ["matriks", "pemenuhan klausul"],
    stage: ["stage 1", "stage 2", "persiapan sertifikasi"],
    kpi: ["kpi", "monitoring", "indikator"],
    surveilance_laporan: ["laporan kinerja", "kinerja smap"],
    insiden: ["insiden", "pengelolaan insiden"],
    resertifikasi: ["re-sertifikasi", "perpanjangan"],
  };

  function getBlueprintPriority(subKey: string): string | null {
    if (!latestBlueprint?.dokumenPrioritas) return null;
    const keywords = PRIORITY_KEYWORDS[subKey] || [];
    for (const doc of latestBlueprint.dokumenPrioritas) {
      const docLower = doc.nama.toLowerCase();
      if (keywords.some(k => docLower.includes(k))) return doc.prioritas;
    }
    return null;
  }

  const agent = AGENTS.find(a => a.key === activeAgent)!;
  const subAgent = agent.subAgents.find(s => s.key === activeSubKey) || null;
  const sessionKey = activeSubKey ? `${activeAgent}_${activeSubKey}` : null;
  const messages = sessionKey ? (allMessages[sessionKey] || []) : [];
  const SubIcon = subAgent?.icon || FileText;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages, isLoading, activeSubKey]);

  useEffect(() => {
    setInput("");
  }, [activeSubKey, activeAgent]);

  const openSubAgent = (subKey: string) => {
    setActiveSubKey(subKey);
    const key = `${activeAgent}_${subKey}`;
    if (!allMessages[key]) {
      const sub = agent.subAgents.find(s => s.key === subKey)!;
      setAllMessages(prev => ({
        ...prev,
        [key]: [{ role: "assistant", content: sub.opening }],
      }));
    }
  };

  const sendMessage = async (messageText?: string) => {
    if (!sessionKey || !subAgent) return;
    const userText = (messageText || input).trim();
    if (!userText || isLoading) return;
    setInput("");

    const withUser: Message[] = [...messages, { role: "user", content: userText }];
    setAllMessages(prev => ({
      ...prev,
      [sessionKey]: [...withUser, { role: "assistant", content: "" }],
    }));
    setIsLoading(true);

    try {
      const response = await fetch("/api/gustafta/subagent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: withUser,
          agentKey: activeAgent,
          subAgentKey: activeSubKey,
          companyName: latestBlueprint?.namaPerusahaan || company?.name || "",
          companyContext: blueprintContext,
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
                  setAllMessages(prev => {
                    const updated = [...(prev[sessionKey] || [])];
                    updated[updated.length - 1] = { role: "assistant", content: text };
                    return { ...prev, [sessionKey]: updated };
                  });
                }
              } catch {}
            }
          }
        }
      }
    } catch {
      toast({ title: "Error", description: "Gagal mengirim pesan.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleCompleted = (docKey: string) => {
    setCompletedDocs(prev => {
      const next = new Set(prev);
      if (next.has(docKey)) next.delete(docKey);
      else next.add(docKey);
      return next;
    });
  };

  const totalDone = AGENTS.reduce((acc, a) =>
    acc + a.subAgents.filter(s => completedDocs.has(`${a.key}_${s.key}`)).length, 0);
  const totalAll = AGENTS.reduce((acc, a) => acc + a.subAgents.length, 0);
  const agentDone = agent.subAgents.filter(s => completedDocs.has(`${activeAgent}_${s.key}`)).length;

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="flex-none border-b bg-white px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center", agent.bgColor)}>
              <Users className="h-4.5 w-4.5 text-white" style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900">Gustafta Collab</h1>
                <Badge className="bg-purple-100 text-purple-700 border-0 text-xs">Multi-Agent</Badge>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>{totalDone}/{totalAll} deliverables selesai</span>
                <span>·</span>
                <span>{AGENTS.reduce((a, ag) => a + ag.subAgents.length, 0)} sub-agen spesialis</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                style={{ width: `${(totalDone / totalAll) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-right">{Math.round((totalDone / totalAll) * 100)}% selesai</p>
          </div>
        </div>

        <Tabs value={activeAgent} onValueChange={v => { setActiveAgent(v as AgentKey); setActiveSubKey(null); }}>
          <TabsList className="grid w-full grid-cols-4 h-auto">
            {AGENTS.map(a => {
              const Icon = a.icon;
              const done = a.subAgents.filter(s => completedDocs.has(`${a.key}_${s.key}`)).length;
              return (
                <TabsTrigger
                  key={a.key} value={a.key}
                  className="flex-col py-1.5 gap-0 h-auto"
                  data-testid={`tab-agent-${a.key}`}
                >
                  <div className="flex items-center gap-1">
                    <Icon className="h-3 w-3" />
                    <span className="text-xs font-medium hidden md:block">{a.label.replace("Agen ", "")}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{done}/{a.subAgents.length}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Blueprint Context Banner */}
      {latestBlueprint && showBlueprintBanner && (
        <div className="flex-none border-b bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 px-4 py-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Sparkles className="h-3.5 w-3.5 text-blue-600 flex-none" />
            <span className="text-xs font-semibold text-blue-700">Blueprint Aktif:</span>
            <span className="text-xs font-medium text-slate-700">{latestBlueprint.namaPerusahaan}</span>
            <span className="text-xs text-slate-400">·</span>
            <span className={cn("text-xs font-medium", {
              "text-green-600": latestBlueprint.profilRisiko.level === "Rendah",
              "text-yellow-600": latestBlueprint.profilRisiko.level === "Sedang",
              "text-orange-600": latestBlueprint.profilRisiko.level === "Tinggi",
              "text-red-600": latestBlueprint.profilRisiko.level === "Sangat Tinggi",
            })}>Risiko {latestBlueprint.profilRisiko.level}</span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-600">{latestBlueprint.rekomendasiFase.fase}</span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-yellow-600 font-medium flex items-center gap-0.5">
              <Star className="h-3 w-3" fill="currentColor" /> = Prioritas Blueprint
            </span>
            <button onClick={() => setShowBlueprintBanner(false)} className="ml-auto p-1 rounded hover:bg-blue-100 flex-none" title="Tutup banner">
              <X className="h-3 w-3 text-slate-400" />
            </button>
          </div>
        </div>
      )}

      {/* Body: 3 panels */}
      <div className="flex-1 overflow-hidden flex">
        {/* LEFT: Sub-agent list */}
        <div className="w-52 flex-none border-r bg-white flex flex-col">
          <div className="p-3 border-b">
            <Badge className={cn("text-xs w-full justify-center py-0.5", agent.badgeColor)}>
              {agent.fase}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2 px-1">
              {agentDone}/{agent.subAgents.length} dokumen selesai
            </p>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {agent.subAgents.map(sub => {
                const Icon = sub.icon;
                const isActive = activeSubKey === sub.key;
                const docKey = `${activeAgent}_${sub.key}`;
                const isDone = completedDocs.has(docKey);
                const hasHistory = !!allMessages[docKey]?.length;
                return (
                  <button
                    key={sub.key}
                    onClick={() => openSubAgent(sub.key)}
                    data-testid={`subagent-${activeAgent}-${sub.key}`}
                    className={cn(
                      "w-full flex items-start gap-2 p-2.5 rounded-lg text-left transition-all",
                      isActive
                        ? `${agent.bgColor} text-white`
                        : "hover:bg-slate-50 text-slate-700"
                    )}
                  >
                    <Icon className={cn("h-3.5 w-3.5 mt-0.5 flex-none", isActive ? "text-white" : agent.color)} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-medium leading-tight">{sub.shortLabel}</span>
                        {getBlueprintPriority(sub.key) && !isDone && (
                          <Star className={cn("h-2.5 w-2.5 flex-none", isActive ? "text-yellow-200" : "text-yellow-500")} fill="currentColor" />
                        )}
                      </div>
                      <div className={cn("text-xs leading-tight mt-0.5 truncate", isActive ? "text-white/70" : "text-slate-400")}>
                        {sub.deliverable}
                      </div>
                    </div>
                    <div className="flex-none">
                      {isDone
                        ? <CheckCircle2 className={cn("h-3.5 w-3.5", isActive ? "text-white" : "text-green-500")} />
                        : hasHistory
                          ? <div className={cn("h-1.5 w-1.5 rounded-full mt-1", isActive ? "bg-white" : "bg-blue-400")} />
                          : null
                      }
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>

          {/* Quick links */}
          <div className="p-2 border-t">
            <p className="text-xs text-slate-400 px-1 mb-1 font-medium">Tools</p>
            {agent.quickLinks.map((link, i) => {
              const Icon = link.icon;
              return (
                <Link key={i} href={link.url}>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-50 cursor-pointer">
                    <Icon className={cn("h-3 w-3 flex-none", agent.color)} />
                    <span className="text-xs text-slate-600 truncate">{link.label}</span>
                    <ExternalLink className="h-2.5 w-2.5 text-slate-300 ml-auto flex-none" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* CENTER: Chat or welcome */}
        <div className="flex-1 flex flex-col min-w-0">
          {!subAgent ? (
            /* No sub-agent selected → show overview */
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-6">
                  <div className={cn("h-14 w-14 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm", agent.bgColor)}>
                    <agent.icon className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">{agent.label}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{agent.fase} — {agent.subAgents.length} sub-agen spesialis</p>
                </div>

                {/* Blueprint Summary Card */}
                {latestBlueprint && (
                  <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center flex-none">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-blue-800">Blueprint Gustafta Dialog</span>
                          <Badge className="text-xs bg-blue-100 text-blue-700 border-0">Terhubung</Badge>
                        </div>
                        <p className="text-xs text-blue-700 mt-0.5">
                          <span className="font-medium">{latestBlueprint.namaPerusahaan}</span>
                          {" · "}Risiko <span className={cn("font-medium", {
                            "text-green-700": latestBlueprint.profilRisiko.level === "Rendah",
                            "text-yellow-700": latestBlueprint.profilRisiko.level === "Sedang",
                            "text-orange-700": latestBlueprint.profilRisiko.level === "Tinggi",
                            "text-red-700": latestBlueprint.profilRisiko.level === "Sangat Tinggi",
                          })}>{latestBlueprint.profilRisiko.level}</span>
                          {" · "}{latestBlueprint.rekomendasiFase.fase}
                        </p>
                        {latestBlueprint.dokumenPrioritas.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {latestBlueprint.dokumenPrioritas.slice(0, 4).map((d, i) => (
                              <span key={i} className={cn("inline-flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded font-medium", {
                                "bg-red-100 text-red-700": d.prioritas === "Kritis",
                                "bg-orange-100 text-orange-700": d.prioritas === "Tinggi",
                                "bg-yellow-100 text-yellow-700": d.prioritas === "Sedang",
                              })}>
                                <Star className="h-2.5 w-2.5" fill="currentColor" /> {d.nama}
                              </span>
                            ))}
                            {latestBlueprint.dokumenPrioritas.length > 4 && (
                              <span className="text-xs text-blue-600">+{latestBlueprint.dokumenPrioritas.length - 4} lainnya</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <div className="flex items-center gap-2 text-xs text-blue-600">
                        <Info className="h-3 w-3 flex-none" />
                        <span>Sub-agen bertanda <Star className="h-2.5 w-2.5 inline text-yellow-500" fill="currentColor" /> adalah prioritas dari Blueprint Anda — mulai dari sini untuk hasil optimal.</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3">
                  {agent.subAgents.map(sub => {
                    const Icon = sub.icon;
                    const docKey = `${activeAgent}_${sub.key}`;
                    const isDone = completedDocs.has(docKey);
                    const hasHistory = !!(allMessages[docKey]?.length);
                    return (
                      <button
                        key={sub.key}
                        onClick={() => openSubAgent(sub.key)}
                        data-testid={`card-subagent-${sub.key}`}
                        className={cn(
                          "flex items-start gap-4 p-4 bg-white border rounded-xl text-left hover:border-slate-300 hover:shadow-sm transition-all",
                          isDone && "border-green-200 bg-green-50",
                          !isDone && getBlueprintPriority(sub.key) === "Kritis" && "border-red-200",
                          !isDone && getBlueprintPriority(sub.key) === "Tinggi" && "border-orange-200",
                        )}
                      >
                        <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center flex-none", agent.bgColor + "/10")}>
                          <Icon className={cn("h-5 w-5", agent.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-slate-800">{sub.label}</span>
                            {isDone && <Badge className="text-xs bg-green-100 text-green-700 border-0">Selesai</Badge>}
                            {!isDone && hasHistory && <Badge className="text-xs bg-blue-100 text-blue-700 border-0">Dalam proses</Badge>}
                            {!isDone && getBlueprintPriority(sub.key) && (
                              <Badge className={cn("text-xs border-0 flex items-center gap-0.5", {
                                "bg-red-100 text-red-700": getBlueprintPriority(sub.key) === "Kritis",
                                "bg-orange-100 text-orange-700": getBlueprintPriority(sub.key) === "Tinggi",
                                "bg-yellow-100 text-yellow-700": getBlueprintPriority(sub.key) === "Sedang",
                              })}>
                                <Star className="h-2.5 w-2.5" fill="currentColor" />
                                {getBlueprintPriority(sub.key)}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{sub.description}</p>
                          <p className="text-xs font-medium mt-1.5 flex items-center gap-1">
                            <span className={cn("h-1.5 w-1.5 rounded-full inline-block", agent.bgColor)} />
                            Output: {sub.deliverable}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 mt-1 flex-none" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Sub-agent chat header */}
              <div className={cn("flex-none px-4 py-2.5 border-b flex items-center gap-3", agent.bgColor + "/5")}>
                <button onClick={() => setActiveSubKey(null)} className="p-1 rounded hover:bg-slate-200/50 transition-colors">
                  <ArrowLeft className="h-4 w-4 text-slate-500" />
                </button>
                <div className={cn("h-7 w-7 rounded-md flex items-center justify-center", agent.bgColor)}>
                  <SubIcon className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{subAgent.label}</p>
                  <p className="text-xs text-muted-foreground truncate">Output: {subAgent.deliverable}</p>
                </div>
                <button
                  onClick={() => {
                    if (sessionKey) setAllMessages(prev => ({ ...prev, [sessionKey]: [] }));
                    openSubAgent(activeSubKey!);
                  }}
                  className="p-1.5 rounded hover:bg-slate-200/50 transition-colors"
                  title="Reset percakapan"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4 max-w-2xl mx-auto">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={cn("flex gap-2.5", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                      <div className={cn(
                        "h-7 w-7 rounded-full flex items-center justify-center flex-none text-xs font-bold",
                        msg.role === "assistant" ? `${agent.bgColor} text-white` : "bg-slate-200 text-slate-600"
                      )}>
                        {msg.role === "assistant" ? "G" : "U"}
                      </div>
                      <div className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
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

              {/* Suggestions if short conversation */}
              {messages.length <= 1 && (
                <div className="flex-none px-4 pb-2">
                  <div className="max-w-2xl mx-auto flex flex-wrap gap-1.5">
                    {subAgent.suggestions.map((s, i) => (
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
              <div className="flex-none border-t bg-white p-3">
                <div className="max-w-2xl mx-auto flex gap-2 items-end">
                  <Textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Tanya ${subAgent.shortLabel}... (Enter kirim)`}
                    className="resize-none min-h-[44px] max-h-[100px] text-sm"
                    disabled={isLoading}
                    data-testid="input-subagent-message"
                    rows={2}
                  />
                  <Button
                    onClick={() => sendMessage()}
                    disabled={isLoading || !input.trim()}
                    className={cn("h-[44px] px-3 flex-none", agent.bgColor)}
                    data-testid="button-subagent-send"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* RIGHT: Progress panel */}
        <div className="w-52 flex-none border-l bg-white flex flex-col">
          <div className="p-3 border-b">
            <p className="text-xs font-semibold text-slate-700">Progress Dokumen</p>
            <p className="text-xs text-muted-foreground mt-0.5">Centang jika selesai</p>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2">
              {AGENTS.map(a => (
                <div key={a.key} className="mb-3">
                  <div className={cn("flex items-center gap-1.5 px-1 mb-1.5 py-0.5 rounded", activeAgent === a.key ? a.badgeColor : "")}>
                    <a.icon className="h-3 w-3" />
                    <span className="text-xs font-medium">{a.label.replace("Agen ", "")}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {a.subAgents.filter(s => completedDocs.has(`${a.key}_${s.key}`)).length}/{a.subAgents.length}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {a.subAgents.map(sub => {
                      const docKey = `${a.key}_${sub.key}`;
                      const done = completedDocs.has(docKey);
                      return (
                        <button
                          key={sub.key}
                          onClick={() => toggleCompleted(docKey)}
                          data-testid={`progress-${a.key}-${sub.key}`}
                          className="w-full flex items-center gap-1.5 px-1.5 py-1 rounded hover:bg-slate-50 transition-colors"
                        >
                          {done
                            ? <CheckCircle2 className="h-3 w-3 text-green-500 flex-none" />
                            : <Circle className="h-3 w-3 text-slate-300 flex-none" />
                          }
                          <span className={cn("text-xs leading-tight text-left", done ? "line-through text-slate-400" : "text-slate-600")}>
                            {sub.deliverable}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {a.key !== "surveilance" && <Separator className="mt-2" />}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Link to Dialog */}
          <div className="p-2 border-t">
            <Link href="/gustafta-dialog">
              <Button variant="ghost" size="sm" className="w-full gap-1.5 text-xs text-blue-600 h-8">
                <MessageSquare className="h-3 w-3" />
                Gustafta Dialog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
