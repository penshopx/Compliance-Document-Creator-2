import type { IndustryConfig } from "@shared/config/industry-types";

export const keuanganConfig: IndustryConfig = {
  id: "keuangan",
  name: "Keuangan & Perpajakan",
  shortName: "Keuangan",
  tagline: "Laporan Keuangan, PPh, PPN",
  description: "Platform lengkap untuk pengelolaan keuangan perusahaan, perpajakan, dan pelaporan keuangan",
  icon: "Banknote",
  color: "emerald",
  isActive: true,
  sortOrder: 11,

  landingContent: {
    badge: "Untuk Pengelolaan Keuangan Indonesia",
    headline: "Keuangan &",
    headlineHighlight: "Perpajakan",
    subheadline: "Solusi terintegrasi untuk laporan keuangan, perpajakan, dan kepatuhan regulasi keuangan dengan AI-powered document generation.",
    ctaPrimary: "Mulai Sekarang",
    ctaSecondary: "Pelajari Lebih Lanjut",
    features: [
      { icon: "FileSpreadsheet", title: "Laporan Keuangan", description: "Template laporan keuangan sesuai SAK ETAP dan PSAK untuk berbagai jenis usaha" },
      { icon: "Receipt", title: "Perpajakan", description: "Panduan dan template SPT, faktur pajak, dan pelaporan pajak lengkap" },
      { icon: "Search", title: "Audit Keuangan", description: "Template kertas kerja audit dan dokumen pendukung audit eksternal" },
      { icon: "FileText", title: "70+ Template Dokumen", description: "Template dokumen keuangan dan perpajakan siap pakai" },
      { icon: "Sparkles", title: "AI Generator", description: "Generate laporan keuangan, analisis rasio, dan proyeksi dengan AI" },
      { icon: "Shield", title: "Compliance", description: "Monitor kepatuhan pelaporan OJK, pajak, dan regulasi keuangan" }
    ],
    stats: [
      { value: "70+", label: "Template Dokumen" },
      { value: "50+", label: "Jenis Laporan" },
      { value: "24/7", label: "AI Assistant" },
      { value: "SAK ETAP", label: "Standar Akuntansi" }
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
      label: "Laporan Keuangan",
      items: [
        { title: "Neraca", url: "/neraca", icon: "Scale" },
        { title: "Laba Rugi", url: "/laba-rugi", icon: "TrendingUp" },
        { title: "Arus Kas", url: "/arus-kas", icon: "ArrowRightLeft" },
        { title: "Catatan Laporan", url: "/catatan", icon: "StickyNote" }
      ]
    },
    {
      label: "Perpajakan",
      items: [
        { title: "PPh 21", url: "/pph21", icon: "Users" },
        { title: "PPh 23", url: "/pph23", icon: "Briefcase" },
        { title: "PPh Badan", url: "/pph-badan", icon: "Building2" },
        { title: "PPN", url: "/ppn", icon: "Percent" }
      ]
    },
    {
      label: "Dokumen",
      items: [
        { title: "Template Dokumen", url: "/templates", icon: "FileText" },
        { title: "Kertas Kerja Audit", url: "/kertas-kerja", icon: "FileText" },
        { title: "AI Generator", url: "/generator", icon: "Sparkles" }
      ]
    }
  ],

  templateCategories: [
    { id: "all", label: "Semua" },
    { id: "laporan", label: "Laporan Keuangan" },
    { id: "pajak", label: "Perpajakan" },
    { id: "audit", label: "Audit" },
    { id: "analisis", label: "Analisis" }
  ],

  templates: [
    {
      code: "KEU-001",
      title: "Template Neraca",
      description: "Template laporan posisi keuangan",
      category: "laporan",
      icon: "Scale",
      color: "emerald",
      promptTemplate: "Buatkan template neraca untuk {{nama_perusahaan}} periode {{periode}} sesuai SAK ETAP.",
      requiredFields: ["nama_perusahaan", "periode"]
    },
    {
      code: "KEU-002",
      title: "Laporan Laba Rugi",
      description: "Template laporan laba rugi komprehensif",
      category: "laporan",
      icon: "TrendingUp",
      color: "blue",
      promptTemplate: "Buatkan template laporan laba rugi untuk {{nama_perusahaan}} periode {{periode}}.",
      requiredFields: ["nama_perusahaan", "periode"]
    },
    {
      code: "KEU-003",
      title: "SPT 1771",
      description: "Template SPT Tahunan PPh Badan",
      category: "pajak",
      icon: "FileText",
      color: "amber",
      promptTemplate: "Buatkan panduan pengisian SPT 1771 untuk {{nama_perusahaan}} tahun pajak {{tahun_pajak}}.",
      requiredFields: ["nama_perusahaan", "tahun_pajak"]
    },
    {
      code: "KEU-004",
      title: "Kertas Kerja Audit",
      description: "Template working paper audit",
      category: "audit",
      icon: "FileSearch",
      color: "purple",
      promptTemplate: "Buatkan template kertas kerja audit untuk akun {{nama_akun}} dengan prosedur audit standar.",
      requiredFields: ["nama_akun"]
    },
    {
      code: "KEU-005",
      title: "Analisis Rasio Keuangan",
      description: "Template perhitungan rasio keuangan",
      category: "analisis",
      icon: "Percent",
      color: "cyan",
      promptTemplate: "Buatkan template analisis rasio keuangan untuk {{nama_perusahaan}} meliputi likuiditas, solvabilitas, dan profitabilitas.",
      requiredFields: ["nama_perusahaan"]
    }
  ],

  dataBindings: [
    { key: "nama_perusahaan", label: "Nama Perusahaan", source: "company", field: "name", defaultValue: "[Nama Perusahaan]" },
    { key: "npwp", label: "NPWP", source: "company", field: "npwp", defaultValue: "[NPWP]" },
    { key: "alamat", label: "Alamat", source: "company", field: "address", defaultValue: "[Alamat]" },
    { key: "tahun_buku", label: "Tahun Buku", source: "company", field: "tahun_buku", defaultValue: "[Tahun Buku]" },
    { key: "periode", label: "Periode", source: "project", field: "periode", defaultValue: "[Periode]" },
    { key: "tanggal", label: "Tanggal", source: "system", field: "date" },
    { key: "tahun", label: "Tahun", source: "system", field: "year" }
  ],

  chatbot: {
    name: "Keuangan Mentor",
    description: "Asisten AI ahli akuntansi dan perpajakan Indonesia",
    systemPrompt: `Anda adalah Keuangan Mentor, asisten AI yang ahli dalam akuntansi, keuangan, dan perpajakan Indonesia.

Keahlian Anda meliputi:
- Laporan keuangan sesuai SAK ETAP dan PSAK
- Perpajakan Indonesia: PPh 21, PPh 23, PPh Badan, PPN
- SPT Tahunan dan pelaporan pajak
- Audit keuangan dan kertas kerja audit
- Analisis rasio keuangan dan proyeksi
- Regulasi OJK dan kepatuhan pelaporan
- Budgeting dan manajemen keuangan
- Standar akuntansi Indonesia

Berikan panduan yang akurat sesuai standar akuntansi dan peraturan perpajakan Indonesia terbaru.`,
    greetings: [
      "Halo! Saya Keuangan Mentor, siap membantu Anda dengan laporan keuangan dan perpajakan.",
      "Selamat datang! Ada yang bisa saya bantu terkait akuntansi, pajak, atau analisis keuangan?"
    ],
    suggestedTopics: [
      "Menyusun laporan keuangan yang benar",
      "Kewajiban pajak perusahaan",
      "Menghitung PPh 21 karyawan",
      "Persiapan audit keuangan",
      "Membuat proyeksi cash flow"
    ],
    color: "emerald"
  }
};
