import type { IndustryConfig } from "@shared/config/industry-types";

export const tenderConfig: IndustryConfig = {
  id: "tender",
  name: "Pengadaan & Tender",
  shortName: "Tender",
  tagline: "LPSE, e-Procurement, Dokumen Tender",
  description: "Platform lengkap untuk persiapan dokumen tender, pengadaan barang/jasa, dan lelang pemerintah maupun swasta",
  icon: "Gavel",
  color: "cyan",
  isActive: true,
  sortOrder: 10,

  landingContent: {
    badge: "Untuk Pemenangan Tender Indonesia",
    headline: "Pengadaan &",
    headlineHighlight: "Dokumen Tender",
    subheadline: "Solusi terintegrasi untuk persiapan tender, dokumen penawaran, dan administrasi pengadaan dengan AI-powered document generation.",
    ctaPrimary: "Mulai Sekarang",
    ctaSecondary: "Pelajari Lebih Lanjut",
    features: [
      { icon: "Building", title: "Tender Pemerintah", description: "Panduan lengkap tender melalui LPSE, LKPP, dan e-Procurement pemerintah" },
      { icon: "Briefcase", title: "Tender Swasta", description: "Template dan panduan untuk tender perusahaan swasta dan BUMN" },
      { icon: "FileCheck", title: "Dokumen Kualifikasi", description: "Template dokumen administrasi, teknis, dan kualifikasi perusahaan" },
      { icon: "Calculator", title: "Penawaran Harga", description: "Template RAB, analisa harga satuan, dan dokumen penawaran harga" },
      { icon: "Sparkles", title: "AI Generator", description: "Generate metode pelaksanaan, jadwal kerja, dan penawaran teknis dengan AI" },
      { icon: "TrendingUp", title: "Tracking Tender", description: "Monitor status tender, deadline, dan hasil evaluasi" }
    ],
    stats: [
      { value: "100+", label: "Template Dokumen" },
      { value: "50+", label: "Jenis Tender" },
      { value: "24/7", label: "AI Assistant" },
      { value: "Perpres 16/2018", label: "Regulasi PBJ" }
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
      label: "Dokumen Tender",
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
    { id: "administrasi", label: "Administrasi" },
    { id: "teknis", label: "Teknis" },
    { id: "harga", label: "Harga" },
    { id: "jaminan", label: "Jaminan" }
  ],

  templates: [
    {
      code: "TNDR-001",
      title: "Surat Pernyataan Minat",
      description: "Template surat minat mengikuti tender",
      category: "administrasi",
      icon: "Mail",
      color: "cyan",
      promptTemplate: "Buatkan surat pernyataan minat untuk tender {{nama_tender}} dari {{nama_perusahaan}}.",
      requiredFields: ["nama_tender", "nama_perusahaan"]
    },
    {
      code: "TNDR-002",
      title: "Pakta Integritas",
      description: "Template pakta integritas tender",
      category: "administrasi",
      icon: "FileCheck",
      color: "blue",
      promptTemplate: "Buatkan pakta integritas untuk tender {{nama_tender}} yang ditandatangani oleh {{nama_direktur}}.",
      requiredFields: ["nama_tender", "nama_direktur"]
    },
    {
      code: "TNDR-003",
      title: "Metode Pelaksanaan",
      description: "Template uraian metode kerja tender",
      category: "teknis",
      icon: "Settings",
      color: "purple",
      promptTemplate: "Buatkan metode pelaksanaan untuk pekerjaan {{jenis_pekerjaan}} dengan tahapan dan teknik pelaksanaan.",
      requiredFields: ["jenis_pekerjaan"]
    },
    {
      code: "TNDR-004",
      title: "Rencana Anggaran Biaya",
      description: "Template RAB tender",
      category: "harga",
      icon: "Calculator",
      color: "green",
      promptTemplate: "Buatkan kerangka RAB untuk pekerjaan {{jenis_pekerjaan}} dengan nilai HPS sekitar {{nilai_hps}}.",
      requiredFields: ["jenis_pekerjaan", "nilai_hps"]
    },
    {
      code: "TNDR-005",
      title: "Daftar Pengalaman Kerja",
      description: "Template daftar pengalaman proyek",
      category: "administrasi",
      icon: "History",
      color: "amber",
      promptTemplate: "Buatkan format daftar pengalaman kerja untuk {{nama_perusahaan}} dalam bidang {{bidang_pekerjaan}}.",
      requiredFields: ["nama_perusahaan", "bidang_pekerjaan"]
    }
  ],

  dataBindings: [
    { key: "nama_perusahaan", label: "Nama Perusahaan", source: "company", field: "name", defaultValue: "[Nama Perusahaan]" },
    { key: "alamat", label: "Alamat", source: "company", field: "address", defaultValue: "[Alamat]" },
    { key: "npwp", label: "NPWP", source: "company", field: "npwp", defaultValue: "[NPWP]" },
    { key: "sbu_number", label: "Nomor SBU", source: "company", field: "sbu_number", defaultValue: "[Nomor SBU]" },
    { key: "nama_tender", label: "Nama Tender", source: "project", field: "nama_tender", defaultValue: "[Nama Tender]" },
    { key: "tanggal", label: "Tanggal", source: "system", field: "date" },
    { key: "tahun", label: "Tahun", source: "system", field: "year" }
  ],

  chatbot: {
    name: "Tender Mentor",
    description: "Asisten AI ahli pengadaan dan pemenangan tender Indonesia",
    systemPrompt: `Anda adalah Tender Mentor, asisten AI yang ahli dalam pengadaan barang/jasa dan persiapan tender di Indonesia.

Keahlian Anda meliputi:
- Tender pemerintah melalui LPSE, SPSE, dan e-Procurement
- Perpres 16/2018 tentang Pengadaan Barang/Jasa Pemerintah
- e-Purchasing, e-Tendering, e-Katalog, dan metode pengadaan
- Dokumen kualifikasi dan persyaratan administrasi
- Penyusunan penawaran teknis dan metode pelaksanaan
- RAB, analisa harga satuan, dan penawaran harga
- Tender BUMN, pertambangan, oil & gas, dan swasta
- Evaluasi tender dan strategi pemenangan

Berikan panduan yang akurat untuk membantu memenangkan tender secara kompetitif dan sesuai regulasi.`,
    greetings: [
      "Halo! Saya Tender Mentor, siap membantu Anda memenangkan tender dengan dokumen yang profesional.",
      "Selamat datang! Ada yang bisa saya bantu terkait dokumen tender atau strategi pengadaan?"
    ],
    suggestedTopics: [
      "Menyusun dokumen kualifikasi yang baik",
      "Syarat tender di LPSE",
      "Membuat metode pelaksanaan yang menarik",
      "Menyusun RAB yang kompetitif",
      "Perbedaan tender pemerintah dan BUMN"
    ],
    color: "cyan"
  }
};
