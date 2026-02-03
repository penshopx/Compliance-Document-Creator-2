import type { IndustryConfig } from "@shared/config/industry-types";

export const k3Config: IndustryConfig = {
  id: "k3",
  name: "Keselamatan & Kesehatan Kerja (K3)",
  shortName: "K3",
  tagline: "SMK3, Ahli K3, HIRADC",
  description: "Platform lengkap untuk manajemen K3, sertifikasi, dan dokumen keselamatan kerja sesuai regulasi Indonesia",
  icon: "HardHat",
  color: "red",
  isActive: true,
  sortOrder: 9,

  landingContent: {
    badge: "Untuk Keselamatan Kerja Indonesia",
    headline: "Keselamatan &",
    headlineHighlight: "Kesehatan Kerja",
    subheadline: "Solusi terintegrasi untuk SMK3, sertifikasi ahli K3, dan dokumen keselamatan kerja dengan AI-powered document generation.",
    ctaPrimary: "Mulai Sekarang",
    ctaSecondary: "Pelajari Lebih Lanjut",
    features: [
      { icon: "Shield", title: "SMK3", description: "Sistem Manajemen K3 sesuai PP 50/2012 dengan 166 kriteria audit" },
      { icon: "Award", title: "Sertifikasi Ahli K3", description: "Kelola sertifikasi Ahli K3 Umum, Konstruksi, Listrik, Kimia, dan spesialisasi lainnya" },
      { icon: "Wrench", title: "Peralatan K3", description: "Manajemen alat pelindung diri (APD), alat pemadam, dan peralatan keselamatan" },
      { icon: "FileText", title: "80+ Template Dokumen", description: "Template dokumen K3: JSA, HIRADC, SOP, dan laporan kecelakaan" },
      { icon: "Sparkles", title: "AI Generator", description: "Generate dokumen K3, analisis risiko, dan prosedur keselamatan dengan AI" },
      { icon: "AlertTriangle", title: "Incident Management", description: "Sistem pelaporan dan investigasi kecelakaan kerja terintegrasi" }
    ],
    stats: [
      { value: "80+", label: "Template Dokumen" },
      { value: "166", label: "Kriteria SMK3" },
      { value: "24/7", label: "AI Assistant" },
      { value: "PP 50/2012", label: "Regulasi SMK3" }
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
      label: "SMK3",
      items: [
        { title: "Overview SMK3", url: "/smk3", icon: "Target" },
        { title: "Audit SMK3", url: "/audit-smk3", icon: "ClipboardCheck" },
        { title: "166 Kriteria", url: "/kriteria", icon: "CheckSquare" },
        { title: "Kebijakan K3", url: "/kebijakan", icon: "FileText" }
      ]
    },
    {
      label: "Sertifikasi",
      items: [
        { title: "Ahli K3 Umum", url: "/ahli-umum", icon: "UserCheck" },
        { title: "Ahli K3 Konstruksi", url: "/ahli-konstruksi", icon: "Building2" },
        { title: "Ahli K3 Listrik", url: "/ahli-listrik", icon: "Zap" },
        { title: "Operator K3", url: "/operator", icon: "Settings" }
      ]
    },
    {
      label: "Manajemen Risiko",
      items: [
        { title: "HIRADC", url: "/hiradc", icon: "Search" },
        { title: "JSA", url: "/jsa", icon: "ClipboardList" },
        { title: "Permit to Work", url: "/permit", icon: "Key" },
        { title: "Incident Report", url: "/incident", icon: "AlertOctagon" }
      ]
    },
    {
      label: "Dokumen",
      items: [
        { title: "Template Dokumen", url: "/templates", icon: "FileText" },
        { title: "AI Generator", url: "/generator", icon: "Sparkles" }
      ]
    }
  ],

  templateCategories: [
    { id: "all", label: "Semua" },
    { id: "smk3", label: "SMK3" },
    { id: "risiko", label: "Manajemen Risiko" },
    { id: "insiden", label: "Insiden" },
    { id: "audit", label: "Audit" },
    { id: "sop", label: "SOP" }
  ],

  templates: [
    {
      code: "K3-001",
      title: "Kebijakan K3",
      description: "Template kebijakan keselamatan dan kesehatan kerja",
      category: "smk3",
      icon: "FileText",
      color: "red",
      promptTemplate: "Buatkan kebijakan K3 untuk {{nama_perusahaan}} dengan {{jumlah_pekerja}} pekerja di bidang {{jenis_usaha}}.",
      requiredFields: ["nama_perusahaan", "jumlah_pekerja", "jenis_usaha"]
    },
    {
      code: "K3-002",
      title: "Form HIRADC",
      description: "Template Hazard Identification, Risk Assessment, Determining Controls",
      category: "risiko",
      icon: "Search",
      color: "amber",
      promptTemplate: "Buatkan HIRADC untuk kegiatan {{nama_kegiatan}} di area {{area_kerja}}.",
      requiredFields: ["nama_kegiatan", "area_kerja"]
    },
    {
      code: "K3-003",
      title: "Form JSA",
      description: "Template Job Safety Analysis",
      category: "risiko",
      icon: "ClipboardList",
      color: "blue",
      promptTemplate: "Buatkan JSA untuk pekerjaan {{jenis_pekerjaan}} dengan langkah-langkah keselamatan.",
      requiredFields: ["jenis_pekerjaan"]
    },
    {
      code: "K3-004",
      title: "Laporan Kecelakaan",
      description: "Template laporan kecelakaan kerja",
      category: "insiden",
      icon: "AlertTriangle",
      color: "red",
      promptTemplate: "Buatkan format laporan kecelakaan kerja untuk {{jenis_kecelakaan}} yang terjadi di {{lokasi}}.",
      requiredFields: ["jenis_kecelakaan", "lokasi"]
    },
    {
      code: "K3-005",
      title: "Checklist Audit SMK3",
      description: "Template checklist 166 kriteria SMK3",
      category: "audit",
      icon: "CheckSquare",
      color: "green",
      promptTemplate: "Buatkan checklist audit SMK3 untuk elemen {{elemen_smk3}}.",
      requiredFields: ["elemen_smk3"]
    }
  ],

  dataBindings: [
    { key: "nama_perusahaan", label: "Nama Perusahaan", source: "company", field: "name", defaultValue: "[Nama Perusahaan]" },
    { key: "alamat", label: "Alamat", source: "company", field: "address", defaultValue: "[Alamat]" },
    { key: "jumlah_pekerja", label: "Jumlah Pekerja", source: "company", field: "jumlah_pekerja", defaultValue: "[Jumlah Pekerja]" },
    { key: "tingkat_risiko", label: "Tingkat Risiko", source: "company", field: "tingkat_risiko", defaultValue: "[Tingkat Risiko]" },
    { key: "tanggal", label: "Tanggal", source: "system", field: "date" },
    { key: "tahun", label: "Tahun", source: "system", field: "year" }
  ],

  chatbot: {
    name: "K3 Mentor",
    description: "Asisten AI ahli Keselamatan dan Kesehatan Kerja Indonesia",
    systemPrompt: `Anda adalah K3 Mentor, asisten AI yang ahli dalam bidang Keselamatan dan Kesehatan Kerja (K3) di Indonesia.

Keahlian Anda meliputi:
- SMK3 (PP 50/2012) dan 166 kriteria audit
- Sertifikasi Ahli K3: Umum, Konstruksi, Listrik, Kimia, Migas, dll
- HIRADC (Hazard Identification, Risk Assessment, Determining Controls)
- JSA (Job Safety Analysis) dan Permit to Work
- Investigasi kecelakaan dan pelaporan insiden
- Regulasi Kemnaker, Permenaker, dan standar K3
- APD, APAR, P3K, dan peralatan keselamatan
- ISO 45001 dan integrasi dengan SMK3

Berikan panduan yang akurat sesuai UU K3 No. 1/1970, PP 50/2012, dan regulasi K3 terbaru Indonesia.`,
    greetings: [
      "Halo! Saya K3 Mentor, siap membantu Anda dengan manajemen keselamatan dan kesehatan kerja.",
      "Selamat datang! Ada yang bisa saya bantu terkait SMK3, HIRADC, atau sertifikasi K3?"
    ],
    suggestedTopics: [
      "Memulai implementasi SMK3",
      "Persyaratan sertifikasi Ahli K3 Umum",
      "Membuat HIRADC yang efektif",
      "Langkah investigasi kecelakaan kerja",
      "166 kriteria audit SMK3"
    ],
    color: "red"
  }
};
