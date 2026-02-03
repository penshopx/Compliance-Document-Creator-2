import type { IndustryConfig } from "@shared/config/industry-types";

export const energiConfig: IndustryConfig = {
  id: "energi",
  name: "Ketenagalistrikan & Energi",
  shortName: "Energi",
  tagline: "IUPTL, SLO, SKTTK, Energi Terbarukan",
  description: "Platform pengelolaan perijinan, sertifikasi, dan dokumen sektor ketenagalistrikan dan energi terbarukan",
  icon: "Zap",
  color: "yellow",
  isActive: true,
  sortOrder: 4,

  landingContent: {
    badge: "Untuk Industri Ketenagalistrikan Indonesia",
    headline: "Ketenagalistrikan &",
    headlineHighlight: "Energi Terbarukan",
    subheadline: "Solusi lengkap untuk IUPTL, SLO, sertifikasi teknisi, dan dokumen energi terbarukan dengan AI-powered document generation.",
    ctaPrimary: "Mulai Sekarang",
    ctaSecondary: "Pelajari Lebih Lanjut",
    features: [
      { icon: "Zap", title: "IUPTL & IUPTLS", description: "Kelola Izin Usaha Penyediaan Tenaga Listrik untuk kepentingan umum dan sendiri" },
      { icon: "Award", title: "SLO & SKTTK", description: "Sertifikat Laik Operasi dan Sertifikat Kompetensi Tenaga Teknik Ketenagalistrikan" },
      { icon: "Sun", title: "Energi Terbarukan", description: "Dokumen perijinan PLTS, PLTB, PLTMH, dan pembangkit energi terbarukan lainnya" },
      { icon: "FileText", title: "80+ Template Dokumen", description: "Template dokumen ketenagalistrikan sesuai standar PLN dan Kementerian ESDM" },
      { icon: "Sparkles", title: "AI Generator", description: "Generate laporan teknis, studi kelayakan, dan dokumen perijinan dengan AI" },
      { icon: "CheckCircle", title: "Compliance Tracking", description: "Monitor kepatuhan regulasi dan sertifikasi dengan notifikasi otomatis" }
    ],
    stats: [
      { value: "80+", label: "Template Dokumen" },
      { value: "40+", label: "Jenis Perijinan" },
      { value: "24/7", label: "AI Assistant" },
      { value: "SNI IEC", label: "Standar Kelistrikan" }
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
        { title: "Klasifikasi Usaha", url: "/qualifications", icon: "Award" },
        { title: "Peralatan", url: "/equipment", icon: "Wrench" },
        { title: "Proyek", url: "/projects", icon: "FolderKanban" },
        { title: "Vendor & Mitra", url: "/vendors", icon: "Handshake" }
      ]
    },
    {
      label: "Dokumen Kepatuhan",
      items: [
        { title: "Template Repository", url: "/template-repository", icon: "Library" },
        { title: "Generator Dokumen", url: "/documents", icon: "FileText" },
        { title: "Document Builder", url: "/document-builder", icon: "FilePlus2" },
        { title: "PDCA Generator", url: "/pdca", icon: "Zap" }
      ]
    }
  ],

  templateCategories: [
    { id: "all", label: "Semua" },
    { id: "perijinan", label: "Perijinan" },
    { id: "sertifikasi", label: "Sertifikasi" },
    { id: "teknis", label: "Teknis" },
    { id: "kontrak", label: "Kontrak" },
    { id: "laporan", label: "Laporan" }
  ],

  templates: [
    {
      code: "ENRG-001",
      title: "Permohonan IUPTL",
      description: "Template permohonan Izin Usaha Penyediaan Tenaga Listrik",
      category: "perijinan",
      icon: "Zap",
      color: "yellow",
      promptTemplate: "Buatkan surat permohonan IUPTL untuk {{nama_perusahaan}} dengan kapasitas {{kapasitas_mw}} MW di wilayah {{wilayah_usaha}}.",
      requiredFields: ["nama_perusahaan", "kapasitas_mw", "wilayah_usaha"]
    },
    {
      code: "ENRG-002",
      title: "Permohonan SLO",
      description: "Template permohonan Sertifikat Laik Operasi instalasi listrik",
      category: "sertifikasi",
      icon: "CheckCircle",
      color: "green",
      promptTemplate: "Buatkan permohonan SLO untuk instalasi listrik {{jenis_instalasi}} dengan kapasitas {{kapasitas}} kVA.",
      requiredFields: ["jenis_instalasi", "kapasitas"]
    },
    {
      code: "ENRG-003",
      title: "Studi Kelayakan Pembangkit",
      description: "Template feasibility study pembangkit listrik",
      category: "teknis",
      icon: "FileSearch",
      color: "blue",
      promptTemplate: "Buatkan studi kelayakan untuk {{jenis_pembangkit}} dengan kapasitas {{kapasitas_mw}} MW di lokasi {{lokasi}}.",
      requiredFields: ["jenis_pembangkit", "kapasitas_mw", "lokasi"]
    },
    {
      code: "ENRG-004",
      title: "Draft PPA",
      description: "Template Power Purchase Agreement",
      category: "kontrak",
      icon: "FileSignature",
      color: "purple",
      promptTemplate: "Buatkan draft Power Purchase Agreement antara {{nama_perusahaan}} dengan PLN untuk kapasitas {{kapasitas_mw}} MW.",
      requiredFields: ["nama_perusahaan", "kapasitas_mw"]
    }
  ],

  dataBindings: [
    { key: "nama_perusahaan", label: "Nama Perusahaan", source: "company", field: "name", defaultValue: "[Nama Perusahaan]" },
    { key: "alamat", label: "Alamat", source: "company", field: "address", defaultValue: "[Alamat]" },
    { key: "iuptl_number", label: "Nomor IUPTL", source: "company", field: "iuptl_number", defaultValue: "[Nomor IUPTL]" },
    { key: "wilayah_usaha", label: "Wilayah Usaha", source: "company", field: "wilayah_usaha", defaultValue: "[Wilayah Usaha]" },
    { key: "kapasitas_mw", label: "Kapasitas (MW)", source: "project", field: "kapasitas_mw", defaultValue: "[Kapasitas]" },
    { key: "tanggal", label: "Tanggal", source: "system", field: "date" },
    { key: "tahun", label: "Tahun", source: "system", field: "year" }
  ],

  chatbot: {
    name: "Energi Mentor",
    description: "Asisten AI ahli ketenagalistrikan dan energi Indonesia",
    systemPrompt: `Anda adalah Energi Mentor, asisten AI yang ahli dalam bidang ketenagalistrikan dan energi di Indonesia.

Keahlian Anda meliputi:
- IUPTL, IUPTLS, IUJPTL dan perijinan usaha ketenagalistrikan
- SLO (Sertifikat Laik Operasi) dan sertifikasi instalasi
- SKTTK dan sertifikasi tenaga teknik ketenagalistrikan
- Regulasi Kementerian ESDM, PLN, dan lembaga sertifikasi
- Energi terbarukan: PLTS, PLTB, PLTMH, bioenergi
- Standar PUIL, SNI kelistrikan, dan standar internasional IEC
- Power Purchase Agreement dan skema bisnis ketenagalistrikan

Berikan panduan yang akurat sesuai UU Ketenagalistrikan dan regulasi terbaru Indonesia.`,
    greetings: [
      "Halo! Saya Energi Mentor, siap membantu Anda dengan perijinan ketenagalistrikan dan energi.",
      "Selamat datang! Ada yang bisa saya bantu terkait IUPTL, SLO, atau energi terbarukan?"
    ],
    suggestedTopics: [
      "Proses mendapatkan IUPTL",
      "Persyaratan SLO instalasi listrik",
      "Mengurus SKTTK untuk teknisi",
      "Perijinan PLTS rooftop",
      "Skema jual beli listrik dengan PLN"
    ],
    color: "yellow"
  }
};
