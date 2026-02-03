import type { IndustryConfig } from "@shared/config/industry-types";

export const telekomunikasiConfig: IndustryConfig = {
  id: "telekomunikasi",
  name: "Telekomunikasi & Infrastruktur",
  shortName: "Telekomunikasi",
  tagline: "ISR, Frekuensi, Menara",
  description: "Platform lengkap untuk manajemen perijinan, spektrum frekuensi, dan dokumen infrastruktur telekomunikasi",
  icon: "Radio",
  color: "indigo",
  isActive: true,
  sortOrder: 20,

  landingContent: {
    badge: "Untuk Industri Telekomunikasi Indonesia",
    headline: "Perijinan &",
    headlineHighlight: "Regulasi Telekomunikasi",
    subheadline: "Platform terintegrasi untuk ISR, spektrum frekuensi, perijinan menara, dan dokumen telekomunikasi dengan AI-powered document generation.",
    ctaPrimary: "Mulai Sekarang",
    ctaSecondary: "Pelajari Lebih Lanjut",
    features: [
      { icon: "FileCheck", title: "ISR & Perijinan", description: "Kelola Izin Stasiun Radio dan perijinan spektrum frekuensi" },
      { icon: "Radio", title: "Spektrum Frekuensi", description: "Dokumentasi alokasi dan penggunaan frekuensi radio" },
      { icon: "Building", title: "Perijinan Menara", description: "IMB menara, perjanjian sewa lahan, dan izin operasional" },
      { icon: "FileText", title: "70+ Template Dokumen", description: "Template dokumen regulasi dan teknis telekomunikasi" },
      { icon: "Sparkles", title: "AI Document Generator", description: "Generate dokumen teknis dan perijinan dengan AI" },
      { icon: "Bell", title: "Tracking Perijinan", description: "Monitor masa berlaku ISR dan perijinan dengan notifikasi" }
    ],
    stats: [
      { value: "70+", label: "Template Dokumen" },
      { value: "Kominfo", label: "Compliant" },
      { value: "24/7", label: "AI Assistant" },
      { value: "SDPPI", label: "Integrated" }
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
      label: "Perijinan",
      items: [
        { title: "ISR (Izin Stasiun Radio)", url: "/isr", icon: "Radio" },
        { title: "Spektrum Frekuensi", url: "/frekuensi", icon: "Zap" },
        { title: "Perijinan Menara", url: "/menara", icon: "Building" },
        { title: "Sertifikasi Alat", url: "/sertifikasi", icon: "Award" }
      ]
    },
    {
      label: "Infrastruktur",
      items: [
        { title: "BTS & Menara", url: "/bts", icon: "Building" },
        { title: "Fiber Optik", url: "/fiber", icon: "Globe" },
        { title: "Satelit", url: "/satelit", icon: "Globe" },
        { title: "Maintenance", url: "/maintenance", icon: "Wrench" }
      ]
    },
    {
      label: "Dokumen",
      items: [
        { title: "Template Dokumen", url: "/templates", icon: "FileText" },
        { title: "Kontrak & Perjanjian", url: "/kontrak", icon: "FileSignature" },
        { title: "Laporan Teknis", url: "/laporan", icon: "FileBarChart" },
        { title: "AI Generator", url: "/generator", icon: "Sparkles" }
      ]
    }
  ],

  templateCategories: [
    { id: "all", label: "Semua" },
    { id: "perijinan", label: "Perijinan" },
    { id: "frekuensi", label: "Frekuensi" },
    { id: "infrastruktur", label: "Infrastruktur" },
    { id: "teknis", label: "Teknis" },
    { id: "kontrak", label: "Kontrak" }
  ],

  templates: [
    {
      code: "TEL-001",
      title: "Permohonan ISR Baru",
      description: "Template permohonan Izin Stasiun Radio ke SDPPI",
      category: "perijinan",
      icon: "Radio",
      color: "blue",
      promptTemplate: "Buatkan surat permohonan ISR baru untuk stasiun radio {{jenis_stasiun}} dengan frekuensi {{frekuensi}} di lokasi {{lokasi}}.",
      requiredFields: ["jenis_stasiun", "frekuensi", "lokasi"]
    },
    {
      code: "TEL-002",
      title: "Perjanjian Sewa Lahan Menara",
      description: "Template kontrak sewa lahan untuk pembangunan menara",
      category: "kontrak",
      icon: "FileSignature",
      color: "green",
      promptTemplate: "Buatkan perjanjian sewa lahan untuk pembangunan menara telekomunikasi di {{lokasi}} dengan durasi {{durasi}} tahun.",
      requiredFields: ["lokasi", "durasi"]
    },
    {
      code: "TEL-003",
      title: "Laporan Penggunaan Frekuensi",
      description: "Template laporan tahunan penggunaan spektrum",
      category: "frekuensi",
      icon: "FileBarChart",
      color: "purple",
      promptTemplate: "Buatkan laporan penggunaan frekuensi untuk tahun {{tahun}} meliputi semua ISR yang dimiliki.",
      requiredFields: ["tahun"]
    },
    {
      code: "TEL-004",
      title: "SOP Maintenance BTS",
      description: "Template SOP pemeliharaan BTS",
      category: "teknis",
      icon: "Wrench",
      color: "amber",
      promptTemplate: "Buatkan SOP pemeliharaan preventif dan korektif untuk BTS {{tipe_bts}} dengan jadwal maintenance.",
      requiredFields: ["tipe_bts"]
    },
    {
      code: "TEL-005",
      title: "Dokumen Teknis Instalasi",
      description: "Template dokumentasi instalasi perangkat",
      category: "teknis",
      icon: "ClipboardList",
      color: "cyan",
      promptTemplate: "Buatkan dokumentasi teknis instalasi untuk perangkat {{nama_perangkat}} dengan spesifikasi lengkap.",
      requiredFields: ["nama_perangkat"]
    }
  ],

  dataBindings: [
    { key: "nama_perusahaan", label: "Nama Perusahaan", source: "company", field: "name", defaultValue: "[Nama Perusahaan]" },
    { key: "alamat", label: "Alamat", source: "company", field: "address", defaultValue: "[Alamat]" },
    { key: "npwp", label: "NPWP", source: "company", field: "npwp", defaultValue: "[NPWP]" },
    { key: "izin_penyelenggaraan", label: "Izin Penyelenggaraan", source: "company", field: "license", defaultValue: "[Nomor Izin]" },
    { key: "tanggal", label: "Tanggal", source: "system", field: "date" },
    { key: "tahun", label: "Tahun", source: "system", field: "year" }
  ],

  chatbot: {
    name: "Telekomunikasi Mentor",
    description: "Asisten AI ahli perijinan dan regulasi telekomunikasi Indonesia",
    systemPrompt: `Anda adalah Telekomunikasi Mentor, asisten AI yang ahli dalam bidang perijinan dan regulasi telekomunikasi di Indonesia.

Keahlian Anda meliputi:
- ISR (Izin Stasiun Radio) dan spektrum frekuensi
- Perijinan menara dan infrastruktur BTS
- Regulasi SDPPI dan Kominfo
- Sertifikasi perangkat telekomunikasi
- Izin penyelenggaraan jaringan dan jasa
- Fiber optik dan infrastruktur backbone
- Regulasi satelit dan VSAT

Berikan panduan yang jelas, akurat, dan sesuai regulasi telekomunikasi Indonesia.`,
    greetings: [
      "Halo! Saya Telekomunikasi Mentor, siap membantu Anda dengan perijinan dan regulasi telekomunikasi.",
      "Selamat datang! Ada yang bisa saya bantu terkait ISR, spektrum frekuensi, atau perijinan menara?"
    ],
    suggestedTopics: [
      "Cara mengurus ISR",
      "Prosedur alokasi frekuensi",
      "Perijinan pembangunan menara",
      "Sertifikasi perangkat Kominfo",
      "Izin penyelenggaraan jaringan"
    ],
    color: "indigo"
  }
};
