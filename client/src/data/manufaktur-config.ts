import type { IndustryConfig } from "@shared/config/industry-types";

export const manufakturConfig: IndustryConfig = {
  id: "manufaktur",
  name: "Manufaktur & Industri",
  shortName: "Manufaktur",
  tagline: "ISO 9001, GMP, HACCP",
  description: "Platform lengkap untuk manajemen sertifikasi, standar mutu, dan dokumen industri manufaktur",
  icon: "Factory",
  color: "orange",
  isActive: true,
  sortOrder: 16,

  landingContent: {
    badge: "Untuk Industri Manufaktur Indonesia",
    headline: "Sertifikasi &",
    headlineHighlight: "Standar Manufaktur",
    subheadline: "Platform terintegrasi untuk ISO 9001, GMP, HACCP, SNI, dan dokumen industri dengan AI-powered document generation.",
    ctaPrimary: "Mulai Sekarang",
    ctaSecondary: "Pelajari Lebih Lanjut",
    features: [
      { icon: "Award", title: "ISO 9001:2015", description: "Dokumentasi lengkap sistem manajemen mutu standar internasional" },
      { icon: "Shield", title: "GMP & HACCP", description: "Standar keamanan dan mutu untuk industri makanan dan farmasi" },
      { icon: "FileCheck", title: "SNI Produk", description: "Persiapan sertifikasi SNI wajib dan sukarela" },
      { icon: "FileText", title: "100+ Template Dokumen", description: "Template SOP, instruksi kerja, dan dokumen mutu" },
      { icon: "Sparkles", title: "AI Document Generator", description: "Generate dokumen mutu dan sertifikasi dengan AI" },
      { icon: "Bell", title: "Audit Tracking", description: "Monitor jadwal audit dan sertifikasi dengan notifikasi" }
    ],
    stats: [
      { value: "100+", label: "Template Dokumen" },
      { value: "ISO 9001", label: "Ready" },
      { value: "24/7", label: "AI Assistant" },
      { value: "GMP/HACCP", label: "Certified" }
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
      label: "Sertifikasi",
      items: [
        { title: "ISO 9001 (Mutu)", url: "/iso9001", icon: "Award" },
        { title: "ISO 14001 (Lingkungan)", url: "/iso14001", icon: "Leaf" },
        { title: "GMP & HACCP", url: "/gmp", icon: "Shield" },
        { title: "SNI Produk", url: "/sni", icon: "FileCheck" }
      ]
    },
    {
      label: "Produksi",
      items: [
        { title: "SOP Produksi", url: "/sop-produksi", icon: "ClipboardList" },
        { title: "Quality Control", url: "/qc", icon: "CheckCircle" },
        { title: "Instruksi Kerja", url: "/ik", icon: "FileText" },
        { title: "Maintenance", url: "/maintenance", icon: "Wrench" }
      ]
    },
    {
      label: "Dokumen",
      items: [
        { title: "Template Dokumen", url: "/templates", icon: "FileText" },
        { title: "Manual Mutu", url: "/manual", icon: "BookOpen" },
        { title: "Record & Log", url: "/records", icon: "Table" },
        { title: "AI Generator", url: "/generator", icon: "Sparkles" }
      ]
    }
  ],

  templateCategories: [
    { id: "all", label: "Semua" },
    { id: "iso", label: "ISO" },
    { id: "gmp", label: "GMP/HACCP" },
    { id: "sop", label: "SOP" },
    { id: "qc", label: "Quality Control" },
    { id: "record", label: "Record" }
  ],

  templates: [
    {
      code: "MFG-001",
      title: "Manual Mutu ISO 9001",
      description: "Template quality manual sesuai ISO 9001:2015",
      category: "iso",
      icon: "BookOpen",
      color: "blue",
      promptTemplate: "Buatkan manual mutu ISO 9001:2015 untuk perusahaan manufaktur {{nama_perusahaan}} dengan scope {{scope_produk}}.",
      requiredFields: ["nama_perusahaan", "scope_produk"]
    },
    {
      code: "MFG-002",
      title: "SOP Proses Produksi",
      description: "Template SOP standar proses produksi",
      category: "sop",
      icon: "ClipboardList",
      color: "green",
      promptTemplate: "Buatkan SOP proses produksi untuk produk {{nama_produk}} dengan tahapan detail dan kontrol mutu.",
      requiredFields: ["nama_produk"]
    },
    {
      code: "MFG-003",
      title: "HACCP Plan",
      description: "Template analisis bahaya dan titik kendali kritis",
      category: "gmp",
      icon: "Shield",
      color: "red",
      promptTemplate: "Buatkan HACCP Plan untuk produk {{nama_produk}} dengan identifikasi CCP dan batas kritis.",
      requiredFields: ["nama_produk"]
    },
    {
      code: "MFG-004",
      title: "Instruksi Kerja (Work Instruction)",
      description: "Template instruksi kerja detail",
      category: "sop",
      icon: "FileText",
      color: "purple",
      promptTemplate: "Buatkan instruksi kerja untuk proses {{nama_proses}} dengan langkah detail dan parameter kerja.",
      requiredFields: ["nama_proses"]
    },
    {
      code: "MFG-005",
      title: "Laporan Audit Internal",
      description: "Template laporan audit internal ISO",
      category: "iso",
      icon: "FileSearch",
      color: "amber",
      promptTemplate: "Buatkan template laporan audit internal untuk klausul {{klausul}} ISO 9001:2015 dengan checklist dan temuan.",
      requiredFields: ["klausul"]
    }
  ],

  dataBindings: [
    { key: "nama_perusahaan", label: "Nama Perusahaan", source: "company", field: "name", defaultValue: "[Nama Perusahaan]" },
    { key: "alamat", label: "Alamat Pabrik", source: "company", field: "address", defaultValue: "[Alamat]" },
    { key: "direktur", label: "Direktur", source: "company", field: "director", defaultValue: "[Nama Direktur]" },
    { key: "mr", label: "Management Representative", source: "company", field: "mr", defaultValue: "[Nama MR]" },
    { key: "tanggal", label: "Tanggal", source: "system", field: "date" },
    { key: "tahun", label: "Tahun", source: "system", field: "year" }
  ],

  chatbot: {
    name: "Manufaktur Mentor",
    description: "Asisten AI ahli sertifikasi dan standar mutu industri manufaktur",
    systemPrompt: `Anda adalah Manufaktur Mentor, asisten AI yang ahli dalam bidang sertifikasi dan standar mutu industri manufaktur di Indonesia.

Keahlian Anda meliputi:
- ISO 9001:2015 Sistem Manajemen Mutu
- ISO 14001:2015 Sistem Manajemen Lingkungan
- GMP (Good Manufacturing Practices)
- HACCP dan keamanan pangan
- SNI wajib dan sukarela untuk produk industri
- SOP dan instruksi kerja produksi
- Audit internal dan eksternal

Berikan panduan yang jelas, akurat, dan sesuai standar industri.`,
    greetings: [
      "Halo! Saya Manufaktur Mentor, siap membantu Anda dengan sertifikasi dan standar mutu industri.",
      "Selamat datang! Ada yang bisa saya bantu terkait ISO 9001, GMP, HACCP, atau dokumen produksi?"
    ],
    suggestedTopics: [
      "Persiapan sertifikasi ISO 9001",
      "Membuat manual mutu",
      "HACCP Plan untuk makanan",
      "SOP proses produksi",
      "Audit internal ISO"
    ],
    color: "orange"
  }
};
