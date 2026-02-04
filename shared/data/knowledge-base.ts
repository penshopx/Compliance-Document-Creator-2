export interface KnowledgeArticle {
  id: string;
  title: string;
  category: "fitur" | "domain" | "industri" | "panduan" | "faq";
  subcategory?: string;
  content: string;
  keywords: string[];
  relatedArticles?: string[];
}

export interface ComplianceDomainKnowledge {
  id: string;
  name: string;
  shortName: string;
  description: string;
  scope: string;
  keyDocuments: string[];
  regulations: string[];
  tips: string[];
}

export interface IndustryKnowledge {
  id: string;
  name: string;
  description: string;
  mainRegulator: string;
  keyLicenses: string[];
  certifications: string[];
  complianceRequirements: string[];
}

export const COMPLIANCE_DOMAIN_KNOWLEDGE: ComplianceDomainKnowledge[] = [
  {
    id: "legalitas",
    name: "Legalitas",
    shortName: "Legal",
    description: "Domain Legalitas mencakup semua dokumen dasar hukum yang diperlukan untuk mendirikan dan mengoperasikan perusahaan secara legal di Indonesia.",
    scope: "Meliputi pendirian badan usaha, pendaftaran perizinan dasar, perpajakan, dan dokumen identitas perusahaan yang diakui secara hukum.",
    keyDocuments: [
      "Akta Pendirian Perusahaan - Dokumen notaris yang menyatakan pendirian badan usaha",
      "NIB (Nomor Induk Berusaha) - Identitas pelaku usaha melalui OSS (Online Single Submission)",
      "NPWP (Nomor Pokok Wajib Pajak) - Identitas wajib pajak untuk perusahaan",
      "TDP (Tanda Daftar Perusahaan) - Bukti pendaftaran perusahaan (sudah terintegrasi NIB)",
      "Surat Keterangan Domisili - Bukti lokasi usaha yang sah",
      "PKP (Pengusaha Kena Pajak) - Status perpajakan untuk pemungutan PPN"
    ],
    regulations: [
      "UU No. 40 Tahun 2007 tentang Perseroan Terbatas",
      "PP No. 24 Tahun 2018 tentang Pelayanan Perizinan Berusaha Terintegrasi Elektronik",
      "UU No. 11 Tahun 2020 tentang Cipta Kerja"
    ],
    tips: [
      "Pastikan akta pendirian sudah disahkan oleh Kemenkumham",
      "NIB adalah pintu gerbang untuk semua perizinan berusaha",
      "Perbarui data perusahaan di OSS secara berkala"
    ]
  },
  {
    id: "perijinan",
    name: "Perijinan",
    shortName: "Izin",
    description: "Domain Perijinan mencakup semua izin operasional dan sektoral yang diperlukan untuk menjalankan kegiatan usaha sesuai bidang industri.",
    scope: "Meliputi izin usaha sektoral, izin lokasi, izin operasional, dan izin khusus berdasarkan jenis kegiatan usaha.",
    keyDocuments: [
      "SBU (Sertifikat Badan Usaha) - Untuk bidang konstruksi dan jasa",
      "SIUP (Surat Izin Usaha Perdagangan) - Untuk kegiatan perdagangan",
      "IUPTL (Izin Usaha Penyediaan Tenaga Listrik) - Untuk sektor energi",
      "Izin Lingkungan - Untuk kegiatan yang berdampak lingkungan",
      "Izin Operasional - Izin untuk menjalankan kegiatan usaha",
      "Izin Lokasi - Izin penggunaan lahan untuk usaha"
    ],
    regulations: [
      "PP No. 5 Tahun 2021 tentang Penyelenggaraan Perizinan Berusaha Berbasis Risiko",
      "Permen terkait masing-masing sektor industri"
    ],
    tips: [
      "Identifikasi KBLI (Klasifikasi Baku Lapangan Usaha Indonesia) yang tepat",
      "Perhatikan tingkat risiko usaha (rendah, menengah, tinggi)",
      "Lengkapi persyaratan teknis sebelum mengajukan izin"
    ]
  },
  {
    id: "sertifikasi",
    name: "Sertifikasi",
    shortName: "Sertifikat",
    description: "Domain Sertifikasi mencakup standar nasional dan internasional yang menunjukkan kompetensi, kualitas, dan kepatuhan terhadap praktik terbaik.",
    scope: "Meliputi sertifikasi manajemen mutu, lingkungan, K3, anti-penyuapan, dan sertifikasi kompetensi profesional.",
    keyDocuments: [
      "ISO 9001 - Sistem Manajemen Mutu",
      "ISO 14001 - Sistem Manajemen Lingkungan",
      "ISO 45001 - Sistem Manajemen K3",
      "SNI ISO 37001 - Sistem Manajemen Anti Penyuapan (SMAP)",
      "SKK (Sertifikat Kompetensi Kerja) - Sertifikat tenaga ahli konstruksi",
      "SKTTK (Sertifikat Keterampilan Tenaga Teknik Ketenagalistrikan) - Untuk sektor energi",
      "Sertifikat Halal - Untuk produk makanan/minuman"
    ],
    regulations: [
      "UU No. 20 Tahun 2014 tentang Standardisasi dan Penilaian Kesesuaian",
      "Permen PU No. 08 Tahun 2022 tentang Tata Cara Pelaksanaan SMAP di Kementerian PUPR"
    ],
    tips: [
      "Pilih lembaga sertifikasi terakreditasi KAN (Komite Akreditasi Nasional)",
      "Siapkan dokumentasi sesuai klausul standar yang dituju",
      "Lakukan audit internal sebelum audit sertifikasi"
    ]
  },
  {
    id: "tender",
    name: "Tender",
    shortName: "Tender",
    description: "Domain Tender mencakup semua dokumen dan proses yang diperlukan untuk mengikuti pengadaan barang/jasa pemerintah maupun swasta.",
    scope: "Meliputi dokumen kualifikasi, penawaran teknis dan harga, kontrak, dan administrasi pengadaan.",
    keyDocuments: [
      "Dokumen Kualifikasi - Bukti kemampuan teknis dan administratif",
      "Proposal Teknis - Metode pelaksanaan dan pendekatan teknis",
      "RAB (Rencana Anggaran Biaya) - Perhitungan biaya penawaran",
      "Jaminan Penawaran - Garansi keseriusan peserta tender",
      "Kontrak/SPK - Dokumen perjanjian kerja",
      "TKDN (Tingkat Komponen Dalam Negeri) - Bukti penggunaan produk lokal"
    ],
    regulations: [
      "Perpres No. 16 Tahun 2018 tentang Pengadaan Barang/Jasa Pemerintah",
      "Perlem LKPP terkait e-Procurement"
    ],
    tips: [
      "Daftar di LPSE dan SIKAP untuk tender pemerintah",
      "Pastikan semua dokumen kualifikasi masih berlaku",
      "Perhatikan jadwal tahapan tender dengan cermat"
    ]
  },
  {
    id: "operasional",
    name: "Operasional/Produksi",
    shortName: "Operasional",
    description: "Domain Operasional mencakup dokumen kerja harian, prosedur standar, dan laporan yang mendukung kegiatan operasional perusahaan.",
    scope: "Meliputi SOP, instruksi kerja, formulir operasional, laporan berkala, dan dokumentasi quality control.",
    keyDocuments: [
      "SOP (Standard Operating Procedure) - Prosedur kerja standar",
      "Instruksi Kerja - Panduan detail pelaksanaan tugas",
      "Formulir Operasional - Format pencatatan kegiatan",
      "Laporan Harian/Mingguan/Bulanan - Dokumentasi progress",
      "Checklist QC - Pemeriksaan kualitas",
      "Laporan HSE - Dokumentasi keselamatan kerja",
      "Berita Acara - Dokumentasi kejadian/serah terima"
    ],
    regulations: [
      "Peraturan internal perusahaan",
      "Standar industri terkait",
      "Persyaratan kontrak/klien"
    ],
    tips: [
      "Dokumentasikan semua proses secara konsisten",
      "Gunakan template standar untuk efisiensi",
      "Review dan update SOP secara berkala"
    ]
  }
];

