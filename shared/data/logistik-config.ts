import type { IndustryConfig } from "@shared/config/industry-types";

export const logistikConfig: IndustryConfig = {
  id: "logistik",
  name: "Logistik & Supply Chain",
  shortName: "Logistik",
  tagline: "SIUJPT, Bea Cukai, Ekspor-Impor",
  description: "Platform lengkap untuk manajemen perijinan, dokumentasi ekspor-impor, dan operasional logistik",
  icon: "Truck",
  color: "blue",
  isActive: true,
  sortOrder: 18,

  landingContent: {
    badge: "Untuk Perusahaan Logistik Indonesia",
    headline: "Perijinan &",
    headlineHighlight: "Dokumentasi Logistik",
    subheadline: "Platform terintegrasi untuk SIUJPT, dokumen bea cukai, ekspor-impor, dan manajemen supply chain dengan AI-powered document generation.",
    ctaPrimary: "Mulai Sekarang",
    ctaSecondary: "Pelajari Lebih Lanjut",
    features: [
      { icon: "FileCheck", title: "Perijinan Logistik", description: "Kelola SIUJPT, SIUP, dan izin operasional logistik" },
      { icon: "Globe", title: "Ekspor-Impor", description: "Dokumentasi PEB, PIB, dan dokumen kepabeanan" },
      { icon: "Truck", title: "Manajemen Armada", description: "Dokumen kendaraan, asuransi, dan SOP operasional" },
      { icon: "FileText", title: "70+ Template Dokumen", description: "Template dokumen logistik dan supply chain" },
      { icon: "Sparkles", title: "AI Document Generator", description: "Generate dokumen pengiriman dan kontrak dengan AI" },
      { icon: "Bell", title: "Tracking Shipment", description: "Monitor status pengiriman dan dokumen dengan notifikasi" }
    ],
    stats: [
      { value: "70+", label: "Template Dokumen" },
      { value: "INSW", label: "Integrated" },
      { value: "24/7", label: "AI Assistant" },
      { value: "ISO 28000", label: "Ready" }
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
        { title: "Armada & Peralatan", url: "/equipment", icon: "Truck" },
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
    { id: "eksim", label: "Ekspor-Impor" },
    { id: "shipping", label: "Shipping" },
    { id: "kontrak", label: "Kontrak" },
    { id: "sop", label: "SOP" }
  ],

  templates: [
    {
      code: "LOG-001",
      title: "Surat Jalan (Delivery Order)",
      description: "Template surat jalan untuk pengiriman barang",
      category: "shipping",
      icon: "Truck",
      color: "blue",
      promptTemplate: "Buatkan surat jalan untuk pengiriman {{jenis_barang}} dari {{asal}} ke {{tujuan}} dengan nomor order {{nomor_order}}.",
      requiredFields: ["jenis_barang", "asal", "tujuan", "nomor_order"]
    },
    {
      code: "LOG-002",
      title: "Packing List",
      description: "Template daftar kemasan untuk ekspor",
      category: "eksim",
      icon: "Package",
      color: "green",
      promptTemplate: "Buatkan packing list untuk ekspor {{produk}} dengan total {{jumlah_koli}} koli ke {{negara_tujuan}}.",
      requiredFields: ["produk", "jumlah_koli", "negara_tujuan"]
    },
    {
      code: "LOG-003",
      title: "Commercial Invoice",
      description: "Template invoice komersial untuk ekspor",
      category: "eksim",
      icon: "Receipt",
      color: "purple",
      promptTemplate: "Buatkan commercial invoice untuk ekspor {{produk}} dengan nilai {{nilai}} ke buyer {{nama_buyer}}.",
      requiredFields: ["produk", "nilai", "nama_buyer"]
    },
    {
      code: "LOG-004",
      title: "Kontrak Pengiriman",
      description: "Template kontrak jasa pengiriman",
      category: "kontrak",
      icon: "FileSignature",
      color: "amber",
      promptTemplate: "Buatkan kontrak pengiriman barang dari {{pengirim}} dengan rute {{rute}} dan durasi kontrak {{durasi}}.",
      requiredFields: ["pengirim", "rute", "durasi"]
    },
    {
      code: "LOG-005",
      title: "SOP Warehouse",
      description: "Template SOP operasional gudang",
      category: "sop",
      icon: "Warehouse",
      color: "cyan",
      promptTemplate: "Buatkan SOP untuk operasional gudang {{nama_gudang}} meliputi penerimaan, penyimpanan, dan pengeluaran barang.",
      requiredFields: ["nama_gudang"]
    }
  ],

  dataBindings: [
    { key: "nama_perusahaan", label: "Nama Perusahaan", source: "company", field: "name", defaultValue: "[Nama Perusahaan]" },
    { key: "alamat", label: "Alamat", source: "company", field: "address", defaultValue: "[Alamat]" },
    { key: "npwp", label: "NPWP", source: "company", field: "npwp", defaultValue: "[NPWP]" },
    { key: "siujpt", label: "SIUJPT", source: "company", field: "siujpt", defaultValue: "[Nomor SIUJPT]" },
    { key: "tanggal", label: "Tanggal", source: "system", field: "date" },
    { key: "tahun", label: "Tahun", source: "system", field: "year" }
  ],

  chatbot: {
    name: "Logistik Mentor",
    description: "Asisten AI ahli perijinan dan operasional logistik Indonesia",
    systemPrompt: `Anda adalah Logistik Mentor, asisten AI yang ahli dalam bidang perijinan dan operasional logistik di Indonesia.

Keahlian Anda meliputi:
- SIUJPT dan perijinan jasa pengiriman
- Dokumen ekspor-impor (PEB, PIB, B/L, AWB)
- Prosedur bea cukai dan INSW
- AEO dan fasilitas kepabeanan
- Manajemen armada dan pergudangan
- ISO 28000 keamanan supply chain
- Regulasi Kemenhub dan DJBC

Berikan panduan yang jelas, akurat, dan sesuai regulasi logistik Indonesia.`,
    greetings: [
      "Halo! Saya Logistik Mentor, siap membantu Anda dengan perijinan dan dokumentasi logistik.",
      "Selamat datang! Ada yang bisa saya bantu terkait SIUJPT, ekspor-impor, atau dokumen pengiriman?"
    ],
    suggestedTopics: [
      "Cara mengurus SIUJPT",
      "Dokumen wajib ekspor",
      "Prosedur bea cukai impor",
      "Membuat Bill of Lading",
      "SOP operasional gudang"
    ],
    color: "blue"
  }
};
