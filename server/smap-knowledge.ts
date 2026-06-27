/**
 * SMAP Knowledge Base
 * Derived from consultant-grade reference documents:
 *   SMAP01 — Pedoman SMAP (SNI ISO 37001:2016) full 49-page manual template
 *   SMAP02 — Program Audit Internal SMAP (department-level audit program)
 *   SMAP03 — SOP & Form: Tinjauan Dewan Pengarah + SOP CAPA (Klausul 10.1-10.2)
 *   R1-07  — Tinjauan SMAP Badan Usaha (BUJK/SBU Konstruksi connection)
 *   Modul6 — Penilaian Komitmen SMAP BUJK (Asesor BUJK, FSMAP forms, VACS)
 *   BAB1-5 — Document Generation Matrix (comprehensive, author-synthesized)
 *
 * Used as system prompt knowledge injection for Gustafta Dialog & Collab sub-agents.
 */

// ─── PEDOMAN SMAP — Exact structure from SMAP01 ──────────────────────────────
export const PEDOMAN_SMAP_STRUCTURE = `
STRUKTUR RESMI PEDOMAN SMAP (berdasarkan template konsultan SNI ISO 37001:2016):

BAGIAN AWAL (Halaman 1-6):
• 0.1 Pendahuluan — Latar belakang komitmen anti penyuapan perusahaan
• 0.2 Pengendalian Dokumen — FKAP bertanggung jawab atas: master copy, penerbitan, distribusi, perubahan. Setiap salinan hardcopy diberi cap status pengendalian. Distribusi dicatatkan dalam Daftar Dokumen Internal.
• 0.3 Pengesahan — Ditandatangani Top Manajemen (Direktur Utama/Dewan Direksi)
• 0.4 Informasi Revisi — Daftar perubahan antar versi (Rev.00, Rev.01, dst.)

DAFTAR ISI UTAMA (Klausul sesuai urutan SNI ISO 37001:2016):
1. Ruang Lingkup — Penetapan batas dan aplikabilitas SMAP dalam organisasi
2. Referensi Normatif — SNI ISO 37001:2016 sebagai dokumen acuan utama
3. Istilah dan Definisi — Terminologi kunci SMAP (penyuapan, FKAP, Dewan Pengarah, dll.)
4. Konteks Organisasi
   4.1 Memahami Organisasi dan Konteksnya (isu internal & eksternal)
   4.2 Memahami Kebutuhan dan Harapan Pihak Berkepentingan
   4.3 Menentukan Ruang Lingkup SMAP
   4.4 Sistem Manajemen Anti Penyuapan
   4.5 Penilaian Risiko Penyuapan
5. Kepemimpinan
   5.1 Kepemimpinan dan Komitmen (Top Management + Dewan Pengarah)
   5.2 Kebijakan Anti Penyuapan
   5.3 Peran, Tanggung Jawab dan Wewenang Organisasi
       5.3.1 Tanggung jawab umum
       5.3.2 Fungsi Kepatuhan Anti Penyuapan (FKAP)
       5.3.3 Pendelegasian wewenang saat personil utama tidak bertugas
6. Perencanaan
   6.1 Tindakan untuk Mengatasi Risiko dan Peluang
   6.2 Sasaran Anti Penyuapan dan Perencanaan untuk mencapainya
7. Pendukung
   7.1 Sumber Daya
   7.2 Kompetensi (7.2.1 Umum, 7.2.2 Personil dengan risiko penyuapan spesifik)
   7.3 Kesadaran (Awareness) / Kepedulian dan Pelatihan
   7.4 Komunikasi (internal & eksternal)
   7.5 Informasi Terdokumentasi (7.5.1 Umum, 7.5.2 Membuat & Memperbarui, 7.5.3.1 & 7.5.3.2 Pengendalian)
8. Pengoperasian (Operasional)
   8.1 Perencanaan dan Pengendalian Pengoperasian
   8.2 Uji Kelayakan / Uji Tuntas (Due Diligence) — personil & mitra bisnis
   8.3 Pengendalian Keuangan
   8.4 Pengendalian Non-Finansial
   8.5 Penerapan Pengendalian Anti Penyuapan oleh Organisasi Lain dan Rekan Bisnis
   8.6 Komitmen Anti Penyuapan (pernyataan tertulis dari mitra)
   8.7 Hadiah, Keramah-tamahan (Hospitality), Donasi dan Keuntungan Serupa
   8.8 Mengelola Ketidakcukupan Pengendalian Anti Penyuapan
   8.9 Menyampaikan Kekhawatiran / Perhatian (Raising Concern) — Whistleblowing System (WBS)
   8.10 Investigasi dan Penanganan Penyuapan
9. Evaluasi Kinerja
   9.1 Pemantauan, Pengukuran, Analisis dan Evaluasi
   9.2 Audit Internal
   9.3 Tinjauan Manajemen (Management Review)
   9.4 Tinjauan oleh FKAP
10. Peningkatan
    10.1 Ketidaksesuaian dan Tindakan Korektif
    10.2 Perbaikan Berkelanjutan

LAMPIRAN RESMI (6 lampiran):
• Lampiran 1: Peta Proses Kerja (Business Process Mapping) SMAP
• Lampiran 2: Kebijakan Anti Penyuapan (full text)
• Lampiran 3: Acuan Silang Prosedur vs. ISO 37001:2016 (cross-reference matrix)
• Lampiran 4A: Tabel Komunikasi Internal
• Lampiran 4B: Tabel Komunikasi Eksternal
• Lampiran 5: Tabel Sasaran SMAP dan Pemantauannya
• Lampiran 6: Struktur Organisasi

PRINSIP UTAMA SMAP (dari pendahuluan):
SMAP membantu organisasi mengendalikan praktek penyuapan dengan cara:
• Mencegah (prevention)
• Mendeteksi (detection)
• Melaporkan (reporting)
• Menangani (handling) — bila penyuapan terjadi

FORMAT DOKUMEN: Gunakan kode dokumen M-SMAP.[KODE_PERUSAHAAN].01 | Rev.00
`;