export const PLATFORM_FEATURES_KNOWLEDGE: KnowledgeArticle[] = [
  {
    id: "feature-dashboard",
    title: "Dashboard",
    category: "fitur",
    subcategory: "navigasi",
    content: `Dashboard adalah halaman utama yang menampilkan ringkasan status kepatuhan perusahaan Anda.

**Fitur Dashboard:**
- Ringkasan data perusahaan (pegawai, proyek, vendor, peralatan)
- Akses cepat ke 5 Domain Kepatuhan (Legalitas, Perijinan, Sertifikasi, Tender, Operasional)
- Status progress kepatuhan
- Quick links ke fitur-fitur utama

**Cara Menggunakan:**
1. Klik menu Dashboard di sidebar
2. Lihat ringkasan statistik perusahaan
3. Klik kartu domain untuk akses template terkait
4. Gunakan quick links untuk navigasi cepat`,
    keywords: ["dashboard", "beranda", "home", "ringkasan", "statistik"]
  },
  {
    id: "feature-template-repository",
    title: "Repository Template",
    category: "fitur",
    subcategory: "dokumen",
    content: `Repository Template adalah pusat koleksi template dokumen kepatuhan untuk berbagai industri.

**Fitur Repository:**
- 270+ template dokumen SMAP
- Template untuk 20 sektor industri
- Filter berdasarkan domain, klausul ISO, dan kategori
- Pencarian template dengan kata kunci
- Preview dan download template

**Cara Menggunakan:**
1. Buka menu Repository Template
2. Pilih industri yang relevan
3. Filter berdasarkan domain kepatuhan
4. Cari template dengan kata kunci
5. Klik template untuk melihat detail dan generate`,
    keywords: ["template", "repository", "koleksi", "dokumen", "download"]
  },
  {
    id: "feature-document-builder",
    title: "Document Builder (Generator Dokumen)",
    category: "fitur",
    subcategory: "dokumen",
    content: `Document Builder adalah fitur untuk membuat dokumen kepatuhan dengan bantuan AI.

**Fitur Document Builder:**
- 9 template profesional SMAP (Pedoman, Kebijakan, SOP, dll)
- Auto-populate dengan data perusahaan
- AI Prompt Generator untuk konten
- Export ke PDF dan Word
- Customization sesuai kebutuhan

**Cara Menggunakan:**
1. Pilih jenis dokumen yang ingin dibuat
2. Isi data perusahaan di bagian Company Profile
3. AI akan generate prompt/konten sesuai template
4. Edit dan sesuaikan konten
5. Export dalam format yang diinginkan`,
    keywords: ["document", "builder", "generator", "buat", "dokumen", "ai"]
  },
  {
    id: "feature-pdca-generator",
    title: "PDCA Generator",
    category: "fitur",
    subcategory: "dokumen",
    content: `PDCA Generator membantu menyusun dokumen berdasarkan siklus Plan-Do-Check-Act sesuai 51 klausul ISO 37001.

**Fitur PDCA Generator:**
- 51 klausul ISO 37001 terorganisir dalam 4 fase
- Plan: Perencanaan sistem anti penyuapan
- Do: Implementasi dan operasi
- Check: Pemantauan dan pengukuran
- Act: Perbaikan berkelanjutan
- AI-assisted content generation

**Cara Menggunakan:**
1. Pilih fase PDCA (Plan/Do/Check/Act)
2. Pilih klausul yang ingin dikerjakan
3. Isi narasi konteks perusahaan
4. Generate dokumen dengan bantuan AI
5. Copy atau export hasil generate`,
    keywords: ["pdca", "plan", "do", "check", "act", "klausul", "smap"]
  },
  {
    id: "feature-company-profile",
    title: "Profil Perusahaan",
    category: "fitur",
    subcategory: "data",
    content: `Profil Perusahaan adalah pusat data master perusahaan yang digunakan di seluruh platform.

**Data yang Dikelola:**
- Informasi dasar perusahaan (nama, alamat, NPWP)
- Tim Manajemen dan FKAP
- Data Pegawai dan Kualifikasi
- Peralatan dan Aset
- Proyek-proyek
- Data Vendor/Supplier

**Cara Menggunakan:**
1. Lengkapi data perusahaan di menu Company
2. Tambahkan data pegawai di menu Employees
3. Kelola kualifikasi di menu Qualifications
4. Data akan otomatis tersedia untuk document generation`,
    keywords: ["company", "perusahaan", "profil", "data", "master"]
  },
  {
    id: "feature-ai-chatbot",
    title: "AI Chatbot & Help Desk",
    category: "fitur",
    subcategory: "bantuan",
    content: `AI Chatbot adalah asisten virtual yang membantu menjawab pertanyaan tentang platform dan kepatuhan.

**Kemampuan Chatbot:**
- Menjawab pertanyaan tentang fitur platform
- Menjelaskan 5 domain kepatuhan
- Memberikan panduan penggunaan
- Informasi regulasi dan standar
- Tips praktis kepatuhan

**Cara Menggunakan:**
1. Klik ikon chatbot di pojok kanan bawah
2. Ketik pertanyaan Anda
3. AI akan memberikan jawaban yang relevan
4. Gunakan Knowledge Base untuk eksplorasi mandiri`,
    keywords: ["chatbot", "ai", "bantuan", "help", "tanya", "jawab"]
  },
  {
    id: "feature-knowledge-base",
    title: "Knowledge Base",
    category: "fitur",
    subcategory: "bantuan",
    content: `Knowledge Base adalah pusat informasi tentang kepatuhan dan regulasi Indonesia.

**Konten Knowledge Base:**
- Panduan 5 Domain Kepatuhan
- Informasi 20 Industri
- Regulasi dan Standar
- FAQ dan Tips Praktis
- Artikel Edukasi

**Cara Menggunakan:**
1. Buka menu Knowledge Base
2. Pilih kategori (Domain, Industri, Panduan)
3. Baca artikel yang relevan
4. Gunakan pencarian untuk topik spesifik`,
    keywords: ["knowledge", "base", "informasi", "artikel", "edukasi"]
  }
];

