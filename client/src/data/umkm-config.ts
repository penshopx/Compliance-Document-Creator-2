import type { IndustryConfig } from "@shared/config/industry-types";

export const umkmConfig: IndustryConfig = {
  id: "umkm",
  name: "UMKM & Koperasi",
  shortName: "UMKM",
  tagline: "NIB, IUMK, Halal, KUR",
  description: "Platform lengkap untuk perijinan, legalitas, dan dokumen usaha mikro, kecil, menengah, dan koperasi",
  icon: "Store",
  color: "purple",
  isActive: true,
  sortOrder: 7,

  landingContent: {
    badge: "Untuk Pelaku UMKM Indonesia",
    headline: "Legalitas",
    headlineHighlight: "UMKM & Koperasi",
    subheadline: "Solusi terintegrasi untuk NIB, IUMK, sertifikasi halal, dan dokumen usaha UMKM & Koperasi dengan AI-powered document generation.",
    ctaPrimary: "Mulai Sekarang",
    ctaSecondary: "Pelajari Lebih Lanjut",
    features: [
      { icon: "CreditCard", title: "NIB & OSS", description: "Kelola Nomor Induk Berusaha melalui sistem OSS RBA dengan panduan lengkap" },
      { icon: "FileCheck", title: "IUMK & Perijinan", description: "Izin Usaha Mikro Kecil dan perijinan sektoral sesuai jenis usaha" },
      { icon: "Award", title: "Sertifikasi Halal", description: "Panduan dan dokumen sertifikasi halal BPJPH untuk produk UMKM" },
      { icon: "FileText", title: "60+ Template Dokumen", description: "Template dokumen UMKM siap pakai: proposal, kontrak, laporan keuangan" },
      { icon: "Sparkles", title: "AI Generator", description: "Generate proposal bisnis, company profile, dan dokumen usaha dengan AI" },
      { icon: "Banknote", title: "Akses Pembiayaan", description: "Template dokumen untuk KUR, kredit bank, dan proposal ke investor" }
    ],
    stats: [
      { value: "60+", label: "Template Dokumen" },
      { value: "30+", label: "Jenis Perijinan" },
      { value: "24/7", label: "AI Assistant" },
      { value: "OSS RBA", label: "Sistem Terbaru" }
    ]
  },

  menuGroups: [
    {
      label: "Menu Utama",
      items: [
        { title: "Beranda", url: "/", icon: "Home" },
        { title: "Dashboard", url: "/dashboard", icon: "LayoutDashboard" },
        { title: "Profil Usaha", url: "/company", icon: "Store" }
      ]
    },
    {
      label: "Legalitas Usaha",
      items: [
        { title: "NIB & OSS", url: "/nib", icon: "CreditCard" },
        { title: "IUMK", url: "/iumk", icon: "Store" },
        { title: "Izin Usaha", url: "/izin-usaha", icon: "FileText" },
        { title: "NPWP & Pajak", url: "/npwp", icon: "Receipt" }
      ]
    },
    {
      label: "Sertifikasi",
      items: [
        { title: "Sertifikasi Halal", url: "/halal", icon: "Star" },
        { title: "PIRT & BPOM", url: "/pirt", icon: "Package" },
        { title: "Merek & HKI", url: "/hki", icon: "Copyright" }
      ]
    },
    {
      label: "Dokumen",
      items: [
        { title: "Template Dokumen", url: "/templates", icon: "FileText" },
        { title: "Proposal KUR", url: "/kur", icon: "Banknote" },
        { title: "AI Generator", url: "/generator", icon: "Sparkles" }
      ]
    }
  ],

  templateCategories: [
    { id: "all", label: "Semua" },
    { id: "legalitas", label: "Legalitas" },
    { id: "sertifikasi", label: "Sertifikasi" },
    { id: "pembiayaan", label: "Pembiayaan" },
    { id: "kontrak", label: "Kontrak" },
    { id: "koperasi", label: "Koperasi" }
  ],

  templates: [
    {
      code: "UMKM-001",
      title: "Checklist Dokumen NIB",
      description: "Daftar persyaratan pengurusan NIB melalui OSS",
      category: "legalitas",
      icon: "CheckSquare",
      color: "purple",
      promptTemplate: "Buatkan checklist dokumen yang diperlukan untuk mengurus NIB untuk usaha {{jenis_usaha}}.",
      requiredFields: ["jenis_usaha"]
    },
    {
      code: "UMKM-002",
      title: "Permohonan Sertifikasi Halal",
      description: "Template permohonan sertifikasi halal BPJPH",
      category: "sertifikasi",
      icon: "Star",
      color: "green",
      promptTemplate: "Buatkan surat permohonan sertifikasi halal untuk produk {{nama_produk}} dari {{nama_usaha}}.",
      requiredFields: ["nama_produk", "nama_usaha"]
    },
    {
      code: "UMKM-003",
      title: "Proposal KUR",
      description: "Template proposal pengajuan Kredit Usaha Rakyat",
      category: "pembiayaan",
      icon: "Banknote",
      color: "blue",
      promptTemplate: "Buatkan proposal pengajuan KUR untuk {{nama_usaha}} dengan kebutuhan dana {{jumlah_pinjaman}} untuk {{tujuan_pinjaman}}.",
      requiredFields: ["nama_usaha", "jumlah_pinjaman", "tujuan_pinjaman"]
    },
    {
      code: "UMKM-004",
      title: "Company Profile",
      description: "Template profil perusahaan UMKM",
      category: "legalitas",
      icon: "Building2",
      color: "amber",
      promptTemplate: "Buatkan company profile untuk {{nama_usaha}} yang bergerak di bidang {{bidang_usaha}}.",
      requiredFields: ["nama_usaha", "bidang_usaha"]
    },
    {
      code: "UMKM-005",
      title: "AD/ART Koperasi",
      description: "Template Anggaran Dasar dan Rumah Tangga Koperasi",
      category: "koperasi",
      icon: "Users",
      color: "indigo",
      promptTemplate: "Buatkan AD/ART untuk koperasi {{nama_koperasi}} dengan jenis {{jenis_koperasi}}.",
      requiredFields: ["nama_koperasi", "jenis_koperasi"]
    }
  ],

  dataBindings: [
    { key: "nama_usaha", label: "Nama Usaha", source: "company", field: "name", defaultValue: "[Nama Usaha]" },
    { key: "alamat", label: "Alamat", source: "company", field: "address", defaultValue: "[Alamat]" },
    { key: "nib", label: "NIB", source: "company", field: "nib", defaultValue: "[NIB]" },
    { key: "jenis_usaha", label: "Jenis Usaha", source: "company", field: "jenis_usaha", defaultValue: "[Jenis Usaha]" },
    { key: "omzet_tahunan", label: "Omzet Tahunan", source: "company", field: "omzet_tahunan", defaultValue: "[Omzet]" },
    { key: "tanggal", label: "Tanggal", source: "system", field: "date" },
    { key: "tahun", label: "Tahun", source: "system", field: "year" }
  ],

  chatbot: {
    name: "UMKM Mentor",
    description: "Asisten AI ahli legalitas dan pengembangan UMKM Indonesia",
    systemPrompt: `Anda adalah UMKM Mentor, asisten AI yang ahli dalam pengurusan legalitas dan pengembangan usaha mikro, kecil, dan menengah di Indonesia.

Keahlian Anda meliputi:
- NIB dan perijinan melalui OSS RBA (Risk Based Approach)
- IUMK dan izin usaha tingkat daerah
- Sertifikasi halal BPJPH dan P-IRT untuk produk makanan
- Pendaftaran merek dan HKI di DJKI
- KUR (Kredit Usaha Rakyat) dan akses pembiayaan UMKM
- Pendirian dan pengelolaan koperasi
- Laporan keuangan sederhana untuk UMKM
- Program pembinaan UMKM dari pemerintah

Berikan panduan yang praktis, mudah dipahami, dan sesuai kebutuhan pelaku UMKM.`,
    greetings: [
      "Halo! Saya UMKM Mentor, siap membantu Anda mengurus legalitas dan dokumen usaha UMKM.",
      "Selamat datang! Ada yang bisa saya bantu terkait NIB, sertifikasi halal, atau proposal KUR?"
    ],
    suggestedTopics: [
      "Cara mengurus NIB di OSS",
      "Persyaratan sertifikasi halal untuk UMKM",
      "Membuat proposal KUR yang baik",
      "Mendaftarkan merek usaha",
      "Mendirikan koperasi yang benar"
    ],
    color: "purple"
  }
};