// ─── PROGRAM AUDIT INTERNAL — Department structure from SMAP02 ───────────────
export const AUDIT_PROGRAM_STRUCTURE = `
PROGRAM AUDIT INTERNAL SMAP — Format Resmi (berdasarkan template F-[KODE]-MR-01-01):

KOLOM TABEL WAJIB:
No | Bagian yang Diaudit | Ruang Lingkup Audit (Proses/Perihal) | Pasal ISO 37001:2016 | Risiko (Low/Medium/High) | Status (Mjr/Mnr/Obs/Nilai) | Frekuensi Audit | Jadwal Bulan (1-12)

DEPARTEMEN & RISIKO TIPIKAL:
┌─────────────────────┬──────────────┬───────────────────┐
│ Departemen          │ Level Risiko │ Frekuensi Audit   │
├─────────────────────┼──────────────┼───────────────────┤
│ Marketing / Sales   │ High         │ 2x per tahun      │
│ Purchasing          │ High         │ 2x per tahun      │
│ Operation/Produksi  │ Medium       │ 1x per tahun      │
│ QA/QC               │ Medium       │ 1x per tahun      │
│ Maintenance         │ Medium       │ 1x per tahun      │
│ GA (General Affairs)│ Medium       │ 1x per tahun      │
│ HR                  │ Medium       │ 1x per tahun      │
│ Finance/Accounting  │ High         │ 2x per tahun      │
│ Legal/Compliance    │ Medium       │ 1x per tahun      │
│ Management/Direksi  │ Low-Medium   │ 1x per tahun      │
└─────────────────────┴──────────────┴───────────────────┘

RUANG LINGKUP AUDIT STANDAR (per departemen — sesuai template F-MR-01-01):
Setiap departemen mencakup audit terhadap:
• Konteks Organisasi: isu internal & eksternal, persyaratan pihak berkepentingan (Pasal 4.1; 4.2; 4.4; 4.5)
• Hasil Penilaian Risiko Penyuapan (Pasal 6.1; 9.1)
• Sasaran Anti Penyuapan dan Pemantauannya (Pasal 5.2; 6.2)
• Kebijakan Anti-Penyuapan (Pasal 5.2)
• Pendelegasian Wewenang saat personil utama tidak bertugas (Pasal 5.3.3)
• Uji Kelayakan Personil (Pasal 7.2.2.2)
• Sumber Daya: Pelatihan SMAP yang telah diikuti (Pasal 7.3; 7.4)
• Pengendalian Informasi Terdokumentasi (Pasal 7.5.3.1; 7.5.3.2)
• Uji Kelayakan Rekan Bisnis (Pasal 8.2)
• Pengendalian Non-Keuangan (Pasal 8.4; 8.5)
• Komitmen Anti Penyuapan dari Mitra (Pasal 8.6; 8.8)
• Penundaan Transaksi Rekan Bisnis (Penanganan Ketidakcukupan Pengendalian) (Pasal 8.8)

KHUSUS HR (tambahan di atas standar):
• Penilaian Kompetensi personil terkait SMAP
• Pelaksanaan Pelatihan/Sosialisasi SMAP kepada personil

TEKNIK AUDIT KHUSUS (dari praktik konsultan):
• Review file penggajian (payroll) — identifikasi pengeluaran tidak biasa
• Kajian laporan biaya personil (personnel expense reports)
• Bandingkan info payroll (nomor rekening bank, alamat) dengan info rekening mitra bisnis — identifikasi potensi konflik kepentingan

STATUS TEMUAN:
• Mjr (Major/NCR Mayor): ketidaksesuaian signifikan, bisa gagalkan sertifikasi
• Mnr (Minor/NCR Minor): ketidaksesuaian terbatas
• Obs (Observation): area perhatian, bukan ketidaksesuaian resmi
• Nilai: skor keseluruhan

FORMAT JADWAL: Tandai dengan tanda centang atau 'A' di kolom bulan yang direncanakan
`;

// ─── TINJAUAN DEWAN PENGARAH — Process from SMAP03 (FRM-FKAP-14-01) ─────────
export const MANAGEMENT_REVIEW_STRUCTURE = `
TINJAUAN DEWAN PENGARAH TERHADAP SMAP — Proses Resmi (SOP-XYZ-FKAP-14):

DEFINISI PIHAK:
• Manajemen Puncak: Direktur Utama / Dewan Direksi — level tertinggi yang mengarahkan organisasi
• Dewan Pengarah: Dewan Komisaris — bertanggung jawab & wewenang tertinggi; manajemen puncak melapor kepada Dewan Pengarah

FREKUENSI:
• Minimal 1 (satu) kali setahun
• Dapat dilakukan dalam forum yang SAMA dengan Tinjauan Manajemen Puncak

INPUT TINJAUAN DEWAN PENGARAH:
a) Dari Direksi (Manajemen Puncak): Notulen Tinjauan Manajemen Puncak terhadap SMAP
b) Dari FKAP: Notulen Tinjauan FKAP terhadap SMAP
c) Informasi tambahan yang diminta Dewan: misal Laporan Hasil Audit Internal SMAP

ALUR PROSES (SOP-XYZ-FKAP-14):
1. Ketua FKAP memastikan Dewan Pengarah telah menerima hasil Tinjauan Manajemen Puncak & FKAP
2. Dewan Pengarah melakukan review berdasarkan laporan yang diterima (dapat meminta laporan tambahan)
3. Ketua FKAP memastikan Notulen Tinjauan Dewan Pengarah telah dibuat
4. Ketua FKAP memastikan Notulen terdistribusi ke pihak berkepentingan
5. Ketua FKAP melakukan koordinasi tindak-lanjut bilamana diperlukan
6. Wakil FKAP menyimpan dan memelihara Notulen (arsip)

OUTPUT: Notulen Tinjauan Dewan Pengarah (FRM-FKAP-14-01) — ditandatangani FKAP + Dewan Pengarah

KEPUTUSAN TIPIKAL DEWAN PENGARAH (contoh dari praktik):
• Mendukung/memperkuat implementasi WBS (Whistleblowing System) — termasuk mekanisme pelaporan anonim
• Menekankan pelaporan itikad baik dalam WBS
• Memerintahkan pemeriksaan payroll untuk identifikasi konflik kepentingan
• Menyimpulkan efektivitas PDCA (Plan-Do-Check-Act) SMAP

FORM RESMI: FRM-FKAP-14-01 | Rev.00
SOP TERKAIT: SOP-XYZ-FKAP-14 (Tinjauan Dewan Pengarah)
`;

// ─── SOP CAPA — Non-Conformance & Corrective Action from SMAP03 ──────────────
export const CAPA_SOP_STRUCTURE = `
SOP PENANGANAN KETIDAKSESUAIAN, TINDAKAN KOREKTIF DAN PENINGKATAN SMAP
(SOP-XYZ-FKAP-15 | Referensi: SNI ISO 37001:2016 Pasal 10.1; 10.2)

TUJUAN:
Memastikan perusahaan mengambil langkah-langkah yang diperlukan ketika terjadi ketidaksesuaian penerapan SMAP, termasuk mekanisme tindakan korektif serta peningkatan SMAP.

RUANG LINGKUP — CAPA diterapkan ketika:
a) Terjadi ketidaksesuaian dalam penerapan SMAP:
   - Dari hasil penemuan audit internal
   - Dari informasi lainnya yang diterima atau ditemukan
b) Menindaklanjuti hasil:
   - Notulen Tinjauan Manajemen Puncak
   - Notulen Tinjauan Dewan Pengarah
   - Notulen Tinjauan FKAP
   (semua sebagai bagian dari peningkatan SMAP)

PENANGGUNG JAWAB:
• Pemilik Proses (Process Owner) — departemen yang bersangkutan
• Ketua Fungsi Kepatuhan Anti Penyuapan (FKAP)

PROSES CAPA:
1. Identifikasi ketidaksesuaian (dari audit, tinjauan, atau laporan lain)
2. Analisis akar penyebab (Root Cause Analysis) — gunakan 5-Why atau Fishbone
3. Tetapkan tindakan korektif yang SMART
4. Implementasi tindakan korektif oleh PIC
5. Verifikasi efektivitas tindakan korektif
6. Dokumentasikan dan tutup CAPA jika efektif
7. Laporkan status ke Tinjauan Manajemen berikutnya

BUKTI TINDAK LANJUT dapat berupa:
• Form Tindakan Korektif (PTK — Permintaan Tindakan Korektif)
• Action Plan
• Hasil pemantauan lainnya yang relevan

KODE DOKUMEN TERKAIT:
• SOP-XYZ-FKAP-15 — SOP Penanganan Ketidaksesuaian
• PTK (Permintaan Tindakan Korektif) — form CAPA
`;