export const FAQ_KNOWLEDGE: KnowledgeArticle[] = [
  {
    id: "faq-start",
    title: "Bagaimana cara memulai menggunakan Compliance Hub?",
    category: "faq",
    content: `**Langkah Memulai:**
1. Login ke platform dengan akun Anda
2. Lengkapi profil perusahaan di menu Company
3. Pilih industri yang sesuai dengan usaha Anda
4. Eksplorasi template di Repository Template
5. Mulai generate dokumen yang dibutuhkan

**Tips:**
- Mulai dengan dokumen Legalitas dasar
- Gunakan AI Chatbot jika ada pertanyaan
- Baca Knowledge Base untuk pemahaman lebih dalam`,
    keywords: ["mulai", "start", "pertama", "cara", "langkah"]
  },
  {
    id: "faq-smap",
    title: "Apa itu SMAP dan siapa yang membutuhkannya?",
    category: "faq",
    content: `**SMAP (Sistem Manajemen Anti Penyuapan)** adalah sistem berdasarkan SNI ISO 37001:2016 untuk mencegah, mendeteksi, dan merespons penyuapan.

**Yang Membutuhkan SMAP:**
- Vendor/kontraktor Kementerian PUPR (wajib)
- Perusahaan yang ingin tender proyek pemerintah
- Organisasi yang ingin membuktikan komitmen anti korupsi
- BUMN dan anak perusahaan

**Manfaat SMAP:**
- Syarat wajib tender PUPR sejak 2022
- Meningkatkan reputasi perusahaan
- Mencegah risiko hukum
- Membangun budaya integritas`,
    keywords: ["smap", "anti", "penyuapan", "iso", "37001", "korupsi"]
  },
  {
    id: "faq-pancek",
    title: "Apa itu Pancek dan hubungannya dengan Jaga.id?",
    category: "faq",
    content: `**Pancek (Panduan Cegah Korupsi)** adalah program KPK untuk mendorong pelaku usaha menerapkan prinsip anti korupsi.

**Platform Jaga.id:**
- Platform digital KPK untuk verifikasi Pancek
- Pengisian kuesioner self-assessment
- Proses verifikasi oleh tim KPK
- Status terverifikasi sebagai bukti kepatuhan

**Tahapan Pancek:**
1. Pengisian Kuesioner di Jaga.id
2. Penyiapan Dokumen Bukti
3. Verifikasi oleh KPK
4. Pemeliharaan Status (Surveilance)

Compliance Hub membantu persiapan dokumen untuk proses Pancek.`,
    keywords: ["pancek", "jaga", "kpk", "korupsi", "verifikasi"]
  },
  {
    id: "faq-industry",
    title: "Industri apa saja yang didukung platform ini?",
    category: "faq",
    content: `Compliance Hub mendukung **20 industri** dengan template dan panduan spesifik:

**Industri yang Didukung:**
1. SMAP - Anti Penyuapan
2. Pancek - KPK
3. Konstruksi - SBU, SKK, NIB
4. Energi - IUPTL, SLO, SKTTK
5. Migas - KKKS, WP&B
6. Lingkungan - AMDAL, UKL-UPL
7. UMKM - NIB, IUMK
8. ISO - 9001, 14001, 45001
9. K3 - Keselamatan Kerja
10. Tender - Pengadaan
11. Keuangan - Akuntansi
12. Kesehatan - KARS, SNARS
13. Pendidikan - BAN-PT
14. Teknologi - PSE, PDP
15. Pertanian - Organik, GAP
16. Manufaktur - GMP
17. Properti - SHGB, PPJB
18. Logistik - SIUJPT
19. Pariwisata - TDUP, CHSE
20. Telekomunikasi - ISR`,
    keywords: ["industri", "sektor", "bidang", "usaha", "daftar"]
  },
  {
    id: "faq-subscription",
    title: "Bagaimana sistem berlangganan dan harga?",
    category: "faq",
    content: `Compliance Hub menawarkan paket berlangganan berdasarkan fase kepatuhan:

**Paket SMAP:**
- Siap Dokumen: Rp 2.500.000/bulan
- Siap Audit Internal: Rp 3.500.000/bulan
- Siap Audit Eksternal: Rp 5.000.000/bulan
- Siap Surveilance: Rp 3.000.000/bulan

**Paket Pancek:**
- Siap Pengisian Kuesioner: Rp 1.500.000/bulan
- Siap Terverifikasi: Rp 2.500.000/bulan
- Siap Surveilance Pancek: Rp 2.000.000/bulan

**Pembayaran:**
- Transfer Bank (BCA, Mandiri, BRI, BNI)
- E-Wallet & QRIS (GoPay, OVO, Dana)`,
    keywords: ["harga", "biaya", "berlangganan", "subscription", "paket"]
  }
];

