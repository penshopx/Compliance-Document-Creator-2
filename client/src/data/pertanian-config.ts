import type { IndustryConfig } from "@shared/config/industry-types";

export const pertanianConfig: IndustryConfig = {
  id: "pertanian",
  name: "Pertanian & Agribisnis",
  shortName: "Pertanian",
  tagline: "Sertifikasi Organik, GAP, SNI",
  description: "Platform lengkap untuk manajemen sertifikasi, dokumen usaha tani, dan standar pertanian Indonesia",
  icon: "Wheat",
  color: "green",
  isActive: true,
  sortOrder: 15,

  landingContent: {
    badge: "Untuk Pelaku Agribisnis Indonesia",
    headline: "Sertifikasi &",
    headlineHighlight: "Standar Pertanian",
    subheadline: "Platform terintegrasi untuk sertifikasi organik, GAP, SNI produk pertanian, dan dokumen agribisnis dengan AI-powered document generation.",
    ctaPrimary: "Mulai Sekarang",
    ctaSecondary: "Pelajari Lebih Lanjut",
    features: [
      { icon: "Award", title: "Sertifikasi Organik", description: "Dokumentasi lengkap sertifikasi organik LSPO dan internasional" },
      { icon: "FileCheck", title: "Good Agricultural Practices", description: "Panduan dan dokumentasi GAP sesuai standar Kementan" },
      { icon: "Shield", title: "SNI Produk Pertanian", description: "Persiapan sertifikasi SNI untuk produk pertanian" },
      { icon: "FileText", title: "60+ Template Dokumen", description: "Template dokumen pertanian, kontrak, dan laporan hasil panen" },
      { icon: "Sparkles", title: "AI Document Generator", description: "Generate dokumen sertifikasi dan laporan dengan AI" },
      { icon: "Bell", title: "Tracking Sertifikasi", description: "Monitor masa berlaku sertifikasi dengan notifikasi otomatis" }
    ],
    stats: [
      { value: "60+", label: "Template Dokumen" },
      { value: "Organik", label: "Certified" },
      { value: "24/7", label: "AI Assistant" },
      { value: "GAP", label: "Compliant" }
    ]
  },

  menuGroups: [
    {
      label: "Menu Utama",
      items: [
        { title: "Beranda", url: "/", icon: "Home" },
        { title: "Dashboard", url: "/dashboard", icon: "LayoutDashboard" },
        { title: "Profil Usaha", url: "/company", icon: "Building2" }
      ]
    },
    {
      label: "Sertifikasi",
      items: [
        { title: "Sertifikasi Organik", url: "/organik", icon: "Leaf" },
        { title: "GAP (Good Agricultural Practices)", url: "/gap", icon: "FileCheck" },
        { title: "SNI Produk Pertanian", url: "/sni", icon: "Award" },
        { title: "PSAT (Prima 3)", url: "/psat", icon: "Shield" }
      ]
    },
    {
      label: "Manajemen Usaha",
      items: [
        { title: "Data Lahan", url: "/lahan", icon: "Map" },
        { title: "Catatan Budidaya", url: "/budidaya", icon: "ClipboardList" },
        { title: "Hasil Panen", url: "/panen", icon: "Package" },
        { title: "Pemasaran", url: "/pemasaran", icon: "ShoppingCart" }
      ]
    },
    {
      label: "Dokumen",
      items: [
        { title: "Template Dokumen", url: "/templates", icon: "FileText" },
        { title: "Kontrak Kemitraan", url: "/kontrak", icon: "Handshake" },
        { title: "Laporan Produksi", url: "/laporan", icon: "FileBarChart" },
        { title: "AI Generator", url: "/generator", icon: "Sparkles" }
      ]
    }
  ],

  templateCategories: [
    { id: "all", label: "Semua" },
    { id: "sertifikasi", label: "Sertifikasi" },
    { id: "budidaya", label: "Budidaya" },
    { id: "pemasaran", label: "Pemasaran" },
    { id: "kontrak", label: "Kontrak" },
    { id: "laporan", label: "Laporan" }
  ],

  templates: [
    {
      code: "AGRI-001",
      title: "Dokumen Permohonan Sertifikasi Organik",
      description: "Template permohonan sertifikasi organik LSPO",
      category: "sertifikasi",
      icon: "Leaf",
      color: "green",
      promptTemplate: "Buatkan dokumen permohonan sertifikasi organik untuk produk {{produk}} dengan luas lahan {{luas_lahan}} hektar.",
      requiredFields: ["produk", "luas_lahan"]
    },
    {
      code: "AGRI-002",
      title: "Internal Control System (ICS)",
      description: "Template dokumen ICS untuk sertifikasi organik kelompok",
      category: "sertifikasi",
      icon: "ClipboardList",
      color: "blue",
      promptTemplate: "Buatkan dokumen Internal Control System untuk kelompok tani {{nama_kelompok}} dengan {{jumlah_anggota}} anggota.",
      requiredFields: ["nama_kelompok", "jumlah_anggota"]
    },
    {
      code: "AGRI-003",
      title: "Catatan Budidaya Harian",
      description: "Template logbook kegiatan budidaya",
      category: "budidaya",
      icon: "BookOpen",
      color: "amber",
      promptTemplate: "Buatkan template catatan budidaya harian untuk komoditas {{komoditas}} dengan periode {{periode}}.",
      requiredFields: ["komoditas", "periode"]
    },
    {
      code: "AGRI-004",
      title: "Kontrak Kemitraan Pertanian",
      description: "Template kontrak kemitraan dengan offtaker",
      category: "kontrak",
      icon: "Handshake",
      color: "purple",
      promptTemplate: "Buatkan kontrak kemitraan pertanian antara kelompok tani dan offtaker untuk komoditas {{komoditas}}.",
      requiredFields: ["komoditas"]
    },
    {
      code: "AGRI-005",
      title: "Laporan Hasil Panen",
      description: "Template laporan produksi dan hasil panen",
      category: "laporan",
      icon: "FileBarChart",
      color: "cyan",
      promptTemplate: "Buatkan laporan hasil panen untuk komoditas {{komoditas}} periode {{periode}} dengan total produksi {{produksi}}.",
      requiredFields: ["komoditas", "periode", "produksi"]
    }
  ],

  dataBindings: [
    { key: "nama_usaha", label: "Nama Usaha/Kelompok Tani", source: "company", field: "name", defaultValue: "[Nama Usaha]" },
    { key: "alamat", label: "Alamat", source: "company", field: "address", defaultValue: "[Alamat]" },
    { key: "luas_lahan", label: "Luas Lahan (Ha)", source: "company", field: "land_area", defaultValue: "[Luas Lahan]" },
    { key: "komoditas", label: "Komoditas Utama", source: "company", field: "commodity", defaultValue: "[Komoditas]" },
    { key: "tanggal", label: "Tanggal", source: "system", field: "date" },
    { key: "tahun", label: "Tahun", source: "system", field: "year" }
  ],

  chatbot: {
    name: "Agri Mentor",
    description: "Asisten AI ahli sertifikasi dan manajemen pertanian Indonesia",
    systemPrompt: `Anda adalah Agri Mentor, asisten AI yang ahli dalam bidang sertifikasi dan manajemen pertanian di Indonesia.

Keahlian Anda meliputi:
- Sertifikasi organik nasional dan internasional
- Good Agricultural Practices (GAP) Kementan
- SNI produk pertanian dan hortikultura
- Prima 3 (PSAT) untuk keamanan pangan
- Manajemen kelompok tani dan koperasi
- Dokumentasi budidaya dan catatan farm
- Regulasi Kementan dan kebijakan pertanian

Berikan panduan yang jelas, akurat, dan sesuai regulasi pertanian Indonesia.`,
    greetings: [
      "Halo! Saya Agri Mentor, siap membantu Anda dengan sertifikasi dan manajemen pertanian.",
      "Selamat datang! Ada yang bisa saya bantu terkait sertifikasi organik, GAP, atau dokumen pertanian?"
    ],
    suggestedTopics: [
      "Cara mendapat sertifikasi organik",
      "Persyaratan GAP Kementan",
      "Membuat ICS kelompok tani",
      "Catatan budidaya standar",
      "Kontrak kemitraan dengan offtaker"
    ],
    color: "green"
  }
};
