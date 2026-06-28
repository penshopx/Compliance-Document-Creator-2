---
name: Pancek vs SMAP Document Overlap
description: Which Pancek/Jaga.id kuesioner documents can reuse SMAP docs vs must be created new; current sub-agent count.
---

# Pancek vs SMAP ISO 37001 Document Overlap

## Rule
Pancek (KPK) ≠ SMAP (ISO 37001). SMAP = anti-penyuapan (bribery only). Pancek = anti-korupsi luas (suap + KKN + gratifikasi + benturan kepentingan + kontribusi politik). Overlap ~40-50%.

**Why:** Every sub-agent prompt and opening message now begins with a SMAP check question + explicit status (❌/⚠️/✅) so AI always advises adapt-vs-new.

**How to apply:** When user asks "apakah perlu buat baru?" — consult this table:

## Status Per Kuesioner

| Kuesioner | Dokumen | Status | Tindakan |
|---|---|---|---|
| K.1 | Deklarasi Komitmen Anti-Korupsi | ❌ Buat Baru | SMAP tidak punya ini |
| K.2 | Pakta Integritas Manajemen | ❌ Buat Baru | SMAP hanya punya form karyawan baru |
| K.3-K.5 | Kebijakan Anti-Korupsi 8 Bab | ⚠️ Perluas | SMAP punya Kebijakan Anti Penyuapan (sempit) |
| K.6 | SK Fungsi Kepatuhan | ✅ Gunakan | SK FKAP SMAP hampir identik, ganti nama + perluas lingkup |
| K.7 | Program Pelatihan | ⚠️ Sesuaikan | SMAP punya, perluas topik ke anti-korupsi umum |
| P.1-P.3 | Register Risiko Korupsi | ⚠️ Perluas | SMAP punya Register Risiko Penyuapan (sempit) |
| D.1 | Klausul Anti-Korupsi Kontrak | ✅ Gunakan | SMAP punya, ganti framing + perluas |
| D.2 | Due Diligence Mitra | ✅ Gunakan | SMAP punya Formulir Uji Tuntas, tambahkan BO check |
| D.3 | Prosedur Hadiah & Gratifikasi | ✅ Gunakan | SMAP punya, tambahkan donasi politik + sponsorship |
| D.5 | SOP Benturan Kepentingan | ⚠️ Jadikan SOP | Ada di Kebijakan SMAP, perlu jadi SOP tersendiri |
| D.6 | SOP WBS + 5 Format KPK | ⚠️ Tambahkan | SMAP punya WBS, tapi format KPK-nya berbeda |
| D.7 | Program Sosialisasi | ⚠️ Sesuaikan | SMAP punya, perluas topik + tambahkan vendor |
| C.1 | Piagam Audit | ⚠️ Tingkatkan | SMAP punya Prosedur Audit, perlu jadi Piagam formal |
| A.1 | Matriks Sanksi | ⚠️ Perluas | Ada di Kebijakan SMAP, perlu dokumen tersendiri |
| A.2 | Penghargaan Integritas | ❌ Buat Baru | SMAP tidak punya ini |

## Current Pancek Sub-Agent Count: 14

- Komitmen (5): deklarasi, pakta, kebijakan, sk_fkp, program_pelatihan
- Perencanaan (1): risk_register
- Pelaksanaan (6): kontrak, hadiah, wbs, sosialisasi, due_diligence, benturan_kepentingan
- Evaluasi (2): audit_charter, sanksi

Prompt keys in routes.ts SUB_AGENT_PROMPTS: `pelaksanaan_due_diligence`, `pelaksanaan_benturan_kepentingan` (added alongside the existing 12).

## BUJK Special Rule (2027)
Mulai 2027, perusahaan BUJK (konstruksi) WAJIB melampirkan sertifikat SMAP sebagai bagian kuesioner Pancek. Artinya SMAP + Pancek keduanya diperlukan — bukan pilih salah satu.