export const INDUSTRY_KNOWLEDGE: IndustryKnowledge[] = [
  {
    id: "konstruksi",
    name: "Konstruksi",
    description: "Sektor jasa konstruksi mencakup perencanaan, pelaksanaan, dan pengawasan pembangunan fisik.",
    mainRegulator: "Kementerian PUPR, LPJK",
    keyLicenses: ["NIB (menggantikan SIUJK)", "SBU (Sertifikat Badan Usaha)"],
    certifications: ["SKK (Sertifikat Kompetensi Kerja) - menggantikan SKA/SKT", "SNI ISO 37001 (SMAP)", "ISO 9001", "ISO 45001"],
    complianceRequirements: [
      "NIB dengan KBLI konstruksi",
      "SBU sesuai klasifikasi dan kualifikasi",
      "SKK untuk tenaga ahli",
      "SMAP wajib untuk vendor PUPR"
    ]
  },
  {
    id: "energi",
    name: "Energi & Ketenagalistrikan",
    description: "Sektor penyediaan dan distribusi tenaga listrik termasuk pembangkit, transmisi, dan distribusi.",
    mainRegulator: "Kementerian ESDM, PLN",
    keyLicenses: ["IUPTL (Izin Usaha Penyediaan Tenaga Listrik)", "SLO (Sertifikat Laik Operasi)"],
    certifications: ["SKTTK (Sertifikat Keterampilan Tenaga Teknik Ketenagalistrikan)", "ISO 9001", "ISO 14001"],
    complianceRequirements: [
      "IUPTL dari Kementerian ESDM",
      "SLO untuk instalasi kelistrikan",
      "SKTTK untuk tenaga teknik",
      "Izin Lingkungan untuk pembangkit"
    ]
  },
  {
    id: "tender",
    name: "Pengadaan & Tender",
    description: "Proses pengadaan barang/jasa pemerintah dan swasta melalui mekanisme tender kompetitif.",
    mainRegulator: "LKPP, K/L terkait",
    keyLicenses: ["SIKAP (Sistem Informasi Kinerja Penyedia)", "Registrasi LPSE"],
    certifications: ["TKDN (Tingkat Komponen Dalam Negeri)", "ISO 9001"],
    complianceRequirements: [
      "Registrasi di SIKAP dan LPSE",
      "Dokumen kualifikasi lengkap",
      "Jaminan penawaran dan pelaksanaan",
      "Kepatuhan Perpres 16/2018"
    ]
  }
];

