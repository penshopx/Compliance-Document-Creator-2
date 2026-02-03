import type { IndustryConfig } from "@shared/config/industry-types";

export const pendidikanConfig: IndustryConfig = {
  id: "pendidikan",
  name: "Institusi Pendidikan",
  shortName: "Pendidikan",
  tagline: "Akreditasi, BAN-PT, Kurikulum",
  description: "Platform lengkap untuk manajemen akreditasi, kurikulum, dan dokumen institusi pendidikan",
  icon: "GraduationCap",
  color: "indigo",
  isActive: true,
  sortOrder: 13,

  landingContent: {
    badge: "Untuk Institusi Pendidikan Indonesia",
    headline: "Akreditasi &",
    headlineHighlight: "Manajemen Pendidikan",
    subheadline: "Platform terintegrasi untuk akreditasi BAN-PT, BAN-SM, kurikulum, dan dokumen akademik dengan AI-powered document generation.",
    ctaPrimary: "Mulai Sekarang",
    ctaSecondary: "Pelajari Lebih Lanjut",
    features: [
      { icon: "Award", title: "Akreditasi BAN-PT/SM", description: "Persiapan dan dokumentasi lengkap akreditasi institusi dan program studi" },
      { icon: "BookOpen", title: "Kurikulum & Silabus", description: "Kelola dokumen kurikulum, silabus, dan RPS sesuai standar KKNI" },
      { icon: "Users", title: "Manajemen SDM", description: "Dokumentasi kualifikasi dosen, guru, dan tenaga kependidikan" },
      { icon: "FileText", title: "90+ Template Dokumen", description: "Template dokumen akademik, administratif, dan akreditasi" },
      { icon: "Sparkles", title: "AI Document Generator", description: "Generate proposal, laporan, dan dokumen akademik dengan AI" },
      { icon: "Bell", title: "Tracking Akreditasi", description: "Monitor status akreditasi dan visitasi dengan notifikasi otomatis" }
    ],
    stats: [
      { value: "90+", label: "Template Dokumen" },
      { value: "9 Kriteria", label: "BAN-PT 2019" },
      { value: "24/7", label: "AI Assistant" },
      { value: "KKNI", label: "Standar Nasional" }
    ]
  },

  menuGroups: [
    {
      label: "Menu Utama",
      items: [
        { title: "Beranda", url: "/", icon: "Home" },
        { title: "Dashboard", url: "/dashboard", icon: "LayoutDashboard" },
        { title: "Profil Institusi", url: "/company", icon: "Building2" }
      ]
    },
    {
      label: "Akreditasi",
      items: [
        { title: "BAN-PT (Perguruan Tinggi)", url: "/ban-pt", icon: "Award" },
        { title: "BAN-SM (Sekolah)", url: "/ban-sm", icon: "FileCheck" },
        { title: "BAN-PAUD/PNF", url: "/ban-paud", icon: "Users" },
        { title: "LAMDIK", url: "/lamdik", icon: "Shield" }
      ]
    },
    {
      label: "Akademik",
      items: [
        { title: "Kurikulum", url: "/kurikulum", icon: "BookOpen" },
        { title: "RPS & Silabus", url: "/rps", icon: "FileText" },
        { title: "Capaian Pembelajaran", url: "/cpl", icon: "Target" },
        { title: "SDM Pendidik", url: "/sdm", icon: "UserCheck" }
      ]
    },
    {
      label: "Dokumen",
      items: [
        { title: "Template Dokumen", url: "/templates", icon: "FileText" },
        { title: "LKPS & LED", url: "/lkps", icon: "FileBarChart" },
        { title: "Proposal & Laporan", url: "/proposal", icon: "FilePlus2" },
        { title: "AI Generator", url: "/generator", icon: "Sparkles" }
      ]
    }
  ],

  templateCategories: [
    { id: "all", label: "Semua" },
    { id: "akreditasi", label: "Akreditasi" },
    { id: "kurikulum", label: "Kurikulum" },
    { id: "akademik", label: "Akademik" },
    { id: "sdm", label: "SDM" },
    { id: "administrasi", label: "Administrasi" }
  ],

  templates: [
    {
      code: "EDU-001",
      title: "LKPS (Laporan Kinerja Program Studi)",
      description: "Template LKPS untuk akreditasi BAN-PT",
      category: "akreditasi",
      icon: "FileBarChart",
      color: "blue",
      promptTemplate: "Buatkan template LKPS untuk program studi {{prodi}} dengan data kinerja lengkap sesuai format BAN-PT terbaru.",
      requiredFields: ["prodi"]
    },
    {
      code: "EDU-002",
      title: "RPS (Rencana Pembelajaran Semester)",
      description: "Template RPS mata kuliah standar KKNI",
      category: "kurikulum",
      icon: "BookOpen",
      color: "green",
      promptTemplate: "Buatkan RPS mata kuliah {{mata_kuliah}} dengan {{sks}} SKS untuk program studi {{prodi}} sesuai standar OBE.",
      requiredFields: ["mata_kuliah", "sks", "prodi"]
    },
    {
      code: "EDU-003",
      title: "LED (Laporan Evaluasi Diri)",
      description: "Template LED untuk akreditasi",
      category: "akreditasi",
      icon: "FileCheck",
      color: "indigo",
      promptTemplate: "Buatkan template LED untuk kriteria {{kriteria}} dengan analisis SWOT dan rencana tindak lanjut.",
      requiredFields: ["kriteria"]
    },
    {
      code: "EDU-004",
      title: "Profil Dosen/NIDK",
      description: "Template profil dan portfolio dosen",
      category: "sdm",
      icon: "UserCheck",
      color: "purple",
      promptTemplate: "Buatkan template profil dosen lengkap dengan riwayat pendidikan, penelitian, dan pengabdian.",
      requiredFields: []
    },
    {
      code: "EDU-005",
      title: "Proposal Penelitian/PkM",
      description: "Template proposal penelitian dan pengabdian masyarakat",
      category: "akademik",
      icon: "FilePlus2",
      color: "amber",
      promptTemplate: "Buatkan proposal penelitian dengan judul {{judul}} untuk skema {{skema}} dengan metodologi lengkap.",
      requiredFields: ["judul", "skema"]
    }
  ],

  dataBindings: [
    { key: "nama_institusi", label: "Nama Institusi", source: "company", field: "name", defaultValue: "[Nama Institusi]" },
    { key: "alamat", label: "Alamat", source: "company", field: "address", defaultValue: "[Alamat]" },
    { key: "rektor", label: "Rektor/Kepala Sekolah", source: "company", field: "director", defaultValue: "[Nama Pimpinan]" },
    { key: "akreditasi", label: "Status Akreditasi", source: "company", field: "accreditation", defaultValue: "[Status Akreditasi]" },
    { key: "tanggal", label: "Tanggal", source: "system", field: "date" },
    { key: "tahun", label: "Tahun", source: "system", field: "year" }
  ],

  chatbot: {
    name: "Pendidikan Mentor",
    description: "Asisten AI ahli akreditasi dan manajemen pendidikan Indonesia",
    systemPrompt: `Anda adalah Pendidikan Mentor, asisten AI yang ahli dalam bidang akreditasi dan manajemen pendidikan di Indonesia.

Keahlian Anda meliputi:
- Akreditasi BAN-PT untuk perguruan tinggi (9 kriteria IAPS 4.0)
- Akreditasi BAN-SM untuk sekolah menengah
- Akreditasi BAN-PAUD dan BAN-PNF
- Kurikulum berbasis OBE dan KKNI
- Penyusunan RPS, silabus, dan capaian pembelajaran
- LKPS dan LED untuk akreditasi
- Regulasi Kemendikbudristek terbaru

Berikan panduan yang jelas, akurat, dan sesuai standar pendidikan nasional.`,
    greetings: [
      "Halo! Saya Pendidikan Mentor, siap membantu Anda dengan akreditasi dan dokumen pendidikan.",
      "Selamat datang! Ada yang bisa saya bantu terkait akreditasi BAN-PT, kurikulum, atau dokumen akademik?"
    ],
    suggestedTopics: [
      "Persiapan akreditasi BAN-PT",
      "Menyusun LKPS dan LED",
      "Format RPS standar OBE",
      "Kurikulum berbasis KKNI",
      "Kriteria akreditasi program studi"
    ],
    color: "indigo"
  }
};