// ─── WHISTLEBLOWING SYSTEM — Key requirements from SMAP03 ─────────────────────
export const WBS_KEY_REQUIREMENTS = `
PERSYARATAN WBS (Whistleblowing System) dari praktik konsultan SMAP:

PERSYARATAN UTAMA (dari keputusan Dewan Pengarah):
• WBS HARUS mengijinkan pelaporan TANPA NAMA (anonim) — ini persyaratan SNI ISO 37001:2016
• Harus ditekankan dalam sosialisasi bahwa pelaporan anonim diperbolehkan
• Pelaporan harus dilakukan atas dasar ITIKAD BAIK pelapor
• Perlindungan pelapor (anti-retaliation) adalah wajib

CHANNEL PELAPORAN UMUM:
• Google Form khusus (anonymous-enabled)
• Email rahasia FKAP
• Kotak saran fisik
• Hotline telepon/WhatsApp
• Pertemuan tatap muka dengan FKAP (untuk kasus sensitif)

SOSIALISASI WBS:
• Ditekankan bahwa semua dugaan penyuapan dilaporkan melalui jalur WBS
• Pelaporan anonim aktif dianjurkan, bukan sebagai pilihan terakhir
`;

// ─── GUSTAFTA DIALOG — Enhanced SMAP clause knowledge for Socratic probing ────
export const GUSTAFTA_SMAP_KNOWLEDGE = `
PENGETAHUAN SMAP UNTUK DIALOG SOCRATIC:

KLAUSUL KRITIS YANG PERLU DIGALI:
• Klausul 4.5 — Apakah sudah ada penilaian risiko penyuapan formal? Per departemen?
• Klausul 5.1-5.2 — Seberapa kuat komitmen Direksi? Sudah ada kebijakan tertulis?
• Klausul 5.3.2 — Sudah ada FKAP (Fungsi Kepatuhan Anti Penyuapan)? Siapa ketuanya?
• Klausul 7.3 — Sudah ada pelatihan anti penyuapan untuk karyawan?
• Klausul 8.2 — Bagaimana proses seleksi vendor/mitra? Sudah ada uji kelayakan?
• Klausul 8.9 — Apakah ada WBS (Whistleblowing System)? Anonymous atau tidak?
• Klausul 9.2 — Sudah pernah ada audit internal SMAP?
• Klausul 9.3 — Dewan Komisaris (Dewan Pengarah) terlibat tinjauan SMAP?

DEPARTEMEN RISIKO TINGGI (perlu digali lebih dalam):
• Marketing/Sales — interaksi dengan klien pemerintah, pemberian hadiah/hospitality
• Purchasing/Pengadaan — seleksi vendor, negosiasi harga, proses tender
• Finance — pengendalian keuangan, otorisasi pembayaran
• Legal/Izin — pengurusan perizinan ke instansi pemerintah

FAKTOR RISIKO YANG MENENTUKAN SKOR:
• Interaksi dengan pejabat pemerintah → risiko TINGGI
• Proyek tender/lelang pemerintah → risiko TINGGI
• Pengurusan izin/regulasi → risiko TINGGI
• Industri: konstruksi, energi, migas, farmasi → risiko TINGGI
• Belum ada kebijakan anti penyuapan tertulis → gap KRITIS
• Belum ada FKAP → gap KRITIS
• Tidak ada WBS → gap TINGGI

STRUKTUR DEWAN DAN KONSEKUENSINYA:
• PT dengan Dewan Komisaris: Dewan Komisaris = Dewan Pengarah (klausul 9.3.2)
• PT tanpa Dewan Komisaris: Direksi merangkap fungsi Dewan Pengarah
• Yayasan/Koperasi: Dewan Pengawas/Pengurus = Dewan Pengarah
→ Ini mempengaruhi siapa yang meninjau dan mengesahkan SMAP
`;

// ─── BLUEPRINT DOCUMENT NAMES — Realistic Indonesian SMAP document names ──────
export const SMAP_DOCUMENT_CATALOG = {
  pedoman: [
    { nama: "Pedoman SMAP (Manual ABMS)", klausul: "Klausul 4-10", kode: "M-SMAP-01" },
    { nama: "Peta Proses Kerja (Business Process Mapping) SMAP", klausul: "Klausul 4.4", kode: "Lampiran Pedoman" },
  ],
  kebijakan: [
    { nama: "Kebijakan Anti Penyuapan", klausul: "Klausul 5.2", kode: "KBJ-SMAP-01" },
    { nama: "SK Penetapan Tim FKAP", klausul: "Klausul 5.3.2", kode: "SK-FKAP-01" },
    { nama: "Tabel Sasaran SMAP dan Pemantauannya", klausul: "Klausul 6.2", kode: "Lampiran 5 Pedoman" },
  ],
  operasional: [
    { nama: "Register Risiko Penyuapan", klausul: "Klausul 4.5; 6.1", kode: "FRM-FKAP-01" },
    { nama: "Prosedur Uji Tuntas Personil", klausul: "Klausul 8.2", kode: "SOP-FKAP-01" },
    { nama: "Prosedur Uji Tuntas Mitra Bisnis", klausul: "Klausul 8.2", kode: "SOP-FKAP-02" },
    { nama: "Formulir Penilaian Mitra Bisnis (Due Diligence Questionnaire)", klausul: "Klausul 8.2", kode: "FRM-FKAP-02" },
    { nama: "Prosedur Pengendalian Keuangan", klausul: "Klausul 8.3", kode: "SOP-FKAP-03" },
    { nama: "Prosedur Hadiah, Hospitality dan Donasi", klausul: "Klausul 8.7", kode: "SOP-FKAP-04" },
    { nama: "SOP Whistleblowing System (Raising Concern)", klausul: "Klausul 8.9", kode: "SOP-FKAP-05" },
    { nama: "Formulir Laporan Pelanggaran (Form WBS)", klausul: "Klausul 8.9", kode: "FRM-FKAP-03" },
    { nama: "Komitmen Anti Penyuapan (untuk Mitra)", klausul: "Klausul 8.6", kode: "FRM-FKAP-04" },
  ],
  audit: [
    { nama: "Program Audit Internal SMAP Tahunan", klausul: "Klausul 9.2", kode: "F-MR-01-01" },
    { nama: "Checklist Audit Internal per Klausul", klausul: "Klausul 9.2", kode: "FRM-AI-01" },
    { nama: "Laporan Hasil Audit Internal SMAP", klausul: "Klausul 9.2", kode: "FRM-AI-02" },
    { nama: "Formulir NCR (Non-Conformance Report)", klausul: "Klausul 9.2; 10.1", kode: "FRM-AI-03" },
    { nama: "Log CAPA (Corrective Action & Preventive Action)", klausul: "Klausul 10.1", kode: "SOP-FKAP-15" },
  ],
  tinjauan: [
    { nama: "Notulen Tinjauan Manajemen Puncak terhadap SMAP", klausul: "Klausul 9.3", kode: "FRM-FKAP-13" },
    { nama: "Notulen Tinjauan FKAP terhadap SMAP", klausul: "Klausul 9.4", kode: "FRM-FKAP-11" },
    { nama: "Notulen Tinjauan Dewan Pengarah terhadap SMAP", klausul: "Klausul 9.3.2", kode: "FRM-FKAP-14-01" },
    { nama: "Laporan Kinerja SMAP Tahunan", klausul: "Klausul 9.1; 9.3", kode: "RPT-SMAP-01" },
  ],
  pelatihan: [
    { nama: "Program Pelatihan & Awareness SMAP Tahunan", klausul: "Klausul 7.2; 7.3", kode: "PRG-SMAP-01" },
    { nama: "Tabel Komunikasi Internal SMAP", klausul: "Klausul 7.4", kode: "Lampiran 4A Pedoman" },
    { nama: "Tabel Komunikasi Eksternal SMAP", klausul: "Klausul 7.4", kode: "Lampiran 4B Pedoman" },
    { nama: "Acuan Silang Prosedur vs ISO 37001:2016", klausul: "Semua Klausul", kode: "Lampiran 3 Pedoman" },
  ],
};