export const SYSTEM_PROMPT_KNOWLEDGE = `Anda adalah Asisten Kepatuhan (Compliance Assistant) untuk platform Compliance Hub Indonesia.

TENTANG PLATFORM:
Compliance Hub adalah platform manajemen kepatuhan untuk bisnis Indonesia yang mencakup 20 industri, diorganisir dalam 5 Domain Kepatuhan utama:
1. LEGALITAS - Dokumen dasar hukum perusahaan (Akta, NIB, NPWP, TDP, Domisili, PKP)
2. PERIJINAN - Izin operasional dan sektoral (SBU, SIUP, IUPTL, dll)
3. SERTIFIKASI - Standar nasional/internasional (ISO 9001/14001/45001/37001, SKK, SKTTK)
4. TENDER - Dokumen pengadaan (Kualifikasi, Proposal, RAB, Kontrak)
5. OPERASIONAL - Dokumen kerja (SOP, Instruksi Kerja, Laporan, QC)

FITUR UTAMA:
- Dashboard: Ringkasan status kepatuhan
- Repository Template: 270+ template dokumen SMAP dan multi-industri
- Document Builder: Generate dokumen dengan AI
- PDCA Generator: 51 klausul ISO 37001 dengan bantuan AI
- Profil Perusahaan: Data master pegawai, proyek, vendor
- Knowledge Base: Informasi kepatuhan dan regulasi

CATATAN PENTING KONSTRUKSI:
- SKA/SKT sudah digantikan oleh SKK (Sertifikat Kompetensi Kerja)
- SIUJK sudah digantikan oleh NIB (Nomor Induk Berusaha) melalui OSS

PANDUAN MENJAWAB:
1. Jawab dengan bahasa Indonesia yang jelas dan profesional
2. Berikan informasi yang akurat tentang regulasi Indonesia
3. Jelaskan cara menggunakan fitur platform jika ditanya
4. Arahkan ke fitur yang relevan dalam platform
5. Jika tidak yakin, sarankan menghubungi regulator terkait

BATASAN:
- Tidak memberikan nasihat hukum spesifik
- Tidak menjamin kepatuhan 100%
- Selalu sarankan konsultasi dengan ahli untuk kasus kompleks`;

export function getKnowledgeContext(): string {
  const domains = COMPLIANCE_DOMAIN_KNOWLEDGE.map(d => 
    `${d.name}: ${d.description} Dokumen utama: ${d.keyDocuments.slice(0, 3).join(', ')}.`
  ).join('\n');
  
  const features = PLATFORM_FEATURES_KNOWLEDGE.slice(0, 5).map(f => 
    `${f.title}: ${f.content.substring(0, 150)}...`
  ).join('\n');
  
  return `${SYSTEM_PROMPT_KNOWLEDGE}\n\nDOMAIN KEPATUHAN:\n${domains}\n\nFITUR PLATFORM:\n${features}`;
}
