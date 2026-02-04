export interface ComplianceDocument {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface CompliancePathway {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  documents: ComplianceDocument[];
  checklist: string[];
}

export interface IndustryCompliance {
  industryId: string;
  industryName: string;
  pathways: {
    legalitas: CompliancePathway;
    perijinan: CompliancePathway;
    sertifikasi: CompliancePathway;
    tender: CompliancePathway;
    operasional: CompliancePathway;
  };
}

const createPathway = (
  id: string,
  name: string,
  description: string,
  icon: string,
  color: string,
  documents: ComplianceDocument[],
  checklist: string[]
): CompliancePathway => ({
  id,
  name,
  description,
  icon,
  color,
  documents,
  checklist,
});

export const industryCompliances: Record<string, IndustryCompliance> = {
  konstruksi: {
    industryId: "konstruksi",
    industryName: "Konstruksi",
    pathways: {
      legalitas: createPathway(
        "konstruksi-legalitas",
        "Legalitas Konstruksi",
        "Dokumen dasar badan usaha konstruksi",
        "FileText",
        "blue",
        [
          { id: "akta", name: "Akta Pendirian", description: "Akta notaris pendirian perusahaan", category: "Dokumen Dasar" },
          { id: "nib", name: "NIB (Nomor Induk Berusaha)", description: "Identitas berusaha dari OSS", category: "Perizinan Dasar" },
          { id: "npwp", name: "NPWP Perusahaan", description: "Nomor Pokok Wajib Pajak", category: "Perpajakan" },
          { id: "domisili", name: "Surat Domisili", description: "Keterangan domisili perusahaan", category: "Dokumen Dasar" },
        ],
        [
          "Akta pendirian sudah disahkan Kemenkumham",
          "NIB sudah terbit dan aktif",
          "NPWP terdaftar di DJP",
          "Surat domisili masih berlaku",
        ]
      ),
      perijinan: createPathway(
        "konstruksi-perijinan",
        "SBU Konstruksi",
        "Sertifikat Badan Usaha Jasa Konstruksi",
        "Award",
        "green",
        [
          { id: "sbu", name: "SBU (Sertifikat Badan Usaha)", description: "Sertifikat klasifikasi dan kualifikasi", category: "Sertifikasi Wajib" },
          { id: "skk", name: "SKK (Sertifikat Kompetensi Kerja)", description: "Sertifikat kompetensi tenaga kerja konstruksi", category: "Tenaga Ahli" },
          { id: "pjbu", name: "Penanggung Jawab Badan Usaha", description: "Data PJBU terdaftar di LPJK", category: "Manajemen" },
          { id: "iujk", name: "Registrasi LPJK", description: "Registrasi di Lembaga Pengembangan Jasa Konstruksi", category: "Registrasi" },
        ],
        [
          "SBU sesuai klasifikasi dan kualifikasi",
          "SKK tenaga ahli lengkap dan valid",
          "PJBU terdaftar di sistem LPJK",
          "Registrasi LPJK aktif",
        ]
      ),
      sertifikasi: createPathway(
        "konstruksi-sertifikasi",
        "Sertifikasi K3 & ISO",
        "Sertifikasi keselamatan dan standar mutu",
        "Shield",
        "purple",
        [
          { id: "smk3", name: "SMK3 (Sistem Manajemen K3)", description: "Sertifikasi keselamatan kerja", category: "K3" },
          { id: "iso9001", name: "ISO 9001:2015", description: "Sistem manajemen mutu", category: "ISO" },
          { id: "iso45001", name: "ISO 45001:2018", description: "Sistem manajemen K3", category: "ISO" },
          { id: "iso14001", name: "ISO 14001:2015", description: "Sistem manajemen lingkungan", category: "ISO" },
        ],
        [
          "SMK3 sudah tersertifikasi",
          "ISO 9001 tersertifikasi dan surveillance terkini",
          "ISO 45001 tersertifikasi",
          "ISO 14001 tersertifikasi (jika diperlukan)",
        ]
      ),
      tender: createPathway(
        "konstruksi-tender",
        "Dokumen Tender PUPR",
        "Dokumen kualifikasi dan penawaran",
        "Briefcase",
        "amber",
        [
          { id: "dok-kualifikasi", name: "Dokumen Kualifikasi", description: "Data kualifikasi perusahaan", category: "Prakualifikasi" },
          { id: "dok-teknis", name: "Proposal Teknis", description: "Penawaran teknis proyek", category: "Penawaran" },
          { id: "rab", name: "RAB (Rencana Anggaran Biaya)", description: "Penawaran harga", category: "Penawaran" },
          { id: "metode", name: "Metode Pelaksanaan", description: "Rencana pelaksanaan proyek", category: "Teknis" },
        ],
        [
          "Dokumen kualifikasi lengkap",
          "Proposal teknis sesuai KAK",
          "RAB detail dan kompetitif",
          "Metode pelaksanaan realistis",
        ]
      ),
      operasional: createPathway(
        "konstruksi-operasional",
        "SOP Proyek Konstruksi",
        "Standar operasional pelaksanaan proyek",
        "Settings",
        "orange",
        [
          { id: "sop-pelaksanaan", name: "SOP Pelaksanaan Proyek", description: "Prosedur standar pelaksanaan", category: "SOP" },
          { id: "sop-k3", name: "SOP K3 Proyek", description: "Prosedur keselamatan kerja", category: "K3" },
          { id: "sop-mutu", name: "SOP Pengendalian Mutu", description: "Quality control procedure", category: "Mutu" },
          { id: "laporan-harian", name: "Template Laporan Harian", description: "Format laporan progres harian", category: "Pelaporan" },
        ],
        [
          "SOP pelaksanaan terdokumentasi",
          "SOP K3 disosialisasikan",
          "Pengendalian mutu berjalan",
          "Laporan harian rutin",
        ]
      ),
    },
  },
  energi: {
    industryId: "energi",
    industryName: "Energi",
    pathways: {
      legalitas: createPathway(
        "energi-legalitas",
        "Legalitas Perusahaan Energi",
        "Dokumen dasar badan usaha energi",
        "FileText",
        "blue",
        [
          { id: "akta", name: "Akta Pendirian", description: "Akta notaris pendirian perusahaan", category: "Dokumen Dasar" },
          { id: "nib", name: "NIB Sektor Energi", description: "NIB dengan KBLI sektor energi", category: "Perizinan Dasar" },
          { id: "npwp", name: "NPWP Perusahaan", description: "Nomor Pokok Wajib Pajak", category: "Perpajakan" },
          { id: "tdp", name: "TDP/NIB Lama", description: "Tanda Daftar Perusahaan", category: "Registrasi" },
        ],
        [
          "Akta pendirian lengkap",
          "NIB dengan KBLI energi aktif",
          "NPWP terdaftar",
          "Dokumen legalitas valid",
        ]
      ),
      perijinan: createPathway(
        "energi-perijinan",
        "IUPTL & Perizinan Energi",
        "Izin Usaha Penyediaan Tenaga Listrik",
        "Zap",
        "yellow",
        [
          { id: "iuptl", name: "IUPTL", description: "Izin Usaha Penyediaan Tenaga Listrik", category: "Izin Utama" },
          { id: "slo", name: "SLO (Sertifikat Laik Operasi)", description: "Sertifikat kelayakan instalasi", category: "Sertifikat Teknis" },
          { id: "iup", name: "IUP (Izin Usaha Pertambangan)", description: "Untuk energi berbasis tambang", category: "Izin Khusus" },
          { id: "amdal", name: "AMDAL/UKL-UPL", description: "Dokumen lingkungan hidup", category: "Lingkungan" },
        ],
        [
          "IUPTL sudah terbit",
          "SLO instalasi valid",
          "IUP (jika applicable) aktif",
          "AMDAL/UKL-UPL disetujui",
        ]
      ),
      sertifikasi: createPathway(
        "energi-sertifikasi",
        "SKTTK & Sertifikasi Energi",
        "Sertifikasi kompetensi tenaga teknik",
        "Award",
        "purple",
        [
          { id: "skttk", name: "SKTTK", description: "Sertifikat Kompetensi Tenaga Teknik Ketenagalistrikan", category: "Kompetensi" },
          { id: "sertifikat-k3", name: "Sertifikat K3 Listrik", description: "Kompetensi K3 kelistrikan", category: "K3" },
          { id: "iso50001", name: "ISO 50001", description: "Sistem manajemen energi", category: "ISO" },
          { id: "sni", name: "SNI Kelistrikan", description: "Standar Nasional Indonesia", category: "Standar" },
        ],
        [
          "SKTTK tenaga teknik lengkap",
          "Sertifikat K3 listrik valid",
          "ISO 50001 (jika applicable)",
          "Produk memenuhi SNI",
        ]
      ),
      tender: createPathway(
        "energi-tender",
        "Tender Proyek Energi",
        "Dokumen tender PLN dan ESDM",
        "Briefcase",
        "amber",
        [
          { id: "dok-kualifikasi", name: "Dokumen Kualifikasi", description: "Prakualifikasi vendor PLN", category: "Prakualifikasi" },
          { id: "proposal", name: "Proposal Teknis", description: "Penawaran teknis proyek", category: "Penawaran" },
          { id: "rab", name: "RAB Proyek Energi", description: "Rencana anggaran biaya", category: "Penawaran" },
          { id: "spesifikasi", name: "Spesifikasi Teknis", description: "Detail teknis peralatan", category: "Teknis" },
        ],
        [
          "Kualifikasi vendor PLN terpenuhi",
          "Proposal teknis sesuai TOR",
          "RAB kompetitif",
          "Spesifikasi teknis lengkap",
        ]
      ),
      operasional: createPathway(
        "energi-operasional",
        "SOP Operasi Pembangkit",
        "Standar operasional pembangkit listrik",
        "Settings",
        "orange",
        [
          { id: "sop-operasi", name: "SOP Operasi Pembangkit", description: "Prosedur operasi harian", category: "SOP" },
          { id: "sop-pemeliharaan", name: "SOP Pemeliharaan", description: "Maintenance procedure", category: "Maintenance" },
          { id: "sop-k3", name: "SOP K3 Kelistrikan", description: "Prosedur keselamatan", category: "K3" },
          { id: "logbook", name: "Template Logbook Operasi", description: "Pencatatan operasi harian", category: "Pelaporan" },
        ],
        [
          "SOP operasi terdokumentasi",
          "Jadwal pemeliharaan berjalan",
          "SOP K3 diimplementasikan",
          "Logbook operasi terisi",
        ]
      ),
    },
  },
  umkm: {
    industryId: "umkm",
    industryName: "UMKM",
    pathways: {
      legalitas: createPathway(
        "umkm-legalitas",
        "Legalitas UMKM",
        "Dokumen dasar usaha mikro kecil menengah",
        "FileText",
        "blue",
        [
          { id: "nib", name: "NIB Perorangan/Badan", description: "Nomor Induk Berusaha dari OSS", category: "Perizinan Dasar" },
          { id: "npwp", name: "NPWP", description: "NPWP Pribadi atau Badan", category: "Perpajakan" },
          { id: "ktp", name: "KTP Pemilik", description: "Identitas pemilik usaha", category: "Identitas" },
          { id: "domisili", name: "Surat Domisili Usaha", description: "Keterangan lokasi usaha", category: "Lokasi" },
        ],
        [
          "NIB sudah terbit di OSS",
          "NPWP terdaftar",
          "KTP pemilik valid",
          "Domisili usaha jelas",
        ]
      ),
      perijinan: createPathway(
        "umkm-perijinan",
        "IUMK & Izin Usaha",
        "Izin Usaha Mikro Kecil",
        "Store",
        "green",
        [
          { id: "iumk", name: "IUMK", description: "Izin Usaha Mikro Kecil", category: "Izin Utama" },
          { id: "siup", name: "SIUP Mikro/Kecil", description: "Surat Izin Usaha Perdagangan", category: "Perdagangan" },
          { id: "izin-lokasi", name: "Izin Lokasi/IMB", description: "Izin penggunaan lokasi", category: "Lokasi" },
          { id: "izin-lingkungan", name: "SPPL", description: "Surat Pernyataan Pengelolaan Lingkungan", category: "Lingkungan" },
        ],
        [
          "IUMK sudah terbit",
          "SIUP sesuai jenis usaha",
          "Izin lokasi lengkap",
          "SPPL sudah dibuat",
        ]
      ),
      sertifikasi: createPathway(
        "umkm-sertifikasi",
        "Halal & BPOM",
        "Sertifikasi produk UMKM",
        "CheckCircle",
        "purple",
        [
          { id: "halal", name: "Sertifikat Halal", description: "Sertifikasi halal MUI/BPJPH", category: "Halal" },
          { id: "pirt", name: "P-IRT", description: "Pangan Industri Rumah Tangga", category: "Pangan" },
          { id: "bpom", name: "Izin Edar BPOM", description: "Registrasi produk BPOM", category: "BPOM" },
          { id: "sni", name: "SNI Produk", description: "Standar Nasional Indonesia", category: "Standar" },
        ],
        [
          "Sertifikat halal aktif",
          "P-IRT (untuk pangan rumahan)",
          "Izin edar BPOM (jika diperlukan)",
          "SNI produk (jika applicable)",
        ]
      ),
      tender: createPathway(
        "umkm-tender",
        "Tender UMKM",
        "Dokumen untuk pengadaan pemerintah",
        "Briefcase",
        "amber",
        [
          { id: "dok-umkm", name: "Dokumen Kualifikasi UMKM", description: "Bukti status UMKM", category: "Kualifikasi" },
          { id: "penawaran", name: "Surat Penawaran", description: "Penawaran harga produk/jasa", category: "Penawaran" },
          { id: "katalog", name: "Katalog Produk", description: "Daftar produk dan harga", category: "Produk" },
          { id: "referensi", name: "Surat Referensi", description: "Referensi pelanggan", category: "Pengalaman" },
        ],
        [
          "Status UMKM terverifikasi",
          "Penawaran kompetitif",
          "Katalog produk lengkap",
          "Referensi tersedia",
        ]
      ),
      operasional: createPathway(
        "umkm-operasional",
        "SOP Usaha UMKM",
        "Standar operasional sederhana",
        "Settings",
        "orange",
        [
          { id: "sop-produksi", name: "SOP Produksi", description: "Prosedur pembuatan produk", category: "Produksi" },
          { id: "sop-penjualan", name: "SOP Penjualan", description: "Prosedur penjualan", category: "Penjualan" },
          { id: "pembukuan", name: "Template Pembukuan", description: "Catatan keuangan sederhana", category: "Keuangan" },
          { id: "stok", name: "Kartu Stok", description: "Pencatatan inventori", category: "Inventori" },
        ],
        [
          "SOP produksi ada",
          "Prosedur penjualan jelas",
          "Pembukuan teratur",
          "Stok tercatat",
        ]
      ),
    },
  },
  migas: {
    industryId: "migas",
    industryName: "Minyak & Gas",
    pathways: {
      legalitas: createPathway(
        "migas-legalitas",
        "Legalitas Perusahaan Migas",
        "Dokumen dasar perusahaan sektor migas",
        "FileText",
        "blue",
        [
          { id: "akta", name: "Akta Pendirian", description: "Akta notaris dengan bidang migas", category: "Dokumen Dasar" },
          { id: "nib", name: "NIB Sektor Migas", description: "NIB dengan KBLI migas", category: "Perizinan Dasar" },
          { id: "npwp", name: "NPWP Perusahaan", description: "Nomor Pokok Wajib Pajak", category: "Perpajakan" },
          { id: "tkdn", name: "Sertifikat TKDN", description: "Tingkat Komponen Dalam Negeri", category: "Sertifikasi" },
        ],
        [
          "Akta sesuai bidang migas",
          "NIB KBLI migas aktif",
          "NPWP terdaftar",
          "TKDN tersertifikasi",
        ]
      ),
      perijinan: createPathway(
        "migas-perijinan",
        "KKKS & Perizinan Migas",
        "Izin operasi sektor minyak dan gas",
        "Flame",
        "red",
        [
          { id: "kkks", name: "Kontrak KKKS", description: "Kontrak Kerja Sama dengan SKK Migas", category: "Kontrak" },
          { id: "wpb", name: "WP&B (Work Program & Budget)", description: "Program kerja dan anggaran", category: "Perencanaan" },
          { id: "izin-eksplorasi", name: "Izin Eksplorasi", description: "Izin kegiatan eksplorasi", category: "Izin Operasi" },
          { id: "amdal", name: "AMDAL Migas", description: "Analisis dampak lingkungan", category: "Lingkungan" },
        ],
        [
          "Kontrak KKKS aktif",
          "WP&B disetujui SKK Migas",
          "Izin eksplorasi/produksi valid",
          "AMDAL disetujui",
        ]
      ),
      sertifikasi: createPathway(
        "migas-sertifikasi",
        "Sertifikasi HSE Migas",
        "Health Safety Environment sektor migas",
        "Shield",
        "purple",
        [
          { id: "hse", name: "Sertifikasi HSE", description: "Health Safety Environment", category: "HSE" },
          { id: "iso14001", name: "ISO 14001:2015", description: "Sistem manajemen lingkungan", category: "ISO" },
          { id: "iso45001", name: "ISO 45001:2018", description: "Sistem manajemen K3", category: "ISO" },
          { id: "api", name: "Sertifikasi API", description: "American Petroleum Institute", category: "Internasional" },
        ],
        [
          "HSE tersertifikasi",
          "ISO 14001 aktif",
          "ISO 45001 aktif",
          "Sertifikasi API (jika applicable)",
        ]
      ),
      tender: createPathway(
        "migas-tender",
        "Tender SKK Migas",
        "Dokumen tender proyek migas",
        "Briefcase",
        "amber",
        [
          { id: "prakualifikasi", name: "Dokumen Prakualifikasi", description: "Kualifikasi vendor migas", category: "Prakualifikasi" },
          { id: "proposal", name: "Proposal Teknis", description: "Penawaran teknis proyek", category: "Penawaran" },
          { id: "rab", name: "Cost Estimate", description: "Estimasi biaya proyek", category: "Penawaran" },
          { id: "ptk", name: "Kepatuhan PTK 007", description: "Pedoman Tata Kerja SKK Migas", category: "Kepatuhan" },
        ],
        [
          "Prakualifikasi vendor terpenuhi",
          "Proposal teknis sesuai TOR",
          "Cost estimate kompetitif",
          "Patuh PTK 007",
        ]
      ),
      operasional: createPathway(
        "migas-operasional",
        "SOP Operasi Migas",
        "Standar operasional sektor migas",
        "Settings",
        "orange",
        [
          { id: "sop-drilling", name: "SOP Drilling", description: "Prosedur pengeboran", category: "Operasi" },
          { id: "sop-produksi", name: "SOP Produksi", description: "Prosedur produksi migas", category: "Produksi" },
          { id: "sop-hse", name: "SOP HSE", description: "Prosedur keselamatan", category: "HSE" },
          { id: "emergency", name: "Emergency Response Plan", description: "Rencana tanggap darurat", category: "Darurat" },
        ],
        [
          "SOP drilling terdokumentasi",
          "SOP produksi berjalan",
          "SOP HSE diimplementasikan",
          "ERP tersedia dan dilatihkan",
        ]
      ),
    },
  },
  lingkungan: {
    industryId: "lingkungan",
    industryName: "Lingkungan",
    pathways: {
      legalitas: createPathway(
        "lingkungan-legalitas",
        "Legalitas Konsultan Lingkungan",
        "Dokumen dasar konsultan AMDAL",
        "FileText",
        "blue",
        [
          { id: "akta", name: "Akta Pendirian", description: "Akta notaris bidang lingkungan", category: "Dokumen Dasar" },
          { id: "nib", name: "NIB Konsultan", description: "NIB jasa konsultansi", category: "Perizinan Dasar" },
          { id: "npwp", name: "NPWP", description: "Nomor Pokok Wajib Pajak", category: "Perpajakan" },
          { id: "registrasi", name: "Registrasi KLHK", description: "Registrasi di Kementerian LHK", category: "Registrasi" },
        ],
        [
          "Akta sesuai bidang lingkungan",
          "NIB konsultan aktif",
          "NPWP terdaftar",
          "Registrasi KLHK valid",
        ]
      ),
      perijinan: createPathway(
        "lingkungan-perijinan",
        "AMDAL & UKL-UPL",
        "Dokumen lingkungan hidup",
        "Leaf",
        "green",
        [
          { id: "amdal", name: "AMDAL", description: "Analisis Mengenai Dampak Lingkungan", category: "Dokumen Utama" },
          { id: "ukl-upl", name: "UKL-UPL", description: "Upaya Pengelolaan & Pemantauan Lingkungan", category: "Dokumen Utama" },
          { id: "sppl", name: "SPPL", description: "Surat Pernyataan Pengelolaan Lingkungan", category: "Dokumen Sederhana" },
          { id: "izin-lingkungan", name: "Izin Lingkungan", description: "Persetujuan lingkungan hidup", category: "Perizinan" },
        ],
        [
          "AMDAL/UKL-UPL sesuai skala proyek",
          "Dokumen disetujui KLHK/Pemda",
          "Izin lingkungan terbit",
          "RKL-RPL terlaksana",
        ]
      ),
      sertifikasi: createPathway(
        "lingkungan-sertifikasi",
        "ISO 14001 & Sertifikasi Lingkungan",
        "Sertifikasi manajemen lingkungan",
        "Award",
        "purple",
        [
          { id: "iso14001", name: "ISO 14001:2015", description: "Sistem manajemen lingkungan", category: "ISO" },
          { id: "proper", name: "PROPER", description: "Program Penilaian Peringkat Kinerja", category: "KLHK" },
          { id: "sertifikasi-amdal", name: "Sertifikasi Penyusun AMDAL", description: "Sertifikasi tenaga ahli", category: "Kompetensi" },
          { id: "lsp", name: "Sertifikasi LSP", description: "Lembaga Sertifikasi Profesi", category: "Profesi" },
        ],
        [
          "ISO 14001 tersertifikasi",
          "PROPER minimal biru",
          "Tim penyusun tersertifikasi",
          "Kompetensi LSP valid",
        ]
      ),
      tender: createPathway(
        "lingkungan-tender",
        "Tender Konsultan Lingkungan",
        "Dokumen tender jasa lingkungan",
        "Briefcase",
        "amber",
        [
          { id: "kualifikasi", name: "Dokumen Kualifikasi", description: "Kualifikasi konsultan", category: "Prakualifikasi" },
          { id: "proposal", name: "Proposal Teknis", description: "Metodologi penyusunan AMDAL", category: "Penawaran" },
          { id: "tim", name: "CV Tim Ahli", description: "Curriculum vitae tenaga ahli", category: "SDM" },
          { id: "pengalaman", name: "Daftar Pengalaman", description: "Track record proyek", category: "Pengalaman" },
        ],
        [
          "Kualifikasi konsultan terpenuhi",
          "Proposal metodologi sesuai",
          "Tim ahli tersertifikasi",
          "Pengalaman relevan",
        ]
      ),
      operasional: createPathway(
        "lingkungan-operasional",
        "SOP Penyusunan AMDAL",
        "Standar operasional konsultan lingkungan",
        "Settings",
        "orange",
        [
          { id: "sop-amdal", name: "SOP Penyusunan AMDAL", description: "Prosedur penyusunan dokumen", category: "SOP" },
          { id: "sop-sampling", name: "SOP Sampling", description: "Prosedur pengambilan sampel", category: "Teknis" },
          { id: "sop-lab", name: "SOP Analisis Lab", description: "Prosedur analisis laboratorium", category: "Lab" },
          { id: "template", name: "Template Dokumen AMDAL", description: "Format standar dokumen", category: "Template" },
        ],
        [
          "SOP penyusunan ada",
          "Prosedur sampling standar",
          "Lab terakreditasi",
          "Template dokumen tersedia",
        ]
      ),
    },
  },
  iso: {
    industryId: "iso",
    industryName: "ISO Standards",
    pathways: {
      legalitas: createPathway(
        "iso-legalitas",
        "Legalitas Badan Sertifikasi",
        "Dokumen dasar lembaga sertifikasi",
        "FileText",
        "blue",
        [
          { id: "akta", name: "Akta Pendirian", description: "Akta notaris lembaga sertifikasi", category: "Dokumen Dasar" },
          { id: "nib", name: "NIB", description: "Nomor Induk Berusaha", category: "Perizinan Dasar" },
          { id: "npwp", name: "NPWP", description: "Nomor Pokok Wajib Pajak", category: "Perpajakan" },
          { id: "akreditasi", name: "Akreditasi KAN", description: "Akreditasi Komite Akreditasi Nasional", category: "Akreditasi" },
        ],
        [
          "Akta pendirian lengkap",
          "NIB aktif",
          "NPWP terdaftar",
          "Akreditasi KAN valid",
        ]
      ),
      perijinan: createPathway(
        "iso-perijinan",
        "Akreditasi KAN",
        "Izin operasi lembaga sertifikasi",
        "Award",
        "green",
        [
          { id: "kan", name: "Akreditasi KAN", description: "Komite Akreditasi Nasional", category: "Akreditasi" },
          { id: "scope", name: "Scope Akreditasi", description: "Ruang lingkup sertifikasi", category: "Scope" },
          { id: "iaf", name: "IAF MLA", description: "International Accreditation Forum", category: "Internasional" },
          { id: "iso17021", name: "ISO/IEC 17021-1", description: "Standar lembaga sertifikasi", category: "Standar" },
        ],
        [
          "Akreditasi KAN aktif",
          "Scope sesuai layanan",
          "IAF MLA (jika applicable)",
          "Patuh ISO 17021-1",
        ]
      ),
      sertifikasi: createPathway(
        "iso-sertifikasi",
        "Implementasi ISO",
        "Sertifikasi sistem manajemen ISO",
        "CheckCircle",
        "purple",
        [
          { id: "iso9001", name: "ISO 9001:2015", description: "Sistem manajemen mutu", category: "Mutu" },
          { id: "iso14001", name: "ISO 14001:2015", description: "Sistem manajemen lingkungan", category: "Lingkungan" },
          { id: "iso45001", name: "ISO 45001:2018", description: "Sistem manajemen K3", category: "K3" },
          { id: "iso27001", name: "ISO 27001:2022", description: "Sistem manajemen keamanan informasi", category: "IT" },
        ],
        [
          "Gap analysis selesai",
          "Dokumentasi lengkap",
          "Internal audit dilaksanakan",
          "Sertifikasi diperoleh",
        ]
      ),
      tender: createPathway(
        "iso-tender",
        "Tender Jasa Sertifikasi",
        "Dokumen tender layanan sertifikasi",
        "Briefcase",
        "amber",
        [
          { id: "profil", name: "Company Profile", description: "Profil lembaga sertifikasi", category: "Profil" },
          { id: "penawaran", name: "Penawaran Jasa", description: "Proposal layanan sertifikasi", category: "Penawaran" },
          { id: "auditor", name: "CV Auditor", description: "Kualifikasi tim auditor", category: "SDM" },
          { id: "tarif", name: "Tarif Sertifikasi", description: "Daftar harga layanan", category: "Harga" },
        ],
        [
          "Company profile lengkap",
          "Penawaran kompetitif",
          "Auditor tersertifikasi",
          "Tarif transparan",
        ]
      ),
      operasional: createPathway(
        "iso-operasional",
        "SOP Audit ISO",
        "Standar operasional audit sertifikasi",
        "Settings",
        "orange",
        [
          { id: "sop-audit", name: "SOP Audit", description: "Prosedur pelaksanaan audit", category: "Audit" },
          { id: "sop-sertifikasi", name: "SOP Penerbitan Sertifikat", description: "Prosedur sertifikasi", category: "Sertifikasi" },
          { id: "checklist", name: "Audit Checklist", description: "Daftar periksa audit", category: "Tools" },
          { id: "template", name: "Template Laporan Audit", description: "Format laporan audit", category: "Template" },
        ],
        [
          "SOP audit terdokumentasi",
          "Prosedur sertifikasi jelas",
          "Checklist per standar ada",
          "Template laporan standar",
        ]
      ),
    },
  },
  k3: {
    industryId: "k3",
    industryName: "K3 (Keselamatan Kerja)",
    pathways: {
      legalitas: createPathway(
        "k3-legalitas",
        "Legalitas Perusahaan Jasa K3",
        "Dokumen dasar PJK3",
        "FileText",
        "blue",
        [
          { id: "akta", name: "Akta Pendirian", description: "Akta notaris jasa K3", category: "Dokumen Dasar" },
          { id: "nib", name: "NIB Jasa K3", description: "NIB dengan KBLI K3", category: "Perizinan Dasar" },
          { id: "npwp", name: "NPWP", description: "Nomor Pokok Wajib Pajak", category: "Perpajakan" },
          { id: "penunjukan", name: "SK Penunjukan PJK3", description: "Surat penunjukan Kemnaker", category: "Penunjukan" },
        ],
        [
          "Akta sesuai bidang K3",
          "NIB KBLI K3 aktif",
          "NPWP terdaftar",
          "SK PJK3 dari Kemnaker",
        ]
      ),
      perijinan: createPathway(
        "k3-perijinan",
        "Lisensi PJK3",
        "Izin operasi Perusahaan Jasa K3",
        "Shield",
        "red",
        [
          { id: "lisensi", name: "Lisensi PJK3", description: "Lisensi dari Kemenaker", category: "Lisensi" },
          { id: "scope", name: "Scope Layanan", description: "Ruang lingkup jasa K3", category: "Scope" },
          { id: "ahli-k3", name: "Sertifikat Ahli K3", description: "Sertifikasi tenaga ahli", category: "SDM" },
          { id: "lab", name: "Akreditasi Lab K3", description: "Lab pengujian K3", category: "Lab" },
        ],
        [
          "Lisensi PJK3 aktif",
          "Scope layanan sesuai",
          "Ahli K3 tersertifikasi",
          "Lab terakreditasi (jika ada)",
        ]
      ),
      sertifikasi: createPathway(
        "k3-sertifikasi",
        "SMK3 & ISO 45001",
        "Sertifikasi sistem manajemen K3",
        "Award",
        "purple",
        [
          { id: "smk3", name: "SMK3", description: "Sistem Manajemen K3 (PP 50/2012)", category: "Nasional" },
          { id: "iso45001", name: "ISO 45001:2018", description: "Sistem manajemen K3 internasional", category: "ISO" },
          { id: "ahli-k3-umum", name: "Ahli K3 Umum", description: "Sertifikasi Kemnaker", category: "Kompetensi" },
          { id: "ahli-k3-khusus", name: "Ahli K3 Khusus", description: "Spesialisasi K3", category: "Kompetensi" },
        ],
        [
          "SMK3 tersertifikasi (166 kriteria)",
          "ISO 45001 aktif",
          "AK3U tersedia",
          "AK3 khusus sesuai bidang",
        ]
      ),
      tender: createPathway(
        "k3-tender",
        "Tender Jasa K3",
        "Dokumen tender layanan K3",
        "Briefcase",
        "amber",
        [
          { id: "kualifikasi", name: "Dokumen Kualifikasi PJK3", description: "Kualifikasi perusahaan", category: "Prakualifikasi" },
          { id: "proposal", name: "Proposal Teknis", description: "Penawaran jasa K3", category: "Penawaran" },
          { id: "tenaga-ahli", name: "Daftar Tenaga Ahli", description: "CV ahli K3", category: "SDM" },
          { id: "peralatan", name: "Daftar Peralatan", description: "Alat ukur dan uji K3", category: "Peralatan" },
        ],
        [
          "Kualifikasi PJK3 terpenuhi",
          "Proposal sesuai scope",
          "Tenaga ahli tersertifikasi",
          "Peralatan terkalibrasi",
        ]
      ),
      operasional: createPathway(
        "k3-operasional",
        "SOP Layanan K3",
        "Standar operasional jasa K3",
        "Settings",
        "orange",
        [
          { id: "sop-audit", name: "SOP Audit K3", description: "Prosedur audit K3", category: "Audit" },
          { id: "sop-pengujian", name: "SOP Pengujian", description: "Prosedur pengujian K3", category: "Pengujian" },
          { id: "sop-pelatihan", name: "SOP Pelatihan K3", description: "Prosedur training K3", category: "Pelatihan" },
          { id: "checklist", name: "Checklist Inspeksi K3", description: "Daftar periksa inspeksi", category: "Tools" },
        ],
        [
          "SOP audit terdokumentasi",
          "Prosedur pengujian standar",
          "Modul pelatihan tersedia",
          "Checklist per jenis inspeksi",
        ]
      ),
    },
  },
  tender: {
    industryId: "tender",
    industryName: "Tender & Procurement",
    pathways: {
      legalitas: createPathway(
        "tender-legalitas",
        "Legalitas Peserta Tender",
        "Dokumen dasar untuk mengikuti tender",
        "FileText",
        "blue",
        [
          { id: "akta", name: "Akta Pendirian", description: "Akta notaris perusahaan", category: "Dokumen Dasar" },
          { id: "nib", name: "NIB", description: "Nomor Induk Berusaha", category: "Perizinan Dasar" },
          { id: "npwp", name: "NPWP & SPT", description: "NPWP dan bukti lapor pajak", category: "Perpajakan" },
          { id: "skt", name: "SKT Pajak", description: "Surat Keterangan Fiskal", category: "Perpajakan" },
        ],
        [
          "Akta terbaru dan sah",
          "NIB aktif di OSS",
          "SPT 3 tahun terakhir",
          "SKT pajak valid",
        ]
      ),
      perijinan: createPathway(
        "tender-perijinan",
        "Registrasi LPSE/SIKaP",
        "Registrasi sistem pengadaan",
        "Globe",
        "green",
        [
          { id: "lpse", name: "Registrasi LPSE", description: "Layanan Pengadaan Secara Elektronik", category: "Registrasi" },
          { id: "sikap", name: "SIKaP", description: "Sistem Informasi Kinerja Penyedia", category: "Registrasi" },
          { id: "inaproc", name: "INAPROC", description: "Portal Pengadaan Nasional", category: "Portal" },
          { id: "vendor", name: "Vendor Management", description: "Registrasi vendor K/L", category: "Vendor" },
        ],
        [
          "Terdaftar di LPSE",
          "SIKaP terverifikasi",
          "Akun INAPROC aktif",
          "Vendor list K/L terdaftar",
        ]
      ),
      sertifikasi: createPathway(
        "tender-sertifikasi",
        "Sertifikasi Penyedia",
        "Sertifikasi untuk kualifikasi tender",
        "Award",
        "purple",
        [
          { id: "sbu", name: "SBU (jika konstruksi)", description: "Sertifikat Badan Usaha", category: "Konstruksi" },
          { id: "iso", name: "ISO 9001/37001", description: "Sertifikasi sistem manajemen", category: "ISO" },
          { id: "tkdn", name: "TKDN", description: "Tingkat Komponen Dalam Negeri", category: "TKDN" },
          { id: "sni", name: "SNI Produk", description: "Standar produk", category: "Standar" },
        ],
        [
          "SBU sesuai (untuk konstruksi)",
          "ISO aktif",
          "TKDN tersertifikasi",
          "SNI produk terpenuhi",
        ]
      ),
      tender: createPathway(
        "tender-tender",
        "Dokumen Penawaran",
        "Kelengkapan dokumen tender",
        "Briefcase",
        "amber",
        [
          { id: "administrasi", name: "Dokumen Administrasi", description: "Kelengkapan administratif", category: "Administrasi" },
          { id: "teknis", name: "Dokumen Teknis", description: "Proposal teknis", category: "Teknis" },
          { id: "harga", name: "Dokumen Harga", description: "Penawaran biaya", category: "Harga" },
          { id: "jaminan", name: "Jaminan Penawaran", description: "Bank guarantee", category: "Jaminan" },
        ],
        [
          "Administrasi lengkap",
          "Teknis sesuai KAK",
          "Harga kompetitif",
          "Jaminan valid",
        ]
      ),
      operasional: createPathway(
        "tender-operasional",
        "SOP Tender & Kontrak",
        "Standar operasional pengelolaan tender",
        "Settings",
        "orange",
        [
          { id: "sop-tender", name: "SOP Mengikuti Tender", description: "Prosedur ikut tender", category: "Tender" },
          { id: "sop-kontrak", name: "SOP Manajemen Kontrak", description: "Pengelolaan kontrak", category: "Kontrak" },
          { id: "sop-klaim", name: "SOP Klaim & Dispute", description: "Penanganan sengketa", category: "Klaim" },
          { id: "database", name: "Database Tender", description: "Rekam jejak tender", category: "Data" },
        ],
        [
          "SOP tender terdokumentasi",
          "Manajemen kontrak sistematis",
          "Prosedur klaim jelas",
          "Database tender terkelola",
        ]
      ),
    },
  },
  keuangan: {
    industryId: "keuangan",
    industryName: "Keuangan",
    pathways: {
      legalitas: createPathway(
        "keuangan-legalitas",
        "Legalitas Lembaga Keuangan",
        "Dokumen dasar perusahaan keuangan",
        "FileText",
        "blue",
        [
          { id: "akta", name: "Akta Pendirian", description: "Akta notaris lembaga keuangan", category: "Dokumen Dasar" },
          { id: "nib", name: "NIB Sektor Keuangan", description: "NIB dengan KBLI keuangan", category: "Perizinan Dasar" },
          { id: "npwp", name: "NPWP", description: "Nomor Pokok Wajib Pajak", category: "Perpajakan" },
          { id: "modal", name: "Bukti Modal Disetor", description: "Bukti penyetoran modal", category: "Modal" },
        ],
        [
          "Akta sesuai regulasi OJK",
          "NIB KBLI keuangan aktif",
          "NPWP terdaftar",
          "Modal sesuai ketentuan",
        ]
      ),
      perijinan: createPathway(
        "keuangan-perijinan",
        "Izin OJK",
        "Izin usaha dari OJK",
        "Building",
        "green",
        [
          { id: "izin-ojk", name: "Izin Usaha OJK", description: "Izin dari Otoritas Jasa Keuangan", category: "Izin Utama" },
          { id: "pendaftaran", name: "Pendaftaran OJK", description: "Registrasi di OJK", category: "Registrasi" },
          { id: "fit-proper", name: "Fit & Proper Test", description: "Uji kelayakan pengurus", category: "Pengurus" },
          { id: "tki", name: "TKI (Tata Kelola)", description: "Tata Kelola Internal", category: "Governance" },
        ],
        [
          "Izin OJK terbit",
          "Terdaftar di OJK",
          "Pengurus lulus fit proper",
          "TKI terpenuhi",
        ]
      ),
      sertifikasi: createPathway(
        "keuangan-sertifikasi",
        "Sertifikasi Profesional Keuangan",
        "Sertifikasi tenaga profesional",
        "Award",
        "purple",
        [
          { id: "wmi", name: "WMI/WPPE", description: "Wakil Manajer Investasi", category: "Pasar Modal" },
          { id: "aaji", name: "AAJI", description: "Asosiasi Asuransi Jiwa Indonesia", category: "Asuransi" },
          { id: "ca", name: "Chartered Accountant", description: "Akuntan profesional", category: "Akuntansi" },
          { id: "iso27001", name: "ISO 27001", description: "Keamanan informasi", category: "IT" },
        ],
        [
          "WMI/WPPE tersertifikasi",
          "AAJI aktif (untuk asuransi)",
          "CA tersedia",
          "ISO 27001 aktif",
        ]
      ),
      tender: createPathway(
        "keuangan-tender",
        "Tender Jasa Keuangan",
        "Dokumen tender layanan keuangan",
        "Briefcase",
        "amber",
        [
          { id: "profil", name: "Company Profile", description: "Profil perusahaan", category: "Profil" },
          { id: "proposal", name: "Proposal Layanan", description: "Penawaran jasa keuangan", category: "Penawaran" },
          { id: "track-record", name: "Track Record", description: "Rekam jejak layanan", category: "Pengalaman" },
          { id: "aum", name: "Asset Under Management", description: "Dana kelolaan", category: "Kinerja" },
        ],
        [
          "Company profile lengkap",
          "Proposal kompetitif",
          "Track record positif",
          "AUM memadai",
        ]
      ),
      operasional: createPathway(
        "keuangan-operasional",
        "SOP Layanan Keuangan",
        "Standar operasional jasa keuangan",
        "Settings",
        "orange",
        [
          { id: "sop-kyc", name: "SOP KYC/AML", description: "Know Your Customer", category: "Compliance" },
          { id: "sop-transaksi", name: "SOP Transaksi", description: "Prosedur transaksi", category: "Operasi" },
          { id: "sop-pelaporan", name: "SOP Pelaporan OJK", description: "Laporan berkala", category: "Pelaporan" },
          { id: "sop-risiko", name: "SOP Manajemen Risiko", description: "Pengelolaan risiko", category: "Risiko" },
        ],
        [
          "KYC/AML berjalan",
          "SOP transaksi terdokumentasi",
          "Pelaporan OJK tepat waktu",
          "Manajemen risiko sistematis",
        ]
      ),
    },
  },
  kesehatan: {
    industryId: "kesehatan",
    industryName: "Kesehatan",
    pathways: {
      legalitas: createPathway(
        "kesehatan-legalitas",
        "Legalitas Fasyankes",
        "Dokumen dasar fasilitas kesehatan",
        "FileText",
        "blue",
        [
          { id: "akta", name: "Akta Pendirian", description: "Akta notaris fasilitas kesehatan", category: "Dokumen Dasar" },
          { id: "nib", name: "NIB Kesehatan", description: "NIB dengan KBLI kesehatan", category: "Perizinan Dasar" },
          { id: "npwp", name: "NPWP", description: "Nomor Pokok Wajib Pajak", category: "Perpajakan" },
          { id: "str", name: "STR Tenaga Medis", description: "Surat Tanda Registrasi", category: "SDM" },
        ],
        [
          "Akta sesuai jenis fasyankes",
          "NIB KBLI kesehatan aktif",
          "NPWP terdaftar",
          "STR tenaga medis lengkap",
        ]
      ),
      perijinan: createPathway(
        "kesehatan-perijinan",
        "Izin Operasional Fasyankes",
        "Izin operasi fasilitas kesehatan",
        "Hospital",
        "red",
        [
          { id: "izin-rs", name: "Izin Operasional RS", description: "Izin rumah sakit", category: "Izin Utama" },
          { id: "izin-klinik", name: "Izin Klinik", description: "Izin klinik pratama/utama", category: "Klinik" },
          { id: "sip", name: "SIP Tenaga Medis", description: "Surat Izin Praktik", category: "SDM" },
          { id: "bpjs", name: "Kerjasama BPJS", description: "PKS dengan BPJS Kesehatan", category: "BPJS" },
        ],
        [
          "Izin operasional aktif",
          "SIP tenaga medis valid",
          "Kerjasama BPJS (jika applicable)",
          "Izin sesuai klasifikasi",
        ]
      ),
      sertifikasi: createPathway(
        "kesehatan-sertifikasi",
        "Akreditasi RS & FKTP",
        "Akreditasi fasilitas kesehatan",
        "Award",
        "purple",
        [
          { id: "kars", name: "Akreditasi KARS", description: "Komisi Akreditasi RS", category: "RS" },
          { id: "snars", name: "SNARS", description: "Standar Nasional Akreditasi RS", category: "RS" },
          { id: "fktp", name: "Akreditasi FKTP", description: "Akreditasi Puskesmas/Klinik", category: "FKTP" },
          { id: "jci", name: "JCI (opsional)", description: "Joint Commission International", category: "Internasional" },
        ],
        [
          "Akreditasi KARS minimal Madya",
          "SNARS edisi terbaru",
          "Akreditasi FKTP tercapai",
          "JCI (untuk RS besar)",
        ]
      ),
      tender: createPathway(
        "kesehatan-tender",
        "Tender Alkes & Jasa Kesehatan",
        "Dokumen tender sektor kesehatan",
        "Briefcase",
        "amber",
        [
          { id: "izin-alkes", name: "Izin Edar Alkes", description: "Registrasi alat kesehatan", category: "Alkes" },
          { id: "kualifikasi", name: "Dokumen Kualifikasi", description: "Kualifikasi distributor/vendor", category: "Prakualifikasi" },
          { id: "proposal", name: "Proposal Teknis", description: "Penawaran produk/jasa", category: "Penawaran" },
          { id: "katalog", name: "E-Katalog", description: "Pendaftaran e-katalog LKPP", category: "E-Katalog" },
        ],
        [
          "Izin edar alkes valid",
          "Kualifikasi vendor terpenuhi",
          "Proposal sesuai spesifikasi",
          "Terdaftar e-katalog",
        ]
      ),
      operasional: createPathway(
        "kesehatan-operasional",
        "SOP Pelayanan Medis",
        "Standar operasional fasyankes",
        "Settings",
        "orange",
        [
          { id: "sop-medis", name: "SOP Pelayanan Medis", description: "Prosedur pelayanan", category: "Medis" },
          { id: "ppk", name: "Panduan Praktik Klinis", description: "Clinical pathway", category: "Klinis" },
          { id: "ppi", name: "PPI", description: "Pencegahan Pengendalian Infeksi", category: "PPI" },
          { id: "rekam-medis", name: "SOP Rekam Medis", description: "Pengelolaan rekam medis", category: "Administrasi" },
        ],
        [
          "SOP medis terdokumentasi",
          "PPK tersedia per penyakit",
          "PPI diimplementasikan",
          "Rekam medis terkelola",
        ]
      ),
    },
  },
  pendidikan: {
    industryId: "pendidikan",
    industryName: "Pendidikan",
    pathways: {
      legalitas: createPathway(
        "pendidikan-legalitas",
        "Legalitas Lembaga Pendidikan",
        "Dokumen dasar institusi pendidikan",
        "FileText",
        "blue",
        [
          { id: "akta", name: "Akta Pendirian Yayasan", description: "Akta yayasan pendidikan", category: "Dokumen Dasar" },
          { id: "nib", name: "NIB Pendidikan", description: "NIB dengan KBLI pendidikan", category: "Perizinan Dasar" },
          { id: "npwp", name: "NPWP", description: "Nomor Pokok Wajib Pajak", category: "Perpajakan" },
          { id: "sk-yayasan", name: "SK Kemenkumham", description: "Pengesahan yayasan", category: "Pengesahan" },
        ],
        [
          "Akta yayasan sah",
          "NIB KBLI pendidikan aktif",
          "NPWP terdaftar",
          "SK Kemenkumham valid",
        ]
      ),
      perijinan: createPathway(
        "pendidikan-perijinan",
        "Izin Operasional Pendidikan",
        "Izin penyelenggaraan pendidikan",
        "GraduationCap",
        "green",
        [
          { id: "izin-diknas", name: "Izin Operasional", description: "Izin dari Dinas Pendidikan", category: "Izin Utama" },
          { id: "izin-pt", name: "Izin Prodi (PT)", description: "Izin program studi", category: "Perguruan Tinggi" },
          { id: "sk-pendirian", name: "SK Pendirian", description: "SK Kemendikbud", category: "Pendirian" },
          { id: "npsn", name: "NPSN", description: "Nomor Pokok Sekolah Nasional", category: "Registrasi" },
        ],
        [
          "Izin operasional aktif",
          "Izin prodi (untuk PT)",
          "SK pendirian terbit",
          "NPSN terdaftar",
        ]
      ),
      sertifikasi: createPathway(
        "pendidikan-sertifikasi",
        "Akreditasi BAN-PT/BAN-SM",
        "Akreditasi institusi pendidikan",
        "Award",
        "purple",
        [
          { id: "ban-pt", name: "Akreditasi BAN-PT", description: "Perguruan Tinggi", category: "PT" },
          { id: "ban-sm", name: "Akreditasi BAN-SM", description: "Sekolah/Madrasah", category: "Sekolah" },
          { id: "ban-paud", name: "Akreditasi BAN-PAUD PNF", description: "PAUD dan Nonformal", category: "PAUD" },
          { id: "kkni", name: "KKNI", description: "Kerangka Kualifikasi Nasional", category: "Kurikulum" },
        ],
        [
          "Akreditasi minimal B",
          "Visitasi terjadwal",
          "KKNI terimplementasi",
          "Borang lengkap",
        ]
      ),
      tender: createPathway(
        "pendidikan-tender",
        "Tender Proyek Pendidikan",
        "Dokumen tender sektor pendidikan",
        "Briefcase",
        "amber",
        [
          { id: "profil", name: "Profil Lembaga", description: "Company profile institusi", category: "Profil" },
          { id: "proposal", name: "Proposal Program", description: "Proposal kegiatan/proyek", category: "Penawaran" },
          { id: "cv-pengajar", name: "CV Tenaga Pengajar", description: "Kualifikasi dosen/guru", category: "SDM" },
          { id: "track-record", name: "Track Record", description: "Rekam jejak program", category: "Pengalaman" },
        ],
        [
          "Profil lengkap",
          "Proposal sesuai TOR",
          "Tenaga pengajar kompeten",
          "Track record positif",
        ]
      ),
      operasional: createPathway(
        "pendidikan-operasional",
        "SOP Akademik",
        "Standar operasional pendidikan",
        "Settings",
        "orange",
        [
          { id: "sop-akademik", name: "SOP Akademik", description: "Prosedur pembelajaran", category: "Akademik" },
          { id: "sop-ujian", name: "SOP Ujian", description: "Prosedur evaluasi", category: "Evaluasi" },
          { id: "kurikulum", name: "Dokumen Kurikulum", description: "Kurikulum dan silabus", category: "Kurikulum" },
          { id: "sop-wisuda", name: "SOP Kelulusan", description: "Prosedur wisuda", category: "Kelulusan" },
        ],
        [
          "SOP akademik terdokumentasi",
          "Prosedur ujian standar",
          "Kurikulum terupdate",
          "Proses kelulusan jelas",
        ]
      ),
    },
  },
  teknologi: {
    industryId: "teknologi",
    industryName: "Teknologi",
    pathways: {
      legalitas: createPathway(
        "teknologi-legalitas",
        "Legalitas Perusahaan Teknologi",
        "Dokumen dasar startup/perusahaan IT",
        "FileText",
        "blue",
        [
          { id: "akta", name: "Akta Pendirian", description: "Akta notaris PT teknologi", category: "Dokumen Dasar" },
          { id: "nib", name: "NIB Sektor Teknologi", description: "NIB dengan KBLI teknologi", category: "Perizinan Dasar" },
          { id: "npwp", name: "NPWP", description: "Nomor Pokok Wajib Pajak", category: "Perpajakan" },
          { id: "merek", name: "Pendaftaran Merek", description: "HAKI merek dagang", category: "HAKI" },
        ],
        [
          "Akta PT teknologi sah",
          "NIB KBLI IT aktif",
          "NPWP terdaftar",
          "Merek terdaftar DJKI",
        ]
      ),
      perijinan: createPathway(
        "teknologi-perijinan",
        "PSE & Izin Teknologi",
        "Izin Penyelenggara Sistem Elektronik",
        "Globe",
        "cyan",
        [
          { id: "pse", name: "PSE (Kominfo)", description: "Penyelenggara Sistem Elektronik", category: "Wajib" },
          { id: "sertifikat-el", name: "Sertifikat Elektronik", description: "Tanda tangan digital", category: "Digital" },
          { id: "izin-fintech", name: "Izin Fintech (jika applicable)", description: "Izin OJK untuk fintech", category: "Fintech" },
          { id: "izin-startup", name: "Pendaftaran Startup", description: "Registrasi di Kemkominfo", category: "Startup" },
        ],
        [
          "PSE terdaftar di Kominfo",
          "Sertifikat elektronik aktif",
          "Izin fintech (jika fintech)",
          "Startup terdaftar",
        ]
      ),
      sertifikasi: createPathway(
        "teknologi-sertifikasi",
        "ISO 27001 & Sertifikasi IT",
        "Sertifikasi keamanan dan IT",
        "Shield",
        "purple",
        [
          { id: "iso27001", name: "ISO 27001:2022", description: "Keamanan informasi", category: "Keamanan" },
          { id: "pdp", name: "Kepatuhan UU PDP", description: "Perlindungan Data Pribadi", category: "Privasi" },
          { id: "iso20000", name: "ISO 20000-1", description: "Manajemen layanan IT", category: "IT Service" },
          { id: "cmmi", name: "CMMI", description: "Capability Maturity Model", category: "Pengembangan" },
        ],
        [
          "ISO 27001 tersertifikasi",
          "Kepatuhan UU PDP",
          "ISO 20000 (untuk IT service)",
          "CMMI level 3+ (opsional)",
        ]
      ),
      tender: createPathway(
        "teknologi-tender",
        "Tender Proyek IT",
        "Dokumen tender sistem informasi",
        "Briefcase",
        "amber",
        [
          { id: "kualifikasi", name: "Dokumen Kualifikasi", description: "Kualifikasi vendor IT", category: "Prakualifikasi" },
          { id: "proposal", name: "Proposal Teknis", description: "Arsitektur sistem", category: "Penawaran" },
          { id: "tim", name: "CV Tim Developer", description: "Kualifikasi tim", category: "SDM" },
          { id: "portfolio", name: "Portfolio Proyek", description: "Track record aplikasi", category: "Pengalaman" },
        ],
        [
          "Kualifikasi vendor IT",
          "Arsitektur sistem sesuai",
          "Tim developer kompeten",
          "Portfolio relevan",
        ]
      ),
      operasional: createPathway(
        "teknologi-operasional",
        "SOP Pengembangan Software",
        "Standar operasional IT",
        "Settings",
        "orange",
        [
          { id: "sdlc", name: "SDLC Documentation", description: "Software development lifecycle", category: "Development" },
          { id: "sop-deploy", name: "SOP Deployment", description: "Prosedur deployment", category: "DevOps" },
          { id: "sop-incident", name: "SOP Incident Management", description: "Penanganan insiden", category: "Support" },
          { id: "backup", name: "SOP Backup & DR", description: "Disaster recovery", category: "DR" },
        ],
        [
          "SDLC terdokumentasi",
          "Deployment terstandar",
          "Incident management ada",
          "DR plan tersedia",
        ]
      ),
    },
  },
  pertanian: {
    industryId: "pertanian",
    industryName: "Pertanian",
    pathways: {
      legalitas: createPathway(
        "pertanian-legalitas",
        "Legalitas Usaha Pertanian",
        "Dokumen dasar perusahaan pertanian",
        "FileText",
        "blue",
        [
          { id: "akta", name: "Akta Pendirian", description: "Akta PT/CV pertanian", category: "Dokumen Dasar" },
          { id: "nib", name: "NIB Pertanian", description: "NIB dengan KBLI pertanian", category: "Perizinan Dasar" },
          { id: "npwp", name: "NPWP", description: "Nomor Pokok Wajib Pajak", category: "Perpajakan" },
          { id: "sertifikat-tanah", name: "Sertifikat Lahan", description: "Bukti kepemilikan/sewa lahan", category: "Lahan" },
        ],
        [
          "Akta perusahaan sah",
          "NIB KBLI pertanian aktif",
          "NPWP terdaftar",
          "Sertifikat lahan valid",
        ]
      ),
      perijinan: createPathway(
        "pertanian-perijinan",
        "Izin Usaha Pertanian",
        "Izin operasi usaha tani",
        "Leaf",
        "green",
        [
          { id: "siup-pertanian", name: "SIUP Pertanian", description: "Izin usaha pertanian", category: "Izin Utama" },
          { id: "str-pupuk", name: "STR Pupuk/Pestisida", description: "Surat Tanda Registrasi", category: "Input" },
          { id: "izin-benih", name: "Izin Pengedar Benih", description: "Izin benih dari Kementan", category: "Benih" },
          { id: "rekomendasi", name: "Rekomendasi Kementan", description: "Rekomendasi impor/ekspor", category: "Perdagangan" },
        ],
        [
          "SIUP pertanian aktif",
          "STR input pertanian valid",
          "Izin benih (jika applicable)",
          "Rekomendasi Kementan (jika impor)",
        ]
      ),
      sertifikasi: createPathway(
        "pertanian-sertifikasi",
        "Sertifikasi Organik & GAP",
        "Sertifikasi produk pertanian",
        "Award",
        "purple",
        [
          { id: "organik", name: "Sertifikat Organik", description: "Sertifikasi pertanian organik", category: "Organik" },
          { id: "gap", name: "GAP (Good Agricultural Practices)", description: "Praktik pertanian baik", category: "GAP" },
          { id: "prima3", name: "Prima 3", description: "Sertifikasi keamanan pangan", category: "Keamanan Pangan" },
          { id: "halal", name: "Halal (produk olahan)", description: "Sertifikasi halal", category: "Halal" },
        ],
        [
          "Sertifikat organik aktif",
          "GAP tersertifikasi",
          "Prima 3 (minimal)",
          "Halal (untuk olahan)",
        ]
      ),
      tender: createPathway(
        "pertanian-tender",
        "Tender Proyek Pertanian",
        "Dokumen tender sektor pertanian",
        "Briefcase",
        "amber",
        [
          { id: "profil", name: "Company Profile", description: "Profil perusahaan pertanian", category: "Profil" },
          { id: "proposal", name: "Proposal Teknis", description: "Proposal program pertanian", category: "Penawaran" },
          { id: "katalog", name: "Katalog Produk", description: "Daftar produk pertanian", category: "Produk" },
          { id: "sertifikasi", name: "Bukti Sertifikasi", description: "Copy sertifikat organik/GAP", category: "Sertifikasi" },
        ],
        [
          "Company profile lengkap",
          "Proposal sesuai program",
          "Katalog produk update",
          "Sertifikasi dilampirkan",
        ]
      ),
      operasional: createPathway(
        "pertanian-operasional",
        "SOP Budidaya",
        "Standar operasional pertanian",
        "Settings",
        "orange",
        [
          { id: "sop-tanam", name: "SOP Budidaya", description: "Prosedur penanaman", category: "Budidaya" },
          { id: "sop-panen", name: "SOP Panen & Pasca Panen", description: "Prosedur panen", category: "Panen" },
          { id: "sop-input", name: "SOP Penggunaan Input", description: "Pupuk dan pestisida", category: "Input" },
          { id: "logbook", name: "Logbook Pertanian", description: "Catatan usaha tani", category: "Recording" },
        ],
        [
          "SOP budidaya terdokumentasi",
          "Prosedur panen standar",
          "Penggunaan input tercatat",
          "Logbook terisi rutin",
        ]
      ),
    },
  },
  manufaktur: {
    industryId: "manufaktur",
    industryName: "Manufaktur",
    pathways: {
      legalitas: createPathway(
        "manufaktur-legalitas",
        "Legalitas Pabrik/Industri",
        "Dokumen dasar perusahaan manufaktur",
        "FileText",
        "blue",
        [
          { id: "akta", name: "Akta Pendirian", description: "Akta PT manufaktur", category: "Dokumen Dasar" },
          { id: "nib", name: "NIB Industri", description: "NIB dengan KBLI industri", category: "Perizinan Dasar" },
          { id: "npwp", name: "NPWP", description: "Nomor Pokok Wajib Pajak", category: "Perpajakan" },
          { id: "tdp", name: "IUI/TDI", description: "Izin Usaha Industri", category: "Industri" },
        ],
        [
          "Akta PT industri sah",
          "NIB KBLI manufaktur aktif",
          "NPWP terdaftar",
          "IUI/TDI terbit",
        ]
      ),
      perijinan: createPathway(
        "manufaktur-perijinan",
        "IUI & Izin Industri",
        "Izin operasi pabrik",
        "Factory",
        "gray",
        [
          { id: "iui", name: "IUI (Izin Usaha Industri)", description: "Izin usaha industri", category: "Izin Utama" },
          { id: "imb", name: "IMB/PBG Pabrik", description: "Persetujuan Bangunan Gedung", category: "Bangunan" },
          { id: "izin-lingkungan", name: "Izin Lingkungan", description: "AMDAL/UKL-UPL pabrik", category: "Lingkungan" },
          { id: "izin-b3", name: "Izin Pengelolaan B3", description: "Izin limbah B3", category: "Limbah" },
        ],
        [
          "IUI aktif",
          "IMB/PBG pabrik valid",
          "Izin lingkungan dimiliki",
          "Pengelolaan B3 berizin",
        ]
      ),
      sertifikasi: createPathway(
        "manufaktur-sertifikasi",
        "ISO 9001 & GMP",
        "Sertifikasi mutu manufaktur",
        "Award",
        "purple",
        [
          { id: "iso9001", name: "ISO 9001:2015", description: "Sistem manajemen mutu", category: "ISO" },
          { id: "gmp", name: "GMP/CPOB", description: "Good Manufacturing Practice", category: "GMP" },
          { id: "haccp", name: "HACCP", description: "Keamanan pangan", category: "Pangan" },
          { id: "sni", name: "SNI Produk", description: "Standar produk nasional", category: "Standar" },
        ],
        [
          "ISO 9001 tersertifikasi",
          "GMP/CPOB (sesuai industri)",
          "HACCP (untuk pangan)",
          "SNI produk terpenuhi",
        ]
      ),
      tender: createPathway(
        "manufaktur-tender",
        "Tender Supply Produk",
        "Dokumen tender produk manufaktur",
        "Briefcase",
        "amber",
        [
          { id: "profil", name: "Company Profile", description: "Profil perusahaan", category: "Profil" },
          { id: "katalog", name: "Katalog Produk", description: "Daftar produk", category: "Produk" },
          { id: "penawaran", name: "Penawaran Harga", description: "Price list", category: "Harga" },
          { id: "tkdn", name: "Sertifikat TKDN", description: "Tingkat Komponen Dalam Negeri", category: "TKDN" },
        ],
        [
          "Company profile lengkap",
          "Katalog produk update",
          "Harga kompetitif",
          "TKDN tersertifikasi",
        ]
      ),
      operasional: createPathway(
        "manufaktur-operasional",
        "SOP Produksi",
        "Standar operasional pabrik",
        "Settings",
        "orange",
        [
          { id: "sop-produksi", name: "SOP Produksi", description: "Prosedur produksi", category: "Produksi" },
          { id: "sop-qc", name: "SOP Quality Control", description: "Pengendalian mutu", category: "QC" },
          { id: "sop-maintenance", name: "SOP Maintenance", description: "Pemeliharaan mesin", category: "Maintenance" },
          { id: "sop-warehouse", name: "SOP Gudang", description: "Pengelolaan gudang", category: "Gudang" },
        ],
        [
          "SOP produksi terdokumentasi",
          "QC berjalan sistematis",
          "Maintenance terjadwal",
          "Gudang terkelola",
        ]
      ),
    },
  },
  properti: {
    industryId: "properti",
    industryName: "Properti",
    pathways: {
      legalitas: createPathway(
        "properti-legalitas",
        "Legalitas Developer/Properti",
        "Dokumen dasar perusahaan properti",
        "FileText",
        "blue",
        [
          { id: "akta", name: "Akta Pendirian", description: "Akta PT developer", category: "Dokumen Dasar" },
          { id: "nib", name: "NIB Properti", description: "NIB dengan KBLI properti", category: "Perizinan Dasar" },
          { id: "npwp", name: "NPWP", description: "Nomor Pokok Wajib Pajak", category: "Perpajakan" },
          { id: "siup", name: "SIUP Properti", description: "Surat Izin Usaha", category: "Usaha" },
        ],
        [
          "Akta developer sah",
          "NIB KBLI properti aktif",
          "NPWP terdaftar",
          "SIUP properti valid",
        ]
      ),
      perijinan: createPathway(
        "properti-perijinan",
        "SHGB & Perizinan Properti",
        "Izin dan sertifikat lahan",
        "Building2",
        "emerald",
        [
          { id: "shgb", name: "SHGB/SHM", description: "Sertifikat Hak Guna Bangunan", category: "Tanah" },
          { id: "imb", name: "IMB/PBG", description: "Persetujuan Bangunan Gedung", category: "Bangunan" },
          { id: "izin-lokasi", name: "Izin Lokasi", description: "Izin penggunaan lahan", category: "Lokasi" },
          { id: "amdal", name: "AMDAL/UKL-UPL", description: "Dokumen lingkungan", category: "Lingkungan" },
        ],
        [
          "SHGB/SHM clear",
          "IMB/PBG terbit",
          "Izin lokasi valid",
          "AMDAL/UKL-UPL disetujui",
        ]
      ),
      sertifikasi: createPathway(
        "properti-sertifikasi",
        "Sertifikasi Properti",
        "Sertifikasi developer dan bangunan",
        "Award",
        "purple",
        [
          { id: "rei", name: "Anggota REI/Apersi", description: "Asosiasi properti", category: "Asosiasi" },
          { id: "slf", name: "SLF (Sertifikat Laik Fungsi)", description: "Kelayakan bangunan", category: "Kelayakan" },
          { id: "green-building", name: "Green Building", description: "Sertifikasi bangunan hijau", category: "Lingkungan" },
          { id: "iso9001", name: "ISO 9001", description: "Manajemen mutu", category: "ISO" },
        ],
        [
          "Anggota REI/Apersi",
          "SLF diperoleh",
          "Green building (opsional)",
          "ISO 9001 (opsional)",
        ]
      ),
      tender: createPathway(
        "properti-tender",
        "Tender Proyek Properti",
        "Dokumen tender properti",
        "Briefcase",
        "amber",
        [
          { id: "profil", name: "Company Profile", description: "Profil developer", category: "Profil" },
          { id: "portfolio", name: "Portfolio Proyek", description: "Track record proyek", category: "Pengalaman" },
          { id: "proposal", name: "Proposal Kerjasama", description: "Skema kerjasama", category: "Penawaran" },
          { id: "fs", name: "Feasibility Study", description: "Studi kelayakan", category: "Analisis" },
        ],
        [
          "Company profile lengkap",
          "Portfolio proyek sukses",
          "Proposal menarik",
          "FS komprehensif",
        ]
      ),
      operasional: createPathway(
        "properti-operasional",
        "SOP Pengembangan Properti",
        "Standar operasional developer",
        "Settings",
        "orange",
        [
          { id: "sop-pemasaran", name: "SOP Pemasaran", description: "Prosedur penjualan", category: "Marketing" },
          { id: "ppjb", name: "Template PPJB/AJB", description: "Perjanjian jual beli", category: "Legal" },
          { id: "sop-serah-terima", name: "SOP Serah Terima", description: "Handover unit", category: "Delivery" },
          { id: "sop-after-sales", name: "SOP After Sales", description: "Layanan purna jual", category: "Service" },
        ],
        [
          "SOP pemasaran ada",
          "PPJB standar tersedia",
          "Prosedur serah terima jelas",
          "After sales service berjalan",
        ]
      ),
    },
  },
  logistik: {
    industryId: "logistik",
    industryName: "Logistik",
    pathways: {
      legalitas: createPathway(
        "logistik-legalitas",
        "Legalitas Perusahaan Logistik",
        "Dokumen dasar perusahaan logistik",
        "FileText",
        "blue",
        [
          { id: "akta", name: "Akta Pendirian", description: "Akta PT logistik", category: "Dokumen Dasar" },
          { id: "nib", name: "NIB Logistik", description: "NIB dengan KBLI logistik", category: "Perizinan Dasar" },
          { id: "npwp", name: "NPWP", description: "Nomor Pokok Wajib Pajak", category: "Perpajakan" },
          { id: "tdp", name: "TDP/SIUP", description: "Tanda Daftar Perusahaan", category: "Registrasi" },
        ],
        [
          "Akta logistik sah",
          "NIB KBLI logistik aktif",
          "NPWP terdaftar",
          "SIUP perdagangan valid",
        ]
      ),
      perijinan: createPathway(
        "logistik-perijinan",
        "SIUJPT & Izin Logistik",
        "Izin jasa pengiriman dan transportasi",
        "Truck",
        "orange",
        [
          { id: "siujpt", name: "SIUJPT", description: "Izin Usaha Jasa Pengurusan Transportasi", category: "Transportasi" },
          { id: "izin-ekspedisi", name: "Izin Ekspedisi", description: "Izin jasa pengiriman", category: "Ekspedisi" },
          { id: "api-u", name: "API-U/API-P", description: "Angka Pengenal Importir", category: "Impor" },
          { id: "nib-kepabeanan", name: "NIK Bea Cukai", description: "Nomor Identitas Kepabeanan", category: "Bea Cukai" },
        ],
        [
          "SIUJPT aktif",
          "Izin ekspedisi valid",
          "API-U/P (jika impor/ekspor)",
          "NIK Bea Cukai terdaftar",
        ]
      ),
      sertifikasi: createPathway(
        "logistik-sertifikasi",
        "AEO & Sertifikasi Logistik",
        "Sertifikasi operator logistik",
        "Award",
        "purple",
        [
          { id: "aeo", name: "AEO (Authorized Economic Operator)", description: "Operator ekonomi tersertifikasi", category: "Bea Cukai" },
          { id: "iso9001", name: "ISO 9001:2015", description: "Manajemen mutu", category: "ISO" },
          { id: "iso28000", name: "ISO 28000", description: "Manajemen keamanan rantai pasok", category: "Keamanan" },
          { id: "gdp", name: "GDP (Good Distribution Practice)", description: "Distribusi farmasi", category: "Farmasi" },
        ],
        [
          "AEO tersertifikasi",
          "ISO 9001 aktif",
          "ISO 28000 (opsional)",
          "GDP (jika farmasi)",
        ]
      ),
      tender: createPathway(
        "logistik-tender",
        "Tender Jasa Logistik",
        "Dokumen tender layanan logistik",
        "Briefcase",
        "amber",
        [
          { id: "profil", name: "Company Profile", description: "Profil perusahaan", category: "Profil" },
          { id: "armada", name: "Daftar Armada", description: "Kendaraan dan kapasitas", category: "Aset" },
          { id: "jaringan", name: "Network Coverage", description: "Jangkauan layanan", category: "Jaringan" },
          { id: "tarif", name: "Rate Card", description: "Tarif layanan", category: "Harga" },
        ],
        [
          "Company profile lengkap",
          "Armada memadai",
          "Jaringan luas",
          "Tarif kompetitif",
        ]
      ),
      operasional: createPathway(
        "logistik-operasional",
        "SOP Logistik",
        "Standar operasional pengiriman",
        "Settings",
        "orange",
        [
          { id: "sop-pickup", name: "SOP Pickup", description: "Prosedur pengambilan barang", category: "Pickup" },
          { id: "sop-delivery", name: "SOP Delivery", description: "Prosedur pengiriman", category: "Delivery" },
          { id: "sop-warehouse", name: "SOP Warehousing", description: "Pengelolaan gudang", category: "Gudang" },
          { id: "sop-tracking", name: "SOP Tracking", description: "Pelacakan pengiriman", category: "Tracking" },
        ],
        [
          "SOP pickup terdokumentasi",
          "Prosedur delivery standar",
          "Manajemen gudang sistematis",
          "Tracking real-time",
        ]
      ),
    },
  },
  pariwisata: {
    industryId: "pariwisata",
    industryName: "Pariwisata",
    pathways: {
      legalitas: createPathway(
        "pariwisata-legalitas",
        "Legalitas Usaha Pariwisata",
        "Dokumen dasar bisnis pariwisata",
        "FileText",
        "blue",
        [
          { id: "akta", name: "Akta Pendirian", description: "Akta PT pariwisata", category: "Dokumen Dasar" },
          { id: "nib", name: "NIB Pariwisata", description: "NIB dengan KBLI pariwisata", category: "Perizinan Dasar" },
          { id: "npwp", name: "NPWP", description: "Nomor Pokok Wajib Pajak", category: "Perpajakan" },
          { id: "tdp", name: "TDP/SIUP", description: "Tanda Daftar Perusahaan", category: "Registrasi" },
        ],
        [
          "Akta pariwisata sah",
          "NIB KBLI pariwisata aktif",
          "NPWP terdaftar",
          "SIUP valid",
        ]
      ),
      perijinan: createPathway(
        "pariwisata-perijinan",
        "TDUP & Izin Pariwisata",
        "Tanda Daftar Usaha Pariwisata",
        "Palmtree",
        "cyan",
        [
          { id: "tdup", name: "TDUP", description: "Tanda Daftar Usaha Pariwisata", category: "Izin Utama" },
          { id: "izin-hotel", name: "Izin Hotel/Penginapan", description: "Izin akomodasi", category: "Akomodasi" },
          { id: "izin-resto", name: "Izin Restoran", description: "Izin usaha makanan", category: "F&B" },
          { id: "izin-travel", name: "Izin BPW/APW", description: "Biro/Agen Perjalanan Wisata", category: "Travel" },
        ],
        [
          "TDUP terbit",
          "Izin akomodasi (jika hotel)",
          "Izin restoran (jika F&B)",
          "Izin BPW/APW (jika travel)",
        ]
      ),
      sertifikasi: createPathway(
        "pariwisata-sertifikasi",
        "CHSE & Sertifikasi Pariwisata",
        "Sertifikasi kebersihan dan protokol",
        "Award",
        "purple",
        [
          { id: "chse", name: "CHSE", description: "Cleanliness, Health, Safety, Environment", category: "Protokol" },
          { id: "bintang", name: "Klasifikasi Bintang", description: "Rating hotel", category: "Hotel" },
          { id: "halal-tourism", name: "Halal Tourism", description: "Sertifikasi wisata halal", category: "Halal" },
          { id: "sustainable", name: "Sustainable Tourism", description: "Pariwisata berkelanjutan", category: "Lingkungan" },
        ],
        [
          "CHSE tersertifikasi",
          "Klasifikasi bintang (hotel)",
          "Halal tourism (opsional)",
          "Sustainable certification",
        ]
      ),
      tender: createPathway(
        "pariwisata-tender",
        "Tender Proyek Pariwisata",
        "Dokumen tender sektor pariwisata",
        "Briefcase",
        "amber",
        [
          { id: "profil", name: "Company Profile", description: "Profil perusahaan", category: "Profil" },
          { id: "paket", name: "Paket Wisata", description: "Daftar produk wisata", category: "Produk" },
          { id: "fasilitas", name: "Daftar Fasilitas", description: "Fasilitas yang tersedia", category: "Fasilitas" },
          { id: "harga", name: "Rate Card", description: "Tarif layanan", category: "Harga" },
        ],
        [
          "Company profile lengkap",
          "Paket wisata menarik",
          "Fasilitas memadai",
          "Harga kompetitif",
        ]
      ),
      operasional: createPathway(
        "pariwisata-operasional",
        "SOP Layanan Pariwisata",
        "Standar operasional pariwisata",
        "Settings",
        "orange",
        [
          { id: "sop-reservasi", name: "SOP Reservasi", description: "Prosedur pemesanan", category: "Reservasi" },
          { id: "sop-checkin", name: "SOP Check-in/out", description: "Prosedur tamu hotel", category: "Hotel" },
          { id: "sop-tour", name: "SOP Tour Guide", description: "Prosedur pemanduan", category: "Tour" },
          { id: "sop-complaint", name: "SOP Handling Complaint", description: "Penanganan keluhan", category: "Service" },
        ],
        [
          "SOP reservasi ada",
          "Check-in/out terstandar",
          "Prosedur tour guide jelas",
          "Complaint handling sistematis",
        ]
      ),
    },
  },
  telekomunikasi: {
    industryId: "telekomunikasi",
    industryName: "Telekomunikasi",
    pathways: {
      legalitas: createPathway(
        "telekomunikasi-legalitas",
        "Legalitas Perusahaan Telko",
        "Dokumen dasar perusahaan telekomunikasi",
        "FileText",
        "blue",
        [
          { id: "akta", name: "Akta Pendirian", description: "Akta PT telekomunikasi", category: "Dokumen Dasar" },
          { id: "nib", name: "NIB Telekomunikasi", description: "NIB dengan KBLI telko", category: "Perizinan Dasar" },
          { id: "npwp", name: "NPWP", description: "Nomor Pokok Wajib Pajak", category: "Perpajakan" },
          { id: "modal", name: "Bukti Modal", description: "Bukti modal disetor", category: "Modal" },
        ],
        [
          "Akta telko sah",
          "NIB KBLI telko aktif",
          "NPWP terdaftar",
          "Modal sesuai regulasi",
        ]
      ),
      perijinan: createPathway(
        "telekomunikasi-perijinan",
        "ISR & Izin Telekomunikasi",
        "Izin Stasiun Radio dan spektrum",
        "Radio",
        "indigo",
        [
          { id: "isr", name: "ISR (Izin Stasiun Radio)", description: "Izin penggunaan frekuensi", category: "Frekuensi" },
          { id: "izin-penyelenggaraan", name: "Izin Penyelenggaraan", description: "Izin jaringan/jasa telko", category: "Izin Utama" },
          { id: "spektrum", name: "Alokasi Spektrum", description: "Hak penggunaan pita frekuensi", category: "Spektrum" },
          { id: "sertifikat-alat", name: "Sertifikat Alat", description: "Sertifikasi perangkat", category: "Perangkat" },
        ],
        [
          "ISR aktif",
          "Izin penyelenggaraan valid",
          "Alokasi spektrum (jika applicable)",
          "Perangkat tersertifikasi",
        ]
      ),
      sertifikasi: createPathway(
        "telekomunikasi-sertifikasi",
        "Sertifikasi Telekomunikasi",
        "Sertifikasi operator dan perangkat",
        "Award",
        "purple",
        [
          { id: "iso27001", name: "ISO 27001", description: "Keamanan informasi", category: "Keamanan" },
          { id: "iso9001", name: "ISO 9001", description: "Manajemen mutu", category: "Mutu" },
          { id: "postel", name: "Sertifikasi Postel", description: "Sertifikasi perangkat Kominfo", category: "Perangkat" },
          { id: "tkdn", name: "TKDN", description: "Tingkat Komponen Dalam Negeri", category: "TKDN" },
        ],
        [
          "ISO 27001 tersertifikasi",
          "ISO 9001 aktif",
          "Perangkat tersertifikasi Postel",
          "TKDN terpenuhi",
        ]
      ),
      tender: createPathway(
        "telekomunikasi-tender",
        "Tender Proyek Telekomunikasi",
        "Dokumen tender infrastruktur telko",
        "Briefcase",
        "amber",
        [
          { id: "profil", name: "Company Profile", description: "Profil perusahaan", category: "Profil" },
          { id: "proposal", name: "Proposal Teknis", description: "Desain jaringan", category: "Teknis" },
          { id: "perangkat", name: "Spesifikasi Perangkat", description: "Detail equipment", category: "Perangkat" },
          { id: "sla", name: "SLA Proposal", description: "Service Level Agreement", category: "Service" },
        ],
        [
          "Company profile lengkap",
          "Proposal teknis sesuai",
          "Perangkat tersertifikasi",
          "SLA kompetitif",
        ]
      ),
      operasional: createPathway(
        "telekomunikasi-operasional",
        "SOP Operasi Jaringan",
        "Standar operasional jaringan telko",
        "Settings",
        "orange",
        [
          { id: "sop-noc", name: "SOP NOC", description: "Network Operation Center", category: "Operasi" },
          { id: "sop-maintenance", name: "SOP Maintenance", description: "Pemeliharaan jaringan", category: "Maintenance" },
          { id: "sop-incident", name: "SOP Incident Management", description: "Penanganan gangguan", category: "Incident" },
          { id: "sop-provisioning", name: "SOP Provisioning", description: "Aktivasi layanan", category: "Provisioning" },
        ],
        [
          "NOC beroperasi 24/7",
          "Maintenance terjadwal",
          "Incident handling sistematis",
          "Provisioning terstandar",
        ]
      ),
    },
  },
  smap: {
    industryId: "smap",
    industryName: "SMAP (ISO 37001)",
    pathways: {
      legalitas: createPathway(
        "smap-legalitas",
        "Legalitas Organisasi",
        "Dokumen dasar untuk implementasi SMAP",
        "FileText",
        "blue",
        [
          { id: "akta", name: "Akta Pendirian", description: "Akta notaris perusahaan", category: "Dokumen Dasar" },
          { id: "nib", name: "NIB", description: "Nomor Induk Berusaha", category: "Perizinan Dasar" },
          { id: "npwp", name: "NPWP", description: "Nomor Pokok Wajib Pajak", category: "Perpajakan" },
          { id: "struktur", name: "Struktur Organisasi", description: "Bagan organisasi terkini", category: "Organisasi" },
        ],
        [
          "Akta pendirian lengkap",
          "NIB aktif",
          "NPWP terdaftar",
          "Struktur organisasi jelas",
        ]
      ),
      perijinan: createPathway(
        "smap-perijinan",
        "Komitmen Manajemen",
        "Kebijakan dan komitmen anti penyuapan",
        "Shield",
        "green",
        [
          { id: "kebijakan", name: "Kebijakan Anti Penyuapan", description: "Policy statement", category: "Kebijakan" },
          { id: "komitmen", name: "Surat Komitmen Pimpinan", description: "Komitmen top management", category: "Komitmen" },
          { id: "fkap", name: "SK Pembentukan FKAP", description: "Fungsi Kepatuhan Anti Penyuapan", category: "Organisasi" },
          { id: "anggaran", name: "Anggaran SMAP", description: "Budget implementasi", category: "Anggaran" },
        ],
        [
          "Kebijakan ditetapkan",
          "Komitmen pimpinan ada",
          "FKAP terbentuk",
          "Anggaran dialokasikan",
        ]
      ),
      sertifikasi: createPathway(
        "smap-sertifikasi",
        "Sertifikasi ISO 37001:2016",
        "Proses sertifikasi SMAP",
        "Award",
        "purple",
        [
          { id: "gap-analysis", name: "Gap Analysis", description: "Analisis kesenjangan", category: "Persiapan" },
          { id: "dokumentasi", name: "Dokumentasi SMAP", description: "Manual, prosedur, formulir", category: "Dokumentasi" },
          { id: "internal-audit", name: "Internal Audit", description: "Audit internal SMAP", category: "Audit" },
          { id: "sertifikasi", name: "Audit Sertifikasi", description: "Audit oleh lembaga sertifikasi", category: "Sertifikasi" },
        ],
        [
          "Gap analysis selesai",
          "Dokumentasi lengkap (46 dokumen)",
          "Internal audit dilaksanakan",
          "Sertifikasi diperoleh",
        ]
      ),
      tender: createPathway(
        "smap-tender",
        "Persyaratan SMAP Tender",
        "Kepatuhan SMAP untuk tender PUPR",
        "Briefcase",
        "amber",
        [
          { id: "sertifikat-smap", name: "Sertifikat ISO 37001", description: "Bukti sertifikasi", category: "Sertifikasi" },
          { id: "kebijakan", name: "Kebijakan Anti Penyuapan", description: "Copy kebijakan", category: "Dokumen" },
          { id: "pakta", name: "Pakta Integritas", description: "Pernyataan integritas", category: "Integritas" },
          { id: "pelaporan", name: "Mekanisme Pelaporan", description: "Whistleblowing system", category: "Pelaporan" },
        ],
        [
          "Sertifikat ISO 37001 valid",
          "Kebijakan terdokumentasi",
          "Pakta integritas ditandatangani",
          "WBS tersedia",
        ]
      ),
      operasional: createPathway(
        "smap-operasional",
        "SOP Anti Penyuapan",
        "Prosedur operasional SMAP",
        "Settings",
        "orange",
        [
          { id: "sop-due-diligence", name: "SOP Due Diligence", description: "Uji tuntas mitra", category: "Due Diligence" },
          { id: "sop-gift", name: "SOP Pemberian/Penerimaan", description: "Pengelolaan hadiah", category: "Gratifikasi" },
          { id: "sop-wbs", name: "SOP Whistleblowing", description: "Sistem pelaporan", category: "Pelaporan" },
          { id: "sop-penanganan", name: "SOP Penanganan Pelanggaran", description: "Investigasi pelanggaran", category: "Penanganan" },
        ],
        [
          "Due diligence berjalan",
          "Prosedur gift/entertainment ada",
          "WBS aktif",
          "Penanganan pelanggaran sistematis",
        ]
      ),
    },
  },
  pancek: {
    industryId: "pancek",
    industryName: "Pancek (KPK)",
    pathways: {
      legalitas: createPathway(
        "pancek-legalitas",
        "Legalitas untuk Pancek",
        "Dokumen dasar registrasi Platform Jaga.id",
        "FileText",
        "blue",
        [
          { id: "akta", name: "Akta Pendirian", description: "Akta notaris perusahaan", category: "Dokumen Dasar" },
          { id: "nib", name: "NIB", description: "Nomor Induk Berusaha", category: "Perizinan Dasar" },
          { id: "npwp", name: "NPWP", description: "Nomor Pokok Wajib Pajak", category: "Perpajakan" },
          { id: "siup", name: "SIUP/Izin Usaha", description: "Izin usaha perusahaan", category: "Perizinan" },
        ],
        [
          "Akta pendirian lengkap",
          "NIB aktif",
          "NPWP terdaftar",
          "Izin usaha valid",
        ]
      ),
      perijinan: createPathway(
        "pancek-perijinan",
        "Registrasi Platform Jaga.id",
        "Pendaftaran di platform KPK",
        "Globe",
        "green",
        [
          { id: "akun-jaga", name: "Akun Platform Jaga.id", description: "Registrasi akun perusahaan", category: "Registrasi" },
          { id: "profil-jaga", name: "Profil Perusahaan", description: "Melengkapi profil di Jaga.id", category: "Profil" },
          { id: "dokumen-upload", name: "Upload Dokumen", description: "Unggah dokumen pendukung", category: "Dokumen" },
          { id: "verifikasi", name: "Verifikasi Akun", description: "Verifikasi oleh KPK", category: "Verifikasi" },
        ],
        [
          "Akun Jaga.id terdaftar",
          "Profil perusahaan lengkap",
          "Dokumen terunggah",
          "Akun terverifikasi",
        ]
      ),
      sertifikasi: createPathway(
        "pancek-sertifikasi",
        "Verifikasi Pancek KPK",
        "Proses verifikasi dan status Pancek",
        "CheckCircle",
        "purple",
        [
          { id: "kuesioner", name: "Pengisian Kuesioner", description: "Self-assessment Pancek", category: "Self-Assessment" },
          { id: "dokumen-bukti", name: "Dokumen Bukti", description: "Bukti implementasi", category: "Bukti" },
          { id: "desk-evaluation", name: "Desk Evaluation", description: "Evaluasi dokumen oleh KPK", category: "Evaluasi" },
          { id: "status-verifikasi", name: "Status Terverifikasi", description: "Pencapaian status Pancek", category: "Status" },
        ],
        [
          "Kuesioner terisi lengkap",
          "Dokumen bukti terunggah",
          "Desk evaluation passed",
          "Status terverifikasi KPK",
        ]
      ),
      tender: createPathway(
        "pancek-tender",
        "Persyaratan Pancek Tender",
        "Bukti kepatuhan Pancek untuk tender",
        "Briefcase",
        "amber",
        [
          { id: "status-pancek", name: "Bukti Status Pancek", description: "Screenshot/sertifikat status", category: "Status" },
          { id: "pakta", name: "Pakta Integritas", description: "Pernyataan anti korupsi", category: "Integritas" },
          { id: "kode-etik", name: "Kode Etik Perusahaan", description: "Code of conduct", category: "Etika" },
          { id: "csr", name: "Laporan CSR Anti Korupsi", description: "Program anti korupsi", category: "Program" },
        ],
        [
          "Status Pancek aktif",
          "Pakta integritas ada",
          "Kode etik terdokumentasi",
          "Program anti korupsi berjalan",
        ]
      ),
      operasional: createPathway(
        "pancek-operasional",
        "SOP Cegah Korupsi",
        "Prosedur pencegahan korupsi",
        "Settings",
        "orange",
        [
          { id: "sop-gratifikasi", name: "SOP Pengendalian Gratifikasi", description: "Prosedur pelaporan gratifikasi", category: "Gratifikasi" },
          { id: "sop-coi", name: "SOP Conflict of Interest", description: "Penanganan benturan kepentingan", category: "COI" },
          { id: "sop-pelaporan", name: "SOP Whistleblowing", description: "Sistem pelaporan pelanggaran", category: "Pelaporan" },
          { id: "sosialisasi", name: "Program Sosialisasi", description: "Edukasi anti korupsi", category: "Edukasi" },
        ],
        [
          "SOP gratifikasi ada",
          "Prosedur COI terdokumentasi",
          "WBS berfungsi",
          "Sosialisasi rutin",
        ]
      ),
    },
  },
};

export const domainInfo = {
  legalitas: {
    id: "legalitas",
    name: "Legalitas",
    description: "Dokumen dasar badan usaha",
    icon: "FileText",
    color: "blue",
  },
  perijinan: {
    id: "perijinan",
    name: "Perijinan",
    description: "Izin usaha dan operasional",
    icon: "Award",
    color: "green",
  },
  sertifikasi: {
    id: "sertifikasi",
    name: "Sertifikasi",
    description: "Sertifikasi dan standar mutu",
    icon: "Shield",
    color: "purple",
  },
  tender: {
    id: "tender",
    name: "Tender",
    description: "Dokumen pengadaan dan penawaran",
    icon: "Briefcase",
    color: "amber",
  },
  operasional: {
    id: "operasional",
    name: "Operasional",
    description: "SOP dan prosedur kerja",
    icon: "Settings",
    color: "orange",
  },
};

export function getIndustryCompliance(industryId: string): IndustryCompliance | undefined {
  return industryCompliances[industryId];
}

export function getAllIndustries(): string[] {
  return Object.keys(industryCompliances);
}
