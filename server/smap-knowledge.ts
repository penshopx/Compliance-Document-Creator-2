/**
 * SMAP Knowledge Base
 * Derived from consultant-grade reference documents:
 *   SMAP01 — Pedoman SMAP (SNI ISO 37001:2016) full 49-page manual template
 *   SMAP02 — Program Audit Internal SMAP (department-level audit program)
 *   SMAP03 — SOP & Form: Tinjauan Dewan Pengarah + SOP CAPA (Klausul 10.1-10.2)
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
