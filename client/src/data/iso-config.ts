import type { IndustryConfig } from "@shared/config/industry-types";

export const isoConfig: IndustryConfig = {
  id: "iso",
  name: "Manajemen ISO",
  shortName: "ISO",
  tagline: "ISO 9001, 14001, 45001, 27001",
  description: "Platform lengkap untuk implementasi dan sertifikasi berbagai standar ISO: 9001, 14001, 45001, 27001, dan lainnya",
  icon: "Shield",
  color: "indigo",
  isActive: true,
  sortOrder: 8,

  landingContent: {
    badge: "Untuk Sertifikasi ISO Indonesia",
    headline: "Manajemen",
    headlineHighlight: "Standar ISO",
    subheadline: "Solusi terintegrasi untuk ISO 9001, 14001, 45001, 27001, dan standar manajemen internasional lainnya dengan AI-powered document generation.",
    ctaPrimary: "Mulai Sekarang",
    ctaSecondary: "Pelajari Lebih Lanjut",
    features: [
      { icon: "Award", title: "ISO 9001 (Mutu)", description: "Implementasi Sistem Manajemen Mutu dengan template dan panduan lengkap" },
      { icon: "Leaf", title: "ISO 14001 (Lingkungan)", description: "Sistem Manajemen Lingkungan terintegrasi dengan regulasi Indonesia" },
      { icon: "HardHat", title: "ISO 45001 (K3)", description: "Sistem Manajemen Keselamatan dan Kesehatan Kerja" },
      { icon: "Lock", title: "ISO 27001 (Keamanan)", description: "Sistem Manajemen Keamanan Informasi dan perlindungan data" },
      { icon: "FileText", title: "200+ Template Dokumen", description: "Template dokumen ISO dan AI generator untuk semua klausul" },
      { icon: "ClipboardCheck", title: "Audit Management", description: "Kelola audit internal, eksternal, dan gap analysis terintegrasi" }
    ],
    stats: [
      { value: "200+", label: "Template Dokumen" },
      { value: "10+", label: "Standar ISO" },
      { value: "24/7", label: "AI Assistant" },
      { value: "HLS", label: "High Level Structure" }
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
      label: "ISO 9001 (Mutu)",
      items: [
        { title: "Overview QMS", url: "/qms", icon: "Target" },
        { title: "Dokumentasi", url: "/qms-docs", icon: "FileText" },
        { title: "Checklist", url: "/qms-checklist", icon: "CheckSquare" }
      ]
    },
    {
      label: "ISO 14001 & 45001",
      items: [
        { title: "Overview EMS", url: "/ems", icon: "Leaf" },
        { title: "Overview OHSMS", url: "/ohsms", icon: "HardHat" },
        { title: "HIRADC", url: "/hiradc", icon: "AlertTriangle" }
      ]
    },
    {
      label: "Audit",
      items: [
        { title: "Audit Internal", url: "/internal-audit", icon: "Search" },
        { title: "Gap Analysis", url: "/gap-analysis", icon: "GitCompare" },
        { title: "NCR & CAPA", url: "/ncr", icon: "AlertTriangle" }
      ]
    },
    {
      label: "Dokumen",
      items: [
        { title: "Template Dokumen", url: "/templates", icon: "FileText" },
        { title: "AI Generator", url: "/generator", icon: "Sparkles" }
      ]
    }
  ],

  templateCategories: [
    { id: "all", label: "Semua" },
    { id: "qms", label: "ISO 9001 (QMS)" },
    { id: "ems", label: "ISO 14001 (EMS)" },
    { id: "ohsms", label: "ISO 45001 (OHSMS)" },
    { id: "isms", label: "ISO 27001 (ISMS)" },
    { id: "audit", label: "Audit" }
  ],

  templates: [
    {
      code: "ISO-001",
      title: "Manual Mutu (ISO 9001)",
      description: "Template Quality Manual sesuai klausul ISO 9001",
      category: "qms",
      icon: "BookOpen",
      color: "blue",
      promptTemplate: "Buatkan Manual Mutu ISO 9001:2015 untuk {{nama_perusahaan}} dengan ruang lingkup {{ruang_lingkup}}.",
      requiredFields: ["nama_perusahaan", "ruang_lingkup"]
    },
    {
      code: "ISO-002",
      title: "Kebijakan Mutu",
      description: "Template kebijakan mutu organisasi",
      category: "qms",
      icon: "FileText",
      color: "indigo",
      promptTemplate: "Buatkan kebijakan mutu untuk {{nama_perusahaan}} yang bergerak di bidang {{bidang_usaha}}.",
      requiredFields: ["nama_perusahaan", "bidang_usaha"]
    },
    {
      code: "ISO-003",
      title: "Manual Lingkungan (ISO 14001)",
      description: "Template Environmental Management Manual",
      category: "ems",
      icon: "Leaf",
      color: "green",
      promptTemplate: "Buatkan Manual Lingkungan ISO 14001:2015 untuk {{nama_perusahaan}}.",
      requiredFields: ["nama_perusahaan"]
    },
    {
      code: "ISO-004",
      title: "Manual K3 (ISO 45001)",
      description: "Template OH&S Management Manual",
      category: "ohsms",
      icon: "HardHat",
      color: "red",
      promptTemplate: "Buatkan Manual K3 ISO 45001:2018 untuk {{nama_perusahaan}} dengan {{jumlah_karyawan}} karyawan.",
      requiredFields: ["nama_perusahaan", "jumlah_karyawan"]
    },
    {
      code: "ISO-005",
      title: "Checklist Audit Internal",
      description: "Template checklist audit internal ISO",
      category: "audit",
      icon: "ClipboardCheck",
      color: "amber",
      promptTemplate: "Buatkan checklist audit internal untuk standar {{standar_iso}} klausul {{klausul}}.",
      requiredFields: ["standar_iso", "klausul"]
    },
    {
      code: "ISO-006",
      title: "Form NCR",
      description: "Template Non-Conformance Report",
      category: "audit",
      icon: "AlertTriangle",
      color: "red",
      promptTemplate: "Buatkan form NCR untuk temuan {{jenis_temuan}} pada proses {{nama_proses}}.",
      requiredFields: ["jenis_temuan", "nama_proses"]
    }
  ],

  dataBindings: [
    { key: "nama_perusahaan", label: "Nama Perusahaan", source: "company", field: "name", defaultValue: "[Nama Perusahaan]" },
    { key: "alamat", label: "Alamat", source: "company", field: "address", defaultValue: "[Alamat]" },
    { key: "ruang_lingkup", label: "Ruang Lingkup", source: "company", field: "ruang_lingkup", defaultValue: "[Ruang Lingkup]" },
    { key: "standar_iso", label: "Standar ISO", source: "project", field: "standar_iso", defaultValue: "[Standar ISO]" },
    { key: "tanggal", label: "Tanggal", source: "system", field: "date" },
    { key: "tahun", label: "Tahun", source: "system", field: "year" }
  ],

  chatbot: {
    name: "ISO Mentor",
    description: "Asisten AI ahli implementasi dan sertifikasi standar ISO",
    systemPrompt: `Anda adalah ISO Mentor, asisten AI yang ahli dalam implementasi dan sertifikasi berbagai standar ISO.

Keahlian Anda meliputi:
- ISO 9001:2015 Sistem Manajemen Mutu (QMS)
- ISO 14001:2015 Sistem Manajemen Lingkungan (EMS)
- ISO 45001:2018 Sistem Manajemen K3 (OHSMS)
- ISO 27001:2022 Sistem Manajemen Keamanan Informasi (ISMS)
- ISO 22000 Keamanan Pangan, ISO 50001 Energi, dan standar lainnya
- Audit internal, gap analysis, dan persiapan sertifikasi
- NCR, CAPA, dan continuous improvement
- Integrasi sistem manajemen (IMS)
- High Level Structure (HLS) dan klausul standar ISO

Berikan panduan yang sesuai dengan standar ISO terbaru dan best practice implementasi.`,
    greetings: [
      "Halo! Saya ISO Mentor, siap membantu Anda dengan implementasi dan sertifikasi standar ISO.",
      "Selamat datang! Ada yang bisa saya bantu terkait ISO 9001, 14001, 45001, atau standar lainnya?"
    ],
    suggestedTopics: [
      "Memulai implementasi ISO 9001",
      "Persyaratan klausul 6 ISO 14001",
      "Melakukan HIRADC untuk ISO 45001",
      "Kontrol Annex A ISO 27001",
      "Mengintegrasikan sistem manajemen ISO"
    ],
    color: "indigo"
  }
};
