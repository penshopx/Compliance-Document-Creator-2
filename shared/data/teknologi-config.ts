import type { IndustryConfig } from "@shared/config/industry-types";

export const teknologiConfig: IndustryConfig = {
  id: "teknologi",
  name: "Teknologi & Startup",
  shortName: "Teknologi",
  tagline: "PSE, ISO 27001, GDPR",
  description: "Platform lengkap untuk manajemen dokumen kepatuhan, keamanan data, dan regulasi perusahaan teknologi",
  icon: "Laptop",
  color: "cyan",
  isActive: true,
  sortOrder: 14,

  landingContent: {
    badge: "Untuk Perusahaan Teknologi Indonesia",
    headline: "Kepatuhan &",
    headlineHighlight: "Regulasi Teknologi",
    subheadline: "Platform terintegrasi untuk PSE Kominfo, perlindungan data pribadi, ISO 27001, dan dokumen legal startup dengan AI-powered document generation.",
    ctaPrimary: "Mulai Sekarang",
    ctaSecondary: "Pelajari Lebih Lanjut",
    features: [
      { icon: "Shield", title: "Registrasi PSE", description: "Kelola pendaftaran dan kepatuhan Penyelenggara Sistem Elektronik Kominfo" },
      { icon: "Lock", title: "Perlindungan Data", description: "Dokumentasi kepatuhan UU PDP dan standar privasi data" },
      { icon: "FileCheck", title: "ISO 27001", description: "Persiapan dan dokumentasi sertifikasi keamanan informasi" },
      { icon: "FileText", title: "70+ Template Dokumen", description: "Template legal, kebijakan, dan dokumen teknis startup" },
      { icon: "Sparkles", title: "AI Document Generator", description: "Generate dokumen legal, SOP, dan kebijakan dengan AI" },
      { icon: "Bell", title: "Compliance Tracking", description: "Monitor kepatuhan regulasi dengan notifikasi otomatis" }
    ],
    stats: [
      { value: "70+", label: "Template Dokumen" },
      { value: "UU PDP", label: "Compliant" },
      { value: "24/7", label: "AI Assistant" },
      { value: "ISO 27001", label: "Ready" }
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
      label: "Regulasi",
      items: [
        { title: "PSE Kominfo", url: "/pse", icon: "Globe" },
        { title: "UU PDP", url: "/pdp", icon: "Lock" },
        { title: "ISO 27001", url: "/iso27001", icon: "Shield" },
        { title: "Compliance Status", url: "/compliance", icon: "CheckCircle" }
      ]
    },
    {
      label: "Legal",
      items: [
        { title: "Terms of Service", url: "/tos", icon: "FileText" },
        { title: "Privacy Policy", url: "/privacy", icon: "Lock" },
        { title: "Perjanjian Kerja", url: "/kontrak", icon: "FileSignature" },
        { title: "NDA & Agreements", url: "/nda", icon: "Handshake" }
      ]
    },
    {
      label: "Dokumen",
      items: [
        { title: "Template Dokumen", url: "/templates", icon: "FileText" },
        { title: "SOP Teknis", url: "/sop", icon: "ClipboardList" },
        { title: "Dokumentasi API", url: "/api-docs", icon: "FileSearch" },
        { title: "AI Generator", url: "/generator", icon: "Sparkles" }
      ]
    }
  ],

  templateCategories: [
    { id: "all", label: "Semua" },
    { id: "regulasi", label: "Regulasi" },
    { id: "legal", label: "Legal" },
    { id: "keamanan", label: "Keamanan" },
    { id: "sop", label: "SOP" },
    { id: "startup", label: "Startup" }
  ],

  templates: [
    {
      code: "TECH-001",
      title: "Kebijakan Privasi (Privacy Policy)",
      description: "Template privacy policy sesuai UU PDP Indonesia",
      category: "legal",
      icon: "Lock",
      color: "blue",
      promptTemplate: "Buatkan kebijakan privasi untuk aplikasi/website {{nama_produk}} yang sesuai dengan UU PDP Indonesia.",
      requiredFields: ["nama_produk"]
    },
    {
      code: "TECH-002",
      title: "Terms of Service",
      description: "Template syarat dan ketentuan layanan",
      category: "legal",
      icon: "FileText",
      color: "green",
      promptTemplate: "Buatkan terms of service untuk platform {{nama_platform}} dengan fitur {{fitur_utama}}.",
      requiredFields: ["nama_platform", "fitur_utama"]
    },
    {
      code: "TECH-003",
      title: "Formulir Pendaftaran PSE",
      description: "Template dokumen pendaftaran PSE Kominfo",
      category: "regulasi",
      icon: "Globe",
      color: "cyan",
      promptTemplate: "Buatkan dokumen pendukung pendaftaran PSE untuk sistem elektronik {{nama_sistem}} dengan scope {{scope}}.",
      requiredFields: ["nama_sistem", "scope"]
    },
    {
      code: "TECH-004",
      title: "Kebijakan Keamanan Informasi",
      description: "Template information security policy ISO 27001",
      category: "keamanan",
      icon: "Shield",
      color: "purple",
      promptTemplate: "Buatkan kebijakan keamanan informasi untuk {{nama_perusahaan}} sesuai standar ISO 27001.",
      requiredFields: ["nama_perusahaan"]
    },
    {
      code: "TECH-005",
      title: "NDA (Non-Disclosure Agreement)",
      description: "Template perjanjian kerahasiaan",
      category: "legal",
      icon: "Handshake",
      color: "amber",
      promptTemplate: "Buatkan NDA bilateral antara {{pihak_1}} dan {{pihak_2}} untuk proyek {{nama_proyek}}.",
      requiredFields: ["pihak_1", "pihak_2", "nama_proyek"]
    }
  ],

  dataBindings: [
    { key: "nama_perusahaan", label: "Nama Perusahaan", source: "company", field: "name", defaultValue: "[Nama Perusahaan]" },
    { key: "alamat", label: "Alamat", source: "company", field: "address", defaultValue: "[Alamat]" },
    { key: "website", label: "Website", source: "company", field: "website", defaultValue: "[Website]" },
    { key: "email", label: "Email", source: "company", field: "email", defaultValue: "[Email]" },
    { key: "tanggal", label: "Tanggal", source: "system", field: "date" },
    { key: "tahun", label: "Tahun", source: "system", field: "year" }
  ],

  chatbot: {
    name: "Tech Mentor",
    description: "Asisten AI ahli kepatuhan dan regulasi teknologi Indonesia",
    systemPrompt: `Anda adalah Tech Mentor, asisten AI yang ahli dalam bidang kepatuhan dan regulasi perusahaan teknologi di Indonesia.

Keahlian Anda meliputi:
- Pendaftaran dan kepatuhan PSE Kominfo
- UU Perlindungan Data Pribadi (UU PDP)
- ISO 27001 dan keamanan informasi
- Dokumen legal startup (ToS, Privacy Policy, NDA)
- Regulasi fintech dan e-commerce
- GDPR untuk ekspansi internasional
- Best practices pengembangan software

Berikan panduan yang jelas, akurat, dan sesuai regulasi teknologi Indonesia.`,
    greetings: [
      "Halo! Saya Tech Mentor, siap membantu Anda dengan kepatuhan regulasi teknologi.",
      "Selamat datang! Ada yang bisa saya bantu terkait PSE, UU PDP, atau dokumen legal startup?"
    ],
    suggestedTopics: [
      "Cara mendaftar PSE Kominfo",
      "Kepatuhan UU PDP",
      "Membuat Privacy Policy",
      "Persiapan ISO 27001",
      "Template NDA untuk startup"
    ],
    color: "cyan"
  }
};
