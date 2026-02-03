// Produk Siap SMAP - 4 Fase Kesiapan Implementasi SMAP
// Terintegrasi dengan SNI ISO 37001:2016 dan Permen PUPR No. 8/2022

export interface ProdukSiap {
  id: string;
  nama: string;
  namaInggris: string;
  deskripsi: string;
  icon: string;
  color: string;
  klausulUtama: string[];
  templateIds: string[];
  checklistItems: ChecklistItem[];
  estimasiWaktu: string;
  outputUtama: string[];
}

export interface ChecklistItem {
  id: string;
  item: string;
  kategori: string;
  wajib: boolean;
}

// Template IDs yang diperlukan untuk setiap fase
export const PRODUK_SIAP: ProdukSiap[] = [
  {
    id: "siap-dokumen",
    nama: "Siap Dokumen SMAP",
    namaInggris: "SMAP Documentation Ready",
    deskripsi: "Fase persiapan dan penyusunan seluruh dokumen SMAP sesuai SNI ISO 37001:2016. Mencakup pembuatan kebijakan, prosedur, formulir, dan register yang diperlukan untuk sistem manajemen anti penyuapan.",
    icon: "FileText",
    color: "blue",
    klausulUtama: ["4", "5", "6", "7"],
    estimasiWaktu: "2-3 bulan",
    outputUtama: [
      "Manual/Pedoman SMAP",
      "Kebijakan Anti Penyuapan",
      "SK Penetapan Tim FKAP",
      "SOP lengkap (20+ prosedur)",
      "Formulir dan Register",
      "Matriks Tanggung Jawab"
    ],
    templateIds: [
      // Klausul 4 - Konteks Organisasi
      "PED-SMAP-001", "FOR-KON-001", "FOR-KON-002", "REG-STA-001", "MAT-RIS-001",
      // Klausul 5 - Kepemimpinan
      "KEP-APB-001", "SK-KOM-001", "SK-FKP-001", "SK-AUD-001", "KEP-HAD-001", 
      "KEP-DON-001", "KEP-KOI-001", "MAT-TJW-001", "FOR-DEL-001",
      // Klausul 6 - Perencanaan
      "REG-RIS-001", "PRO-APB-001", "FOR-SAS-001", "MAT-PER-001",
      // Klausul 7 - Dukungan
      "REG-PEL-001", "FOR-PEL-001", "SOP-PEL-001", "FOR-KES-001", 
      "SOP-KOM-001", "FOR-KOM-001", "SOP-DOK-001", "REG-DOK-001"
    ],
    checklistItems: [
      { id: "d1", item: "Analisis konteks organisasi internal dan eksternal", kategori: "Konteks", wajib: true },
      { id: "d2", item: "Identifikasi pihak berkepentingan dan persyaratan", kategori: "Konteks", wajib: true },
      { id: "d3", item: "Penetapan ruang lingkup SMAP", kategori: "Konteks", wajib: true },
      { id: "d4", item: "Penilaian risiko penyuapan", kategori: "Risiko", wajib: true },
      { id: "d5", item: "Kebijakan anti penyuapan ditetapkan dan dikomunikasikan", kategori: "Kebijakan", wajib: true },
      { id: "d6", item: "SK Komitmen Manajemen Puncak", kategori: "Kepemimpinan", wajib: true },
      { id: "d7", item: "SK Penetapan Tim FKAP", kategori: "Kepemimpinan", wajib: true },
      { id: "d8", item: "Matriks tanggung jawab dan wewenang", kategori: "Organisasi", wajib: true },
      { id: "d9", item: "Sasaran anti penyuapan ditetapkan", kategori: "Perencanaan", wajib: true },
      { id: "d10", item: "Program anti penyuapan disusun", kategori: "Perencanaan", wajib: true },
      { id: "d11", item: "SOP pengendalian dokumen", kategori: "Dokumentasi", wajib: true },
      { id: "d12", item: "SOP pengendalian rekaman", kategori: "Dokumentasi", wajib: true },
      { id: "d13", item: "Manual/Pedoman SMAP disusun", kategori: "Dokumentasi", wajib: true },
      { id: "d14", item: "Register risiko penyuapan", kategori: "Risiko", wajib: true },
      { id: "d15", item: "Prosedur pelaporan dan WBS", kategori: "Pelaporan", wajib: true }
    ]
  },
  {
    id: "siap-audit",
    nama: "Siap Audit Internal",
    namaInggris: "Internal Audit Ready",
    deskripsi: "Fase persiapan dan pelaksanaan audit internal SMAP. Mencakup perencanaan audit, pelaksanaan audit, pelaporan temuan, dan tindak lanjut perbaikan sesuai klausul 9.2 SNI ISO 37001:2016.",
    icon: "ClipboardCheck",
    color: "orange",
    klausulUtama: ["9.2"],
    estimasiWaktu: "1-2 bulan",
    outputUtama: [
      "Program Audit Tahunan",
      "Rencana Audit Internal",
      "Checklist Audit SMAP",
      "Laporan Hasil Audit",
      "Daftar Temuan Audit",
      "Tindak Lanjut Temuan"
    ],
    templateIds: [
      // Audit Internal
      "PRO-AUD-001", "SOP-AUD-001", "FOR-RAU-001", "CHK-AUD-001", 
      "CHK-AUD-002", "LAP-AUD-001", "REG-TEM-001", "FOR-TLT-001",
      "MAT-AUD-001", "IK-AUD-001", "FOR-KAU-001", "REG-AUD-001"
    ],
    checklistItems: [
      { id: "a1", item: "Program audit tahunan disusun dan disetujui", kategori: "Perencanaan", wajib: true },
      { id: "a2", item: "Tim auditor internal ditunjuk dan kompeten", kategori: "Sumber Daya", wajib: true },
      { id: "a3", item: "Auditor independen dari area yang diaudit", kategori: "Independensi", wajib: true },
      { id: "a4", item: "Rencana audit detail per area", kategori: "Perencanaan", wajib: true },
      { id: "a5", item: "Checklist audit berdasarkan klausul ISO 37001", kategori: "Pelaksanaan", wajib: true },
      { id: "a6", item: "Opening meeting dilaksanakan", kategori: "Pelaksanaan", wajib: true },
      { id: "a7", item: "Audit dilakukan dengan bukti objektif", kategori: "Pelaksanaan", wajib: true },
      { id: "a8", item: "Closing meeting dan presentasi temuan", kategori: "Pelaksanaan", wajib: true },
      { id: "a9", item: "Laporan audit internal lengkap", kategori: "Pelaporan", wajib: true },
      { id: "a10", item: "Klasifikasi temuan (mayor, minor, observasi)", kategori: "Pelaporan", wajib: true },
      { id: "a11", item: "Tindakan korektif untuk setiap temuan", kategori: "Tindak Lanjut", wajib: true },
      { id: "a12", item: "Verifikasi efektivitas tindakan korektif", kategori: "Tindak Lanjut", wajib: true }
    ]
  },
  {
    id: "siap-sertifikasi",
    nama: "Siap Sertifikasi",
    namaInggris: "Certification Ready",
    deskripsi: "Fase persiapan audit sertifikasi oleh Lembaga Sertifikasi. Mencakup tinjauan manajemen, penyelesaian temuan audit internal, dan persiapan bukti implementasi SMAP secara menyeluruh.",
    icon: "Award",
    color: "green",
    klausulUtama: ["8", "9.3", "10"],
    estimasiWaktu: "1-2 bulan",
    outputUtama: [
      "Laporan Tinjauan Manajemen",
      "Bukti Implementasi Lengkap",
      "Status Penyelesaian Temuan",
      "Dokumen Pre-Audit Review",
      "Rekaman Pelatihan",
      "Bukti Komunikasi SMAP"
    ],
    templateIds: [
      // Klausul 8 - Operasi
      "SOP-UTU-001", "CHK-UTU-001", "REG-MBI-001", "SOP-HAD-001", "REG-HAD-001",
      "SOP-WBS-001", "REG-WBS-001", "SOP-INV-001", "LAP-INV-001",
      // Klausul 9.3 - Tinjauan Manajemen
      "SOP-RTM-001", "FOR-RTM-001", "BA-RTM-001", "LAP-RTM-001",
      // Klausul 10 - Perbaikan
      "SOP-TKO-001", "REG-TKO-001", "FOR-TKO-001", "LAP-PER-001",
      // Pre-Sertifikasi
      "CHK-PRA-001", "MAT-KES-001", "LAP-KES-001"
    ],
    checklistItems: [
      { id: "s1", item: "Semua dokumen SMAP lengkap dan terkendali", kategori: "Dokumentasi", wajib: true },
      { id: "s2", item: "Audit internal telah dilaksanakan", kategori: "Audit", wajib: true },
      { id: "s3", item: "Semua temuan mayor telah ditutup", kategori: "Temuan", wajib: true },
      { id: "s4", item: "Tinjauan manajemen telah dilaksanakan", kategori: "Manajemen", wajib: true },
      { id: "s5", item: "Rekaman pelatihan personel lengkap", kategori: "Pelatihan", wajib: true },
      { id: "s6", item: "Bukti komunikasi kebijakan", kategori: "Komunikasi", wajib: true },
      { id: "s7", item: "Register risiko ter-update", kategori: "Risiko", wajib: true },
      { id: "s8", item: "Uji tuntas mitra bisnis terdokumentasi", kategori: "Operasi", wajib: true },
      { id: "s9", item: "Prosedur WBS telah disosialisasikan", kategori: "Operasi", wajib: true },
      { id: "s10", item: "Laporan kinerja SMAP tersedia", kategori: "Kinerja", wajib: true },
      { id: "s11", item: "Pre-audit review dilaksanakan", kategori: "Persiapan", wajib: true },
      { id: "s12", item: "Gap analysis sertifikasi selesai", kategori: "Persiapan", wajib: true },
      { id: "s13", item: "Tim pendamping audit ditunjuk", kategori: "Organisasi", wajib: true },
      { id: "s14", item: "Ruangan dan logistik audit disiapkan", kategori: "Logistik", wajib: false }
    ]
  },
  {
    id: "siap-surveilance",
    nama: "Siap Surveilance & Perpanjangan",
    namaInggris: "Surveillance & Renewal Ready",
    deskripsi: "Fase pemeliharaan sertifikasi melalui audit surveilance tahunan dan persiapan perpanjangan sertifikat (re-sertifikasi) setiap 3 tahun. Fokus pada bukti perbaikan berkelanjutan dan konsistensi implementasi.",
    icon: "RefreshCw",
    color: "purple",
    klausulUtama: ["9.1", "10.1", "10.2"],
    estimasiWaktu: "Berkelanjutan (tahunan)",
    outputUtama: [
      "Laporan Kinerja SMAP Tahunan",
      "Bukti Perbaikan Berkelanjutan",
      "Update Register Risiko",
      "Laporan Efektivitas Program",
      "Rekaman Surveilance Sebelumnya",
      "Rencana Perbaikan"
    ],
    templateIds: [
      // Klausul 9.1 - Pemantauan dan Pengukuran
      "SOP-PMT-001", "FOR-PMT-001", "REG-KPI-001", "LAP-KIN-001", "MAT-KPI-001",
      // Klausul 10 - Perbaikan Berkelanjutan
      "SOP-PBB-001", "FOR-PBB-001", "REG-PBB-001", "LAP-PBB-001",
      // Surveilance
      "CHK-SUR-001", "FOR-SUR-001", "LAP-SUR-001", "PRO-SUR-001",
      // Re-sertifikasi
      "CHK-RST-001", "FOR-RST-001", "LAP-RST-001"
    ],
    checklistItems: [
      { id: "v1", item: "Laporan kinerja SMAP periode sebelumnya", kategori: "Kinerja", wajib: true },
      { id: "v2", item: "Status tindak lanjut temuan audit sebelumnya", kategori: "Temuan", wajib: true },
      { id: "v3", item: "Bukti audit internal terakhir", kategori: "Audit", wajib: true },
      { id: "v4", item: "Rekaman tinjauan manajemen terakhir", kategori: "Manajemen", wajib: true },
      { id: "v5", item: "Update register risiko penyuapan", kategori: "Risiko", wajib: true },
      { id: "v6", item: "Bukti pelatihan dan awareness berkelanjutan", kategori: "Pelatihan", wajib: true },
      { id: "v7", item: "Rekaman penanganan pengaduan/WBS", kategori: "Operasi", wajib: true },
      { id: "v8", item: "Bukti uji tuntas mitra bisnis baru", kategori: "Operasi", wajib: true },
      { id: "v9", item: "Laporan efektivitas program anti penyuapan", kategori: "Efektivitas", wajib: true },
      { id: "v10", item: "Bukti perbaikan berkelanjutan", kategori: "Perbaikan", wajib: true },
      { id: "v11", item: "Perubahan organisasi yang mempengaruhi SMAP", kategori: "Perubahan", wajib: false },
      { id: "v12", item: "Rencana perbaikan untuk periode berikutnya", kategori: "Perencanaan", wajib: true }
    ]
  }
];

// Statistik per produk
export const getProdukStats = (produkId: string) => {
  const produk = PRODUK_SIAP.find(p => p.id === produkId);
  if (!produk) return null;
  
  return {
    totalTemplates: produk.templateIds.length,
    totalChecklist: produk.checklistItems.length,
    wajibItems: produk.checklistItems.filter(c => c.wajib).length,
    klausulCount: produk.klausulUtama.length
  };
};

// Warna untuk setiap produk
export const PRODUK_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300", border: "border-blue-500" },
  orange: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-300", border: "border-orange-500" },
  green: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300", border: "border-green-500" },
  purple: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300", border: "border-purple-500" }
};
