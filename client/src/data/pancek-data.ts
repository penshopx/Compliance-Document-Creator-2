// Pancek (Panduan Cegah Korupsi) Data Structure
// Based on KPK Guidelines Ver-2 and Platform Jaga.id

export interface PancekPhase {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  checklistItems: PancekChecklistItem[];
  documents: PancekDocument[];
}

export interface PancekChecklistItem {
  id: string;
  phaseId: string;
  question: string;
  description: string;
  required: boolean;
  reference?: string;
}

export interface PancekDocument {
  id: string;
  phaseId: string;
  kode: string;
  nama: string;
  namaEn: string;
  kategori: string;
  deskripsi: string;
  penanggungJawab: string;
  frekuensi: string;
  tingkatKritis: "Wajib" | "Penting" | "Pendukung";
  dasarHukum?: string;
  promptTemplate: string;
}

// 6 PDCAR Phases for Pancek
export const PANCEK_PHASES: PancekPhase[] = [
  {
    id: "komitmen",
    name: "Komitmen",
    nameEn: "Commitment",
    description: "Deklarasi anti-korupsi, penyediaan sumber daya, kebijakan tertulis, kode etik, dan pengawalan oleh fungsi pelaksana",
    icon: "Shield",
    color: "red",
    order: 1,
    checklistItems: [
      {
        id: "K01",
        phaseId: "komitmen",
        question: "Apakah pimpinan puncak korporasi telah mendeklarasikan komitmen anti-korupsi?",
        description: "Deklarasi formal dari Direksi/Dewan Komisaris tentang zero tolerance terhadap korupsi",
        required: true,
        reference: "Panduan CEK Bab 2.1"
      },
      {
        id: "K02",
        phaseId: "komitmen",
        question: "Apakah tersedia sumber daya yang memadai untuk upaya pencegahan korupsi?",
        description: "SDM, infrastruktur, finansial, dan kebutuhan lain yang relevan",
        required: true,
        reference: "Panduan CEK Bab 2.1"
      },
      {
        id: "K03",
        phaseId: "komitmen",
        question: "Apakah terdapat kebijakan tertulis anti-korupsi dari korporasi?",
        description: "Kebijakan dengan pesan zero tolerance bagi tindakan koruptif",
        required: true,
        reference: "Panduan CEK Bab 2.2"
      },
      {
        id: "K04",
        phaseId: "komitmen",
        question: "Apakah korporasi memiliki Kode Etik yang mencakup nilai anti-korupsi?",
        description: "Aturan tertulis yang sistematis berdasarkan prinsip dan norma anti-korupsi",
        required: true,
        reference: "Panduan CEK Bab 2.3"
      },
      {
        id: "K05",
        phaseId: "komitmen",
        question: "Apakah terdapat Tim Pelaksana Fungsi Kepatuhan yang ditunjuk?",
        description: "Tim yang bertanggung jawab mengawal upaya pencegahan korupsi",
        required: true,
        reference: "Panduan CEK Bab 2.4"
      },
      {
        id: "K06",
        phaseId: "komitmen",
        question: "Apakah terdapat Piagam Audit yang mengatur fungsi kepatuhan?",
        description: "Dokumen yang mengatur visi, misi, tugas, wewenang, dan kode etik fungsi kepatuhan",
        required: true,
        reference: "Panduan CEK Bab 2.4"
      }
    ],
    documents: [
      {
        id: "PCK-KOM-001",
        phaseId: "komitmen",
        kode: "PCK-KOM-001",
        nama: "Deklarasi Anti-Korupsi",
        namaEn: "Anti-Corruption Declaration",
        kategori: "Kebijakan",
        deskripsi: "Pernyataan komitmen pimpinan puncak terhadap zero tolerance korupsi",
        penanggungJawab: "Direktur Utama",
        frekuensi: "Sekali/Review tahunan",
        tingkatKritis: "Wajib",
        dasarHukum: "UU 31/1999 jo UU 20/2001",
        promptTemplate: `Buatkan Deklarasi Anti-Korupsi untuk [NAMA PERUSAHAAN]:
1. Pernyataan komitmen zero tolerance
2. Nilai-nilai integritas perusahaan
3. Larangan bentuk-bentuk korupsi
4. Konsekuensi pelanggaran
5. Ajakan kepada seluruh insan perusahaan
6. Tanggal dan tanda tangan Direktur Utama`
      },
      {
        id: "PCK-KOM-002",
        phaseId: "komitmen",
        kode: "PCK-KOM-002",
        nama: "Kebijakan Anti-Korupsi",
        namaEn: "Anti-Corruption Policy",
        kategori: "Kebijakan",
        deskripsi: "Kebijakan komprehensif tentang pencegahan korupsi di korporasi",
        penanggungJawab: "Direktur Utama",
        frekuensi: "Review tahunan",
        tingkatKritis: "Wajib",
        dasarHukum: "UU 31/1999 jo UU 20/2001, Perma 13/2016",
        promptTemplate: `Buatkan Kebijakan Anti-Korupsi untuk [NAMA PERUSAHAAN]:
1. Definisi (Insan Perusahaan, Penyelenggara Negara, Pegawai Negeri, Praktik Korupsi, Perbuatan Curang)
2. Komitmen Perusahaan
3. Larangan-larangan:
   - Penyuapan kepada Pegawai Negeri/Penyelenggara Negara
   - Gratifikasi
   - Perbuatan curang
   - Benturan kepentingan
4. Pengaturan hadiah dan keramahtamahan
5. Pengaturan donasi dan kontribusi politik
6. Whistleblowing System
7. Sanksi pelanggaran
8. Tanda tangan Direktur Utama`
      },
      {
        id: "PCK-KOM-003",
        phaseId: "komitmen",
        kode: "PCK-KOM-003",
        nama: "Kode Etik Perusahaan",
        namaEn: "Code of Ethics",
        kategori: "Kebijakan",
        deskripsi: "Aturan tertulis yang mencerminkan nilai dan budaya korporasi",
        penanggungJawab: "Direktur Utama",
        frekuensi: "Review tahunan",
        tingkatKritis: "Wajib",
        dasarHukum: "Panduan CEK KPK",
        promptTemplate: `Buatkan Kode Etik Perusahaan untuk [NAMA PERUSAHAAN]:
1. Pendahuluan dan tujuan
2. Nilai-nilai inti perusahaan
3. Etika dalam hubungan kerja
4. Etika dalam hubungan dengan pihak eksternal
5. Etika dalam penggunaan aset perusahaan
6. Larangan konflik kepentingan
7. Larangan korupsi dan suap
8. Kerahasiaan informasi
9. Pelaporan pelanggaran
10. Sanksi`
      },
      {
        id: "PCK-KOM-004",
        phaseId: "komitmen",
        kode: "PCK-KOM-004",
        nama: "SK Pembentukan Tim Fungsi Kepatuhan",
        namaEn: "Compliance Function Team Decree",
        kategori: "SK",
        deskripsi: "Surat Keputusan penetapan tim pelaksana fungsi kepatuhan",
        penanggungJawab: "Direktur Utama",
        frekuensi: "Sekali/Update",
        tingkatKritis: "Wajib",
        dasarHukum: "Panduan CEK KPK, ISO 37301:2021",
        promptTemplate: `Buatkan SK Pembentukan Tim Fungsi Kepatuhan untuk [NAMA PERUSAHAAN]:
1. Menimbang (dasar pertimbangan)
2. Mengingat (dasar hukum: UU 28/1999, UU 20/2001, Perma 13/2016, ISO 37301:2021)
3. Memutuskan:
   - Pembentukan tim dengan susunan anggota
   - 21 Tugas pokok tim kepatuhan
   - Pengangkatan dan pemberhentian
   - Masa berlaku
4. Lampiran: Susunan Tim (Penanggung Jawab, Anggota)`
      },
      {
        id: "PCK-KOM-005",
        phaseId: "komitmen",
        kode: "PCK-KOM-005",
        nama: "Piagam Audit",
        namaEn: "Audit Charter",
        kategori: "Pedoman",
        deskripsi: "Dokumen yang mengatur fungsi kepatuhan/audit internal",
        penanggungJawab: "Direktur Utama",
        frekuensi: "Review periodik",
        tingkatKritis: "Wajib",
        dasarHukum: "Panduan CEK KPK",
        promptTemplate: `Buatkan Piagam Audit untuk [NAMA PERUSAHAAN]:
1. Latar Belakang
2. Visi dan Misi Fungsi Kepatuhan
3. Tujuan Fungsi Kepatuhan
4. Kedudukan dalam Organisasi
5. Kualifikasi personil
6. Tugas dan Tanggung Jawab (22 poin)
7. Wewenang (11 poin)
8. Kode Etik
9. Penutup dan tanda tangan`
      }
    ]
  },
  {
    id: "perencanaan",
    name: "Perencanaan",
    nameEn: "Planning",
    description: "Memahami peraturan perundangan, identifikasi risiko korupsi, dan pemetaan risiko",
    icon: "ClipboardList",
    color: "orange",
    order: 2,
    checklistItems: [
      {
        id: "P01",
        phaseId: "perencanaan",
        question: "Apakah korporasi memahami peraturan perundangan terkait pemidanaan korporasi?",
        description: "Pemahaman UU Tipikor, Perma 13/2016, dan regulasi terkait",
        required: true,
        reference: "Panduan CEK Bab 3.1"
      },
      {
        id: "P02",
        phaseId: "perencanaan",
        question: "Apakah telah dilakukan identifikasi area risiko korupsi?",
        description: "Identifikasi area yang berpotensi terjadi korupsi",
        required: true,
        reference: "Panduan CEK Bab 3.2"
      },
      {
        id: "P03",
        phaseId: "perencanaan",
        question: "Apakah telah dilakukan pemetaan risiko korupsi?",
        description: "Pemetaan berdasarkan likelihood dan impact",
        required: true,
        reference: "Panduan CEK Bab 3.3"
      },
      {
        id: "P04",
        phaseId: "perencanaan",
        question: "Apakah terdapat Register Risiko Korupsi yang terdokumentasi?",
        description: "Daftar risiko beserta mitigasinya",
        required: true,
        reference: "Panduan CEK Bab 3.3"
      },
      {
        id: "P05",
        phaseId: "perencanaan",
        question: "Apakah terdapat strategi mitigasi untuk setiap risiko yang teridentifikasi?",
        description: "Rencana penanganan untuk mencapai tingkat risiko yang diharapkan",
        required: true,
        reference: "Panduan CEK Bab 3.3"
      }
    ],
    documents: [
      {
        id: "PCK-PLN-001",
        phaseId: "perencanaan",
        kode: "PCK-PLN-001",
        nama: "Register Risiko Korupsi dan Kecurangan",
        namaEn: "Corruption and Fraud Risk Register",
        kategori: "Register",
        deskripsi: "Daftar tingkat kerawanan, mitigasi, dan evaluasi risiko korupsi",
        penanggungJawab: "Fungsi Kepatuhan",
        frekuensi: "Update berkala",
        tingkatKritis: "Wajib",
        dasarHukum: "Panduan CEK KPK",
        promptTemplate: `Buatkan Register Risiko Korupsi dan Kecurangan dengan kolom:
1. Jenis Risiko
2. Deskripsi Risiko
3. Area Risiko
4. Pemicu Risiko
5. Konsekuensi
6. Frekuensi Terjadinya
7. Tingkat Kerawanan Risiko
8. Tingkat Kerawanan yang Diharapkan
9. Strategi Mitigasi
10. Periode Waktu (0-3-9-12 bulan)
11. Status Implementasi Strategi
12. Tanggal Peninjauan Terakhir
13. Penanggung Jawab`
      },
      {
        id: "PCK-PLN-002",
        phaseId: "perencanaan",
        kode: "PCK-PLN-002",
        nama: "Matriks Penilaian Risiko Korupsi",
        namaEn: "Corruption Risk Assessment Matrix",
        kategori: "Matriks",
        deskripsi: "Matriks untuk menilai tingkat kerawanan risiko korupsi",
        penanggungJawab: "Fungsi Kepatuhan",
        frekuensi: "Tahunan",
        tingkatKritis: "Wajib",
        dasarHukum: "Panduan CEK KPK",
        promptTemplate: `Buatkan Matriks Penilaian Risiko Korupsi:
1. Skala Frekuensi (1-5): Sangat Jarang - Sangat Sering
2. Skala Dampak (1-5): Sangat Rendah - Sangat Tinggi
3. Risk Rating Matrix (5x5)
4. Kategori Risiko: Rendah, Sedang, Tinggi, Sangat Tinggi
5. Panduan penanganan per level risiko`
      },
      {
        id: "PCK-PLN-003",
        phaseId: "perencanaan",
        kode: "PCK-PLN-003",
        nama: "SOP Penilaian Risiko Korupsi",
        namaEn: "Corruption Risk Assessment SOP",
        kategori: "SOP",
        deskripsi: "Prosedur identifikasi dan penilaian risiko korupsi",
        penanggungJawab: "Fungsi Kepatuhan",
        frekuensi: "Review tahunan",
        tingkatKritis: "Wajib",
        dasarHukum: "Panduan CEK KPK",
        promptTemplate: `Buatkan SOP Penilaian Risiko Korupsi:
1. Tujuan
2. Ruang Lingkup
3. Definisi
4. Prosedur:
   - Identifikasi area risiko
   - Penilaian frekuensi dan dampak
   - Penentuan tingkat kerawanan
   - Penyusunan strategi mitigasi
   - Monitoring dan review
5. Dokumentasi yang diperlukan
6. Penanggung jawab`
      }
    ]
  },
  {
    id: "pelaksanaan",
    name: "Pelaksanaan",
    nameEn: "Implementation",
    description: "Uji tuntas, klausul anti-korupsi, pengaturan hadiah/gratifikasi, WBS, konflik kepentingan, pengendalian keuangan, komunikasi, dan pelatihan",
    icon: "Settings",
    color: "green",
    order: 3,
    checklistItems: [
      {
        id: "L01",
        phaseId: "pelaksanaan",
        question: "Apakah terdapat prosedur Uji Tuntas (Due Diligence) untuk mitra bisnis?",
        description: "Prosedur verifikasi integritas mitra bisnis sebelum bekerja sama",
        required: true,
        reference: "Panduan CEK Bab 4.1"
      },
      {
        id: "L02",
        phaseId: "pelaksanaan",
        question: "Apakah kontrak dengan pihak ketiga mencantumkan klausul anti-korupsi?",
        description: "Klausul yang mewajibkan pihak ketiga mematuhi kebijakan anti-korupsi",
        required: true,
        reference: "Panduan CEK Bab 4.2"
      },
      {
        id: "L03",
        phaseId: "pelaksanaan",
        question: "Apakah terdapat pengaturan pemberian/penerimaan hadiah, fasilitas, dan gratifikasi?",
        description: "Kebijakan yang mengatur batasan dan prosedur terkait hadiah",
        required: true,
        reference: "Panduan CEK Bab 4.3"
      },
      {
        id: "L04",
        phaseId: "pelaksanaan",
        question: "Apakah terdapat pengaturan kontribusi dan donasi politik?",
        description: "Kebijakan yang mengatur pemberian donasi dan kontribusi politik",
        required: true,
        reference: "Panduan CEK Bab 4.4"
      },
      {
        id: "L05",
        phaseId: "pelaksanaan",
        question: "Apakah terdapat Whistleblowing System (WBS) yang berfungsi?",
        description: "Sistem pelaporan pelanggaran dengan perlindungan pelapor",
        required: true,
        reference: "Panduan CEK Bab 4.5"
      },
      {
        id: "L06",
        phaseId: "pelaksanaan",
        question: "Apakah terdapat pengaturan konflik kepentingan?",
        description: "Kebijakan identifikasi dan pengelolaan konflik kepentingan",
        required: true,
        reference: "Panduan CEK Bab 4.6"
      },
      {
        id: "L07",
        phaseId: "pelaksanaan",
        question: "Apakah terdapat pengendalian transaksi keuangan yang memadai?",
        description: "Sistem pengendalian internal untuk transaksi keuangan",
        required: true,
        reference: "Panduan CEK Bab 4.7"
      },
      {
        id: "L08",
        phaseId: "pelaksanaan",
        question: "Apakah dilakukan komunikasi berkala tentang kebijakan anti-korupsi?",
        description: "Sosialisasi kebijakan kepada seluruh insan perusahaan",
        required: true,
        reference: "Panduan CEK Bab 4.8"
      },
      {
        id: "L09",
        phaseId: "pelaksanaan",
        question: "Apakah dilakukan pelatihan berkelanjutan tentang anti-korupsi?",
        description: "Program pelatihan rutin untuk membangun awareness",
        required: true,
        reference: "Panduan CEK Bab 4.9"
      }
    ],
    documents: [
      {
        id: "PCK-PEL-001",
        phaseId: "pelaksanaan",
        kode: "PCK-PEL-001",
        nama: "SOP Uji Tuntas Mitra Bisnis",
        namaEn: "Business Partner Due Diligence SOP",
        kategori: "SOP",
        deskripsi: "Prosedur verifikasi integritas mitra bisnis",
        penanggungJawab: "Fungsi Kepatuhan",
        frekuensi: "Review tahunan",
        tingkatKritis: "Wajib",
        dasarHukum: "Panduan CEK KPK",
        promptTemplate: `Buatkan SOP Uji Tuntas Mitra Bisnis:
1. Tujuan
2. Ruang Lingkup
3. Definisi mitra bisnis
4. Kriteria uji tuntas
5. Level uji tuntas (sederhana, standar, diperluas)
6. Informasi yang dikumpulkan
7. Red flags yang harus diwaspadai
8. Proses persetujuan
9. Monitoring berkelanjutan
10. Dokumentasi`
      },
      {
        id: "PCK-PEL-002",
        phaseId: "pelaksanaan",
        kode: "PCK-PEL-002",
        nama: "Kebijakan Whistleblowing System",
        namaEn: "Whistleblowing System Policy",
        kategori: "Kebijakan",
        deskripsi: "Kebijakan sistem pelaporan pelanggaran",
        penanggungJawab: "Direktur Utama",
        frekuensi: "Review tahunan",
        tingkatKritis: "Wajib",
        dasarHukum: "UU 28/1999, UU 20/2001, PP 43/2018, ISO 37002:2021",
        promptTemplate: `Buatkan Kebijakan Whistleblowing System:
1. Latar Belakang
2. Maksud dan Tujuan
3. Dasar Hukum
4. Definisi (Insan Perusahaan, Pelapor, Perbuatan Curang, Praktik Korupsi)
5. Ruang Lingkup
6. Tim Pengelola WBS
7. Perlindungan Pelapor
8. Kerahasiaan
9. Pengaduan Tanpa Nama
10. Imbalan bagi Pelapor
11. Standar Operasional Prosedur
12. Mekanisme pelaporan (email, telepon, kotak saran)`
      },
      {
        id: "PCK-PEL-003",
        phaseId: "pelaksanaan",
        kode: "PCK-PEL-003",
        nama: "Kebijakan Hadiah dan Gratifikasi",
        namaEn: "Gift and Gratification Policy",
        kategori: "Kebijakan",
        deskripsi: "Kebijakan pemberian dan penerimaan hadiah",
        penanggungJawab: "Fungsi Kepatuhan",
        frekuensi: "Review tahunan",
        tingkatKritis: "Wajib",
        dasarHukum: "UU 20/2001, PP 43/2018",
        promptTemplate: `Buatkan Kebijakan Hadiah dan Gratifikasi:
1. Definisi hadiah dan gratifikasi
2. Batasan nilai yang diperbolehkan
3. Hadiah yang dilarang
4. Prosedur penerimaan hadiah
5. Prosedur pemberian hadiah
6. Kewajiban pelaporan
7. Register hadiah
8. Penanganan hadiah tidak pantas
9. Sanksi pelanggaran`
      },
      {
        id: "PCK-PEL-004",
        phaseId: "pelaksanaan",
        kode: "PCK-PEL-004",
        nama: "Kebijakan Konflik Kepentingan",
        namaEn: "Conflict of Interest Policy",
        kategori: "Kebijakan",
        deskripsi: "Kebijakan identifikasi dan pengelolaan konflik kepentingan",
        penanggungJawab: "Fungsi Kepatuhan",
        frekuensi: "Review tahunan",
        tingkatKritis: "Wajib",
        dasarHukum: "Panduan CEK KPK",
        promptTemplate: `Buatkan Kebijakan Konflik Kepentingan:
1. Definisi konflik kepentingan
2. Jenis-jenis konflik kepentingan
3. Kewajiban pengungkapan
4. Prosedur pelaporan
5. Pengelolaan konflik
6. Formulir pengungkapan
7. Sanksi pelanggaran`
      },
      {
        id: "PCK-PEL-005",
        phaseId: "pelaksanaan",
        kode: "PCK-PEL-005",
        nama: "SOP Pengendalian Transaksi Keuangan",
        namaEn: "Financial Transaction Control SOP",
        kategori: "SOP",
        deskripsi: "Prosedur pengendalian transaksi keuangan",
        penanggungJawab: "Fungsi Keuangan",
        frekuensi: "Review tahunan",
        tingkatKritis: "Wajib",
        dasarHukum: "Panduan CEK KPK",
        promptTemplate: `Buatkan SOP Pengendalian Transaksi Keuangan:
1. Tujuan
2. Ruang Lingkup
3. Prinsip pengendalian
4. Pemisahan tugas (segregation of duties)
5. Otorisasi transaksi
6. Verifikasi pembayaran
7. Rekonsiliasi
8. Audit trail
9. Pelaporan anomali`
      },
      {
        id: "PCK-PEL-006",
        phaseId: "pelaksanaan",
        kode: "PCK-PEL-006",
        nama: "Register Hadiah dan Gratifikasi",
        namaEn: "Gift and Gratification Register",
        kategori: "Register",
        deskripsi: "Daftar penerimaan dan pemberian hadiah",
        penanggungJawab: "Fungsi Kepatuhan",
        frekuensi: "Update berkala",
        tingkatKritis: "Wajib",
        dasarHukum: "Panduan CEK KPK",
        promptTemplate: `Buatkan Register Hadiah dan Gratifikasi dengan kolom:
1. Tanggal
2. Nama Penerima/Pemberi
3. Jabatan
4. Pihak Pemberi/Penerima
5. Deskripsi Hadiah
6. Perkiraan Nilai
7. Alasan Pemberian/Penerimaan
8. Status Approval
9. Disposisi (diterima/ditolak/dikembalikan)`
      },
      {
        id: "PCK-PEL-007",
        phaseId: "pelaksanaan",
        kode: "PCK-PEL-007",
        nama: "Program Pelatihan Anti-Korupsi",
        namaEn: "Anti-Corruption Training Program",
        kategori: "Program",
        deskripsi: "Program pelatihan berkelanjutan tentang anti-korupsi",
        penanggungJawab: "Fungsi Kepatuhan",
        frekuensi: "Tahunan",
        tingkatKritis: "Wajib",
        dasarHukum: "Panduan CEK KPK",
        promptTemplate: `Buatkan Program Pelatihan Anti-Korupsi:
1. Tujuan program
2. Target peserta
3. Materi pelatihan:
   - Pengertian korupsi dan jenis-jenisnya
   - Peraturan perundangan
   - Kebijakan perusahaan
   - Red flags dan cara menghindari
   - Mekanisme pelaporan
4. Jadwal pelaksanaan
5. Metode pelatihan
6. Evaluasi efektivitas`
      }
    ]
  },
  {
    id: "evaluasi",
    name: "Evaluasi",
    nameEn: "Evaluation",
    description: "Pemantauan dan evaluasi efektivitas sistem pencegahan korupsi melalui audit internal",
    icon: "ClipboardCheck",
    color: "blue",
    order: 4,
    checklistItems: [
      {
        id: "E01",
        phaseId: "evaluasi",
        question: "Apakah terdapat mekanisme pemantauan pelaksanaan sistem pencegahan korupsi?",
        description: "Sistem monitoring pelaksanaan kebijakan anti-korupsi",
        required: true,
        reference: "Panduan CEK Bab 5.1"
      },
      {
        id: "E02",
        phaseId: "evaluasi",
        question: "Apakah dilakukan evaluasi berkala terhadap efektivitas sistem?",
        description: "Penilaian periodik terhadap keberhasilan program",
        required: true,
        reference: "Panduan CEK Bab 5.2"
      },
      {
        id: "E03",
        phaseId: "evaluasi",
        question: "Apakah hasil evaluasi dikomunikasikan kepada seluruh pegawai?",
        description: "Sosialisasi hasil penilaian kepada seluruh insan perusahaan",
        required: true,
        reference: "Panduan CEK Bab 5.3"
      },
      {
        id: "E04",
        phaseId: "evaluasi",
        question: "Apakah terdapat dukungan penuh dari Dewan Komisaris dan manajemen puncak?",
        description: "Komitmen dan dukungan dalam pelaksanaan evaluasi",
        required: true,
        reference: "Panduan CEK Bab 5.4"
      },
      {
        id: "E05",
        phaseId: "evaluasi",
        question: "Apakah hasil penilaian dan rekomendasi disampaikan kepada pihak terkait?",
        description: "Pelaporan kepada Dewan Komisaris, manajemen, dan bidang terkait",
        required: true,
        reference: "Panduan CEK Bab 5.5"
      },
      {
        id: "E06",
        phaseId: "evaluasi",
        question: "Apakah korporasi memiliki standar audit internal yang memadai?",
        description: "Standar audit yang memastikan berjalannya upaya pencegahan",
        required: true,
        reference: "Panduan CEK Bab 5.6"
      }
    ],
    documents: [
      {
        id: "PCK-EVL-001",
        phaseId: "evaluasi",
        kode: "PCK-EVL-001",
        nama: "SOP Audit Internal Anti-Korupsi",
        namaEn: "Anti-Corruption Internal Audit SOP",
        kategori: "SOP",
        deskripsi: "Prosedur pelaksanaan audit internal terkait anti-korupsi",
        penanggungJawab: "Fungsi Kepatuhan",
        frekuensi: "Review tahunan",
        tingkatKritis: "Wajib",
        dasarHukum: "Panduan CEK KPK",
        promptTemplate: `Buatkan SOP Audit Internal Anti-Korupsi:
1. Tujuan
2. Ruang Lingkup
3. Perencanaan audit
4. Persiapan (checklist, dokumen)
5. Pelaksanaan audit
6. Pengumpulan bukti
7. Penyusunan laporan
8. Tindak lanjut temuan
9. Monitoring perbaikan`
      },
      {
        id: "PCK-EVL-002",
        phaseId: "evaluasi",
        kode: "PCK-EVL-002",
        nama: "Checklist Audit Anti-Korupsi",
        namaEn: "Anti-Corruption Audit Checklist",
        kategori: "Checklist",
        deskripsi: "Checklist untuk pelaksanaan audit anti-korupsi",
        penanggungJawab: "Fungsi Kepatuhan",
        frekuensi: "Per audit",
        tingkatKritis: "Wajib",
        dasarHukum: "Panduan CEK KPK",
        promptTemplate: `Buatkan Checklist Audit Anti-Korupsi berdasarkan Panduan CEK:
1. Komitmen
   - Deklarasi anti-korupsi
   - Kebijakan tertulis
   - Kode etik
   - Tim kepatuhan
2. Perencanaan
   - Register risiko
   - Strategi mitigasi
3. Pelaksanaan
   - Uji tuntas
   - Klausul anti-korupsi
   - WBS
   - Hadiah/gratifikasi
4. Evaluasi
   - Audit internal
   - Laporan hasil
5. Perbaikan
   - Sanksi
   - Penghargaan
6. Respon
   - Aksi kolektif
   - Pelaporan`
      },
      {
        id: "PCK-EVL-003",
        phaseId: "evaluasi",
        kode: "PCK-EVL-003",
        nama: "Laporan Audit Anti-Korupsi",
        namaEn: "Anti-Corruption Audit Report",
        kategori: "Laporan",
        deskripsi: "Template laporan hasil audit anti-korupsi",
        penanggungJawab: "Fungsi Kepatuhan",
        frekuensi: "Per audit",
        tingkatKritis: "Wajib",
        dasarHukum: "Panduan CEK KPK",
        promptTemplate: `Buatkan Template Laporan Audit Anti-Korupsi:
1. Ringkasan Eksekutif
2. Informasi Audit (tanggal, tim, ruang lingkup)
3. Metodologi Audit
4. Hasil Audit per Area:
   - Komitmen
   - Perencanaan
   - Pelaksanaan
   - Evaluasi
   - Perbaikan
   - Respon
5. Daftar Temuan
6. Kesimpulan
7. Rekomendasi`
      }
    ]
  },
  {
    id: "perbaikan",
    name: "Perbaikan",
    nameEn: "Improvement",
    description: "Mekanisme sanksi, penghargaan, dan perbaikan berkelanjutan",
    icon: "RefreshCw",
    color: "purple",
    order: 5,
    checklistItems: [
      {
        id: "B01",
        phaseId: "perbaikan",
        question: "Apakah terdapat mekanisme pemberian sanksi untuk pelanggaran?",
        description: "Sistem sanksi yang jelas untuk pelanggaran kebijakan anti-korupsi",
        required: true,
        reference: "Panduan CEK Bab 6.1"
      },
      {
        id: "B02",
        phaseId: "perbaikan",
        question: "Apakah terdapat mekanisme penghargaan untuk upaya pencegahan korupsi?",
        description: "Sistem reward untuk mendorong perilaku anti-korupsi",
        required: true,
        reference: "Panduan CEK Bab 6.2"
      },
      {
        id: "B03",
        phaseId: "perbaikan",
        question: "Apakah dilakukan perbaikan berkelanjutan terhadap sistem?",
        description: "Upaya continuous improvement untuk mengantisipasi perubahan",
        required: true,
        reference: "Panduan CEK Bab 6.3"
      },
      {
        id: "B04",
        phaseId: "perbaikan",
        question: "Apakah terdapat tindak lanjut terhadap rekomendasi audit?",
        description: "Implementasi rekomendasi hasil audit",
        required: true,
        reference: "Panduan CEK Bab 6.4"
      }
    ],
    documents: [
      {
        id: "PCK-PRB-001",
        phaseId: "perbaikan",
        kode: "PCK-PRB-001",
        nama: "Kebijakan Sanksi Pelanggaran",
        namaEn: "Violation Sanction Policy",
        kategori: "Kebijakan",
        deskripsi: "Kebijakan pemberian sanksi untuk pelanggaran anti-korupsi",
        penanggungJawab: "Direktur Utama",
        frekuensi: "Review tahunan",
        tingkatKritis: "Wajib",
        dasarHukum: "Panduan CEK KPK",
        promptTemplate: `Buatkan Kebijakan Sanksi Pelanggaran:
1. Tujuan
2. Jenis-jenis pelanggaran
3. Tingkat pelanggaran (ringan, sedang, berat)
4. Jenis sanksi:
   - Teguran lisan
   - Teguran tertulis
   - Penurunan jabatan
   - Pemutusan hubungan kerja
   - Proses hukum
5. Prosedur penerapan sanksi
6. Hak pembelaan`
      },
      {
        id: "PCK-PRB-002",
        phaseId: "perbaikan",
        kode: "PCK-PRB-002",
        nama: "Kebijakan Penghargaan Anti-Korupsi",
        namaEn: "Anti-Corruption Reward Policy",
        kategori: "Kebijakan",
        deskripsi: "Kebijakan pemberian penghargaan untuk upaya pencegahan korupsi",
        penanggungJawab: "Direktur Utama",
        frekuensi: "Review tahunan",
        tingkatKritis: "Penting",
        dasarHukum: "Panduan CEK KPK",
        promptTemplate: `Buatkan Kebijakan Penghargaan Anti-Korupsi:
1. Tujuan
2. Jenis penghargaan:
   - Finansial
   - Non-finansial (sertifikat, promosi)
3. Kriteria penerima penghargaan
4. Prosedur nominasi
5. Mekanisme seleksi
6. Pengumuman dan seremoni`
      },
      {
        id: "PCK-PRB-003",
        phaseId: "perbaikan",
        kode: "PCK-PRB-003",
        nama: "Register Tindak Lanjut Rekomendasi",
        namaEn: "Recommendation Follow-up Register",
        kategori: "Register",
        deskripsi: "Daftar tindak lanjut rekomendasi audit",
        penanggungJawab: "Fungsi Kepatuhan",
        frekuensi: "Update berkala",
        tingkatKritis: "Wajib",
        dasarHukum: "Panduan CEK KPK",
        promptTemplate: `Buatkan Register Tindak Lanjut Rekomendasi dengan kolom:
1. No. Rekomendasi
2. Tanggal Audit
3. Deskripsi Temuan
4. Rekomendasi
5. PIC
6. Target Penyelesaian
7. Status Implementasi
8. Bukti Pelaksanaan
9. Verifikasi`
      }
    ]
  },
  {
    id: "respon",
    name: "Respon",
    nameEn: "Response",
    description: "Aksi kolektif anti-korupsi dan pelaporan indikasi tindak pidana korupsi",
    icon: "MessageSquare",
    color: "teal",
    order: 6,
    checklistItems: [
      {
        id: "R01",
        phaseId: "respon",
        question: "Apakah korporasi berpartisipasi dalam aksi kolektif anti-korupsi?",
        description: "Keterlibatan dalam gerakan bersama melawan korupsi",
        required: false,
        reference: "Panduan CEK Bab 7.1"
      },
      {
        id: "R02",
        phaseId: "respon",
        question: "Apakah terdapat prosedur pelaporan indikasi tindak pidana korupsi?",
        description: "Mekanisme pelaporan ke pihak berwenang (KPK, Kepolisian, dll)",
        required: true,
        reference: "Panduan CEK Bab 7.2"
      },
      {
        id: "R03",
        phaseId: "respon",
        question: "Apakah korporasi memiliki strategi menghadapi tantangan bisnis terkait anti-korupsi?",
        description: "Strategi menghadapi situasi sulit dalam menjalankan bisnis anti-korupsi",
        required: false,
        reference: "Panduan CEK Bab 7.3"
      }
    ],
    documents: [
      {
        id: "PCK-RSP-001",
        phaseId: "respon",
        kode: "PCK-RSP-001",
        nama: "SOP Pelaporan Tindak Pidana Korupsi",
        namaEn: "Corruption Reporting SOP",
        kategori: "SOP",
        deskripsi: "Prosedur pelaporan indikasi korupsi ke pihak berwenang",
        penanggungJawab: "Fungsi Kepatuhan",
        frekuensi: "Review tahunan",
        tingkatKritis: "Wajib",
        dasarHukum: "UU 31/1999 jo UU 20/2001",
        promptTemplate: `Buatkan SOP Pelaporan Tindak Pidana Korupsi:
1. Tujuan
2. Ruang Lingkup
3. Kriteria pelaporan ke pihak berwenang
4. Saluran pelaporan:
   - KPK (kws.kpk.go.id, pengaduan@kpk.go.id)
   - Kepolisian (tipidkorpolri.info)
   - Ombudsman
   - LAPOR! (lapor.go.id)
5. Dokumentasi yang diperlukan
6. Proses internal sebelum pelaporan
7. Perlindungan pelapor
8. Koordinasi dengan pihak berwenang`
      },
      {
        id: "PCK-RSP-002",
        phaseId: "respon",
        kode: "PCK-RSP-002",
        nama: "Panduan Aksi Kolektif Anti-Korupsi",
        namaEn: "Collective Action Guidelines",
        kategori: "Pedoman",
        deskripsi: "Panduan partisipasi dalam gerakan anti-korupsi bersama",
        penanggungJawab: "Fungsi Kepatuhan",
        frekuensi: "Review tahunan",
        tingkatKritis: "Pendukung",
        dasarHukum: "Panduan CEK KPK",
        promptTemplate: `Buatkan Panduan Aksi Kolektif Anti-Korupsi:
1. Pengertian aksi kolektif
2. Manfaat partisipasi
3. Bentuk-bentuk aksi kolektif:
   - Integrity pact
   - Business integrity forum
   - Industry-wide initiatives
4. Prosedur bergabung
5. Komitmen yang diperlukan
6. Monitoring dan pelaporan`
      }
    ]
  }
];

// Helper functions
export function getPancekPhaseById(id: string): PancekPhase | undefined {
  return PANCEK_PHASES.find(p => p.id === id);
}

export function getPancekDocumentsByPhase(phaseId: string): PancekDocument[] {
  const phase = getPancekPhaseById(phaseId);
  return phase?.documents || [];
}

export function getAllPancekDocuments(): PancekDocument[] {
  return PANCEK_PHASES.flatMap(p => p.documents);
}

export function getPancekChecklistByPhase(phaseId: string): PancekChecklistItem[] {
  const phase = getPancekPhaseById(phaseId);
  return phase?.checklistItems || [];
}

export function getAllPancekChecklistItems(): PancekChecklistItem[] {
  return PANCEK_PHASES.flatMap(p => p.checklistItems);
}

// Statistics
export function getPancekStats() {
  const totalDocuments = getAllPancekDocuments().length;
  const totalChecklistItems = getAllPancekChecklistItems().length;
  const requiredItems = getAllPancekChecklistItems().filter(i => i.required).length;
  
  return {
    totalPhases: PANCEK_PHASES.length,
    totalDocuments,
    totalChecklistItems,
    requiredItems,
    optionalItems: totalChecklistItems - requiredItems
  };
}
