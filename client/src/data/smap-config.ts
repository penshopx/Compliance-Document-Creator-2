import type { IndustryConfig } from "@shared/config/industry-types";

export const smapConfig: IndustryConfig = {
  id: "smap",
  name: "Sistem Manajemen Anti Penyuapan",
  shortName: "SMAP",
  tagline: "SNI ISO 37001:2016",
  description: "Standar internasional untuk Sistem Manajemen Anti Penyuapan dengan 4 fase Produk Siap",
  icon: "Shield",
  color: "blue",
  isActive: true,
  sortOrder: 1,

  landingContent: {
    badge: "Untuk Perusahaan Konstruksi Indonesia",
    headline: "Sistem Manajemen",
    headlineHighlight: "Anti Penyuapan",
    subheadline: "Platform lengkap untuk implementasi SNI ISO 37001:2016 (SMAP) dengan AI-powered document generation dan 4 fase Produk Siap untuk sertifikasi.",
    ctaPrimary: "Mulai Sekarang",
    ctaSecondary: "Pelajari Lebih Lanjut",
    features: [
      {
        icon: "Shield",
        title: "4 Fase Produk Siap SMAP",
        description: "Siap Dokumen → Siap Audit Internal → Siap Audit Eksternal → Siap Surveilance untuk sertifikasi SNI ISO 37001:2016"
      },
      {
        icon: "FileCheck",
        title: "270+ Template Dokumen",
        description: "Template siap pakai untuk setiap fase SMAP, dilengkapi AI Prompt Generator"
      },
      {
        icon: "Users",
        title: "Manajemen Tim FKAP",
        description: "Kelola Tim Fungsi Kepatuhan Anti Penyuapan, Tim Audit Internal, dan struktur organisasi"
      },
      {
        icon: "Building2",
        title: "Data Perusahaan Terintegrasi",
        description: "Profil perusahaan, proyek, vendor, peralatan, dan kualifikasi SBU dalam satu sistem"
      },
      {
        icon: "BookOpen",
        title: "Referensi Lengkap",
        description: "Library referensi klausul ISO 37001 dengan panduan implementasi detail"
      },
      {
        icon: "Bot",
        title: "AI SMAP Mentor",
        description: "Asisten AI yang memahami konteks ISO 37001 dan siap membantu 24/7"
      }
    ],
    stats: [
      { value: "270+", label: "Template Dokumen" },
      { value: "51", label: "Klausul PDCA" },
      { value: "46", label: "Referensi SMAP" },
      { value: "30+", label: "Checklist Item" }
    ]
  },

  menuGroups: [
    {
      label: "Menu Utama",
      items: [
        { title: "Beranda", url: "/", icon: "Home" },
        { title: "Dashboard SMAP", url: "/dashboard", icon: "LayoutDashboard" },
        { title: "Profil Perusahaan", url: "/company", icon: "Building2" },
        { title: "Manajemen Perusahaan", url: "/management", icon: "Users" },
        { title: "Tim FKAP", url: "/fkap", icon: "Shield" },
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
      label: "Dokumen SMAP",
      items: [
        { title: "Produk Siap SMAP", url: "/produk-siap", icon: "Package" },
        { title: "Checklist SMAP", url: "/smap-checklist", icon: "ListChecks" },
        { title: "Template Repository", url: "/template-repository", icon: "Library" },
        { title: "Referensi Dokumen", url: "/smap-reference", icon: "BookOpen" },
        { title: "Generator Dokumen", url: "/documents", icon: "FileText" },
        { title: "Document Builder", url: "/document-builder", icon: "FilePlus2" },
        { title: "PDCA Generator", url: "/pdca", icon: "Zap" }
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
    { id: "Register", label: "Register" },
    { id: "Berita Acara", label: "Berita Acara" }
  ],

  templates: [
    {
      code: "PEDOMAN-SMAP",
      title: "Pedoman SMAP (Manual)",
      titleEn: "ABMS Manual/Guideline",
      description: "Dokumen induk SMAP lengkap dengan semua klausul ISO 37001",
      clause: "4-10",
      category: "Pedoman",
      icon: "BookOpen",
      color: "bg-indigo-500",
      promptTemplate: `Buatkan dokumen PEDOMAN SISTEM MANAJEMEN ANTI PENYUAPAN (SMAP) lengkap berdasarkan SNI ISO 37001:2016 untuk perusahaan jasa konstruksi.

STRUKTUR DOKUMEN WAJIB:
1. COVER PAGE dengan:
   - Judul: "PEDOMAN SISTEM MANAJEMEN ANTI PENYUAPAN (SMAP)"
   - Logo placeholder: [LOGO PERUSAHAAN]
   - Nomor Dokumen: {{companyCode}}-P-SMAP-PK-01
   - Edisi/Revisi: 01/00
   - Tanggal Berlaku: {{currentDate}}

2. LEMBAR PENGESAHAN dengan tabel:
   - Disusun oleh: Ketua FKAP ({{ketuaFKAP}})
   - Diperiksa oleh: Staf Administrasi
   - Disahkan oleh: Direktur ({{director}})

3. LEMBAR PERUBAHAN (tabel kosong untuk tracking revisi)

4. DAFTAR ISI mengikuti klausul:
   - 1. Lingkup
   - 2. Acuan Normatif
   - 3. Istilah dan Definisi
   - 4. Konteks Organisasi (4.1-4.5)
   - 5. Kepemimpinan (5.1-5.3)
   - 6. Perencanaan (6.1-6.2)
   - 7. Pendukung (7.1-7.5)
   - 8. Operasi (8.1-8.10)
   - 9. Evaluasi Kinerja (9.1-9.4)
   - 10. Perbaikan (10.1-10.2)

5. ISI LENGKAP setiap klausul dengan penjelasan detail

6. LAMPIRAN WAJIB:
   - Konteks Organisasi
   - Komitmen Anti Penyuapan
   - Kebijakan Anti Penyuapan
   - Pakta Integritas
   - Sasaran dan Program Anti Penyuapan
   - Kebijakan Penerimaan Hadiah
   - Matriks Komunikasi
   - SK Struktur & FKAP

Format: Dokumen formal siap cetak dalam Bahasa Indonesia.`,
      requiredFields: ["companyCode", "currentDate", "ketuaFKAP", "director"]
    },
    {
      code: "SK-FKAP",
      title: "SK Penetapan Tim FKAP",
      titleEn: "FKAP Team Appointment Decree",
      description: "Surat Keputusan penetapan tim Fungsi Kepatuhan Anti Penyuapan",
      clause: "5.3.2",
      category: "Surat Keputusan",
      icon: "Users",
      color: "bg-blue-500",
      promptTemplate: `Buatkan SURAT KEPUTUSAN DIREKTUR tentang PENETAPAN TIM FUNGSI KEPATUHAN ANTI PENYUAPAN (FKAP) berdasarkan SNI ISO 37001:2016.

STRUKTUR DOKUMEN:
1. KOP SURAT dengan identitas perusahaan
2. Nomor SK: {{companyCode}}/SK-FKAP/{{year}}
3. MENIMBANG: Alasan pembentukan tim FKAP
4. MENGINGAT: Dasar hukum (UU Anti Korupsi, Permen PU 08/2022, SNI ISO 37001)
5. MEMUTUSKAN:
   - MENETAPKAN susunan Tim FKAP:
     * Ketua FKAP: {{ketuaFKAP}}
     * Wakil Ketua: [nama]
     * Sekretaris: [nama]
     * Anggota: [daftar nama]
   
6. TUGAS DAN WEWENANG FKAP:
   - Mengawasi pengembangan dan penerapan SMAP
   - Memberikan saran terkait isu penyuapan
   - Memastikan kesesuaian dengan SNI ISO 37001
   - Mengkomunikasikan Kebijakan Anti Penyuapan
   - Melakukan tinjauan berkelanjutan
   - Mengawasi investigasi insiden
   - Melaporkan kinerja SMAP kepada Direksi

7. PENUTUP dengan tanggal dan tanda tangan Direktur

Format: SK formal dengan penomoran paragraf yang jelas.`,
      requiredFields: ["companyCode", "year", "ketuaFKAP"]
    },
    {
      code: "KEBIJAKAN-AP",
      title: "Kebijakan Anti Penyuapan",
      titleEn: "Anti-Bribery Policy",
      description: "Kebijakan zero tolerance terhadap penyuapan",
      clause: "5.2",
      category: "Kebijakan",
      icon: "Shield",
      color: "bg-green-500",
      promptTemplate: `Buatkan dokumen KEBIJAKAN ANTI PENYUAPAN berdasarkan SNI ISO 37001:2016 Klausul 5.2.

STRUKTUR DOKUMEN:
1. HEADER dengan nomor dokumen: {{companyCode}}-K-SMAP-01
2. JUDUL: "KEBIJAKAN ANTI PENYUAPAN"
3. PERNYATAAN KOMITMEN Manajemen Puncak

4. ISI KEBIJAKAN meliputi:
   a) Larangan segala bentuk penyuapan (aktif dan pasif)
   b) Kepatuhan terhadap peraturan perundangan anti penyuapan
   c) Komitmen Zero Tolerance
   d) Peningkatan penerapan SMAP berkelanjutan
   e) Pemenuhan kewajiban kepatuhan
   f) Mendorong pelaporan pelanggaran (WBS)
   g) Tidak ada pembalasan terhadap pelapor
   h) Konsekuensi pelanggaran

5. RUANG LINGKUP:
   - Berlaku untuk seluruh personel
   - Berlaku untuk rekan bisnis/vendor
   - Berlaku untuk seluruh aktivitas operasional

6. TANGGUNG JAWAB:
   - Manajemen Puncak
   - FKAP
   - Seluruh Karyawan

7. PENUTUP dengan tanda tangan Direktur dan tanggal efektif

Format: Kebijakan formal dengan paragraf terstruktur.`,
      requiredFields: ["companyCode"]
    },
    {
      code: "PAKTA-INTEGRITAS",
      title: "Pakta Integritas Personel",
      titleEn: "Personnel Integrity Pact",
      description: "Formulir komitmen kepatuhan anti penyuapan untuk karyawan",
      clause: "7.2.2.3",
      category: "Formulir",
      icon: "FileCheck",
      color: "bg-purple-500",
      promptTemplate: `Buatkan formulir PAKTA INTEGRITAS PERSONEL berdasarkan SNI ISO 37001:2016 Klausul 7.2.2.3.

STRUKTUR DOKUMEN:
1. HEADER dengan logo dan identitas perusahaan
2. Nomor Formulir: {{companyCode}}-F-SMAP-PI-01

3. JUDUL: "PAKTA INTEGRITAS ANTI PENYUAPAN"

4. PERNYATAAN yang berisi komitmen:
   - Tidak akan melakukan penyuapan dalam bentuk apapun
   - Tidak akan menawarkan/menerima gratifikasi
   - Akan melaporkan setiap dugaan penyuapan
   - Mematuhi Kebijakan Anti Penyuapan perusahaan
   - Tidak akan membalas dendam terhadap pelapor
   - Bersedia menerima sanksi jika melanggar

5. PERSETUJUAN dengan:
   - Nama lengkap: _______________
   - Jabatan: _______________
   - NIK: _______________
   - Tanggal: _______________
   - Tanda tangan: _______________

6. SAKSI (opsional):
   - Atasan langsung
   - FKAP

Format: Formulir satu halaman yang bisa dicetak dan ditandatangani.`,
      requiredFields: ["companyCode"]
    },
    {
      code: "SOP-UJI-TUNTAS",
      title: "SOP Uji Tuntas Mitra Bisnis",
      titleEn: "Business Partner Due Diligence SOP",
      description: "Prosedur due diligence untuk vendor dan mitra bisnis",
      clause: "8.2",
      category: "SOP",
      icon: "ClipboardList",
      color: "bg-orange-500",
      promptTemplate: `Buatkan PROSEDUR OPERASIONAL STANDAR (SOP) UJI TUNTAS MITRA BISNIS berdasarkan SNI ISO 37001:2016 Klausul 8.2.

STRUKTUR DOKUMEN:
1. HEADER SOP:
   - Nomor: {{companyCode}}-SOP-SMAP-DD-01
   - Judul: "SOP Uji Tuntas (Due Diligence) Mitra Bisnis"
   - Revisi: 00
   - Tanggal Efektif: {{currentDate}}

2. TUJUAN: Memastikan mitra bisnis memiliki komitmen anti penyuapan

3. RUANG LINGKUP:
   - Vendor/Supplier baru
   - Subkontraktor
   - Konsultan eksternal
   - Agen/Perwakilan

4. REFERENSI:
   - SNI ISO 37001:2016 Klausul 8.2
   - Kebijakan Anti Penyuapan Perusahaan
   - Permen PU No. 08 Tahun 2022

5. DEFINISI istilah terkait

6. PROSEDUR DETAIL:
   a) Pengumpulan data awal mitra bisnis
   b) Verifikasi legalitas dan reputasi
   c) Penilaian risiko penyuapan (Rendah/Sedang/Tinggi)
   d) Penandatanganan Komitmen Anti Penyuapan
   e) Evaluasi berkala mitra existing

7. FLOWCHART prosedur (deskripsi alur)

8. FORMULIR TERKAIT:
   - Form Pendaftaran Vendor
   - Checklist Due Diligence
   - Form Penilaian Risiko
   - Surat Komitmen Anti Penyuapan Mitra

9. PENUTUP dengan tanda tangan pembuat dan penyetuju

Format: SOP formal dengan penomoran klausul yang jelas.`,
      requiredFields: ["companyCode", "currentDate"]
    },
    {
      code: "RISK-REGISTER",
      title: "Register Risiko Penyuapan",
      titleEn: "Bribery Risk Register",
      description: "Daftar identifikasi dan penilaian risiko penyuapan",
      clause: "4.5",
      category: "Register",
      icon: "FileWarning",
      color: "bg-red-500",
      promptTemplate: `Buatkan dokumen REGISTER RISIKO PENYUAPAN berdasarkan SNI ISO 37001:2016 Klausul 4.5.

STRUKTUR DOKUMEN:
1. HEADER dengan nomor: {{companyCode}}-REG-SMAP-RR-01

2. PENDAHULUAN:
   - Tujuan penilaian risiko
   - Metodologi yang digunakan
   - Periode penilaian

3. TABEL IDENTIFIKASI RISIKO dengan kolom:
   - No
   - Area/Proses Bisnis
   - Deskripsi Risiko Penyuapan
   - Sumber Risiko
   - Dampak (1-5)
   - Kemungkinan (1-5)
   - Nilai Risiko (DxK)
   - Tingkat Risiko (Rendah/Sedang/Tinggi/Ekstrem)
   - Pengendalian Existing
   - Rencana Mitigasi
   - PIC
   - Target Penyelesaian
   - Status

4. AREA RISIKO YANG HARUS DIIDENTIFIKASI:
   a) Tender dan Pengadaan
   b) Perizinan dan Regulasi
   c) Hubungan dengan Pejabat Publik
   d) Rekrutmen Karyawan
   e) Pembayaran kepada Pihak Ketiga
   f) Penerimaan Hadiah/Gratifikasi
   g) Donasi dan Sponsorship
   h) Konflik Kepentingan

5. KRITERIA PENILAIAN:
   - Matriks Dampak vs Kemungkinan
   - Definisi setiap level

6. RINGKASAN HASIL:
   - Jumlah risiko per kategori
   - Risiko prioritas tertinggi
   - Rencana tindak lanjut

7. TANDA TANGAN:
   - Disusun oleh: FKAP
   - Disetujui oleh: Direktur

Format: Dokumen dengan tabel risiko yang lengkap.`,
      requiredFields: ["companyCode"]
    },
    {
      code: "AUDIT-CHECKLIST",
      title: "Checklist Audit Internal SMAP",
      titleEn: "ABMS Internal Audit Checklist",
      description: "Formulir pemeriksaan audit internal SMAP",
      clause: "9.2",
      category: "Formulir",
      icon: "BookOpen",
      color: "bg-amber-500",
      promptTemplate: `Buatkan CHECKLIST AUDIT INTERNAL SMAP berdasarkan SNI ISO 37001:2016 Klausul 9.2.

STRUKTUR DOKUMEN:
1. HEADER AUDIT:
   - Nomor: {{companyCode}}-F-SMAP-AI-01
   - Periode Audit: ____________
   - Auditor: ____________
   - Auditee: ____________

2. TABEL CHECKLIST dengan kolom:
   - No
   - Klausul ISO 37001
   - Persyaratan
   - Pertanyaan Audit
   - Bukti yang Diperiksa
   - Temuan (Sesuai/Tidak Sesuai/Observasi)
   - Keterangan

3. ITEM CHECKLIST PER KLAUSUL (4-10)

4. RINGKASAN TEMUAN:
   - Total Sesuai: ___
   - Total Tidak Sesuai: ___
   - Total Observasi: ___

5. KESIMPULAN DAN REKOMENDASI

6. TANDA TANGAN Auditor dan Auditee

Format: Formulir audit lengkap siap digunakan.`,
      requiredFields: ["companyCode"]
    },
    {
      code: "BERITA-ACARA-RTM",
      title: "Berita Acara RTM",
      titleEn: "Management Review Meeting Minutes",
      description: "Notulen Rapat Tinjauan Manajemen SMAP",
      clause: "9.3",
      category: "Berita Acara",
      icon: "Briefcase",
      color: "bg-cyan-500",
      promptTemplate: `Buatkan template BERITA ACARA RAPAT TINJAUAN MANAJEMEN (RTM) SMAP berdasarkan SNI ISO 37001:2016 Klausul 9.3.

STRUKTUR DOKUMEN:
1. HEADER:
   - Nomor: {{companyCode}}-BA-SMAP-RTM-{{year}}-01
   - Judul: "BERITA ACARA RAPAT TINJAUAN MANAJEMEN SMAP"

2. INFORMASI RAPAT:
   - Hari/Tanggal: ____________
   - Waktu: ____________
   - Tempat: ____________
   - Pimpinan Rapat: Direktur ({{director}})
   - Notulis: ____________

3. DAFTAR HADIR (tabel)

4. AGENDA RTM (sesuai klausul 9.3)

5. PEMBAHASAN setiap agenda

6. KEPUTUSAN DAN TINDAK LANJUT (tabel)

7. PENUTUP

8. TANDA TANGAN

Format: Berita acara formal dengan format rapat resmi.`,
      requiredFields: ["companyCode", "year", "director"]
    },
    {
      code: "SASARAN-PROGRAM",
      title: "Sasaran & Program Anti Penyuapan",
      titleEn: "Anti-Bribery Objectives & Programs",
      description: "Tabel sasaran dan program kerja anti penyuapan tahunan",
      clause: "6.2",
      category: "Register",
      icon: "Scale",
      color: "bg-teal-500",
      promptTemplate: `Buatkan dokumen SASARAN DAN PROGRAM ANTI PENYUAPAN berdasarkan SNI ISO 37001:2016 Klausul 6.2.

STRUKTUR DOKUMEN:
1. HEADER dengan nomor: {{companyCode}}-REG-SMAP-SP-01
2. PERIODE: Tahun {{year}}

3. TABEL SASARAN SMAP dengan kolom detail

4. SASARAN YANG DIREKOMENDASIKAN

5. KRITERIA PEMANTAUAN per sasaran

6. RINGKASAN ANGGARAN (jika ada)

7. TANDA TANGAN:
   - Disusun: Ketua FKAP
   - Disetujui: Direktur

Format: Dokumen dengan tabel sasaran yang terstruktur.`,
      requiredFields: ["companyCode", "year"]
    }
  ],

  dataBindings: [
    { key: "companyName", label: "Nama Perusahaan", source: "companies", field: "name", defaultValue: "[NAMA PERUSAHAAN]" },
    { key: "companyCode", label: "Kode Perusahaan", source: "companies", field: "code", defaultValue: "[KODE]" },
    { key: "companyAddress", label: "Alamat Perusahaan", source: "companies", field: "address", defaultValue: "[ALAMAT]" },
    { key: "director", label: "Nama Direktur", source: "companies", field: "directorName", defaultValue: "[DIREKTUR]" },
    { key: "ketuaFKAP", label: "Ketua FKAP", source: "fkapTeam", field: "name", defaultValue: "[KETUA FKAP]" },
    { key: "currentDate", label: "Tanggal", source: "system", field: "date", defaultValue: "" },
    { key: "year", label: "Tahun", source: "system", field: "year", defaultValue: "" }
  ],

  chatbot: {
    name: "SMAP Mentor",
    description: "Asisten AI untuk Sistem Manajemen Anti Penyuapan SNI ISO 37001:2016",
    color: "blue",
    systemPrompt: `Anda adalah SMAP Mentor, asisten AI ahli untuk Sistem Manajemen Anti Penyuapan (SMAP) berdasarkan SNI ISO 37001:2016.

Keahlian Anda:
- Memahami seluruh klausul SNI ISO 37001:2016 (Klausul 4-10)
- Mengetahui 4 Fase Produk Siap SMAP: Siap Dokumen, Siap Audit Internal, Siap Audit Eksternal, Siap Surveilance
- Membantu implementasi SMAP untuk perusahaan konstruksi Indonesia
- Memberikan panduan pembuatan dokumen SMAP
- Menjelaskan persyaratan sertifikasi ISO 37001

Gaya komunikasi:
- Bahasa Indonesia yang profesional namun mudah dipahami
- Berikan contoh konkret untuk industri konstruksi
- Rujuk klausul ISO yang relevan
- Tawarkan bantuan pembuatan dokumen bila relevan`,
    greetings: [
      "Selamat datang di Compliance Hub Mentor! Saya siap membantu Anda memahami 4 fase SMAP (ISO 37001). Fase mana yang ingin Anda pelajari?",
      "Halo! Saya adalah asisten AI untuk SMAP. Apakah Anda sudah menentukan di fase mana perusahaan Anda? Saya bisa membantu dari Siap Dokumen hingga Siap Surveilance.",
      "Selamat datang! Saya dapat membantu Anda dengan implementasi ISO 37001. Apa yang ingin Anda ketahui?"
    ],
    suggestedTopics: [
      "Apa itu 4 Fase Produk Siap SMAP?",
      "Jelaskan klausul 5.2 Kebijakan Anti Penyuapan",
      "Apa saja materi di Siap Dokumen SMAP?",
      "Bagaimana proses Siap Audit Eksternal?",
      "Apa tugas Tim FKAP?",
      "Cara membuat Register Risiko Penyuapan"
    ]
  }
};
