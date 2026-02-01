import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertCompanySchema,
  insertManagementSchema,
  insertEmployeeSchema,
  insertFkapSchema,
  insertAuditSchema,
  insertQualificationSchema,
  insertEquipmentSchema,
  insertProjectSchema,
  insertVendorSchema,
  insertDocumentSchema,
} from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Dashboard Stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Company Routes
  app.get("/api/company", async (req, res) => {
    try {
      const company = await storage.getCompany();
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch company" });
    }
  });

  app.post("/api/company", async (req, res) => {
    try {
      const data = insertCompanySchema.parse(req.body);
      const company = await storage.createCompany(data);
      res.status(201).json(company);
    } catch (error) {
      res.status(400).json({ error: "Invalid company data" });
    }
  });

  app.put("/api/company/:id", async (req, res) => {
    try {
      const data = insertCompanySchema.parse(req.body);
      const company = await storage.updateCompany(req.params.id, data);
      res.json(company);
    } catch (error) {
      res.status(400).json({ error: "Invalid company data" });
    }
  });

  // Management Routes
  app.get("/api/management", async (req, res) => {
    try {
      const members = await storage.getManagement();
      res.json(members);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch management" });
    }
  });

  app.post("/api/management", async (req, res) => {
    try {
      const data = insertManagementSchema.parse(req.body);
      const member = await storage.createManagement(data);
      res.status(201).json(member);
    } catch (error) {
      res.status(400).json({ error: "Invalid management data" });
    }
  });

  app.put("/api/management/:id", async (req, res) => {
    try {
      const data = insertManagementSchema.parse(req.body);
      const member = await storage.updateManagement(req.params.id, data);
      res.json(member);
    } catch (error) {
      res.status(400).json({ error: "Invalid management data" });
    }
  });

  app.delete("/api/management/:id", async (req, res) => {
    try {
      await storage.deleteManagement(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete management member" });
    }
  });

  // Employees Routes
  app.get("/api/employees", async (req, res) => {
    try {
      const employees = await storage.getEmployees();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employees" });
    }
  });

  app.post("/api/employees", async (req, res) => {
    try {
      const data = insertEmployeeSchema.parse(req.body);
      const employee = await storage.createEmployee(data);
      res.status(201).json(employee);
    } catch (error) {
      res.status(400).json({ error: "Invalid employee data" });
    }
  });

  app.put("/api/employees/:id", async (req, res) => {
    try {
      const data = insertEmployeeSchema.parse(req.body);
      const employee = await storage.updateEmployee(req.params.id, data);
      res.json(employee);
    } catch (error) {
      res.status(400).json({ error: "Invalid employee data" });
    }
  });

  app.delete("/api/employees/:id", async (req, res) => {
    try {
      await storage.deleteEmployee(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete employee" });
    }
  });

  // FKAP Team Routes
  app.get("/api/fkap", async (req, res) => {
    try {
      const members = await storage.getFkapTeam();
      res.json(members);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch FKAP team" });
    }
  });

  app.post("/api/fkap", async (req, res) => {
    try {
      const data = insertFkapSchema.parse(req.body);
      const member = await storage.createFkap(data);
      res.status(201).json(member);
    } catch (error) {
      res.status(400).json({ error: "Invalid FKAP data" });
    }
  });

  app.put("/api/fkap/:id", async (req, res) => {
    try {
      const data = insertFkapSchema.parse(req.body);
      const member = await storage.updateFkap(req.params.id, data);
      res.json(member);
    } catch (error) {
      res.status(400).json({ error: "Invalid FKAP data" });
    }
  });

  app.delete("/api/fkap/:id", async (req, res) => {
    try {
      await storage.deleteFkap(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete FKAP member" });
    }
  });

  // Audit Team Routes
  app.get("/api/audit", async (req, res) => {
    try {
      const members = await storage.getAuditTeam();
      res.json(members);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch audit team" });
    }
  });

  app.post("/api/audit", async (req, res) => {
    try {
      const data = insertAuditSchema.parse(req.body);
      const member = await storage.createAudit(data);
      res.status(201).json(member);
    } catch (error) {
      res.status(400).json({ error: "Invalid audit data" });
    }
  });

  app.put("/api/audit/:id", async (req, res) => {
    try {
      const data = insertAuditSchema.parse(req.body);
      const member = await storage.updateAudit(req.params.id, data);
      res.json(member);
    } catch (error) {
      res.status(400).json({ error: "Invalid audit data" });
    }
  });

  app.delete("/api/audit/:id", async (req, res) => {
    try {
      await storage.deleteAudit(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete audit member" });
    }
  });

  // Qualifications Routes
  app.get("/api/qualifications", async (req, res) => {
    try {
      const qualifications = await storage.getQualifications();
      res.json(qualifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch qualifications" });
    }
  });

  app.post("/api/qualifications", async (req, res) => {
    try {
      const data = insertQualificationSchema.parse(req.body);
      const qualification = await storage.createQualification(data);
      res.status(201).json(qualification);
    } catch (error) {
      res.status(400).json({ error: "Invalid qualification data" });
    }
  });

  app.put("/api/qualifications/:id", async (req, res) => {
    try {
      const data = insertQualificationSchema.parse(req.body);
      const qualification = await storage.updateQualification(req.params.id, data);
      res.json(qualification);
    } catch (error) {
      res.status(400).json({ error: "Invalid qualification data" });
    }
  });

  app.delete("/api/qualifications/:id", async (req, res) => {
    try {
      await storage.deleteQualification(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete qualification" });
    }
  });

  // Equipment Routes
  app.get("/api/equipment", async (req, res) => {
    try {
      const equipment = await storage.getEquipment();
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch equipment" });
    }
  });

  app.post("/api/equipment", async (req, res) => {
    try {
      const data = insertEquipmentSchema.parse(req.body);
      const item = await storage.createEquipment(data);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid equipment data" });
    }
  });

  app.put("/api/equipment/:id", async (req, res) => {
    try {
      const data = insertEquipmentSchema.parse(req.body);
      const item = await storage.updateEquipment(req.params.id, data);
      res.json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid equipment data" });
    }
  });

  app.delete("/api/equipment/:id", async (req, res) => {
    try {
      await storage.deleteEquipment(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete equipment" });
    }
  });

  // Projects Routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const data = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(data);
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ error: "Invalid project data" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const data = insertProjectSchema.parse(req.body);
      const project = await storage.updateProject(req.params.id, data);
      res.json(project);
    } catch (error) {
      res.status(400).json({ error: "Invalid project data" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      await storage.deleteProject(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Vendors Routes
  app.get("/api/vendors", async (req, res) => {
    try {
      const vendors = await storage.getVendors();
      res.json(vendors);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vendors" });
    }
  });

  app.post("/api/vendors", async (req, res) => {
    try {
      const data = insertVendorSchema.parse(req.body);
      const vendor = await storage.createVendor(data);
      res.status(201).json(vendor);
    } catch (error) {
      res.status(400).json({ error: "Invalid vendor data" });
    }
  });

  app.put("/api/vendors/:id", async (req, res) => {
    try {
      const data = insertVendorSchema.parse(req.body);
      const vendor = await storage.updateVendor(req.params.id, data);
      res.json(vendor);
    } catch (error) {
      res.status(400).json({ error: "Invalid vendor data" });
    }
  });

  app.delete("/api/vendors/:id", async (req, res) => {
    try {
      await storage.deleteVendor(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete vendor" });
    }
  });

  // Documents Routes
  app.get("/api/documents", async (req, res) => {
    try {
      const documents = await storage.getDocuments();
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  app.post("/api/documents/generate", async (req, res) => {
    try {
      const { type, title, clause } = req.body;
      
      // Generate document content based on type
      const content = generateDocumentContent(type, title);
      
      const document = await storage.createDocument({
        type,
        title,
        clause,
        status: "draft",
        content,
        version: "1.0",
      });
      res.status(201).json(document);
    } catch (error) {
      res.status(400).json({ error: "Failed to generate document" });
    }
  });

  app.delete("/api/documents/:id", async (req, res) => {
    try {
      await storage.deleteDocument(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete document" });
    }
  });

  return httpServer;
}

function generateDocumentContent(type: string, title: string): string {
  const templates: Record<string, string> = {
    "kebijakan-anti-penyuapan": `KEBIJAKAN ANTI PENYUAPAN

1. TUJUAN
Kebijakan ini menetapkan komitmen organisasi untuk mencegah, mendeteksi, dan merespons penyuapan sesuai dengan persyaratan SNI ISO 37001:2016.

2. RUANG LINGKUP
Kebijakan ini berlaku untuk seluruh personel organisasi, termasuk direksi, karyawan, dan mitra bisnis.

3. PERNYATAAN KEBIJAKAN
Organisasi berkomitmen untuk:
- Melarang segala bentuk penyuapan dalam semua aktivitas bisnis
- Mematuhi semua peraturan perundang-undangan anti penyuapan yang berlaku
- Menerapkan sistem manajemen anti penyuapan yang efektif
- Mendorong pelaporan dugaan pelanggaran tanpa takut akan pembalasan

4. TANGGUNG JAWAB
Manajemen Puncak bertanggung jawab untuk memastikan kebijakan ini dipahami dan dipatuhi oleh seluruh personel.

5. SANKSI
Pelanggaran terhadap kebijakan ini dapat mengakibatkan tindakan disipliner, termasuk pemutusan hubungan kerja.

6. TINJAUAN
Kebijakan ini akan ditinjau secara berkala untuk memastikan kesesuaian dan efektivitasnya.`,

    "sasaran-anti-penyuapan": `SASARAN ANTI PENYUAPAN

1. PENDAHULUAN
Dokumen ini menetapkan sasaran anti penyuapan organisasi yang terukur dan dapat dicapai.

2. SASARAN TAHUN INI
2.1 Tingkat Kesadaran
- 100% karyawan mengikuti pelatihan anti penyuapan
- Pemahaman kebijakan mencapai skor minimal 80%

2.2 Kepatuhan
- 100% vendor melalui proses uji tuntas
- 0 insiden penyuapan yang terkonfirmasi

2.3 Pelaporan
- Sistem whistleblowing aktif dan dapat diakses
- Waktu respons laporan maksimal 48 jam

3. PENGUKURAN
Sasaran akan diukur melalui:
- Survei pemahaman karyawan
- Audit internal dan eksternal
- Laporan statistik whistleblowing

4. PENANGGUNG JAWAB
Tim FKAP bertanggung jawab untuk memantau pencapaian sasaran.`,

    "register-risiko": `REGISTER RISIKO PENYUAPAN

1. TUJUAN
Mengidentifikasi, menilai, dan mengelola risiko penyuapan yang dihadapi organisasi.

2. METODOLOGI PENILAIAN
Risiko dinilai berdasarkan:
- Kemungkinan (Likelihood): 1-5
- Dampak (Impact): 1-5
- Tingkat Risiko = Kemungkinan x Dampak

3. KATEGORI RISIKO
3.1 Risiko Tinggi (>15)
- Memerlukan tindakan segera
- Eskalasi ke Manajemen Puncak

3.2 Risiko Sedang (8-15)
- Pengendalian tambahan diperlukan
- Pemantauan rutin

3.3 Risiko Rendah (<8)
- Pengendalian yang ada memadai
- Tinjauan berkala

4. DAFTAR RISIKO
[Akan diisi berdasarkan penilaian risiko organisasi]

5. TINJAUAN
Register risiko ditinjau minimal setiap 6 bulan atau saat ada perubahan signifikan.`,

    "prosedur-uji-tuntas": `PROSEDUR UJI TUNTAS (DUE DILIGENCE)

1. TUJUAN
Menetapkan prosedur untuk melakukan uji tuntas terhadap mitra bisnis guna mencegah penyuapan.

2. RUANG LINGKUP
Prosedur ini berlaku untuk:
- Vendor dan supplier baru
- Subkontraktor
- Agen dan perantara
- Konsultan dan penasihat

3. TINGKAT UJI TUNTAS
3.1 Dasar (Risiko Rendah)
- Verifikasi identitas dan legalitas usaha
- Pengecekan daftar hitam/sanksi

3.2 Menengah (Risiko Sedang)
- Semua poin tingkat dasar
- Analisis kepemilikan
- Riwayat reputasi bisnis

3.3 Mendalam (Risiko Tinggi)
- Semua poin tingkat menengah
- Investigasi latar belakang
- Wawancara dengan pihak terkait

4. DOKUMENTASI
Semua hasil uji tuntas harus didokumentasikan dan disimpan minimal 5 tahun.

5. PERSETUJUAN
Hasil uji tuntas harus disetujui oleh Tim FKAP sebelum kerja sama dimulai.`,

    "program-pelatihan": `PROGRAM PELATIHAN SMAP

1. TUJUAN
Memastikan seluruh personel memahami kebijakan dan prosedur anti penyuapan.

2. JENIS PELATIHAN
2.1 Induksi Karyawan Baru
- Durasi: 2 jam
- Materi: Pengenalan kebijakan anti penyuapan
- Wajib dalam 30 hari pertama

2.2 Pelatihan Tahunan
- Durasi: 4 jam
- Materi: Pembaruan kebijakan, studi kasus
- Wajib untuk seluruh karyawan

2.3 Pelatihan Khusus
- Durasi: 8 jam
- Materi: Mendalam sesuai fungsi jabatan
- Untuk posisi berisiko tinggi

3. METODE PELATIHAN
- Tatap muka
- E-learning
- Workshop interaktif

4. EVALUASI
- Pre-test dan post-test
- Skor minimal kelulusan: 80%
- Sertifikat kehadiran

5. DOKUMENTASI
Catatan pelatihan disimpan dalam berkas personel.`,

    "prosedur-pelaporan": `PROSEDUR PELAPORAN WHISTLEBLOWING

1. TUJUAN
Menyediakan mekanisme pelaporan yang aman dan rahasia untuk dugaan pelanggaran anti penyuapan.

2. SALURAN PELAPORAN
- Email: whistleblowing@perusahaan.com
- Hotline: 0800-xxx-xxxx (24 jam)
- Kotak saran anonim
- Laporan langsung ke Tim FKAP

3. PERLINDUNGAN PELAPOR
Organisasi menjamin:
- Kerahasiaan identitas pelapor
- Tidak ada pembalasan atas laporan yang dibuat dengan itikad baik
- Dukungan hukum jika diperlukan

4. PROSES PENANGANAN
4.1 Penerimaan Laporan
- Pencatatan dalam register
- Konfirmasi penerimaan dalam 24 jam

4.2 Investigasi
- Tim investigasi independen
- Waktu penyelesaian maksimal 30 hari

4.3 Tindak Lanjut
- Rekomendasi tindakan
- Pelaporan ke Manajemen Puncak
- Pemberitahuan kepada pelapor

5. KERAHASIAAN
Semua informasi laporan diperlakukan sebagai rahasia.`,
  };

  return templates[type] || `DOKUMEN: ${title}\n\nKonten dokumen akan dibuat berdasarkan data perusahaan dan standar SNI ISO 37001:2016.`;
}
