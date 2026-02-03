import type { IndustryConfig } from "@shared/config/industry-types";

export const konstruksiConfig: IndustryConfig = {
  id: "konstruksi",
  name: "Kepatuhan Industri Konstruksi",
  shortName: "Konstruksi",
  tagline: "Legalitas, SBU, SKK, NIB, Tender",
  description: "Platform lengkap untuk mengelola legalitas, perijinan, sertifikasi, tender, dan operasional bidang konstruksi sesuai regulasi Indonesia",
  icon: "Building2",
  color: "amber",
  isActive: true,
  sortOrder: 3,

  landingContent: {
    badge: "Untuk Perusahaan Jasa Konstruksi Indonesia",
    headline: "Kepatuhan",
    headlineHighlight: "Industri Konstruksi",
    subheadline: "Platform terintegrasi untuk Legalitas, Perijinan (SBU, NIB), Sertifikasi (SKK, K3), Tender, dan Operasional dengan AI-powered document generation.",
    ctaPrimary: "Mulai Sekarang",
    ctaSecondary: "Pelajari Lebih Lanjut",
    features: [
      { icon: "Scale", title: "Legalitas Usaha", description: "Kelola Akta, NIB, NPWP, dan dokumen legalitas perusahaan konstruksi" },
      { icon: "FileCheck", title: "Perijinan (SBU)", description: "Manajemen Sertifikat Badan Usaha dan izin-izin terkait konstruksi" },
      { icon: "Award", title: "Sertifikasi (SKK)", description: "Sertifikat Kompetensi Kerja dan sertifikasi K3 tenaga kerja konstruksi" },
      { icon: "Gavel", title: "Tender & Pengadaan", description: "Template dokumen tender, penawaran, RAB, dan metode pelaksanaan" },
      { icon: "Settings", title: "Operasional Proyek", description: "SOP, laporan kemajuan proyek, quality control, dan HSE" },
      { icon: "Sparkles", title: "AI Document Generator", description: "Generate dokumen kepatuhan konstruksi dengan bantuan AI" }
    ],
    stats: [
      { value: "100+", label: "Template Dokumen" },
      { value: "5", label: "Domain Kepatuhan" },
      { value: "24/7", label: "AI Assistant" },
      { value: "PP 14/2021", label: "Regulasi Terbaru" }
    ]
  },

  menuGroups: [
    {
      label: "Menu Utama",
      items: [
        { title: "Beranda", url: "/", icon: "Home" },
        { title: "Dashboard", url: "/dashboard", icon: "LayoutDashboard" },
        { title: "Profil Perusahaan", url: "/company", icon: "Building2" }
      ]
    },
    {
      label: "Data Perusahaan",
      items: [
        { title: "Karyawan", url: "/employees", icon: "UserCheck" },
        { title: "Klasifikasi SBU", url: "/qualifications", icon: "Award" },
        { title: "Peralatan", url: "/equipment", icon: "Wrench" },
        { title: "Proyek", url: "/projects", icon: "FolderKanban" },
        { title: "Vendor & Mitra", url: "/vendors", icon: "Handshake" }
      ]
    },
    {
      label: "Dokumen Kepatuhan",
      items: [
        { title: "Template Repository", url: "/template-repository", icon: "Library", badge: "5 Domain" },
        { title: "Generator Dokumen", url: "/documents", icon: "FileText" },
        { title: "Document Builder", url: "/document-builder", icon: "FilePlus2" },
        { title: "PDCA Generator", url: "/pdca", icon: "Zap" }
      ]
    }
  ],

  templateCategories: [
    { id: "all", label: "Semua" },
    { id: "legalitas", label: "Legalitas" },
    { id: "perijinan", label: "Perijinan" },
    { id: "sertifikasi", label: "Sertifikasi" },
    { id: "tender", label: "Tender" },
    { id: "operasional", label: "Operasional" }
  ],

  templates: [
    // LEGALITAS
    {
      code: "KONST-L01",
      title: "Perubahan Akta Perusahaan",
      description: "Template perubahan akta pendirian untuk perusahaan konstruksi",
      category: "legalitas",
      domain: "legalitas",
      icon: "Scale",
      color: "blue",
      promptTemplate: "Buatkan draft perubahan akta untuk perusahaan konstruksi {{nama_perusahaan}} dengan perubahan: {{jenis_perubahan}}.",
      requiredFields: ["nama_perusahaan", "jenis_perubahan"]
    },
    {
      code: "KONST-L02",
      title: "Surat Keterangan Domisili",
      description: "Template surat keterangan domisili perusahaan",
      category: "legalitas",
      domain: "legalitas",
      icon: "Home",
      color: "blue",
      promptTemplate: "Buatkan surat keterangan domisili untuk perusahaan konstruksi {{nama_perusahaan}} di alamat {{alamat}}.",
      requiredFields: ["nama_perusahaan", "alamat"]
    },
    // PERIJINAN
    {
      code: "KONST-P01",
      title: "Permohonan SBU Baru",
      description: "Template surat permohonan Sertifikat Badan Usaha baru ke LPJK",
      category: "perijinan",
      domain: "perijinan",
      icon: "FileCheck",
      color: "green",
      promptTemplate: "Buatkan surat permohonan SBU baru untuk perusahaan konstruksi dengan data: {{nama_perusahaan}}, klasifikasi {{klasifikasi}}, kualifikasi {{kualifikasi}}.",
      requiredFields: ["nama_perusahaan", "klasifikasi", "kualifikasi"]
    },
    {
      code: "KONST-P02",
      title: "Perpanjangan SBU",
      description: "Template permohonan perpanjangan Sertifikat Badan Usaha",
      category: "perijinan",
      domain: "perijinan",
      icon: "RefreshCw",
      color: "green",
      promptTemplate: "Buatkan surat permohonan perpanjangan SBU untuk {{nama_perusahaan}} dengan nomor SBU {{sbu_number}}.",
      requiredFields: ["nama_perusahaan", "sbu_number"]
    },
    {
      code: "KONST-P03",
      title: "Permohonan IMB/PBG",
      description: "Template permohonan Izin Mendirikan Bangunan / Persetujuan Bangunan Gedung",
      category: "perijinan",
      domain: "perijinan",
      icon: "Building",
      color: "green",
      promptTemplate: "Buatkan permohonan IMB/PBG untuk proyek {{nama_proyek}} di lokasi {{lokasi}} dengan luas {{luas}} m2.",
      requiredFields: ["nama_proyek", "lokasi", "luas"]
    },
    // SERTIFIKASI
    {
      code: "KONST-S01",
      title: "Permohonan SKK Baru",
      description: "Template permohonan Sertifikat Kompetensi Kerja (SKK) konstruksi",
      category: "sertifikasi",
      domain: "sertifikasi",
      icon: "Award",
      color: "amber",
      promptTemplate: "Buatkan surat permohonan SKK untuk tenaga kerja konstruksi {{nama_tenaga_kerja}} dengan jabatan {{jabatan}} dan pengalaman {{pengalaman}} tahun.",
      requiredFields: ["nama_tenaga_kerja", "jabatan", "pengalaman"]
    },
    {
      code: "KONST-S02",
      title: "Perpanjangan SKK",
      description: "Template permohonan perpanjangan SKK yang akan habis masa berlaku",
      category: "sertifikasi",
      domain: "sertifikasi",
      icon: "RefreshCw",
      color: "amber",
      promptTemplate: "Buatkan surat perpanjangan SKK untuk {{nama_tenaga_kerja}} dengan nomor SKK {{skk_number}}.",
      requiredFields: ["nama_tenaga_kerja", "skk_number"]
    },
    {
      code: "KONST-S03",
      title: "Sertifikasi K3 Konstruksi",
      description: "Template dokumen sertifikasi K3 untuk pekerja konstruksi",
      category: "sertifikasi",
      domain: "sertifikasi",
      icon: "Shield",
      color: "amber",
      promptTemplate: "Buatkan dokumen sertifikasi K3 konstruksi untuk proyek {{nama_proyek}} dengan jumlah pekerja {{jumlah_pekerja}}.",
      requiredFields: ["nama_proyek", "jumlah_pekerja"]
    },
    // TENDER
    {
      code: "KONST-T01",
      title: "Dokumen Kualifikasi Tender",
      description: "Template dokumen kualifikasi untuk mengikuti tender konstruksi",
      category: "tender",
      domain: "tender",
      icon: "FileCheck",
      color: "purple",
      promptTemplate: "Buatkan dokumen kualifikasi tender untuk {{nama_perusahaan}} mengikuti lelang proyek {{nama_proyek}}.",
      requiredFields: ["nama_perusahaan", "nama_proyek"]
    },
    {
      code: "KONST-T02",
      title: "Surat Penawaran Harga",
      description: "Template surat penawaran harga untuk tender konstruksi",
      category: "tender",
      domain: "tender",
      icon: "FileText",
      color: "purple",
      promptTemplate: "Buatkan surat penawaran harga untuk proyek {{nama_proyek}} dengan nilai penawaran {{nilai_penawaran}}.",
      requiredFields: ["nama_proyek", "nilai_penawaran"]
    },
    {
      code: "KONST-T03",
      title: "Rencana Anggaran Biaya",
      description: "Template RAB proyek konstruksi untuk tender",
      category: "tender",
      domain: "tender",
      icon: "Calculator",
      color: "purple",
      promptTemplate: "Buatkan Rencana Anggaran Biaya untuk proyek {{nama_proyek}} dengan spesifikasi pekerjaan berikut.",
      requiredFields: ["nama_proyek"]
    },
    {
      code: "KONST-T04",
      title: "Metode Pelaksanaan",
      description: "Template metode kerja untuk tender konstruksi",
      category: "tender",
      domain: "tender",
      icon: "Settings",
      color: "purple",
      promptTemplate: "Buatkan metode pelaksanaan untuk pekerjaan konstruksi {{jenis_pekerjaan}} dengan tahapan detail.",
      requiredFields: ["jenis_pekerjaan"]
    },
    // OPERASIONAL
    {
      code: "KONST-O01",
      title: "Kontrak Konstruksi",
      description: "Template kontrak pekerjaan konstruksi standar",
      category: "operasional",
      domain: "operasional",
      icon: "FileSignature",
      color: "cyan",
      promptTemplate: "Buatkan kontrak pekerjaan konstruksi untuk proyek {{nama_proyek}} dengan nilai {{nilai_kontrak}} dan durasi {{durasi}}.",
      requiredFields: ["nama_proyek", "nilai_kontrak", "durasi"]
    },
    {
      code: "KONST-O02",
      title: "Laporan Kemajuan Proyek",
      description: "Template laporan progress proyek konstruksi",
      category: "operasional",
      domain: "operasional",
      icon: "BarChart3",
      color: "cyan",
      promptTemplate: "Buatkan laporan kemajuan proyek {{nama_proyek}} periode {{periode}} dengan progress {{persentase}}%.",
      requiredFields: ["nama_proyek", "periode", "persentase"]
    },
    {
      code: "KONST-O03",
      title: "SOP Pelaksanaan Proyek",
      description: "Template SOP untuk pelaksanaan proyek konstruksi",
      category: "operasional",
      domain: "operasional",
      icon: "ClipboardList",
      color: "cyan",
      promptTemplate: "Buatkan SOP pelaksanaan proyek konstruksi {{jenis_proyek}} dengan tahapan lengkap.",
      requiredFields: ["jenis_proyek"]
    },
    {
      code: "KONST-O04",
      title: "Laporan HSE Harian",
      description: "Template laporan Health, Safety & Environment harian",
      category: "operasional",
      domain: "operasional",
      icon: "Shield",
      color: "cyan",
      promptTemplate: "Buatkan laporan HSE harian untuk proyek {{nama_proyek}} tanggal {{tanggal}}.",
      requiredFields: ["nama_proyek", "tanggal"]
    }
  ],

  dataBindings: [
    { key: "nama_perusahaan", label: "Nama Perusahaan", source: "company", field: "name", defaultValue: "[Nama Perusahaan]" },
    { key: "alamat", label: "Alamat", source: "company", field: "address", defaultValue: "[Alamat]" },
    { key: "npwp", label: "NPWP", source: "company", field: "npwp", defaultValue: "[NPWP]" },
    { key: "nib", label: "NIB", source: "company", field: "nib", defaultValue: "[NIB]" },
    { key: "sbu_number", label: "Nomor SBU", source: "company", field: "sbu_number", defaultValue: "[Nomor SBU]" },
    { key: "klasifikasi", label: "Klasifikasi", source: "company", field: "klasifikasi", defaultValue: "[Klasifikasi]" },
    { key: "kualifikasi", label: "Kualifikasi", source: "company", field: "kualifikasi", defaultValue: "[Kualifikasi]" },
    { key: "tanggal", label: "Tanggal", source: "system", field: "date" },
    { key: "tahun", label: "Tahun", source: "system", field: "year" }
  ],

  chatbot: {
    name: "Konstruksi Mentor",
    description: "Asisten AI ahli kepatuhan industri konstruksi Indonesia",
    systemPrompt: `Anda adalah Konstruksi Mentor, asisten AI yang ahli dalam bidang kepatuhan industri konstruksi di Indonesia.

Keahlian Anda meliputi 5 Domain Kepatuhan:

1. LEGALITAS - Akta pendirian, NIB, NPWP, dan dokumen legalitas usaha konstruksi
2. PERIJINAN - SBU (Sertifikat Badan Usaha), IMB/PBG, dan izin-izin terkait
3. SERTIFIKASI - SKK (Sertifikat Kompetensi Kerja), sertifikasi K3, ISO, SNI
4. TENDER - Dokumen kualifikasi, penawaran, RAB, metode pelaksanaan
5. OPERASIONAL - SOP proyek, laporan kemajuan, HSE, quality control

Catatan Penting:
- SKA (Sertifikat Keahlian) dan SKT (Sertifikat Keterampilan) sudah diganti dengan SKK (Sertifikat Kompetensi Kerja)
- SIUJK sudah tidak berlaku, diganti dengan NIB melalui sistem OSS
- Regulasi terbaru: PP 14/2021 tentang Perubahan PP 22/2020

Berikan panduan yang jelas, akurat, dan sesuai regulasi terbaru Indonesia.`,
    greetings: [
      "Halo! Saya Konstruksi Mentor, siap membantu Anda dengan kepatuhan industri konstruksi dalam 5 domain: Legalitas, Perijinan, Sertifikasi, Tender, dan Operasional.",
      "Selamat datang! Ada yang bisa saya bantu terkait SBU, SKK, NIB, atau dokumen konstruksi lainnya?"
    ],
    suggestedTopics: [
      "Cara mengurus perpanjangan SBU",
      "Persyaratan mendapatkan SKK (bukan SKA/SKT lagi)",
      "Proses perijinan NIB melalui OSS",
      "Klasifikasi dan kualifikasi SBU",
      "Membuat dokumen tender konstruksi"
    ],
    color: "amber"
  }
};
