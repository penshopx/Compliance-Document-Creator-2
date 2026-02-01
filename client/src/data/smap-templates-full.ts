export interface SMAPTemplate {
  id: string;
  kode: string;
  nama: string;
  namaEn: string;
  kategori: string;
  klausul: string;
  subKlausul?: string;
  deskripsi: string;
  penanggungJawab: string;
  frekuensi: string;
  tingkatKritis: "Wajib" | "Penting" | "Pendukung";
  areaBisnis: string[];
  promptTemplate: string;
}

export const KATEGORI_DOKUMEN = [
  "Pedoman",
  "Kebijakan", 
  "SK",
  "SOP",
  "Instruksi Kerja",
  "Formulir",
  "Register",
  "Laporan",
  "Berita Acara",
  "Matriks",
  "Program",
  "Checklist",
] as const;

export const KLAUSUL_ISO = [
  { kode: "4", nama: "Konteks Organisasi" },
  { kode: "4.1", nama: "Memahami Organisasi dan Konteksnya" },
  { kode: "4.2", nama: "Memahami Kebutuhan dan Harapan Pemangku Kepentingan" },
  { kode: "4.3", nama: "Menentukan Ruang Lingkup SMAP" },
  { kode: "4.4", nama: "Sistem Manajemen Anti Penyuapan" },
  { kode: "4.5", nama: "Penilaian Risiko Penyuapan" },
  { kode: "5", nama: "Kepemimpinan" },
  { kode: "5.1", nama: "Kepemimpinan dan Komitmen" },
  { kode: "5.2", nama: "Kebijakan Anti Penyuapan" },
  { kode: "5.3", nama: "Peran, Tanggung Jawab dan Wewenang Organisasi" },
  { kode: "5.3.1", nama: "Organ Pengelola" },
  { kode: "5.3.2", nama: "Fungsi Kepatuhan Anti Penyuapan" },
  { kode: "5.3.3", nama: "Pengambilan Keputusan yang Didelegasikan" },
  { kode: "6", nama: "Perencanaan" },
  { kode: "6.1", nama: "Tindakan untuk Menangani Risiko dan Peluang" },
  { kode: "6.2", nama: "Sasaran Anti Penyuapan dan Perencanaan" },
  { kode: "7", nama: "Dukungan" },
  { kode: "7.1", nama: "Sumber Daya" },
  { kode: "7.2", nama: "Kompetensi" },
  { kode: "7.2.1", nama: "Umum" },
  { kode: "7.2.2", nama: "Proses Perekrutan" },
  { kode: "7.2.2.1", nama: "Uji Tuntas Personel" },
  { kode: "7.2.2.2", nama: "Bonus Kinerja dan Penghargaan" },
  { kode: "7.2.2.3", nama: "Komitmen Personel" },
  { kode: "7.3", nama: "Kepedulian dan Pelatihan" },
  { kode: "7.4", nama: "Komunikasi" },
  { kode: "7.5", nama: "Informasi Terdokumentasi" },
  { kode: "7.5.1", nama: "Umum" },
  { kode: "7.5.2", nama: "Membuat dan Memperbarui" },
  { kode: "7.5.3", nama: "Pengendalian Informasi Terdokumentasi" },
  { kode: "8", nama: "Operasi" },
  { kode: "8.1", nama: "Perencanaan dan Pengendalian Operasi" },
  { kode: "8.2", nama: "Uji Tuntas" },
  { kode: "8.3", nama: "Pengendalian Keuangan" },
  { kode: "8.4", nama: "Pengendalian Non-Keuangan" },
  { kode: "8.5", nama: "Penerapan Pengendalian Anti Penyuapan oleh Organisasi Terkendali" },
  { kode: "8.6", nama: "Komitmen Anti Penyuapan" },
  { kode: "8.7", nama: "Hadiah, Keramahtamahan, Donasi, dan Manfaat Serupa" },
  { kode: "8.8", nama: "Mengelola Ketidakcukupan Pengendalian Anti Penyuapan" },
  { kode: "8.9", nama: "Menyampaikan Kekhawatiran" },
  { kode: "8.10", nama: "Investigasi dan Penanganan Penyuapan" },
  { kode: "9", nama: "Evaluasi Kinerja" },
  { kode: "9.1", nama: "Pemantauan, Pengukuran, Analisis dan Evaluasi" },
  { kode: "9.2", nama: "Audit Internal" },
  { kode: "9.3", nama: "Tinjauan Manajemen" },
  { kode: "9.4", nama: "Tinjauan Fungsi Kepatuhan Anti Penyuapan" },
  { kode: "10", nama: "Perbaikan" },
  { kode: "10.1", nama: "Ketidaksesuaian dan Tindakan Korektif" },
  { kode: "10.2", nama: "Perbaikan Berkelanjutan" },
] as const;

export const AREA_BISNIS = [
  "Pengadaan",
  "Proyek",
  "Keuangan",
  "SDM",
  "Operasional",
  "Pemasaran",
  "Perizinan",
  "Legal",
  "IT",
  "Audit",
  "Kepatuhan",
  "Manajemen",
  "Vendor",
  "Pelanggan",
  "Pemerintah",
  "Subkontraktor",
] as const;