// ─── SBU KONSTRUKSI — SMAP requirements for construction companies ────────────
export const SBU_KONSTRUKSI_REQUIREMENTS = `
KETERKAITAN SMAP DENGAN SBU JASA KONSTRUKSI (BUJK):
Sumber: R1-07 Bimtek LPJK + Modul 6 Asesor BUJK — Kementerian PUPR Ditjen Bina Konstruksi

REGULASI ACUAN:
• UU No. 19 Tahun 2019 — Perubahan UU No. 30/2002 tentang KPK
• Perpres No. 54 Tahun 2018 — Strategi Nasional Pencegahan Korupsi
• Inpres No. 10 Tahun 2016 — Aksi Pencegahan dan Pemberantasan Korupsi
• ISO 37001:2016 — Sistem Manajemen Anti Penyuapan
• PP No. 5 Tahun 2021 — Perizinan Berusaha Berbasis Risiko (Jasa Konstruksi)
• Permen PUPR No. 6 Tahun 2021 — Standar Kegiatan Usaha Jasa Konstruksi
• SE LPJK No. 17/SE/LPJK/2021 — Pedoman Teknis Sertifikasi BUJK

SMAP WAJIB UNTUK SBU (3 Pilihan Pemenuhan):
1. Sertifikat ISO 37001:2016 dari Lembaga terakreditasi KAN — pemenuhan PENUH
2. Dokumen SMAP yang dibuat sendiri oleh BUJK — pemenuhan LENGKAP
3. Surat Pernyataan Komitmen — pemenuhan SEMENTARA (ada batas waktu)

DEADLINE PEMENUHAN SMAP (dari tanggal SBU diterbitkan):
┌─────────────────────────────┬──────────────────────┬───────────────────────────┐
│ Kualifikasi BUJK            │ Surat Pernyataan     │ Dokumen SMAP/ISO Cert     │
├─────────────────────────────┼──────────────────────┼───────────────────────────┤
│ Kualifikasi Besar           │ Max 1 tahun          │ Wajib sebelum 1 tahun     │
│ Kualifikasi Menengah        │ Max 2 tahun          │ Wajib sebelum 2 tahun     │
│ Kualifikasi Kecil           │ Max 3 tahun          │ Wajib sebelum 3 tahun     │
└─────────────────────────────┴──────────────────────┴───────────────────────────┘
→ IMPLIKASI KONSULTANSI: Perusahaan konstruksi kualifikasi Besar punya urgensi TERTINGGI (1 tahun)

16 KOMPONEN DOKUMEN SMAP WAJIB BUJK (sesuai persyaratan LSBU/LPJK):
1.  Kebijakan Anti Penyuapan          → Klausul 5.2
2.  Identifikasi (Isu & Pihak)         → Klausul 4.1; 4.2
3.  Pemenuhan Perundang-undangan       → Klausul 4.2; 6.1
4.  Sasaran Program                    → Klausul 6.2
5.  Sumber Daya, Struktur & Tanggung Jawab → Klausul 5.3; 7.1
6.  Kompetensi, Pelatihan & Kepedulian → Klausul 7.2; 7.3
7.  Komunikasi, Partisipasi & Konsultasi → Klausul 7.4
8.  Dokumentasi                        → Klausul 7.5
9.  Pengendalian Dokumen               → Klausul 7.5.3
10. Pengendalian Operasional           → Klausul 8.1–8.8
11. Kesiagaan dan Tanggap Darurat      → Klausul 8.8; 8.10
12. Pengukuran dan Pemantauan          → Klausul 9.1
13. Evaluasi Kepatuhan                 → Klausul 9.1; 9.4
14. Pengendalian Rekaman               → Klausul 7.5.3.2
15. Audit Internal                     → Klausul 9.2
16. Tinjauan Manajemen                 → Klausul 9.3; 9.4

PROSES PENILAIAN DOKUMEN SMAP (LSBU Assessment):
• Verifikasi = pemeriksaan KELENGKAPAN dokumen sesuai 16 komponen
• Validasi = pemeriksaan KEABSAHAN dokumen (4 prinsip VACS):
  - Valid/Sahih: dokumen berkaitan langsung dengan standar yang ditargetkan
  - Authentic/Asli: dokumen merupakan karya sendiri badan usaha
  - Current/Terbaru: dokumen masih berlaku dan mutakhir
  - Sufficient/Cukup: dokumen memadai untuk membuktikan pemenuhan

FORMULIR PENILAIAN ASESOR BUJK:
• FSMAP-01: Penilaian Badan Usaha yang Memiliki Sertifikat ISO 37001:2016
• FSMAP-02: Penilaian Badan Usaha yang Memiliki Dokumen SMAP (self-made)
• FSMAP-03: Penilaian dan Rekomendasi Kesesuaian Dokumen SMAP
• FSMAP-04: Penilaian dan Rekomendasi Kesesuaian (Surat Pernyataan)

LEMBAGA SERTIFIKASI ISO 37001:2016 TERAKREDITASI KAN (per 2024):
PT Garuda Sertifikasi Indonesia | PT Asricert Indonesia | PT TUV NORD Indonesia |
PT Mutu Agung Lestari | PT Mutu Hijau Indonesia | PT Sucofindo Persero |
PT Chesna | SAI Global Indonesia | PT Global Inspeksi Indonesia |
PT BSI Group Indonesia | PT SGS Indonesia

PERBEDAAN PEMENUHAN SMAP vs ISO CERT:
• Dokumen SMAP (self-made): BUJK menyusun sendiri 16 dokumen → diverifikasi LSBU → TANPA sertifikasi eksternal
• ISO 37001:2016 Cert: proses sertifikasi oleh CB terakreditasi KAN → sertifikat berlaku 3 tahun dengan surveilance
• Surat Pernyataan: jalan pintas sementara → BUJK berkomitmen memenuhi dalam batas waktu atau kena sanksi
`;

