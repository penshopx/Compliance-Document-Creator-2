import type { IndustryConfig } from "@shared/config/industry-types";

export const konstruksiConfig: IndustryConfig = {
  id: "konstruksi",
  name: "Perijinan & Sertifikasi Konstruksi",
  shortName: "Konstruksi",
  tagline: "SBU, SKA, SKT, SIUJK",
  description: "Platform lengkap untuk mengelola perijinan, sertifikasi, dan dokumen bidang konstruksi sesuai regulasi Indonesia",
  icon: "Building2",
  color: "amber",
  isActive: true,
  sortOrder: 3,

  landingContent: {
    badge: "Untuk Perusahaan Jasa Konstruksi Indonesia",
    headline: "Perijinan &",
    headlineHighlight: "Sertifikasi Konstruksi",
    subheadline: "Platform terintegrasi untuk SBU, SKA, SKT, SIUJK, dan dokumen konstruksi lainnya dengan AI-powered document generation.",
    ctaPrimary: "Mulai Sekarang",
    ctaSecondary: "Pelajari Lebih Lanjut",
    features: [
      { icon: "FileCheck", title: "Manajemen SBU", description: "Kelola Sertifikat Badan Usaha dengan tracking masa berlaku dan reminder perpanjangan" },
      { icon: "Users", title: "SKA & SKT", description: "Administrasi Sertifikat Keahlian dan Sertifikat Keterampilan tenaga kerja konstruksi" },
      { icon: "Building", title: "SIUJK & NIB", description: "Pengelolaan Surat Izin Usaha Jasa Konstruksi dan Nomor Induk Berusaha melalui OSS" },
      { icon: "FileText", title: "100+ Template Dokumen", description: "Template dokumen konstruksi siap pakai sesuai standar LPJK dan Kementerian PUPR" },
      { icon: "Sparkles", title: "AI Document Generator", description: "Generate dokumen tender, kontrak, dan laporan proyek dengan bantuan AI" },
      { icon: "Bell", title: "Tracking Perijinan", description: "Monitor status perijinan dan sertifikasi dengan notifikasi otomatis" }
    ],
    stats: [
      { value: "100+", label: "Template Dokumen" },
      { value: "50+", label: "Jenis Perijinan" },
      { value: "24/7", label: "AI Assistant" },
      { value: "PP 14/2021", label: "Regulasi Terbaru" }
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
        { title: "SBU (Sertifikat Badan Usaha)", url: "/sbu", icon: "Building2" },
        { title: "SIUJK", url: "/siujk", icon: "FileText" },
        { title: "NIB & OSS", url: "/nib", icon: "CreditCard" },
        { title: "IMB/PBG", url: "/imb", icon: "Building" }
      ]
    },
    {
      label: "Sertifikasi SDM",
      items: [
        { title: "SKA (Keahlian)", url: "/ska", icon: "Award" },
        { title: "SKT (Keterampilan)", url: "/skt", icon: "Wrench" },
        { title: "Sertifikasi K3", url: "/k3-sertifikasi", icon: "Shield" }
      ]
    },
    {
      label: "Dokumen",
      items: [
        { title: "Template Dokumen", url: "/templates", icon: "FileText" },
        { title: "Dokumen Kontrak", url: "/kontrak", icon: "FileSignature" },
        { title: "Dokumen Tender", url: "/tender-docs", icon: "Gavel" },
        { title: "AI Generator", url: "/generator", icon: "Sparkles" }
      ]
    }
  ],

  templateCategories: [
    { id: "all", label: "Semua" },
    { id: "perijinan", label: "Perijinan" },
    { id: "sertifikasi", label: "Sertifikasi" },
    { id: "kontrak", label: "Kontrak" },
    { id: "proyek", label: "Proyek" },
    { id: "tender", label: "Tender" }
  ],

  templates: [
    {
      code: "KONST-001",
      title: "Permohonan SBU Baru",
      description: "Template surat permohonan Sertifikat Badan Usaha baru ke LPJK",
      category: "perijinan",
      icon: "FileCheck",
      color: "blue",
      promptTemplate: "Buatkan surat permohonan SBU baru untuk perusahaan konstruksi dengan data: {{nama_perusahaan}}, klasifikasi {{klasifikasi}}, kualifikasi {{kualifikasi}}.",
      requiredFields: ["nama_perusahaan", "klasifikasi", "kualifikasi"]
    },
    {
      code: "KONST-002",
      title: "Kontrak Konstruksi",
      description: "Template kontrak pekerjaan konstruksi standar",
      category: "kontrak",
      icon: "FileSignature",
      color: "green",
      promptTemplate: "Buatkan kontrak pekerjaan konstruksi untuk proyek {{nama_proyek}} dengan nilai {{nilai_kontrak}} dan durasi {{durasi}}.",
      requiredFields: ["nama_proyek", "nilai_kontrak", "durasi"]
    },
    {
      code: "KONST-003",
      title: "Rencana Anggaran Biaya",
      description: "Template RAB proyek konstruksi",
      category: "proyek",
      icon: "Calculator",
      color: "amber",
      promptTemplate: "Buatkan Rencana Anggaran Biaya untuk proyek {{nama_proyek}} dengan spesifikasi pekerjaan berikut.",
      requiredFields: ["nama_proyek"]
    },
    {
      code: "KONST-004",
      title: "Metode Pelaksanaan",
      description: "Template metode kerja untuk tender konstruksi",
      category: "tender",
      icon: "Settings",
      color: "purple",
      promptTemplate: "Buatkan metode pelaksanaan untuk pekerjaan konstruksi {{jenis_pekerjaan}} dengan tahapan detail.",
      requiredFields: ["jenis_pekerjaan"]
    },
    {
      code: "KONST-005",
      title: "Laporan Kemajuan Proyek",
      description: "Template laporan progress proyek konstruksi",
      category: "proyek",
      icon: "BarChart3",
      color: "cyan",
      promptTemplate: "Buatkan laporan kemajuan proyek {{nama_proyek}} periode {{periode}} dengan progress {{persentase}}%.",
      requiredFields: ["nama_proyek", "periode", "persentase"]
    }
  ],

  dataBindings: [
    { key: "nama_perusahaan", label: "Nama Perusahaan", source: "company", field: "name", defaultValue: "[Nama Perusahaan]" },
    { key: "alamat", label: "Alamat", source: "company", field: "address", defaultValue: "[Alamat]" },
    { key: "npwp", label: "NPWP", source: "company", field: "npwp", defaultValue: "[NPWP]" },
    { key: "nib", label: "NIB", source: "company", field: "nib", defaultValue: "[NIB]" },
    { key: "sbu_number", label: "Nomor SBU", source: "company", field: "sbu_number", defaultValue: "[Nomor SBU]" },
    { key: "klasifikasi", label: "Klasifikasi", source: "company", field: "klasifikasi", defaultValue: "[Klasifikasi]" },
    { key: "kualifikasi", label: "Kualifikasi", source: "company", field: "kualifikasi", defaultValue: "[Kualifikasi]" },
    { key: "tanggal", label: "Tanggal", source: "system", field: "date" },
    { key: "tahun", label: "Tahun", source: "system", field: "year" }
  ],

  chatbot: {
    name: "Konstruksi Mentor",
    description: "Asisten AI ahli perijinan dan sertifikasi konstruksi Indonesia",
    systemPrompt: `Anda adalah Konstruksi Mentor, asisten AI yang ahli dalam bidang perijinan dan sertifikasi konstruksi di Indonesia.

Keahlian Anda meliputi:
- Sertifikat Badan Usaha (SBU) dan klasifikasi/kualifikasi usaha jasa konstruksi
- Sertifikat Keahlian (SKA) dan Sertifikat Keterampilan (SKT)
- SIUJK, NIB, dan perijinan melalui OSS
- IMB/PBG dan perijinan proyek
- Regulasi LPJK, Kementerian PUPR, dan PP 14/2021
- Dokumen tender dan kontrak konstruksi
- Standar nasional dan internasional bidang konstruksi

Berikan panduan yang jelas, akurat, dan sesuai regulasi terbaru Indonesia.`,
    greetings: [
      "Halo! Saya Konstruksi Mentor, siap membantu Anda dengan perijinan dan sertifikasi konstruksi.",
      "Selamat datang! Ada yang bisa saya bantu terkait SBU, SKA, SKT, atau perijinan konstruksi lainnya?"
    ],
    suggestedTopics: [
      "Cara mengurus perpanjangan SBU",
      "Persyaratan mendapatkan SKA",
      "Proses perijinan melalui OSS",
      "Klasifikasi dan kualifikasi SBU",
      "Membuat dokumen tender"
    ],
    color: "amber"
  }
};
