import type { IndustryConfig } from "@shared/config/industry-types";

export const lingkunganConfig: IndustryConfig = {
  id: "lingkungan",
  name: "Lingkungan Hidup",
  shortName: "Lingkungan",
  tagline: "AMDAL, UKL-UPL, PROPER",
  description: "Platform lengkap untuk perijinan lingkungan, AMDAL, UKL-UPL, dan dokumen pengelolaan lingkungan hidup",
  icon: "Leaf",
  color: "green",
  isActive: true,
  sortOrder: 6,

  landingContent: {
    badge: "Untuk Pengelolaan Lingkungan Hidup Indonesia",
    headline: "Dokumen",
    headlineHighlight: "Lingkungan Hidup",
    subheadline: "Solusi terintegrasi untuk AMDAL, UKL-UPL, Persetujuan Lingkungan, dan sistem pelaporan lingkungan dengan AI-powered document generation.",
    ctaPrimary: "Mulai Sekarang",
    ctaSecondary: "Pelajari Lebih Lanjut",
    features: [
      { icon: "FileSearch", title: "AMDAL & UKL-UPL", description: "Kelola dokumen Analisis Mengenai Dampak Lingkungan dan Upaya Pengelolaan Lingkungan" },
      { icon: "CheckCircle", title: "Persetujuan Lingkungan", description: "Proses persetujuan lingkungan sesuai PP 22/2021 dan UU Cipta Kerja" },
      { icon: "AlertTriangle", title: "Izin Limbah B3", description: "Perijinan pengelolaan, pengumpulan, dan pengangkutan limbah B3" },
      { icon: "FileText", title: "70+ Template Dokumen", description: "Template dokumen lingkungan sesuai standar KLHK dan peraturan daerah" },
      { icon: "Sparkles", title: "AI Generator", description: "Generate dokumen AMDAL, laporan RKL-RPL, dan kajian lingkungan dengan AI" },
      { icon: "Upload", title: "SIMPEL & Pelaporan", description: "Integrasi pelaporan online ke SIMPEL KLHK dan sistem daerah" }
    ],
    stats: [
      { value: "70+", label: "Template Dokumen" },
      { value: "40+", label: "Jenis Perijinan" },
      { value: "24/7", label: "AI Assistant" },
      { value: "PP 22/2021", label: "Regulasi Terbaru" }
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
      label: "Perijinan Lingkungan",
      items: [
        { title: "AMDAL", url: "/amdal", icon: "FileSearch" },
        { title: "UKL-UPL", url: "/ukl-upl", icon: "ClipboardList" },
        { title: "SPPL", url: "/sppl", icon: "FileText" },
        { title: "Persetujuan Lingkungan", url: "/persetujuan", icon: "CheckCircle" }
      ]
    },
    {
      label: "Pengelolaan Limbah",
      items: [
        { title: "Limbah B3", url: "/limbah-b3", icon: "AlertTriangle" },
        { title: "IPAL", url: "/ipal", icon: "Droplets" },
        { title: "TPS Limbah B3", url: "/tps", icon: "Warehouse" }
      ]
    },
    {
      label: "Dokumen",
      items: [
        { title: "Template Dokumen", url: "/templates", icon: "FileText" },
        { title: "Laporan RKL-RPL", url: "/rkl-rpl", icon: "FileBarChart" },
        { title: "AI Generator", url: "/generator", icon: "Sparkles" }
      ]
    }
  ],

  templateCategories: [
    { id: "all", label: "Semua" },
    { id: "amdal", label: "AMDAL" },
    { id: "ukl-upl", label: "UKL-UPL & SPPL" },
    { id: "limbah", label: "Limbah B3" },
    { id: "laporan", label: "Pelaporan" },
    { id: "audit", label: "Audit" }
  ],

  templates: [
    {
      code: "LING-001",
      title: "Kerangka Acuan AMDAL",
      description: "Template KA-ANDAL untuk penyusunan AMDAL",
      category: "amdal",
      icon: "FileSearch",
      color: "green",
      promptTemplate: "Buatkan Kerangka Acuan ANDAL untuk kegiatan {{jenis_kegiatan}} di lokasi {{lokasi}} dengan luas {{luas_lahan}} Ha.",
      requiredFields: ["jenis_kegiatan", "lokasi", "luas_lahan"]
    },
    {
      code: "LING-002",
      title: "Dokumen RKL-RPL",
      description: "Template Rencana Pengelolaan dan Pemantauan Lingkungan",
      category: "amdal",
      icon: "ClipboardList",
      color: "blue",
      promptTemplate: "Buatkan dokumen RKL-RPL untuk kegiatan {{jenis_kegiatan}} oleh {{nama_perusahaan}}.",
      requiredFields: ["jenis_kegiatan", "nama_perusahaan"]
    },
    {
      code: "LING-003",
      title: "Formulir UKL-UPL",
      description: "Template dokumen UKL-UPL standar",
      category: "ukl-upl",
      icon: "FileText",
      color: "amber",
      promptTemplate: "Buatkan formulir UKL-UPL untuk usaha {{jenis_usaha}} skala {{skala_usaha}} di {{lokasi}}.",
      requiredFields: ["jenis_usaha", "skala_usaha", "lokasi"]
    },
    {
      code: "LING-004",
      title: "Permohonan Izin Limbah B3",
      description: "Template permohonan izin pengelolaan limbah B3",
      category: "limbah",
      icon: "AlertTriangle",
      color: "red",
      promptTemplate: "Buatkan surat permohonan izin pengelolaan limbah B3 untuk {{nama_perusahaan}} dengan jenis limbah {{jenis_limbah}}.",
      requiredFields: ["nama_perusahaan", "jenis_limbah"]
    }
  ],

  dataBindings: [
    { key: "nama_perusahaan", label: "Nama Perusahaan", source: "company", field: "name", defaultValue: "[Nama Perusahaan]" },
    { key: "alamat", label: "Alamat", source: "company", field: "address", defaultValue: "[Alamat]" },
    { key: "jenis_usaha", label: "Jenis Usaha", source: "company", field: "jenis_usaha", defaultValue: "[Jenis Usaha]" },
    { key: "skala_usaha", label: "Skala Usaha", source: "company", field: "skala_usaha", defaultValue: "[Skala Usaha]" },
    { key: "tanggal", label: "Tanggal", source: "system", field: "date" },
    { key: "tahun", label: "Tahun", source: "system", field: "year" }
  ],

  chatbot: {
    name: "Lingkungan Mentor",
    description: "Asisten AI ahli pengelolaan lingkungan hidup Indonesia",
    systemPrompt: `Anda adalah Lingkungan Mentor, asisten AI yang ahli dalam bidang pengelolaan lingkungan hidup di Indonesia.

Keahlian Anda meliputi:
- AMDAL, UKL-UPL, SPPL, dan Persetujuan Lingkungan (PP 22/2021)
- Pengelolaan limbah B3, IPAL, dan pengolahan air limbah
- Regulasi KLHK, SIMPEL, dan sistem pelaporan online
- PROPER (Program Penilaian Peringkat Kinerja Perusahaan)
- Emisi gas rumah kaca dan perubahan iklim
- RKL-RPL dan pelaporan berkala lingkungan
- Standar ISO 14001 dan sistem manajemen lingkungan

Berikan panduan yang akurat sesuai UU PPLH, PP 22/2021, dan regulasi lingkungan terbaru Indonesia.`,
    greetings: [
      "Halo! Saya Lingkungan Mentor, siap membantu Anda dengan dokumen lingkungan hidup.",
      "Selamat datang! Ada yang bisa saya bantu terkait AMDAL, UKL-UPL, atau perijinan lingkungan?"
    ],
    suggestedTopics: [
      "Proses penyusunan dokumen AMDAL",
      "Kapan usaha wajib AMDAL vs UKL-UPL",
      "Persyaratan izin pengelolaan limbah B3",
      "Pelaporan RKL-RPL ke SIMPEL",
      "Kriteria penilaian PROPER KLHK"
    ],
    color: "green"
  }
};