// ─── DOCUMENT GENERATION MATRIX — Structured prompting matrix (BAB 1-5 synthesis) ─
export const DOCUMENT_GENERATION_MATRIX = `
MATRIX PROMPTING PENYUSUNAN DOKUMEN SMAP
(Sintesis BAB 1-5 — Format: Nama Dokumen | Klausul | Input Kunci | Elemen Wajib | Kualitas VACS)

════════════════════════════════════════════════════════════════
BAB 1 — KONTEKS DAN KEPEMIMPINAN (Klausul 4 & 5)
════════════════════════════════════════════════════════════════

[DOK-01] PEDOMAN SMAP (Manual ABMS)
• Klausul: 4.1–4.5; 5.1–5.3; 6.1–6.2; 7.1–7.5; 8.1–8.10; 9.1–9.4; 10.1–10.2
• Input kunci: Nama perusahaan, bidang usaha, kota, jumlah karyawan, nama Direktur, nama Ketua FKAP, tanggal berlaku
• Elemen WAJIB:
  ✓ Halaman pengesahan + tanda tangan Direktur (atau digital)
  ✓ Daftar isi sesuai urutan klausul ISO 37001:2016
  ✓ Definisi FKAP, Dewan Pengarah, risiko penyuapan (Klausul 3)
  ✓ Pernyataan ruang lingkup yang spesifik (unit bisnis, lokasi, kontrak)
  ✓ Penilaian risiko penyuapan per proses bisnis (Klausul 4.5)
  ✓ Pernyataan komitmen zero-tolerance (Klausul 5.1)
  ✓ Referensi ke semua prosedur/SOP yang relevan (cross-reference)
  ✓ 6 lampiran wajib (Business Process Map, Kebijakan, Cross-ref, Kom Internal, Kom Eksternal, Sasaran)
• Kualitas VACS: Valid (semua klausul tercakup), Authentic (spesifik nama+kota perusahaan), Current (tanggal berlaku jelas), Sufficient (tiap klausul punya narasi ≥1 paragraf)
• Kode dokumen: M-SMAP-[KODE PERUSAHAAN].01 | Rev.00

[DOK-02] KEBIJAKAN ANTI PENYUAPAN
• Klausul: 5.2
• Input kunci: Nama perusahaan, nama + jabatan Direktur, tanggal berlaku, bidang usaha
• Elemen WAJIB:
  ✓ Pernyataan zero-tolerance (jelas, tidak ambigu)
  ✓ Ruang lingkup: berlaku untuk semua karyawan, mitra, pihak ketiga
  ✓ Kewajiban semua pihak untuk melaporkan dugaan penyuapan
  ✓ Perlindungan whistleblower (anti-retaliation)
  ✓ Mekanisme sanksi untuk pelanggaran
  ✓ Komitmen terhadap hukum dan regulasi yang berlaku (UU KPK)
  ✓ Referensi ke FKAP sebagai pelaksana pengawasan
  ✓ Tanda tangan Direktur Utama + tanggal
• Format: 1-2 halaman, bahasa Indonesia formal, nomor dokumen, header perusahaan
• Kode dokumen: KBJ-SMAP-[KODE].01 | Rev.00

[DOK-03] SK PENETAPAN TIM FKAP
• Klausul: 5.3.2
• Input kunci: Nama + jabatan Direktur, nomor SK, tanggal SK, nama Ketua FKAP + jabatan asli, nama Sekretaris + jabatan asli, nama Anggota (2-3 orang) + jabatan
• Elemen WAJIB:
  ✓ Format SK resmi: Menimbang, Mengingat, Memutuskan, Menetapkan
  ✓ Mengingat: cantumkan SNI ISO 37001:2016 + Perpres 54/2018
  ✓ Lampiran: Tugas Pokok dan Wewenang FKAP per jabatan:
    - Ketua FKAP: memimpin implementasi, bertanggung jawab ke Direktur
    - Sekretaris: administrasi, dokumentasi, distribusi dokumen
    - Anggota: verifikasi, investigasi, sosialisasi, pelatihan
  ✓ Keterangan masa berlaku SK
  ✓ Tanda tangan + cap perusahaan
• Kode dokumen: SK-FKAP-[KODE]-[NOMOR] | Tahun [TAHUN]

════════════════════════════════════════════════════════════════
BAB 2 — PERENCANAAN DAN RISIKO (Klausul 6)
════════════════════════════════════════════════════════════════

[DOK-04] REGISTER RISIKO PENYUAPAN
• Klausul: 4.5; 6.1
• Input kunci: Bidang usaha, proses bisnis utama, jenis mitra, interaksi pemerintah
• Elemen WAJIB:
  ✓ Kolom: No | Proses Bisnis | Risiko Penyuapan | Penyebab | Dampak | Likelihood (1-5) | Impact (1-5) | Level Risiko | Pengendalian Existing | Pengendalian Tambahan | PIC | Status
  ✓ Minimal 8-12 risiko yang relevan dengan industri
  ✓ Kalkulasi Level Risiko: Likelihood × Impact → L(1-4)/M(5-9)/H(10-16)/VH(17-25)
  ✓ Risiko konstruksi wajib ada: pengadaan material, pengurusan izin, tender, subkontraktor
  ✓ Rekomendasi pengendalian untuk setiap risiko H/VH
• Format: Tabel Excel-ready, baris per risiko

[DOK-05] TABEL SASARAN SMAP
• Klausul: 6.2
• Input kunci: Target KPI yang realistis, tahun sasaran, PIC per sasaran
• Elemen WAJIB:
  ✓ Kolom: No | Sasaran | Indikator Keberhasilan (KPI) | Target | Periode | PIC | Anggaran | Status
  ✓ Minimal 5 sasaran SMART yang terukur
  ✓ Contoh sasaran: 100% karyawan terlatih, 0 insiden penyuapan terkonfirmasi, 100% mitra ter-due diligence
  ✓ Mekanisme pemantauan dan frekuensi review

════════════════════════════════════════════════════════════════
BAB 3 — DUKUNGAN DAN SUMBER DAYA (Klausul 7)
════════════════════════════════════════════════════════════════

[DOK-06] PROGRAM PELATIHAN SMAP TAHUNAN
• Klausul: 7.2; 7.3
• Input kunci: Jumlah karyawan, struktur jabatan, anggaran pelatihan, tahun program
• Elemen WAJIB:
  ✓ Segmentasi peserta: Direksi/Top Management | Manajer/Supervisor | Staf Operasional | Frontline
  ✓ Kalender pelatihan per kuartal dengan jadwal bulan spesifik
  ✓ Materi per level: awareness (1 jam), implementasi (4 jam), audit (8 jam)
  ✓ Metode: tatap muka, e-learning, workshop, briefing rutin
  ✓ KPI pelatihan: % karyawan terlatih, skor rata-rata pre/post test
  ✓ Template daftar hadir dan sertifikat peserta
  ✓ Outline materi awareness 1 jam siap pakai

[DOK-07] TABEL KOMUNIKASI SMAP (Internal & Eksternal)
• Klausul: 7.4
• Elemen WAJIB Internal:
  ✓ Kolom: No | Topik | Tujuan | Media | Pengirim | Penerima | Frekuensi
  ✓ Topik minimal: kebijakan baru, laporan kinerja SMAP, sosialisasi WBS, hasil audit
• Elemen WAJIB Eksternal:
  ✓ Topik: komitmen anti penyuapan ke mitra, pelaporan ke regulator
  ✓ Media: surat resmi, website, kontrak, presentasi vendor

════════════════════════════════════════════════════════════════
BAB 4 — OPERASIONAL ANTI PENYUAPAN (Klausul 8)
════════════════════════════════════════════════════════════════

[DOK-08] SOP UJI TUNTAS PERSONIL
• Klausul: 8.2
• Elemen WAJIB:
  ✓ Verifikasi latar belakang (background check) calon karyawan di posisi berisiko
  ✓ Formulir Deklarasi Konflik Kepentingan (wajib diisi saat onboarding)
  ✓ Posisi berisiko tinggi yang wajib due diligence: Pengadaan, Marketing, Keuangan, Direksi
  ✓ Prosedur review berkala (tahunan) untuk karyawan di posisi berisiko
  ✓ Mekanisme jika ditemukan konflik kepentingan

[DOK-09] SOP UJI TUNTAS MITRA BISNIS
• Klausul: 8.2
• Elemen WAJIB:
  ✓ Klasifikasi mitra: Tier 1 (Kritis/High Risk), Tier 2 (Signifikan/Medium), Tier 3 (Rendah/Low)
  ✓ Kriteria klasifikasi: nilai kontrak, jenis layanan, interaksi pemerintah, negara asal
  ✓ Due Diligence Questionnaire (DDQ) 15-20 pertanyaan per Tier
  ✓ Kriteria penerimaan (Approved) dan penolakan (Rejected) mitra
  ✓ Monitoring berkelanjutan: review tahunan untuk Tier 1-2
  ✓ Formulir FRM-FKAP-02: Penilaian Mitra Bisnis
• Catatan BUJK: Subkontraktor konstruksi adalah Tier 1 jika nilai kontrak >1M atau berinteraksi dengan pejabat

[DOK-10] SOP PENGENDALIAN KEUANGAN
• Klausul: 8.3
• Elemen WAJIB:
  ✓ Otorisasi pembayaran: level approval per batas nilai (misal: <5jt=Manager, <50jt=Direktur)
  ✓ 4-eyes principle: minimal 2 orang dalam setiap transaksi material
  ✓ Larangan pembayaran tunai di atas batas (misal: >2 juta)
  ✓ Review rekening bank mitra vs data karyawan (cegah conflict of interest)
  ✓ Pengendalian petty cash dan representasi
  ✓ Prosedur deteksi pembayaran tidak wajar

[DOK-11] SOP HADIAH, HOSPITALITY DAN DONASI
• Klausul: 8.7
• Elemen WAJIB:
  ✓ Definisi yang diperbolehkan vs dilarang (batas nilai, konteks, penerima)
  ✓ Batas nilai hadiah yang diperbolehkan (misal: <Rp 500.000 per kejadian)
  ✓ Larangan pemberian kepada pejabat pemerintah TANPA exception
  ✓ Register Hadiah/Hospitality (Log setiap pemberian/penerimaan)
  ✓ Prosedur pelaporan ke FKAP untuk pemberian di atas batas
  ✓ Donasi: harus melalui FKAP, tidak boleh ke organisasi yang terkait pejabat pemerintah

[DOK-12] SOP WHISTLEBLOWING SYSTEM (RAISING CONCERN)
• Klausul: 8.9
• Elemen WAJIB:
  ✓ Mekanisme pelaporan ANONIM (wajib per ISO 37001:2016)
  ✓ Minimal 2 channel pelaporan independen
  ✓ SLA penerimaan dan klasifikasi: 24 jam
  ✓ SLA investigasi: awal 5 hari kerja, mendalam 30 hari, total max 60 hari
  ✓ Perlindungan pelapor anti-retaliation (eksplisit, tertulis)
  ✓ Form FRM-WBS-01: Formulir Laporan Pelanggaran (mendukung anonim)
  ✓ Register WBS: log semua laporan masuk + status
  ✓ Pelaporan aggregate (tanpa nama pelapor) ke Tinjauan Manajemen

[DOK-13] KOMITMEN ANTI PENYUAPAN (untuk Mitra)
• Klausul: 8.6
• Elemen WAJIB:
  ✓ Pernyataan mitra bahwa mereka tidak akan menawarkan/menerima suap
  ✓ Hak BUJK untuk melakukan audit kepatuhan ke mitra
  ✓ Konsekuensi jika mitra melanggar (terminasi kontrak)
  ✓ Ditandatangani Pimpinan Mitra + materai
  ✓ Berlaku selama durasi kontrak + 2 tahun sesudahnya

════════════════════════════════════════════════════════════════
BAB 5 — EVALUASI DAN PENINGKATAN (Klausul 9-10)
════════════════════════════════════════════════════════════════

[DOK-14] PROGRAM AUDIT INTERNAL SMAP
• Klausul: 9.2
• Elemen WAJIB:
  ✓ Format per-departemen (bukan per klausul) — Marketing/Purchasing=High 2x/tahun
  ✓ Semua klausul 4-10 tercakup dalam satu siklus tahunan
  ✓ Kolom: Departemen | Ruang Lingkup | Klausul ISO | Risiko | Status (Mjr/Mnr/Obs) | Frekuensi | Jadwal (bulan 1-12)
  ✓ Tim Auditor Internal: min 2 orang, independent dari area yang diaudit
  ✓ Jadwal Opening Meeting dan Closing Meeting
  ✓ Teknik khusus: review payroll, personnel expense, data vendor vs data karyawan

[DOK-15] CHECKLIST AUDIT INTERNAL
• Klausul: 9.2
• Per klausul (4 s/d 10):
  ✓ Kolom: No | Pertanyaan Audit | Metode (W/O/D) | Bukti yang Dibutuhkan | Hasil (OK/NCR/Obs) | Catatan
  ✓ W=Wawancara, O=Observasi, D=Review Dokumen
  ✓ Minimal 10-15 pertanyaan per klausul
  ✓ Pertanyaan harus menggali BUKTI (records, evidence), bukan sekadar jawaban "ya/tidak"

[DOK-16] LAPORAN KINERJA SMAP + TINJAUAN MANAJEMEN
• Klausul: 9.1; 9.3; 9.4; 9.3.2
• Elemen WAJIB (3 dokumen tinjauan):
  ✓ Laporan Kinerja: KPI vs target, hasil audit, statistik WBS, efektivitas pelatihan, update risiko
  ✓ Notulen Tinjauan Manajemen Puncak (FRM-FKAP-13): input-proses-output format
  ✓ Notulen Tinjauan Dewan Pengarah/Komisaris (FRM-FKAP-14-01): keputusan mandate
  ✓ Semua dokumen tinjauan ditandatangani pejabat yang berwenang

PRINSIP KUALITAS DOKUMEN (VACS dari Modul 6 Asesor BUJK):
• Valid/Sahih: setiap dokumen harus merujuk klausul ISO 37001:2016 yang spesifik
• Authentic/Asli: dokumen harus memuat nama perusahaan, bidang usaha, dan konteks operasional nyata (bukan template kosong)
• Current/Terbaru: tanggal berlaku jelas, revisi terkini, tidak kadaluarsa
• Sufficient/Cukup: isi memadai untuk membuktikan implementasi nyata, bukan sekadar ada dokumennya
`;

