import type { IndustryConfig } from "@shared/config/industry-types";

export const migasConfig: IndustryConfig = {
  id: "migas",
  name: "Migas & Pertambangan",
  shortName: "Migas",
  tagline: "IUP, WIUP, SKUP, K3 Migas",
  description: "Platform lengkap untuk perijinan, sertifikasi, dan dokumen sektor minyak, gas, dan pertambangan mineral",
  icon: "Fuel",
  color: "orange",
  isActive: true,
  sortOrder: 5,

  landingContent: {
    badge: "Untuk Industri Migas & Pertambangan Indonesia",
    headline: "Migas &",
    headlineHighlight: "Pertambangan",
    subheadline: "Solusi terintegrasi untuk IUP, WIUP, sertifikasi kompetensi, dan dokumen operasional sektor minerba dan migas.",
    ctaPrimary: "Mulai Sekarang",
    ctaSecondary: "Pelajari Lebih Lanjut",
    features: [
      { icon: "Mountain", title: "IUP & WIUP", description: "Kelola Izin Usaha Pertambangan dan Wilayah Izin Usaha Pertambangan mineral dan batubara" },
      { icon: "Fuel", title: "Perijinan Migas", description: "SKUP Migas, Izin Pengangkutan, dan perijinan usaha hilir minyak dan gas" },
      { icon: "HardHat", title: "Sertifikasi K3 Migas", description: "SKT Migas, Sertifikasi Welder, dan kompetensi tenaga kerja sektor migas" },
      { icon: "FileText", title: "90+ Template Dokumen", description: "Template dokumen sesuai standar SKK Migas dan Kementerian ESDM" },
      { icon: "Sparkles", title: "AI Generator", description: "Generate laporan produksi, studi AMDAL, dan dokumen perijinan dengan AI" },
      { icon: "Shield", title: "Compliance Monitoring", description: "Pantau kepatuhan regulasi, RKAB, dan kewajiban lingkungan secara real-time" }
    ],
    stats: [
      { value: "90+", label: "Template Dokumen" },
      { value: "60+", label: "Jenis Perijinan" },
      { value: "24/7", label: "AI Assistant" },
      { value: "UU Minerba", label: "Regulasi Terbaru" }
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
      label: "Pertambangan",
      items: [
        { title: "IUP (Izin Usaha)", url: "/iup", icon: "FileCheck" },
        { title: "WIUP", url: "/wiup", icon: "Map" },
        { title: "IUJP (Jasa Pertambangan)", url: "/iujp", icon: "Truck" },
        { title: "RKAB", url: "/rkab", icon: "ClipboardList" }
      ]
    },
    {
      label: "Migas",
      items: [
        { title: "SKUP Migas", url: "/skup", icon: "CreditCard" },
        { title: "Izin Pengangkutan", url: "/pengangkutan", icon: "Truck" },
        { title: "Izin Penyimpanan", url: "/penyimpanan", icon: "Warehouse" }
      ]
    },
    {
      label: "Dokumen",
      items: [
        { title: "Template Dokumen", url: "/templates", icon: "FileText" },
        { title: "Dokumen AMDAL", url: "/amdal", icon: "Leaf" },
        { title: "AI Generator", url: "/generator", icon: "Sparkles" }
      ]
    }
  ],

  templateCategories: [
    { id: "all", label: "Semua" },
    { id: "perijinan", label: "Perijinan" },
    { id: "sertifikasi", label: "Sertifikasi" },
    { id: "operasional", label: "Operasional" },
    { id: "lingkungan", label: "Lingkungan" },
    { id: "laporan", label: "Laporan" }
  ],

  templates: [
    {
      code: "MIGS-001",
      title: "Permohonan IUP",
      description: "Template permohonan Izin Usaha Pertambangan",
      category: "perijinan",
      icon: "FileCheck",
      color: "orange",
      promptTemplate: "Buatkan surat permohonan IUP untuk {{nama_perusahaan}} komoditas {{komoditas}} di wilayah {{wilayah_iup}}.",
      requiredFields: ["nama_perusahaan", "komoditas", "wilayah_iup"]
    },
    {
      code: "MIGS-002",
      title: "RKAB Tahunan",
      description: "Template Rencana Kerja dan Anggaran Biaya pertambangan",
      category: "operasional",
      icon: "ClipboardList",
      color: "blue",
      promptTemplate: "Buatkan RKAB tahunan untuk tambang {{nama_tambang}} dengan target produksi {{produksi_target}} ton.",
      requiredFields: ["nama_tambang", "produksi_target"]
    },
    {
      code: "MIGS-003",
      title: "Dokumen AMDAL Tambang",
      description: "Template AMDAL untuk kegiatan pertambangan",
      category: "lingkungan",
      icon: "Leaf",
      color: "green",
      promptTemplate: "Buatkan kerangka dokumen AMDAL untuk kegiatan pertambangan {{komoditas}} di {{lokasi}} dengan luas {{luas_wilayah}} Ha.",
      requiredFields: ["komoditas", "lokasi", "luas_wilayah"]
    },
    {
      code: "MIGS-004",
      title: "Rencana Reklamasi",
      description: "Template rencana reklamasi pasca tambang",
      category: "lingkungan",
      icon: "Trees",
      color: "emerald",
      promptTemplate: "Buatkan rencana reklamasi untuk lahan pasca tambang {{nama_tambang}} seluas {{luas_reklamasi}} Ha.",
      requiredFields: ["nama_tambang", "luas_reklamasi"]
    }
  ],

  dataBindings: [
    { key: "nama_perusahaan", label: "Nama Perusahaan", source: "company", field: "name", defaultValue: "[Nama Perusahaan]" },
    { key: "alamat", label: "Alamat", source: "company", field: "address", defaultValue: "[Alamat]" },
    { key: "iup_number", label: "Nomor IUP", source: "company", field: "iup_number", defaultValue: "[Nomor IUP]" },
    { key: "komoditas", label: "Komoditas", source: "company", field: "komoditas", defaultValue: "[Komoditas]" },
    { key: "wilayah_iup", label: "Wilayah IUP", source: "company", field: "wilayah_iup", defaultValue: "[Wilayah IUP]" },
    { key: "tanggal", label: "Tanggal", source: "system", field: "date" },
    { key: "tahun", label: "Tahun", source: "system", field: "year" }
  ],

  chatbot: {
    name: "Migas Mentor",
    description: "Asisten AI ahli migas dan pertambangan Indonesia",
    systemPrompt: `Anda adalah Migas Mentor, asisten AI yang ahli dalam bidang minyak, gas, dan pertambangan mineral di Indonesia.

Keahlian Anda meliputi:
- IUP, WIUP, dan perijinan pertambangan mineral dan batubara (UU Minerba)
- SKUP Migas dan perijinan usaha hilir minyak dan gas bumi
- SKT Migas, sertifikasi welder, dan kompetensi K3 migas
- RKAB (Rencana Kerja dan Anggaran Biaya) pertambangan
- Regulasi SKK Migas, BPH Migas, dan Kementerian ESDM
- AMDAL, reklamasi, dan pengelolaan lingkungan pertambangan
- Good Mining Practice dan standar internasional industri

Berikan panduan yang akurat sesuai UU Minerba, UU Migas, dan regulasi terbaru Indonesia.`,
    greetings: [
      "Halo! Saya Migas Mentor, siap membantu Anda dengan perijinan migas dan pertambangan.",
      "Selamat datang! Ada yang bisa saya bantu terkait IUP, SKUP, atau dokumen operasional?"
    ],
    suggestedTopics: [
      "Proses mendapatkan IUP Operasi Produksi",
      "Persyaratan SKUP Migas untuk distributor BBM",
      "Mengurus SKT Migas untuk tenaga kerja",
      "Isi RKAB tahunan",
      "Prosedur AMDAL untuk pertambangan"
    ],
    color: "orange"
  }
};
