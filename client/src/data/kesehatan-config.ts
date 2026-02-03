import type { IndustryConfig } from "@shared/config/industry-types";

export const kesehatanConfig: IndustryConfig = {
  id: "kesehatan",
  name: "Fasilitas Kesehatan & Rumah Sakit",
  shortName: "Kesehatan",
  tagline: "Akreditasi RS, Klinik, Apotek",
  description: "Platform lengkap untuk manajemen dokumen akreditasi, perijinan, dan standar operasional fasilitas kesehatan",
  icon: "Heart",
  color: "red",
  isActive: true,
  sortOrder: 12,

  landingContent: {
    badge: "Untuk Fasilitas Kesehatan Indonesia",
    headline: "Akreditasi &",
    headlineHighlight: "Standar Fasilitas Kesehatan",
    subheadline: "Platform terintegrasi untuk akreditasi rumah sakit, klinik, apotek, dan dokumen kesehatan dengan AI-powered document generation.",
    ctaPrimary: "Mulai Sekarang",
    ctaSecondary: "Pelajari Lebih Lanjut",
    features: [
      { icon: "FileCheck", title: "Akreditasi KARS", description: "Persiapan dan dokumentasi lengkap akreditasi rumah sakit oleh KARS" },
      { icon: "Users", title: "Manajemen SDM Medis", description: "Kelola STR, SIP, dan kredensial tenaga kesehatan" },
      { icon: "Shield", title: "Standar Mutu", description: "Dokumentasi standar pelayanan minimal dan patient safety" },
      { icon: "FileText", title: "80+ Template Dokumen", description: "Template SOP, protokol, dan formulir standar fasilitas kesehatan" },
      { icon: "Sparkles", title: "AI Document Generator", description: "Generate dokumen akreditasi, SOP, dan laporan dengan bantuan AI" },
      { icon: "Bell", title: "Tracking Perijinan", description: "Monitor masa berlaku izin praktik dan sertifikasi dengan notifikasi otomatis" }
    ],
    stats: [
      { value: "80+", label: "Template Dokumen" },
      { value: "KARS 2022", label: "Standar Terbaru" },
      { value: "24/7", label: "AI Assistant" },
      { value: "JCI Ready", label: "Standar Internasional" }
    ]
  },

  menuGroups: [
    {
      label: "Menu Utama",
      items: [
        { title: "Beranda", url: "/", icon: "Home" },
        { title: "Dashboard", url: "/dashboard", icon: "LayoutDashboard" },
        { title: "Profil Fasilitas", url: "/company", icon: "Building2" }
      ]
    },
    {
      label: "Akreditasi",
      items: [
        { title: "Akreditasi KARS", url: "/kars", icon: "Award" },
        { title: "Standar Nasional (SNARS)", url: "/snars", icon: "FileCheck" },
        { title: "Akreditasi Klinik", url: "/akreditasi-klinik", icon: "Building" },
        { title: "Tracking Status", url: "/tracking", icon: "Search" }
      ]
    },
    {
      label: "SDM Kesehatan",
      items: [
        { title: "STR & SIP", url: "/str-sip", icon: "CreditCard" },
        { title: "Kredensial", url: "/kredensial", icon: "UserCheck" },
        { title: "Pelatihan & Kompetensi", url: "/pelatihan", icon: "BookOpen" }
      ]
    },
    {
      label: "Dokumen",
      items: [
        { title: "Template Dokumen", url: "/templates", icon: "FileText" },
        { title: "SOP Klinis", url: "/sop", icon: "ClipboardList" },
        { title: "Formulir Medis", url: "/formulir", icon: "FilePlus2" },
        { title: "AI Generator", url: "/generator", icon: "Sparkles" }
      ]
    }
  ],

  templateCategories: [
    { id: "all", label: "Semua" },
    { id: "akreditasi", label: "Akreditasi" },
    { id: "sop", label: "SOP" },
    { id: "formulir", label: "Formulir" },
    { id: "sdm", label: "SDM Kesehatan" },
    { id: "mutu", label: "Mutu & Safety" }
  ],

  templates: [
    {
      code: "KES-001",
      title: "Dokumen Self Assessment KARS",
      description: "Template self assessment untuk persiapan akreditasi KARS",
      category: "akreditasi",
      icon: "FileCheck",
      color: "blue",
      promptTemplate: "Buatkan dokumen self assessment KARS untuk {{nama_fasilitas}} dengan fokus pada standar {{standar}}.",
      requiredFields: ["nama_fasilitas", "standar"]
    },
    {
      code: "KES-002",
      title: "SOP Pelayanan Pasien",
      description: "Template SOP standar pelayanan pasien",
      category: "sop",
      icon: "ClipboardList",
      color: "green",
      promptTemplate: "Buatkan SOP pelayanan pasien untuk unit {{unit}} dengan tahapan lengkap sesuai standar akreditasi.",
      requiredFields: ["unit"]
    },
    {
      code: "KES-003",
      title: "Formulir Informed Consent",
      description: "Template formulir persetujuan tindakan medis",
      category: "formulir",
      icon: "FilePlus2",
      color: "purple",
      promptTemplate: "Buatkan formulir informed consent untuk tindakan {{tindakan}} yang sesuai standar legal.",
      requiredFields: ["tindakan"]
    },
    {
      code: "KES-004",
      title: "Program Mutu & Keselamatan Pasien",
      description: "Template program PMKP rumah sakit",
      category: "mutu",
      icon: "Shield",
      color: "red",
      promptTemplate: "Buatkan program mutu dan keselamatan pasien (PMKP) untuk tahun {{tahun}} dengan indikator mutu lengkap.",
      requiredFields: ["tahun"]
    },
    {
      code: "KES-005",
      title: "Laporan Insiden Keselamatan Pasien",
      description: "Template laporan IKP dan grading risiko",
      category: "mutu",
      icon: "AlertTriangle",
      color: "amber",
      promptTemplate: "Buatkan template laporan insiden keselamatan pasien dengan grading risiko dan analisis RCA.",
      requiredFields: []
    }
  ],

  dataBindings: [
    { key: "nama_fasilitas", label: "Nama Fasilitas", source: "company", field: "name", defaultValue: "[Nama Fasilitas Kesehatan]" },
    { key: "alamat", label: "Alamat", source: "company", field: "address", defaultValue: "[Alamat]" },
    { key: "direktur", label: "Direktur", source: "company", field: "director", defaultValue: "[Nama Direktur]" },
    { key: "no_izin", label: "Nomor Izin Operasional", source: "company", field: "license_number", defaultValue: "[Nomor Izin]" },
    { key: "tanggal", label: "Tanggal", source: "system", field: "date" },
    { key: "tahun", label: "Tahun", source: "system", field: "year" }
  ],

  chatbot: {
    name: "Kesehatan Mentor",
    description: "Asisten AI ahli akreditasi dan manajemen fasilitas kesehatan Indonesia",
    systemPrompt: `Anda adalah Kesehatan Mentor, asisten AI yang ahli dalam bidang akreditasi dan manajemen fasilitas kesehatan di Indonesia.

Keahlian Anda meliputi:
- Akreditasi KARS dan SNARS untuk rumah sakit
- Akreditasi klinik pratama dan utama
- Perijinan apotek dan laboratorium klinik
- STR, SIP, dan kredensial tenaga kesehatan
- Program Mutu dan Keselamatan Pasien (PMKP)
- Standar pelayanan minimal (SPM) kesehatan
- Regulasi Kemenkes dan peraturan kesehatan terbaru

Berikan panduan yang jelas, akurat, dan sesuai regulasi kesehatan Indonesia.`,
    greetings: [
      "Halo! Saya Kesehatan Mentor, siap membantu Anda dengan akreditasi dan manajemen fasilitas kesehatan.",
      "Selamat datang! Ada yang bisa saya bantu terkait akreditasi KARS, perijinan, atau dokumen kesehatan lainnya?"
    ],
    suggestedTopics: [
      "Persiapan akreditasi KARS",
      "Persyaratan STR dan SIP",
      "Program mutu rumah sakit",
      "SOP pelayanan klinis",
      "Pelaporan insiden keselamatan pasien"
    ],
    color: "red"
  }
};