export const SMAP_TEMPLATES: SMAPTemplate[] = [
  // ============================================
  // KLAUSUL 4 - KONTEKS ORGANISASI (25 templates)
  // ============================================
  {
    id: "T001",
    kode: "PED-SMAP-001",
    nama: "Pedoman Sistem Manajemen Anti Penyuapan",
    namaEn: "Anti-Bribery Management System Manual",
    kategori: "Pedoman",
    klausul: "4-10",
    deskripsi: "Dokumen induk yang menjelaskan keseluruhan sistem manajemen anti penyuapan organisasi",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan Pedoman SMAP untuk [NAMA PERUSAHAAN] yang mencakup:
1. Pendahuluan dan ruang lingkup
2. Referensi normatif (SNI ISO 37001:2016, UU Tipikor)
3. Istilah dan definisi
4. Konteks organisasi
5. Kepemimpinan dan komitmen
6. Perencanaan SMAP
7. Dukungan dan sumber daya
8. Operasi dan pengendalian
9. Evaluasi kinerja
10. Perbaikan berkelanjutan`,
  },
  {
    id: "T002",
    kode: "DOK-KON-001",
    nama: "Analisis Konteks Internal Organisasi",
    namaEn: "Internal Context Analysis",
    kategori: "Laporan",
    klausul: "4.1",
    deskripsi: "Dokumen analisis faktor internal yang mempengaruhi SMAP organisasi",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Manajemen", "Kepatuhan"],
    promptTemplate: `Buatkan Analisis Konteks Internal untuk SMAP [NAMA PERUSAHAAN]:
1. Visi, misi, dan nilai-nilai organisasi
2. Struktur organisasi dan governance
3. Budaya organisasi terkait integritas
4. Kemampuan sumber daya (SDM, keuangan, teknologi)
5. Sistem dan proses bisnis yang ada
6. Identifikasi kelemahan internal terkait risiko penyuapan`,
  },
  {
    id: "T003",
    kode: "DOK-KON-002",
    nama: "Analisis Konteks Eksternal Organisasi",
    namaEn: "External Context Analysis",
    kategori: "Laporan",
    klausul: "4.1",
    deskripsi: "Dokumen analisis faktor eksternal yang mempengaruhi SMAP organisasi",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Manajemen", "Legal"],
    promptTemplate: `Buatkan Analisis Konteks Eksternal untuk SMAP [NAMA PERUSAHAAN]:
1. Kondisi politik dan regulasi terkait anti korupsi
2. Kondisi ekonomi sektor konstruksi
3. Budaya bisnis dan praktik industri
4. Persyaratan hukum dan peraturan (UU Tipikor, Permen PU)
5. Hubungan dengan pemangku kepentingan eksternal
6. Tren dan perkembangan global anti penyuapan`,
  },
  {
    id: "T004",
    kode: "REG-STK-001",
    nama: "Register Pemangku Kepentingan",
    namaEn: "Stakeholder Register",
    kategori: "Register",
    klausul: "4.2",
    deskripsi: "Daftar pemangku kepentingan dan kebutuhan mereka terkait SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Manajemen", "Kepatuhan"],
    promptTemplate: `Buatkan Register Pemangku Kepentingan SMAP untuk [NAMA PERUSAHAAN]:
Kolom: No | Pemangku Kepentingan | Kategori (Internal/Eksternal) | Kebutuhan & Harapan | Kepentingan terhadap SMAP | Pengaruh | Strategi Komunikasi`,
  },
  {
    id: "T005",
    kode: "DOK-RLS-001",
    nama: "Dokumen Ruang Lingkup SMAP",
    namaEn: "ABMS Scope Document",
    kategori: "Pedoman",
    klausul: "4.3",
    deskripsi: "Dokumen yang menetapkan batasan dan penerapan SMAP organisasi",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan Dokumen Ruang Lingkup SMAP untuk [NAMA PERUSAHAAN]:
1. Batasan geografis penerapan
2. Unit/divisi yang tercakup
3. Aktivitas bisnis yang tercakup
4. Pengecualian dan alasannya
5. Jenis transaksi yang termasuk
6. Hubungan dengan pihak ketiga`,
  },
  {
    id: "T006",
    kode: "SOP-RIS-001",
    nama: "SOP Penilaian Risiko Penyuapan",
    namaEn: "Bribery Risk Assessment SOP",
    kategori: "SOP",
    klausul: "4.5",
    deskripsi: "Prosedur standar untuk melakukan penilaian risiko penyuapan",
    penanggungJawab: "FKAP",
    frekuensi: "Berkala",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Audit"],
    promptTemplate: `Buatkan SOP Penilaian Risiko Penyuapan untuk [NAMA PERUSAHAAN]:
1. Tujuan dan ruang lingkup
2. Referensi (ISO 37001:2016 klausul 4.5)
3. Definisi dan istilah
4. Tanggung jawab (FKAP, Manajemen, Unit Kerja)
5. Prosedur:
   - Identifikasi risiko penyuapan
   - Analisis risiko (likelihood x impact)
   - Evaluasi risiko
   - Penetapan mitigasi
   - Dokumentasi dan pelaporan
6. Kriteria penilaian risiko
7. Formulir terkait`,
  },
  {
    id: "T007",
    kode: "REG-RIS-001",
    nama: "Register Risiko Penyuapan",
    namaEn: "Bribery Risk Register",
    kategori: "Register",
    klausul: "4.5",
    deskripsi: "Daftar risiko penyuapan yang teridentifikasi beserta mitigasinya",
    penanggungJawab: "FKAP",
    frekuensi: "Semester",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Audit", "Manajemen"],
    promptTemplate: `Buatkan Register Risiko Penyuapan untuk [NAMA PERUSAHAAN]:
Kolom: No | Risiko | Kategori | Sumber Risiko | Dampak | Likelihood | Severity | Risk Level | Pengendalian Existing | Gap | Mitigasi Tambahan | PIC | Target | Status`,
  },
  {
    id: "T008",
    kode: "FOR-RIS-001",
    nama: "Formulir Identifikasi Risiko Penyuapan",
    namaEn: "Bribery Risk Identification Form",
    kategori: "Formulir",
    klausul: "4.5",
    deskripsi: "Formulir untuk mengidentifikasi risiko penyuapan di unit kerja",
    penanggungJawab: "Unit Kerja",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Operasional"],
    promptTemplate: `Buatkan Formulir Identifikasi Risiko Penyuapan:
- Header: Nama Unit/Divisi, Periode, Tanggal Assessment
- Bagian 1: Identifikasi aktivitas berisiko
- Bagian 2: Pihak-pihak yang terlibat
- Bagian 3: Jenis risiko penyuapan potensial
- Bagian 4: Pengendalian yang ada
- Bagian 5: Usulan mitigasi
- Tanda tangan: Pengisi, Kepala Unit, Validator FKAP`,
  },
  {
    id: "T009",
    kode: "MAT-RIS-001",
    nama: "Matriks Risiko Penyuapan",
    namaEn: "Bribery Risk Matrix",
    kategori: "Matriks",
    klausul: "4.5",
    deskripsi: "Matriks pemetaan risiko penyuapan berdasarkan likelihood dan impact",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan Matriks Risiko Penyuapan 5x5:
- Sumbu X: Likelihood (1-5: Sangat Jarang, Jarang, Mungkin, Sering, Hampir Pasti)
- Sumbu Y: Impact (1-5: Sangat Rendah, Rendah, Sedang, Tinggi, Sangat Tinggi)
- Zona Risiko: Rendah (Hijau), Sedang (Kuning), Tinggi (Oranye), Ekstrem (Merah)
- Kriteria penilaian untuk masing-masing level
- Tindakan yang diperlukan per zona risiko`,
  },
  {
    id: "T010",
    kode: "LAP-RIS-001",
    nama: "Laporan Penilaian Risiko Penyuapan",
    namaEn: "Bribery Risk Assessment Report",
    kategori: "Laporan",
    klausul: "4.5",
    deskripsi: "Laporan hasil penilaian risiko penyuapan organisasi",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan Laporan Penilaian Risiko Penyuapan untuk [NAMA PERUSAHAAN]:
1. Ringkasan Eksekutif
2. Metodologi penilaian
3. Hasil identifikasi risiko
4. Analisis dan evaluasi risiko
5. Profil risiko organisasi
6. Area dengan risiko tinggi
7. Rekomendasi mitigasi
8. Rencana tindak lanjut
9. Lampiran (register risiko, evidence)`,
  },
  {
    id: "T011",
    kode: "CHK-RIS-001",
    nama: "Checklist Penilaian Risiko Penyuapan",
    namaEn: "Bribery Risk Assessment Checklist",
    kategori: "Checklist",
    klausul: "4.5",
    deskripsi: "Checklist untuk memastikan kelengkapan penilaian risiko penyuapan",
    penanggungJawab: "FKAP",
    frekuensi: "Per Assessment",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan", "Audit"],
    promptTemplate: `Buatkan Checklist Penilaian Risiko Penyuapan:
- Persiapan assessment
- Tim penilai
- Data dan dokumen yang diperlukan
- Tahapan identifikasi risiko
- Tahapan analisis risiko
- Validasi dengan unit kerja
- Dokumentasi hasil
- Review dan persetujuan`,
  },
  {
    id: "T012",
    kode: "FOR-RIS-002",
    nama: "Formulir Review Risiko Berkala",
    namaEn: "Periodic Risk Review Form",
    kategori: "Formulir",
    klausul: "4.5",
    deskripsi: "Formulir untuk review dan update risiko penyuapan secara berkala",
    penanggungJawab: "FKAP",
    frekuensi: "Kuartal",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Formulir Review Risiko Berkala:
- Periode review
- Risiko yang direview
- Status pengendalian
- Perubahan kondisi/konteks
- Insiden yang terjadi
- Efektivitas mitigasi
- Risiko baru yang teridentifikasi
- Rekomendasi update`,
  },
  {
    id: "T013",
    kode: "IK-RIS-001",
    nama: "Instruksi Kerja Identifikasi Red Flags",
    namaEn: "Red Flags Identification Work Instruction",
    kategori: "Instruksi Kerja",
    klausul: "4.5",
    deskripsi: "Panduan teknis untuk mengidentifikasi tanda-tanda potensi penyuapan",
    penanggungJawab: "FKAP",
    frekuensi: "Berkelanjutan",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan", "Operasional", "Pengadaan"],
    promptTemplate: `Buatkan Instruksi Kerja Identifikasi Red Flags Penyuapan:
1. Red flags dalam pengadaan
2. Red flags dalam proyek
3. Red flags dalam perizinan
4. Red flags dalam hubungan vendor
5. Red flags dalam transaksi keuangan
6. Tindakan yang harus dilakukan saat menemukan red flags
7. Eskalasi dan pelaporan`,
  },
  {
    id: "T014",
    kode: "REG-RIS-002",
    nama: "Register Titik Rawan Penyuapan",
    namaEn: "Bribery Vulnerability Points Register",
    kategori: "Register",
    klausul: "4.5",
    deskripsi: "Daftar titik-titik rawan penyuapan dalam proses bisnis",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Operasional"],
    promptTemplate: `Buatkan Register Titik Rawan Penyuapan untuk [NAMA PERUSAHAAN]:
Kolom: No | Proses Bisnis | Titik Rawan | Modus Penyuapan Potensial | Pihak Terlibat | Level Risiko | Pengendalian | PIC`,
  },
  {
    id: "T015",
    kode: "DOK-KON-003",
    nama: "Analisis PESTLE Anti Penyuapan",
    namaEn: "Anti-Bribery PESTLE Analysis",
    kategori: "Laporan",
    klausul: "4.1",
    deskripsi: "Analisis faktor Politik, Ekonomi, Sosial, Teknologi, Legal, Lingkungan terkait SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Penting",
    areaBisnis: ["Manajemen", "Legal"],
    promptTemplate: `Buatkan Analisis PESTLE Anti Penyuapan:
- Political: Kebijakan anti korupsi pemerintah, tekanan politik
- Economic: Kondisi ekonomi, persaingan bisnis
- Social: Budaya gratifikasi, toleransi terhadap suap
- Technological: Sistem deteksi, digitalisasi proses
- Legal: UU Tipikor, regulasi sektoral
- Environmental: Dampak lingkungan proyek, izin lingkungan`,
  },
  {
    id: "T016",
    kode: "DOK-KON-004",
    nama: "Analisis SWOT SMAP",
    namaEn: "ABMS SWOT Analysis",
    kategori: "Laporan",
    klausul: "4.1",
    deskripsi: "Analisis Strengths, Weaknesses, Opportunities, Threats SMAP organisasi",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Penting",
    areaBisnis: ["Manajemen", "Kepatuhan"],
    promptTemplate: `Buatkan Analisis SWOT SMAP untuk [NAMA PERUSAHAAN]:
- Strengths: Kekuatan internal dalam penerapan anti penyuapan
- Weaknesses: Kelemahan internal yang perlu diperbaiki
- Opportunities: Peluang untuk memperkuat SMAP
- Threats: Ancaman eksternal terhadap efektivitas SMAP`,
  },
  {
    id: "T017",
    kode: "FOR-STK-001",
    nama: "Formulir Survei Harapan Pemangku Kepentingan",
    namaEn: "Stakeholder Expectation Survey Form",
    kategori: "Formulir",
    klausul: "4.2",
    deskripsi: "Formulir untuk mengumpulkan harapan pemangku kepentingan terhadap SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Pendukung",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan Formulir Survei Harapan Pemangku Kepentingan:
- Identitas responden (opsional untuk anonimitas)
- Kategori pemangku kepentingan
- Pemahaman tentang SMAP organisasi
- Harapan terhadap penerapan anti penyuapan
- Saran perbaikan
- Tingkat kepuasan`,
  },
  {
    id: "T018",
    kode: "DOK-KON-005",
    nama: "Peta Proses Bisnis SMAP",
    namaEn: "ABMS Business Process Map",
    kategori: "Pedoman",
    klausul: "4.4",
    deskripsi: "Dokumentasi proses-proses utama dalam SMAP dan integrasinya",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan", "Operasional"],
    promptTemplate: `Buatkan Peta Proses Bisnis SMAP untuk [NAMA PERUSAHAAN]:
1. Proses perencanaan SMAP
2. Proses penilaian risiko
3. Proses pengendalian operasional
4. Proses uji tuntas
5. Proses pelaporan dan investigasi
6. Proses audit dan evaluasi
7. Interaksi antar proses
8. Input dan output setiap proses`,
  },
  {
    id: "T019",
    kode: "MAT-KON-001",
    nama: "Matriks Keterkaitan Klausul ISO 37001",
    namaEn: "ISO 37001 Clause Relationship Matrix",
    kategori: "Matriks",
    klausul: "4.4",
    deskripsi: "Matriks yang menunjukkan keterkaitan antar klausul ISO 37001",
    penanggungJawab: "FKAP",
    frekuensi: "Sekali",
    tingkatKritis: "Pendukung",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Matriks Keterkaitan Klausul ISO 37001:2016:
- Baris dan kolom: Klausul 4-10 dan sub-klausulnya
- Isi: Keterkaitan (Input, Output, Referensi, Pengaruh)
- Penjelasan keterkaitan utama
- Sequence penerapan yang disarankan`,
  },
  {
    id: "T020",
    kode: "REG-RIS-003",
    nama: "Register Modus Operandi Penyuapan",
    namaEn: "Bribery Modus Operandi Register",
    kategori: "Register",
    klausul: "4.5",
    deskripsi: "Daftar modus operandi penyuapan yang mungkin terjadi di industri",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan", "Audit"],
    promptTemplate: `Buatkan Register Modus Operandi Penyuapan untuk Industri Konstruksi:
Kolom: No | Modus | Deskripsi | Area Risiko | Pihak Terlibat | Indikator | Pengendalian`,
  },
  {
    id: "T021",
    kode: "LAP-KON-001",
    nama: "Laporan Analisis Gap SMAP",
    namaEn: "ABMS Gap Analysis Report",
    kategori: "Laporan",
    klausul: "4.4",
    deskripsi: "Laporan analisis kesenjangan antara kondisi saat ini dengan persyaratan ISO 37001",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan Laporan Gap Analysis SMAP untuk [NAMA PERUSAHAAN]:
1. Metodologi gap analysis
2. Hasil assessment per klausul ISO 37001
3. Tingkat kematangan saat ini
4. Gap yang teridentifikasi
5. Prioritas perbaikan
6. Rencana aksi
7. Timeline implementasi`,
  },
  {
    id: "T022",
    kode: "CHK-KON-001",
    nama: "Checklist Kesesuaian ISO 37001",
    namaEn: "ISO 37001 Compliance Checklist",
    kategori: "Checklist",
    klausul: "4.4",
    deskripsi: "Checklist untuk menilai kesesuaian dengan persyaratan ISO 37001",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Audit"],
    promptTemplate: `Buatkan Checklist Kesesuaian ISO 37001:2016:
Per klausul (4.1-10.2):
- Persyaratan
- Bukti yang diperlukan
- Status (Sesuai/Tidak Sesuai/Partial)
- Catatan
- Referensi dokumen`,
  },
  {
    id: "T023",
    kode: "FOR-KON-001",
    nama: "Formulir Perubahan Konteks Organisasi",
    namaEn: "Organization Context Change Form",
    kategori: "Formulir",
    klausul: "4.1",
    deskripsi: "Formulir untuk mendokumentasikan perubahan konteks yang mempengaruhi SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Ad-hoc",
    tingkatKritis: "Pendukung",
    areaBisnis: ["Manajemen", "Kepatuhan"],
    promptTemplate: `Buatkan Formulir Perubahan Konteks Organisasi:
- Tanggal perubahan
- Jenis perubahan (internal/eksternal)
- Deskripsi perubahan
- Dampak terhadap SMAP
- Tindakan yang diperlukan
- PIC
- Status implementasi`,
  },
  {
    id: "T024",
    kode: "REG-STK-002",
    nama: "Register Persyaratan Legal Anti Penyuapan",
    namaEn: "Anti-Bribery Legal Requirements Register",
    kategori: "Register",
    klausul: "4.2",
    deskripsi: "Daftar peraturan dan persyaratan hukum terkait anti penyuapan",
    penanggungJawab: "Legal",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Legal", "Kepatuhan"],
    promptTemplate: `Buatkan Register Persyaratan Legal Anti Penyuapan:
Kolom: No | Peraturan | Tahun | Ruang Lingkup | Persyaratan Utama | Sanksi | Status Kepatuhan | PIC`,
  },
  {
    id: "T025",
    kode: "DOK-KON-006",
    nama: "Profil Risiko Penyuapan Organisasi",
    namaEn: "Organization Bribery Risk Profile",
    kategori: "Laporan",
    klausul: "4.5",
    deskripsi: "Dokumen profil risiko penyuapan menyeluruh organisasi",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan Profil Risiko Penyuapan untuk [NAMA PERUSAHAAN]:
1. Ringkasan profil organisasi
2. Karakteristik industri dan risiko inheren
3. Peta risiko penyuapan
4. Area dengan risiko tertinggi
5. Pengendalian utama
6. Residual risk assessment
7. Risk appetite dan tolerance
8. Rencana mitigasi prioritas`,
  },

  // ============================================
  // KLAUSUL 5 - KEPEMIMPINAN (30 templates)
  // ============================================
  {
    id: "T026",
    kode: "SK-DIR-001",
    nama: "SK Komitmen Anti Penyuapan Direksi",
    namaEn: "Director's Anti-Bribery Commitment Decree",
    kategori: "SK",
    klausul: "5.1",
    deskripsi: "Surat Keputusan Direksi tentang komitmen anti penyuapan",
    penanggungJawab: "Direksi",
    frekuensi: "Sekali",
    tingkatKritis: "Wajib",
    areaBisnis: ["Manajemen"],
    promptTemplate: `Buatkan SK Komitmen Anti Penyuapan Direksi untuk [NAMA PERUSAHAAN]:
- Nomor SK
- Konsiderans (menimbang, mengingat)
- Pernyataan komitmen direksi
- Tanggung jawab direksi dalam SMAP
- Instruksi kepada jajaran manajemen
- Tanggal berlaku
- Tanda tangan [DIREKTUR UTAMA]`,
  },
  {
    id: "T027",
    kode: "KEB-AP-001",
    nama: "Kebijakan Anti Penyuapan",
    namaEn: "Anti-Bribery Policy",
    kategori: "Kebijakan",
    klausul: "5.2",
    deskripsi: "Kebijakan utama anti penyuapan organisasi sesuai klausul 5.2",
    penanggungJawab: "Direksi",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan Kebijakan Anti Penyuapan untuk [NAMA PERUSAHAAN]:
1. Pernyataan komitmen manajemen puncak
2. Definisi penyuapan
3. Ruang lingkup kebijakan
4. Larangan segala bentuk penyuapan
5. Tanggung jawab personel
6. Konsekuensi pelanggaran
7. Mekanisme pelaporan
8. Review dan pembaruan kebijakan
9. Tanda tangan [DIREKTUR UTAMA]`,
  },
  {
    id: "T028",
    kode: "SK-FKAP-001",
    nama: "SK Penetapan Tim FKAP",
    namaEn: "Anti-Bribery Compliance Function Appointment Decree",
    kategori: "SK",
    klausul: "5.3.2",
    deskripsi: "Surat Keputusan penetapan Fungsi Kepatuhan Anti Penyuapan",
    penanggungJawab: "Direksi",
    frekuensi: "Sekali/Update",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan SK Penetapan Tim FKAP untuk [NAMA PERUSAHAAN]:
- Nomor SK
- Dasar hukum (ISO 37001, Permen PU 08/2022)
- Susunan Tim FKAP:
  * Ketua: [KETUA FKAP]
  * Sekretaris: [SEKRETARIS FKAP]
  * Anggota: [ANGGOTA FKAP]
- Tugas dan wewenang
- Masa berlaku
- Anggaran operasional
- Tanda tangan [DIREKTUR UTAMA]`,
  },
  {
    id: "T029",
    kode: "DOK-KEP-001",
    nama: "Uraian Tugas FKAP",
    namaEn: "ABCF Job Description",
    kategori: "Pedoman",
    klausul: "5.3.2",
    deskripsi: "Dokumen uraian tugas, tanggung jawab, dan wewenang FKAP",
    penanggungJawab: "FKAP",
    frekuensi: "Sekali",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Uraian Tugas FKAP untuk [NAMA PERUSAHAAN]:
1. Posisi dalam struktur organisasi
2. Tugas pokok:
   - Mengawasi penerapan SMAP
   - Memberikan saran tentang anti penyuapan
   - Memastikan kesesuaian dengan ISO 37001
3. Tanggung jawab
4. Wewenang
5. Jalur pelaporan
6. Kompetensi yang dipersyaratkan
7. Sumber daya yang dialokasikan`,
  },
  {
    id: "T030",
    kode: "MAT-TJW-001",
    nama: "Matriks Tanggung Jawab SMAP (RACI)",
    namaEn: "ABMS Responsibility Matrix (RACI)",
    kategori: "Matriks",
    klausul: "5.3",
    deskripsi: "Matriks RACI untuk aktivitas-aktivitas dalam SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan Matriks RACI SMAP untuk [NAMA PERUSAHAAN]:
Kolom: Aktivitas SMAP | Direksi | FKAP | Audit Internal | Unit Kerja | SDM | Legal | Keuangan
Aktivitas mencakup:
- Penilaian risiko
- Penetapan kebijakan
- Uji tuntas
- Pelatihan
- Investigasi
- Audit internal
- Tinjauan manajemen`,
  },
  {
    id: "T031",
    kode: "DOK-KEP-002",
    nama: "Struktur Organisasi SMAP",
    namaEn: "ABMS Organization Structure",
    kategori: "Pedoman",
    klausul: "5.3",
    deskripsi: "Dokumentasi struktur organisasi pengelolaan SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Manajemen", "Kepatuhan"],
    promptTemplate: `Buatkan Dokumen Struktur Organisasi SMAP:
1. Bagan struktur organisasi SMAP
2. Posisi Dewan Komisaris/Organ Pengelola
3. Posisi Direksi
4. Posisi FKAP
5. Posisi Audit Internal
6. Hubungan dengan unit kerja
7. Jalur pelaporan
8. Mekanisme koordinasi`,
  },
  {
    id: "T032",
    kode: "FOR-KMT-001",
    nama: "Formulir Pernyataan Komitmen Direksi",
    namaEn: "Directors Commitment Statement Form",
    kategori: "Formulir",
    klausul: "5.1",
    deskripsi: "Formulir pernyataan komitmen anti penyuapan yang ditandatangani direksi",
    penanggungJawab: "Direksi",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Manajemen"],
    promptTemplate: `Buatkan Formulir Pernyataan Komitmen Direksi:
"Saya yang bertanda tangan di bawah ini menyatakan:
1. Berkomitmen penuh terhadap penerapan SMAP
2. Memberikan sumber daya yang memadai
3. Menjadi teladan dalam perilaku anti penyuapan
4. Tidak akan mentoleransi segala bentuk penyuapan
5. Mendukung pelaporan tanpa takut retaliasi"
Tanda tangan: [DIREKTUR UTAMA]`,
  },
  {
    id: "T033",
    kode: "FOR-KMT-002",
    nama: "Formulir Pernyataan Komitmen Komisaris",
    namaEn: "Commissioners Commitment Statement Form",
    kategori: "Formulir",
    klausul: "5.3.1",
    deskripsi: "Formulir pernyataan komitmen anti penyuapan Dewan Komisaris",
    penanggungJawab: "Komisaris",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Manajemen"],
    promptTemplate: `Buatkan Formulir Pernyataan Komitmen Dewan Komisaris:
"Sebagai organ pengawas, kami Dewan Komisaris menyatakan:
1. Mengawasi penerapan SMAP oleh Direksi
2. Memastikan tersedianya kebijakan anti penyuapan
3. Menerima laporan kinerja SMAP secara berkala
4. Memastikan independensi FKAP
5. Memberikan arahan strategis anti penyuapan"`,
  },
  {
    id: "T034",
    kode: "SOP-DEL-001",
    nama: "SOP Pendelegasian Wewenang",
    namaEn: "Authority Delegation SOP",
    kategori: "SOP",
    klausul: "5.3.3",
    deskripsi: "Prosedur pendelegasian wewenang pengambilan keputusan",
    penanggungJawab: "Direksi",
    frekuensi: "Sekali",
    tingkatKritis: "Wajib",
    areaBisnis: ["Manajemen", "Operasional"],
    promptTemplate: `Buatkan SOP Pendelegasian Wewenang untuk [NAMA PERUSAHAAN]:
1. Tujuan dan ruang lingkup
2. Prinsip pendelegasian (anti penyuapan)
3. Jenis wewenang yang dapat didelegasikan
4. Batasan pendelegasian
5. Prosedur pendelegasian
6. Dokumentasi dan pencatatan
7. Monitoring dan review
8. Pembatalan pendelegasian`,
  },
  {
    id: "T035",
    kode: "MAT-DEL-001",
    nama: "Matriks Pendelegasian Wewenang",
    namaEn: "Authority Delegation Matrix",
    kategori: "Matriks",
    klausul: "5.3.3",
    deskripsi: "Matriks yang menunjukkan pendelegasian wewenang dalam organisasi",
    penanggungJawab: "Direksi",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Manajemen", "Keuangan"],
    promptTemplate: `Buatkan Matriks Pendelegasian Wewenang:
Kolom: Jenis Keputusan | Dirut | Direktur | GM | Manager | Supervisor | Limit Nilai | Risiko Penyuapan
Jenis keputusan:
- Persetujuan kontrak
- Pembayaran
- Penunjukan vendor
- Pemberian hadiah
- Penandatanganan MoU`,
  },
  {
    id: "T036",
    kode: "KEB-HAD-001",
    nama: "Kebijakan Hadiah dan Keramahtamahan",
    namaEn: "Gifts and Hospitality Policy",
    kategori: "Kebijakan",
    klausul: "8.7",
    subKlausul: "5.2",
    deskripsi: "Kebijakan tentang pemberian dan penerimaan hadiah serta keramahtamahan",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "SDM"],
    promptTemplate: `Buatkan Kebijakan Hadiah dan Keramahtamahan untuk [NAMA PERUSAHAAN]:
1. Tujuan dan ruang lingkup
2. Definisi hadiah dan keramahtamahan
3. Prinsip umum (transparansi, proporsionalitas)
4. Hadiah yang dilarang
5. Hadiah yang diperbolehkan
6. Batasan nilai (threshold)
7. Prosedur persetujuan
8. Pencatatan dan pelaporan
9. Konsekuensi pelanggaran`,
  },
  {
    id: "T037",
    kode: "KEB-DON-001",
    nama: "Kebijakan Donasi dan Sponsorship",
    namaEn: "Donations and Sponsorship Policy",
    kategori: "Kebijakan",
    klausul: "8.7",
    subKlausul: "5.2",
    deskripsi: "Kebijakan tentang pemberian donasi dan sponsorship",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Keuangan"],
    promptTemplate: `Buatkan Kebijakan Donasi dan Sponsorship untuk [NAMA PERUSAHAAN]:
1. Tujuan dan ruang lingkup
2. Definisi donasi dan sponsorship
3. Prinsip pemberian (good faith, transparansi)
4. Penerima yang diperbolehkan
5. Penerima yang dilarang
6. Prosedur pengajuan dan persetujuan
7. Batasan nilai
8. Dokumentasi dan pelaporan
9. Larangan quid pro quo`,
  },
  {
    id: "T038",
    kode: "KEB-KOI-001",
    nama: "Kebijakan Konflik Kepentingan",
    namaEn: "Conflict of Interest Policy",
    kategori: "Kebijakan",
    klausul: "8.7",
    subKlausul: "5.2",
    deskripsi: "Kebijakan tentang pengelolaan konflik kepentingan",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "SDM"],
    promptTemplate: `Buatkan Kebijakan Konflik Kepentingan untuk [NAMA PERUSAHAAN]:
1. Tujuan dan ruang lingkup
2. Definisi konflik kepentingan
3. Jenis-jenis konflik kepentingan
4. Kewajiban pengungkapan
5. Prosedur pengelolaan konflik
6. Recusal (mengundurkan diri dari keputusan)
7. Pencatatan dan dokumentasi
8. Konsekuensi pelanggaran`,
  },
  {
    id: "T039",
    kode: "KEB-POL-001",
    nama: "Kebijakan Kontribusi Politik",
    namaEn: "Political Contributions Policy",
    kategori: "Kebijakan",
    klausul: "8.7",
    subKlausul: "5.2",
    deskripsi: "Kebijakan tentang kontribusi politik perusahaan",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Legal"],
    promptTemplate: `Buatkan Kebijakan Kontribusi Politik untuk [NAMA PERUSAHAAN]:
1. Tujuan dan ruang lingkup
2. Posisi perusahaan terhadap politik
3. Larangan kontribusi politik atas nama perusahaan
4. Hak politik individu personel
5. Pemisahan aktivitas politik pribadi dan perusahaan
6. Prosedur jika ada permintaan
7. Dokumentasi dan pelaporan`,
  },
  {
    id: "T040",
    kode: "LAP-KEP-001",
    nama: "Laporan Kinerja FKAP ke Direksi",
    namaEn: "ABCF Performance Report to Directors",
    kategori: "Laporan",
    klausul: "5.3.2",
    deskripsi: "Laporan berkala kinerja FKAP kepada Direksi",
    penanggungJawab: "FKAP",
    frekuensi: "Kuartal",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan Template Laporan Kinerja FKAP:
1. Ringkasan eksekutif
2. Status penerapan SMAP
3. Aktivitas periode berjalan
4. Hasil penilaian risiko
5. Insiden dan pelaporan WBS
6. Status investigasi
7. Hasil audit dan tindak lanjut
8. Isu dan tantangan
9. Rekomendasi
10. Rencana periode berikutnya`,
  },
  {
    id: "T041",
    kode: "LAP-KEP-002",
    nama: "Laporan Kinerja SMAP ke Komisaris",
    namaEn: "ABMS Performance Report to Commissioners",
    kategori: "Laporan",
    klausul: "5.3.1",
    deskripsi: "Laporan kinerja SMAP kepada Dewan Komisaris",
    penanggungJawab: "Direksi",
    frekuensi: "Semester",
    tingkatKritis: "Wajib",
    areaBisnis: ["Manajemen"],
    promptTemplate: `Buatkan Template Laporan SMAP ke Dewan Komisaris:
1. Ringkasan eksekutif
2. Pencapaian sasaran anti penyuapan
3. Status kepatuhan terhadap kebijakan
4. Hasil audit internal
5. Insiden signifikan
6. Tindak lanjut rekomendasi sebelumnya
7. Rencana strategis ke depan
8. Kebutuhan dukungan dari Komisaris`,
  },
  {
    id: "T042",
    kode: "BA-RTM-001",
    nama: "Berita Acara Rapat Tinjauan Manajemen",
    namaEn: "Management Review Meeting Minutes",
    kategori: "Berita Acara",
    klausul: "9.3",
    subKlausul: "5.1",
    deskripsi: "Notulen rapat tinjauan manajemen SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Semester",
    tingkatKritis: "Wajib",
    areaBisnis: ["Manajemen", "Kepatuhan"],
    promptTemplate: `Buatkan Template Berita Acara RTM SMAP:
- Hari/tanggal/waktu/tempat
- Peserta rapat
- Agenda:
  1. Pembukaan oleh [DIREKTUR UTAMA]
  2. Laporan status SMAP oleh [KETUA FKAP]
  3. Hasil audit internal
  4. Perubahan konteks organisasi
  5. Umpan balik pemangku kepentingan
  6. Tindak lanjut RTM sebelumnya
  7. Rekomendasi perbaikan
- Keputusan dan tindak lanjut
- Penutup`,
  },
  {
    id: "T043",
    kode: "FOR-KEP-001",
    nama: "Formulir Agenda RTM SMAP",
    namaEn: "ABMS Management Review Agenda Form",
    kategori: "Formulir",
    klausul: "9.3",
    deskripsi: "Formulir agenda rapat tinjauan manajemen SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Per RTM",
    tingkatKritis: "Penting",
    areaBisnis: ["Manajemen"],
    promptTemplate: `Buatkan Formulir Agenda RTM SMAP:
- Tanggal dan waktu RTM
- Lokasi
- Undangan peserta
- Agenda pembahasan
- Dokumen pendukung yang disiapkan
- PIC presentasi per agenda
- Alokasi waktu`,
  },
  {
    id: "T044",
    kode: "CHK-KEP-001",
    nama: "Checklist Persiapan RTM",
    namaEn: "Management Review Preparation Checklist",
    kategori: "Checklist",
    klausul: "9.3",
    deskripsi: "Checklist kelengkapan persiapan RTM SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Per RTM",
    tingkatKritis: "Pendukung",
    areaBisnis: ["Manajemen"],
    promptTemplate: `Buatkan Checklist Persiapan RTM SMAP:
- Undangan sudah dikirim
- Materi presentasi siap
- Laporan kinerja SMAP
- Hasil audit internal
- Status tindak lanjut RTM sebelumnya
- Data statistik insiden
- Hasil survei kepuasan
- Ruangan dan peralatan
- Notulis`,
  },
  {
    id: "T045",
    kode: "SK-AUD-001",
    nama: "SK Penetapan Tim Audit Internal SMAP",
    namaEn: "ABMS Internal Audit Team Appointment Decree",
    kategori: "SK",
    klausul: "9.2",
    subKlausul: "5.3",
    deskripsi: "SK penetapan tim audit internal SMAP",
    penanggungJawab: "Direksi",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Audit", "Kepatuhan"],
    promptTemplate: `Buatkan SK Penetapan Tim Audit Internal SMAP:
- Nomor SK
- Dasar pertimbangan
- Susunan Tim:
  * Ketua Audit: [KETUA AUDIT]
  * Anggota: [ANGGOTA AUDIT]
- Tugas dan wewenang
- Independensi dan objektivitas
- Periode penugasan
- Anggaran
- Tanda tangan [DIREKTUR UTAMA]`,
  },
  {
    id: "T046",
    kode: "PRO-KOM-001",
    nama: "Program Komunikasi SMAP",
    namaEn: "ABMS Communication Program",
    kategori: "Program",
    klausul: "7.4",
    subKlausul: "5.1",
    deskripsi: "Program komunikasi untuk menyebarluaskan kebijakan anti penyuapan",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "SDM"],
    promptTemplate: `Buatkan Program Komunikasi SMAP untuk [NAMA PERUSAHAAN]:
1. Tujuan komunikasi
2. Target audiens (internal dan eksternal)
3. Pesan kunci
4. Media dan saluran komunikasi
5. Jadwal implementasi
6. PIC
7. Anggaran
8. Indikator keberhasilan`,
  },
  {
    id: "T047",
    kode: "FOR-KEP-002",
    nama: "Formulir Evaluasi Kinerja FKAP",
    namaEn: "ABCF Performance Evaluation Form",
    kategori: "Formulir",
    klausul: "5.3.2",
    deskripsi: "Formulir evaluasi kinerja Fungsi Kepatuhan Anti Penyuapan",
    penanggungJawab: "Direksi",
    frekuensi: "Tahunan",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan Formulir Evaluasi Kinerja FKAP:
- Periode evaluasi
- Nama personel FKAP
- Kriteria penilaian:
  1. Pengawasan penerapan SMAP
  2. Pemberian saran dan rekomendasi
  3. Penanganan laporan
  4. Kualitas dokumentasi
  5. Inisiatif perbaikan
- Skor (1-5) dan komentar
- Rencana pengembangan
- Tanda tangan penilai`,
  },
  {
    id: "T048",
    kode: "DOK-KEP-003",
    nama: "Piagam FKAP",
    namaEn: "ABCF Charter",
    kategori: "Pedoman",
    klausul: "5.3.2",
    deskripsi: "Piagam yang menetapkan mandat, wewenang, dan independensi FKAP",
    penanggungJawab: "Direksi",
    frekuensi: "Sekali",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Piagam FKAP untuk [NAMA PERUSAHAAN]:
1. Pendahuluan dan latar belakang
2. Visi dan misi FKAP
3. Mandat dan ruang lingkup
4. Struktur dan komposisi
5. Independensi dan objektivitas
6. Tugas dan tanggung jawab
7. Wewenang
8. Akses terhadap informasi
9. Pelaporan dan akuntabilitas
10. Review piagam`,
  },
  {
    id: "T049",
    kode: "IK-KEP-001",
    nama: "Instruksi Kerja Eskalasi Isu SMAP",
    namaEn: "ABMS Issue Escalation Work Instruction",
    kategori: "Instruksi Kerja",
    klausul: "5.3.2",
    deskripsi: "Panduan eskalasi isu anti penyuapan ke level manajemen yang tepat",
    penanggungJawab: "FKAP",
    frekuensi: "Sekali",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Instruksi Kerja Eskalasi Isu SMAP:
1. Kriteria isu yang perlu dieskalasi
2. Level eskalasi:
   - Level 1: FKAP
   - Level 2: Direksi
   - Level 3: Komisaris
3. Timeline eskalasi
4. Format pelaporan
5. Tindak lanjut yang diharapkan
6. Dokumentasi`,
  },
  {
    id: "T050",
    kode: "REG-KEP-001",
    nama: "Register Keputusan Manajemen SMAP",
    namaEn: "ABMS Management Decision Register",
    kategori: "Register",
    klausul: "5.1",
    deskripsi: "Daftar keputusan manajemen terkait SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Berkelanjutan",
    tingkatKritis: "Penting",
    areaBisnis: ["Manajemen", "Kepatuhan"],
    promptTemplate: `Buatkan Register Keputusan Manajemen SMAP:
Kolom: No | Tanggal | No Keputusan | Perihal | Pembuat Keputusan | Dasar | Status Implementasi | PIC | Catatan`,
  },
  {
    id: "T051",
    kode: "FOR-KEP-003",
    nama: "Formulir Permintaan Sumber Daya SMAP",
    namaEn: "ABMS Resource Request Form",
    kategori: "Formulir",
    klausul: "5.1",
    subKlausul: "7.1",
    deskripsi: "Formulir pengajuan sumber daya untuk aktivitas SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Ad-hoc",
    tingkatKritis: "Pendukung",
    areaBisnis: ["Kepatuhan", "Keuangan"],
    promptTemplate: `Buatkan Formulir Permintaan Sumber Daya SMAP:
- Tanggal pengajuan
- Pemohon
- Jenis sumber daya (SDM, dana, peralatan, pelatihan)
- Deskripsi kebutuhan
- Justifikasi
- Estimasi biaya
- Timeline
- Persetujuan FKAP
- Persetujuan Direksi`,
  },
  {
    id: "T052",
    kode: "KEB-WBS-001",
    nama: "Kebijakan Whistleblowing System",
    namaEn: "Whistleblowing System Policy",
    kategori: "Kebijakan",
    klausul: "8.9",
    subKlausul: "5.2",
    deskripsi: "Kebijakan sistem pelaporan pelanggaran (whistleblowing)",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "SDM"],
    promptTemplate: `Buatkan Kebijakan Whistleblowing System untuk [NAMA PERUSAHAAN]:
1. Tujuan dan ruang lingkup
2. Definisi whistleblowing
3. Perlindungan pelapor
4. Jaminan kerahasiaan
5. Saluran pelaporan
6. Hal-hal yang dapat dilaporkan
7. Larangan retaliasi
8. Proses penanganan laporan
9. Perlindungan dari laporan palsu`,
  },
  {
    id: "T053",
    kode: "KEB-INV-001",
    nama: "Kebijakan Investigasi Pelanggaran",
    namaEn: "Violation Investigation Policy",
    kategori: "Kebijakan",
    klausul: "8.10",
    subKlausul: "5.2",
    deskripsi: "Kebijakan tentang investigasi pelanggaran anti penyuapan",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Legal"],
    promptTemplate: `Buatkan Kebijakan Investigasi Pelanggaran untuk [NAMA PERUSAHAAN]:
1. Tujuan dan ruang lingkup
2. Prinsip investigasi (independen, objektif, konfidensial)
3. Kualifikasi investigator
4. Tahapan investigasi
5. Pengumpulan dan pengamanan bukti
6. Hak terlapor
7. Pelaporan hasil investigasi
8. Tindak lanjut
9. Dokumentasi dan arsip`,
  },
  {
    id: "T054",
    kode: "KEB-SAN-001",
    nama: "Kebijakan Sanksi Pelanggaran SMAP",
    namaEn: "ABMS Violation Sanctions Policy",
    kategori: "Kebijakan",
    klausul: "7.2.2.2",
    subKlausul: "5.2",
    deskripsi: "Kebijakan sanksi atas pelanggaran kebijakan anti penyuapan",
    penanggungJawab: "SDM",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["SDM", "Kepatuhan"],
    promptTemplate: `Buatkan Kebijakan Sanksi Pelanggaran SMAP untuk [NAMA PERUSAHAAN]:
1. Tujuan dan ruang lingkup
2. Jenis pelanggaran dan klasifikasi
3. Jenjang sanksi:
   - Teguran lisan
   - Teguran tertulis
   - Penurunan grade
   - Mutasi
   - Pemutusan hubungan kerja
4. Proses penjatuhan sanksi
5. Hak banding
6. Pencatatan dan pelaporan`,
  },
  {
    id: "T055",
    kode: "MAT-SAN-001",
    nama: "Matriks Sanksi Pelanggaran SMAP",
    namaEn: "ABMS Violation Sanctions Matrix",
    kategori: "Matriks",
    klausul: "7.2.2.2",
    deskripsi: "Matriks jenis pelanggaran dan sanksi yang sesuai",
    penanggungJawab: "SDM",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["SDM", "Kepatuhan"],
    promptTemplate: `Buatkan Matriks Sanksi Pelanggaran SMAP:
Kolom: Jenis Pelanggaran | Tingkat (Ringan/Sedang/Berat) | Sanksi Pertama | Sanksi Kedua | Sanksi Ketiga | Catatan
Jenis pelanggaran:
- Tidak melaporkan hadiah
- Konflik kepentingan tidak diungkap
- Menerima suap
- Memberikan suap
- Memalsukan dokumen`,
  },

  // ============================================
  // KLAUSUL 6 - PERENCANAAN (15 templates)
  // ============================================
  {
    id: "T056",
    kode: "DOK-SAS-001",
    nama: "Dokumen Sasaran Anti Penyuapan",
    namaEn: "Anti-Bribery Objectives Document",
    kategori: "Pedoman",
    klausul: "6.2",
    deskripsi: "Dokumen sasaran anti penyuapan dan rencana pencapaiannya",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan Dokumen Sasaran Anti Penyuapan untuk [NAMA PERUSAHAAN]:
1. Sasaran SMART:
   - Specific: Target yang jelas
   - Measurable: Indikator terukur
   - Achievable: Realistis
   - Relevant: Sesuai kebijakan
   - Time-bound: Tenggat waktu
2. Program pencapaian
3. Sumber daya
4. PIC
5. Monitoring dan evaluasi`,
  },
  {
    id: "T057",
    kode: "PRO-SAS-001",
    nama: "Program Kerja Anti Penyuapan Tahunan",
    namaEn: "Annual Anti-Bribery Work Program",
    kategori: "Program",
    klausul: "6.2",
    deskripsi: "Program kerja tahunan untuk mencapai sasaran anti penyuapan",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Program Kerja Anti Penyuapan Tahunan:
Kolom: No | Program | Sasaran | Indikator | Target | Q1 | Q2 | Q3 | Q4 | PIC | Anggaran | Status
Program mencakup:
- Penilaian risiko
- Pelatihan
- Komunikasi
- Audit
- Review kebijakan
- Uji tuntas`,
  },
  {
    id: "T058",
    kode: "REG-SAS-001",
    nama: "Register Sasaran dan Target SMAP",
    namaEn: "ABMS Objectives and Targets Register",
    kategori: "Register",
    klausul: "6.2",
    deskripsi: "Daftar sasaran dan target SMAP beserta status pencapaiannya",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Register Sasaran dan Target SMAP:
Kolom: No | Sasaran | Target | Indikator | Baseline | Realisasi | % Pencapaian | Status | Catatan`,
  },
  {
    id: "T059",
    kode: "FOR-SAS-001",
    nama: "Formulir Monitoring Sasaran SMAP",
    namaEn: "ABMS Objectives Monitoring Form",
    kategori: "Formulir",
    klausul: "6.2",
    deskripsi: "Formulir untuk monitoring pencapaian sasaran SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Kuartal",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Formulir Monitoring Sasaran SMAP:
- Periode monitoring
- Sasaran yang dimonitor
- Target
- Realisasi
- Gap/variance
- Analisis penyebab
- Rencana tindakan korektif
- Timeline
- PIC`,
  },
  {
    id: "T060",
    kode: "SOP-RIS-002",
    nama: "SOP Penanganan Risiko dan Peluang",
    namaEn: "Risk and Opportunity Treatment SOP",
    kategori: "SOP",
    klausul: "6.1",
    deskripsi: "Prosedur penanganan risiko dan pemanfaatan peluang SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Sekali",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan SOP Penanganan Risiko dan Peluang SMAP:
1. Tujuan dan ruang lingkup
2. Referensi (ISO 37001 klausul 6.1)
3. Prosedur:
   - Identifikasi risiko dan peluang
   - Analisis dan evaluasi
   - Pemilihan opsi penanganan
   - Implementasi tindakan
   - Monitoring efektivitas
4. Opsi penanganan risiko:
   - Menghindari
   - Mentransfer
   - Memitigasi
   - Menerima`,
  },
  {
    id: "T061",
    kode: "REG-PLG-001",
    nama: "Register Peluang Anti Penyuapan",
    namaEn: "Anti-Bribery Opportunities Register",
    kategori: "Register",
    klausul: "6.1",
    deskripsi: "Daftar peluang untuk meningkatkan efektivitas SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Register Peluang Anti Penyuapan:
Kolom: No | Peluang | Sumber | Potensi Manfaat | Tindakan | Timeline | PIC | Status`,
  },
  {
    id: "T062",
    kode: "LAP-SAS-001",
    nama: "Laporan Pencapaian Sasaran SMAP",
    namaEn: "ABMS Objectives Achievement Report",
    kategori: "Laporan",
    klausul: "6.2",
    deskripsi: "Laporan pencapaian sasaran anti penyuapan",
    penanggungJawab: "FKAP",
    frekuensi: "Semester",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan Laporan Pencapaian Sasaran SMAP:
1. Ringkasan eksekutif
2. Sasaran dan target periode ini
3. Realisasi per sasaran
4. Analisis gap
5. Hambatan dan tantangan
6. Tindakan perbaikan
7. Proyeksi pencapaian akhir tahun
8. Rekomendasi`,
  },
  {
    id: "T063",
    kode: "FOR-PER-001",
    nama: "Formulir Rencana Tindakan SMAP",
    namaEn: "ABMS Action Plan Form",
    kategori: "Formulir",
    klausul: "6.2",
    deskripsi: "Formulir perencanaan tindakan untuk mencapai sasaran SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Per Program",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Formulir Rencana Tindakan SMAP:
- Sasaran yang dituju
- Tindakan yang akan dilakukan
- Hasil yang diharapkan
- Sumber daya yang diperlukan
- Timeline (mulai-selesai)
- PIC
- Indikator keberhasilan
- Monitoring dan evaluasi`,
  },
  {
    id: "T064",
    kode: "DOK-ANG-001",
    nama: "Rencana Anggaran SMAP",
    namaEn: "ABMS Budget Plan",
    kategori: "Pedoman",
    klausul: "6.2",
    subKlausul: "7.1",
    deskripsi: "Rencana anggaran untuk aktivitas SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Keuangan"],
    promptTemplate: `Buatkan Rencana Anggaran SMAP untuk [NAMA PERUSAHAAN]:
Kategori Anggaran:
1. Personel FKAP
2. Pelatihan dan sertifikasi
3. Sistem IT (WBS, monitoring)
4. Audit internal dan eksternal
5. Komunikasi dan sosialisasi
6. Konsultasi eksternal
7. Investigasi
8. Kontingensi`,
  },
  {
    id: "T065",
    kode: "CHK-PER-001",
    nama: "Checklist Perencanaan SMAP",
    namaEn: "ABMS Planning Checklist",
    kategori: "Checklist",
    klausul: "6",
    deskripsi: "Checklist kelengkapan perencanaan SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Pendukung",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Checklist Perencanaan SMAP:
- Penilaian risiko sudah dilakukan
- Risiko dan peluang teridentifikasi
- Sasaran SMAP ditetapkan
- Program kerja disusun
- Anggaran dialokasikan
- PIC ditentukan
- Timeline jelas
- Indikator terukur
- Disetujui manajemen`,
  },
  {
    id: "T066",
    kode: "MAT-PER-001",
    nama: "Matriks Perencanaan Mitigasi Risiko",
    namaEn: "Risk Mitigation Planning Matrix",
    kategori: "Matriks",
    klausul: "6.1",
    deskripsi: "Matriks rencana mitigasi untuk setiap risiko teridentifikasi",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Matriks Perencanaan Mitigasi Risiko:
Kolom: Risiko | Level Risiko | Opsi Mitigasi | Tindakan Spesifik | Sumber Daya | PIC | Target Waktu | Expected Risk Level`,
  },
  {
    id: "T067",
    kode: "FOR-REV-001",
    nama: "Formulir Review Perencanaan SMAP",
    namaEn: "ABMS Planning Review Form",
    kategori: "Formulir",
    klausul: "6",
    deskripsi: "Formulir review dan update perencanaan SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Semester",
    tingkatKritis: "Pendukung",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Formulir Review Perencanaan SMAP:
- Periode review
- Perubahan konteks yang relevan
- Status pencapaian sasaran
- Gap yang teridentifikasi
- Perubahan yang diperlukan
- Update rencana
- Persetujuan`,
  },
  {
    id: "T068",
    kode: "IK-PER-001",
    nama: "Instruksi Kerja Penyusunan Sasaran SMAP",
    namaEn: "ABMS Objectives Setting Work Instruction",
    kategori: "Instruksi Kerja",
    klausul: "6.2",
    deskripsi: "Panduan teknis penyusunan sasaran anti penyuapan yang efektif",
    penanggungJawab: "FKAP",
    frekuensi: "Sekali",
    tingkatKritis: "Pendukung",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Instruksi Kerja Penyusunan Sasaran SMAP:
1. Prinsip SMART
2. Keterkaitan dengan kebijakan
3. Konsultasi dengan unit kerja
4. Penentuan baseline
5. Penetapan target realistis
6. Identifikasi indikator
7. Validasi dan persetujuan
8. Dokumentasi`,
  },
  {
    id: "T069",
    kode: "PRO-MIT-001",
    nama: "Program Mitigasi Risiko Prioritas",
    namaEn: "Priority Risk Mitigation Program",
    kategori: "Program",
    klausul: "6.1",
    deskripsi: "Program khusus mitigasi risiko penyuapan prioritas tinggi",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Operasional"],
    promptTemplate: `Buatkan Program Mitigasi Risiko Prioritas:
1. Identifikasi risiko prioritas (high/extreme)
2. Analisis akar penyebab
3. Opsi mitigasi
4. Rencana implementasi
5. Timeline
6. Anggaran
7. PIC
8. Monitoring dan evaluasi
9. Kriteria keberhasilan`,
  },
  {
    id: "T070",
    kode: "LAP-PER-001",
    nama: "Laporan Perencanaan SMAP Tahunan",
    namaEn: "Annual ABMS Planning Report",
    kategori: "Laporan",
    klausul: "6",
    deskripsi: "Laporan komprehensif perencanaan SMAP tahunan",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan Laporan Perencanaan SMAP Tahunan:
1. Ringkasan eksekutif
2. Review tahun sebelumnya
3. Analisis konteks terkini
4. Hasil penilaian risiko
5. Sasaran tahun berjalan
6. Program kerja
7. Alokasi sumber daya
8. Timeline implementasi
9. Mekanisme monitoring`,
  },

  // ============================================
  // KLAUSUL 7 - DUKUNGAN (40 templates)
  // ============================================
  {
    id: "T071",
    kode: "SOP-SDM-001",
    nama: "SOP Uji Tuntas Personel",
    namaEn: "Personnel Due Diligence SOP",
    kategori: "SOP",
    klausul: "7.2.2.1",
    deskripsi: "Prosedur uji tuntas dalam perekrutan dan penempatan personel",
    penanggungJawab: "SDM",
    frekuensi: "Sekali",
    tingkatKritis: "Wajib",
    areaBisnis: ["SDM"],
    promptTemplate: `Buatkan SOP Uji Tuntas Personel untuk [NAMA PERUSAHAAN]:
1. Tujuan dan ruang lingkup
2. Referensi (ISO 37001 klausul 7.2.2.1)
3. Prosedur:
   - Identifikasi posisi berisiko tinggi
   - Verifikasi latar belakang
   - Pemeriksaan referensi
   - Screening konflik kepentingan
   - Dokumentasi hasil
4. Kriteria posisi berisiko
5. Tindak lanjut temuan`,
  },
  {
    id: "T072",
    kode: "FOR-SDM-001",
    nama: "Formulir Uji Tuntas Calon Karyawan",
    namaEn: "Employee Candidate Due Diligence Form",
    kategori: "Formulir",
    klausul: "7.2.2.1",
    deskripsi: "Formulir checklist uji tuntas calon karyawan",
    penanggungJawab: "SDM",
    frekuensi: "Per Rekrutmen",
    tingkatKritis: "Wajib",
    areaBisnis: ["SDM"],
    promptTemplate: `Buatkan Formulir Uji Tuntas Calon Karyawan:
- Data calon karyawan
- Posisi yang dilamar
- Level risiko posisi
- Checklist verifikasi:
  * Identitas
  * Pendidikan
  * Riwayat pekerjaan
  * Referensi
  * Track record integritas
  * Konflik kepentingan
- Hasil assessment
- Rekomendasi
- Persetujuan`,
  },
  {
    id: "T073",
    kode: "FOR-PKT-001",
    nama: "Pakta Integritas Personel",
    namaEn: "Personnel Integrity Pact",
    kategori: "Formulir",
    klausul: "7.2.2.3",
    deskripsi: "Formulir pakta integritas yang ditandatangani personel",
    penanggungJawab: "SDM",
    frekuensi: "Per Personel",
    tingkatKritis: "Wajib",
    areaBisnis: ["SDM", "Kepatuhan"],
    promptTemplate: `Buatkan Pakta Integritas Personel:
"Saya yang bertanda tangan di bawah ini:
Nama: _______________
Jabatan: _______________
Unit Kerja: _______________

Dengan ini menyatakan:
1. Memahami dan mematuhi Kebijakan Anti Penyuapan
2. Tidak akan melakukan tindakan penyuapan
3. Akan melaporkan dugaan penyuapan
4. Bersedia menerima sanksi jika melanggar
5. Mengungkapkan konflik kepentingan

Tanda tangan: _______________
Tanggal: _______________"`,
  },
  {
    id: "T074",
    kode: "REG-PKT-001",
    nama: "Register Pakta Integritas",
    namaEn: "Integrity Pact Register",
    kategori: "Register",
    klausul: "7.2.2.3",
    deskripsi: "Daftar personel yang telah menandatangani pakta integritas",
    penanggungJawab: "SDM",
    frekuensi: "Berkelanjutan",
    tingkatKritis: "Wajib",
    areaBisnis: ["SDM"],
    promptTemplate: `Buatkan Register Pakta Integritas:
Kolom: No | NIK | Nama | Jabatan | Unit | Tanggal Tanda Tangan | Masa Berlaku | Status | Catatan`,
  },
  {
    id: "T075",
    kode: "SOP-PEL-001",
    nama: "SOP Pelatihan Anti Penyuapan",
    namaEn: "Anti-Bribery Training SOP",
    kategori: "SOP",
    klausul: "7.3",
    deskripsi: "Prosedur pelaksanaan pelatihan anti penyuapan",
    penanggungJawab: "SDM",
    frekuensi: "Sekali",
    tingkatKritis: "Wajib",
    areaBisnis: ["SDM", "Kepatuhan"],
    promptTemplate: `Buatkan SOP Pelatihan Anti Penyuapan:
1. Tujuan dan ruang lingkup
2. Jenis pelatihan:
   - Induksi karyawan baru
   - Refresher tahunan
   - Pelatihan khusus (posisi berisiko)
3. Materi pelatihan
4. Metode (classroom, e-learning)
5. Evaluasi pemahaman
6. Dokumentasi
7. Frekuensi pelatihan`,
  },
  {
    id: "T076",
    kode: "PRO-PEL-001",
    nama: "Program Pelatihan Anti Penyuapan",
    namaEn: "Anti-Bribery Training Program",
    kategori: "Program",
    klausul: "7.3",
    deskripsi: "Program pelatihan anti penyuapan tahunan",
    penanggungJawab: "SDM",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["SDM", "Kepatuhan"],
    promptTemplate: `Buatkan Program Pelatihan Anti Penyuapan:
1. Tujuan program
2. Target peserta per level
3. Kurikulum:
   - Pemahaman dasar anti penyuapan
   - Kebijakan perusahaan
   - Identifikasi red flags
   - Prosedur pelaporan
   - Studi kasus
4. Jadwal pelaksanaan
5. Trainer/fasilitator
6. Anggaran
7. Metode evaluasi`,
  },
  {
    id: "T077",
    kode: "FOR-PEL-001",
    nama: "Formulir Evaluasi Pelatihan",
    namaEn: "Training Evaluation Form",
    kategori: "Formulir",
    klausul: "7.3",
    deskripsi: "Formulir evaluasi efektivitas pelatihan anti penyuapan",
    penanggungJawab: "SDM",
    frekuensi: "Per Pelatihan",
    tingkatKritis: "Penting",
    areaBisnis: ["SDM"],
    promptTemplate: `Buatkan Formulir Evaluasi Pelatihan Anti Penyuapan:
- Judul pelatihan
- Tanggal dan tempat
- Evaluasi materi (1-5)
- Evaluasi trainer (1-5)
- Evaluasi fasilitas (1-5)
- Relevansi dengan pekerjaan
- Saran perbaikan
- Test pemahaman (pre-post test)`,
  },
  {
    id: "T078",
    kode: "REG-PEL-001",
    nama: "Register Pelatihan Anti Penyuapan",
    namaEn: "Anti-Bribery Training Register",
    kategori: "Register",
    klausul: "7.3",
    deskripsi: "Daftar peserta dan hasil pelatihan anti penyuapan",
    penanggungJawab: "SDM",
    frekuensi: "Berkelanjutan",
    tingkatKritis: "Wajib",
    areaBisnis: ["SDM"],
    promptTemplate: `Buatkan Register Pelatihan Anti Penyuapan:
Kolom: No | NIK | Nama | Jabatan | Unit | Jenis Pelatihan | Tanggal | Durasi | Nilai Pre-Test | Nilai Post-Test | Status Kelulusan`,
  },
  {
    id: "T079",
    kode: "MAT-PEL-001",
    nama: "Matriks Kebutuhan Pelatihan SMAP",
    namaEn: "ABMS Training Needs Matrix",
    kategori: "Matriks",
    klausul: "7.3",
    deskripsi: "Matriks kebutuhan pelatihan per level jabatan",
    penanggungJawab: "SDM",
    frekuensi: "Tahunan",
    tingkatKritis: "Penting",
    areaBisnis: ["SDM"],
    promptTemplate: `Buatkan Matriks Kebutuhan Pelatihan SMAP:
Kolom: Level/Jabatan | Induksi | Refresher | Awareness | Advanced | Specialist
Level:
- Direksi
- Manager
- Supervisor
- Staff operasional
- Posisi berisiko tinggi
Isi: Wajib/Opsional/N/A`,
  },
  {
    id: "T080",
    kode: "DOK-MAT-001",
    nama: "Materi Pelatihan Dasar Anti Penyuapan",
    namaEn: "Basic Anti-Bribery Training Material",
    kategori: "Pedoman",
    klausul: "7.3",
    deskripsi: "Materi pelatihan dasar anti penyuapan untuk seluruh personel",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["SDM", "Kepatuhan"],
    promptTemplate: `Buatkan Outline Materi Pelatihan Dasar Anti Penyuapan:
1. Apa itu penyuapan?
2. Regulasi anti penyuapan di Indonesia
3. Kebijakan anti penyuapan [NAMA PERUSAHAAN]
4. Bentuk-bentuk penyuapan
5. Red flags penyuapan
6. Konsekuensi penyuapan
7. Cara melaporkan dugaan penyuapan
8. Perlindungan pelapor
9. Studi kasus
10. Tanya jawab`,
  },
  {
    id: "T081",
    kode: "SOP-KOM-001",
    nama: "SOP Komunikasi Anti Penyuapan",
    namaEn: "Anti-Bribery Communication SOP",
    kategori: "SOP",
    klausul: "7.4",
    deskripsi: "Prosedur komunikasi internal dan eksternal terkait SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Sekali",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan SOP Komunikasi Anti Penyuapan:
1. Tujuan dan ruang lingkup
2. Jenis komunikasi:
   - Internal: Kebijakan, update, awareness
   - Eksternal: Mitra bisnis, publik
3. Media komunikasi
4. Pesan kunci
5. Frekuensi
6. PIC
7. Dokumentasi`,
  },
  {
    id: "T082",
    kode: "FOR-KOM-001",
    nama: "Formulir Komunikasi Kebijakan ke Mitra Bisnis",
    namaEn: "Policy Communication to Business Partners Form",
    kategori: "Formulir",
    klausul: "7.4",
    deskripsi: "Formulir bukti komunikasi kebijakan anti penyuapan ke mitra bisnis",
    penanggungJawab: "FKAP",
    frekuensi: "Per Mitra",
    tingkatKritis: "Penting",
    areaBisnis: ["Vendor", "Kepatuhan"],
    promptTemplate: `Buatkan Formulir Komunikasi Kebijakan ke Mitra Bisnis:
- Nama mitra bisnis
- Tanggal komunikasi
- Metode (surat, email, meeting)
- Dokumen yang dikomunikasikan
- Penerima
- Konfirmasi penerimaan
- Tanda terima`,
  },
  {
    id: "T083",
    kode: "SOP-DOK-001",
    nama: "SOP Pengendalian Dokumen SMAP",
    namaEn: "ABMS Document Control SOP",
    kategori: "SOP",
    klausul: "7.5.3",
    deskripsi: "Prosedur pengendalian dokumen dan rekaman SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Sekali",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan SOP Pengendalian Dokumen SMAP:
1. Tujuan dan ruang lingkup
2. Jenis dokumen SMAP
3. Prosedur:
   - Pembuatan dokumen
   - Review dan approval
   - Penomoran dan identifikasi
   - Distribusi
   - Revisi
   - Penyimpanan
   - Pembuangan/arsip
4. Format dokumen standar
5. Daftar induk dokumen`,
  },
  {
    id: "T084",
    kode: "REG-DOK-001",
    nama: "Daftar Induk Dokumen SMAP",
    namaEn: "ABMS Master Document List",
    kategori: "Register",
    klausul: "7.5.1",
    deskripsi: "Daftar seluruh dokumen SMAP yang berlaku",
    penanggungJawab: "FKAP",
    frekuensi: "Berkelanjutan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Daftar Induk Dokumen SMAP:
Kolom: No | Kode Dokumen | Nama Dokumen | Jenis | Revisi | Tanggal Terbit | Tanggal Review | Status | Penyimpanan`,
  },
  {
    id: "T085",
    kode: "FOR-DOK-001",
    nama: "Formulir Perubahan Dokumen",
    namaEn: "Document Change Request Form",
    kategori: "Formulir",
    klausul: "7.5.2",
    deskripsi: "Formulir permintaan perubahan dokumen SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Ad-hoc",
    tingkatKritis: "Pendukung",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Formulir Perubahan Dokumen SMAP:
- Nomor permintaan
- Tanggal
- Nama dokumen
- Nomor dokumen
- Revisi saat ini
- Alasan perubahan
- Uraian perubahan
- Pemohon
- Review FKAP
- Approval`,
  },
  {
    id: "T086",
    kode: "REG-DOK-002",
    nama: "Register Distribusi Dokumen",
    namaEn: "Document Distribution Register",
    kategori: "Register",
    klausul: "7.5.3",
    deskripsi: "Daftar distribusi dokumen SMAP ke penerima",
    penanggungJawab: "FKAP",
    frekuensi: "Berkelanjutan",
    tingkatKritis: "Pendukung",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Register Distribusi Dokumen:
Kolom: No | Kode Dokumen | Nama Dokumen | Penerima | Unit | Tanggal Distribusi | Copy No | Tanda Terima`,
  },
  {
    id: "T087",
    kode: "FOR-KOI-001",
    nama: "Formulir Pengungkapan Konflik Kepentingan",
    namaEn: "Conflict of Interest Disclosure Form",
    kategori: "Formulir",
    klausul: "8.7",
    subKlausul: "7.2.2.3",
    deskripsi: "Formulir pengungkapan konflik kepentingan oleh personel",
    penanggungJawab: "SDM",
    frekuensi: "Tahunan/Ad-hoc",
    tingkatKritis: "Wajib",
    areaBisnis: ["SDM", "Kepatuhan"],
    promptTemplate: `Buatkan Formulir Pengungkapan Konflik Kepentingan:
- Data personel
- Periode pelaporan
- Pertanyaan-pertanyaan:
  1. Apakah memiliki hubungan keluarga dengan vendor/pelanggan?
  2. Apakah memiliki kepemilikan saham di perusahaan lain?
  3. Apakah menerima tawaran pekerjaan dari pihak ketiga?
  4. Apakah ada situasi lain yang berpotensi konflik?
- Deskripsi konflik
- Rencana pengelolaan
- Tanda tangan dan tanggal`,
  },
  {
    id: "T088",
    kode: "REG-KOI-001",
    nama: "Register Konflik Kepentingan",
    namaEn: "Conflict of Interest Register",
    kategori: "Register",
    klausul: "8.7",
    deskripsi: "Daftar konflik kepentingan yang telah diungkapkan dan pengelolaannya",
    penanggungJawab: "FKAP",
    frekuensi: "Berkelanjutan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "SDM"],
    promptTemplate: `Buatkan Register Konflik Kepentingan:
Kolom: No | Tanggal Pengungkapan | Nama | Jabatan | Jenis Konflik | Deskripsi | Keputusan Pengelolaan | PIC | Status | Review`,
  },
  {
    id: "T089",
    kode: "SOP-BON-001",
    nama: "SOP Pemberian Bonus dan Penghargaan",
    namaEn: "Bonus and Rewards SOP",
    kategori: "SOP",
    klausul: "7.2.2.2",
    deskripsi: "Prosedur pemberian bonus dan penghargaan yang mencegah penyuapan",
    penanggungJawab: "SDM",
    frekuensi: "Sekali",
    tingkatKritis: "Wajib",
    areaBisnis: ["SDM"],
    promptTemplate: `Buatkan SOP Pemberian Bonus dan Penghargaan:
1. Tujuan dan ruang lingkup
2. Prinsip (tidak mendorong perilaku penyuapan)
3. Kriteria bonus/penghargaan
4. Indikator yang dilarang (misal: target tanpa etika)
5. Prosedur penilaian
6. Approval chain
7. Dokumentasi`,
  },
  {
    id: "T090",
    kode: "MAT-SDM-001",
    nama: "Matriks Kompetensi SMAP",
    namaEn: "ABMS Competency Matrix",
    kategori: "Matriks",
    klausul: "7.2.1",
    deskripsi: "Matriks kompetensi yang diperlukan untuk peran-peran dalam SMAP",
    penanggungJawab: "SDM",
    frekuensi: "Tahunan",
    tingkatKritis: "Penting",
    areaBisnis: ["SDM", "Kepatuhan"],
    promptTemplate: `Buatkan Matriks Kompetensi SMAP:
Kolom: Peran/Jabatan | Pengetahuan Anti Penyuapan | Investigasi | Audit | Komunikasi | Leadership | Level Kompetensi yang Dibutuhkan`,
  },
  {
    id: "T091",
    kode: "FOR-KOM-002",
    nama: "Formulir Sosialisasi Internal",
    namaEn: "Internal Socialization Form",
    kategori: "Formulir",
    klausul: "7.4",
    deskripsi: "Formulir bukti sosialisasi kebijakan anti penyuapan internal",
    penanggungJawab: "FKAP",
    frekuensi: "Per Kegiatan",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Formulir Sosialisasi Internal:
- Judul kegiatan
- Tanggal, waktu, tempat
- Materi yang disampaikan
- Fasilitator
- Daftar hadir peserta
- Dokumentasi foto
- Feedback peserta`,
  },
  {
    id: "T092",
    kode: "IK-SDM-001",
    nama: "Instruksi Kerja Verifikasi Latar Belakang",
    namaEn: "Background Verification Work Instruction",
    kategori: "Instruksi Kerja",
    klausul: "7.2.2.1",
    deskripsi: "Panduan teknis verifikasi latar belakang calon karyawan",
    penanggungJawab: "SDM",
    frekuensi: "Sekali",
    tingkatKritis: "Penting",
    areaBisnis: ["SDM"],
    promptTemplate: `Buatkan Instruksi Kerja Verifikasi Latar Belakang:
1. Sumber data yang diperiksa
2. Metode verifikasi identitas
3. Pemeriksaan riwayat pendidikan
4. Konfirmasi riwayat pekerjaan
5. Pemeriksaan catatan kriminal (jika ada)
6. Penggunaan jasa pihak ketiga
7. Dokumentasi hasil
8. Penyimpanan data pribadi`,
  },
  {
    id: "T093",
    kode: "FOR-SDM-002",
    nama: "Formulir Exit Interview Anti Penyuapan",
    namaEn: "Anti-Bribery Exit Interview Form",
    kategori: "Formulir",
    klausul: "7.2",
    deskripsi: "Formulir exit interview dengan pertanyaan terkait anti penyuapan",
    penanggungJawab: "SDM",
    frekuensi: "Per Resign",
    tingkatKritis: "Pendukung",
    areaBisnis: ["SDM"],
    promptTemplate: `Buatkan Formulir Exit Interview Anti Penyuapan:
- Data karyawan
- Tanggal exit interview
- Pertanyaan:
  1. Apakah pernah diminta melakukan tindakan tidak etis?
  2. Apakah mengetahui praktik penyuapan?
  3. Apakah pernah melaporkan pelanggaran?
  4. Saran untuk perbaikan SMAP
- Catatan pewawancara`,
  },
  {
    id: "T094",
    kode: "REG-SDA-001",
    nama: "Register Sumber Daya SMAP",
    namaEn: "ABMS Resource Register",
    kategori: "Register",
    klausul: "7.1",
    deskripsi: "Daftar sumber daya yang dialokasikan untuk SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan", "Keuangan"],
    promptTemplate: `Buatkan Register Sumber Daya SMAP:
Kolom: No | Jenis Sumber Daya | Deskripsi | Jumlah/Nilai | Periode | PIC | Status`,
  },
  {
    id: "T095",
    kode: "LAP-PEL-001",
    nama: "Laporan Pelaksanaan Pelatihan SMAP",
    namaEn: "ABMS Training Implementation Report",
    kategori: "Laporan",
    klausul: "7.3",
    deskripsi: "Laporan hasil pelaksanaan program pelatihan anti penyuapan",
    penanggungJawab: "SDM",
    frekuensi: "Kuartal",
    tingkatKritis: "Wajib",
    areaBisnis: ["SDM", "Kepatuhan"],
    promptTemplate: `Buatkan Laporan Pelaksanaan Pelatihan SMAP:
1. Ringkasan eksekutif
2. Realisasi vs rencana
3. Statistik peserta
4. Hasil evaluasi
5. Tingkat kelulusan
6. Feedback peserta
7. Kendala dan solusi
8. Rencana perbaikan`,
  },
  {
    id: "T096",
    kode: "CHK-SDM-001",
    nama: "Checklist Onboarding Anti Penyuapan",
    namaEn: "Anti-Bribery Onboarding Checklist",
    kategori: "Checklist",
    klausul: "7.2",
    deskripsi: "Checklist onboarding karyawan baru terkait SMAP",
    penanggungJawab: "SDM",
    frekuensi: "Per Rekrutmen",
    tingkatKritis: "Wajib",
    areaBisnis: ["SDM"],
    promptTemplate: `Buatkan Checklist Onboarding Anti Penyuapan:
- Penjelasan kebijakan anti penyuapan
- Pemberian copy kebijakan
- Tanda tangan pakta integritas
- Pengisian form konflik kepentingan
- Pelatihan induksi anti penyuapan
- Penjelasan saluran pelaporan
- Konfirmasi pemahaman`,
  },
  {
    id: "T097",
    kode: "FOR-SDM-003",
    nama: "Formulir Penilaian Kompetensi Anti Penyuapan",
    namaEn: "Anti-Bribery Competency Assessment Form",
    kategori: "Formulir",
    klausul: "7.2.1",
    deskripsi: "Formulir penilaian kompetensi personel terkait anti penyuapan",
    penanggungJawab: "SDM",
    frekuensi: "Tahunan",
    tingkatKritis: "Penting",
    areaBisnis: ["SDM"],
    promptTemplate: `Buatkan Formulir Penilaian Kompetensi Anti Penyuapan:
- Data personel
- Periode penilaian
- Kriteria penilaian:
  1. Pemahaman kebijakan
  2. Penerapan dalam pekerjaan
  3. Identifikasi risiko
  4. Pelaporan isu
- Skor dan level kompetensi
- Gap dan kebutuhan pengembangan
- Tanda tangan penilai`,
  },
  {
    id: "T098",
    kode: "PRO-KPD-001",
    nama: "Program Kepedulian Anti Penyuapan",
    namaEn: "Anti-Bribery Awareness Program",
    kategori: "Program",
    klausul: "7.3",
    deskripsi: "Program untuk meningkatkan kepedulian personel terhadap anti penyuapan",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "SDM"],
    promptTemplate: `Buatkan Program Kepedulian Anti Penyuapan:
1. Kampanye awareness bulanan
2. Email/poster anti penyuapan
3. Quiz dan kompetisi
4. Sharing session kasus
5. Integrity day/week
6. Newsletter SMAP
7. Target dan indikator
8. Timeline dan anggaran`,
  },
  {
    id: "T099",
    kode: "IK-KOM-001",
    nama: "Instruksi Kerja Komunikasi Darurat SMAP",
    namaEn: "ABMS Emergency Communication Work Instruction",
    kategori: "Instruksi Kerja",
    klausul: "7.4",
    subKlausul: "8.8",
    deskripsi: "Panduan komunikasi dalam situasi darurat terkait penyuapan",
    penanggungJawab: "FKAP",
    frekuensi: "Sekali",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Instruksi Kerja Komunikasi Darurat SMAP:
1. Definisi situasi darurat SMAP
2. Pihak yang harus dihubungi
3. Timeline komunikasi
4. Template pesan darurat
5. Eskalasi ke media/publik
6. Koordinasi dengan legal
7. Dokumentasi`,
  },
  {
    id: "T100",
    kode: "REG-KPD-001",
    nama: "Register Kepedulian dan Kesadaran",
    namaEn: "Awareness and Consciousness Register",
    kategori: "Register",
    klausul: "7.3",
    deskripsi: "Daftar aktivitas awareness dan partisipasi personel",
    penanggungJawab: "FKAP",
    frekuensi: "Berkelanjutan",
    tingkatKritis: "Pendukung",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Register Kepedulian dan Kesadaran:
Kolom: No | Tanggal | Aktivitas | Jenis | Peserta/Target | Hasil | Feedback | PIC`,
  },
  {
    id: "T101",
    kode: "DOK-MAT-002",
    nama: "Materi E-Learning Anti Penyuapan",
    namaEn: "Anti-Bribery E-Learning Material",
    kategori: "Pedoman",
    klausul: "7.3",
    deskripsi: "Materi e-learning anti penyuapan untuk pembelajaran mandiri",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Penting",
    areaBisnis: ["SDM", "Kepatuhan"],
    promptTemplate: `Buatkan Outline Materi E-Learning Anti Penyuapan:
Modul 1: Pengantar Anti Penyuapan
Modul 2: Regulasi dan Kebijakan
Modul 3: Identifikasi Risiko
Modul 4: Pengendalian dan Pencegahan
Modul 5: Pelaporan dan Investigasi
Modul 6: Studi Kasus Interaktif
Quiz per modul
Sertifikat kelulusan`,
  },
  {
    id: "T102",
    kode: "FOR-DOK-002",
    nama: "Formulir Permintaan Akses Dokumen SMAP",
    namaEn: "ABMS Document Access Request Form",
    kategori: "Formulir",
    klausul: "7.5.3",
    deskripsi: "Formulir permintaan akses ke dokumen SMAP yang dikontrol",
    penanggungJawab: "FKAP",
    frekuensi: "Ad-hoc",
    tingkatKritis: "Pendukung",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Formulir Permintaan Akses Dokumen SMAP:
- Tanggal permintaan
- Pemohon
- Unit kerja
- Dokumen yang diminta
- Tujuan akses
- Durasi akses
- Persetujuan atasan
- Persetujuan FKAP`,
  },
  {
    id: "T103",
    kode: "CHK-DOK-001",
    nama: "Checklist Audit Dokumentasi SMAP",
    namaEn: "ABMS Documentation Audit Checklist",
    kategori: "Checklist",
    klausul: "7.5",
    deskripsi: "Checklist untuk mengaudit kelengkapan dan kesesuaian dokumentasi SMAP",
    penanggungJawab: "Audit Internal",
    frekuensi: "Per Audit",
    tingkatKritis: "Penting",
    areaBisnis: ["Audit", "Kepatuhan"],
    promptTemplate: `Buatkan Checklist Audit Dokumentasi SMAP:
- Daftar induk dokumen lengkap
- Dokumen wajib tersedia
- Revisi dokumen tercatat
- Dokumen obsolete ditarik
- Distribusi terkontrol
- Penyimpanan sesuai prosedur
- Akses terkontrol
- Backup tersedia`,
  },
  {
    id: "T104",
    kode: "LAP-KOM-001",
    nama: "Laporan Aktivitas Komunikasi SMAP",
    namaEn: "ABMS Communication Activity Report",
    kategori: "Laporan",
    klausul: "7.4",
    deskripsi: "Laporan aktivitas komunikasi anti penyuapan internal dan eksternal",
    penanggungJawab: "FKAP",
    frekuensi: "Kuartal",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Laporan Aktivitas Komunikasi SMAP:
1. Ringkasan aktivitas
2. Komunikasi internal:
   - Sosialisasi
   - Newsletter
   - Kampanye
3. Komunikasi eksternal:
   - Mitra bisnis
   - Publik
4. Feedback yang diterima
5. Efektivitas komunikasi
6. Rencana ke depan`,
  },
  {
    id: "T105",
    kode: "FOR-RES-001",
    nama: "Formulir Permintaan Sumber Daya Tambahan",
    namaEn: "Additional Resource Request Form",
    kategori: "Formulir",
    klausul: "7.1",
    deskripsi: "Formulir permintaan sumber daya tambahan untuk SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Ad-hoc",
    tingkatKritis: "Pendukung",
    areaBisnis: ["Kepatuhan", "Keuangan"],
    promptTemplate: `Buatkan Formulir Permintaan Sumber Daya Tambahan:
- Tanggal pengajuan
- Pemohon
- Jenis sumber daya
- Justifikasi kebutuhan
- Estimasi biaya
- Dampak jika tidak dipenuhi
- Timeline
- Persetujuan`,
  },
  {
    id: "T106",
    kode: "REG-DOK-003",
    nama: "Register Rekaman SMAP",
    namaEn: "ABMS Records Register",
    kategori: "Register",
    klausul: "7.5.1",
    deskripsi: "Daftar rekaman SMAP beserta retensinya",
    penanggungJawab: "FKAP",
    frekuensi: "Berkelanjutan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Register Rekaman SMAP:
Kolom: No | Jenis Rekaman | Kode | Lokasi Penyimpanan | Format | Masa Retensi | PIC | Status`,
  },
  {
    id: "T107",
    kode: "MAT-RET-001",
    nama: "Matriks Retensi Dokumen SMAP",
    namaEn: "ABMS Document Retention Matrix",
    kategori: "Matriks",
    klausul: "7.5.3",
    deskripsi: "Matriks masa retensi untuk berbagai jenis dokumen SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Matriks Retensi Dokumen SMAP:
Kolom: Jenis Dokumen | Kategori | Retensi Aktif | Retensi Arsip | Total | Metode Disposal
Jenis dokumen:
- Kebijakan: 5 tahun setelah revisi
- Penilaian risiko: 7 tahun
- Investigasi: 10 tahun
- Pelatihan: 5 tahun
- Audit: 7 tahun`,
  },
  {
    id: "T108",
    kode: "IK-DOK-001",
    nama: "Instruksi Kerja Pemusnahan Dokumen SMAP",
    namaEn: "ABMS Document Destruction Work Instruction",
    kategori: "Instruksi Kerja",
    klausul: "7.5.3",
    deskripsi: "Panduan teknis pemusnahan dokumen SMAP yang sudah habis masa retensi",
    penanggungJawab: "FKAP",
    frekuensi: "Sekali",
    tingkatKritis: "Pendukung",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Instruksi Kerja Pemusnahan Dokumen SMAP:
1. Identifikasi dokumen habis retensi
2. Verifikasi tidak ada hold/litigation
3. Approval pemusnahan
4. Metode pemusnahan (shred, burn, delete)
5. Dokumentasi pemusnahan
6. Update register`,
  },
  {
    id: "T109",
    kode: "FOR-PEM-001",
    nama: "Berita Acara Pemusnahan Dokumen",
    namaEn: "Document Destruction Minutes",
    kategori: "Berita Acara",
    klausul: "7.5.3",
    deskripsi: "Berita acara pemusnahan dokumen SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Per Pemusnahan",
    tingkatKritis: "Pendukung",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Berita Acara Pemusnahan Dokumen:
- Tanggal pemusnahan
- Lokasi
- Daftar dokumen yang dimusnahkan
- Metode pemusnahan
- Saksi-saksi
- Tanda tangan pelaksana
- Foto dokumentasi`,
  },
  {
    id: "T110",
    kode: "CHK-KOM-001",
    nama: "Checklist Kesiapan Komunikasi Eksternal",
    namaEn: "External Communication Readiness Checklist",
    kategori: "Checklist",
    klausul: "7.4",
    deskripsi: "Checklist kesiapan komunikasi kebijakan anti penyuapan ke pihak eksternal",
    penanggungJawab: "FKAP",
    frekuensi: "Per Kegiatan",
    tingkatKritis: "Pendukung",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Checklist Kesiapan Komunikasi Eksternal:
- Materi komunikasi disiapkan
- Bahasa disesuaikan audience
- Approval dari manajemen
- PIC komunikasi ditentukan
- Saluran komunikasi siap
- Dokumentasi disiapkan
- Follow-up plan ada`,
  },

  // ============================================
  // KLAUSUL 8 - OPERASI (50 templates)
  // ============================================
  {
    id: "T111",
    kode: "SOP-UTU-001",
    nama: "SOP Uji Tuntas Mitra Bisnis",
    namaEn: "Business Partner Due Diligence SOP",
    kategori: "SOP",
    klausul: "8.2",
    deskripsi: "Prosedur uji tuntas terhadap mitra bisnis (vendor, subkontraktor, agen)",
    penanggungJawab: "FKAP",
    frekuensi: "Sekali",
    tingkatKritis: "Wajib",
    areaBisnis: ["Vendor", "Pengadaan", "Kepatuhan"],
    promptTemplate: `Buatkan SOP Uji Tuntas Mitra Bisnis untuk [NAMA PERUSAHAAN]:
1. Tujuan dan ruang lingkup
2. Referensi (ISO 37001 klausul 8.2)
3. Definisi mitra bisnis
4. Kategorisasi risiko mitra
5. Prosedur:
   - Identifikasi mitra baru
   - Pengumpulan informasi
   - Verifikasi dan analisis
   - Risk scoring
   - Persetujuan/penolakan
   - Monitoring berkelanjutan
6. Red flags
7. Dokumentasi`,
  },
  {
    id: "T112",
    kode: "FOR-UTU-001",
    nama: "Formulir Uji Tuntas Vendor",
    namaEn: "Vendor Due Diligence Form",
    kategori: "Formulir",
    klausul: "8.2",
    deskripsi: "Formulir uji tuntas untuk vendor/pemasok",
    penanggungJawab: "Pengadaan",
    frekuensi: "Per Vendor",
    tingkatKritis: "Wajib",
    areaBisnis: ["Vendor", "Pengadaan"],
    promptTemplate: `Buatkan Formulir Uji Tuntas Vendor:
Bagian A: Identitas Vendor
Bagian B: Legalitas dan Izin
Bagian C: Kepemilikan dan Manajemen
Bagian D: Track Record
Bagian E: Kebijakan Anti Penyuapan Vendor
Bagian F: Red Flags Check
Bagian G: Risk Score
Bagian H: Rekomendasi dan Persetujuan`,
  },
  {
    id: "T113",
    kode: "REG-UTU-001",
    nama: "Register Uji Tuntas Mitra Bisnis",
    namaEn: "Business Partner Due Diligence Register",
    kategori: "Register",
    klausul: "8.2",
    deskripsi: "Daftar mitra bisnis dan status uji tuntasnya",
    penanggungJawab: "FKAP",
    frekuensi: "Berkelanjutan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Vendor", "Kepatuhan"],
    promptTemplate: `Buatkan Register Uji Tuntas Mitra Bisnis:
Kolom: No | Nama Mitra | Kategori | Tanggal DD | Risk Level | Status | Reviewer | Next Review | Catatan`,
  },
  {
    id: "T114",
    kode: "CHK-UTU-001",
    nama: "Checklist Uji Tuntas Enhanced",
    namaEn: "Enhanced Due Diligence Checklist",
    kategori: "Checklist",
    klausul: "8.2",
    deskripsi: "Checklist uji tuntas diperluas untuk mitra berisiko tinggi",
    penanggungJawab: "FKAP",
    frekuensi: "Per Mitra High Risk",
    tingkatKritis: "Wajib",
    areaBisnis: ["Vendor", "Kepatuhan"],
    promptTemplate: `Buatkan Checklist Uji Tuntas Enhanced:
- Verifikasi beneficial ownership
- Pemeriksaan PEP (Politically Exposed Person)
- Screening sanksi internasional
- Media adverse check
- Site visit
- Interview manajemen
- Review laporan keuangan
- Referensi dari klien lain
- Background check pemilik`,
  },
  {
    id: "T115",
    kode: "SOP-KEU-001",
    nama: "SOP Pengendalian Keuangan Anti Penyuapan",
    namaEn: "Anti-Bribery Financial Control SOP",
    kategori: "SOP",
    klausul: "8.3",
    deskripsi: "Prosedur pengendalian keuangan untuk mencegah penyuapan",
    penanggungJawab: "Keuangan",
    frekuensi: "Sekali",
    tingkatKritis: "Wajib",
    areaBisnis: ["Keuangan", "Kepatuhan"],
    promptTemplate: `Buatkan SOP Pengendalian Keuangan Anti Penyuapan:
1. Tujuan dan ruang lingkup
2. Prinsip pengendalian keuangan
3. Prosedur:
   - Pemisahan tugas
   - Otorisasi pembayaran
   - Rekonsiliasi
   - Review transaksi tidak biasa
   - Audit trail
4. Red flags keuangan
5. Escalation
6. Dokumentasi`,
  },
  {
    id: "T116",
    kode: "MAT-OTO-001",
    nama: "Matriks Otorisasi Keuangan",
    namaEn: "Financial Authorization Matrix",
    kategori: "Matriks",
    klausul: "8.3",
    deskripsi: "Matriks otorisasi untuk transaksi keuangan",
    penanggungJawab: "Keuangan",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Keuangan"],
    promptTemplate: `Buatkan Matriks Otorisasi Keuangan:
Kolom: Jenis Transaksi | Nilai s/d 10jt | 10-50jt | 50-100jt | 100-500jt | >500jt
Jenis: Pembayaran vendor, Petty cash, Advance, Entertainment, Donasi
Otorisasi: Staff, Supervisor, Manager, GM, Direktur, Direksi`,
  },
  {
    id: "T117",
    kode: "CHK-KEU-001",
    nama: "Checklist Review Transaksi Berisiko",
    namaEn: "High-Risk Transaction Review Checklist",
    kategori: "Checklist",
    klausul: "8.3",
    deskripsi: "Checklist review transaksi keuangan berisiko tinggi",
    penanggungJawab: "Keuangan",
    frekuensi: "Per Transaksi",
    tingkatKritis: "Wajib",
    areaBisnis: ["Keuangan"],
    promptTemplate: `Buatkan Checklist Review Transaksi Berisiko:
- Transaksi memiliki justifikasi bisnis
- Nilai sesuai pasar
- Dokumentasi lengkap
- Otorisasi sesuai matrix
- Tidak ada red flags
- Penerima terverifikasi
- Tidak melibatkan PEP
- Rekening tujuan valid`,
  },
  {
    id: "T118",
    kode: "SOP-HAD-001",
    nama: "SOP Pemberian dan Penerimaan Hadiah",
    namaEn: "Gifts Giving and Receiving SOP",
    kategori: "SOP",
    klausul: "8.7",
    deskripsi: "Prosedur pemberian dan penerimaan hadiah serta keramahtamahan",
    penanggungJawab: "FKAP",
    frekuensi: "Sekali",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Operasional"],
    promptTemplate: `Buatkan SOP Pemberian dan Penerimaan Hadiah:
1. Tujuan dan ruang lingkup
2. Definisi hadiah dan keramahtamahan
3. Prosedur pemberian:
   - Persetujuan sebelum memberikan
   - Batasan nilai
   - Pencatatan
4. Prosedur penerimaan:
   - Pelaporan
   - Pengembalian jika tidak sesuai
   - Penanganan hadiah yang diterima
5. Hadiah yang dilarang
6. Dokumentasi`,
  },
  {
    id: "T119",
    kode: "FOR-HAD-001",
    nama: "Formulir Persetujuan Pemberian Hadiah",
    namaEn: "Gift Giving Approval Form",
    kategori: "Formulir",
    klausul: "8.7",
    deskripsi: "Formulir persetujuan sebelum memberikan hadiah/keramahtamahan",
    penanggungJawab: "Unit Kerja",
    frekuensi: "Per Pemberian",
    tingkatKritis: "Wajib",
    areaBisnis: ["Operasional", "Kepatuhan"],
    promptTemplate: `Buatkan Formulir Persetujuan Pemberian Hadiah:
- Tanggal pengajuan
- Pemohon
- Penerima hadiah
- Hubungan bisnis
- Jenis dan nilai hadiah
- Tujuan pemberian
- Justifikasi
- Review FKAP
- Persetujuan`,
  },
  {
    id: "T120",
    kode: "FOR-HAD-002",
    nama: "Formulir Pelaporan Penerimaan Hadiah",
    namaEn: "Gift Receiving Report Form",
    kategori: "Formulir",
    klausul: "8.7",
    deskripsi: "Formulir pelaporan hadiah yang diterima",
    penanggungJawab: "Penerima",
    frekuensi: "Per Penerimaan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Formulir Pelaporan Penerimaan Hadiah:
- Tanggal pelaporan
- Nama pelapor
- Pemberi hadiah
- Hubungan bisnis
- Jenis dan estimasi nilai
- Keadaan penerimaan
- Keputusan (terima/tolak/serahkan perusahaan)
- Persetujuan atasan`,
  },
  {
    id: "T121",
    kode: "REG-HAD-001",
    nama: "Register Hadiah dan Keramahtamahan",
    namaEn: "Gifts and Hospitality Register",
    kategori: "Register",
    klausul: "8.7",
    deskripsi: "Daftar hadiah yang diberikan dan diterima",
    penanggungJawab: "FKAP",
    frekuensi: "Berkelanjutan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Register Hadiah dan Keramahtamahan:
Kolom: No | Tanggal | Jenis (Beri/Terima) | Pemberi/Penerima | Jenis Hadiah | Nilai | Hubungan Bisnis | Status Persetujuan | Catatan`,
  },
  {
    id: "T122",
    kode: "SOP-DON-001",
    nama: "SOP Donasi dan Sponsorship",
    namaEn: "Donations and Sponsorship SOP",
    kategori: "SOP",
    klausul: "8.7",
    deskripsi: "Prosedur pemberian donasi dan sponsorship",
    penanggungJawab: "FKAP",
    frekuensi: "Sekali",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Keuangan"],
    promptTemplate: `Buatkan SOP Donasi dan Sponsorship:
1. Tujuan dan ruang lingkup
2. Definisi donasi dan sponsorship
3. Prosedur:
   - Pengajuan dan justifikasi
   - Due diligence penerima
   - Persetujuan berjenjang
   - Dokumentasi
   - Monitoring penggunaan
4. Penerima yang dilarang
5. Batasan nilai
6. Pelaporan`,
  },
  {
    id: "T123",
    kode: "FOR-DON-001",
    nama: "Formulir Persetujuan Donasi",
    namaEn: "Donation Approval Form",
    kategori: "Formulir",
    klausul: "8.7",
    deskripsi: "Formulir persetujuan pemberian donasi",
    penanggungJawab: "Unit Kerja",
    frekuensi: "Per Donasi",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Keuangan"],
    promptTemplate: `Buatkan Formulir Persetujuan Donasi:
- Tanggal pengajuan
- Pemohon
- Penerima donasi
- Latar belakang organisasi penerima
- Tujuan donasi
- Jumlah
- Justifikasi bisnis
- Due diligence check
- Persetujuan berjenjang`,
  },
  {
    id: "T124",
    kode: "REG-DON-001",
    nama: "Register Donasi dan Sponsorship",
    namaEn: "Donations and Sponsorship Register",
    kategori: "Register",
    klausul: "8.7",
    deskripsi: "Daftar donasi dan sponsorship yang diberikan",
    penanggungJawab: "FKAP",
    frekuensi: "Berkelanjutan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Register Donasi dan Sponsorship:
Kolom: No | Tanggal | Penerima | Jenis | Nilai | Tujuan | Status DD | Approval | Bukti Penyaluran`,
  },
  {
    id: "T125",
    kode: "SOP-WBS-001",
    nama: "SOP Whistleblowing System",
    namaEn: "Whistleblowing System SOP",
    kategori: "SOP",
    klausul: "8.9",
    deskripsi: "Prosedur pengelolaan sistem pelaporan pelanggaran",
    penanggungJawab: "FKAP",
    frekuensi: "Sekali",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan SOP Whistleblowing System untuk [NAMA PERUSAHAAN]:
1. Tujuan dan ruang lingkup
2. Definisi dan prinsip
3. Saluran pelaporan
4. Prosedur:
   - Penerimaan laporan
   - Validasi awal
   - Investigasi pendahuluan
   - Investigasi lanjutan
   - Penyelesaian dan tindak lanjut
   - Pelaporan hasil
5. Perlindungan pelapor
6. Kerahasiaan
7. Dokumentasi`,
  },
  {
    id: "T126",
    kode: "FOR-WBS-001",
    nama: "Formulir Pelaporan Whistleblowing",
    namaEn: "Whistleblowing Report Form",
    kategori: "Formulir",
    klausul: "8.9",
    deskripsi: "Formulir untuk melaporkan dugaan pelanggaran",
    penanggungJawab: "FKAP",
    frekuensi: "Per Laporan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Formulir Pelaporan Whistleblowing:
- Tanggal pelaporan
- Identitas pelapor (opsional)
- Jenis pelanggaran yang dilaporkan
- Waktu dan tempat kejadian
- Pihak yang terlibat
- Uraian kejadian
- Bukti pendukung
- Saksi-saksi
- Pernyataan kebenaran`,
  },
  {
    id: "T127",
    kode: "REG-WBS-001",
    nama: "Register Laporan Whistleblowing",
    namaEn: "Whistleblowing Report Register",
    kategori: "Register",
    klausul: "8.9",
    deskripsi: "Daftar laporan whistleblowing dan status penanganannya",
    penanggungJawab: "FKAP",
    frekuensi: "Berkelanjutan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Register Laporan Whistleblowing:
Kolom: No Laporan | Tanggal | Jenis Pelanggaran | Status Validasi | Status Investigasi | Hasil | Tindak Lanjut | Closed Date | Catatan`,
  },
  {
    id: "T128",
    kode: "SOP-INV-001",
    nama: "SOP Investigasi Pelanggaran",
    namaEn: "Violation Investigation SOP",
    kategori: "SOP",
    klausul: "8.10",
    deskripsi: "Prosedur investigasi dugaan pelanggaran anti penyuapan",
    penanggungJawab: "FKAP",
    frekuensi: "Sekali",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Legal"],
    promptTemplate: `Buatkan SOP Investigasi Pelanggaran:
1. Tujuan dan ruang lingkup
2. Prinsip investigasi
3. Tim investigasi
4. Prosedur:
   - Inisiasi investigasi
   - Perencanaan
   - Pengumpulan bukti
   - Interview
   - Analisis
   - Kesimpulan
   - Pelaporan
   - Tindak lanjut
5. Hak terlapor
6. Dokumentasi dan arsip`,
  },
  {
    id: "T129",
    kode: "FOR-INV-001",
    nama: "Formulir Rencana Investigasi",
    namaEn: "Investigation Plan Form",
    kategori: "Formulir",
    klausul: "8.10",
    deskripsi: "Formulir perencanaan investigasi",
    penanggungJawab: "Tim Investigasi",
    frekuensi: "Per Kasus",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Formulir Rencana Investigasi:
- Nomor kasus
- Latar belakang
- Ruang lingkup investigasi
- Tim investigasi
- Hipotesis awal
- Bukti yang akan dikumpulkan
- Pihak yang akan diinterview
- Timeline
- Resources
- Risiko investigasi`,
  },
  {
    id: "T130",
    kode: "FOR-INV-002",
    nama: "Formulir Interview Investigasi",
    namaEn: "Investigation Interview Form",
    kategori: "Formulir",
    klausul: "8.10",
    deskripsi: "Formulir dokumentasi interview dalam investigasi",
    penanggungJawab: "Tim Investigasi",
    frekuensi: "Per Interview",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Formulir Interview Investigasi:
- Tanggal dan waktu
- Lokasi
- Interviewer
- Interviewee dan kapasitasnya
- Informasi yang diberikan kepada interviewee
- Pertanyaan dan jawaban
- Bukti yang ditunjukkan
- Kesimpulan interviewer
- Tanda tangan`,
  },
  {
    id: "T131",
    kode: "LAP-INV-001",
    nama: "Template Laporan Investigasi",
    namaEn: "Investigation Report Template",
    kategori: "Laporan",
    klausul: "8.10",
    deskripsi: "Template laporan hasil investigasi pelanggaran",
    penanggungJawab: "Tim Investigasi",
    frekuensi: "Per Kasus",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Template Laporan Investigasi:
1. Ringkasan eksekutif
2. Latar belakang kasus
3. Metodologi investigasi
4. Temuan-temuan
5. Analisis bukti
6. Kesimpulan
7. Rekomendasi:
   - Tindakan terhadap pelaku
   - Perbaikan sistem
   - Recovery
8. Lampiran bukti`,
  },
  {
    id: "T132",
    kode: "REG-INV-001",
    nama: "Register Investigasi",
    namaEn: "Investigation Register",
    kategori: "Register",
    klausul: "8.10",
    deskripsi: "Daftar kasus investigasi dan statusnya",
    penanggungJawab: "FKAP",
    frekuensi: "Berkelanjutan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Register Investigasi:
Kolom: No Kasus | Tanggal Mulai | Sumber | Jenis Pelanggaran | Pihak Terlibat | Tim Investigasi | Status | Hasil | Tindak Lanjut | Tanggal Selesai`,
  },
  {
    id: "T133",
    kode: "SOP-OPE-001",
    nama: "SOP Pengendalian Operasional Anti Penyuapan",
    namaEn: "Anti-Bribery Operational Control SOP",
    kategori: "SOP",
    klausul: "8.1",
    deskripsi: "Prosedur pengendalian operasional untuk mencegah penyuapan",
    penanggungJawab: "FKAP",
    frekuensi: "Sekali",
    tingkatKritis: "Wajib",
    areaBisnis: ["Operasional", "Kepatuhan"],
    promptTemplate: `Buatkan SOP Pengendalian Operasional Anti Penyuapan:
1. Tujuan dan ruang lingkup
2. Area operasional berisiko
3. Pengendalian per area:
   - Pengadaan
   - Penjualan
   - Proyek
   - Perizinan
   - Keuangan
4. Monitoring dan review
5. Eskalasi
6. Dokumentasi`,
  },
  {
    id: "T134",
    kode: "CHK-OPE-001",
    nama: "Checklist Pengendalian Operasional",
    namaEn: "Operational Control Checklist",
    kategori: "Checklist",
    klausul: "8.1",
    deskripsi: "Checklist pengendalian operasional anti penyuapan",
    penanggungJawab: "Unit Kerja",
    frekuensi: "Berkala",
    tingkatKritis: "Penting",
    areaBisnis: ["Operasional"],
    promptTemplate: `Buatkan Checklist Pengendalian Operasional:
Per proses bisnis:
- Pengendalian ada dan terdokumentasi
- Pengendalian dijalankan
- Bukti pelaksanaan tersedia
- Gap teridentifikasi
- Tindak lanjut dilakukan`,
  },
  {
    id: "T135",
    kode: "SOP-KTK-001",
    nama: "SOP Pengendalian Kontrak",
    namaEn: "Contract Control SOP",
    kategori: "SOP",
    klausul: "8.4",
    deskripsi: "Prosedur pengendalian kontrak untuk mencegah penyuapan",
    penanggungJawab: "Legal",
    frekuensi: "Sekali",
    tingkatKritis: "Wajib",
    areaBisnis: ["Legal", "Pengadaan"],
    promptTemplate: `Buatkan SOP Pengendalian Kontrak Anti Penyuapan:
1. Tujuan dan ruang lingkup
2. Klausul anti penyuapan wajib
3. Prosedur:
   - Draft kontrak
   - Review legal
   - Review FKAP
   - Negosiasi
   - Persetujuan
   - Tanda tangan
   - Monitoring
4. Template klausul
5. Dokumentasi`,
  },
  {
    id: "T136",
    kode: "FOR-KTK-001",
    nama: "Klausul Anti Penyuapan untuk Kontrak",
    namaEn: "Anti-Bribery Clause for Contracts",
    kategori: "Formulir",
    klausul: "8.4",
    deskripsi: "Template klausul anti penyuapan untuk dimasukkan dalam kontrak",
    penanggungJawab: "Legal",
    frekuensi: "Per Kontrak",
    tingkatKritis: "Wajib",
    areaBisnis: ["Legal"],
    promptTemplate: `Buatkan Template Klausul Anti Penyuapan untuk Kontrak:
"PASAL X - ANTI PENYUAPAN
X.1 Para pihak menyatakan akan mematuhi semua peraturan anti korupsi dan anti penyuapan.
X.2 Tidak ada pihak yang akan memberikan atau menawarkan sesuatu yang bernilai kepada pejabat publik atau pihak manapun untuk memperoleh keuntungan bisnis yang tidak semestinya.
X.3 Masing-masing pihak memiliki kebijakan anti penyuapan dan akan memastikan kepatuhan.
X.4 Pelanggaran atas pasal ini memberikan hak untuk mengakhiri kontrak.
X.5 Klausul ini berlaku untuk seluruh anak perusahaan, afiliasi, agen, dan perwakilan."`,
  },
  {
    id: "T137",
    kode: "REG-KTK-001",
    nama: "Register Kontrak dengan Klausul Anti Penyuapan",
    namaEn: "Contracts with Anti-Bribery Clause Register",
    kategori: "Register",
    klausul: "8.4",
    deskripsi: "Daftar kontrak yang memuat klausul anti penyuapan",
    penanggungJawab: "Legal",
    frekuensi: "Berkelanjutan",
    tingkatKritis: "Penting",
    areaBisnis: ["Legal"],
    promptTemplate: `Buatkan Register Kontrak dengan Klausul Anti Penyuapan:
Kolom: No | No Kontrak | Tanggal | Pihak Lawan | Jenis Kontrak | Nilai | Klausul AP Ada | Review FKAP | Status | Catatan`,
  },
  {
    id: "T138",
    kode: "SOP-KMT-001",
    nama: "SOP Komitmen Anti Penyuapan Pihak Ketiga",
    namaEn: "Third Party Anti-Bribery Commitment SOP",
    kategori: "SOP",
    klausul: "8.6",
    deskripsi: "Prosedur untuk mendapatkan komitmen anti penyuapan dari pihak ketiga",
    penanggungJawab: "FKAP",
    frekuensi: "Sekali",
    tingkatKritis: "Wajib",
    areaBisnis: ["Vendor", "Kepatuhan"],
    promptTemplate: `Buatkan SOP Komitmen Anti Penyuapan Pihak Ketiga:
1. Tujuan dan ruang lingkup
2. Pihak ketiga yang wajib berkomitmen
3. Prosedur:
   - Komunikasi kebijakan
   - Permintaan komitmen tertulis
   - Review dan arsip
   - Monitoring kepatuhan
4. Template surat komitmen
5. Konsekuensi pelanggaran`,
  },
  {
    id: "T139",
    kode: "FOR-KMT-003",
    nama: "Surat Pernyataan Anti Penyuapan Vendor",
    namaEn: "Vendor Anti-Bribery Declaration Letter",
    kategori: "Formulir",
    klausul: "8.6",
    deskripsi: "Template surat pernyataan anti penyuapan dari vendor",
    penanggungJawab: "Vendor",
    frekuensi: "Per Vendor",
    tingkatKritis: "Wajib",
    areaBisnis: ["Vendor"],
    promptTemplate: `Buatkan Surat Pernyataan Anti Penyuapan Vendor:
"Yang bertanda tangan di bawah ini:
Nama Perusahaan: _______________
Diwakili oleh: _______________
Jabatan: _______________

Dengan ini menyatakan:
1. Memahami dan mematuhi kebijakan anti penyuapan [NAMA PERUSAHAAN]
2. Tidak akan melakukan tindakan penyuapan
3. Akan melaporkan dugaan penyuapan
4. Bersedia menerima konsekuensi jika melanggar

Tanda tangan dan cap perusahaan"`,
  },
  {
    id: "T140",
    kode: "REG-KMT-001",
    nama: "Register Komitmen Pihak Ketiga",
    namaEn: "Third Party Commitment Register",
    kategori: "Register",
    klausul: "8.6",
    deskripsi: "Daftar pihak ketiga yang telah memberikan komitmen anti penyuapan",
    penanggungJawab: "FKAP",
    frekuensi: "Berkelanjutan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Vendor", "Kepatuhan"],
    promptTemplate: `Buatkan Register Komitmen Pihak Ketiga:
Kolom: No | Nama Pihak Ketiga | Jenis | Tanggal Komitmen | Masa Berlaku | Status | Dokumen | Catatan`,
  },
  {
    id: "T141",
    kode: "SOP-DAR-001",
    nama: "SOP Penanganan Ketidakcukupan Pengendalian",
    namaEn: "Inadequate Control Handling SOP",
    kategori: "SOP",
    klausul: "8.8",
    deskripsi: "Prosedur penanganan situasi di mana pengendalian anti penyuapan tidak memadai",
    penanggungJawab: "FKAP",
    frekuensi: "Sekali",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan SOP Penanganan Ketidakcukupan Pengendalian:
1. Tujuan dan ruang lingkup
2. Identifikasi situasi tidak memadai
3. Prosedur:
   - Pelaporan situasi
   - Penilaian risiko
   - Tindakan darurat
   - Penguatan pengendalian
   - Monitoring
4. Eskalasi ke manajemen
5. Dokumentasi`,
  },
  {
    id: "T142",
    kode: "FOR-DAR-001",
    nama: "Formulir Pelaporan Ketidakcukupan Pengendalian",
    namaEn: "Inadequate Control Report Form",
    kategori: "Formulir",
    klausul: "8.8",
    deskripsi: "Formulir pelaporan kondisi pengendalian yang tidak memadai",
    penanggungJawab: "Unit Kerja",
    frekuensi: "Ad-hoc",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Formulir Pelaporan Ketidakcukupan Pengendalian:
- Tanggal pelaporan
- Unit kerja
- Pengendalian yang tidak memadai
- Penyebab
- Risiko potensial
- Tindakan sementara
- Usulan perbaikan
- Review FKAP`,
  },
  {
    id: "T143",
    kode: "SOP-PEM-001",
    nama: "SOP Pemantauan Mitra Bisnis Berkelanjutan",
    namaEn: "Ongoing Business Partner Monitoring SOP",
    kategori: "SOP",
    klausul: "8.2",
    deskripsi: "Prosedur pemantauan berkelanjutan terhadap mitra bisnis",
    penanggungJawab: "FKAP",
    frekuensi: "Sekali",
    tingkatKritis: "Wajib",
    areaBisnis: ["Vendor", "Kepatuhan"],
    promptTemplate: `Buatkan SOP Pemantauan Mitra Bisnis Berkelanjutan:
1. Tujuan dan ruang lingkup
2. Frekuensi monitoring per risk level
3. Prosedur:
   - Review berkala
   - Update due diligence
   - Monitoring transaksi
   - Screening media/sanksi
   - Site visit (jika diperlukan)
4. Red flags yang dipantau
5. Tindakan jika ada temuan
6. Dokumentasi`,
  },
  {
    id: "T144",
    kode: "FOR-PEM-001",
    nama: "Formulir Monitoring Mitra Bisnis",
    namaEn: "Business Partner Monitoring Form",
    kategori: "Formulir",
    klausul: "8.2",
    deskripsi: "Formulir monitoring berkala mitra bisnis",
    penanggungJawab: "FKAP",
    frekuensi: "Per Monitoring",
    tingkatKritis: "Penting",
    areaBisnis: ["Vendor"],
    promptTemplate: `Buatkan Formulir Monitoring Mitra Bisnis:
- Nama mitra bisnis
- Periode monitoring
- Checklist pemeriksaan:
  * Perubahan kepemilikan
  * Adverse media
  * Sanksi list
  * Kinerja kontrak
  * Keluhan/insiden
- Temuan
- Kesimpulan risk rating
- Rekomendasi
- Next review date`,
  },
  {
    id: "T145",
    kode: "IK-UTU-001",
    nama: "Instruksi Kerja Screening Sanksi",
    namaEn: "Sanctions Screening Work Instruction",
    kategori: "Instruksi Kerja",
    klausul: "8.2",
    deskripsi: "Panduan teknis melakukan screening sanksi terhadap mitra bisnis",
    penanggungJawab: "FKAP",
    frekuensi: "Sekali",
    tingkatKritis: "Penting",
    areaBisnis: ["Vendor", "Kepatuhan"],
    promptTemplate: `Buatkan Instruksi Kerja Screening Sanksi:
1. Database sanksi yang digunakan
2. Cara melakukan screening
3. Interpretasi hasil
4. Tindakan jika ada match
5. Dokumentasi hasil
6. Frekuensi screening`,
  },
  {
    id: "T146",
    kode: "SOP-PRO-001",
    nama: "SOP Pengendalian Proyek Anti Penyuapan",
    namaEn: "Anti-Bribery Project Control SOP",
    kategori: "SOP",
    klausul: "8.1",
    deskripsi: "Prosedur pengendalian anti penyuapan dalam pelaksanaan proyek",
    penanggungJawab: "Project Manager",
    frekuensi: "Sekali",
    tingkatKritis: "Wajib",
    areaBisnis: ["Proyek", "Operasional"],
    promptTemplate: `Buatkan SOP Pengendalian Proyek Anti Penyuapan:
1. Tujuan dan ruang lingkup
2. Titik rawan penyuapan dalam proyek
3. Pengendalian per tahapan:
   - Tender dan pengadaan
   - Mobilisasi
   - Pelaksanaan
   - Progress claim
   - Serah terima
4. Peran dan tanggung jawab
5. Monitoring dan pelaporan
6. Dokumentasi`,
  },
  {
    id: "T147",
    kode: "CHK-PRO-001",
    nama: "Checklist Anti Penyuapan Proyek",
    namaEn: "Project Anti-Bribery Checklist",
    kategori: "Checklist",
    klausul: "8.1",
    deskripsi: "Checklist pengendalian anti penyuapan untuk proyek",
    penanggungJawab: "Project Manager",
    frekuensi: "Per Milestone",
    tingkatKritis: "Wajib",
    areaBisnis: ["Proyek"],
    promptTemplate: `Buatkan Checklist Anti Penyuapan Proyek:
Per tahapan proyek:
- Tender: Due diligence owner, fairness proses
- Kontrak: Klausul anti penyuapan ada
- Pengadaan: Due diligence subkon/supplier
- Perizinan: Prosedur yang sah
- Progress: Verifikasi volume
- Pembayaran: Otorisasi sesuai
- Serah terima: Dokumentasi lengkap`,
  },
  {
    id: "T148",
    kode: "SOP-PGD-001",
    nama: "SOP Pengadaan Anti Penyuapan",
    namaEn: "Anti-Bribery Procurement SOP",
    kategori: "SOP",
    klausul: "8.1",
    subKlausul: "8.2",
    deskripsi: "Prosedur pengadaan yang mencegah penyuapan",
    penanggungJawab: "Pengadaan",
    frekuensi: "Sekali",
    tingkatKritis: "Wajib",
    areaBisnis: ["Pengadaan"],
    promptTemplate: `Buatkan SOP Pengadaan Anti Penyuapan:
1. Tujuan dan ruang lingkup
2. Prinsip pengadaan (transparan, kompetitif, adil)
3. Prosedur:
   - Perencanaan pengadaan
   - Vendor registration
   - Due diligence vendor
   - Tender/seleksi
   - Evaluasi dan awarding
   - Kontrak
   - Monitoring vendor
4. Pengendalian per tahap
5. Red flags
6. Dokumentasi`,
  },
  {
    id: "T149",
    kode: "FOR-PGD-001",
    nama: "Formulir Evaluasi Vendor dalam Tender",
    namaEn: "Vendor Evaluation in Tender Form",
    kategori: "Formulir",
    klausul: "8.1",
    deskripsi: "Formulir evaluasi vendor yang mencakup aspek anti penyuapan",
    penanggungJawab: "Pengadaan",
    frekuensi: "Per Tender",
    tingkatKritis: "Wajib",
    areaBisnis: ["Pengadaan"],
    promptTemplate: `Buatkan Formulir Evaluasi Vendor dalam Tender:
- Data tender
- Data vendor
- Kriteria evaluasi:
  * Teknis
  * Harga
  * Pengalaman
  * Keuangan
  * Due diligence (anti penyuapan)
- Scoring
- Ranking
- Rekomendasi
- Approval komite`,
  },
  {
    id: "T150",
    kode: "SOP-IZN-001",
    nama: "SOP Pengurusan Izin dan Lisensi",
    namaEn: "Permit and License Processing SOP",
    kategori: "SOP",
    klausul: "8.1",
    deskripsi: "Prosedur pengurusan izin yang mencegah penyuapan",
    penanggungJawab: "Legal",
    frekuensi: "Sekali",
    tingkatKritis: "Wajib",
    areaBisnis: ["Legal", "Perizinan"],
    promptTemplate: `Buatkan SOP Pengurusan Izin dan Lisensi:
1. Tujuan dan ruang lingkup
2. Prinsip (legal, transparan)
3. Prosedur:
   - Identifikasi izin yang diperlukan
   - Persiapan dokumen
   - Pengajuan resmi
   - Monitoring proses
   - Pembayaran resmi
   - Dokumentasi
4. Larangan fasilitasi payment
5. Red flags
6. Eskalasi`,
  },
  {
    id: "T151",
    kode: "REG-IZN-001",
    nama: "Register Izin dan Perizinan",
    namaEn: "Permit and License Register",
    kategori: "Register",
    klausul: "8.1",
    deskripsi: "Daftar izin dan status pengurusannya",
    penanggungJawab: "Legal",
    frekuensi: "Berkelanjutan",
    tingkatKritis: "Penting",
    areaBisnis: ["Legal", "Perizinan"],
    promptTemplate: `Buatkan Register Izin dan Perizinan:
Kolom: No | Jenis Izin | Instansi | Tanggal Pengajuan | Biaya Resmi | Status | Tanggal Terbit | Masa Berlaku | PIC | Catatan`,
  },
  {
    id: "T152",
    kode: "IK-OPE-001",
    nama: "Instruksi Kerja Penolakan Permintaan Suap",
    namaEn: "Bribe Request Rejection Work Instruction",
    kategori: "Instruksi Kerja",
    klausul: "8.1",
    deskripsi: "Panduan cara menolak permintaan suap dari pihak manapun",
    penanggungJawab: "FKAP",
    frekuensi: "Sekali",
    tingkatKritis: "Wajib",
    areaBisnis: ["Operasional", "Kepatuhan"],
    promptTemplate: `Buatkan Instruksi Kerja Penolakan Permintaan Suap:
1. Kenali tanda-tanda permintaan suap
2. Tetap tenang dan profesional
3. Tolak dengan tegas tapi sopan
4. Catat detail kejadian
5. Laporkan segera ke atasan/FKAP
6. Dokumentasikan
7. Hindari konfrontasi
8. Jangan bernegosiasi`,
  },
  {
    id: "T153",
    kode: "FOR-OPE-001",
    nama: "Formulir Pelaporan Permintaan Suap",
    namaEn: "Bribe Request Report Form",
    kategori: "Formulir",
    klausul: "8.1",
    deskripsi: "Formulir pelaporan ketika menerima permintaan suap",
    penanggungJawab: "Personel",
    frekuensi: "Per Kejadian",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Formulir Pelaporan Permintaan Suap:
- Tanggal kejadian
- Tanggal pelaporan
- Pelapor
- Pihak yang meminta
- Jabatan/institusi peminta
- Bentuk yang diminta
- Nilai/estimasi
- Konteks permintaan
- Respons yang diberikan
- Saksi (jika ada)
- Bukti pendukung`,
  },
  {
    id: "T154",
    kode: "SOP-AKT-001",
    nama: "SOP Aktivitas dengan Pejabat Publik",
    namaEn: "Activities with Public Officials SOP",
    kategori: "SOP",
    klausul: "8.1",
    deskripsi: "Prosedur interaksi dengan pejabat publik/pemerintah",
    penanggungJawab: "FKAP",
    frekuensi: "Sekali",
    tingkatKritis: "Wajib",
    areaBisnis: ["Pemerintah", "Kepatuhan"],
    promptTemplate: `Buatkan SOP Aktivitas dengan Pejabat Publik:
1. Tujuan dan ruang lingkup
2. Definisi pejabat publik
3. Prosedur:
   - Pertemuan formal
   - Dokumentasi interaksi
   - Hadiah dan keramahtamahan
   - Larangan fasilitasi payment
4. Hal yang diperbolehkan/dilarang
5. Pencatatan
6. Eskalasi`,
  },
  {
    id: "T155",
    kode: "REG-AKT-001",
    nama: "Register Interaksi dengan Pejabat Publik",
    namaEn: "Public Official Interaction Register",
    kategori: "Register",
    klausul: "8.1",
    deskripsi: "Daftar interaksi signifikan dengan pejabat publik",
    penanggungJawab: "FKAP",
    frekuensi: "Berkelanjutan",
    tingkatKritis: "Penting",
    areaBisnis: ["Pemerintah"],
    promptTemplate: `Buatkan Register Interaksi dengan Pejabat Publik:
Kolom: No | Tanggal | Nama Pejabat | Instansi | Jabatan | Tujuan Pertemuan | Lokasi | Personel Hadir | Hasil | Catatan`,
  },
  {
    id: "T156",
    kode: "CHK-UTU-002",
    nama: "Checklist Due Diligence Subkontraktor",
    namaEn: "Subcontractor Due Diligence Checklist",
    kategori: "Checklist",
    klausul: "8.2",
    deskripsi: "Checklist uji tuntas untuk subkontraktor proyek",
    penanggungJawab: "Project Manager",
    frekuensi: "Per Subkontraktor",
    tingkatKritis: "Wajib",
    areaBisnis: ["Subkontraktor", "Proyek"],
    promptTemplate: `Buatkan Checklist Due Diligence Subkontraktor:
- Legalitas perusahaan
- SBU dan SKA/SKT
- Track record proyek
- Kesehatan keuangan
- Referensi owner
- Kebijakan anti penyuapan
- Beneficial ownership
- Adverse media check
- Konflik kepentingan
- Pakta integritas`,
  },
  {
    id: "T157",
    kode: "FOR-UTU-002",
    nama: "Formulir Kuesioner Due Diligence",
    namaEn: "Due Diligence Questionnaire Form",
    kategori: "Formulir",
    klausul: "8.2",
    deskripsi: "Kuesioner due diligence untuk diisi mitra bisnis",
    penanggungJawab: "Mitra Bisnis",
    frekuensi: "Per Mitra",
    tingkatKritis: "Wajib",
    areaBisnis: ["Vendor"],
    promptTemplate: `Buatkan Formulir Kuesioner Due Diligence:
Bagian A: Informasi Umum Perusahaan
Bagian B: Kepemilikan dan Manajemen
Bagian C: Hubungan dengan Pejabat Publik
Bagian D: Kebijakan dan Prosedur Anti Korupsi
Bagian E: Sejarah Litigasi/Investigasi
Bagian F: Referensi Bisnis
Bagian G: Pernyataan dan Tanda Tangan`,
  },
  {
    id: "T158",
    kode: "SOP-AGE-001",
    nama: "SOP Penunjukan dan Pengawasan Agen",
    namaEn: "Agent Appointment and Monitoring SOP",
    kategori: "SOP",
    klausul: "8.2",
    subKlausul: "8.5",
    deskripsi: "Prosedur penunjukan dan pengawasan agen/perwakilan",
    penanggungJawab: "FKAP",
    frekuensi: "Sekali",
    tingkatKritis: "Wajib",
    areaBisnis: ["Operasional", "Kepatuhan"],
    promptTemplate: `Buatkan SOP Penunjukan dan Pengawasan Agen:
1. Tujuan dan ruang lingkup
2. Definisi agen
3. Prosedur penunjukan:
   - Justifikasi kebutuhan
   - Due diligence enhanced
   - Approval manajemen
   - Kontrak dengan klausul AP
4. Prosedur pengawasan:
   - Monitoring aktivitas
   - Review fee/komisi
   - Audit berkala
5. Terminasi
6. Dokumentasi`,
  },
  {
    id: "T159",
    kode: "REG-AGE-001",
    nama: "Register Agen dan Perwakilan",
    namaEn: "Agents and Representatives Register",
    kategori: "Register",
    klausul: "8.5",
    deskripsi: "Daftar agen dan perwakilan perusahaan",
    penanggungJawab: "FKAP",
    frekuensi: "Berkelanjutan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Operasional"],
    promptTemplate: `Buatkan Register Agen dan Perwakilan:
Kolom: No | Nama Agen | Wilayah | Tanggal Penunjukan | Due Diligence Status | Kontrak No | Fee/Komisi | Monitoring Status | Next Review | Catatan`,
  },
  {
    id: "T160",
    kode: "LAP-OPE-001",
    nama: "Laporan Monitoring Pengendalian Operasional",
    namaEn: "Operational Control Monitoring Report",
    kategori: "Laporan",
    klausul: "8.1",
    deskripsi: "Laporan hasil monitoring pengendalian operasional anti penyuapan",
    penanggungJawab: "FKAP",
    frekuensi: "Kuartal",
    tingkatKritis: "Wajib",
    areaBisnis: ["Operasional", "Kepatuhan"],
    promptTemplate: `Buatkan Laporan Monitoring Pengendalian Operasional:
1. Ringkasan eksekutif
2. Cakupan monitoring
3. Hasil per area operasional:
   - Pengadaan
   - Proyek
   - Perizinan
   - Keuangan
4. Temuan dan gap
5. Tindakan perbaikan
6. Rekomendasi
7. Rencana tindak lanjut`,
  },

  // ============================================
  // KLAUSUL 9 - EVALUASI KINERJA (25 templates)
  // ============================================
  {
    id: "T161",
    kode: "SOP-PMT-001",
    nama: "SOP Pemantauan dan Pengukuran SMAP",
    namaEn: "ABMS Monitoring and Measurement SOP",
    kategori: "SOP",
    klausul: "9.1",
    deskripsi: "Prosedur pemantauan dan pengukuran kinerja SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Sekali",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan SOP Pemantauan dan Pengukuran SMAP:
1. Tujuan dan ruang lingkup
2. Apa yang dipantau dan diukur
3. Metode pemantauan
4. Frekuensi
5. PIC pemantauan
6. Analisis dan evaluasi hasil
7. Pelaporan
8. Tindak lanjut`,
  },
  {
    id: "T162",
    kode: "REG-IND-001",
    nama: "Register Indikator Kinerja SMAP",
    namaEn: "ABMS Key Performance Indicator Register",
    kategori: "Register",
    klausul: "9.1",
    deskripsi: "Daftar indikator kinerja kunci SMAP dan targetnya",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Register Indikator Kinerja SMAP:
Kolom: No | KPI | Deskripsi | Formula | Target | Frekuensi Ukur | Sumber Data | PIC | Realisasi YTD | Status`,
  },
  {
    id: "T163",
    kode: "LAP-PMT-001",
    nama: "Laporan Pemantauan Kinerja SMAP",
    namaEn: "ABMS Performance Monitoring Report",
    kategori: "Laporan",
    klausul: "9.1",
    deskripsi: "Laporan hasil pemantauan dan pengukuran kinerja SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Kuartal",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan Laporan Pemantauan Kinerja SMAP:
1. Ringkasan eksekutif
2. Periode pemantauan
3. Pencapaian KPI:
   - Target vs realisasi
   - Trend
   - Analisis variance
4. Aktivitas yang terlaksana
5. Insiden dan pelaporan
6. Temuan dan isu
7. Rekomendasi
8. Rencana periode berikutnya`,
  },
  {
    id: "T164",
    kode: "SOP-AUI-001",
    nama: "SOP Audit Internal SMAP",
    namaEn: "ABMS Internal Audit SOP",
    kategori: "SOP",
    klausul: "9.2",
    deskripsi: "Prosedur pelaksanaan audit internal SMAP",
    penanggungJawab: "Audit Internal",
    frekuensi: "Sekali",
    tingkatKritis: "Wajib",
    areaBisnis: ["Audit", "Kepatuhan"],
    promptTemplate: `Buatkan SOP Audit Internal SMAP:
1. Tujuan dan ruang lingkup
2. Referensi (ISO 37001 klausul 9.2)
3. Persyaratan auditor
4. Prosedur:
   - Perencanaan audit
   - Persiapan
   - Pelaksanaan (opening, fieldwork, closing)
   - Pelaporan
   - Tindak lanjut
5. Independensi dan objektivitas
6. Dokumentasi`,
  },
  {
    id: "T165",
    kode: "PRO-AUI-001",
    nama: "Program Audit Internal SMAP Tahunan",
    namaEn: "Annual ABMS Internal Audit Program",
    kategori: "Program",
    klausul: "9.2",
    deskripsi: "Program audit internal SMAP untuk satu tahun",
    penanggungJawab: "Audit Internal",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Audit"],
    promptTemplate: `Buatkan Program Audit Internal SMAP Tahunan:
Kolom: No | Area/Proses | Klausul ISO | Risiko | Q1 | Q2 | Q3 | Q4 | Auditor | Status
Pertimbangan:
- Coverage semua klausul dalam 3 tahun
- Risk-based prioritization
- Rotasi auditor
- Sumber daya`,
  },
  {
    id: "T166",
    kode: "FOR-AUI-001",
    nama: "Formulir Rencana Audit",
    namaEn: "Audit Plan Form",
    kategori: "Formulir",
    klausul: "9.2",
    deskripsi: "Formulir perencanaan pelaksanaan audit",
    penanggungJawab: "Audit Internal",
    frekuensi: "Per Audit",
    tingkatKritis: "Wajib",
    areaBisnis: ["Audit"],
    promptTemplate: `Buatkan Formulir Rencana Audit:
- Judul audit
- Ruang lingkup
- Kriteria audit
- Referensi
- Tim audit
- Auditee
- Jadwal (opening, fieldwork, closing)
- Dokumen yang diperlukan
- Checklist audit
- Persetujuan`,
  },
  {
    id: "T167",
    kode: "CHK-AUI-001",
    nama: "Checklist Audit Internal SMAP",
    namaEn: "ABMS Internal Audit Checklist",
    kategori: "Checklist",
    klausul: "9.2",
    deskripsi: "Checklist audit internal per klausul ISO 37001",
    penanggungJawab: "Audit Internal",
    frekuensi: "Per Audit",
    tingkatKritis: "Wajib",
    areaBisnis: ["Audit"],
    promptTemplate: `Buatkan Checklist Audit Internal SMAP per Klausul:
Format per klausul:
- Persyaratan
- Pertanyaan audit
- Bukti yang diperiksa
- Temuan (C/NC/OFI)
- Catatan
- Referensi dokumen`,
  },
  {
    id: "T168",
    kode: "FOR-AUI-002",
    nama: "Formulir Temuan Audit",
    namaEn: "Audit Finding Form",
    kategori: "Formulir",
    klausul: "9.2",
    deskripsi: "Formulir dokumentasi temuan audit",
    penanggungJawab: "Audit Internal",
    frekuensi: "Per Temuan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Audit"],
    promptTemplate: `Buatkan Formulir Temuan Audit:
- Nomor temuan
- Tanggal
- Area audit
- Klausul terkait
- Deskripsi temuan
- Kriteria (persyaratan)
- Kondisi (fakta)
- Bukti
- Klasifikasi (Major/Minor NC, OFI)
- Rekomendasi
- Tanda tangan auditor`,
  },
  {
    id: "T169",
    kode: "LAP-AUI-001",
    nama: "Template Laporan Audit Internal SMAP",
    namaEn: "ABMS Internal Audit Report Template",
    kategori: "Laporan",
    klausul: "9.2",
    deskripsi: "Template laporan hasil audit internal SMAP",
    penanggungJawab: "Audit Internal",
    frekuensi: "Per Audit",
    tingkatKritis: "Wajib",
    areaBisnis: ["Audit"],
    promptTemplate: `Buatkan Template Laporan Audit Internal SMAP:
1. Ringkasan eksekutif
2. Latar belakang dan tujuan
3. Ruang lingkup dan metodologi
4. Tim audit dan auditee
5. Temuan audit:
   - Ketidaksesuaian major
   - Ketidaksesuaian minor
   - Opportunities for improvement
6. Kesimpulan
7. Rekomendasi
8. Lampiran (checklist, bukti)`,
  },
  {
    id: "T170",
    kode: "REG-AUI-001",
    nama: "Register Temuan Audit",
    namaEn: "Audit Finding Register",
    kategori: "Register",
    klausul: "9.2",
    deskripsi: "Daftar temuan audit dan status tindak lanjutnya",
    penanggungJawab: "Audit Internal",
    frekuensi: "Berkelanjutan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Audit"],
    promptTemplate: `Buatkan Register Temuan Audit:
Kolom: No Temuan | Tanggal | Audit | Area | Klausul | Deskripsi | Klasifikasi | Tindak Lanjut | PIC | Target | Status Verifikasi | Close Date`,
  },
  {
    id: "T171",
    kode: "FOR-TKL-001",
    nama: "Formulir Tindak Lanjut Temuan Audit",
    namaEn: "Audit Finding Follow-up Form",
    kategori: "Formulir",
    klausul: "9.2",
    deskripsi: "Formulir rencana dan pelaksanaan tindak lanjut temuan audit",
    penanggungJawab: "Auditee",
    frekuensi: "Per Temuan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Audit"],
    promptTemplate: `Buatkan Formulir Tindak Lanjut Temuan Audit:
- Nomor temuan
- Deskripsi temuan
- Root cause analysis
- Tindakan korektif
- Tindakan pencegahan
- PIC
- Target penyelesaian
- Bukti penyelesaian
- Verifikasi auditor
- Status close`,
  },
  {
    id: "T172",
    kode: "SOP-RTM-001",
    nama: "SOP Tinjauan Manajemen SMAP",
    namaEn: "ABMS Management Review SOP",
    kategori: "SOP",
    klausul: "9.3",
    deskripsi: "Prosedur pelaksanaan tinjauan manajemen SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Sekali",
    tingkatKritis: "Wajib",
    areaBisnis: ["Manajemen", "Kepatuhan"],
    promptTemplate: `Buatkan SOP Tinjauan Manajemen SMAP:
1. Tujuan dan ruang lingkup
2. Referensi (ISO 37001 klausul 9.3)
3. Frekuensi RTM
4. Peserta RTM
5. Input RTM:
   - Status tindak lanjut RTM sebelumnya
   - Perubahan isu internal/eksternal
   - Kinerja SMAP
   - Ketidaksesuaian dan tindakan korektif
   - Hasil audit
   - Laporan pelanggaran
   - Efektivitas pengendalian
6. Output RTM
7. Dokumentasi`,
  },
  {
    id: "T173",
    kode: "FOR-RTM-001",
    nama: "Formulir Input Tinjauan Manajemen",
    namaEn: "Management Review Input Form",
    kategori: "Formulir",
    klausul: "9.3",
    deskripsi: "Formulir pengumpulan input untuk RTM",
    penanggungJawab: "FKAP",
    frekuensi: "Per RTM",
    tingkatKritis: "Wajib",
    areaBisnis: ["Manajemen"],
    promptTemplate: `Buatkan Formulir Input Tinjauan Manajemen:
- Periode yang ditinjau
- Status tindak lanjut RTM sebelumnya
- Perubahan konteks organisasi
- Kinerja SMAP (KPI)
- Ketidaksesuaian dan corrective actions
- Hasil audit internal
- Laporan dari FKAP
- Insiden penyuapan/dugaan
- Umpan balik pemangku kepentingan
- Peluang perbaikan`,
  },
  {
    id: "T174",
    kode: "REG-RTM-001",
    nama: "Register Keputusan RTM",
    namaEn: "Management Review Decision Register",
    kategori: "Register",
    klausul: "9.3",
    deskripsi: "Daftar keputusan RTM dan status implementasinya",
    penanggungJawab: "FKAP",
    frekuensi: "Per RTM",
    tingkatKritis: "Wajib",
    areaBisnis: ["Manajemen"],
    promptTemplate: `Buatkan Register Keputusan RTM:
Kolom: No | RTM Tanggal | Keputusan | Tindakan | PIC | Target | Status | Catatan`,
  },
  {
    id: "T175",
    kode: "SOP-TFP-001",
    nama: "SOP Tinjauan Fungsi Kepatuhan",
    namaEn: "Compliance Function Review SOP",
    kategori: "SOP",
    klausul: "9.4",
    deskripsi: "Prosedur tinjauan kinerja Fungsi Kepatuhan Anti Penyuapan",
    penanggungJawab: "Direksi",
    frekuensi: "Sekali",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan SOP Tinjauan Fungsi Kepatuhan:
1. Tujuan dan ruang lingkup
2. Referensi (ISO 37001 klausul 9.4)
3. Frekuensi tinjauan
4. Aspek yang ditinjau:
   - Status dan wewenang FKAP
   - Kompetensi dan pelatihan
   - Sumber daya
   - Independensi
   - Kinerja FKAP
5. Pelaksana tinjauan
6. Output dan tindak lanjut
7. Dokumentasi`,
  },
  {
    id: "T176",
    kode: "FOR-TFP-001",
    nama: "Formulir Tinjauan Fungsi Kepatuhan",
    namaEn: "Compliance Function Review Form",
    kategori: "Formulir",
    klausul: "9.4",
    deskripsi: "Formulir penilaian kinerja FKAP",
    penanggungJawab: "Direksi",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Formulir Tinjauan Fungsi Kepatuhan:
- Periode tinjauan
- Evaluasi per aspek:
  1. Status dan wewenang (skor 1-5)
  2. Kompetensi personel (skor 1-5)
  3. Kecukupan sumber daya (skor 1-5)
  4. Independensi (skor 1-5)
  5. Kinerja dan deliverables (skor 1-5)
- Komentar per aspek
- Kesimpulan keseluruhan
- Rekomendasi perbaikan
- Tanda tangan penilai`,
  },
  {
    id: "T177",
    kode: "LAP-TFP-001",
    nama: "Laporan Tinjauan Fungsi Kepatuhan",
    namaEn: "Compliance Function Review Report",
    kategori: "Laporan",
    klausul: "9.4",
    deskripsi: "Laporan hasil tinjauan kinerja FKAP",
    penanggungJawab: "Direksi",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan Laporan Tinjauan Fungsi Kepatuhan:
1. Ringkasan eksekutif
2. Metodologi tinjauan
3. Hasil evaluasi per aspek
4. Kekuatan FKAP
5. Area yang perlu perbaikan
6. Rekomendasi
7. Rencana pengembangan FKAP
8. Kesimpulan`,
  },
  {
    id: "T178",
    kode: "FOR-PMT-001",
    nama: "Formulir Monitoring KPI SMAP",
    namaEn: "ABMS KPI Monitoring Form",
    kategori: "Formulir",
    klausul: "9.1",
    deskripsi: "Formulir pemantauan KPI SMAP berkala",
    penanggungJawab: "FKAP",
    frekuensi: "Bulanan",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Formulir Monitoring KPI SMAP:
- Periode monitoring
- KPI dan target
- Realisasi
- Variance
- Trend (vs bulan lalu)
- Analisis
- Tindakan yang diperlukan
- PIC
- Status`,
  },
  {
    id: "T179",
    kode: "MAT-AUI-001",
    nama: "Matriks Kompetensi Auditor Internal SMAP",
    namaEn: "ABMS Internal Auditor Competency Matrix",
    kategori: "Matriks",
    klausul: "9.2",
    deskripsi: "Matriks kompetensi yang diperlukan untuk auditor internal SMAP",
    penanggungJawab: "Audit Internal",
    frekuensi: "Tahunan",
    tingkatKritis: "Penting",
    areaBisnis: ["Audit"],
    promptTemplate: `Buatkan Matriks Kompetensi Auditor Internal SMAP:
Kolom: Kompetensi | Lead Auditor | Auditor | Auditor in Training
Kompetensi:
- Pemahaman ISO 37001
- Teknik audit
- Anti penyuapan/korupsi
- Industri konstruksi
- Investigasi
- Komunikasi
- Pelaporan`,
  },
  {
    id: "T180",
    kode: "IK-AUI-001",
    nama: "Instruksi Kerja Pengambilan Sampel Audit",
    namaEn: "Audit Sampling Work Instruction",
    kategori: "Instruksi Kerja",
    klausul: "9.2",
    deskripsi: "Panduan teknis pengambilan sampel dalam audit SMAP",
    penanggungJawab: "Audit Internal",
    frekuensi: "Sekali",
    tingkatKritis: "Pendukung",
    areaBisnis: ["Audit"],
    promptTemplate: `Buatkan Instruksi Kerja Pengambilan Sampel Audit:
1. Tujuan sampling
2. Metode sampling:
   - Random sampling
   - Judgmental sampling
   - Risk-based sampling
3. Penentuan ukuran sampel
4. Dokumentasi sampling
5. Evaluasi hasil sampel`,
  },
  {
    id: "T181",
    kode: "LAP-AUI-002",
    nama: "Laporan Ringkasan Audit Tahunan",
    namaEn: "Annual Audit Summary Report",
    kategori: "Laporan",
    klausul: "9.2",
    deskripsi: "Laporan ringkasan hasil audit internal SMAP tahunan",
    penanggungJawab: "Audit Internal",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Audit", "Manajemen"],
    promptTemplate: `Buatkan Laporan Ringkasan Audit Tahunan:
1. Ringkasan eksekutif
2. Pelaksanaan program audit
3. Statistik temuan:
   - Per klasifikasi
   - Per klausul
   - Per unit kerja
4. Trend temuan (vs tahun lalu)
5. Status tindak lanjut
6. Efektivitas SMAP
7. Area yang perlu perhatian
8. Rencana audit tahun depan`,
  },
  {
    id: "T182",
    kode: "CHK-RTM-001",
    nama: "Checklist Kelengkapan RTM",
    namaEn: "Management Review Completeness Checklist",
    kategori: "Checklist",
    klausul: "9.3",
    deskripsi: "Checklist kelengkapan pelaksanaan RTM",
    penanggungJawab: "FKAP",
    frekuensi: "Per RTM",
    tingkatKritis: "Pendukung",
    areaBisnis: ["Manajemen"],
    promptTemplate: `Buatkan Checklist Kelengkapan RTM:
Pre-RTM:
- Undangan dikirim
- Materi disiapkan
- Input RTM dikumpulkan
- Ruangan dan peralatan siap
During RTM:
- Quorum terpenuhi
- Semua agenda dibahas
- Keputusan dicatat
Post-RTM:
- Berita acara dibuat
- Keputusan dikomunikasikan
- Tindak lanjut dimonitor`,
  },
  {
    id: "T183",
    kode: "FOR-EVA-001",
    nama: "Formulir Evaluasi Efektivitas Pengendalian",
    namaEn: "Control Effectiveness Evaluation Form",
    kategori: "Formulir",
    klausul: "9.1",
    deskripsi: "Formulir evaluasi efektivitas pengendalian anti penyuapan",
    penanggungJawab: "FKAP",
    frekuensi: "Semester",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Formulir Evaluasi Efektivitas Pengendalian:
Per pengendalian:
- Nama pengendalian
- Tujuan pengendalian
- Desain pengendalian (efektif/tidak)
- Implementasi (dilaksanakan/tidak)
- Bukti pelaksanaan
- Efektivitas (0-100%)
- Gap
- Rekomendasi perbaikan`,
  },
  {
    id: "T184",
    kode: "REG-AUD-001",
    nama: "Register Auditor Internal SMAP",
    namaEn: "ABMS Internal Auditor Register",
    kategori: "Register",
    klausul: "9.2",
    deskripsi: "Daftar auditor internal SMAP dan kualifikasinya",
    penanggungJawab: "Audit Internal",
    frekuensi: "Tahunan",
    tingkatKritis: "Penting",
    areaBisnis: ["Audit"],
    promptTemplate: `Buatkan Register Auditor Internal SMAP:
Kolom: No | Nama | Jabatan | Kualifikasi (Lead/Auditor/AiT) | Sertifikasi | Pelatihan | Pengalaman Audit | Status`,
  },
  {
    id: "T185",
    kode: "LAP-EVA-001",
    nama: "Laporan Analisis dan Evaluasi SMAP",
    namaEn: "ABMS Analysis and Evaluation Report",
    kategori: "Laporan",
    klausul: "9.1",
    deskripsi: "Laporan komprehensif analisis dan evaluasi kinerja SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan Laporan Analisis dan Evaluasi SMAP:
1. Ringkasan eksekutif
2. Metodologi evaluasi
3. Kinerja sasaran dan program
4. Efektivitas pengendalian
5. Hasil pemantauan dan pengukuran
6. Analisis insiden dan pelaporan
7. Hasil audit internal
8. Benchmark industri
9. Kekuatan dan kelemahan
10. Rekomendasi perbaikan
11. Rencana ke depan`,
  },

  // ============================================
  // KLAUSUL 10 - PERBAIKAN (15 templates)
  // ============================================
  {
    id: "T186",
    kode: "SOP-TKS-001",
    nama: "SOP Ketidaksesuaian dan Tindakan Korektif",
    namaEn: "Nonconformity and Corrective Action SOP",
    kategori: "SOP",
    klausul: "10.1",
    deskripsi: "Prosedur penanganan ketidaksesuaian dan tindakan korektif SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Sekali",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan SOP Ketidaksesuaian dan Tindakan Korektif SMAP:
1. Tujuan dan ruang lingkup
2. Referensi (ISO 37001 klausul 10.1)
3. Definisi ketidaksesuaian
4. Prosedur:
   - Identifikasi ketidaksesuaian
   - Tindakan untuk mengendalikan dan memperbaiki
   - Evaluasi kebutuhan tindakan korektif
   - Root cause analysis
   - Implementasi tindakan
   - Review efektivitas
5. Dokumentasi
6. Pencegahan terulang`,
  },
  {
    id: "T187",
    kode: "FOR-TKS-001",
    nama: "Formulir Laporan Ketidaksesuaian",
    namaEn: "Nonconformity Report Form",
    kategori: "Formulir",
    klausul: "10.1",
    deskripsi: "Formulir pelaporan dan penanganan ketidaksesuaian",
    penanggungJawab: "Unit Kerja",
    frekuensi: "Per Kejadian",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Formulir Laporan Ketidaksesuaian:
Bagian A: Identifikasi
- Nomor NCR
- Tanggal
- Sumber (audit, monitoring, laporan)
- Deskripsi ketidaksesuaian
- Klausul terkait
- Bukti

Bagian B: Tindakan Perbaikan
- Tindakan segera
- Root cause analysis (5 Why / Fishbone)
- Tindakan korektif
- PIC dan target

Bagian C: Verifikasi
- Bukti penyelesaian
- Verifikasi efektivitas
- Status close`,
  },
  {
    id: "T188",
    kode: "REG-TKS-001",
    nama: "Register Ketidaksesuaian dan Tindakan Korektif",
    namaEn: "Nonconformity and Corrective Action Register",
    kategori: "Register",
    klausul: "10.1",
    deskripsi: "Daftar ketidaksesuaian dan status tindakan korektifnya",
    penanggungJawab: "FKAP",
    frekuensi: "Berkelanjutan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Register Ketidaksesuaian dan Tindakan Korektif:
Kolom: No NCR | Tanggal | Sumber | Deskripsi | Klausul | Root Cause | Tindakan Korektif | PIC | Target | Status Verifikasi | Close Date`,
  },
  {
    id: "T189",
    kode: "IK-TKS-001",
    nama: "Instruksi Kerja Root Cause Analysis",
    namaEn: "Root Cause Analysis Work Instruction",
    kategori: "Instruksi Kerja",
    klausul: "10.1",
    deskripsi: "Panduan teknis melakukan root cause analysis",
    penanggungJawab: "FKAP",
    frekuensi: "Sekali",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Instruksi Kerja Root Cause Analysis:
1. Kapan RCA diperlukan
2. Metode RCA:
   - 5 Why analysis
   - Fishbone/Ishikawa diagram
   - Fault tree analysis
3. Langkah-langkah pelaksanaan
4. Dokumentasi hasil
5. Validasi root cause
6. Template RCA`,
  },
  {
    id: "T190",
    kode: "SOP-PBK-001",
    nama: "SOP Perbaikan Berkelanjutan SMAP",
    namaEn: "ABMS Continual Improvement SOP",
    kategori: "SOP",
    klausul: "10.2",
    deskripsi: "Prosedur perbaikan berkelanjutan SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Sekali",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan SOP Perbaikan Berkelanjutan SMAP:
1. Tujuan dan ruang lingkup
2. Referensi (ISO 37001 klausul 10.2)
3. Sumber input perbaikan:
   - Hasil RTM
   - Temuan audit
   - Analisis kinerja
   - Umpan balik
   - Lessons learned
4. Prosedur:
   - Identifikasi peluang perbaikan
   - Evaluasi dan prioritisasi
   - Implementasi
   - Monitoring hasil
5. PDCA cycle
6. Dokumentasi`,
  },
  {
    id: "T191",
    kode: "REG-PBK-001",
    nama: "Register Inisiatif Perbaikan Berkelanjutan",
    namaEn: "Continual Improvement Initiative Register",
    kategori: "Register",
    klausul: "10.2",
    deskripsi: "Daftar inisiatif perbaikan berkelanjutan SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Berkelanjutan",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Register Inisiatif Perbaikan Berkelanjutan:
Kolom: No | Tanggal | Sumber | Inisiatif Perbaikan | Tujuan | PIC | Timeline | Status | Hasil | Catatan`,
  },
  {
    id: "T192",
    kode: "FOR-PBK-001",
    nama: "Formulir Usulan Perbaikan",
    namaEn: "Improvement Proposal Form",
    kategori: "Formulir",
    klausul: "10.2",
    deskripsi: "Formulir pengajuan usulan perbaikan SMAP",
    penanggungJawab: "Semua Personel",
    frekuensi: "Ad-hoc",
    tingkatKritis: "Pendukung",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Formulir Usulan Perbaikan SMAP:
- Tanggal pengajuan
- Pengusul
- Unit kerja
- Area perbaikan
- Kondisi saat ini
- Usulan perbaikan
- Manfaat yang diharapkan
- Estimasi resource
- Review FKAP
- Keputusan (terima/tolak/pending)
- Rencana implementasi`,
  },
  {
    id: "T193",
    kode: "LAP-PBK-001",
    nama: "Laporan Perbaikan Berkelanjutan",
    namaEn: "Continual Improvement Report",
    kategori: "Laporan",
    klausul: "10.2",
    deskripsi: "Laporan aktivitas dan hasil perbaikan berkelanjutan SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Semester",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan Laporan Perbaikan Berkelanjutan SMAP:
1. Ringkasan eksekutif
2. Periode pelaporan
3. Inisiatif perbaikan yang dilaksanakan
4. Status implementasi
5. Hasil yang dicapai
6. Lessons learned
7. Inisiatif dalam pipeline
8. Rencana periode berikutnya
9. Kesimpulan dan rekomendasi`,
  },
  {
    id: "T194",
    kode: "REG-LSL-001",
    nama: "Register Lessons Learned",
    namaEn: "Lessons Learned Register",
    kategori: "Register",
    klausul: "10.2",
    deskripsi: "Daftar pembelajaran dari insiden dan pengalaman SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Berkelanjutan",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Register Lessons Learned SMAP:
Kolom: No | Tanggal | Sumber | Kejadian/Situasi | Pembelajaran | Tindakan yang Diambil | Disseminasi | PIC`,
  },
  {
    id: "T195",
    kode: "PRO-PBK-001",
    nama: "Program Perbaikan Berkelanjutan Tahunan",
    namaEn: "Annual Continual Improvement Program",
    kategori: "Program",
    klausul: "10.2",
    deskripsi: "Program perbaikan berkelanjutan SMAP tahunan",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Program Perbaikan Berkelanjutan Tahunan:
1. Tema/fokus perbaikan tahun ini
2. Inisiatif prioritas:
   - Dari hasil RTM
   - Dari temuan audit
   - Dari analisis kinerja
3. Timeline implementasi
4. Resource allocation
5. Target dan indikator
6. Monitoring dan review
7. Pelaporan progress`,
  },
  {
    id: "T196",
    kode: "CHK-TKS-001",
    nama: "Checklist Verifikasi Tindakan Korektif",
    namaEn: "Corrective Action Verification Checklist",
    kategori: "Checklist",
    klausul: "10.1",
    deskripsi: "Checklist untuk memverifikasi efektivitas tindakan korektif",
    penanggungJawab: "FKAP",
    frekuensi: "Per NCR",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Checklist Verifikasi Tindakan Korektif:
- Tindakan korektif dilaksanakan sesuai rencana
- Root cause addressed
- Bukti implementasi ada
- Tidak ada recurrence
- Dampak samping teridentifikasi
- Dokumentasi lengkap
- Approval untuk close`,
  },
  {
    id: "T197",
    kode: "FOR-LSL-001",
    nama: "Formulir Dokumentasi Lessons Learned",
    namaEn: "Lessons Learned Documentation Form",
    kategori: "Formulir",
    klausul: "10.2",
    deskripsi: "Formulir untuk mendokumentasikan lessons learned",
    penanggungJawab: "Unit Kerja",
    frekuensi: "Per Kejadian",
    tingkatKritis: "Pendukung",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Formulir Dokumentasi Lessons Learned:
- Tanggal
- Pengisi
- Kejadian/situasi yang menjadi pembelajaran
- Apa yang berjalan baik
- Apa yang bisa diperbaiki
- Pembelajaran utama
- Rekomendasi untuk masa depan
- Disseminasi kepada (siapa/bagaimana)`,
  },
  {
    id: "T198",
    kode: "MAT-PBK-001",
    nama: "Matriks Prioritisasi Perbaikan",
    namaEn: "Improvement Prioritization Matrix",
    kategori: "Matriks",
    klausul: "10.2",
    deskripsi: "Matriks untuk memprioritaskan inisiatif perbaikan",
    penanggungJawab: "FKAP",
    frekuensi: "Per Review",
    tingkatKritis: "Pendukung",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Matriks Prioritisasi Perbaikan:
Sumbu X: Effort (Low, Medium, High)
Sumbu Y: Impact (Low, Medium, High)
Kuadran:
- High Impact + Low Effort: Quick Wins (prioritas 1)
- High Impact + High Effort: Major Projects (prioritas 2)
- Low Impact + Low Effort: Fill-ins (prioritas 3)
- Low Impact + High Effort: Consider dropping`,
  },
  {
    id: "T199",
    kode: "LAP-TKS-001",
    nama: "Laporan Statistik Ketidaksesuaian",
    namaEn: "Nonconformity Statistics Report",
    kategori: "Laporan",
    klausul: "10.1",
    deskripsi: "Laporan statistik dan analisis ketidaksesuaian SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Semester",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Laporan Statistik Ketidaksesuaian SMAP:
1. Periode pelaporan
2. Jumlah NCR:
   - Per sumber
   - Per klausul
   - Per unit kerja
   - Per klasifikasi
3. Trend (vs periode lalu)
4. Status penyelesaian
5. Aging analysis
6. Recurring issues
7. Analisis root cause
8. Rekomendasi`,
  },
  {
    id: "T200",
    kode: "DOK-PBK-001",
    nama: "Manual Perbaikan Berkelanjutan SMAP",
    namaEn: "ABMS Continual Improvement Manual",
    kategori: "Pedoman",
    klausul: "10.2",
    deskripsi: "Panduan komprehensif tentang perbaikan berkelanjutan SMAP",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Manual Perbaikan Berkelanjutan SMAP:
1. Pendahuluan dan filosofi CI
2. PDCA dalam SMAP
3. Sumber input perbaikan
4. Metodologi:
   - Kaizen
   - Six Sigma DMAIC
   - Lean
5. Tools dan teknik
6. Roles dan responsibilities
7. Metrics dan measurement
8. Reporting dan review
9. Recognition dan rewards
10. Case studies`,
  },

  // ============================================
  // PRODUK SIAP SMAP - ADDITIONAL TEMPLATES
  // ============================================

  // SIAP DOKUMEN SMAP - Klausul 4 (Konteks Organisasi)
  {
    id: "PED-SMAP-001",
    kode: "PED-SMAP-001",
    nama: "Pedoman SMAP (Manual SMAP)",
    namaEn: "ABMS Manual",
    kategori: "Pedoman",
    klausul: "4",
    deskripsi: "Dokumen induk sistem manajemen anti penyuapan yang mencakup kebijakan, ruang lingkup, dan kerangka kerja SMAP organisasi.",
    penanggungJawab: "FKAP",
    frekuensi: "Review tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan Pedoman SMAP untuk [NAMA PERUSAHAAN] yang mencakup:
1. Pendahuluan dan tujuan SMAP
2. Ruang lingkup penerapan
3. Referensi normatif (SNI ISO 37001:2016)
4. Istilah dan definisi
5. Konteks organisasi
6. Kepemimpinan dan komitmen
7. Kebijakan anti penyuapan
8. Perencanaan risiko
9. Struktur dokumentasi SMAP`,
  },
  {
    id: "FOR-KON-001",
    kode: "FOR-KON-001",
    nama: "Formulir Analisis Konteks Organisasi",
    namaEn: "Organization Context Analysis Form",
    kategori: "Formulir",
    klausul: "4.1",
    deskripsi: "Formulir untuk mendokumentasikan analisis isu internal dan eksternal yang mempengaruhi SMAP.",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan Formulir Analisis Konteks Organisasi dengan kolom:
1. Isu Internal (struktur, budaya, tata kelola, kinerja)
2. Isu Eksternal (regulasi, ekonomi, sosial, teknologi)
3. Dampak terhadap SMAP
4. Tindakan yang diperlukan
5. Tanggal analisis dan verifikasi`,
  },
  {
    id: "FOR-KON-002",
    kode: "FOR-KON-002",
    nama: "Formulir Identifikasi Pemangku Kepentingan",
    namaEn: "Stakeholder Identification Form",
    kategori: "Formulir",
    klausul: "4.2",
    deskripsi: "Formulir untuk mengidentifikasi pemangku kepentingan dan kebutuhan mereka terkait SMAP.",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Manajemen", "Pelanggan", "Vendor"],
    promptTemplate: `Buatkan Formulir Identifikasi Pemangku Kepentingan dengan kolom:
1. Nama pemangku kepentingan
2. Kategori (internal/eksternal)
3. Kebutuhan dan harapan terkait anti penyuapan
4. Prioritas kepentingan
5. Cara komunikasi`,
  },
  {
    id: "REG-STA-001",
    kode: "REG-STA-001",
    nama: "Register Pemangku Kepentingan",
    namaEn: "Stakeholder Register",
    kategori: "Register",
    klausul: "4.2",
    deskripsi: "Daftar pemangku kepentingan yang relevan dengan SMAP dan persyaratan mereka.",
    penanggungJawab: "FKAP",
    frekuensi: "Update berkala",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan Register Pemangku Kepentingan dengan kolom:
1. No.
2. Nama stakeholder
3. Kategori
4. Persyaratan/harapan
5. Tingkat pengaruh
6. Metode engagement
7. Status`,
  },
  {
    id: "MAT-RIS-001",
    kode: "MAT-RIS-001",
    nama: "Matriks Penilaian Risiko Penyuapan",
    namaEn: "Bribery Risk Assessment Matrix",
    kategori: "Matriks",
    klausul: "4.5",
    deskripsi: "Matriks untuk menilai dan memprioritaskan risiko penyuapan berdasarkan kemungkinan dan dampak.",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Audit", "Manajemen"],
    promptTemplate: `Buatkan Matriks Penilaian Risiko Penyuapan dengan:
1. Skala likelihood (1-5)
2. Skala impact (1-5)
3. Risk rating matrix
4. Kategori risiko (rendah, sedang, tinggi, sangat tinggi)
5. Panduan pengendalian per level risiko`,
  },

  // SIAP DOKUMEN SMAP - Klausul 5 (Kepemimpinan)
  {
    id: "KEP-APB-001",
    kode: "KEP-APB-001",
    nama: "Kebijakan Anti Penyuapan",
    namaEn: "Anti-Bribery Policy",
    kategori: "Kebijakan",
    klausul: "5.2",
    deskripsi: "Kebijakan zero tolerance terhadap penyuapan yang ditetapkan oleh manajemen puncak.",
    penanggungJawab: "Direktur Utama",
    frekuensi: "Review tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan Kebijakan Anti Penyuapan untuk [NAMA PERUSAHAAN]:
1. Pernyataan komitmen zero tolerance
2. Tujuan kebijakan
3. Ruang lingkup penerapan
4. Larangan-larangan spesifik
5. Konsekuensi pelanggaran
6. Mekanisme pelaporan
7. Perlindungan pelapor
8. Tandatangan Direktur Utama`,
  },
  {
    id: "SK-KOM-001",
    kode: "SK-KOM-001",
    nama: "SK Komitmen Manajemen Puncak",
    namaEn: "Top Management Commitment Decree",
    kategori: "SK",
    klausul: "5.1",
    deskripsi: "Surat Keputusan yang menyatakan komitmen manajemen puncak terhadap implementasi SMAP.",
    penanggungJawab: "Direktur Utama",
    frekuensi: "Sekali/update",
    tingkatKritis: "Wajib",
    areaBisnis: ["Manajemen"],
    promptTemplate: `Buatkan SK Komitmen Manajemen Puncak dengan format:
1. Kop surat perusahaan
2. Nomor SK
3. Menimbang (dasar hukum)
4. Mengingat (referensi)
5. Memutuskan - pernyataan komitmen
6. Tandatangan Direktur`,
  },
  {
    id: "SK-FKP-001",
    kode: "SK-FKP-001",
    nama: "SK Penetapan Tim FKAP",
    namaEn: "ABMS Compliance Function Appointment Decree",
    kategori: "SK",
    klausul: "5.3.2",
    deskripsi: "Surat Keputusan penetapan Fungsi Kepatuhan Anti Penyuapan (FKAP).",
    penanggungJawab: "Direktur Utama",
    frekuensi: "Sekali/update",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan SK Penetapan Tim FKAP dengan:
1. Nomor SK
2. Dasar hukum penetapan
3. Susunan Tim FKAP
4. Tugas dan tanggung jawab
5. Wewenang
6. Masa berlaku`,
  },
  {
    id: "SK-AUD-001",
    kode: "SK-AUD-001",
    nama: "SK Penetapan Tim Audit Internal SMAP",
    namaEn: "Internal Audit Team Appointment Decree",
    kategori: "SK",
    klausul: "9.2",
    deskripsi: "Surat Keputusan penetapan tim auditor internal untuk audit SMAP.",
    penanggungJawab: "Direktur Utama",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Audit", "Manajemen"],
    promptTemplate: `Buatkan SK Penetapan Tim Audit Internal SMAP:
1. Nomor SK
2. Susunan tim auditor
3. Kualifikasi auditor
4. Independensi
5. Tugas dan wewenang
6. Jadwal audit`,
  },
  {
    id: "KEP-HAD-001",
    kode: "KEP-HAD-001",
    nama: "Kebijakan Hadiah dan Keramahtamahan",
    namaEn: "Gifts and Hospitality Policy",
    kategori: "Kebijakan",
    klausul: "8.7",
    deskripsi: "Kebijakan tentang penerimaan dan pemberian hadiah, hiburan, dan keramahtamahan.",
    penanggungJawab: "FKAP",
    frekuensi: "Review tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "SDM", "Operasional"],
    promptTemplate: `Buatkan Kebijakan Hadiah dan Keramahtamahan:
1. Definisi hadiah dan keramahtamahan
2. Batasan nilai yang diperbolehkan
3. Hadiah yang dilarang
4. Prosedur persetujuan
5. Kewajiban pelaporan
6. Penanganan hadiah tidak pantas`,
  },
  {
    id: "KEP-DON-001",
    kode: "KEP-DON-001",
    nama: "Kebijakan Donasi dan Sponsorship",
    namaEn: "Donations and Sponsorship Policy",
    kategori: "Kebijakan",
    klausul: "8.7",
    deskripsi: "Kebijakan tentang pemberian donasi, sumbangan, dan sponsorship.",
    penanggungJawab: "FKAP",
    frekuensi: "Review tahunan",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan", "Keuangan"],
    promptTemplate: `Buatkan Kebijakan Donasi dan Sponsorship:
1. Tujuan kebijakan
2. Jenis donasi yang diperbolehkan
3. Prosedur persetujuan
4. Batas nilai
5. Larangan donasi ke pejabat
6. Dokumentasi dan pelaporan`,
  },
  {
    id: "KEP-KOI-001",
    kode: "KEP-KOI-001",
    nama: "Kebijakan Konflik Kepentingan",
    namaEn: "Conflict of Interest Policy",
    kategori: "Kebijakan",
    klausul: "5.3",
    deskripsi: "Kebijakan tentang identifikasi dan pengelolaan konflik kepentingan.",
    penanggungJawab: "FKAP",
    frekuensi: "Review tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "SDM", "Manajemen"],
    promptTemplate: `Buatkan Kebijakan Konflik Kepentingan:
1. Definisi konflik kepentingan
2. Jenis-jenis konflik
3. Kewajiban pengungkapan
4. Prosedur pelaporan
5. Pengelolaan konflik
6. Sanksi pelanggaran`,
  },
  {
    id: "MAT-TJW-001",
    kode: "MAT-TJW-001",
    nama: "Matriks Tanggung Jawab SMAP",
    namaEn: "ABMS Responsibility Matrix",
    kategori: "Matriks",
    klausul: "5.3",
    deskripsi: "Matriks RACI yang menjelaskan tanggung jawab setiap pihak dalam implementasi SMAP.",
    penanggungJawab: "FKAP",
    frekuensi: "Review tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan Matriks Tanggung Jawab SMAP (RACI) dengan:
1. Daftar aktivitas SMAP per klausul
2. Peran: Direktur, FKAP, Manajer, Karyawan
3. R = Responsible
4. A = Accountable
5. C = Consulted
6. I = Informed`,
  },
  {
    id: "FOR-DEL-001",
    kode: "FOR-DEL-001",
    nama: "Formulir Pendelegasian Wewenang",
    namaEn: "Authority Delegation Form",
    kategori: "Formulir",
    klausul: "5.3.3",
    deskripsi: "Formulir untuk mendokumentasikan pendelegasian wewenang dalam pengambilan keputusan.",
    penanggungJawab: "Direktur",
    frekuensi: "Sesuai kebutuhan",
    tingkatKritis: "Penting",
    areaBisnis: ["Manajemen"],
    promptTemplate: `Buatkan Formulir Pendelegasian Wewenang:
1. Pemberi delegasi
2. Penerima delegasi
3. Lingkup wewenang
4. Batasan nilai
5. Periode berlaku
6. Persyaratan uji tuntas`,
  },

  // SIAP DOKUMEN SMAP - Klausul 6 (Perencanaan)
  {
    id: "REG-RIS-001",
    kode: "REG-RIS-001",
    nama: "Register Risiko Penyuapan",
    namaEn: "Bribery Risk Register",
    kategori: "Register",
    klausul: "4.5",
    deskripsi: "Register komprehensif risiko penyuapan yang diidentifikasi, dinilai, dan dikelola.",
    penanggungJawab: "FKAP",
    frekuensi: "Update berkala",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Audit", "Manajemen"],
    promptTemplate: `Buatkan Register Risiko Penyuapan dengan kolom:
1. ID Risiko
2. Deskripsi risiko
3. Area/proses bisnis
4. Likelihood (1-5)
5. Impact (1-5)
6. Risk rating
7. Pengendalian existing
8. Residual risk
9. Rencana mitigasi
10. PIC dan timeline`,
  },
  {
    id: "PRO-APB-001",
    kode: "PRO-APB-001",
    nama: "Program Anti Penyuapan Tahunan",
    namaEn: "Annual Anti-Bribery Program",
    kategori: "Program",
    klausul: "6.2",
    deskripsi: "Program kerja tahunan untuk mencapai sasaran anti penyuapan.",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan Program Anti Penyuapan Tahunan:
1. Sasaran SMAP tahun ini
2. Indikator kinerja (KPI)
3. Target pencapaian
4. Aktivitas utama
5. Jadwal pelaksanaan
6. Anggaran
7. Penanggung jawab`,
  },
  {
    id: "FOR-SAS-001",
    kode: "FOR-SAS-001",
    nama: "Formulir Sasaran Anti Penyuapan",
    namaEn: "Anti-Bribery Objectives Form",
    kategori: "Formulir",
    klausul: "6.2",
    deskripsi: "Formulir penetapan sasaran anti penyuapan yang terukur.",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan Formulir Sasaran Anti Penyuapan:
1. Sasaran (SMART)
2. Indikator keberhasilan
3. Target kuantitatif
4. Baseline
5. Metode pengukuran
6. Frekuensi monitoring`,
  },
  {
    id: "MAT-PER-001",
    kode: "MAT-PER-001",
    nama: "Matriks Perencanaan Risiko",
    namaEn: "Risk Planning Matrix",
    kategori: "Matriks",
    klausul: "6.1",
    deskripsi: "Matriks yang menghubungkan risiko dengan rencana penanganan.",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan Matriks Perencanaan Risiko:
1. ID Risiko
2. Strategi penanganan (avoid, mitigate, transfer, accept)
3. Rencana aksi
4. Resources
5. Timeline
6. Success criteria`,
  },

  // SIAP DOKUMEN SMAP - Klausul 7 (Dukungan)
  {
    id: "REG-PEL-001",
    kode: "REG-PEL-001",
    nama: "Register Pelatihan SMAP",
    namaEn: "ABMS Training Register",
    kategori: "Register",
    klausul: "7.3",
    deskripsi: "Register pelatihan dan awareness SMAP untuk seluruh personel.",
    penanggungJawab: "SDM",
    frekuensi: "Update berkala",
    tingkatKritis: "Wajib",
    areaBisnis: ["SDM", "Kepatuhan"],
    promptTemplate: `Buatkan Register Pelatihan SMAP dengan kolom:
1. No.
2. Nama peserta
3. Jabatan
4. Jenis pelatihan
5. Tanggal pelatihan
6. Durasi
7. Materi
8. Trainer
9. Nilai evaluasi
10. Sertifikat`,
  },
  {
    id: "FOR-PEL-001",
    kode: "FOR-PEL-001",
    nama: "Formulir Kebutuhan Pelatihan",
    namaEn: "Training Needs Form",
    kategori: "Formulir",
    klausul: "7.3",
    deskripsi: "Formulir untuk mengidentifikasi kebutuhan pelatihan SMAP.",
    penanggungJawab: "SDM",
    frekuensi: "Tahunan",
    tingkatKritis: "Penting",
    areaBisnis: ["SDM"],
    promptTemplate: `Buatkan Formulir Kebutuhan Pelatihan SMAP:
1. Nama personel
2. Jabatan
3. Risiko penyuapan di posisi tersebut
4. Kompetensi yang dibutuhkan
5. Gap kompetensi
6. Jenis pelatihan yang direkomendasikan`,
  },
  {
    id: "SOP-PEL-001",
    kode: "SOP-PEL-001",
    nama: "SOP Pelatihan dan Awareness SMAP",
    namaEn: "ABMS Training and Awareness SOP",
    kategori: "SOP",
    klausul: "7.3",
    deskripsi: "Prosedur perencanaan, pelaksanaan, dan evaluasi pelatihan SMAP.",
    penanggungJawab: "SDM",
    frekuensi: "Review tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["SDM", "Kepatuhan"],
    promptTemplate: `Buatkan SOP Pelatihan dan Awareness SMAP:
1. Tujuan
2. Ruang lingkup
3. Definisi
4. Prosedur:
   - Identifikasi kebutuhan
   - Perencanaan pelatihan
   - Pelaksanaan
   - Evaluasi efektivitas
5. Dokumentasi`,
  },
  {
    id: "FOR-KES-001",
    kode: "FOR-KES-001",
    nama: "Formulir Pakta Integritas",
    namaEn: "Integrity Pact Form",
    kategori: "Formulir",
    klausul: "7.2.2.3",
    deskripsi: "Formulir pernyataan komitmen anti penyuapan personel.",
    penanggungJawab: "SDM",
    frekuensi: "Saat onboarding",
    tingkatKritis: "Wajib",
    areaBisnis: ["SDM", "Kepatuhan"],
    promptTemplate: `Buatkan Formulir Pakta Integritas:
1. Pernyataan komitmen anti penyuapan
2. Pemahaman kebijakan
3. Kewajiban pelaporan
4. Konsekuensi pelanggaran
5. Tandatangan karyawan
6. Saksi`,
  },
  {
    id: "SOP-KOM-001",
    kode: "SOP-KOM-001",
    nama: "SOP Komunikasi SMAP",
    namaEn: "ABMS Communication SOP",
    kategori: "SOP",
    klausul: "7.4",
    deskripsi: "Prosedur komunikasi internal dan eksternal terkait SMAP.",
    penanggungJawab: "FKAP",
    frekuensi: "Review tahunan",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan", "Pemasaran"],
    promptTemplate: `Buatkan SOP Komunikasi SMAP:
1. Tujuan
2. Jenis komunikasi (internal/eksternal)
3. Konten komunikasi
4. Media komunikasi
5. Frekuensi
6. Penanggung jawab
7. Dokumentasi`,
  },
  {
    id: "FOR-KOM-001",
    kode: "FOR-KOM-001",
    nama: "Formulir Bukti Komunikasi SMAP",
    namaEn: "ABMS Communication Evidence Form",
    kategori: "Formulir",
    klausul: "7.4",
    deskripsi: "Formulir untuk mendokumentasikan bukti komunikasi SMAP.",
    penanggungJawab: "FKAP",
    frekuensi: "Per kegiatan",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Formulir Bukti Komunikasi SMAP:
1. Tanggal komunikasi
2. Jenis komunikasi
3. Media yang digunakan
4. Target audience
5. Materi yang dikomunikasikan
6. Daftar hadir/bukti
7. Feedback`,
  },
  {
    id: "SOP-DOK-001",
    kode: "SOP-DOK-001",
    nama: "SOP Pengendalian Dokumen dan Rekaman",
    namaEn: "Document and Record Control SOP",
    kategori: "SOP",
    klausul: "7.5",
    deskripsi: "Prosedur pengendalian dokumen dan rekaman SMAP.",
    penanggungJawab: "FKAP",
    frekuensi: "Review tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan SOP Pengendalian Dokumen dan Rekaman:
1. Pembuatan dokumen
2. Review dan approval
3. Penerbitan dan distribusi
4. Identifikasi dan kodifikasi
5. Penyimpanan dan pengamanan
6. Revisi dan update
7. Pemusnahan
8. Backup dan recovery`,
  },
  {
    id: "REG-DOK-001",
    kode: "REG-DOK-001",
    nama: "Register Dokumen SMAP",
    namaEn: "ABMS Document Register",
    kategori: "Register",
    klausul: "7.5",
    deskripsi: "Daftar induk dokumen SMAP yang terkendali.",
    penanggungJawab: "FKAP",
    frekuensi: "Update berkala",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Register Dokumen SMAP:
1. No.
2. Kode dokumen
3. Nama dokumen
4. Jenis (Kebijakan/SOP/Formulir/dll)
5. Klausul ISO
6. Revisi
7. Tanggal terbit
8. Penanggung jawab
9. Lokasi penyimpanan`,
  },

  // SIAP AUDIT INTERNAL - Klausul 9.2
  {
    id: "PRO-AUD-001",
    kode: "PRO-AUD-001",
    nama: "Program Audit Internal Tahunan",
    namaEn: "Annual Internal Audit Program",
    kategori: "Program",
    klausul: "9.2",
    deskripsi: "Program audit internal SMAP untuk satu tahun.",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Audit", "Kepatuhan"],
    promptTemplate: `Buatkan Program Audit Internal Tahunan:
1. Sasaran audit
2. Ruang lingkup (klausul yang diaudit)
3. Jadwal audit per departemen
4. Tim auditor
5. Kriteria audit
6. Metode audit`,
  },
  {
    id: "SOP-AUD-001",
    kode: "SOP-AUD-001",
    nama: "SOP Audit Internal SMAP",
    namaEn: "ABMS Internal Audit SOP",
    kategori: "SOP",
    klausul: "9.2",
    deskripsi: "Prosedur pelaksanaan audit internal SMAP.",
    penanggungJawab: "FKAP",
    frekuensi: "Review tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Audit", "Kepatuhan"],
    promptTemplate: `Buatkan SOP Audit Internal SMAP:
1. Perencanaan audit
2. Persiapan (checklist, dokumen)
3. Opening meeting
4. Pelaksanaan audit
5. Pengumpulan bukti
6. Closing meeting
7. Penyusunan laporan
8. Tindak lanjut temuan`,
  },
  {
    id: "FOR-RAU-001",
    kode: "FOR-RAU-001",
    nama: "Formulir Rencana Audit",
    namaEn: "Audit Plan Form",
    kategori: "Formulir",
    klausul: "9.2",
    deskripsi: "Formulir rencana detail untuk setiap audit.",
    penanggungJawab: "Lead Auditor",
    frekuensi: "Per audit",
    tingkatKritis: "Wajib",
    areaBisnis: ["Audit"],
    promptTemplate: `Buatkan Formulir Rencana Audit:
1. Tujuan audit
2. Ruang lingkup
3. Kriteria audit
4. Area yang diaudit
5. Tanggal dan waktu
6. Tim auditor
7. Auditee
8. Jadwal kegiatan`,
  },
  {
    id: "CHK-AUD-001",
    kode: "CHK-AUD-001",
    nama: "Checklist Audit Internal SMAP",
    namaEn: "ABMS Internal Audit Checklist",
    kategori: "Checklist",
    klausul: "9.2",
    deskripsi: "Checklist audit berdasarkan klausul SNI ISO 37001:2016.",
    penanggungJawab: "Auditor",
    frekuensi: "Per audit",
    tingkatKritis: "Wajib",
    areaBisnis: ["Audit", "Kepatuhan"],
    promptTemplate: `Buatkan Checklist Audit Internal SMAP per klausul:
Untuk setiap klausul (4-10):
1. Persyaratan standar
2. Pertanyaan audit
3. Bukti yang dicari
4. Temuan (C/NC/OBS)
5. Catatan auditor`,
  },
  {
    id: "CHK-AUD-002",
    kode: "CHK-AUD-002",
    nama: "Checklist Verifikasi Implementasi",
    namaEn: "Implementation Verification Checklist",
    kategori: "Checklist",
    klausul: "9.2",
    deskripsi: "Checklist untuk memverifikasi implementasi pengendalian anti penyuapan.",
    penanggungJawab: "Auditor",
    frekuensi: "Per audit",
    tingkatKritis: "Penting",
    areaBisnis: ["Audit"],
    promptTemplate: `Buatkan Checklist Verifikasi Implementasi:
1. Pengendalian yang diaudit
2. Metode verifikasi
3. Sampel yang diperiksa
4. Hasil verifikasi
5. Bukti objektif
6. Kesimpulan`,
  },
  {
    id: "LAP-AUD-001",
    kode: "LAP-AUD-001",
    nama: "Laporan Hasil Audit Internal",
    namaEn: "Internal Audit Report",
    kategori: "Laporan",
    klausul: "9.2",
    deskripsi: "Template laporan hasil audit internal SMAP.",
    penanggungJawab: "Lead Auditor",
    frekuensi: "Per audit",
    tingkatKritis: "Wajib",
    areaBisnis: ["Audit", "Kepatuhan"],
    promptTemplate: `Buatkan Template Laporan Hasil Audit Internal:
1. Ringkasan eksekutif
2. Informasi audit (tanggal, tim, ruang lingkup)
3. Metodologi audit
4. Hasil audit per area
5. Daftar temuan (NC mayor, minor, observasi)
6. Kekuatan yang ditemukan
7. Kesimpulan
8. Rekomendasi`,
  },
  {
    id: "REG-TEM-001",
    kode: "REG-TEM-001",
    nama: "Register Temuan Audit",
    namaEn: "Audit Findings Register",
    kategori: "Register",
    klausul: "9.2",
    deskripsi: "Register untuk mencatat dan melacak temuan audit.",
    penanggungJawab: "FKAP",
    frekuensi: "Update berkala",
    tingkatKritis: "Wajib",
    areaBisnis: ["Audit", "Kepatuhan"],
    promptTemplate: `Buatkan Register Temuan Audit:
1. No. Temuan
2. Tanggal audit
3. Area/departemen
4. Klausul terkait
5. Deskripsi temuan
6. Klasifikasi (mayor/minor/obs)
7. Root cause
8. Tindakan korektif
9. PIC
10. Target selesai
11. Status
12. Verifikasi`,
  },
  {
    id: "FOR-TLT-001",
    kode: "FOR-TLT-001",
    nama: "Formulir Tindak Lanjut Temuan",
    namaEn: "Finding Follow-up Form",
    kategori: "Formulir",
    klausul: "9.2",
    deskripsi: "Formulir untuk tindak lanjut dan close-out temuan audit.",
    penanggungJawab: "Auditee",
    frekuensi: "Per temuan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Audit"],
    promptTemplate: `Buatkan Formulir Tindak Lanjut Temuan:
1. No. Temuan
2. Deskripsi temuan
3. Analisis akar masalah
4. Tindakan korektif
5. Target penyelesaian
6. Bukti implementasi
7. Verifikasi auditor
8. Status close-out`,
  },
  {
    id: "MAT-AUD-001",
    kode: "MAT-AUD-001",
    nama: "Matriks Kompetensi Auditor",
    namaEn: "Auditor Competency Matrix",
    kategori: "Matriks",
    klausul: "9.2",
    deskripsi: "Matriks kompetensi dan kualifikasi auditor internal.",
    penanggungJawab: "FKAP",
    frekuensi: "Update berkala",
    tingkatKritis: "Penting",
    areaBisnis: ["Audit", "SDM"],
    promptTemplate: `Buatkan Matriks Kompetensi Auditor:
1. Nama auditor
2. Pendidikan
3. Pelatihan audit
4. Sertifikasi
5. Pengalaman audit
6. Area kompetensi
7. Status (Lead/Member)`,
  },
  {
    id: "IK-AUD-001",
    kode: "IK-AUD-001",
    nama: "Instruksi Kerja Teknik Audit",
    namaEn: "Audit Techniques Work Instruction",
    kategori: "Instruksi Kerja",
    klausul: "9.2",
    deskripsi: "Instruksi kerja tentang teknik-teknik audit yang efektif.",
    penanggungJawab: "FKAP",
    frekuensi: "Review tahunan",
    tingkatKritis: "Pendukung",
    areaBisnis: ["Audit"],
    promptTemplate: `Buatkan Instruksi Kerja Teknik Audit:
1. Teknik wawancara
2. Teknik sampling
3. Verifikasi dokumen
4. Observasi proses
5. Analisis data
6. Penulisan temuan
7. Do's and Don'ts`,
  },
  {
    id: "FOR-KAU-001",
    kode: "FOR-KAU-001",
    nama: "Formulir Kehadiran Audit",
    namaEn: "Audit Attendance Form",
    kategori: "Formulir",
    klausul: "9.2",
    deskripsi: "Formulir kehadiran opening dan closing meeting audit.",
    penanggungJawab: "Lead Auditor",
    frekuensi: "Per audit",
    tingkatKritis: "Pendukung",
    areaBisnis: ["Audit"],
    promptTemplate: `Buatkan Formulir Kehadiran Audit:
1. Jenis meeting (opening/closing)
2. Tanggal dan waktu
3. Tempat
4. Agenda
5. Daftar hadir (nama, jabatan, tanda tangan)
6. Notulen`,
  },
  {
    id: "REG-AUD-001",
    kode: "REG-AUD-001",
    nama: "Register Audit Internal",
    namaEn: "Internal Audit Register",
    kategori: "Register",
    klausul: "9.2",
    deskripsi: "Register seluruh audit internal yang telah dilaksanakan.",
    penanggungJawab: "FKAP",
    frekuensi: "Update berkala",
    tingkatKritis: "Penting",
    areaBisnis: ["Audit"],
    promptTemplate: `Buatkan Register Audit Internal:
1. No. Audit
2. Tanggal pelaksanaan
3. Area yang diaudit
4. Tim auditor
5. Jumlah temuan
6. Status laporan
7. Status tindak lanjut`,
  },

  // SIAP SERTIFIKASI - Klausul 8
  {
    id: "SOP-UTU-001",
    kode: "SOP-UTU-001",
    nama: "SOP Uji Tuntas Mitra Bisnis",
    namaEn: "Business Partner Due Diligence SOP",
    kategori: "SOP",
    klausul: "8.2",
    deskripsi: "Prosedur uji tuntas (due diligence) untuk mitra bisnis.",
    penanggungJawab: "FKAP",
    frekuensi: "Review tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Vendor", "Subkontraktor", "Pengadaan"],
    promptTemplate: `Buatkan SOP Uji Tuntas Mitra Bisnis:
1. Kriteria mitra bisnis yang wajib uji tuntas
2. Level uji tuntas (sederhana, standar, diperluas)
3. Informasi yang dikumpulkan
4. Metode verifikasi
5. Red flags
6. Persetujuan
7. Monitoring berkelanjutan`,
  },
  {
    id: "CHK-UTU-001",
    kode: "CHK-UTU-001",
    nama: "Checklist Uji Tuntas",
    namaEn: "Due Diligence Checklist",
    kategori: "Checklist",
    klausul: "8.2",
    deskripsi: "Checklist untuk pelaksanaan uji tuntas mitra bisnis.",
    penanggungJawab: "FKAP",
    frekuensi: "Per mitra",
    tingkatKritis: "Wajib",
    areaBisnis: ["Vendor", "Subkontraktor"],
    promptTemplate: `Buatkan Checklist Uji Tuntas:
1. Identitas dan legalitas
2. Kepemilikan dan struktur
3. Track record
4. Kebijakan anti penyuapan mitra
5. Reputasi dan media screening
6. Conflict of interest
7. Red flags identification`,
  },
  {
    id: "REG-MBI-001",
    kode: "REG-MBI-001",
    nama: "Register Mitra Bisnis",
    namaEn: "Business Partner Register",
    kategori: "Register",
    klausul: "8.2",
    deskripsi: "Register mitra bisnis beserta status uji tuntasnya.",
    penanggungJawab: "FKAP",
    frekuensi: "Update berkala",
    tingkatKritis: "Wajib",
    areaBisnis: ["Vendor", "Subkontraktor"],
    promptTemplate: `Buatkan Register Mitra Bisnis:
1. No.
2. Nama mitra
3. Jenis mitra
4. Nilai kontrak
5. Tingkat risiko
6. Status uji tuntas
7. Tanggal uji tuntas
8. Tanggal review berikutnya
9. PIC`,
  },
  {
    id: "SOP-HAD-001",
    kode: "SOP-HAD-001",
    nama: "SOP Pengelolaan Hadiah",
    namaEn: "Gift Management SOP",
    kategori: "SOP",
    klausul: "8.7",
    deskripsi: "Prosedur penerimaan, pencatatan, dan penanganan hadiah.",
    penanggungJawab: "FKAP",
    frekuensi: "Review tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "SDM"],
    promptTemplate: `Buatkan SOP Pengelolaan Hadiah:
1. Definisi dan batasan
2. Hadiah yang diperbolehkan
3. Hadiah yang dilarang
4. Prosedur pelaporan
5. Approval threshold
6. Penanganan hadiah tidak pantas
7. Pencatatan di register`,
  },
  {
    id: "REG-HAD-001",
    kode: "REG-HAD-001",
    nama: "Register Hadiah dan Keramahtamahan",
    namaEn: "Gifts and Hospitality Register",
    kategori: "Register",
    klausul: "8.7",
    deskripsi: "Register penerimaan dan pemberian hadiah.",
    penanggungJawab: "FKAP",
    frekuensi: "Update berkala",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Register Hadiah dan Keramahtamahan:
1. Tanggal
2. Penerima/pemberi
3. Pemberi/penerima pihak lain
4. Deskripsi hadiah
5. Perkiraan nilai
6. Alasan
7. Status approval
8. Disposisi`,
  },
  {
    id: "SOP-WBS-001",
    kode: "SOP-WBS-001",
    nama: "SOP Whistleblowing System",
    namaEn: "Whistleblowing System SOP",
    kategori: "SOP",
    klausul: "8.9",
    deskripsi: "Prosedur pelaporan dan penanganan pengaduan pelanggaran.",
    penanggungJawab: "FKAP",
    frekuensi: "Review tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "SDM"],
    promptTemplate: `Buatkan SOP Whistleblowing System:
1. Tujuan WBS
2. Ruang lingkup laporan
3. Saluran pelaporan
4. Kerahasiaan
5. Perlindungan pelapor
6. Proses penanganan
7. Timeline
8. Non-retaliation`,
  },
  {
    id: "REG-WBS-001",
    kode: "REG-WBS-001",
    nama: "Register Pengaduan WBS",
    namaEn: "WBS Complaint Register",
    kategori: "Register",
    klausul: "8.9",
    deskripsi: "Register pengaduan melalui whistleblowing system.",
    penanggungJawab: "FKAP",
    frekuensi: "Update berkala",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Register Pengaduan WBS:
1. No. Pengaduan
2. Tanggal terima
3. Saluran pelaporan
4. Kategori pengaduan
5. Ringkasan laporan
6. Status investigasi
7. Tindak lanjut
8. Tanggal selesai`,
  },
  {
    id: "SOP-INV-001",
    kode: "SOP-INV-001",
    nama: "SOP Investigasi Dugaan Penyuapan",
    namaEn: "Bribery Investigation SOP",
    kategori: "SOP",
    klausul: "8.10",
    deskripsi: "Prosedur investigasi dugaan pelanggaran penyuapan.",
    penanggungJawab: "FKAP",
    frekuensi: "Review tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Legal"],
    promptTemplate: `Buatkan SOP Investigasi Dugaan Penyuapan:
1. Trigger investigasi
2. Tim investigasi
3. Metodologi investigasi
4. Pengumpulan bukti
5. Interview
6. Dokumentasi
7. Pelaporan hasil
8. Sanksi dan tindak lanjut`,
  },
  {
    id: "LAP-INV-001",
    kode: "LAP-INV-001",
    nama: "Laporan Hasil Investigasi",
    namaEn: "Investigation Report",
    kategori: "Laporan",
    klausul: "8.10",
    deskripsi: "Template laporan hasil investigasi dugaan penyuapan.",
    penanggungJawab: "Tim Investigasi",
    frekuensi: "Per kasus",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Legal"],
    promptTemplate: `Buatkan Template Laporan Hasil Investigasi:
1. Ringkasan kasus
2. Latar belakang
3. Tim investigasi
4. Metodologi
5. Kronologi
6. Bukti-bukti
7. Analisis
8. Kesimpulan
9. Rekomendasi sanksi
10. Lesson learned`,
  },

  // SIAP SERTIFIKASI - Klausul 9.3 (Tinjauan Manajemen)
  {
    id: "SOP-RTM-001",
    kode: "SOP-RTM-001",
    nama: "SOP Rapat Tinjauan Manajemen",
    namaEn: "Management Review Meeting SOP",
    kategori: "SOP",
    klausul: "9.3",
    deskripsi: "Prosedur pelaksanaan tinjauan manajemen SMAP.",
    penanggungJawab: "FKAP",
    frekuensi: "Review tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Manajemen", "Kepatuhan"],
    promptTemplate: `Buatkan SOP Rapat Tinjauan Manajemen:
1. Tujuan RTM
2. Frekuensi (minimal tahunan)
3. Peserta
4. Input RTM (sesuai klausul 9.3)
5. Proses pelaksanaan
6. Output dan keputusan
7. Dokumentasi`,
  },
  {
    id: "FOR-RTM-001",
    kode: "FOR-RTM-001",
    nama: "Formulir Agenda RTM",
    namaEn: "Management Review Agenda Form",
    kategori: "Formulir",
    klausul: "9.3",
    deskripsi: "Formulir agenda rapat tinjauan manajemen.",
    penanggungJawab: "FKAP",
    frekuensi: "Per RTM",
    tingkatKritis: "Wajib",
    areaBisnis: ["Manajemen"],
    promptTemplate: `Buatkan Formulir Agenda RTM:
1. Tanggal dan waktu
2. Lokasi
3. Peserta
4. Agenda:
   - Status tindak lanjut RTM sebelumnya
   - Perubahan isu internal/eksternal
   - Kinerja SMAP
   - Hasil audit
   - Tindakan korektif
   - Peluang perbaikan`,
  },
  {
    id: "BA-RTM-001",
    kode: "BA-RTM-001",
    nama: "Berita Acara Tinjauan Manajemen",
    namaEn: "Management Review Minutes",
    kategori: "Berita Acara",
    klausul: "9.3",
    deskripsi: "Berita acara/notulen rapat tinjauan manajemen.",
    penanggungJawab: "FKAP",
    frekuensi: "Per RTM",
    tingkatKritis: "Wajib",
    areaBisnis: ["Manajemen", "Kepatuhan"],
    promptTemplate: `Buatkan Berita Acara Tinjauan Manajemen:
1. Header (tanggal, waktu, tempat)
2. Daftar hadir
3. Agenda yang dibahas
4. Pembahasan per agenda
5. Keputusan dan tindak lanjut
6. Jadwal RTM berikutnya
7. Penutup dan tanda tangan`,
  },
  {
    id: "LAP-RTM-001",
    kode: "LAP-RTM-001",
    nama: "Laporan Tinjauan Manajemen",
    namaEn: "Management Review Report",
    kategori: "Laporan",
    klausul: "9.3",
    deskripsi: "Laporan komprehensif hasil tinjauan manajemen.",
    penanggungJawab: "FKAP",
    frekuensi: "Per RTM",
    tingkatKritis: "Wajib",
    areaBisnis: ["Manajemen", "Kepatuhan"],
    promptTemplate: `Buatkan Laporan Tinjauan Manajemen:
1. Ringkasan eksekutif
2. Status implementasi SMAP
3. Kinerja terhadap sasaran
4. Hasil audit internal
5. Penanganan ketidaksesuaian
6. Umpan balik stakeholder
7. Status risiko penyuapan
8. Keputusan dan arahan
9. Rencana tindak lanjut`,
  },

  // SIAP SERTIFIKASI - Klausul 10 (Perbaikan)
  {
    id: "SOP-TKO-001",
    kode: "SOP-TKO-001",
    nama: "SOP Tindakan Korektif",
    namaEn: "Corrective Action SOP",
    kategori: "SOP",
    klausul: "10.1",
    deskripsi: "Prosedur penanganan ketidaksesuaian dan tindakan korektif.",
    penanggungJawab: "FKAP",
    frekuensi: "Review tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan SOP Tindakan Korektif:
1. Identifikasi ketidaksesuaian
2. Analisis akar masalah (RCA)
3. Penentuan tindakan korektif
4. Implementasi tindakan
5. Verifikasi efektivitas
6. Update dokumentasi
7. Pencegahan berulang`,
  },
  {
    id: "REG-TKO-001",
    kode: "REG-TKO-001",
    nama: "Register Ketidaksesuaian dan Tindakan Korektif",
    namaEn: "Nonconformity and Corrective Action Register",
    kategori: "Register",
    klausul: "10.1",
    deskripsi: "Register untuk mencatat dan melacak ketidaksesuaian.",
    penanggungJawab: "FKAP",
    frekuensi: "Update berkala",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Register Ketidaksesuaian dan Tindakan Korektif:
1. No. NC
2. Tanggal identifikasi
3. Sumber (audit/WBS/monitoring)
4. Deskripsi NC
5. Root cause
6. Tindakan korektif
7. PIC
8. Target selesai
9. Status
10. Verifikasi efektivitas`,
  },
  {
    id: "FOR-TKO-001",
    kode: "FOR-TKO-001",
    nama: "Formulir Tindakan Korektif",
    namaEn: "Corrective Action Form",
    kategori: "Formulir",
    klausul: "10.1",
    deskripsi: "Formulir untuk mendokumentasikan tindakan korektif.",
    penanggungJawab: "PIC Terkait",
    frekuensi: "Per NC",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Formulir Tindakan Korektif:
1. No. NC
2. Deskripsi ketidaksesuaian
3. Analisis akar masalah (5 Why / Fishbone)
4. Tindakan korektif
5. Rencana implementasi
6. Target penyelesaian
7. Bukti pelaksanaan
8. Hasil verifikasi
9. Close-out`,
  },
  {
    id: "LAP-PER-001",
    kode: "LAP-PER-001",
    nama: "Laporan Perbaikan Berkelanjutan",
    namaEn: "Continuous Improvement Report",
    kategori: "Laporan",
    klausul: "10.2",
    deskripsi: "Laporan inisiatif perbaikan berkelanjutan SMAP.",
    penanggungJawab: "FKAP",
    frekuensi: "Periodik",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan Laporan Perbaikan Berkelanjutan:
1. Ringkasan perbaikan periode ini
2. Inisiatif perbaikan yang dilakukan
3. Hasil yang dicapai
4. Lesson learned
5. Best practices
6. Rencana perbaikan berikutnya`,
  },
  {
    id: "CHK-PRA-001",
    kode: "CHK-PRA-001",
    nama: "Checklist Pre-Sertifikasi",
    namaEn: "Pre-Certification Checklist",
    kategori: "Checklist",
    klausul: "9",
    deskripsi: "Checklist kesiapan sebelum audit sertifikasi.",
    penanggungJawab: "FKAP",
    frekuensi: "Sebelum sertifikasi",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Audit"],
    promptTemplate: `Buatkan Checklist Pre-Sertifikasi:
1. Kelengkapan dokumentasi
2. Status temuan audit internal
3. Rekaman implementasi
4. Bukti pelatihan
5. Tinjauan manajemen
6. Kesiapan personel
7. Logistik audit`,
  },
  {
    id: "MAT-KES-001",
    kode: "MAT-KES-001",
    nama: "Matriks Kesiapan Sertifikasi",
    namaEn: "Certification Readiness Matrix",
    kategori: "Matriks",
    klausul: "9",
    deskripsi: "Matriks untuk menilai kesiapan per klausul ISO 37001.",
    penanggungJawab: "FKAP",
    frekuensi: "Sebelum sertifikasi",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Matriks Kesiapan Sertifikasi:
1. Klausul ISO 37001
2. Persyaratan
3. Status implementasi (%)
4. Dokumen pendukung
5. Gap
6. Action plan`,
  },
  {
    id: "LAP-KES-001",
    kode: "LAP-KES-001",
    nama: "Laporan Kesiapan Sertifikasi",
    namaEn: "Certification Readiness Report",
    kategori: "Laporan",
    klausul: "9",
    deskripsi: "Laporan evaluasi kesiapan organisasi untuk sertifikasi.",
    penanggungJawab: "FKAP",
    frekuensi: "Sebelum sertifikasi",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan Laporan Kesiapan Sertifikasi:
1. Ringkasan kesiapan
2. Status per klausul
3. Temuan audit internal yang outstanding
4. Strength dan opportunity
5. Risk areas
6. Rekomendasi
7. Go/No-Go decision`,
  },

  // SIAP SURVEILANCE - Klausul 9.1
  {
    id: "SOP-PMT-001",
    kode: "SOP-PMT-001",
    nama: "SOP Pemantauan dan Pengukuran SMAP",
    namaEn: "ABMS Monitoring and Measurement SOP",
    kategori: "SOP",
    klausul: "9.1",
    deskripsi: "Prosedur pemantauan dan pengukuran kinerja SMAP.",
    penanggungJawab: "FKAP",
    frekuensi: "Review tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan SOP Pemantauan dan Pengukuran SMAP:
1. Apa yang dipantau
2. Metode pemantauan
3. Frekuensi
4. Penanggung jawab
5. Analisis data
6. Pelaporan
7. Tindak lanjut`,
  },
  {
    id: "FOR-PMT-001",
    kode: "FOR-PMT-001",
    nama: "Formulir Pemantauan Kinerja SMAP",
    namaEn: "ABMS Performance Monitoring Form",
    kategori: "Formulir",
    klausul: "9.1",
    deskripsi: "Formulir untuk mencatat hasil pemantauan kinerja SMAP.",
    penanggungJawab: "FKAP",
    frekuensi: "Bulanan/Triwulan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Formulir Pemantauan Kinerja SMAP:
1. Periode pemantauan
2. Indikator yang dipantau
3. Target
4. Realisasi
5. Variance
6. Analisis
7. Tindak lanjut`,
  },
  {
    id: "REG-KPI-001",
    kode: "REG-KPI-001",
    nama: "Register KPI SMAP",
    namaEn: "ABMS KPI Register",
    kategori: "Register",
    klausul: "9.1",
    deskripsi: "Register indikator kinerja utama SMAP.",
    penanggungJawab: "FKAP",
    frekuensi: "Update berkala",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan Register KPI SMAP:
1. No.
2. Nama KPI
3. Definisi
4. Formula perhitungan
5. Target
6. Frekuensi pengukuran
7. Sumber data
8. PIC`,
  },
  {
    id: "LAP-KIN-001",
    kode: "LAP-KIN-001",
    nama: "Laporan Kinerja SMAP",
    namaEn: "ABMS Performance Report",
    kategori: "Laporan",
    klausul: "9.1",
    deskripsi: "Laporan kinerja implementasi SMAP secara periodik.",
    penanggungJawab: "FKAP",
    frekuensi: "Triwulan/Semester",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan Laporan Kinerja SMAP:
1. Ringkasan eksekutif
2. Pencapaian KPI
3. Grafik trend
4. Analisis variance
5. Isu dan tantangan
6. Tindakan perbaikan
7. Rencana periode berikutnya`,
  },
  {
    id: "MAT-KPI-001",
    kode: "MAT-KPI-001",
    nama: "Matriks Pengukuran Kinerja SMAP",
    namaEn: "ABMS Performance Measurement Matrix",
    kategori: "Matriks",
    klausul: "9.1",
    deskripsi: "Matriks pengukuran kinerja SMAP per aspek.",
    penanggungJawab: "FKAP",
    frekuensi: "Periodik",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Matriks Pengukuran Kinerja SMAP:
1. Aspek yang diukur
2. Indikator
3. Bobot
4. Target
5. Realisasi
6. Skor
7. Status (merah/kuning/hijau)`,
  },

  // SIAP SURVEILANCE - Klausul 10 (Perbaikan Berkelanjutan)
  {
    id: "SOP-PBB-001",
    kode: "SOP-PBB-001",
    nama: "SOP Perbaikan Berkelanjutan",
    namaEn: "Continuous Improvement SOP",
    kategori: "SOP",
    klausul: "10.2",
    deskripsi: "Prosedur untuk perbaikan berkelanjutan SMAP.",
    penanggungJawab: "FKAP",
    frekuensi: "Review tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan SOP Perbaikan Berkelanjutan:
1. Sumber input perbaikan
2. Identifikasi peluang
3. Prioritasi
4. Implementasi perbaikan
5. Evaluasi hasil
6. Dokumentasi lesson learned
7. Knowledge sharing`,
  },
  {
    id: "FOR-PBB-001",
    kode: "FOR-PBB-001",
    nama: "Formulir Usulan Perbaikan",
    namaEn: "Improvement Proposal Form",
    kategori: "Formulir",
    klausul: "10.2",
    deskripsi: "Formulir untuk mengajukan usulan perbaikan SMAP.",
    penanggungJawab: "Semua Personel",
    frekuensi: "Sesuai kebutuhan",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Formulir Usulan Perbaikan:
1. Nama pengusul
2. Tanggal
3. Area yang diperbaiki
4. Kondisi saat ini
5. Kondisi yang diharapkan
6. Usulan perbaikan
7. Estimasi dampak
8. Persetujuan`,
  },
  {
    id: "REG-PBB-001",
    kode: "REG-PBB-001",
    nama: "Register Perbaikan Berkelanjutan",
    namaEn: "Continuous Improvement Register",
    kategori: "Register",
    klausul: "10.2",
    deskripsi: "Register inisiatif perbaikan berkelanjutan.",
    penanggungJawab: "FKAP",
    frekuensi: "Update berkala",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Register Perbaikan Berkelanjutan:
1. No.
2. Tanggal usulan
3. Pengusul
4. Deskripsi perbaikan
5. Area dampak
6. Status
7. Hasil implementasi`,
  },
  {
    id: "LAP-PBB-001",
    kode: "LAP-PBB-001",
    nama: "Laporan Inisiatif Perbaikan",
    namaEn: "Improvement Initiative Report",
    kategori: "Laporan",
    klausul: "10.2",
    deskripsi: "Laporan inisiatif dan hasil perbaikan berkelanjutan.",
    penanggungJawab: "FKAP",
    frekuensi: "Semester/Tahunan",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan Laporan Inisiatif Perbaikan:
1. Ringkasan inisiatif periode ini
2. Daftar perbaikan yang diimplementasikan
3. Dampak yang dicapai
4. Best practices
5. Lesson learned
6. Rencana ke depan`,
  },

  // SIAP SURVEILANCE - Dokumen Surveilance
  {
    id: "CHK-SUR-001",
    kode: "CHK-SUR-001",
    nama: "Checklist Kesiapan Surveilance",
    namaEn: "Surveillance Readiness Checklist",
    kategori: "Checklist",
    klausul: "9",
    deskripsi: "Checklist kesiapan menghadapi audit surveilance.",
    penanggungJawab: "FKAP",
    frekuensi: "Sebelum surveilance",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Audit"],
    promptTemplate: `Buatkan Checklist Kesiapan Surveilance:
1. Status temuan audit sebelumnya
2. Bukti tindakan korektif
3. Rekaman tinjauan manajemen
4. Bukti audit internal terakhir
5. Update register risiko
6. Bukti pelatihan/awareness
7. Rekaman kinerja SMAP`,
  },
  {
    id: "FOR-SUR-001",
    kode: "FOR-SUR-001",
    nama: "Formulir Persiapan Surveilance",
    namaEn: "Surveillance Preparation Form",
    kategori: "Formulir",
    klausul: "9",
    deskripsi: "Formulir checklist persiapan audit surveilance.",
    penanggungJawab: "FKAP",
    frekuensi: "Per surveilance",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Formulir Persiapan Surveilance:
1. Jadwal surveilance
2. Ruang lingkup yang akan diaudit
3. Dokumen yang disiapkan
4. Personel yang disiapkan
5. Status kesiapan per area
6. Action items`,
  },
  {
    id: "LAP-SUR-001",
    kode: "LAP-SUR-001",
    nama: "Laporan Tindak Lanjut Surveilance",
    namaEn: "Surveillance Follow-up Report",
    kategori: "Laporan",
    klausul: "9",
    deskripsi: "Laporan tindak lanjut hasil audit surveilance.",
    penanggungJawab: "FKAP",
    frekuensi: "Pasca surveilance",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan Laporan Tindak Lanjut Surveilance:
1. Ringkasan hasil surveilance
2. Temuan yang diperoleh
3. Analisis root cause
4. Rencana tindakan korektif
5. Timeline implementasi
6. Status progress`,
  },
  {
    id: "PRO-SUR-001",
    kode: "PRO-SUR-001",
    nama: "Program Persiapan Surveilance",
    namaEn: "Surveillance Preparation Program",
    kategori: "Program",
    klausul: "9",
    deskripsi: "Program kerja persiapan audit surveilance tahunan.",
    penanggungJawab: "FKAP",
    frekuensi: "Tahunan",
    tingkatKritis: "Penting",
    areaBisnis: ["Kepatuhan"],
    promptTemplate: `Buatkan Program Persiapan Surveilance:
1. Timeline persiapan
2. Aktivitas persiapan
3. PIC per aktivitas
4. Resources yang dibutuhkan
5. Milestone
6. Kriteria keberhasilan`,
  },

  // SIAP SURVEILANCE - Dokumen Re-Sertifikasi
  {
    id: "CHK-RST-001",
    kode: "CHK-RST-001",
    nama: "Checklist Kesiapan Re-Sertifikasi",
    namaEn: "Re-Certification Readiness Checklist",
    kategori: "Checklist",
    klausul: "9",
    deskripsi: "Checklist kesiapan menghadapi audit re-sertifikasi.",
    penanggungJawab: "FKAP",
    frekuensi: "Sebelum re-sertifikasi",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Audit"],
    promptTemplate: `Buatkan Checklist Kesiapan Re-Sertifikasi:
1. Review seluruh dokumentasi SMAP
2. Status implementasi 3 tahun terakhir
3. Rekaman audit internal dan surveilance
4. Bukti perbaikan berkelanjutan
5. Perubahan signifikan organisasi
6. Update ruang lingkup jika ada`,
  },
  {
    id: "FOR-RST-001",
    kode: "FOR-RST-001",
    nama: "Formulir Evaluasi 3 Tahunan",
    namaEn: "3-Year Evaluation Form",
    kategori: "Formulir",
    klausul: "9",
    deskripsi: "Formulir evaluasi implementasi SMAP selama 3 tahun.",
    penanggungJawab: "FKAP",
    frekuensi: "3 tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan Formulir Evaluasi 3 Tahunan:
1. Pencapaian sasaran SMAP
2. Trend kinerja 3 tahun
3. Summary audit internal
4. Summary temuan surveilance
5. Efektivitas pengendalian
6. Lesson learned
7. Rekomendasi perbaikan`,
  },
  {
    id: "LAP-RST-001",
    kode: "LAP-RST-001",
    nama: "Laporan Kesiapan Re-Sertifikasi",
    namaEn: "Re-Certification Readiness Report",
    kategori: "Laporan",
    klausul: "9",
    deskripsi: "Laporan komprehensif kesiapan re-sertifikasi.",
    penanggungJawab: "FKAP",
    frekuensi: "3 tahunan",
    tingkatKritis: "Wajib",
    areaBisnis: ["Kepatuhan", "Manajemen"],
    promptTemplate: `Buatkan Laporan Kesiapan Re-Sertifikasi:
1. Executive summary
2. Perjalanan implementasi 3 tahun
3. Pencapaian dan milestone
4. Challenges dan solusi
5. Bukti perbaikan berkelanjutan
6. Status kesiapan per klausul
7. Gap analysis
8. Action plan
9. Rekomendasi`,
  },
];

export function getTemplatesByKlausul(klausul: string): SMAPTemplate[] {
  return SMAP_TEMPLATES.filter(t => t.klausul === klausul || t.klausul.startsWith(klausul + ".") || (t.subKlausul && t.subKlausul === klausul));
}

export function getTemplatesByKategori(kategori: string): SMAPTemplate[] {
  return SMAP_TEMPLATES.filter(t => t.kategori === kategori);
}

export function getTemplatesByTingkatKritis(tingkat: "Wajib" | "Penting" | "Pendukung"): SMAPTemplate[] {
  return SMAP_TEMPLATES.filter(t => t.tingkatKritis === tingkat);
}

export function searchTemplates(query: string): SMAPTemplate[] {
  const lowerQuery = query.toLowerCase();
  return SMAP_TEMPLATES.filter(t => 
    t.nama.toLowerCase().includes(lowerQuery) ||
    t.namaEn.toLowerCase().includes(lowerQuery) ||
    t.kode.toLowerCase().includes(lowerQuery) ||
    t.deskripsi.toLowerCase().includes(lowerQuery) ||
    t.klausul.includes(lowerQuery)
  );
}
