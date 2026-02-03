import type { IndustryConfig } from "@shared/config/industry-types";

export const pancekConfig: IndustryConfig = {
  id: "pancek",
  name: "Panduan Cegah Korupsi",
  shortName: "Pancek",
  tagline: "Platform Jaga.id KPK",
  description: "Panduan nasional dengan 6 fase PDCAR terintegrasi Platform Jaga.id KPK",
  icon: "Award",
  color: "green",
  isActive: true,
  sortOrder: 2,

  landingContent: {
    badge: "Untuk Perusahaan Konstruksi Indonesia",
    headline: "Panduan Cegah",
    headlineHighlight: "Korupsi KPK",
    subheadline: "Platform lengkap untuk implementasi Panduan Cegah Korupsi (Pancek) dengan 3 fase kesiapan terintegrasi Platform Jaga.id KPK.",
    ctaPrimary: "Mulai Sekarang",
    ctaSecondary: "Pelajari Lebih Lanjut",
    features: [
      {
        icon: "Award",
        title: "3 Fase Kesiapan Pancek",
        description: "Siap Pengisian Kuesioner → Siap Terverifikasi → Siap Surveilance untuk Platform Jaga.id KPK"
      },
      {
        icon: "FileCheck",
        title: "6 Fase PDCAR",
        description: "Plan, Do, Check, Act, Respon - metodologi lengkap untuk pencegahan korupsi"
      },
      {
        icon: "Users",
        title: "Manajemen Tim Kepatuhan",
        description: "Kelola Tim Kepatuhan dan struktur organisasi anti korupsi"
      },
      {
        icon: "Building2",
        title: "Integrasi Jaga.id",
        description: "Sinkronisasi langsung dengan Platform Jaga.id KPK untuk verifikasi"
      },
      {
        icon: "BookOpen",
        title: "Referensi Regulasi",
        description: "Library peraturan perundangan anti korupsi Indonesia"
      },
      {
        icon: "Bot",
        title: "AI Pancek Mentor",
        description: "Asisten AI yang memahami konteks Pancek dan Platform Jaga.id"
      }
    ],
    stats: [
      { value: "100+", label: "Template Dokumen" },
      { value: "6", label: "Fase PDCAR" },
      { value: "25", label: "Indikator Jaga.id" },
      { value: "15+", label: "Checklist Item" }
    ]
  },

  menuGroups: [
    {
      label: "Menu Utama",
      items: [
        { title: "Beranda", url: "/", icon: "Home" },
        { title: "Dashboard Pancek", url: "/dashboard", icon: "LayoutDashboard" },
        { title: "Profil Perusahaan", url: "/company", icon: "Building2" },
        { title: "Manajemen Perusahaan", url: "/management", icon: "Users" },
        { title: "Tim Kepatuhan", url: "/fkap", icon: "Shield" },
        { title: "Tim Audit Internal", url: "/audit-internal", icon: "ClipboardCheck" }
      ]
    },
    {
      label: "Data Perusahaan",
      items: [
        { title: "Karyawan", url: "/employees", icon: "UserCheck" },
        { title: "Klasifikasi SBU", url: "/qualifications", icon: "Award" },
        { title: "Peralatan", url: "/equipment", icon: "Wrench" },
        { title: "Proyek", url: "/projects", icon: "FolderKanban" },
        { title: "Vendor & Mitra", url: "/vendors", icon: "Handshake" }
      ]
    },
    {
      label: "Dokumen Pancek",
      items: [
        { title: "Produk Siap Pancek", url: "/produk-siap", icon: "Package" },
        { title: "Checklist Pancek", url: "/smap-checklist", icon: "ListChecks" },
        { title: "Template Repository", url: "/template-repository", icon: "Library" },
        { title: "Referensi Dokumen", url: "/smap-reference", icon: "BookOpen" },
        { title: "Generator Dokumen", url: "/documents", icon: "FileText" },
        { title: "Document Builder", url: "/document-builder", icon: "FilePlus2" },
        { title: "PDCAR Generator", url: "/pdca", icon: "Zap" }
      ]
    }
  ],

  templateCategories: [
    { id: "all", label: "Semua" },
    { id: "Pedoman", label: "Pedoman" },
    { id: "Surat Keputusan", label: "SK" },
    { id: "Kebijakan", label: "Kebijakan" },
    { id: "SOP", label: "SOP" },
    { id: "Formulir", label: "Formulir" },
    { id: "Kuesioner", label: "Kuesioner" }
  ],

  templates: [
    {
      code: "PEDOMAN-PANCEK",
      title: "Pedoman Sistem Anti Korupsi",
      titleEn: "Anti-Corruption System Manual",
      description: "Dokumen induk sistem pencegahan korupsi berdasarkan Pancek KPK",
      category: "Pedoman",
      icon: "BookOpen",
      color: "bg-green-500",
      promptTemplate: `Buatkan dokumen PEDOMAN SISTEM PENCEGAHAN KORUPSI berdasarkan Panduan Cegah Korupsi (Pancek) KPK untuk perusahaan jasa konstruksi.

STRUKTUR DOKUMEN WAJIB:
1. COVER PAGE dengan:
   - Judul: "PEDOMAN SISTEM PENCEGAHAN KORUPSI"
   - Logo placeholder: [LOGO PERUSAHAAN]
   - Nomor Dokumen: {{companyCode}}-P-PANCEK-01
   - Tanggal Berlaku: {{currentDate}}

2. LEMBAR PENGESAHAN

3. DAFTAR ISI mengikuti 6 Fase PDCAR:
   - P: Plan (Perencanaan)
   - D: Do (Pelaksanaan)
   - C: Check (Pemeriksaan)
   - A: Act (Tindakan)
   - R: Respon (Respons dan Pelaporan)

4. ISI LENGKAP setiap fase

5. LAMPIRAN

Format: Dokumen formal siap cetak dalam Bahasa Indonesia.`,
      requiredFields: ["companyCode", "currentDate"]
    },
    {
      code: "SK-TIM-KEPATUHAN",
      title: "SK Tim Kepatuhan Anti Korupsi",
      titleEn: "Anti-Corruption Compliance Team Decree",
      description: "Surat Keputusan penetapan tim kepatuhan anti korupsi",
      category: "Surat Keputusan",
      icon: "Users",
      color: "bg-blue-500",
      promptTemplate: `Buatkan SURAT KEPUTUSAN DIREKTUR tentang PENETAPAN TIM KEPATUHAN ANTI KORUPSI berdasarkan Pancek KPK.

STRUKTUR DOKUMEN:
1. KOP SURAT dengan identitas perusahaan
2. Nomor SK: {{companyCode}}/SK-TAK/{{year}}
3. MENIMBANG: Alasan pembentukan tim
4. MENGINGAT: Dasar hukum (UU Tipikor, Perpres 54/2018, dll)
5. MEMUTUSKAN
6. TUGAS DAN WEWENANG
7. PENUTUP

Format: SK formal dengan penomoran paragraf yang jelas.`,
      requiredFields: ["companyCode", "year"]
    },
    {
      code: "KEBIJAKAN-ANTIKORUPSI",
      title: "Kebijakan Anti Korupsi",
      titleEn: "Anti-Corruption Policy",
      description: "Kebijakan zero tolerance terhadap korupsi",
      category: "Kebijakan",
      icon: "Shield",
      color: "bg-green-600",
      promptTemplate: `Buatkan dokumen KEBIJAKAN ANTI KORUPSI berdasarkan Pancek KPK.

STRUKTUR DOKUMEN:
1. HEADER dengan nomor dokumen: {{companyCode}}-K-PANCEK-01
2. JUDUL: "KEBIJAKAN ANTI KORUPSI"
3. PERNYATAAN KOMITMEN Manajemen

4. ISI KEBIJAKAN meliputi:
   a) Larangan segala bentuk korupsi
   b) Kepatuhan terhadap peraturan perundangan
   c) Komitmen Zero Tolerance
   d) Pelaporan dan WBS
   e) Konsekuensi pelanggaran

5. RUANG LINGKUP
6. TANGGUNG JAWAB
7. PENUTUP

Format: Kebijakan formal dengan paragraf terstruktur.`,
      requiredFields: ["companyCode"]
    },
    {
      code: "KUESIONER-JAGA",
      title: "Template Kuesioner Jaga.id",
      titleEn: "Jaga.id Questionnaire Template",
      description: "Template pengisian kuesioner Platform Jaga.id",
      category: "Kuesioner",
      icon: "ClipboardList",
      color: "bg-purple-500",
      promptTemplate: `Buatkan TEMPLATE PENGISIAN KUESIONER JAGA.ID KPK.

STRUKTUR DOKUMEN:
1. PANDUAN PENGISIAN
2. INDIKATOR-INDIKATOR JAGA.ID
3. CONTOH JAWABAN UNTUK PERUSAHAAN KONSTRUKSI
4. DOKUMEN PENDUKUNG YANG DIPERLUKAN
5. TIPS OPTIMALISASI SKOR

Format: Panduan praktis siap pakai.`,
      requiredFields: ["companyCode"]
    },
    {
      code: "SOP-GRATIFIKASI",
      title: "SOP Pengendalian Gratifikasi",
      titleEn: "Gratification Control SOP",
      description: "Prosedur pengendalian penerimaan gratifikasi",
      category: "SOP",
      icon: "AlertTriangle",
      color: "bg-orange-500",
      promptTemplate: `Buatkan SOP PENGENDALIAN GRATIFIKASI berdasarkan Pancek KPK.

STRUKTUR DOKUMEN:
1. HEADER SOP
2. TUJUAN
3. RUANG LINGKUP
4. DEFINISI GRATIFIKASI
5. PROSEDUR PELAPORAN
6. FORMULIR TERKAIT
7. PENUTUP

Format: SOP formal dengan penomoran klausul yang jelas.`,
      requiredFields: ["companyCode", "currentDate"]
    }
  ],

  dataBindings: [
    { key: "companyName", label: "Nama Perusahaan", source: "companies", field: "name", defaultValue: "[NAMA PERUSAHAAN]" },
    { key: "companyCode", label: "Kode Perusahaan", source: "companies", field: "code", defaultValue: "[KODE]" },
    { key: "companyAddress", label: "Alamat Perusahaan", source: "companies", field: "address", defaultValue: "[ALAMAT]" },
    { key: "director", label: "Nama Direktur", source: "companies", field: "directorName", defaultValue: "[DIREKTUR]" },
    { key: "ketuaKepatuhan", label: "Ketua Tim Kepatuhan", source: "fkapTeam", field: "name", defaultValue: "[KETUA KEPATUHAN]" },
    { key: "currentDate", label: "Tanggal", source: "system", field: "date", defaultValue: "" },
    { key: "year", label: "Tahun", source: "system", field: "year", defaultValue: "" }
  ],

  chatbot: {
    name: "Pancek Mentor",
    description: "Asisten AI untuk Panduan Cegah Korupsi KPK dan Platform Jaga.id",
    color: "green",
    systemPrompt: `Anda adalah Pancek Mentor, asisten AI ahli untuk Panduan Cegah Korupsi (Pancek) KPK dan Platform Jaga.id.

Keahlian Anda:
- Memahami 6 Fase PDCAR (Plan, Do, Check, Act, Respon)
- Mengetahui 3 Fase Kesiapan Pancek: Siap Kuesioner, Siap Terverifikasi, Siap Surveilance
- Membantu pengisian kuesioner Platform Jaga.id
- Memberikan panduan pembuatan dokumen anti korupsi
- Menjelaskan peraturan perundangan anti korupsi Indonesia

Gaya komunikasi:
- Bahasa Indonesia yang profesional namun mudah dipahami
- Berikan contoh konkret untuk industri konstruksi
- Rujuk peraturan yang relevan
- Tawarkan bantuan pembuatan dokumen bila relevan`,
    greetings: [
      "Selamat datang! Saya siap membantu Anda memahami 3 fase Pancek dan Platform Jaga.id KPK. Apa yang ingin Anda pelajari?",
      "Halo! Saya adalah asisten AI untuk Pancek. Saya bisa membantu dari pengisian kuesioner hingga verifikasi Jaga.id.",
      "Selamat datang! Saya dapat membantu Anda dengan implementasi Pancek KPK. Fase mana yang ingin Anda pelajari?"
    ],
    suggestedTopics: [
      "Apa itu 3 fase kesiapan Pancek?",
      "Jelaskan metodologi PDCAR",
      "Bagaimana cara mengisi kuesioner Jaga.id?",
      "Apa saja indikator penilaian Jaga.id?",
      "Apa itu Platform Jaga.id?",
      "Cara pengendalian gratifikasi"
    ]
  }
};