// ─── BUJK ASSESSOR KNOWLEDGE — For construction sector Gap Analysis ───────────
export const BUJK_ASSESSOR_KNOWLEDGE = `
PANDUAN ASESOR BUJK UNTUK GAP ANALYSIS SMAP KONSTRUKSI:

TIGA LEVEL KESIAPAN BUJK:
1. LEVEL SURAT PERNYATAAN (Minimal):
   → Ada: Surat Pernyataan Komitmen bermaterai + KOP BUJK
   → Belum ada: dokumen SMAP maupun sertifikat ISO
   → Status: BUJK dapat SBU tapi ada batas waktu pemenuhan
   → Risiko: jika tidak dipenuhi dalam batas waktu → sanksi sesuai UU

2. LEVEL DOKUMEN SMAP (Menengah):
   → Ada: 16 komponen dokumen SMAP yang dibuat sendiri (self-made)
   → Diverifikasi + divalidasi LSBU (VACS principle)
   → Tidak perlu sertifikat eksternal dari CB
   → Form penilaian: FSMAP-02 + FSMAP-03

3. LEVEL ISO 37001:2016 CERTIFIED (Optimal):
   → Ada: Sertifikat dari CB terakreditasi KAN
   → Berlaku 3 tahun + surveilance tahunan
   → Pemenuhan otomatis untuk BUJK semua kualifikasi
   → Form penilaian: FSMAP-01

GAP ANALYSIS UNTUK KONSTRUKSI — Area Risiko Khusus:
• Tender/Lelang: Risiko suap dalam penawaran harga, markup RAB, dokumen palsu
• Pengadaan Material: Kickback dari supplier, phantom vendor
• Pengurusan IMB/Izin: Interaksi dengan DINAS PUPR, BPN, Pemda — RISIKO TINGGI
• Subkontraktor: Due diligence wajib untuk semua sub-kon besar (Tier 1)
• Personil Lapangan (Site Manager, Surveyor, QC): akses ke area berisiko

JALUR COMPLIANCE BERDASARKAN KUALIFIKASI (PER 2025):

• BUJK Besar → Target: Sertifikat ISO 37001:2016 dari CB terakreditasi KAN
  Timeline: SEGERA (max 1 tahun sejak SBU terbit) → Fase: Siap Dokumen → Audit Internal → ISO cert

• BUJK Menengah → Target: Sertifikat ISO 37001:2016 atau Pancek KPK (Jaga.id)
  → Dokumen SMAP tetap WAJIB dibuat sebagai dasar compliance

• BUJK Kecil → SMAP masih SEPENUHNYA RELEVAN dan berlaku saat ini
  → Target saat ini (sebelum 2027): Dokumen SMAP (bisa untuk SBU dan sebagai persiapan Pancek KPK)
  → Mulai 2027: Pancek KPK via Jaga.id menjadi jalur WAJIB untuk kualifikasi Kecil
  → ⚠️ Penting: dokumen SMAP yang disusun sekarang akan menjadi LAMPIRAN WAJIB kuesioner Pancek KPK
  → Jadi membangun dokumen SMAP sekarang = investasi yang tidak terbuang (dipakai dua jalur)

POSISI PANCEK KPK DALAM EKOSISTEM:
• Pancek KPK = Panduan Cegah Korupsi dari KPK, berdasarkan UU Tindak Pidana Korupsi
• Platform verifikasi: Jaga.id (Platform KPK)
• Pancek KPK memiliki kuesioner/formulir tersendiri — dikelola di section TERPISAH dari SMAP
• Dokumen SMAP (16 komponen) menjadi LAMPIRAN MATERIAL kuesioner Pancek KPK
• Jangan campur pembahasan Pancek KPK ke dalam sesi konsultansi SMAP — arahkan ke section Pancek

PERTANYAAN KUNCI UNTUK BUJK DALAM DIALOG GUSTAFTA:
• "Apakah perusahaan sudah memiliki SBU? Kualifikasi Kecil/Menengah/Besar?"
• "Kapan SBU terakhir diterbitkan? Berapa sisa waktu pemenuhan SMAP?"
• "Apakah sudah ada Surat Pernyataan Komitmen SMAP yang diserahkan ke LSBU?"
• "Seberapa sering perusahaan mengikuti tender pemerintah?"
• "Ada berapa subkontraktor yang biasa bekerja sama?"
• Untuk BUJK Kecil: "Sudah tahu bahwa mulai 2027 wajib Pancek KPK? Dokumen SMAP yang kita buat sekarang akan dipakai sebagai lampiran Pancek nanti."
`;

