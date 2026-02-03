import type { IndustryConfig } from "@shared/config/industry-types";

export const propertiConfig: IndustryConfig = {
  id: "properti",
  name: "Properti & Real Estate",
  shortName: "Properti",
  tagline: "SHGB, Perijinan, Kontrak",
  description: "Platform lengkap untuk manajemen dokumen properti, perijinan, dan transaksi real estate",
  icon: "Building",
  color: "purple",
  isActive: true,
  sortOrder: 17,

  landingContent: {
    badge: "Untuk Developer & Agen Properti Indonesia",
    headline: "Dokumen &",
    headlineHighlight: "Manajemen Properti",
    subheadline: "Platform terintegrasi untuk perijinan properti, sertifikat tanah, kontrak jual-beli, dan dokumen real estate dengan AI-powered document generation.",
    ctaPrimary: "Mulai Sekarang",
    ctaSecondary: "Pelajari Lebih Lanjut",
    features: [
      { icon: "FileCheck", title: "Sertifikat & Perijinan", description: "Kelola SHM, SHGB, IMB/PBG, dan perijinan properti" },
      { icon: "FileSignature", title: "Kontrak & Perjanjian", description: "Template kontrak jual-beli, sewa, dan perjanjian properti" },
      { icon: "Calculator", title: "Due Diligence", description: "Checklist dan dokumentasi uji tuntas properti" },
      { icon: "FileText", title: "80+ Template Dokumen", description: "Template dokumen properti standar dan customizable" },
      { icon: "Sparkles", title: "AI Document Generator", description: "Generate dokumen legal dan kontrak dengan AI" },
      { icon: "Bell", title: "Tracking Dokumen", description: "Monitor status perijinan dan sertifikat dengan notifikasi" }
    ],
    stats: [
      { value: "80+", label: "Template Dokumen" },
      { value: "Legal", label: "Verified" },
      { value: "24/7", label: "AI Assistant" },
      { value: "ATR/BPN", label: "Compliant" }
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
        { title: "Sertifikat Tanah", url: "/sertifikat", icon: "FileCheck" },
        { title: "IMB/PBG", url: "/imb", icon: "Building" },
        { title: "SLF", url: "/slf", icon: "Award" },
        { title: "AMDAL/UKL-UPL", url: "/amdal", icon: "Leaf" }
      ]
    },
    {
      label: "Transaksi",
      items: [
        { title: "Jual Beli (AJB)", url: "/ajb", icon: "FileSignature" },
        { title: "Sewa Menyewa", url: "/sewa", icon: "Key" },
        { title: "KPR & Pembiayaan", url: "/kpr", icon: "CreditCard" },
        { title: "Due Diligence", url: "/due-diligence", icon: "Search" }
      ]
    },
    {
      label: "Dokumen",
      items: [
        { title: "Template Dokumen", url: "/templates", icon: "FileText" },
        { title: "PPJB & Kontrak", url: "/ppjb", icon: "Handshake" },
        { title: "Surat Kuasa", url: "/kuasa", icon: "UserCheck" },
        { title: "AI Generator", url: "/generator", icon: "Sparkles" }
      ]
    }
  ],

  templateCategories: [
    { id: "all", label: "Semua" },
    { id: "perijinan", label: "Perijinan" },
    { id: "transaksi", label: "Transaksi" },
    { id: "kontrak", label: "Kontrak" },
    { id: "surat", label: "Surat" },
    { id: "legal", label: "Legal" }
  ],

  templates: [
    {
      code: "PROP-001",
      title: "PPJB (Perjanjian Pengikatan Jual Beli)",
      description: "Template PPJB untuk transaksi properti",
      category: "kontrak",
      icon: "FileSignature",
      color: "blue",
      promptTemplate: "Buatkan PPJB untuk properti {{jenis_properti}} di {{lokasi}} dengan nilai transaksi {{nilai}} antara penjual dan pembeli.",
      requiredFields: ["jenis_properti", "lokasi", "nilai"]
    },
    {
      code: "PROP-002",
      title: "Perjanjian Sewa Menyewa",
      description: "Template kontrak sewa properti",
      category: "kontrak",
      icon: "Key",
      color: "green",
      promptTemplate: "Buatkan perjanjian sewa menyewa untuk {{jenis_properti}} selama {{durasi}} dengan nilai sewa {{nilai_sewa}} per bulan.",
      requiredFields: ["jenis_properti", "durasi", "nilai_sewa"]
    },
    {
      code: "PROP-003",
      title: "Checklist Due Diligence",
      description: "Template checklist uji tuntas properti",
      category: "legal",
      icon: "Search",
      color: "purple",
      promptTemplate: "Buatkan checklist due diligence untuk pembelian {{jenis_properti}} dengan cakupan legal, teknis, dan finansial.",
      requiredFields: ["jenis_properti"]
    },
    {
      code: "PROP-004",
      title: "Surat Kuasa Jual",
      description: "Template surat kuasa untuk menjual properti",
      category: "surat",
      icon: "UserCheck",
      color: "amber",
      promptTemplate: "Buatkan surat kuasa jual untuk properti dengan sertifikat {{nomor_sertifikat}} atas nama {{pemilik}}.",
      requiredFields: ["nomor_sertifikat", "pemilik"]
    },
    {
      code: "PROP-005",
      title: "Berita Acara Serah Terima",
      description: "Template BAST untuk penyerahan properti",
      category: "transaksi",
      icon: "Handshake",
      color: "cyan",
      promptTemplate: "Buatkan berita acara serah terima untuk {{jenis_properti}} dari {{penjual}} kepada {{pembeli}}.",
      requiredFields: ["jenis_properti", "penjual", "pembeli"]
    }
  ],

  dataBindings: [
    { key: "nama_perusahaan", label: "Nama Developer/Agen", source: "company", field: "name", defaultValue: "[Nama Perusahaan]" },
    { key: "alamat", label: "Alamat Kantor", source: "company", field: "address", defaultValue: "[Alamat]" },
    { key: "direktur", label: "Direktur", source: "company", field: "director", defaultValue: "[Nama Direktur]" },
    { key: "siup", label: "SIUP", source: "company", field: "siup", defaultValue: "[Nomor SIUP]" },
    { key: "tanggal", label: "Tanggal", source: "system", field: "date" },
    { key: "tahun", label: "Tahun", source: "system", field: "year" }
  ],

  chatbot: {
    name: "Properti Mentor",
    description: "Asisten AI ahli dokumen dan transaksi properti Indonesia",
    systemPrompt: `Anda adalah Properti Mentor, asisten AI yang ahli dalam bidang dokumen dan transaksi properti di Indonesia.

Keahlian Anda meliputi:
- Sertifikat tanah (SHM, SHGB, HGB, Girik)
- Perijinan properti (IMB/PBG, SLF, AMDAL)
- Kontrak jual-beli dan sewa menyewa
- PPJB, AJB, dan proses balik nama
- KPR dan pembiayaan properti
- Due diligence dan legal audit
- Regulasi ATR/BPN dan pertanahan

Berikan panduan yang jelas, akurat, dan sesuai hukum properti Indonesia.`,
    greetings: [
      "Halo! Saya Properti Mentor, siap membantu Anda dengan dokumen dan transaksi properti.",
      "Selamat datang! Ada yang bisa saya bantu terkait sertifikat, kontrak, atau perijinan properti?"
    ],
    suggestedTopics: [
      "Perbedaan SHM dan SHGB",
      "Cara membuat PPJB",
      "Proses balik nama sertifikat",
      "Due diligence properti",
      "Kontrak sewa properti"
    ],
    color: "purple"
  }
};
