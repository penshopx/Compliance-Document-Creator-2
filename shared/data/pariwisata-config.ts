import type { IndustryConfig } from "@shared/config/industry-types";

export const pariwisataConfig: IndustryConfig = {
  id: "pariwisata",
  name: "Pariwisata & Hospitality",
  shortName: "Pariwisata",
  tagline: "TDUP, Sertifikasi Hotel, SOP",
  description: "Platform lengkap untuk manajemen perijinan, sertifikasi, dan dokumen industri pariwisata",
  icon: "Palmtree",
  color: "emerald",
  isActive: true,
  sortOrder: 19,

  landingContent: {
    badge: "Untuk Pelaku Pariwisata Indonesia",
    headline: "Perijinan &",
    headlineHighlight: "Standar Pariwisata",
    subheadline: "Platform terintegrasi untuk TDUP, sertifikasi hotel, standar CHSE, dan dokumen hospitality dengan AI-powered document generation.",
    ctaPrimary: "Mulai Sekarang",
    ctaSecondary: "Pelajari Lebih Lanjut",
    features: [
      { icon: "FileCheck", title: "TDUP & Perijinan", description: "Kelola Tanda Daftar Usaha Pariwisata dan izin operasional" },
      { icon: "Star", title: "Sertifikasi Bintang", description: "Persiapan dan dokumentasi sertifikasi hotel berbintang" },
      { icon: "Shield", title: "CHSE Certified", description: "Dokumentasi standar Cleanliness, Health, Safety, Environment" },
      { icon: "FileText", title: "60+ Template Dokumen", description: "Template SOP hospitality dan dokumen pariwisata" },
      { icon: "Sparkles", title: "AI Document Generator", description: "Generate SOP dan dokumen layanan dengan AI" },
      { icon: "Bell", title: "Tracking Sertifikasi", description: "Monitor masa berlaku sertifikasi dengan notifikasi" }
    ],
    stats: [
      { value: "60+", label: "Template Dokumen" },
      { value: "CHSE", label: "Certified" },
      { value: "24/7", label: "AI Assistant" },
      { value: "Kemenparekraf", label: "Compliant" }
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
      label: "Perijinan",
      items: [
        { title: "TDUP", url: "/tdup", icon: "FileCheck" },
        { title: "Sertifikasi Bintang", url: "/bintang", icon: "Star" },
        { title: "CHSE", url: "/chse", icon: "Shield" },
        { title: "Sertifikasi Kompetensi", url: "/kompetensi", icon: "Award" }
      ]
    },
    {
      label: "Operasional",
      items: [
        { title: "SOP Front Office", url: "/sop-fo", icon: "Users" },
        { title: "SOP Housekeeping", url: "/sop-hk", icon: "Home" },
        { title: "SOP F&B", url: "/sop-fb", icon: "ShoppingCart" },
        { title: "Guest Experience", url: "/guest", icon: "MessageSquare" }
      ]
    },
    {
      label: "Dokumen",
      items: [
        { title: "Template Dokumen", url: "/templates", icon: "FileText" },
        { title: "Kontrak Vendor", url: "/kontrak", icon: "Handshake" },
        { title: "Laporan Operasional", url: "/laporan", icon: "FileBarChart" },
        { title: "AI Generator", url: "/generator", icon: "Sparkles" }
      ]
    }
  ],

  templateCategories: [
    { id: "all", label: "Semua" },
    { id: "perijinan", label: "Perijinan" },
    { id: "sop", label: "SOP" },
    { id: "chse", label: "CHSE" },
    { id: "operasional", label: "Operasional" },
    { id: "guest", label: "Guest Service" }
  ],

  templates: [
    {
      code: "TOUR-001",
      title: "Dokumen Permohonan TDUP",
      description: "Template permohonan Tanda Daftar Usaha Pariwisata",
      category: "perijinan",
      icon: "FileCheck",
      color: "blue",
      promptTemplate: "Buatkan dokumen permohonan TDUP untuk usaha {{jenis_usaha}} dengan nama {{nama_usaha}} di {{lokasi}}.",
      requiredFields: ["jenis_usaha", "nama_usaha", "lokasi"]
    },
    {
      code: "TOUR-002",
      title: "Checklist CHSE",
      description: "Template self-assessment CHSE certification",
      category: "chse",
      icon: "Shield",
      color: "green",
      promptTemplate: "Buatkan checklist self-assessment CHSE untuk {{jenis_usaha}} dengan cakupan 4 pilar CHSE lengkap.",
      requiredFields: ["jenis_usaha"]
    },
    {
      code: "TOUR-003",
      title: "SOP Check-in & Check-out",
      description: "Template SOP proses tamu hotel",
      category: "sop",
      icon: "Users",
      color: "purple",
      promptTemplate: "Buatkan SOP check-in dan check-out untuk hotel {{nama_hotel}} dengan standar layanan bintang {{bintang}}.",
      requiredFields: ["nama_hotel", "bintang"]
    },
    {
      code: "TOUR-004",
      title: "SOP Housekeeping",
      description: "Template SOP pembersihan kamar",
      category: "sop",
      icon: "Home",
      color: "amber",
      promptTemplate: "Buatkan SOP housekeeping untuk hotel dengan standar CHSE dan protokol kesehatan.",
      requiredFields: []
    },
    {
      code: "TOUR-005",
      title: "Guest Complaint Handling",
      description: "Template prosedur penanganan keluhan tamu",
      category: "guest",
      icon: "MessageSquare",
      color: "cyan",
      promptTemplate: "Buatkan SOP penanganan keluhan tamu dengan eskalasi dan recovery service.",
      requiredFields: []
    }
  ],

  dataBindings: [
    { key: "nama_usaha", label: "Nama Usaha", source: "company", field: "name", defaultValue: "[Nama Usaha]" },
    { key: "alamat", label: "Alamat", source: "company", field: "address", defaultValue: "[Alamat]" },
    { key: "tdup", label: "Nomor TDUP", source: "company", field: "tdup", defaultValue: "[Nomor TDUP]" },
    { key: "klasifikasi", label: "Klasifikasi/Bintang", source: "company", field: "classification", defaultValue: "[Klasifikasi]" },
    { key: "tanggal", label: "Tanggal", source: "system", field: "date" },
    { key: "tahun", label: "Tahun", source: "system", field: "year" }
  ],

  chatbot: {
    name: "Pariwisata Mentor",
    description: "Asisten AI ahli perijinan dan operasional pariwisata Indonesia",
    systemPrompt: `Anda adalah Pariwisata Mentor, asisten AI yang ahli dalam bidang perijinan dan operasional pariwisata di Indonesia.

Keahlian Anda meliputi:
- TDUP dan perijinan usaha pariwisata
- Sertifikasi hotel berbintang
- CHSE (Cleanliness, Health, Safety, Environment)
- SOP hospitality dan operasional hotel
- Sertifikasi kompetensi SDM pariwisata
- Regulasi Kemenparekraf
- Standar pelayanan pariwisata

Berikan panduan yang jelas, akurat, dan sesuai standar pariwisata Indonesia.`,
    greetings: [
      "Halo! Saya Pariwisata Mentor, siap membantu Anda dengan perijinan dan standar pariwisata.",
      "Selamat datang! Ada yang bisa saya bantu terkait TDUP, CHSE, atau SOP hospitality?"
    ],
    suggestedTopics: [
      "Cara mengurus TDUP",
      "Persyaratan sertifikasi CHSE",
      "SOP hotel berbintang",
      "Sertifikasi kompetensi SDM",
      "Standar pelayanan wisata"
    ],
    color: "emerald"
  }
};