// ─── SMAP DOCUMENT FRAMEWORK — 16 Planning + 6 Implementation (dari "Revolusi") ─
export const SMAP_DOCUMENT_FRAMEWORK = `
FRAMEWORK KATEGORISASI DOKUMEN SMAP (dari referensi "Revolusi Penyusunan Dokumen SMAP"):
⚠️ CATATAN REGULASI (per 2025):
• Permen PU No. 08 Tahun 2022 → TELAH DIGANTI oleh Permen PU No. 06 Tahun 2025 (detail implementasi baru belum dipublikasikan secara luas)
• SK Dirjen Bina Konstruksi No. 144 Tahun 2022 → TELAH DIGANTI (regulasi pengganti belum dipublikasikan)
• SNI ISO 37001:2016 tetap berlaku sebagai standar inti — tidak berubah
• Dokumen SMAP yang disusun tetap relevan dan valid untuk jalur Pancek KPK maupun ISO cert

DUA KATEGORI UTAMA DOKUMEN SMAP:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KATEGORI A — DOKUMEN PERENCANAAN (16 Klausul)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Dokumen yang mendeskripsikan RENCANA dan KEBIJAKAN sistem. Dibuat LEBIH DULU.
1.  Kebijakan Anti Penyuapan                 → Klausul 5.2
2.  Identifikasi Risiko (Konteks Organisasi)  → Klausul 4.1; 4.5
3.  Memahami Konteks dan Isu Organisasi       → Klausul 4.1
4.  Sasaran Anti Penyuapan & Rencana Pencapaian → Klausul 6.2
5.  Sumber Daya, Struktur & Pertanggungjawaban → Klausul 7.1; 5.3
6.  Kompetensi, Pelatihan dan Kepedulian      → Klausul 7.2; 7.3
7.  Komunikasi, Partisipasi dan Konsultasi    → Klausul 7.4
8.  Dokumentasi (Informasi Terdokumentasi)    → Klausul 7.5
9.  Pengendalian Dokumen                      → Klausul 7.5.3
10. Pengendalian Operasional                  → Klausul 8.1
11. Kesiagaan dan Tanggap Darurat             → Klausul 8.8; 8.10
12. Pengukuran dan Pemantauan                 → Klausul 9.1
13. Tinjauan Fungsi Kepatuhan Anti Penyuapan  → Klausul 9.4
14. Pengendalian Informasi Terdokumentasi     → Klausul 7.5.3
15. Audit Internal                            → Klausul 9.2
16. Tinjauan Manajemen                        → Klausul 9.3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KATEGORI B — DOKUMEN PELAKSANAAN (6 Klausul)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Dokumen yang membuktikan IMPLEMENTASI NYATA sistem. Dibuat SETELAH dokumen perencanaan.
1.  Kepemimpinan dan Komitmen (bukti nyata)   → Klausul 5.1
2.  Komitmen Anti Penyuapan (tanda tangan)    → Klausul 8.6
3.  Penilaian Risiko Penyuapan (hasil assessment) → Klausul 4.5
4.  Informasi Terdokumentasi (records)        → Klausul 7.5
5.  Pemantauan, Pengukuran, Analisis, Evaluasi → Klausul 9.1
6.  Laporan Hasil Audit Internal              → Klausul 9.2

→ IMPLIKASI KONSULTANSI:
  • Klien yang belum punya APAPUN: mulai dari 16 Perencanaan → lanjut 6 Pelaksanaan
  • Klien yang sudah punya beberapa dokumen: identifikasi mana Perencanaan vs Pelaksanaan yang missing
  • Untuk SBU (BUJK): 16 komponen dokumen BUJK = subset dari 16 Perencanaan di atas

REGULASI KONSTRUKSI KHUSUS:
• Permen PU No. 08 Tahun 2022 → sudah diganti Permen PU No. 06 Tahun 2025 (implementasi baru belum dipublikasi)
• SK Dirjen Bina Konstruksi No. 144 Tahun 2022 → sudah diganti (regulasi baru belum dipublikasi)
• SNI ISO 37001:2016 tetap menjadi standar inti yang tidak berubah
• Jalur compliance BUJK (per 2025): Kecil/Menengah → Pancek KPK (Jaga.id) + dokumen SMAP sebagai lampiran; Besar → ISO 37001 cert
`;

// ─── SMAP UKM CONTEXT — Pain points, value props, common mistakes (dari 5 ebooks) ──
export const SMAP_UKM_CONTEXT = `
KONTEKS UKM/KONTRAKTOR KECIL-MENENGAH DALAM IMPLEMENTASI SMAP:
(Sintesis dari: SMAPGuide, Lepas dari Jerat, AntiBribe, Revolusi SMAP, Panduan Komitmen)

PAIN POINTS UTAMA (yang sering diungkap klien dalam dialog):
1. "Tidak tahu dari mana harus mulai" — bingung dengan kompleksitas dan banyaknya dokumen
2. "Tidak punya orang yang paham SMAP" — tidak ada staf compliance, SDM sangat terbatas
3. "Terlalu mahal jika harus pakai konsultan" — budget terbatas, takut biaya tinggi
4. "Karyawan tidak mau berubah" — resistensi internal, merasa dokumen baru = beban kerja
5. "Sudah deadline SBU tapi belum mulai" — panic mode, butuh solusi cepat
6. "Hanya untuk syarat SBU saja" — belum paham nilai strategis SMAP

CARA GUSTAFTA MERESPONS PAIN POINTS:
• "Tidak tahu mulai dari mana" → validasi perasaan, lalu tunjukkan bahwa 16 dokumen bisa dikerjakan bertahap
• "Tidak punya orang" → tanyakan siapa yang paling paham operasional (calon FKAP), bukan harus orang compliance
• "Mahal" → jelaskan bahwa dokumen SMAP self-made lebih hemat, AI bisa membantu drafting
• "Resistensi karyawan" → tanyakan apakah Direktur sudah bicara langsung tentang komitmen
• "Deadline mepet" → hitung sisa waktu, tawarkan prioritisasi 4-8 dokumen kritis terlebih dahulu
• "Hanya untuk syarat" → perlahan perkenalkan nilai nyata: tender kompetitif, reputasi, perlindungan hukum

NILAI STRATEGIS SMAP (bahasa yang mudah dipahami UKM):
• Syarat SBU → tanpa SMAP = berisiko SBU tidak diperpanjang atau ditolak
• Keunggulan tender → SMAP menunjukkan komitmen integritas = nilai tambah saat evaluasi
• Perlindungan hukum → ada proses yang jelas = bukti bahwa perusahaan tidak terlibat penyuapan
• Reputasi bisnis → klien swasta besar semakin menuntut vendor yang punya governance baik
• Budaya organisasi → karyawan yang paham etika = risiko fraud internal lebih rendah

QUICK-START TIMELINE (untuk klien UKM dengan deadline atau budget ketat):
Opsi A — "4 Minggu Dasar" (untuk kebutuhan SBU segera):
  Minggu 1: Identifikasi risiko + Kebijakan Anti Penyuapan
  Minggu 2: SK FKAP + Prosedur kritis (WBS, Uji Tuntas)
  Minggu 3: Program Pelatihan + Tabel Komunikasi + Register Risiko
  Minggu 4: Review, finalisasi, siap submit ke LSBU

Opsi B — "3-6 Bulan Komprehensif" (untuk target ISO 37001 cert):
  Bulan 1-2: Semua 16 dokumen perencanaan
  Bulan 3-4: 6 dokumen pelaksanaan + implementasi nyata
  Bulan 5-6: Audit internal + persiapan Stage 1 & 2 CB

KESALAHAN UMUM YANG HARUS DIHINDARI:
• Membuat dokumen "copy-paste template" tanpa disesuaikan nama/bidang usaha → gagal validasi VACS
• Tidak melibatkan Direktur (hanya tim administrasi) → dokumen tidak punya legitimasi
• WBS hanya "ada kotak saran" tanpa mekanisme anonim → tidak memenuhi Klausul 8.9
• Uji tuntas mitra hanya formalitas checklist tanpa investigasi nyata → temuan NCR audit
• Register risiko berisi risiko generik (copy-paste dari internet) → tidak relevan secara industri
• Membuat semua dokumen sekaligus tanpa prioritas → overwhelmed, tidak selesai
`;

// ─── KONSTRUKSI RISK PROFILE — Sector-specific risk factors ──────────────────
export const KONSTRUKSI_RISK_PROFILE = `
PROFIL RISIKO PENYUAPAN — SEKTOR KONSTRUKSI (Untuk Register Risiko & Blueprint):

PROSES BISNIS BERISIKO TINGGI:
┌────────────────────────────┬────────────┬──────────────────────────────────────┐
│ Proses Bisnis              │ Level Risk │ Bentuk Penyuapan Tipikal             │
├────────────────────────────┼────────────┼──────────────────────────────────────┤
│ Tender/Lelang Pemerintah   │ SANGAT TINGGI │ Markup RAB, kebocoran HPS, dokumen palsu │
│ Pengurusan IMB/Izin        │ TINGGI     │ Suap ke petugas Dinas                │
│ Pengadaan Material         │ TINGGI     │ Kickback supplier, phantom vendor    │
│ Seleksi Subkontraktor      │ TINGGI     │ Suap dalam seleksi, markup           │
│ Pemeriksaan/Uji Mutu       │ SEDANG     │ Suap QC/inspector                    │
│ Pembayaran Termin          │ SEDANG     │ Markup progress, dokumen fiktif      │
│ Perizinan Operasional      │ TINGGI     │ Suap untuk percepatan izin           │
│ Rekruitmen Personil Kunci  │ SEDANG     │ Nepotisme, jual-beli jabatan         │
└────────────────────────────┴────────────┴──────────────────────────────────────┘

PENGENDALIAN KHAS KONSTRUKSI:
• Prosedur e-procurement (hindari tatap muka dalam proses tender)
• Rotation kebijakan: PIC pengadaan tidak boleh jabat >3 tahun di posisi sama
• 4-eyes principle untuk semua pembayaran >Rp 50 juta
• Register Konflik Kepentingan wajib diisi semua PIC Pengadaan
• Audit rutin terhadap dokumen pengadaan oleh FKAP
• Komitmen Anti Penyuapan wajib dari semua subkontraktor dan supplier utama
`;
