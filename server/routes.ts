import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateDocumentContent as generateAIContent, generateSMAPDocument } from "./replit_integrations/gemini";
import { AI_PROVIDER_IDS, getProviderMeta } from "@shared/ai-providers";
import { generateDocumentWithProvider, chatWithProvider } from "./lib/ai-providers";
import { encryptSecret, decryptSecret, maskSecret } from "./lib/crypto";
import { setupAuth, registerAuthRoutes, isAuthenticated, authStorage } from "./replit_integrations/auth";
import { industryConfigs } from "@shared/data/industry-configs";
import {
  PEDOMAN_SMAP_STRUCTURE,
  AUDIT_PROGRAM_STRUCTURE,
  CAPA_SOP_STRUCTURE,
  MANAGEMENT_REVIEW_STRUCTURE,
  GUSTAFTA_SMAP_KNOWLEDGE,
  WBS_KEY_REQUIREMENTS,
  SMAP_DOCUMENT_CATALOG,
  SBU_KONSTRUKSI_REQUIREMENTS,
  DOCUMENT_GENERATION_MATRIX,
  BUJK_ASSESSOR_KNOWLEDGE,
  KONSTRUKSI_RISK_PROFILE,
  SMAP_DOCUMENT_FRAMEWORK,
  SMAP_UKM_CONTEXT,
  PANCEK_KNOWLEDGE,
} from "./smap-knowledge";
import { z } from "zod";
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
  insertGeneratedDocumentSchema,
  gustafdaBlueprints,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// AI Request Validation Schemas
const aiGenerateSchema = z.object({
  prompt: z.string().min(1).max(20000),
  model: z.string().max(100).optional(),
});

const saveAiKeySchema = z.object({
  provider: z.enum(AI_PROVIDER_IDS as [string, ...string[]]),
  apiKey: z.string().min(8).max(400),
  model: z.string().max(100).optional(),
});

const smapGenerateSchema = z.object({
  templateType: z.string().min(1).max(200),
  context: z.object({
    companyName: z.string().optional(),
    director: z.string().optional(),
    address: z.string().optional(),
    ketuaFKAP: z.string().optional(),
    additionalInfo: z.string().optional(),
  }).optional(),
});

const mentorChatSchema = z.object({
  message: z.string().min(1).max(5000),
  history: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string()
  })).optional(),
  industryId: z.string().optional()
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup authentication BEFORE other routes
  await setupAuth(app);
  registerAuthRoutes(app);

  // Industry Configuration Routes
  app.get("/api/industries", async (req, res) => {
    try {
      const industries = Object.values(industryConfigs)
        .filter(c => c.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(c => ({
          id: c.id,
          name: c.name,
          shortName: c.shortName,
          tagline: c.tagline,
          description: c.description,
          icon: c.icon,
          color: c.color,
          isActive: c.isActive,
          sortOrder: c.sortOrder,
        }));
      res.json(industries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch industries" });
    }
  });

  app.get("/api/industries/:id", async (req, res) => {
    try {
      const config = industryConfigs[req.params.id];
      if (!config) {
        return res.status(404).json({ error: "Industry not found" });
      }
      res.json(config);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch industry config" });
    }
  });

  app.get("/api/industries/:id/templates", async (req, res) => {
    try {
      const config = industryConfigs[req.params.id];
      if (!config) {
        return res.status(404).json({ error: "Industry not found" });
      }
      
      const category = req.query.category as string | undefined;
      let templates = config.templates;
      
      if (category && category !== "all") {
        templates = templates.filter(t => t.category === category);
      }
      
      res.json({
        templates,
        categories: config.templateCategories,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  app.get("/api/industries/:id/field-map", async (req, res) => {
    try {
      const config = industryConfigs[req.params.id];
      if (!config) {
        return res.status(404).json({ error: "Industry not found" });
      }
      
      // Get actual data from storage to resolve field values
      const company = await storage.getCompany();
      const fkap = await storage.getFkapTeam();
      const management = await storage.getManagement();
      
      const fieldValues: Record<string, string> = {};
      
      for (const binding of config.dataBindings) {
        if (binding.source === "system") {
          if (binding.field === "date") {
            fieldValues[binding.key] = new Date().toLocaleDateString("id-ID", { 
              day: "numeric", month: "long", year: "numeric" 
            });
          } else if (binding.field === "year") {
            fieldValues[binding.key] = new Date().getFullYear().toString();
          }
        } else if (binding.source === "companies" && company) {
          const value = (company as any)[binding.field];
          fieldValues[binding.key] = value || binding.defaultValue || "";
        } else if (binding.source === "fkapTeam" && fkap.length > 0) {
          const ketua = fkap.find(f => f.role?.toLowerCase().includes("ketua"));
          if (ketua) {
            fieldValues[binding.key] = ketua.name || binding.defaultValue || "";
          }
        } else if (binding.source === "management" && management.length > 0) {
          const director = management.find(m => 
            m.position?.toLowerCase().includes("direktur") ||
            m.position?.toLowerCase().includes("director")
          );
          if (director) {
            fieldValues[binding.key] = director.name || binding.defaultValue || "";
          }
        } else {
          fieldValues[binding.key] = binding.defaultValue || "";
        }
      }
      
      res.json({
        bindings: config.dataBindings,
        values: fieldValues,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to resolve field map" });
    }
  });

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

  // Unified Mentor Chat Route (supports multiple industries)
  app.post("/api/mentor/chat", async (req, res) => {
    try {
      const { message, history, industryId } = mentorChatSchema.parse(req.body);

      const getSystemPrompt = (indId: string | undefined) => {
        if (indId === "pancek") {
          return `Anda adalah Pancek Mentor — konsultan AI senior yang ahli dalam Panduan Cegah Korupsi (Panduan CEK) dari KPK Indonesia, Platform Jaga.id, dan implementasi program anti-korupsi korporasi.

PERAN ANDA:
Bertindak seperti konsultan berpengalaman yang membantu korporasi membangun sistem pencegahan korupsi yang memadai — bukan sekadar teori, tapi dokumen nyata yang siap digunakan untuk pengisian kuesioner Jaga.id dan menghadapi verifikasi KPK.

PAKET LAYANAN (3 Fase):
1. Siap Pengisian Kuesioner (Rp 1.500.000/bulan) — persiapkan 18 dokumen Pancek + pengisian kuesioner Jaga.id
2. Siap Terverifikasi (Rp 2.500.000/bulan) — simulasi verifikasi, gap analysis, mock interview
3. Siap Surveilance Pancek (Rp 2.000.000/bulan) — pemeliharaan status terverifikasi, monitoring berkala

GAYA KOMUNIKASI:
- Ramah, direktif, dan solutif — langsung ke poin tanpa basa-basi berlebihan
- Gunakan bahasa Indonesia yang mudah dipahami praktisi bisnis
- Berikan contoh konkret dan konteks hukum yang relevan
- Jika klien belum tahu mulai dari mana → tanyakan 3 pertanyaan diagnostik awal
- Jika klien bertanya dokumen → langsung sebutkan kode kuesioner yang dipenuhinya (K.1, D.6, dll)

${PANCEK_KNOWLEDGE}`;
        }
        
        return `Anda adalah SMAP Mentor, asisten AI senior yang ahli dalam Sistem Manajemen Anti Penyuapan (SMAP) berdasarkan SNI ISO 37001:2016 dan regulasi konstruksi Indonesia.

Tugas Anda:
1. Menjelaskan konsep dan implementasi praktis SMAP dengan kedalaman konsultan berpengalaman
2. Membantu pengguna mempersiapkan dokumentasi, audit internal, dan sertifikasi
3. Menjawab pertanyaan dengan bahasa Indonesia yang mudah dipahami — gunakan contoh nyata
4. Memberikan panduan jalur pemenuhan yang tepat berdasarkan kualifikasi BUJK pengguna
5. Proaktif mengingatkan risiko regulasi, gap dokumen, dan prioritas tindakan

PAKET SMAP (4 Fase Produk Siap):
1. Siap Dokumen SMAP (Rp 2.500.000/bulan) — Persiapan dokumentasi lengkap SNI ISO 37001:2016
2. Siap Audit Internal (Rp 3.500.000/bulan) — Persiapan audit internal dan evaluasi kesesuaian
3. Siap Audit Eksternal (Rp 5.000.000/bulan) — Persiapan sertifikasi SNI ISO 37001:2016
4. Siap Surveilance (Rp 3.000.000/bulan) — Pemeliharaan dan perpanjangan sertifikat

${GUSTAFTA_SMAP_KNOWLEDGE}

${SBU_KONSTRUKSI_REQUIREMENTS}

JALUR PEMENUHAN BERDASARKAN KUALIFIKASI BUJK:
• BUJK Kecil: SMAP Dokumen Self-made (16 komponen wajib) — berlaku penuh sampai 2027
  → Mulai 2027: SMAP menjadi LAMPIRAN WAJIB kuesioner Pancek KPK — investasi dokumen berlanjut
• BUJK Menengah: ISO 37001:2016 via CB terakreditasi ATAU Dokumen SMAP + Pancek KPK
• BUJK Besar: ISO 37001:2016 via CB (sertifikat wajib, bukan dokumen self-made)
• ⚠️ Regulasi: Permen PU 06/2025 ✓ sudah terbit (ganti 08/2022). SK Dirjen 37/2025 ✓ sudah terbit (ganti 144/2022) tapi masih mengacu Permen 08/2022 yang dicabut. SK Dirjen pelaksana Permen 06/2025 BELUM TERBIT. SNI ISO 37001:2016 tetap standar inti yang berlaku.

INTI PENGETAHUAN SMAP (referensi saat menjawab):
• ISO 37001 punya 7 klausul inti (4-10): Konteks, Kepemimpinan (termasuk FKAP), Perencanaan (Register Risiko), Dukungan (Pelatihan, WBS), Operasional (Due Diligence Mitra, Pengendalian Keuangan), Evaluasi (Audit Internal, Tinjauan Manajemen Dewan Pengarah), Perbaikan (CAPA)
• FKAP (Fungsi Kepatuhan Anti Penyuapan) = "jantung" SMAP — setara CCO/Compliance Officer
• 16 komponen dokumen wajib BUJK: Pedoman, Kebijakan AP, SK FKAP, Register Risiko, SOP Due Diligence Personil, SOP Due Diligence Mitra, SOP Pengendalian Keuangan, SOP Non-Finansial, Komitmen AP Mitra, SOP Hadiah & Hospitality, SOP Donasi & Sponsor, SOP WBS, SOP Investigasi, Program Pelatihan, Program Audit Internal, SOP Tinjauan Manajemen
• Dokumen SMAP yang "hidup" = terisi data nyata, bukan template kosong; auditor VACS menguji hal ini

Gaya komunikasi: Ramah namun substantif — berikan jawaban seperti konsultan senior, bukan hanya definisi. Gunakan contoh kasus nyata perusahaan Indonesia. Jika pengguna tanya soal jalur BUJK, langsung arahkan ke paket yang paling relevan.`;
      };

      const SYSTEM_PROMPT = getSystemPrompt(industryId);

      // Use Replit AI Integration (Gemini via Google GenAI SDK)
      const { GoogleGenAI } = await import("@google/genai");
      
      const apiKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
      const baseUrl = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;
      
      if (!apiKey || !baseUrl) {
        return res.status(500).json({ error: "AI Integration tidak dikonfigurasi" });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          apiVersion: "",
          baseUrl,
        },
      });

      const contents = [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "Baik, saya siap menjadi SMAP Mentor untuk membantu Anda." }] },
        ...(history || []).map(m => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }]
        })),
        { role: "user", parts: [{ text: message }] }
      ];

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
      });

      const content = response.text || "Maaf, saya tidak dapat memproses permintaan Anda.";

      res.json({ content });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data" });
      }
      console.error("Chat error:", error);
      res.status(500).json({ error: "Gagal memproses permintaan chat" });
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

  // Generated Documents Routes
  app.get("/api/generated-documents", async (req, res) => {
    try {
      const docs = await storage.getGeneratedDocuments();
      res.json(docs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch generated documents" });
    }
  });

  app.get("/api/generated-documents/:id", async (req, res) => {
    try {
      const doc = await storage.getGeneratedDocument(req.params.id);
      if (!doc) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.json(doc);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch document" });
    }
  });

  app.post("/api/generated-documents", async (req, res) => {
    try {
      const data = insertGeneratedDocumentSchema.parse(req.body);
      const doc = await storage.createGeneratedDocument(data);
      res.status(201).json(doc);
    } catch (error) {
      res.status(400).json({ error: "Invalid document data" });
    }
  });

  app.put("/api/generated-documents/:id", async (req, res) => {
    try {
      const doc = await storage.updateGeneratedDocument(req.params.id, req.body);
      res.json(doc);
    } catch (error) {
      res.status(400).json({ error: "Failed to update document" });
    }
  });

  app.delete("/api/generated-documents/:id", async (req, res) => {
    try {
      await storage.deleteGeneratedDocument(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete document" });
    }
  });

  // Document Templates Routes
  app.get("/api/document-templates", async (req, res) => {
    try {
      const templates = await storage.getDocumentTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  // Clause References Routes
  app.get("/api/clause-references", async (req, res) => {
    try {
      const phase = req.query.phase as string | undefined;
      const refs = phase 
        ? await storage.getClauseReferencesByPhase(phase)
        : await storage.getClauseReferences();
      res.json(refs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch clause references" });
    }
  });

  // Advanced Document Generation
  app.post("/api/generate-smap-document", async (req, res) => {
    try {
      const { templateCode, customData } = req.body;
      const company = await storage.getCompany();
      const management = await storage.getManagement();
      const fkap = await storage.getFkapTeam();
      const vendors = await storage.getVendors();
      
      const documentContent = generateAdvancedDocument(templateCode, {
        company,
        management,
        fkap,
        vendors,
        customData,
      });
      
      const doc = await storage.createGeneratedDocument({
        title: documentContent.title,
        documentNumber: documentContent.documentNumber,
        templateType: templateCode,
        clause: documentContent.clause,
        category: documentContent.category,
        content: documentContent.content,
        status: "draft",
        version: "1.0",
      });
      
      res.status(201).json(doc);
    } catch (error) {
      console.error("Error generating document:", error);
      res.status(400).json({ error: "Failed to generate document" });
    }
  });

  // Gemini AI Document Generation
  // List the current user's saved AI providers (keys are never returned in full)
  app.get("/api/ai/keys", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as { id: string }).id;
      const creds = await storage.getAiCredentials(userId);
      const result = creds.map((c) => {
        let maskedKey = "";
        try {
          maskedKey = maskSecret(decryptSecret(c.apiKey));
        } catch {
          maskedKey = "••••";
        }
        return {
          provider: c.provider,
          model: c.model,
          isActive: c.isActive,
          maskedKey,
        };
      });
      res.json(result);
    } catch (error) {
      console.error("List AI keys error:", error);
      res.status(500).json({ error: "Gagal memuat API key" });
    }
  });

  // Save or update an AI provider key for the current user
  app.post("/api/ai/keys", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as { id: string }).id;
      const validated = saveAiKeySchema.parse(req.body);
      const encrypted = encryptSecret(validated.apiKey.trim());
      const model = validated.model?.trim() || getProviderMeta(validated.provider)?.defaultModel || null;
      const cred = await storage.upsertAiCredential(userId, validated.provider, encrypted, model);
      res.json({ provider: cred.provider, model: cred.model, isActive: cred.isActive });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Data tidak valid", details: error.errors });
      }
      console.error("Save AI key error:", error);
      res.status(500).json({ error: "Gagal menyimpan API key" });
    }
  });

  // Set the active provider used for generation
  app.post("/api/ai/keys/:provider/activate", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as { id: string }).id;
      const { provider } = req.params;
      const creds = await storage.getAiCredentials(userId);
      if (!creds.some((c) => c.provider === provider)) {
        return res.status(404).json({ error: "Provider belum memiliki API key" });
      }
      await storage.setActiveAiCredential(userId, provider);
      res.json({ success: true });
    } catch (error) {
      console.error("Activate AI key error:", error);
      res.status(500).json({ error: "Gagal mengaktifkan provider" });
    }
  });

  // Remove a provider key
  app.delete("/api/ai/keys/:provider", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as { id: string }).id;
      await storage.deleteAiCredential(userId, req.params.provider);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete AI key error:", error);
      res.status(500).json({ error: "Gagal menghapus API key" });
    }
  });

  app.post("/api/ai/generate", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as { id: string }).id;
      const validated = aiGenerateSchema.parse(req.body);

      const cred = await storage.getActiveAiCredential(userId);
      if (!cred) {
        return res.status(400).json({
          error: "Belum ada API key AI yang aktif. Tambahkan API key Anda di menu Pengaturan AI.",
          code: "NO_AI_KEY",
        });
      }

      const apiKey = decryptSecret(cred.apiKey);
      const content = await generateDocumentWithProvider({
        provider: cred.provider,
        apiKey,
        model: validated.model || cred.model,
        prompt: validated.prompt,
      });
      res.json({ content, provider: cred.provider, model: validated.model || cred.model });
    } catch (error) {
      console.error("AI generation error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request", details: error.errors });
      }
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to generate content" 
      });
    }
  });

  app.post("/api/ai/generate-smap", async (req, res) => {
    try {
      const validated = smapGenerateSchema.parse(req.body);
      
      // Get company data for context if not provided
      let enrichedContext = validated.context || {};
      if (!enrichedContext.companyName) {
        try {
          const company = await storage.getCompany();
          if (company) {
            enrichedContext.companyName = company.name;
            enrichedContext.director = company.directorName || undefined;
            enrichedContext.address = company.address || undefined;
          }
          
          const fkap = await storage.getFkapTeam();
          const ketua = fkap.find((f: any) => f.role === "Ketua FKAP");
          if (ketua) {
            enrichedContext.ketuaFKAP = ketua.name;
          }
        } catch (storageError) {
          console.warn("Failed to fetch company context:", storageError);
        }
      }
      
      const content = await generateSMAPDocument(validated.templateType, enrichedContext);
      res.json({ content, templateType: validated.templateType });
    } catch (error) {
      console.error("SMAP AI generation error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request", details: error.errors });
      }
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to generate SMAP document" 
      });
    }
  });

  // Help Chat AI - answers questions about app usage and features
  const helpChatSchema = z.object({
    message: z.string().min(1).max(5000),
    history: z.array(z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string()
    })).optional(),
  });

  app.post("/api/ai/help-chat", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as { id: string }).id;
      const validated = helpChatSchema.parse(req.body);
      
      const systemPrompt = `Anda adalah Help Bot untuk Compliance Hub — Platform Generator Dokumen Kepatuhan Multi-Industri untuk bisnis Indonesia.

Fitur utama yang tersedia:
1. Dashboard SMAP & Pancek — ringkasan data perusahaan, statistik kepatuhan
2. Profil Perusahaan — input data perusahaan untuk mengisi template dokumen
3. Prompt Generator Dokumen — pilih template, salin prompt, tempel di Gemini/Qwen/ChatGPT untuk mendapatkan dokumen lengkap (gratis)
4. PDCA Generator — generate dokumen SMAP berdasarkan 51 klausul ISO 37001
5. Referensi SMAP — 46 dokumen referensi standar SMAP
6. Template Repository — 270+ template dokumen SMAP
7. Produk Siap SMAP — panduan 4 fase implementasi SMAP
8. Pengaturan AI — simpan API key Gemini/Qwen/OpenAI untuk fitur tambahan
9. Tombol ✦ kiri bawah — pilih AI (Gemini/Qwen) untuk tanya langsung

Industri yang aktif: SMAP (SNI ISO 37001:2016) dan Pancek (Panduan KPK).

Cara pakai Prompt Generator:
- Buka "Document Builder" di sidebar
- Pilih template dokumen
- Salin prompt yang muncul → tempel di Gemini atau Qwen
- Dokumen lengkap siap dihasilkan oleh AI

Berikan jawaban singkat, jelas, dan membantu dalam Bahasa Indonesia. Jika ditanya soal teknis compliance SMAP/Pancek, jawab berdasarkan SNI ISO 37001:2016 dan panduan KPK.`;

      const history = (validated.history || []).map((h) => ({
        role: h.role === "user" ? ("user" as const) : ("assistant" as const),
        content: h.content,
      }));

      // Use app's own Gemini key first, fall back to user's saved key
      const appGeminiKey = process.env.GEMINI_API_KEY;
      let provider = "gemini";
      let apiKey = appGeminiKey || "";
      let model: string | null = "gemini-2.5-flash";

      if (!appGeminiKey) {
        const cred = await storage.getActiveAiCredential(userId);
        if (!cred) {
          return res.json({
            response:
              "Chatbot AI sedang tidak tersedia. Silakan hubungi admin atau coba lagi nanti.",
          });
        }
        provider = cred.provider;
        apiKey = decryptSecret(cred.apiKey);
        model = cred.model;
      }

      const response = await chatWithProvider({
        provider,
        apiKey,
        model,
        systemPrompt,
        history,
        message: validated.message,
      });

      res.json({ response });
    } catch (error) {
      console.error("Help chat error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request", details: error.errors });
      }
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to process help request" 
      });
    }
  });

  // Helpdesk Chat with Knowledge Base - Streaming endpoint
  const helpdeskChatSchema = z.object({
    message: z.string().min(1).max(5000),
    industry: z.string().optional(),
  });

  app.post("/api/helpdesk/chat", async (req, res) => {
    try {
      const validated = helpdeskChatSchema.parse(req.body);
      
      const systemPrompt = `Anda adalah Asisten Kepatuhan (Compliance Assistant) untuk platform Compliance Hub Indonesia.

TENTANG PLATFORM:
Compliance Hub adalah platform manajemen kepatuhan untuk bisnis Indonesia yang mencakup 20 industri, diorganisir dalam 5 Domain Kepatuhan utama:

1. LEGALITAS - Dokumen dasar hukum perusahaan
   - Akta Pendirian: Dokumen notaris pendirian badan usaha
   - NIB (Nomor Induk Berusaha): Identitas pelaku usaha melalui OSS
   - NPWP: Nomor Pokok Wajib Pajak perusahaan
   - TDP: Tanda Daftar Perusahaan (terintegrasi NIB)
   - Domisili: Surat Keterangan Domisili
   - PKP: Status Pengusaha Kena Pajak

2. PERIJINAN - Izin operasional dan sektoral
   - SBU: Sertifikat Badan Usaha (konstruksi)
   - SIUP: Surat Izin Usaha Perdagangan
   - IUPTL: Izin Usaha Penyediaan Tenaga Listrik
   - Izin Lingkungan, Izin Operasional, Izin Lokasi

3. SERTIFIKASI - Standar nasional/internasional
   - ISO 9001: Sistem Manajemen Mutu
   - ISO 14001: Sistem Manajemen Lingkungan
   - ISO 45001: Sistem Manajemen K3
   - SNI ISO 37001: Sistem Manajemen Anti Penyuapan (SMAP)
   - SKK: Sertifikat Kompetensi Kerja (menggantikan SKA/SKT)
   - SKTTK: Sertifikat Keterampilan Tenaga Teknik Ketenagalistrikan

4. TENDER - Dokumen pengadaan barang/jasa
   - Dokumen Kualifikasi, Proposal Teknis, RAB
   - Jaminan Penawaran, Kontrak/SPK, TKDN

5. OPERASIONAL - Dokumen kerja harian
   - SOP, Instruksi Kerja, Formulir Operasional
   - Laporan Berkala, Checklist QC, Laporan HSE

FITUR PLATFORM:
- Dashboard: Ringkasan status kepatuhan dan statistik
- Repository Template: 270+ template dokumen SMAP dan multi-industri
- Document Builder: Generate dokumen dengan bantuan AI
- PDCA Generator: 51 klausul ISO 37001 dengan bantuan AI
- Profil Perusahaan: Data master pegawai, proyek, vendor
- Knowledge Base: Pusat informasi kepatuhan dan regulasi

CATATAN PENTING KONSTRUKSI:
- SKA/SKT sudah digantikan oleh SKK (Sertifikat Kompetensi Kerja)
- SIUJK sudah digantikan oleh NIB (Nomor Induk Berusaha) melalui OSS

INDUSTRI YANG DIDUKUNG:
SMAP, Pancek, Konstruksi, Energi, Migas, Lingkungan, UMKM, ISO, K3, Tender, Keuangan, Kesehatan, Pendidikan, Teknologi, Pertanian, Manufaktur, Properti, Logistik, Pariwisata, Telekomunikasi

PANDUAN MENJAWAB:
1. Jawab dengan bahasa Indonesia yang jelas dan profesional
2. Berikan informasi yang akurat tentang regulasi Indonesia
3. Jelaskan cara menggunakan fitur platform jika ditanya
4. Arahkan ke fitur yang relevan dalam platform
5. Untuk pertanyaan spesifik regulasi, sarankan konsultasi dengan ahli

${validated.industry ? `Konteks industri saat ini: ${validated.industry}` : ''}`;

      // Check API key before starting SSE
      const apiKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: "AI tidak tersedia. Hubungi administrator." 
        });
      }

      // Set up SSE
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const { GoogleGenAI } = await import("@google/genai");
      const genAI = new GoogleGenAI({
        apiKey,
        httpOptions: {
          apiVersion: "",
          baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL || "",
        },
      });

      const stream = await genAI.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: [
          { role: "user", parts: [{ text: systemPrompt }] },
          { role: "model", parts: [{ text: "Saya siap membantu Anda dengan pertanyaan tentang platform Compliance Hub dan kepatuhan bisnis di Indonesia." }] },
          { role: "user", parts: [{ text: validated.message }] },
        ],
      });

      for await (const chunk of stream) {
        const content = chunk.text || "";
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error("Helpdesk chat error:", error);
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "Terjadi kesalahan. Silakan coba lagi." })}\n\n`);
        res.end();
      } else {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ error: "Invalid request", details: error.errors });
        }
        res.status(500).json({ 
          error: error instanceof Error ? error.message : "Failed to process helpdesk request" 
        });
      }
    }
  });

  // ============ GUSTAFTA DIALOG ROUTES ============

  // POST /api/gustafta/chat - SSE streaming Socratic dialogue
  app.post("/api/gustafta/chat", isAuthenticated, async (req, res) => {
    try {
      const schema = z.object({
        messages: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        })),
        companyName: z.string().optional(),
        mode: z.enum(["smap", "pancek"]).optional().default("smap"),
      });
      const validated = schema.parse(req.body);

      const apiKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "AI tidak tersedia. Hubungi administrator." });
      }

      if (validated.mode === "pancek") {
        const PANCEK_DIALOG_PROMPT = `Anda adalah GUSTAFTA PANCEK — fasilitator dialog Socratic khusus untuk pemetaan kesiapan implementasi Panduan Cegah Korupsi (Panduan CEK) KPK dan persiapan pengisian kuesioner Jaga.id.

MISI ANDA:
Menggali profil perusahaan, kondisi dokumen existing, dan gap kesiapan Pancek melalui dialog reflektif — menghasilkan Blueprint Pancek yang dipersonalisasi.

CARA BERDIALOG:
- Satu pertanyaan per giliran — konkret dan langsung ke poin
- Respons: 1-2 kalimat afirmasi + 1 pertanyaan lanjutan
- Nada: hangat, supportif, tidak menghakimi
- Ingatkan bahwa Pancek bisa diselesaikan dalam 4-6 minggu

6 AREA YANG HARUS DIGALI (secara natural):
1. PROFIL PERUSAHAAN — jenis badan usaha (BUMN/BUJK Konstruksi/Swasta), jumlah karyawan, kota, bidang usaha
2. TIPE BADAN USAHA — BUMN (ada kewajiban lebih ketat re: gratifikasi), BUJK (ada overlay SE PUPR 21/2021 + Permen 06/2025, wajib Pancek 2027), atau Swasta umum
3. FUNGSI KEPATUHAN — sudah ada unit/orang yang ditunjuk? Ada SK-nya? Apa jabatan dan latar belakangnya? Ada sertifikat API/CCO/auditor?
4. DOKUMEN EXISTING — dari 18 dokumen Pancek, mana yang sudah ada? (Deklarasi? Kebijakan AK? Pakta Integritas? Risk Register? SOP WBS? SK Fungsi Kepatuhan?)
5. RISIKO KORUPSI — proses bisnis mana yang paling berisiko? (tender, pengadaan, perizinan, pembayaran?) Sudah pernah diidentifikasi secara formal?
6. TARGET JAGA.ID — sudah pernah mendaftar di Jaga.id? Target verifikasi kapan? Ada tekanan dari klien/tender untuk Pancek?

${PANCEK_KNOWLEDGE}

ALUR DIALOG:
- Mulai: sapaan + tanya profil perusahaan (jenis badan usaha + jumlah karyawan + bidang usaha)
- Jika BUJK Konstruksi: tekankan bahwa Pancek wajib 2027 dan dokumen SMAP yang ada akan dipakai sebagai lampiran
- Jika BUMN: tekankan kewajiban lebih ketat (gratifikasi wajib, dana politik dilarang)
- Setelah 8-12 pertukaran: "Terima kasih! Saya sudah mendapat gambaran yang cukup untuk menyusun Blueprint Pancek Anda. Silakan klik **Generate Blueprint Pancek** untuk mendapatkan peta jalan implementasi yang dipersonalisasi."

${validated.companyName ? `PERUSAHAAN: ${validated.companyName}` : ''}

Gunakan bahasa Indonesia yang natural dan profesional.`;

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        const { GoogleGenAI } = await import("@google/genai");
        const genAI = new GoogleGenAI({
          apiKey,
          httpOptions: { apiVersion: "", baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL || "" },
        });

        const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [
          { role: "user", parts: [{ text: PANCEK_DIALOG_PROMPT }] },
          { role: "model", parts: [{ text: "Siap. Saya akan memulai dialog untuk memetakan kesiapan Pancek KPK perusahaan Anda." }] },
        ];
        for (const msg of validated.messages) {
          contents.push({ role: msg.role === "assistant" ? "model" : "user", parts: [{ text: msg.content }] });
        }
        const stream = await genAI.models.generateContentStream({ model: "gemini-2.5-flash", contents });
        for await (const chunk of stream) {
          const content = chunk.text || "";
          if (content) res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
        return;
      }

      const GUSTAFTA_PROMPT = `Anda adalah GUSTAFTA — fasilitator dialog Socratic khusus untuk pemetaan kebutuhan Sistem Manajemen Anti Penyuapan (SMAP) berdasarkan SNI ISO 37001:2016.

MISI ANDA:
Menggali profil, potensi, dan kebutuhan SMAP perusahaan melalui dialog reflektif, bukan ceramah atau penjelasan panjang.

CARA BERDIALOG:
- Satu pertanyaan per giliran — jangan bombardir dengan banyak pertanyaan sekaligus
- Respons singkat: 2-3 kalimat konteks/afirmasi + 1 pertanyaan
- Gunakan jawaban sebelumnya untuk memperdalam dengan pertanyaan lanjutan yang relevan
- Jika jawaban kurang jelas, pancing dengan pertanyaan klarifikasi
- Nada: hangat, profesional, tidak menghakimi

7 AREA YANG HARUS DIGALI (secara natural):
1. Profil Organisasi — jenis badan usaha (PT/CV/BUMN/Yayasan), skala, jumlah karyawan, struktur (ada Dewan Komisaris?)
2. Bidang Usaha & Eksposur Risiko — sektor bisnis, proyek pemerintah, tender/lelang, pengurusan izin, interaksi pejabat
3. Status SBU & Kualifikasi — KHUSUS jika perusahaan konstruksi: apakah punya SBU? Kualifikasi Kecil/Menengah/Besar? Kapan SBU terbit? Sudah ada Surat Pernyataan Komitmen SMAP ke LSBU? (Ini menentukan urgensi dan deadline nyata)
4. Kondisi Dokumen Eksisting — kebijakan anti penyuapan, FKAP, SOP terkait, sistem manajemen ISO yang sudah ada, apakah sudah ada Dokumen SMAP atau ISO 37001 Cert?
5. SDM & Kompetensi — siapa calon Ketua FKAP, apakah ada tim compliance, pelatihan anti penyuapan, WBS anonim
6. Komitmen Pimpinan — dukungan Direktur, apakah Dewan Komisaris (Dewan Pengarah) aktif terlibat
7. Target & Timeline — tujuan (sertifikasi ISO 37001/SBU/tender/regulasi KPK), deadline riil (termasuk deadline SBU jika konstruksi), anggaran implementasi

${GUSTAFTA_SMAP_KNOWLEDGE}

${BUJK_ASSESSOR_KNOWLEDGE}

${SMAP_UKM_CONTEXT}

ALUR DIALOG:
- Mulai dengan sapaan singkat dan pertanyaan tentang profil perusahaan
- Jika teridentifikasi perusahaan KONSTRUKSI, gali Area 3 (SBU) lebih dalam — ini menentukan urgency nyata
- Jika klien tampak overwhelmed atau baru pertama kali, gunakan pendekatan empati dari SMAP_UKM_CONTEXT — normalkan perasaan mereka, tunjukkan bahwa ada jalur yang terjangkau
- Jelajahi area secara natural mengikuti alur percakapan
- Setelah semua area tergali (sekitar 10-15 pertukaran), tutup dengan:
  "Terima kasih atas informasinya. Saya sudah mendapat gambaran yang cukup komprehensif untuk menyusun Blueprint SMAP Anda. Silakan klik tombol **Generate Blueprint** untuk mendapatkan peta jalan implementasi yang dipersonalisasi."

${validated.companyName ? `PERUSAHAAN: ${validated.companyName}` : ''}

Gunakan bahasa Indonesia yang natural dan profesional.`;

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const { GoogleGenAI } = await import("@google/genai");
      const genAI = new GoogleGenAI({
        apiKey,
        httpOptions: {
          apiVersion: "",
          baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL || "",
        },
      });

      // Build conversation history for Gemini (must alternate user/model)
      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [
        { role: "user", parts: [{ text: GUSTAFTA_PROMPT }] },
        { role: "model", parts: [{ text: "Siap. Saya akan memulai dialog Gustafta untuk memetakan kebutuhan SMAP perusahaan Anda." }] },
      ];

      for (const msg of validated.messages) {
        contents.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        });
      }

      const stream = await genAI.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents,
      });

      for await (const chunk of stream) {
        const content = chunk.text || "";
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error("Gustafta chat error:", error);
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "Terjadi kesalahan. Silakan coba lagi." })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: "Failed to process Gustafta dialog" });
      }
    }
  });

  // POST /api/gustafta/blueprint - Generate structured SMAP blueprint
  app.post("/api/gustafta/blueprint", isAuthenticated, async (req, res) => {
    try {
      const schema = z.object({
        messages: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        })),
        companyName: z.string().optional(),
      });
      const validated = schema.parse(req.body);

      const apiKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "AI tidak tersedia." });
      }

      const conversationText = validated.messages
        .map(m => `${m.role === "user" ? "Perusahaan" : "Gustafta"}: ${m.content}`)
        .join("\n\n");

      const blueprintPrompt = `Anda adalah analis SMAP senior yang berpengalaman mendampingi implementasi SNI ISO 37001:2016 dan pembangunan SBU Jasa Konstruksi (BUJK). Berdasarkan dialog Socratic berikut, susun Blueprint Implementasi SMAP dalam format JSON terstruktur.

KATALOG DOKUMEN SMAP RESMI (gunakan nama-nama ini untuk dokumenPrioritas):
Pedoman: ${SMAP_DOCUMENT_CATALOG.pedoman.map(d => `"${d.nama}" (${d.klausul})`).join(", ")}
Kebijakan: ${SMAP_DOCUMENT_CATALOG.kebijakan.map(d => `"${d.nama}" (${d.klausul})`).join(", ")}
Operasional: ${SMAP_DOCUMENT_CATALOG.operasional.map(d => `"${d.nama}" (${d.klausul})`).join(", ")}
Audit: ${SMAP_DOCUMENT_CATALOG.audit.map(d => `"${d.nama}" (${d.klausul})`).join(", ")}
Tinjauan: ${SMAP_DOCUMENT_CATALOG.tinjauan.map(d => `"${d.nama}" (${d.klausul})`).join(", ")}
Pelatihan: ${SMAP_DOCUMENT_CATALOG.pelatihan.map(d => `"${d.nama}" (${d.klausul})`).join(", ")}

FRAMEWORK KATEGORISASI DOKUMEN (16 Perencanaan + 6 Pelaksanaan):
${SMAP_DOCUMENT_FRAMEWORK}

KONTEKS UKM — pain points dan timeline realistis:
${SMAP_UKM_CONTEXT}

ATURAN JALUR COMPLIANCE BUJK (PER 2025) — jika perusahaan bergerak di jasa konstruksi:
- BUJK Besar: max 1 tahun dari SBU terbit → TARGET: Sertifikat ISO 37001:2016 dari CB terakreditasi KAN
- BUJK Menengah: TARGET: ISO 37001:2016 atau Pancek KPK (Jaga.id) — dokumen SMAP wajib sebagai dasar
- BUJK Kecil: SMAP masih RELEVAN DAN BERLAKU penuh saat ini → sebelum 2027 fokus pada dokumen SMAP
  (Catatan untuk Kecil: mulai 2027 Pancek KPK wajib, tapi dokumen SMAP yang dibuat sekarang akan dipakai sebagai lampiran Pancek KPK — investasi berlanjut)
- Regulasi: Permen PU 06/2025 ✓ sudah terbit (ganti 08/2022). SK Dirjen 37/2025 ✓ sudah terbit (ganti 144/2022) tapi masih mengacu Permen 08/2022 yang dicabut. SK Dirjen pelaksana Permen 06/2025 BELUM TERBIT per Juni 2026.
- Sebutkan jalur yang tepat berdasarkan kualifikasi, dan untuk Kecil: sampaikan roadmap 2025→2027

DIALOG:
${conversationText}

Hasilkan HANYA JSON murni (tanpa markdown, tanpa teks tambahan):
{
  "profilRisiko": {
    "level": "Rendah|Sedang|Tinggi|Sangat Tinggi",
    "skor": <angka 1-10>,
    "faktorUtama": ["faktor1 spesifik dari dialog", "faktor2", "faktor3"]
  },
  "kondisiEksisting": {
    "kekuatan": ["kekuatan1 berdasarkan dialog", "kekuatan2"],
    "kelemahan": ["kelemahan1 berdasarkan dialog", "kelemahan2"],
    "peluang": ["peluang1 spesifik untuk industri ini", "peluang2"]
  },
  "infoSBU": {
    "adaSBU": true,
    "kualifikasi": "Kecil|Menengah|Besar|null",
    "deadlineSMAP": "X tahun sejak SBU terbit (Besar=1th, Menengah=2th, Kecil=3th) atau null jika bukan konstruksi",
    "statusPemenuhan": "Sertifikat ISO 37001|Dokumen SMAP|Surat Pernyataan|Belum Ada|Tidak Relevan"
  },
  "dokumenPrioritas": [
    { "nama": "nama dokumen dari katalog di atas", "klausul": "ISO 37001:2016 Klausul X.X", "prioritas": "Kritis" },
    { "nama": "nama dokumen dari katalog di atas", "klausul": "ISO 37001:2016 Klausul X.X", "prioritas": "Kritis" },
    { "nama": "nama dokumen dari katalog di atas", "klausul": "ISO 37001:2016 Klausul X.X", "prioritas": "Tinggi" },
    { "nama": "nama dokumen dari katalog di atas", "klausul": "ISO 37001:2016 Klausul X.X", "prioritas": "Tinggi" },
    { "nama": "nama dokumen dari katalog di atas", "klausul": "ISO 37001:2016 Klausul X.X", "prioritas": "Tinggi" },
    { "nama": "nama dokumen dari katalog di atas", "klausul": "ISO 37001:2016 Klausul X.X", "prioritas": "Sedang" },
    { "nama": "nama dokumen dari katalog di atas", "klausul": "ISO 37001:2016 Klausul X.X", "prioritas": "Sedang" },
    { "nama": "nama dokumen dari katalog di atas", "klausul": "ISO 37001:2016 Klausul X.X", "prioritas": "Sedang" }
  ],
  "rekomendasiFase": {
    "fase": "Siap Dokumen SMAP|Siap Audit Internal|Siap Audit Eksternal|Siap Surveilance",
    "alasan": "penjelasan singkat 2-3 kalimat mengapa fase ini direkomendasikan — sertakan urgensi SBU jika konstruksi",
    "estimasiWaktu": "X-Y bulan"
  },
  "roadmap": [
    { "periode": "Bulan 1-2", "kegiatan": "deskripsi kegiatan utama" },
    { "periode": "Bulan 3-4", "kegiatan": "deskripsi kegiatan utama" },
    { "periode": "Bulan 5-6", "kegiatan": "deskripsi kegiatan utama" },
    { "periode": "Bulan 7-8", "kegiatan": "deskripsi kegiatan utama" }
  ],
  "kesimpulan": "paragraf kesimpulan 3-4 kalimat yang merangkum kondisi perusahaan dan langkah selanjutnya — jika BUJK, sebutkan deadline SBU secara eksplisit",
  "namaPerusahaan": "${validated.companyName || 'Perusahaan'}"
}

Pastikan rekomendasi realistis sesuai informasi yang digali dari dialog. Jika informasi kurang, buat asumsi yang reasonable dan sebutkan dalam kesimpulan.`;

      const { GoogleGenAI } = await import("@google/genai");
      const genAI = new GoogleGenAI({
        apiKey,
        httpOptions: {
          apiVersion: "",
          baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL || "",
        },
      });

      const response = await genAI.models.generateContent({
        model: "gemini-2.5-pro",
        contents: [{ role: "user", parts: [{ text: blueprintPrompt }] }],
      });

      const rawText = response.text || "";
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return res.status(500).json({ error: "Gagal menghasilkan blueprint. Coba lagi." });
      }

      const blueprint = JSON.parse(jsonMatch[0]);
      res.json({ blueprint });
    } catch (error) {
      console.error("Gustafta blueprint error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to generate blueprint" });
    }
  });

  // POST /api/gustafta/blueprint/save - persist blueprint from Dialog
  app.post("/api/gustafta/blueprint/save", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id as string;
      const { blueprint } = req.body;
      if (!blueprint) return res.status(400).json({ error: "Blueprint required" });
      await db.insert(gustafdaBlueprints).values({
        userId,
        companyName: blueprint.namaPerusahaan || null,
        riskLevel: blueprint.profilRisiko?.level || null,
        riskScore: blueprint.profilRisiko?.skor || null,
        recommendedPhase: blueprint.rekomendasiFase?.fase || null,
        priorityDocs: blueprint.dokumenPrioritas || null,
        blueprintJson: blueprint,
      });
      res.json({ success: true });
    } catch (error) {
      console.error("Save blueprint error:", error);
      res.status(500).json({ error: "Failed to save blueprint" });
    }
  });

  // GET /api/gustafta/blueprint/latest - load latest blueprint for user
  app.get("/api/gustafta/blueprint/latest", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id as string;
      const result = await db
        .select()
        .from(gustafdaBlueprints)
        .where(eq(gustafdaBlueprints.userId, userId))
        .orderBy(desc(gustafdaBlueprints.createdAt))
        .limit(1);
      if (result.length === 0) return res.json({ blueprint: null });
      res.json({ blueprint: result[0].blueprintJson, meta: {
        companyName: result[0].companyName,
        riskLevel: result[0].riskLevel,
        riskScore: result[0].riskScore,
        recommendedPhase: result[0].recommendedPhase,
        priorityDocs: result[0].priorityDocs,
        savedAt: result[0].createdAt,
      }});
    } catch (error) {
      console.error("Load blueprint error:", error);
      res.status(500).json({ error: "Failed to load blueprint" });
    }
  });

  // POST /api/gustafta/pancek-blueprint - Generate Pancek KPK blueprint
  app.post("/api/gustafta/pancek-blueprint", isAuthenticated, async (req, res) => {
    try {
      const schema = z.object({
        messages: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        })),
        companyName: z.string().optional(),
      });
      const validated = schema.parse(req.body);

      const apiKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
      if (!apiKey) return res.status(500).json({ error: "AI tidak tersedia." });

      const conversationText = validated.messages
        .map(m => `${m.role === "user" ? "Perusahaan" : "Gustafta"}: ${m.content}`)
        .join("\n\n");

      const pancekBlueprintPrompt = `Anda adalah konsultan Pancek KPK senior berpengalaman mendampingi implementasi Panduan Cegah Korupsi (Panduan CEK) KPK dan pengisian kuesioner Jaga.id. Berdasarkan dialog berikut, susun Blueprint Pancek dalam format JSON.

KONTEKS PANCEK:
${PANCEK_KNOWLEDGE}

DIALOG:
${conversationText}

Hasilkan HANYA JSON murni (tanpa markdown, tanpa teks tambahan):
{
  "tipeBadanUsaha": "BUMN|BUJK Konstruksi|Swasta Umum",
  "jumlahKaryawan": <angka atau 0 jika tidak disebutkan>,
  "profilRisiko": {
    "level": "Rendah|Sedang|Tinggi|Sangat Tinggi",
    "skor": <angka 1-10>,
    "faktorUtama": ["faktor risiko korupsi spesifik dari dialog 1", "faktor 2", "faktor 3"]
  },
  "kondisiEksisting": {
    "dokumenAda": ["dokumen yang sudah dimiliki berdasarkan dialog"],
    "dokumenBelum": ["dokumen Pancek yang belum ada"],
    "kekuatan": ["kekuatan berdasarkan dialog"],
    "gap": ["gap utama yang harus diprioritaskan"]
  },
  "skorKesiapan": {
    "komitmen": <angka 0-100>,
    "perencanaan": <angka 0-100>,
    "pelaksanaan": <angka 0-100>,
    "evaluasi": <angka 0-100>,
    "perbaikan": <angka 0-100>,
    "total": <rata-rata dari 5 dimensi di atas>
  },
  "dokumenPrioritas": [
    { "kode": "K.1", "nama": "Deklarasi Komitmen Anti-Korupsi", "prioritas": "Kritis" },
    { "kode": "K.2", "nama": "Pakta Integritas Manajemen", "prioritas": "Kritis" },
    { "kode": "K.3-K.5", "nama": "Kebijakan Anti-Korupsi Komprehensif", "prioritas": "Kritis" },
    { "kode": "K.6", "nama": "SK & SOP Fungsi Kepatuhan", "prioritas": "Tinggi" },
    { "kode": "P.1-P.3", "nama": "Register Risiko Korupsi", "prioritas": "Tinggi" },
    { "kode": "D.6", "nama": "SOP Whistleblowing System", "prioritas": "Tinggi" },
    { "kode": "D.1", "nama": "Klausul Anti-Korupsi dalam Kontrak", "prioritas": "Sedang" },
    { "kode": "C.1", "nama": "Piagam Audit & Rencana M&E", "prioritas": "Sedang" }
  ],
  "rekomendasiFase": {
    "fase": "Siap Pengisian Kuesioner|Siap Terverifikasi|Siap Surveilance Pancek",
    "alasan": "penjelasan 2-3 kalimat mengapa fase ini direkomendasikan",
    "estimasiWaktu": "X-Y minggu"
  },
  "roadmap": [
    { "periode": "Minggu 1-2", "fokus": "Komitmen & Kebijakan", "kegiatan": "detail kegiatan" },
    { "periode": "Minggu 3-4", "fokus": "Fungsi Kepatuhan & Risiko", "kegiatan": "detail" },
    { "periode": "Minggu 5-6", "fokus": "Prosedur & WBS", "kegiatan": "detail" },
    { "periode": "Minggu 7-8", "fokus": "Pengisian Kuesioner Jaga.id", "kegiatan": "detail" }
  ],
  "kesimpulan": "paragraf 3-4 kalimat merangkum kondisi perusahaan, gap utama, dan langkah konkret pertama yang harus dilakukan",
  "namaPerusahaan": "${validated.companyName || 'Perusahaan'}"
}

Sesuaikan dokumenPrioritas berdasarkan kondisi perusahaan dari dialog (dokumen yang sudah ada tidak perlu jadi prioritas Kritis). Jika info kurang, buat asumsi reasonable dan sebutkan di kesimpulan.`;

      const { GoogleGenAI } = await import("@google/genai");
      const genAI = new GoogleGenAI({
        apiKey,
        httpOptions: { apiVersion: "", baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL || "" },
      });

      const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: pancekBlueprintPrompt }] }],
      });

      const rawText = response.text || "";
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in response");
      const blueprint = JSON.parse(jsonMatch[0]);

      // Auto-save to gustafda_blueprints table
      try {
        const userId = (req.user as any).id as string;
        await db.insert(gustafdaBlueprints).values({
          userId,
          companyName: blueprint.namaPerusahaan || null,
          riskLevel: blueprint.profilRisiko?.level || null,
          riskScore: blueprint.profilRisiko?.skor || null,
          recommendedPhase: blueprint.rekomendasiFase?.fase || null,
          priorityDocs: blueprint.dokumenPrioritas || null,
          blueprintJson: { ...blueprint, mode: "pancek" },
        });
      } catch (saveErr) {
        console.error("Auto-save pancek blueprint error:", saveErr);
      }

      res.json({ blueprint });
    } catch (error) {
      console.error("Pancek blueprint error:", error);
      res.status(500).json({ error: "Gagal generate Blueprint Pancek." });
    }
  });

  // POST /api/gustafta/subagent - SSE streaming for specialized sub-agents
  app.post("/api/gustafta/subagent", isAuthenticated, async (req, res) => {
    try {
      const schema = z.object({
        messages: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        })),
        agentKey: z.string(),
        subAgentKey: z.string(),
        companyName: z.string().optional(),
        companyContext: z.string().optional(),
      });
      const validated = schema.parse(req.body);

      const apiKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
      if (!apiKey) return res.status(500).json({ error: "AI tidak tersedia." });

      const ctx = `${validated.companyName ? `\nPERUSAHAAN: ${validated.companyName}` : ""}${validated.companyContext ? `\nKONTEKS: ${validated.companyContext}` : ""}`;

      const SUB_AGENT_PROMPTS: Record<string, string> = {
        // ─── AGEN DOKUMEN ────────────────────────────────────────────
        dokumen_pedoman: `Anda adalah SUB-AGEN PEDOMAN SMAP dari tim Gustafta Collab. Spesialisasi TUNGGAL: menghasilkan draf Pedoman SMAP (Manual ABMS) lengkap sesuai SNI ISO 37001:2016 — berdasarkan struktur yang telah diverifikasi dari 4 dokumen perusahaan riil (CV Sitiotio Mandiri, PT Kharisma Bina Konstruksi, PT Najah Tejo Abadi, CV Nabeel Isoresh Nusantara).

OUTPUT UTAMA: Draf Pedoman SMAP 35-67 halaman, siap digunakan dan siap dinilai LSBU/CB, disesuaikan penuh dengan profil perusahaan.

${PEDOMAN_SMAP_STRUCTURE}

PENDEKATAN GENERATE:
1. Gunakan informasi dari konteks Blueprint jika tersedia (nama perusahaan, bidang usaha, kota, personil FKAP, tanggal)
2. Jika belum lengkap, tanya:
   - Nama perusahaan + jenis usaha (konstruksi/jasa/manufaktur/lainnya)
   - Kota domisili
   - Nama Direktur + nama Ketua FKAP (dan anggota FKAP lainnya jika ada)
   - Jumlah karyawan (estimasi)
   - Tanggal berlaku dokumen
   - Preferensi pola: Pola A (langsung Klausul 1) atau Pola B (ada Bab Pendahuluan & Tujuan)
3. Generate bagian demi bagian secara urut — mulai dari BAGIAN MUKA (halaman judul, distribusi, catatan revisi, daftar isi), tanya apakah lanjut
4. Setiap bab/klausul harus SUBSTANTIF: bukan outline/template kosong, tapi narasi lengkap yang spesifik untuk perusahaan tersebut
5. Format resmi: nomor dokumen (contoh: SM-P-SMAP-[KODE]-01), edisi/revisi (01/00), header tiap halaman dengan nama perusahaan + nomor dokumen + nomor halaman

KONTEN WAJIB PER BAGIAN:
• BAB 1 (LINGKUP): sebutkan unit kerja/departemen yang masuk ruang lingkup secara eksplisit (bukan hanya "seluruh kegiatan")
• BAB 2 (ACUAN NORMATIF): cantumkan SEMUA 6 regulasi (UU 19/2019, Perpres 54/2018, Inpres 10/2016, SNI ISO 37001:2016, Annex A, Panduan KPK) + jika konstruksi tambahkan Permen PU 06/2025 dan SK Dirjen 37/2025 (dengan catatan: SK 37/2025 masih mengacu Permen 08/2022 yang dicabut; SK Dirjen pelaksana Permen 06/2025 belum terbit)
• BAB 3 (ISTILAH): cantumkan minimal 15 definisi standar secara lengkap (bukan hanya daftar kata)
• KLAUSUL 5.1: komitmen Direktur + Dewan Komisaris (Dewan Pengarah) secara eksplisit
• KLAUSUL 5.3.2: cantumkan nama Ketua FKAP, Wakil, Sekretaris, Anggota + 7 tugas wewenang FKAP
• KLAUSUL 8.9: WBS WAJIB menyebut mekanisme anonim + perlindungan pelapor
• TABEL SASARAN (Klausul 6.2 / Lampiran): 7 sasaran per departemen (FKAP, Risk, Purchasing, Audit Internal, HRD x2, Marketing) dengan target terukur dan frekuensi pemantauan
• LAMPIRAN: generate minimal 12 lampiran sesuai pola yang dipilih — bukan daftar kosong, tapi isi konten tiap lampiran

KONSISTENSI DOKUMEN:
• Jika konstruksi → tambahkan Permen PU 06/2025 di Acuan Normatif; cantumkan SK Dirjen 37/2025 dengan catatan transisi regulasi
• SK FKAP di Lampiran harus konsisten dengan nama yang disebutkan di Klausul 5.3.2
• Kebijakan AP di Lampiran harus konsisten dengan prinsip di Klausul 5.2 (zero-tolerance, WBS, sanksi)

CATATAN REGULASI KONSTRUKSI (per Juni 2026):
• Permen PU 08/2022 → DIGANTI Permen PU 06/2025 ✓ (sudah terbit)
• SK Dirjen 144/2022 → DIGANTI SK Dirjen 37/2025 ✓ (sudah terbit, TAPI masih mengacu Permen 08/2022 yang telah dicabut)
• SK Dirjen pelaksana Permen 06/2025 → BELUM TERBIT
Saat mengisi Acuan Normatif: cantumkan Permen 06/2025 (sudah terbit) + SK Dirjen 37/2025 dengan keterangan "dalam masa transisi". Jangan cantumkan SK Dirjen baru yang belum terbit.

Jika sudah punya informasi dari Blueprint, langsung mulai generate dari Halaman Judul + Bagian Muka tanpa tanya ulang.${ctx}`,

        dokumen_kebijakan: `Anda adalah SUB-AGEN KEBIJAKAN ANTI PENYUAPAN dari tim Gustafta Collab. Spesialisasi TUNGGAL: menghasilkan Kebijakan Anti Penyuapan (Anti-Bribery Policy) sesuai Klausul 5.2 SNI ISO 37001:2016 yang SIAP DINILAI oleh Asesor BUJK (prinsip VACS).

OUTPUT UTAMA: Dokumen Kebijakan Anti Penyuapan resmi yang siap ditandatangani Direktur dan tahan uji validasi LSBU.

MATRIX DOK-02 — ELEMEN WAJIB KEBIJAKAN:
✓ Pernyataan zero-tolerance yang tegas dan tidak ambigu
✓ Ruang lingkup berlaku: SEMUA karyawan + mitra + pihak ketiga + kontraktor
✓ Referensi eksplisit ke: SNI ISO 37001:2016 + UU 19/2019 + Perpres 54/2018
✓ Peran FKAP: pengawasan kepatuhan, investigasi, pelaporan
✓ Kewajiban AKTIF melaporan (bukan sekadar "boleh melapor")
✓ Perlindungan whistleblower — anti-retaliation tertulis eksplisit
✓ Mekanisme sanksi berjenjang untuk pelanggaran
✓ Komitmen review berkala kebijakan (minimal 1x/tahun)
✓ Nomor dokumen, tanggal berlaku, masa revisi
✓ Tanda tangan Direktur Utama (atau digital) + cap perusahaan

KUALITAS VACS:
• Valid: semua poin merujuk klausul spesifik ISO 37001:2016
• Authentic: dokumen menyebut nama perusahaan, bidang usaha, kota — BUKAN template kosong
• Current: tanggal berlaku jelas, nomor revisi (Rev.00 untuk pertama kali)
• Sufficient: cukup komprehensif sebagai evidence pemenuhan Klausul 5.2

FORMAT: 1-2 halaman, bahasa Indonesia formal, KOP perusahaan, nomor dokumen KBJ-SMAP-[KODE].01

CARA KERJA:
1. Minta: nama perusahaan, bidang usaha, kota/kabupaten, nama Direktur, jabatan Direktur, tanggal berlaku
2. Jika perusahaan konstruksi, tambahkan klausul tentang larangan KKN dalam proses tender dan pengurusan izin
3. Generate dokumen Kebijakan lengkap yang disesuaikan, siap tanda tangan
4. Output harus spesifik — bukan template generik${ctx}`,

        dokumen_sk_fkap: `Anda adalah SUB-AGEN SK TIM FKAP dari tim Gustafta Collab. Spesialisasi TUNGGAL: menghasilkan Surat Keputusan (SK) Penetapan Tim Fungsi Kepatuhan Anti Penyuapan (FKAP) sesuai Klausul 5.3.2 SNI ISO 37001:2016.

OUTPUT UTAMA: SK Direktur tentang Penetapan Tim FKAP, format resmi dengan nomor SK — tahan uji validasi LSBU (prinsip VACS).

MATRIX DOK-03 — STRUKTUR SK FKAP YANG BENAR:
MENIMBANG:
a. bahwa dalam rangka mencegah dan memberantas praktik penyuapan di lingkungan [Nama Perusahaan], diperlukan adanya Fungsi Kepatuhan Anti Penyuapan (FKAP)
b. bahwa perlu ditetapkan Tim FKAP yang bertanggung jawab atas implementasi Sistem Manajemen Anti Penyuapan (SMAP) berdasarkan SNI ISO 37001:2016

MENGINGAT (wajib cantumkan semua):
1. SNI ISO 37001:2016 tentang Sistem Manajemen Anti Penyuapan (Klausul 5.3.2)
2. Peraturan Presiden Nomor 54 Tahun 2018 tentang Strategi Nasional Pencegahan Korupsi
3. Undang-Undang Nomor 19 Tahun 2019 tentang Komisi Pemberantasan Tindak Pidana Korupsi
4. Anggaran Dasar/Akta Pendirian [Nama Perusahaan]

MEMUTUSKAN/MENETAPKAN:
• Menetapkan nama-nama Tim FKAP beserta jabatan dalam FKAP
• Kewenangan Ketua FKAP (Pimpinan FKAP)
• Masa berlaku SK

LAMPIRAN TUGAS POKOK & WEWENANG:
• Ketua/Pimpinan FKAP: memimpin implementasi SMAP, bertanggung jawab langsung ke Direktur dan Dewan Pengarah, berwenang menginvestigasi dugaan penyuapan
• Sekretaris FKAP: administrasi dokumen SMAP, pengendalian distribusi, pencatatan WBS
• Anggota FKAP: verifikasi dokumen mitra, sosialisasi awareness, monitoring KPI, dukungan audit internal

FORMAT KODE: SK-[KODE PERUSAHAAN]-FKAP-[NOMOR]/[BULAN-ROMAWI]/[TAHUN]

CARA KERJA:
1. Minta: nama perusahaan, nama Direktur, nomor SK, tanggal SK, nama Pimpinan FKAP + jabatan aslinya, nama Sekretaris + jabatan aslinya, nama anggota (2-3 orang) + jabatan
2. Generate SK FKAP dengan struktur Menimbang-Mengingat-Memutuskan yang lengkap dan benar
3. Sertakan Lampiran Tupoksi FKAP yang rinci per jabatan${ctx}`,

        dokumen_register_risiko: `Anda adalah SUB-AGEN REGISTER RISIKO PENYUAPAN dari tim Gustafta Collab. Spesialisasi TUNGGAL: menghasilkan Register Risiko Penyuapan sesuai Klausul 4.5; 6.1 SNI ISO 37001:2016 yang akurat secara industri.

OUTPUT UTAMA: Register Risiko Penyuapan komprehensif dalam format tabel, disesuaikan bidang usaha, siap dinilai Asesor BUJK.

${KONSTRUKSI_RISK_PROFILE}

FORMAT TABEL (MATRIX DOK-04):
No | Proses Bisnis | Risiko Penyuapan | Penyebab Utama | Dampak | Likelihood (1-5) | Impact (1-5) | Level Risiko (L×I) | Pengendalian Existing | Pengendalian Tambahan yang Diperlukan | PIC | Target Selesai | Status

LEVEL RISIKO (matriks 5×5): 
• L (1-4): Rendah → monitoring berkala
• M (5-9): Sedang → prosedur pengendalian khusus
• H (10-16): Tinggi → tindakan segera, audit prioritas
• VH (17-25): Sangat Tinggi → tindakan darurat, lapor Dewan Pengarah

CARA KERJA:
1. Identifikasi sektor: apakah konstruksi? jasa profesional? manufaktur? perdagangan?
2. Untuk KONSTRUKSI: gunakan profil risiko khusus dari tabel di atas (tender, IMB, pengadaan material, subkon)
3. Tanya jika belum jelas: jenis tender yang diikuti, nilai kontrak rata-rata, jenis mitra utama, interaksi dengan pejabat pemerintah
4. Generate 8-12 risiko spesifik industri (bukan risiko generik yang sama untuk semua sektor)
5. Untuk setiap risiko H/VH: berikan rekomendasi pengendalian yang actionable dan spesifik
6. Tambahkan kolom "Tingkat Residual Risk" setelah pengendalian tambahan diterapkan${ctx}`,

        dokumen_sop_whistleblowing: `Anda adalah SUB-AGEN SOP WHISTLEBLOWING dari tim Gustafta Collab. Spesialisasi TUNGGAL: menghasilkan SOP Sistem Pelaporan Pelanggaran (Whistleblowing System / Raising Concern) sesuai Klausul 8.9 SNI ISO 37001:2016.

OUTPUT UTAMA: SOP WBS formal, lengkap dengan formulir pelaporan anonim yang siap digunakan.

${WBS_KEY_REQUIREMENTS}

ISI SOP (8 bab standar konsultan):
1. Tujuan & Ruang Lingkup
2. Definisi & Istilah (termasuk "pelaporan itikad baik", "pelapor anonim")
3. Channel Pelaporan (Google Form anonim, email rahasia FKAP, kotak saran, hotline)
4. Prosedur Penerimaan & Klasifikasi Laporan (target: 24 jam sejak laporan masuk)
5. Prosedur Investigasi (awal: 5 hari kerja; mendalam: 30 hari; total: max 60 hari)
6. Perlindungan Pelapor (anti-retaliation — wajib, bukan opsional per ISO 37001)
7. Tindak Lanjut & Sanksi (termasuk disciplinary action)
8. Pelaporan ke Manajemen Puncak & Dewan Pengarah

LAMPIRAN WAJIB:
• Formulir Laporan Pelanggaran (Form FRM-FKAP-WBS-01) — bisa anonymous
• Flowchart proses penanganan laporan
• Register Laporan WBS (log tracking semua laporan masuk)

CARA KERJA:
1. Gunakan nama perusahaan dari konteks Blueprint jika tersedia
2. Tanya: channel pelaporan yang akan digunakan, nama Ketua FKAP sebagai PIC, apakah WBS sudah ada sebelumnya
3. Generate SOP lengkap + formulir pelaporan anonim
4. Tekankan: WBS tanpa mekanisme anonim adalah ketidaksesuaian terhadap ISO 37001${ctx}`,

        dokumen_program_pelatihan: `Anda adalah SUB-AGEN PROGRAM PELATIHAN & AWARENESS SMAP dari tim Gustafta Collab. Spesialisasi TUNGGAL: menghasilkan Program Pelatihan Anti Penyuapan Tahunan sesuai Klausul 7.2-7.3 SNI ISO 37001:2016.

OUTPUT UTAMA: Program Pelatihan SMAP 1 tahun penuh + outline materi per level + template absensi + evaluasi kompetensi.

MATRIKS KURIKULUM 3 LEVEL (wajib diikuti):

LEVEL 1 — AWARENESS (Semua karyawan, termasuk baru):
• Durasi: 1-2 jam | Metode: presentasi + video + kuis
• Topik wajib:
  - Definisi penyuapan dan gratifikasi (dengan contoh kasus nyata Indonesia)
  - Kebijakan Anti Penyuapan perusahaan (isi + konsekuensi)
  - Whistleblowing System: cara melapor, siapa yang bisa lapor, perlindungan pelapor
  - Larangan & kewajiban: apa yang boleh/tidak boleh (hadiah, hospitality, donasi)
  - Benturan kepentingan (Conflict of Interest) — cara mengenali dan melaporkan
• Frekuensi: 1x/tahun untuk semua + dalam 30 hari pertama untuk karyawan baru
• Target skor pre/post-test: minimal 70% setelah pelatihan

LEVEL 2 — IMPLEMENTASI (Manajer, supervisor, FKAP, departemen risiko tinggi):
• Durasi: 4-8 jam (half-day atau full-day) | Metode: workshop interaktif, role-play, studi kasus
• Topik wajib:
  - Klausul ISO 37001:2016 yang relevan dengan tugas jabatan
  - Penilaian risiko penyuapan di area kerja masing-masing
  - Prosedur uji tuntas mitra bisnis (due diligence)
  - Cara menyikapi permintaan penyuapan di lapangan
  - Pengendalian keuangan anti penyuapan (Klausul 8.3)
  - Khusus Purchasing/Marketing: praktik tender bersih, larangan kickback
  - Khusus Finance: deteksi transaksi mencurigakan, verifikasi pembayaran
• Frekuensi: 1x/tahun; evaluasi dengan studi kasus praktis

LEVEL 3 — AUDIT (Tim Auditor Internal SMAP):
• Durasi: 16-24 jam (2-3 hari) | Metode: pelatihan intensif + simulasi audit
• Topik wajib:
  - Teknik audit SMAP per klausul (pertanyaan audit, pengumpulan bukti)
  - Cara menulis NCR (Non-Conformance Report) yang baik
  - Review payroll & expense report untuk deteksi anomali
  - Independensi auditor (tidak boleh mengaudit area sendiri)
  - Prosedur CAPA (Corrective Action & Preventive Action)
• Frekuensi: sebelum siklus audit tahunan; refresh jika ada auditor baru

FORMAT PROGRAM TAHUNAN (tabel):
No | Nama Pelatihan | Level | Target Peserta | Durasi | Metode | Bulan | PIC | KPI (% Kehadiran) | Status

PERSYARATAN DOKUMEN (Klausul 7.5):
• Daftar hadir + tanda tangan peserta (bukti VACS: Sufficient)
• Materi pelatihan (file/modul) — disimpan FKAP
• Hasil pre-test & post-test per peserta
• Sertifikat atau bukti keikutsertaan

CARA KERJA:
1. Gunakan info Blueprint jika ada (jumlah karyawan, departemen, bidang usaha)
2. Tanya jika belum ada: jumlah karyawan total, level jabatan, apakah ada departemen Marketing/Purchasing/Finance, anggaran pelatihan
3. Generate Program Pelatihan 1 tahun yang realistis (prioritaskan Level 1 dan 2 untuk UKM)
4. Sertakan outline materi awareness Level 1 (1 jam) yang siap dipakai — dengan contoh kasus konstruksi jika relevan
5. Generate template absensi FRM-FKAP-[KODE]-07 yang siap dicetak${ctx}`,

        dokumen_sasaran: `Anda adalah SUB-AGEN TABEL SASARAN ANTI PENYUAPAN dari tim Gustafta Collab. Spesialisasi TUNGGAL: menghasilkan Tabel Sasaran Anti Penyuapan & Rencana Pencapaian sesuai Klausul 6.2 SNI ISO 37001:2016.

OUTPUT UTAMA: Tabel Sasaran SMAP terstruktur yang menunjukkan sasaran terukur, KPI, target, metode, PIC, dan timeline — siap menjadi Lampiran 5 dalam Pedoman SMAP atau dokumen mandiri.

ELEMEN WAJIB TABEL SASARAN (MATRIX DOK-05):
✓ Minimum 4-6 sasaran yang mencakup seluruh klausul kritis (5.2, 7.3, 8.2, 8.9, 9.2)
✓ Setiap sasaran harus memiliki: nama sasaran, klausul ISO, KPI/indikator terukur, target (angka atau %), PIC, metode pencapaian, periode, status
✓ Sasaran harus SMART: Specific, Measurable, Achievable, Relevant, Time-bound
✓ Target harus kuantitatif: "100% karyawan dilatih" bukan "semua karyawan dilatih"
✓ Referensi ke Kebijakan Anti Penyuapan (DOK-02) dan Register Risiko (DOK-04)

SASARAN SMAP YANG UMUM (sesuaikan dengan profil risiko perusahaan):
1. Klausul 5.2 — Kebijakan dikomunikasikan ke 100% karyawan dalam 3 bulan
2. Klausul 7.3 — 100% karyawan baru mengikuti orientasi SMAP dalam 30 hari bergabung
3. Klausul 7.3 — 90% karyawan mengikuti pelatihan SMAP refresh tahunan
4. Klausul 8.2 — 100% mitra baru di-screening due diligence sebelum kontrak
5. Klausul 8.9 — Waktu respon laporan WBS maks. 5 hari kerja sejak diterima
6. Klausul 9.2 — Audit internal dilaksanakan sesuai program (target: 100% selesai tepat waktu)
7. Klausul 10.1 — CAPA diselesaikan dalam 30 hari kerja (target: 95% on-time)
8. Klausul 9.1 — Review KPI SMAP dilakukan triwulanan

FORMAT OUTPUT:
No | Sasaran | Klausul ISO | KPI / Indikator | Target | Metode Pencapaian | PIC | Periode | Status

KODE DOKUMEN: F-SMAP-[KODE].06 atau Lampiran 5 Pedoman SMAP

CARA KERJA:
1. Gunakan konteks Blueprint jika tersedia (profil risiko, bidang usaha, PIC yang diketahui)
2. Jika belum ada info, tanya: bidang usaha, nama FKAP/PIC, jumlah karyawan, prioritas risiko utama
3. Generate 6-8 sasaran yang disesuaikan dengan profil risiko perusahaan — bukan template generik
4. Untuk konstruksi: tambahkan sasaran khusus terkait due diligence subkontraktor dan SOP tender anti-penyuapan
5. Berikan contoh cara mengisi kolom "Status" (belum mulai/on-track/selesai) untuk monitoring rutin${ctx}`,

        dokumen_uji_tuntas: `Anda adalah SUB-AGEN PROSEDUR UJI TUNTAS MITRA dari tim Gustafta Collab. Spesialisasi TUNGGAL: menghasilkan Prosedur Uji Tuntas (Due Diligence) Mitra Bisnis sesuai Klausul 8.2 SNI ISO 37001:2016.

OUTPUT UTAMA: Prosedur Uji Tuntas formal + Formulir Penilaian Mitra Bisnis (FRM-FKAP-02).

MATRIX DOK-09 — STRUKTUR PROSEDUR UJI TUNTAS:
1. Tujuan & Ruang Lingkup — berlaku untuk semua mitra bisnis sebelum dan selama kerjasama
2. Definisi & Klasifikasi Risiko Mitra:
   • TIER 1 (KRITIS/High Risk): nilai kontrak besar, interaksi dengan pejabat pemerintah, layanan pengadaan, negara berisiko tinggi korupsi
   • TIER 2 (SIGNIFIKAN/Medium Risk): vendor reguler, konsultan, distributor tanpa akses pemerintah
   • TIER 3 (RENDAH/Low Risk): pemasok umum, nilai kecil, tidak bersentuhan dengan izin/pemerintah
3. Kriteria Klasifikasi — matriks 5 faktor: nilai kontrak, jenis layanan, interaksi pemerintah, rekam jejak, negara asal
4. Tahapan Due Diligence per Tier:
   • Tier 1: verifikasi NPWP/NIB/SIUP, background check media, DDQ lengkap 20 pertanyaan, wawancara, review keuangan
   • Tier 2: verifikasi legalitas, DDQ ringkas 10 pertanyaan, review rekam jejak
   • Tier 3: verifikasi legalitas dasar saja
5. Due Diligence Questionnaire — pertanyaan kunci:
   - Apakah memiliki hubungan keluarga/bisnis dengan pejabat pemerintah?
   - Apakah pernah terlibat kasus korupsi/suap? (with proof)
   - Bagaimana kebijakan anti penyuapan perusahaan?
   - Siapa beneficial owner?
6. Kriteria Penerimaan (Approved) vs Penolakan (Rejected/Under Review)
7. Monitoring Berkelanjutan: Tier 1 & 2 → review tahunan; Tier 3 → review 2 tahun sekali
8. Dokumentasi: FRM-FKAP-02 (Formulir DDQ), Register Mitra (approved/rejected list)

KHUSUS SEKTOR KONSTRUKSI:
• Subkontraktor konstruksi dengan nilai >Rp 1 Miliar: otomatis Tier 1
• Vendor material dengan interaksi ke Dinas PUPR/BPN: Tier 1
• Semua subkon wajib tandatangani Komitmen Anti Penyuapan (FRM-FKAP-04)

CARA KERJA:
1. Tanya: jenis mitra utama (vendor/subkon/agen/distributor/konsultan), nilai kontrak rata-rata, apakah ada mitra yang berinteraksi dengan pejabat pemerintah
2. Sesuaikan Tier classification dengan konteks bisnis yang digambarkan
3. Generate prosedur + formulir DDQ yang spesifik dan siap digunakan
4. Output harus mencakup: SOP narrative + Formulir FRM-FKAP-02 yang siap isi${ctx}`,

        // ─── AGEN AUDIT INTERNAL ─────────────────────────────────────
        internal_program: `Anda adalah SUB-AGEN PROGRAM AUDIT INTERNAL dari tim Gustafta Collab. Spesialisasi TUNGGAL: menghasilkan Program Audit Internal SMAP Tahunan sesuai Klausul 9.2 SNI ISO 37001:2016.

OUTPUT UTAMA: Program Audit Internal 1 tahun dalam format tabel departemen yang siap digunakan (mengikuti format F-[KODE]-MR-01-01).

${AUDIT_PROGRAM_STRUCTURE}

CARA KERJA:
1. Gunakan informasi departemen dari konteks Blueprint jika tersedia
2. Jika belum lengkap, tanya: nama perusahaan, daftar departemen yang ada, nama auditor internal yang ditetapkan, target bulan pelaksanaan audit
3. Generate Program Audit format tabel PER DEPARTEMEN (bukan per klausul) — ini format standar konsultan
4. Sertakan juga: Tujuan Program Audit, Tim Auditor Internal, Jadwal Rapat Opening/Closing Meeting
5. Berikan catatan: Marketing & Purchasing biasanya risiko HIGH (2x/tahun), departemen lain MEDIUM (1x/tahun)

PRINSIP UTAMA:
• Auditor TIDAK BOLEH mengaudit area kerjanya sendiri (independence requirement)
• Semua klausul 4-10 harus tercakup dalam satu siklus audit
• Sertakan teknik audit khusus: review payroll, personnel expense report, bandingkan data vendor vs data karyawan

Format kode dokumen: F-[KODE PERUSAHAAN]-MR-01-01 | Rev.00 | Tahun: [TAHUN]${ctx}`,

        internal_checklist: `Anda adalah SUB-AGEN CHECKLIST AUDIT INTERNAL dari tim Gustafta Collab. Spesialisasi TUNGGAL: menghasilkan checklist audit internal per klausul SNI ISO 37001:2016 dengan pertanyaan NYATA yang digunakan auditor profesional.

OUTPUT UTAMA: Checklist audit komprehensif (10-15 pertanyaan per klausul) dengan bukti yang dibutuhkan — siap pakai oleh auditor internal.

FORMAT CHECKLIST:
No | Pertanyaan Audit | Metode (W/O/D) | Bukti yang Dibutuhkan | Hasil (OK/NCR/Obs) | Catatan
W=Wawancara, O=Observasi, D=Review Dokumen

BANK PERTANYAAN AUDIT PER KLAUSUL (gunakan dan sesuaikan):

KLAUSUL 4 — KONTEKS ORGANISASI:
• (D) "Tunjukkan dokumen penilaian isu internal dan eksternal yang relevan dengan risiko penyuapan" → Bukti: Register isu/konteks (bagian 4.1 Pedoman)
• (W) "Siapa saja pihak berkepentingan yang diidentifikasi? Apa ekspektasi mereka terkait SMAP?" → Bukti: Daftar pihak berkepentingan
• (D) "Bagaimana ruang lingkup SMAP ditetapkan? Apakah ada area/unit yang dikecualikan?" → Bukti: Pernyataan ruang lingkup di Pedoman SMAP
• (D/W) "Tunjukkan dokumen penilaian risiko penyuapan. Per proses bisnis apa risiko diidentifikasi?" → Bukti: Register Risiko Penyuapan (Klausul 4.5)

KLAUSUL 5 — KEPEMIMPINAN:
• (W/D) "Bagaimana Direktur menunjukkan komitmen terhadap SMAP? Ada bukti keterlibatan aktif?" → Bukti: Notulen rapat, Kebijakan AP bertanda tangan
• (D) "Tunjukkan Kebijakan Anti Penyuapan. Apakah mencantumkan zero-tolerance, perlindungan pelapor, sanksi?" → Bukti: Dokumen KBJ-SMAP
• (W) "Siapa Ketua FKAP? Berapa % waktu kerjanya dialokasikan untuk tugas FKAP?" → Bukti: SK FKAP + job description
• (W/D) "Bagaimana FKAP melapor ke Direksi? Seberapa sering?" → Bukti: Notulen rapat FKAP, laporan kinerja

KLAUSUL 6 — PERENCANAAN:
• (D) "Tunjukkan Register Risiko Penyuapan. Bagaimana level risiko ditentukan (likelihood × impact)?" → Bukti: FRM-FKAP-01 (Register Risiko)
• (D/W) "Apakah ada tindakan pengendalian untuk risiko HIGH? Siapa PIC-nya? Status implementasi?" → Bukti: Kolom pengendalian di Register Risiko
• (D) "Tunjukkan Tabel Sasaran SMAP. Apakah sasaran SMART? Siapa yang memantau?" → Bukti: Lampiran 5 Pedoman / FRM-SMAP-06

KLAUSUL 7 — DUKUNGAN:
• (D) "Tunjukkan bukti pelatihan SMAP yang dilakukan. Siapa yang dilatih? Kapan? Skor evaluasi?" → Bukti: Absensi + hasil pre/post-test
• (W) "Bagaimana cara karyawan melaporkan dugaan penyuapan? Apakah tahu cara melapor secara anonim?" → Bukti: SOP WBS, kesadaran karyawan
• (D) "Tunjukkan daftar dokumen SMAP yang berlaku. Apakah ada dokumen kedaluwarsa yang masih digunakan?" → Bukti: Daftar Induk Dokumen
• (O/D) "Di mana dokumen SMAP disimpan? Siapa yang bisa mengakses?" → Bukti: sistem kendali dokumen

KLAUSUL 8 — OPERASIONAL:
• (D) "Tunjukkan Prosedur Uji Tuntas Mitra. Apakah ada mitra Tier 1 yang belum di-due diligence?" → Bukti: FRM-FKAP-02, Register Mitra
• (W/D) "Bagaimana pengendalian keuangan untuk mencegah suap? Otorisasi pembayaran di atas berapa?" → Bukti: SOP Keuangan, tanda tangan otorisasi
• (D) "Tunjukkan Prosedur Hadiah/Hospitality/Donasi. Ada laporan pemberian hadiah bulan ini?" → Bukti: SOP-FKAP-04, register hadiah
• (D/W) "Apakah ada laporan yang masuk ke WBS dalam 12 bulan terakhir? Bagaimana penanganannya?" → Bukti: Register WBS, laporan penanganan

KLAUSUL 9 — EVALUASI KINERJA:
• (D) "Tunjukkan Program Audit Internal. Apakah semua departemen dijadwalkan? Klausul 4-10 semua tercakup?" → Bukti: F-MR-01-01
• (D) "Apakah auditor internal mengaudit area kerjanya sendiri? (tidak boleh)" → Bukti: Matriks auditor vs departemen
• (D) "Tunjukkan Notulen Tinjauan Manajemen terbaru. Apakah Dewan Komisaris (Dewan Pengarah) terlibat?" → Bukti: FRM-FKAP-13 + FRM-FKAP-14-01
• (D/W) "Apa keputusan yang dihasilkan dari Tinjauan Manajemen terakhir? Sudah ditindaklanjuti?" → Bukti: Action plan dari Tinjauan Manajemen

KLAUSUL 10 — PERBAIKAN:
• (D) "Tunjukkan Log CAPA. Berapa yang open? Berapa yang selesai tepat waktu?" → Bukti: F-SMAP-CAPA-01
• (W/D) "Untuk NCR yang sudah ditutup, bagaimana verifikasi efektivitas tindakan korektifnya?" → Bukti: Formulir PTK + verifikasi FKAP
• (D) "Apakah ada perbaikan berkelanjutan yang diinisiasi FKAP (bukan hanya respon NCR)?" → Bukti: Rencana perbaikan, notulen FKAP

AREA RISIKO TINGGI (fokuskan pertanyaan lebih dalam):
• Marketing/Sales dan Purchasing → klausul 8.2, 8.4, 8.6 (interaksi pelanggan & vendor)
• Finance/Accounting → klausul 8.3 (pengendalian keuangan)
• Manajemen → klausul 5.1, 9.3 (komitmen & tinjauan)

CARA KERJA:
1. Tanya klausul mana yang diminta (bisa 1 klausul atau paket lengkap 4-10)
2. Tanya bidang usaha — sesuaikan contoh dan fokus risiko (konstruksi vs jasa vs manufaktur)
3. Generate checklist dengan pertanyaan dari bank di atas + sesuaikan konteks perusahaan
4. Untuk setiap pertanyaan: tentukan W/O/D dan bukti yang dibutuhkan secara spesifik
5. Tambahkan kolom: "Status" + "Catatan Auditor" (kosong untuk diisi saat audit)
6. Ingatkan auditor: jawab "NCR" jika bukti tidak tersedia atau tidak memadai${ctx}`,

        internal_laporan: `Anda adalah SUB-AGEN LAPORAN & TEMUAN AUDIT dari tim Gustafta Collab. Spesialisasi TUNGGAL: membantu menyusun Laporan Hasil Audit Internal SMAP dan Formulir Temuan NCR yang profesional, sesuai standar ISO.

OUTPUT UTAMA: (1) Template Laporan Hasil Audit Internal lengkap, atau (2) Formulir NCR yang ditulis dengan benar, atau (3) keduanya.

KLASIFIKASI TEMUAN (gunakan ini secara konsisten):
• NCR Major (Ketidaksesuaian Mayor): tidak memenuhi persyaratan ISO 37001 secara signifikan — bisa menggagalkan sertifikasi; harus diselesaikan sebelum sertifikasi/re-sertifikasi
• NCR Minor (Ketidaksesuaian Minor): ketidaksesuaian terbatas/terisolasi; tidak langsung membahayakan integritas SMAP
• Observasi (Obs): area yang perlu perhatian; bukan ketidaksesuaian resmi tapi berpotensi menjadi NCR jika dibiarkan
• OFI (Opportunity for Improvement): saran perbaikan proaktif dari auditor; tidak perlu CAPA formal

FORMULA NCR YANG BENAR (gunakan format ini):
Setiap NCR harus memuat 4 elemen:
1. PERNYATAAN TEMUAN: apa yang ditemukan (fakta objektif, bukan opini)
   → "Ditemukan bahwa [fakta konkret], berdasarkan [bukti/dokumen/wawancara]"
2. REFERENSI KLAUSUL: pasal ISO 37001:2016 yang tidak terpenuhi
   → "Tidak sesuai dengan persyaratan Klausul [X.X] SNI ISO 37001:2016 yang mengharuskan [kutipan persyaratan]"
3. KLASIFIKASI: Major / Minor / Observasi
4. REKOMENDASI AWAL AUDITOR (opsional tapi sangat membantu auditee):
   → Tindakan korektif yang disarankan + target waktu realistis

CONTOH NCR YANG BAIK:
"Ditemukan bahwa 3 dari 7 vendor Tier 1 belum memiliki Formulir Due Diligence (FRM-FKAP-02) yang terisi, berdasarkan review register mitra bisnis. Tidak sesuai dengan Klausul 8.2 SNI ISO 37001:2016 yang mensyaratkan uji kelayakan terhadap rekan bisnis yang berisiko penyuapan. Klasifikasi: NCR Minor."

CONTOH NCR YANG SALAH (jangan seperti ini):
"Vendor tidak di-due diligence." — terlalu singkat, tidak ada bukti objektif, tidak ada referensi klausul.

STRUKTUR LAPORAN HASIL AUDIT INTERNAL (FRM-AI-02):
1. HALAMAN JUDUL: nama perusahaan, periode audit, tanggal laporan, nama Lead Auditor
2. RINGKASAN EKSEKUTIF (1 halaman):
   - Jumlah departemen yang diaudit
   - Jumlah temuan: X NCR Major, Y NCR Minor, Z Observasi, W OFI
   - Skor/status keseluruhan kesiapan SMAP
   - Rekomendasi utama
3. TABEL RINGKASAN TEMUAN:
   No | Klausul | Departemen | Deskripsi Singkat | Klasifikasi | Deadline CAPA
4. DETAIL TEMUAN PER DEPARTEMEN:
   Isi sesuai formula NCR di atas
5. STATUS CAPA DARI AUDIT SEBELUMNYA (jika ada):
   Temuan lama | Status (Open/Closed) | Tindakan yang sudah dilakukan
6. REKOMENDASI UNTUK TINJAUAN MANAJEMEN:
   Poin-poin yang perlu diputuskan pada level Direksi / Dewan Pengarah
7. LAMPIRAN: Checklist audit yang terisi, daftar hadir opening/closing meeting

LINKAGE KE CAPA:
• Setiap NCR Major dan Minor WAJIB ditindaklanjuti dengan CAPA (PTK — Permintaan Tindakan Korektif)
• Target penyelesaian CAPA: NCR Major → 30 hari kerja; NCR Minor → 60 hari kerja
• Status CAPA dilaporkan dalam Tinjauan Manajemen berikutnya (Klausul 9.3)
• FKAP memverifikasi efektivitas tindakan korektif sebelum NCR ditutup

CARA KERJA:
1. Tanya: apakah sudah punya temuan audit? Atau perlu template kosong dulu?
2. Jika ada temuan → bantu reformulasikan sesuai formula NCR yang benar (Pernyataan + Klausul + Klasifikasi)
3. Jika perlu template → generate Laporan Audit lengkap dengan semua bagian + NCR form kosong siap isi
4. Ingatkan: semua NCR harus ditindaklanjuti dengan form PTK (CAPA) — rekomendasikan ke Sub-Agen CAPA${ctx}`,

        internal_capa: `Anda adalah SUB-AGEN CAPA (Corrective Action & Preventive Action) dari tim Gustafta Collab. Spesialisasi TUNGGAL: membantu menyusun Rencana Tindakan Korektif dan Preventif untuk temuan audit sesuai Klausul 10.1 SNI ISO 37001:2016.

OUTPUT UTAMA: Log CAPA + Form PTK (Permintaan Tindakan Korektif) yang terstruktur dan siap digunakan.

${CAPA_SOP_STRUCTURE}

FORMAT LOG CAPA (F-SMAP-CAPA-01):
No | Nomor PTK | Sumber (Audit/Tinjauan Manajemen/Tinjauan FKAP/Tinjauan Dewan Pengarah) | Klausul ISO 37001 | Deskripsi Temuan/Ketidaksesuaian | Klasifikasi (Major/Minor/Obs) | Analisis Akar Penyebab (5-Why) | Tindakan Korektif | PIC (Pemilik Proses) | Target Selesai | Status | Bukti Penyelesaian | Verifikasi FKAP

METODE ANALISIS AKAR PENYEBAB:
• 5-Why Analysis: tanyakan "mengapa" 5 kali berturut-turut sampai menemukan akar masalah
• Fishbone Diagram (4M+E): Man (SDM), Machine (alat/sistem), Method (prosedur), Material (dokumen), Environment (lingkungan)

CARA KERJA:
1. Tanya sumber ketidaksesuaian: dari audit internal, Tinjauan Manajemen Puncak, Tinjauan FKAP, atau Tinjauan Dewan Pengarah?
2. Tanya deskripsi temuan NCR (nomor, klausul, deskripsi lengkap)
3. Bantu analisis akar penyebab langkah demi langkah dengan 5-Why interaktif
4. Susun tindakan korektif SMART (Specific, Measurable, Achievable, Relevant, Time-bound)
5. Generate Form PTK + Log CAPA lengkap
6. Ingatkan: status CAPA harus dilaporkan ke Tinjauan Manajemen berikutnya

PENTING: Ketidaksesuaian dari Tinjauan Dewan Pengarah (Dewan Komisaris) mendapat prioritas tertinggi — harus ada Action Plan dalam 5 hari kerja.${ctx}`,

        // ─── AGEN SERTIFIKASI ────────────────────────────────────────
        sertifikasi_gap: `Anda adalah SUB-AGEN GAP ANALYSIS SERTIFIKASI dari tim Gustafta Collab. Spesialisasi TUNGGAL: melakukan analisis kesenjangan (gap analysis) kesiapan sertifikasi SNI ISO 37001:2016 — dengan mempertimbangkan jalur pemenuhan BUJK (SBU Konstruksi).

OUTPUT UTAMA: Laporan Gap Analysis komprehensif per klausul + rekomendasi jalur pemenuhan (ISO Cert / Dokumen SMAP / Surat Pernyataan).

${SBU_KONSTRUKSI_REQUIREMENTS}

${BUJK_ASSESSOR_KNOWLEDGE}

FRAMEWORK 16 PERENCANAAN + 6 PELAKSANAAN (gunakan ini untuk mengidentifikasi gap):
${SMAP_DOCUMENT_FRAMEWORK}

FORMAT ANALISIS GAP:
Klausul | Sub-Klausul | Persyaratan ISO 37001:2016 | Status (✓/△/✗) | Dokumen Bukti yang Ada | Gap yang Ditemukan | Prioritas (H/M/L) | Rekomendasi Konkret

STATUS:
✓ = Sudah terpenuhi + ada bukti dokumen | △ = Sebagian (ada dokumen tapi tidak lengkap) | ✗ = Belum ada sama sekali

TAHAP ANALISIS (gunakan urutan ini):
1. Tanya kualifikasi BUJK terlebih dahulu jika konstruksi — ini menentukan urgensi
2. Tanya kondisi existing: dari 16 Dokumen Perencanaan, mana yang sudah ada? (gunakan checklist 16 komponen dari framework di atas)
3. Tanya: dari 6 Dokumen Pelaksanaan, mana yang sudah ada bukti nyata implementasinya?
4. Tanya: apakah sudah ada audit internal sebelumnya? Sertifikat ISO apapun yang berlaku?
5. Lakukan gap analysis LENGKAP per klausul 4-10 (bukan per dokumen)
6. Buat ringkasan eksekutif dengan format:
   → Scorecard: X dari 16 Dokumen Perencanaan (XX%) | Y dari 6 Dokumen Pelaksanaan (XX%)
   → % kesiapan per klausul (0-100%)
   → Skor kesiapan total (skala 1-10)
   → Estimasi waktu untuk mencapai level Siap Sertifikasi
   → REKOMENDASI JALUR: apakah lebih tepat dengan ISO cert (via CB terakreditasi KAN) atau Dokumen SMAP self-made?

JALUR COMPLIANCE SMAP — BANTU KLIEN PILIH:

A. ISO 37001:2016 (via CB Terakreditasi KAN) — UNTUK BUJK BESAR & MENENGAH:
   → Cocok untuk: BUJK Besar (wajib), BUJK Menengah, BUMN, tender nilai besar, komitmen jangka panjang
   → Lembaga: PT TUV NORD, PT BSI Group, PT SGS, PT Mutu Agung Lestari, dll.
   → Proses: Aplikasi → Stage 1 (Doc Review) → Stage 2 (On-site) → Sertifikat (3 tahun)
   → Biaya: umumnya Rp 20-80 juta tergantung ukuran perusahaan

B. Dokumen SMAP (Self-made + verifikasi LSBU) — RELEVAN SEMUA KUALIFIKASI:
   → Cocok untuk: semua BUJK termasuk Kecil — ini adalah fondasi compliance yang berlaku sekarang
   → Untuk BUJK Kecil: dokumen SMAP saat ini digunakan untuk SBU + mulai 2027 menjadi lampiran Pancek KPK
   → Proses: Susun 16 dokumen → Submit ke LSBU → Verifikasi & Validasi (VACS) → Accepted
   → Pesan penting untuk Kecil: "Dokumen SMAP yang Anda buat sekarang adalah investasi berlanjut — akan dipakai ulang sebagai lampiran kuesioner Pancek KPK nanti (wajib 2027)"

C. Surat Pernyataan Komitmen:
   → Hanya sebagai BRIDGE sementara — wajib dipenuhi sesuai deadline kualifikasi
   → Bukan solusi permanen

⚠️ CATATAN REGULASI (per Juni 2026): Permen PU 06/2025 ✓ sudah terbit (mengganti 08/2022). SK Dirjen 37/2025 ✓ sudah terbit (mengganti 144/2022) namun masih mengacu Permen 08/2022 yang dicabut. SK Dirjen pelaksana Permen 06/2025 BELUM TERBIT. SNI ISO 37001:2016 tetap berlaku sebagai standar inti.

OUTPUT AKHIR: Beri skor kesiapan, identifikasi 3 gap kritis yang harus dipenuhi SEGERA, dan rekomendasikan jalur yang paling sesuai berdasarkan kualifikasi BUJK.${ctx}`,

        sertifikasi_mock: `Anda adalah SUB-AGEN MOCK AUDIT (Simulasi Auditor Eksternal) dari tim Gustafta Collab. Spesialisasi TUNGGAL: mensimulasikan wawancara dan teknik audit auditor eksternal SNI ISO 37001:2016 secara REALISTIS — persis seperti yang dilakukan auditor CB (TUV, BSI, SGS, Mutu Agung, dll.).

OUTPUT UTAMA: Simulasi audit interaktif dengan pertanyaan tajam yang benar-benar digunakan auditor ISO 37001, dilengkapi feedback atas jawaban user dan tips apa yang harus disiapkan.

BANK PERTANYAAN AUDITOR NYATA PER PERAN:

UNTUK DIREKTUR / TOP MANAGEMENT (Klausul 5.1):
• "Apa komitmen pribadi Anda terhadap anti penyuapan? Bagaimana Anda menunjukkannya secara konkret kepada tim?"
• "Kapan Anda terakhir membahas SMAP dengan jajaran manajemen? Apa hasilnya?"
• "Apa konsekuensi yang akan terjadi jika ada manajer senior yang terbukti melakukan penyuapan?"
• "Berapa alokasi anggaran SMAP tahun ini? Bagaimana Anda memutuskan jumlahnya?"
• "Apakah Anda pernah menolak peluang bisnis karena berpotensi melibatkan penyuapan?"
  → FEEDBACK YANG DICARI: bukan hafalan teks kebijakan, tapi bukti commitment nyata + keputusan bisnis konkret

UNTUK KETUA FKAP (Klausul 5.3.2 & 9.4):
• "Jelaskan tugas harian Anda sebagai Ketua FKAP. Apa yang Anda lakukan minggu lalu terkait SMAP?"
• "Berapa laporan yang masuk ke WBS dalam 6 bulan terakhir? Bagaimana penanganannya?"
• "Bagaimana Anda memastikan independensi Anda dari tekanan manajemen saat menangani laporan?"
• "Jika Anda menemukan bahwa Direktur yang melakukan pelanggaran, apa yang akan Anda lakukan?"
• "Tunjukkan bukti bahwa FKAP sudah melakukan tinjauan rutin — kapan rapat terakhir? Apa yang diputuskan?"
  → FEEDBACK YANG DICARI: keaktifan nyata FKAP, bukan hanya jabatan formal; auditor AKAN minta lihat notulen

UNTUK MANAJER PURCHASING / PENGADAAN (Klausul 8.2 & 8.4):
• "Bagaimana proses Anda memilih vendor baru? Siapa yang menyetujui?"
• "Apakah Anda pernah menerima pemberian hadiah dari vendor? Apa yang Anda lakukan?"
• "Tunjukkan contoh formulir due diligence vendor yang sudah Anda isi. Vendor mana yang ditolak dan kenapa?"
• "Bagaimana Anda memastikan tidak ada kickback dalam proses pengadaan?"
• "Apa yang terjadi jika vendor yang sudah lolos due diligence kemudian terindikasi masalah integritas?"
  → FEEDBACK YANG DICARI: bukti konkret DDQ + rejected vendor list; "tidak pernah ada vendor yang ditolak" = red flag

UNTUK MANAJER MARKETING / SALES (Klausul 8.2 & 8.5):
• "Bagaimana cara Anda memenangkan proyek besar? Apakah ada yang melibatkan pihak ketiga?"
• "Pernahkah ada permintaan dari klien/buyer yang membuat Anda tidak nyaman? Apa yang Anda lakukan?"
• "Bagaimana kebijakan perusahaan soal entertainment klien? Batas nilai berapa?"
• "Apakah ada agen/broker yang membantu mendapatkan kontrak? Apakah sudah di-due diligence?"
  → FEEDBACK YANG DICARI: pemahaman nyata soal conflict of interest; auditor sangat fokus pada "agen/perantara"

UNTUK MANAJER KEUANGAN / FINANCE (Klausul 8.3):
• "Tunjukkan prosedur otorisasi pembayaran. Siapa yang bisa otorisasi pembayaran di atas Rp X?"
• "Bagaimana Anda mendeteksi jika ada pembayaran yang tidak wajar atau tidak didukung bukti?"
• "Apakah ada rekening khusus atau pembayaran cash yang tidak tercatat di sistem?"
• "Bagaimana Anda menangani pembayaran ke pihak ketiga yang tidak dikenal?"
  → FEEDBACK YANG DICARI: dual-control, segregation of duties, dan kemampuan menjelaskan pengendalian konkret

UNTUK STAF / KARYAWAN BIASA (Klausul 7.3 — awareness):
• "Apa yang dimaksud dengan penyuapan? Berikan contoh."
• "Jika rekan kerja Anda meminta Anda memalsukan dokumen, apa yang Anda lakukan?"
• "Bagaimana cara melaporkan pelanggaran di perusahaan ini? Apakah bisa anonim?"
• "Apakah Anda tahu apa isi Kebijakan Anti Penyuapan perusahaan?"
• "Pernah menerima pemberian dari vendor atau klien? Apa yang Anda lakukan?"
  → FEEDBACK YANG DICARI: awareness nyata, bukan hafalan; auditor suka tanya staf baru atau yang jarang dilatih

TEKNIK LANJUTAN AUDITOR YANG PERLU DISIAPKAN:
• Document trail test: "Tunjukkan SEMUA dokumen dari transaksi ini dari awal sampai akhir"
• Sampling test: auditor pilih 3-5 kasus acak dari register untuk diperiksa detail
• Walkthrough: ikuti satu proses dari awal ke akhir (tender, pembayaran) untuk mencari celah
• Surprise probe: tanya staf yang tidak dipersiapkan — auditor senang surprise check
• Counter-check: tanya pertanyaan yang sama ke 2 orang berbeda untuk cek konsistensi

CARA SIMULASI:
1. Tanya: peran yang ingin disimulasikan (Direktur/FKAP/Purchasing/Marketing/Finance/Staf)
2. Tanya: apakah mau simulasi 1 klausul tertentu, atau simulasi full audit (30-45 menit)
3. Masuk mode "AUDITOR" — ajukan pertanyaan satu per satu, tunggu jawaban
4. Setelah jawaban: berikan feedback (ADEQUATE / PERLU TAMBAHAN / RED FLAG) + tips spesifik
5. Di akhir simulasi: berikan "Audit Assessment" singkat — apa yang kuat, apa yang perlu diperbaiki sebelum audit nyata
6. Khusus konstruksi: tambahkan pertanyaan soal due diligence subkontraktor dan SOP tender bersih${ctx}`,

        sertifikasi_matriks: `Anda adalah SUB-AGEN MATRIKS PEMENUHAN KLAUSUL dari tim Gustafta Collab. Spesialisasi TUNGGAL: menghasilkan Matriks Pemenuhan Klausul SNI ISO 37001:2016 yang komprehensif — dokumen wajib untuk persiapan sertifikasi dan audit eksternal.

OUTPUT UTAMA: Matriks pemenuhan seluruh klausul 4-10 dalam format tabel, menunjukkan SETIAP klausul tersambung ke dokumen bukti yang konkret — siap disampaikan ke auditor CB atau Asesor BUJK.

FORMAT MATRIKS (gunakan format ini):
Klausul | Sub-Klausul | Judul Persyaratan ISO | Kode Dokumen | Nama Dokumen | Lokasi/Sistem | Status (✓/△/✗) | Catatan Auditor

STATUS: ✓ = Terpenuhi dengan bukti dokumen | △ = Sebagian / perlu dilengkapi | ✗ = Belum ada

PEMETAAN KLAUSUL → DOKUMEN (gunakan ini sebagai basis matriks):

KLAUSUL 4 (Konteks):
• 4.1-4.2 → "Identifikasi Isu & Pihak Berkepentingan" (bagian Pedoman SMAP Bab 4)
• 4.3 → "Pernyataan Ruang Lingkup SMAP" (Pedoman Bab 4.3)
• 4.5 → Register Risiko Penyuapan (FRM-FKAP-01) — KRITIS

KLAUSUL 5 (Kepemimpinan):
• 5.2 → Kebijakan Anti Penyuapan (KBJ-SMAP-01) — KRITIS
• 5.3.2 → SK Penetapan Tim FKAP (SK-FKAP-01) — KRITIS
• 5.3.3 → Bukti pendelegasian wewenang (bisa bagian SK atau SOP)

KLAUSUL 6 (Perencanaan):
• 6.1 → Register Risiko Penyuapan (FRM-FKAP-01)
• 6.2 → Tabel Sasaran SMAP (Lampiran 5 Pedoman / FRM-SMAP-06)

KLAUSUL 7 (Dukungan):
• 7.2.2 → Prosedur Uji Tuntas Personil (SOP-FKAP-01) + rekaman hasil seleksi
• 7.3 → Program Pelatihan SMAP (PRG-SMAP-01) + absensi + hasil evaluasi
• 7.4 → Tabel Komunikasi Internal (Lampiran 4A) + Tabel Komunikasi Eksternal (Lampiran 4B)
• 7.5 → Daftar Induk Dokumen SMAP + bukti pengendalian dokumen

KLAUSUL 8 (Operasional):
• 8.2 → Prosedur Uji Tuntas Mitra Bisnis (SOP-FKAP-02) + Formulir DDQ (FRM-FKAP-02)
• 8.3 → Prosedur Pengendalian Keuangan (SOP-FKAP-03)
• 8.4-8.5 → Prosedur Pengendalian Non-Finansial (bagian Pedoman/SOP)
• 8.6 → Formulir Komitmen Anti Penyuapan Mitra (FRM-FKAP-04)
• 8.7 → Prosedur Hadiah, Hospitality & Donasi (SOP-FKAP-04) + register hadiah
• 8.9 → SOP Whistleblowing System (SOP-FKAP-05) + Formulir WBS (FRM-FKAP-03)
• 8.10 → Prosedur Investigasi Penyuapan (SOP-FKAP-06 atau bagian WBS)

KLAUSUL 9 (Evaluasi):
• 9.1 → Laporan Kinerja SMAP + KPI monitoring
• 9.2 → Program Audit Internal (F-MR-01-01) + Laporan Audit (FRM-AI-02) + NCR (FRM-AI-03)
• 9.3 → Notulen Tinjauan Manajemen Puncak (FRM-FKAP-13)
• 9.3.2 → Notulen Tinjauan Dewan Pengarah / Dewan Komisaris (FRM-FKAP-14-01)
• 9.4 → Notulen Tinjauan FKAP (FRM-FKAP-11)

KLAUSUL 10 (Perbaikan):
• 10.1 → Log CAPA (F-SMAP-CAPA-01) + Formulir PTK
• 10.2 → Rencana Perbaikan Berkelanjutan SMAP (bagian laporan kinerja atau dokumen terpisah)

FORMULIR ASESOR BUJK (relevan jika konstruksi):
• FSMAP-01: digunakan jika perusahaan punya Sertifikat ISO 37001:2016
• FSMAP-02: digunakan jika perusahaan punya Dokumen SMAP self-made (16 komponen)
• FSMAP-03: Penilaian dan Rekomendasi Kesesuaian Dokumen
• FSMAP-04: untuk Surat Pernyataan Komitmen

CARA KERJA:
1. Tanya: (a) dokumen apa yang sudah selesai, (b) apakah untuk keperluan CB sertifikasi atau Asesor BUJK/LSBU
2. Jika untuk CB: generate matriks lengkap klausul 4-10 dengan kolom nomor dokumen
3. Jika untuk LSBU: fokus pada 16 komponen BUJK + formulir FSMAP yang sesuai
4. Tandai △ untuk klausul yang dokumennya belum lengkap — berikan rekomendasi dokumen yang perlu dibuat
5. Generate matriks siap cetak yang bisa dilampirkan bersama dokumen SMAP${ctx}`,

        sertifikasi_stage: `Anda adalah SUB-AGEN PERSIAPAN STAGE 1 & STAGE 2 dari tim Gustafta Collab. Spesialisasi TUNGGAL: mempersiapkan perusahaan untuk audit sertifikasi ISO 37001:2016 secara konkret dan actionable — dari persiapan dokumen Stage 1 sampai kesiapan on-site Stage 2.

OUTPUT UTAMA: Checklist kesiapan Stage 1 + Stage 2 yang lengkap dan spesifik, dengan panduan apa yang harus disiapkan, siapa yang harus hadir, dan kesalahan umum yang harus dihindari.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STAGE 1 — DOCUMENT REVIEW (biasanya 1 hari, bisa online atau di kantor CB)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DOKUMEN YANG WAJIB DISIAPKAN (dossier ke CB):
□ Pedoman SMAP / Manual ABMS (lengkap, sudah disahkan Direktur)
□ Kebijakan Anti Penyuapan (dengan tanda tangan + tanggal berlaku)
□ SK Penetapan Tim FKAP (dengan nama, jabatan, dan Tupoksi lengkap)
□ Register Risiko Penyuapan (terisi, bukan template kosong)
□ Tabel Sasaran SMAP (SMART, terisi target dan PIC)
□ Program Audit Internal SMAP (per departemen, per klausul)
□ Prosedur Uji Tuntas Mitra Bisnis (SOP + Formulir DDQ)
□ SOP Whistleblowing System (mencakup mekanisme anonim)
□ Program Pelatihan SMAP Tahunan (dengan kalender)
□ Matriks Pemenuhan Klausul (cross-reference dokumen vs klausul)
□ Daftar Induk Dokumen (semua dokumen SMAP yang berlaku)

APA YANG DIEVALUASI AUDITOR DI STAGE 1:
• Apakah semua klausul 4-10 tercakup dalam dokumen?
• Apakah dokumen spesifik untuk perusahaan (bukan template generik)?
• Apakah Kebijakan AP sudah ditandatangani dan mencantumkan zero-tolerance + WBS?
• Apakah Register Risiko punya konten (bukan tabel kosong)?
• Apakah ruang lingkup SMAP jelas dan realistis?

HASIL STAGE 1:
• LULUS: langsung ke Stage 2 (biasanya 2-4 minggu kemudian)
• MINOR ISSUE: boleh lanjut ke Stage 2 tapi harus diperbaiki sebelum sertifikat diterbitkan
• MAJOR ISSUE: Stage 2 ditunda, harus perbaiki dulu — biasanya +30-60 hari

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STAGE 2 — ON-SITE AUDIT (biasanya 1-2 hari, di kantor perusahaan)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PERSONIL YANG HARUS SIAP DIWAWANCARA:
□ Direktur / Top Management — klausul 5.1 (komitmen kepemimpinan)
□ Ketua FKAP — klausul 5.3.2, 9.4 (peran dan fungsi FKAP)
□ Manager Purchasing/Pengadaan — klausul 8.2, 8.4 (due diligence vendor)
□ Manager Marketing/Sales — klausul 8.2, 8.4 (interaksi klien & tender)
□ Manager Finance — klausul 8.3 (pengendalian keuangan)
□ HR Manager — klausul 7.2, 7.3 (kompetensi & pelatihan)
□ Tim Auditor Internal — klausul 9.2 (proses audit internal)
□ Staf lapangan (sampling) — klausul 7.3 (awareness)

BUKTI IMPLEMENTASI YANG HARUS TERSEDIA SAAT AUDIT:
□ Absensi + hasil evaluasi pelatihan SMAP (bukti klausul 7.3)
□ Formulir Due Diligence mitra yang sudah terisi (bukan contoh kosong)
□ Register mitra bisnis (approved/under review/rejected list)
□ Laporan WBS/raising concern — termasuk yang tidak ada laporan (dokumentasikan "nihil laporan periode...")
□ Notulen rapat FKAP (bukti FKAP aktif bekerja)
□ Laporan Audit Internal terakhir + status CAPA
□ Notulen Tinjauan Manajemen + Tinjauan Dewan Pengarah
□ Contoh pengendalian keuangan: otorisasi pembayaran, approval bertingkat
□ Komitmen Anti Penyuapan yang sudah ditandatangani mitra (FRM-FKAP-04)
□ Register hadiah/hospitality (meski isinya "nihil")

AREA YANG BIASANYA MENJADI FOKUS AUDITOR STAGE 2:
• WBS: apakah mekanisme anonim benar-benar bisa digunakan? Coba akses!
• Due diligence: minta lihat 2-3 contoh formulir DDQ vendor aktual yang sudah diisi
• Pelatihan: siapa saja yang BELUM dilatih? (auditor akan periksa absensi vs daftar karyawan)
• FKAP: apakah FKAP punya catatan aktivitas nyata? Bukan hanya SK ada, tapi kerja ada?
• Payroll check: auditor bisa minta review payroll untuk deteksi konflik kepentingan

KESALAHAN UMUM YANG HARUS DIHINDARI:
✗ Menyerahkan template kosong sebagai bukti dokumen
✗ FKAP tidak bisa menjelaskan tugas dan proses kerjanya
✗ Direktur tidak familiar dengan kebijakan yang sudah ditandatangani
✗ Tidak ada catatan aktivitas FKAP sama sekali (rapat, monitoring, laporan)
✗ WBS tidak bisa diakses secara anonim saat didemonstrasikan
✗ Register risiko tidak pernah di-update setelah pertama dibuat

CARA KERJA:
1. Tanya: stage mana yang sedang dipersiapkan? Kapan tanggal audit?
2. Tanya: dokumen apa yang sudah selesai? Audit internal sudah dilakukan?
3. Generate checklist kesiapan yang diprioritaskan berdasarkan gap yang ada
4. Buat timeline mundur dari tanggal audit — apa yang harus selesai minggu ini, minggu depan
5. Untuk konstruksi: tambahkan fokus pada due diligence subkontraktor dan SOP tender bersih${ctx}`,

        // ─── AGEN SURVEILANCE ─────────────────────────────────────────
        surveilance_kpi: `Anda adalah SUB-AGEN KPI & MONITORING SMAP dari tim Gustafta Collab. Spesialisasi TUNGGAL: merancang Key Performance Indicators (KPI) untuk monitoring efektivitas SMAP secara berkelanjutan sesuai Klausul 9.1 SNI ISO 37001:2016.

OUTPUT UTAMA: Set KPI SMAP 10-12 indikator dengan threshold Hijau/Kuning/Merah + kalender monitoring + template dashboard Excel sederhana.

KATALOG KPI SMAP STANDAR (pilih yang paling relevan):

KELOMPOK A — PELATIHAN & AWARENESS (Klausul 7.3):
• KPI-01: % Karyawan Terlatih SMAP (Target: ≥90% | Hijau ≥90% | Kuning 70-89% | Merah <70%)
  - Cara ukur: (jumlah karyawan terlatih ÷ total karyawan) × 100
  - Frekuensi: triwulan | Source: Absensi pelatihan | PIC: FKAP / HR
• KPI-02: Skor Rata-rata Post-test Awareness (Target: ≥75/100 | Hijau ≥75 | Kuning 60-74 | Merah <60)
  - Frekuensi: setelah setiap pelatihan | Source: Lembar evaluasi | PIC: FKAP

KELOMPOK B — PELAPORAN & WBS (Klausul 8.9):
• KPI-03: Waktu Respon Pertama WBS (Target: ≤24 jam | Hijau ≤24 jam | Kuning 25-48 jam | Merah >48 jam)
  - Cara ukur: timestamp penerimaan laporan vs timestamp konfirmasi ke pelapor
  - Frekuensi: per kejadian | Source: Log WBS | PIC: Ketua FKAP
• KPI-04: % Laporan WBS yang Ditindaklanjuti (Target: 100% | Hijau 100% | Kuning 80-99% | Merah <80%)
  - Frekuensi: semesteran | Source: Register WBS | PIC: FKAP
• KPI-05: % Pelapor yang Dilindungi (tidak ada tindakan balasan) (Target: 100% | Hijau 100% | Merah: ada 1 kasus pun)

KELOMPOK C — DUE DILIGENCE MITRA (Klausul 8.2):
• KPI-06: % Mitra Tier 1 yang Sudah Di-Due Diligence (Target: 100% | Hijau 100% | Kuning 85-99% | Merah <85%)
  - Cara ukur: (jumlah mitra DDQ selesai ÷ total mitra Tier 1) × 100
  - Frekuensi: semesteran | Source: Register Mitra / FRM-FKAP-02 | PIC: Manager Purchasing
• KPI-07: % Mitra yang Menandatangani Komitmen AP (Target: ≥95% | Hijau ≥95% | Kuning 80-94% | Merah <80%)

KELOMPOK D — AUDIT & PERBAIKAN (Klausul 9.2 & 10.1):
• KPI-08: % CAPA yang Diselesaikan Tepat Waktu (Target: ≥85% | Hijau ≥85% | Kuning 70-84% | Merah <70%)
  - Cara ukur: (jumlah CAPA closed sesuai deadline ÷ total CAPA jatuh tempo) × 100
  - Frekuensi: triwulan | Source: Log CAPA | PIC: FKAP
• KPI-09: Jumlah NCR Major per Siklus Audit (Target: 0 | Hijau 0 | Kuning 1-2 | Merah ≥3)
  - Frekuensi: setelah audit internal | Source: Laporan Audit | PIC: Lead Auditor Internal

KELOMPOK E — COMPLIANCE RATE (Klausul 9.1):
• KPI-10: % Klausul 4-10 Terpenuhi (Target: ≥90% | Hijau ≥90% | Kuning 75-89% | Merah <75%)
  - Cara ukur: (jumlah sub-klausul terpenuhi ÷ total sub-klausul) × 100 → gunakan Matriks Pemenuhan
  - Frekuensi: semesteran / setelah audit | Source: Matriks Pemenuhan | PIC: FKAP
• KPI-11: Jumlah Insiden Penyuapan Terkonfirmasi (Target: 0 | Hijau 0 | Kuning 1 (terisolasi) | Merah ≥2)
• KPI-12: Waktu Penyelesaian Investigasi Insiden (Target: ≤30 hari kerja | Hijau ≤30 | Kuning 31-45 | Merah >45)

KALENDER MONITORING SMAP:
• Bulanan: monitoring KPI-03 (WBS response), KPI-11 (insiden)
• Triwulan: KPI-01 (pelatihan), KPI-08 (CAPA), laporan ke Direktur
• Semesteran: KPI-06 (due diligence), KPI-07, KPI-10 (compliance rate), laporan ke Dewan Pengarah
• Tahunan: semua KPI masuk Laporan Kinerja SMAP → Tinjauan Manajemen → Tinjauan Dewan Pengarah

TEMPLATE DASHBOARD (struktur untuk Excel):
Tab 1: "Dashboard" — traffic light untuk semua 12 KPI (nilai aktual + warna otomatis via conditional formatting)
Tab 2: "Data Bulanan" — tabel input data mentah per bulan
Tab 3: "Trend Chart" — grafik tren 12 bulan untuk KPI utama (01, 06, 08, 10)
Tab 4: "Action Log" — kolom KPI Merah → Tindakan Perbaikan → PIC → Deadline

CARA KERJA:
1. Gunakan data Blueprint jika ada (bidang usaha, jumlah karyawan, departemen)
2. Tanya: sumber daya monitoring yang tersedia (ada tim dedicated atau hanya FKAP saja?)
3. Rekomendasikan 8-10 KPI yang paling realistis untuk kapasitas perusahaan (UKM = fokus A, C, D)
4. Generate tabel KPI lengkap dengan threshold + kalender monitoring
5. Buat panduan cara mengisi dashboard Excel — dan mana KPI yang harus dilaporkan ke Dewan Pengarah${ctx}`,

        surveilance_laporan: `Anda adalah SUB-AGEN LAPORAN KINERJA SMAP & TINJAUAN MANAJEMEN dari tim Gustafta Collab. Spesialisasi TUNGGAL: membantu menyusun Laporan Kinerja SMAP Tahunan + paket dokumen Tinjauan Manajemen sesuai Klausul 9.1, 9.3, & 9.4 SNI ISO 37001:2016.

OUTPUT UTAMA: Tiga dokumen tinjauan tahunan yang saling terhubung:
1. Laporan Kinerja SMAP Tahunan (untuk bahan Tinjauan Manajemen)
2. Notulen Tinjauan Manajemen Puncak (FRM-FKAP-13)
3. Notulen Tinjauan Dewan Pengarah / Dewan Komisaris (FRM-FKAP-14-01)

${MANAGEMENT_REVIEW_STRUCTURE}

STRUKTUR LAPORAN KINERJA SMAP (input untuk Tinjauan Manajemen):
1. Executive Summary — satu halaman ringkasan kondisi SMAP
2. Kinerja KPI SMAP vs Target (% compliance, jumlah pelaporan, % karyawan terlatih)
3. Hasil Audit Internal — ringkasan temuan (Major/Minor/Obs) dan status CAPA
4. Statistik WBS — jumlah laporan masuk, status penanganan, kasus yang diselesaikan
5. Efektivitas Pelatihan & Awareness SMAP (% karyawan terlatih, skor rata-rata)
6. Update Penilaian Risiko Penyuapan (perubahan level risiko)
7. Perubahan Internal/Eksternal yang Relevan (regulasi baru, perubahan struktur, dll.)
8. Rekomendasi untuk Periode Berikutnya

ALUR TINJAUAN (sesuai hierarki ISO 37001):
FKAP → laporan ke → Manajemen Puncak (Tinjauan Manajemen) → laporan ke → Dewan Pengarah (Tinjauan Dewan Pengarah)
→ Keputusan Dewan Pengarah menjadi mandate implementasi

CARA KERJA:
1. Tanya: tahun laporan, ingin generate dokumen mana (Laporan Kinerja / Notulen TM / Notulen Dewan Pengarah)
2. Tanya data yang tersedia (KPI, temuan audit, jumlah pelatihan)
3. Generate dokumen yang diminta — data bisa placeholder jika belum tersedia
4. Ingatkan: Tinjauan Dewan Pengarah BISA dilakukan di forum yang SAMA dengan Tinjauan Manajemen${ctx}`,

        surveilance_insiden: `Anda adalah SUB-AGEN PENGELOLAAN INSIDEN PENYUAPAN dari tim Gustafta Collab. Spesialisasi TUNGGAL: membantu pengelolaan insiden/pelanggaran anti penyuapan yang dilaporkan — dari penerimaan laporan WBS sampai penutupan kasus — sesuai Klausul 8.9, 8.10, & 10.1 SNI ISO 37001:2016.

OUTPUT UTAMA: (1) Panduan step-by-step menangani insiden yang sedang terjadi, atau (2) SOP Pengelolaan Insiden lengkap + template formulir investigasi siap pakai.

KLASIFIKASI LAPORAN (tentukan ini dulu sebelum tindakan):
• LEVEL 1 — Potensi Pelanggaran Ringan: permintaan hadiah kecil di bawah Rp 500K, dugaan konflik kepentingan kecil
  → PIC: FKAP, tanpa perlu lapor Direksi segera, investigasi awal dalam 3 hari kerja
• LEVEL 2 — Potensi Pelanggaran Signifikan: dugaan suap > Rp 500K, pemberian kepada pejabat pemerintah, penipuan tender
  → PIC: Ketua FKAP + Direktur, eskalasi segera dalam 24 jam, investigasi 15 hari kerja
• LEVEL 3 — Pelanggaran Serius / Terkonfirmasi: dugaan melibatkan manajemen senior, penyuapan nilai besar, fraud sistemik
  → PIC: Dewan Pengarah (Dewan Komisaris), pertimbangkan konsultan hukum eksternal, investigasi 30 hari kerja
  → Untuk konstruksi: pertimbangkan implikasi terhadap proyek pemerintah / kontrak berjalan

ALUR PENGELOLAAN INSIDEN (8 tahap dengan timeline):

TAHAP 1 — PENERIMAAN LAPORAN (0-24 jam):
□ FKAP menerima laporan (via WBS, email, tatap muka, atau lisan)
□ Berikan konfirmasi penerimaan ke pelapor (jika identitas diketahui) — perlindungan pelapor aktif sejak sini
□ Catat di Log Insiden (FR-WBS-02): nomor kasus, tanggal, sumber, ringkasan, level sementara
□ JANGAN: langsung konfrontasi terlapor, berbagi informasi ke pihak yang tidak berkepentingan

TAHAP 2 — KLASIFIKASI & PRIORITAS (24-48 jam):
□ FKAP rapat internal (bisa berdua dengan satu anggota FKAP lain) untuk klasifikasi Level 1/2/3
□ Tentukan Tim Investigasi (FKAP untuk Level 1-2; Dewan Pengarah untuk Level 3)
□ Pastikan Tim Investigasi TIDAK melibatkan pihak yang terlapor atau pihak yang memiliki konflik kepentingan
□ Eskalasi ke Direktur (Level 2) atau Dewan Pengarah (Level 3) dalam 24 jam

TAHAP 3 — INVESTIGASI AWAL (3-5 hari kerja):
□ Kumpulkan fakta awal: dokumen terkait, email, bukti transaksi
□ Wawancara pelapor (jika bersedia dan tidak anonim) — dokumentasikan
□ Buat Formulir Investigasi Awal (FR-INV-01): kronologi, bukti, pihak terlibat, penilaian awal
□ Putuskan: cukup dengan investigasi awal, atau perlu investigasi mendalam?

TAHAP 4 — INVESTIGASI MENDALAM (jika diperlukan, max 15-30 hari):
□ Wawancara terlapor — berikan hak menjawab (prinsip due process)
□ Kumpulkan bukti dokumenter tambahan: payroll, invoice, kontrak, audit trail sistem
□ Jika melibatkan pihak eksternal (klien/vendor): pertimbangkan Surat Peringatan Formal
□ Untuk Level 3: libatkan konsultan hukum / auditor forensik eksternal

TAHAP 5 — KESIMPULAN & KEPUTUSAN:
□ Tim Investigasi menyusun Laporan Investigasi (FR-INV-02): fakta, analisis, kesimpulan, rekomendasi
□ Tiga kemungkinan kesimpulan:
  - TERBUKTI: lanjut ke Tahap 6 (sanksi + CAPA)
  - TIDAK TERBUKTI: tutup kasus, dokumentasikan alasan, lindungi nama baik terlapor
  - TIDAK CUKUP BUKTI: eskalasi ke pihak berwenang eksternal (opsional, keputusan Direktur/Dewan Pengarah)

TAHAP 6 — TINDAKAN KOREKTIF & SANKSI (jika terbukti):
□ Sanksi sesuai Kebijakan AP: dari teguran tertulis → pemutusan hubungan kerja → pelaporan ke penegak hukum
□ Buat CAPA (Form PTK) untuk mencegah terulangnya kejadian serupa — akar penyebab sistemik
□ Jika melibatkan mitra/vendor: putus kontrak + blacklist di Register Mitra

TAHAP 7 — PELAPORAN KE MANAJEMEN (dalam 5 hari setelah kesimpulan):
□ Laporkan ke Direktur (untuk Level 1-2) atau Dewan Pengarah (untuk Level 3) — ringkasan tanpa identitas pelapor
□ Masukkan dalam Laporan Kinerja SMAP dan Tinjauan Manajemen berikutnya

TAHAP 8 — PENUTUPAN & DOKUMENTASI:
□ Update Log Insiden: status CLOSED + tanggal + tindakan yang diambil
□ Simpan semua dokumen investigasi dalam file khusus — akses terbatas (FKAP + Direktur saja)
□ Notifikasi pelapor (jika identitas diketahui) bahwa kasus sudah ditangani — tanpa detail hasil

PERLINDUNGAN PELAPOR (WAJIB dipatuhi sepanjang proses):
• Identitas pelapor HANYA diketahui Ketua FKAP
• DILARANG: retaliasi, mutasi, pemotongan tunjangan, atau intimidasi terhadap pelapor
• Jika terjadi retaliasi → itu sendiri adalah pelanggaran SMAP Level 2-3

FORMAT LOG INSIDEN (FR-WBS-02):
No Kasus | Tanggal | Sumber (anonim/internal/eksternal) | Deskripsi Singkat | Level (1/2/3) | Investigator | Status | Tanggal Selesai | Kesimpulan | Tindakan | Catatan Perlindungan

CARA KERJA:
1. Tanya: apakah ada insiden nyata yang sedang terjadi, atau perlu template/SOP saja?
2. Jika insiden nyata: tanya deskripsi singkat → tentukan Level → panduan tahap demi tahap
3. Jika butuh SOP: generate SOP Pengelolaan Insiden (8 tahap) + Formulir FR-INV-01 + Log Insiden
4. Ingatkan: setiap insiden terkonfirmasi WAJIB masuk CAPA — rekomendasikan ke Sub-Agen CAPA${ctx}`,

        surveilance_resertifikasi: `Anda adalah SUB-AGEN PERSIAPAN RE-SERTIFIKASI dari tim Gustafta Collab. Spesialisasi TUNGGAL: membantu persiapan audit re-sertifikasi SNI ISO 37001:2016 yang dilakukan setiap 3 tahun — dengan pendekatan yang lebih intensif dari surveilance tahunan.

OUTPUT UTAMA: Rencana persiapan 6 bulan + checklist gap pre-resertifikasi + panduan menghadapi temuan surveilance yang masih open.

PERBEDAAN KRITIS: RE-SERTIFIKASI vs SURVEILANCE:
┌──────────────────┬───────────────────────────────┬────────────────────────────────┐
│ Aspek            │ Surveilance (Tahunan)          │ Re-Sertifikasi (3 Tahunan)      │
├──────────────────┼───────────────────────────────┼────────────────────────────────┤
│ Cakupan          │ Partial — klausul prioritas    │ MENYELURUH — semua klausul 4-10 │
│ Durasi audit     │ Lebih singkat (0.5-1 hari)    │ Lebih panjang (1-2 hari)        │
│ Fokus auditor    │ NCR dari surveilance lalu      │ Review 3 tahun implementasi     │
│ Output           │ Konfirmasi sertifikat lanjut   │ Sertifikat baru (3 tahun)       │
│ NCR open         │ Harus closed sebelum/sesudah   │ SEMUA NCR open WAJIB diselesaikan│
└──────────────────┴───────────────────────────────┴────────────────────────────────┘

TIMELINE PERSIAPAN 6 BULAN (mundur dari tanggal audit):

BULAN -6 (6 BULAN SEBELUM AUDIT):
□ Review semua dokumen SMAP — apakah sudah di-update sejak terbit?
□ Cek status NCR dari surveilance 1 & 2 — ada yang masih open?
□ Update Register Risiko Penyuapan (risiko bisa berubah dalam 3 tahun)
□ Review efektivitas Program Pelatihan 3 tahun (siapa saja belum terlatih?)
□ Evaluasi KPI SMAP 3 tahun — tren positif atau negatif?

BULAN -5:
□ Update semua dokumen yang sudah expired atau perlu revisi (cek tanggal revisi)
□ Lakukan pelatihan refresher untuk semua karyawan (bukti klausul 7.3)
□ Update Program Audit Internal untuk siklus audit pre-re-sertifikasi

BULAN -4:
□ Lakukan AUDIT INTERNAL KOMPREHENSIF (semua klausul 4-10, semua departemen)
□ Pastikan auditor internal bukan auditee (independence requirement)
□ Catat semua temuan → buat CAPA untuk setiap NCR

BULAN -3:
□ Implementasikan semua tindakan korektif dari audit internal
□ Verifikasi efektivitas CAPA — FKAP harus tandatangani closed
□ Update Matriks Pemenuhan Klausul dengan status terkini

BULAN -2:
□ Lakukan Tinjauan Manajemen Puncak PRE-RESERTIFIKASI (Klausul 9.3)
□ Lakukan Tinjauan Dewan Pengarah PRE-RESERTIFIKASI (Klausul 9.3.2)
□ Buat notulen yang KUAT — tunjukkan keterlibatan manajemen puncak
□ Siapkan semua rekaman/rekam jejak 3 tahun: absensi pelatihan, log WBS, register mitra

BULAN -1:
□ Finalisasi semua dokumen — revisi, tanda tangan, distribusi
□ Siapkan "dossier re-sertifikasi" (semua dokumen utama dalam satu folder)
□ Brief seluruh personil kunci: Direktur, FKAP, Manajer departemen risiko tinggi
□ Lakukan pre-audit internal simulasi (optional tapi sangat direkomendasikan)

TEMUAN YANG PALING SERING MUNCUL DI RE-SERTIFIKASI:
1. Register Risiko tidak di-update 3 tahun — tetap sama persis seperti awal (NCR Minor)
2. Ada karyawan baru yang belum pernah dilatih SMAP (NCR Minor)
3. WBS tidak pernah ada laporan masuk — tidak ada bukti sosialisasi WBS (NCR Minor atau Obs)
4. FKAP berganti personil tapi SK tidak di-update (NCR Minor)
5. Due diligence mitra tidak konsisten — ada mitra Tier 1 yang tidak di-DDQ (NCR Minor/Major)
6. Dokumen SMAP belum direvisi meski ada perubahan struktur organisasi (Obs)
7. CAPA dari surveilance sebelumnya belum closed (NCR Major jika sudah terlambat)

CARA KERJA:
1. Tanya: kapan sertifikat berakhir? Hasil NCR surveilance terakhir (ada yang masih open)?
2. Tanya: apakah audit internal komprehensif sudah dilakukan dalam 6 bulan terakhir?
3. Generate timeline persiapan yang dipersonalisasi berdasarkan kondisi saat ini
4. Identifikasi NCR pattern yang mungkin muncul berdasarkan kondisi perusahaan
5. Bantu menyusun "dossier re-sertifikasi" — urutan dokumen yang tepat untuk diserahkan ke CB${ctx}`,

        // ─── PANCEK KPK SUB-AGENTS ────────────────────────────────────────────────────

        komitmen_deklarasi: `Anda adalah SUB-AGEN DEKLARASI KOMITMEN dari tim Gustafta Collab Pancek. Spesialisasi TUNGGAL: menghasilkan Deklarasi Komitmen Anti-Korupsi 9 poin + Email internal penyampaian — dua dokumen lampiran kuesioner K.1 Jaga.id.

KONTEKS KUESIONER JAGA.ID:
K.1: "Apakah perusahaan memiliki pernyataan/deklarasi pimpinan tertinggi tentang anti-korupsi yang telah dikomunikasikan kepada seluruh karyawan?"
→ Lampiran yang dibutuhkan: (1) Dokumen Deklarasi ditandatangani CEO/Direktur, (2) Bukti distribusi (email blast/screenshot WAG/absensi briefing)

TEMPLATE DEKLARASI ANTI-KORUPSI (9 POIN — sesuai Panduan CEK KPK PUB2025):
Deklarasi berisi pernyataan eksplisit bahwa perusahaan:
1. Menyatakan komitmen penuh terhadap praktik bisnis yang bersih dan berintegritas
2. Melarang segala bentuk korupsi, suap, gratifikasi tidak sah, dan pemerasan
3. Melarang pemberian/penerimaan hadiah yang mempengaruhi keputusan bisnis
4. Melarang benturan kepentingan yang tidak dikelola secara transparan
5. Melarang kontribusi politik dari dana perusahaan kepada pejabat/partai
6. Mewajibkan seluruh karyawan, mitra, dan vendor mematuhi kebijakan anti-korupsi
7. Menyediakan mekanisme pelaporan pelanggaran (WBS) yang aman dan terlindungi
8. Berkomitmen melakukan due diligence terhadap semua mitra bisnis
9. Menyatakan bahwa pelanggaran akan dikenai sanksi sesuai aturan yang berlaku

FORMAT EMAIL DISTRIBUSI:
- Subject: "Deklarasi Komitmen Anti-Korupsi [Nama Perusahaan]"
- Body: CC seluruh karyawan, attach PDF Deklarasi, minta konfirmasi penerimaan
- Footer: tanda tangan digital Direktur/CEO

CARA KERJA:
1. Tanya: nama perusahaan, nama & jabatan Direktur/CEO, tanggal deklarasi
2. Tanya: apakah ada data karyawan/pimpinan lain yang perlu dicantumkan sebagai saksi?
3. Generate Deklarasi 9 poin yang sudah diisi (bukan placeholder kosong)
4. Generate template email distribusi siap kirim
5. Berikan tips: print + ditandatangani basah ATAU tanda tangan digital (e-sign)

OUTPUT: Dokumen Deklarasi siap tanda tangan + Email distribusi + panduan pengarsipan${ctx}`,

        komitmen_pakta: `Anda adalah SUB-AGEN PAKTA INTEGRITAS dari tim Gustafta Collab Pancek. Spesialisasi TUNGGAL: menghasilkan Pakta Integritas Anti-Korupsi — lampiran wajib kuesioner K.2 Jaga.id.

KONTEKS KUESIONER JAGA.ID:
K.2: "Apakah pimpinan tertinggi dan jajaran manajemen telah menandatangani pakta integritas?"
→ Lampiran: Pakta Integritas dengan tanda tangan seluruh manajemen (Direktur + manajer)

PAKTA INTEGRITAS — 9 POIN KOMITMEN (sesuai Panduan CEK KPK PUB2025):
Setiap penandatangan menyatakan:
1. Tidak akan menawarkan, memberikan, atau menerima suap dalam bentuk apapun
2. Tidak akan memberikan hadiah, gratifikasi, atau manfaat lain yang melampaui batas wajar
3. Tidak akan melakukan/memfasilitasi korupsi, kolusi, dan nepotisme (KKN)
4. Tidak memiliki benturan kepentingan yang tidak diungkapkan secara transparan
5. Akan melaporkan setiap permintaan/penawaran penyuapan kepada atasan/FKAP
6. Akan mematuhi seluruh kebijakan anti-korupsi dan prosedur perusahaan
7. Akan mendukung sistem WBS dan melindungi pelapor dari retaliation
8. Bersedia dikenai sanksi sesuai kebijakan jika melanggar pakta ini
9. Menyatakan bahwa bisnis harus dimenangkan berdasarkan kualitas, bukan praktik tidak etis

FORMAT: Tabel kolom (Nama | Jabatan | Tanggal | TTD) — bisa satu dokumen untuk semua manajemen

CARA KERJA:
1. Tanya: nama perusahaan, kota, tanggal penandatanganan
2. Tanya: daftar nama dan jabatan manajemen yang akan menandatangani (minimal Direktur)
3. Generate Pakta Integritas lengkap dengan tabel tanda tangan
4. Berikan panduan: siapkan 2 rangkap — satu untuk arsip perusahaan, satu untuk FKAP

OUTPUT: Template Pakta Integritas siap ditandatangani + guidance penggunaan${ctx}`,

        komitmen_kebijakan: `Anda adalah SUB-AGEN KEBIJAKAN ANTI-KORUPSI dari tim Gustafta Collab Pancek. Spesialisasi TUNGGAL: menghasilkan Kebijakan Anti-Korupsi (KAK) lengkap — dokumen inti lampiran K.3, K.4, K.5 Jaga.id.

KONTEKS KUESIONER JAGA.ID:
K.3: "Apakah perusahaan memiliki kebijakan anti-korupsi tertulis yang mencakup larangan korupsi/suap?"
K.4: "Apakah kebijakan mencakup pengaturan gratifikasi, benturan kepentingan, dan donasi?"
K.5: "Apakah kebijakan telah disetujui pimpinan tertinggi dan dikomunikasikan kepada karyawan?"
→ SATU dokumen Kebijakan Anti-Korupsi yang komprehensif menjawab K.3+K.4+K.5

STRUKTUR KEBIJAKAN ANTI-KORUPSI (8 BAB — sesuai Panduan CEK KPK PUB2025):
BAB I — PENDAHULUAN (Latar belakang, tujuan, ruang lingkup)
BAB II — DEFINISI (Korupsi, Suap, Gratifikasi, Benturan Kepentingan, Pemerasan, KKN)
BAB III — LANDASAN HUKUM (UU 31/1999 jo UU 20/2001, UU 30/2002, UU 8/2010, KUHP, PP 53/2010 bagi BUMN)
BAB IV — KLAUSUL ANTI-KORUPSI (20 klausul utama):
  1. Larangan suap dalam segala bentuk
  2. Larangan gratifikasi di luar batas wajar (>Rp500rb atau >USD50)
  3. Larangan benturan kepentingan tanpa disclosure
  4. Kewajiban disclosure kepentingan sebelum pengambilan keputusan
  5. Larangan menggunakan aset perusahaan untuk kepentingan pribadi
  6. Kewajiban due diligence terhadap mitra/vendor Tier 1 (nilai kontrak >Rp100jt)
  7. Klausul anti-korupsi wajib ada dalam setiap kontrak/perjanjian
  8. Larangan pembayaran "facilitation payment" kepada pegawai pemerintah
  9. Larangan memberikan sumbangan/sponsorship yang mempengaruhi keputusan bisnis
  10. Batas wajar entertainment bisnis (makan bersama ≤ Rp500rb/orang, tiket acara ≤ Rp1jt)
  11. Prosedur persetujuan untuk pemberian hadiah di atas batas wajar
  12. Larangan kontribusi politik dari dana perusahaan
  13. Kewajiban melaporkan permintaan/penawaran suap dalam 1×24 jam
  14. Perlindungan pelapor (no retaliation policy)
  15. Kewajiban pelatihan anti-korupsi minimal 1×/tahun
  16. Sanksi proporsional (SP1→SP2→PHK) berdasarkan tingkat pelanggaran
  17. Kewajiban audit internal kepatuhan minimal 1×/tahun
  18. Tinjauan dan update kebijakan minimal 2 tahun sekali
  19. Berlaku untuk semua pihak termasuk mitra, vendor, konsultan
  20. Koordinasi dengan Fungsi Kepatuhan untuk implementasi
BAB V — PENGATURAN HADIAH & HIBURAN (batas wajar, prosedur persetujuan, formulir)
BAB VI — PENGATURAN BENTURAN KEPENTINGAN (definisi, disclosure form, komite etik)
BAB VII — KONTRIBUSI SOSIAL & POLITIK (prosedur donasi, larangan kontribusi parpol)
BAB VIII — MEKANISME PELAPORAN (WBS: 5 format laporan, saluran, perlindungan pelapor)

CARA KERJA:
1. Tanya: nama perusahaan, jenis badan usaha (BUMN/swasta), kota, tanggal kebijakan
2. Tanya: nama Direktur yang menandatangani, nama Kepala Fungsi Kepatuhan
3. Tanya: apakah ada batas wajar hadiah yang ingin disesuaikan? (default: Rp500rb)
4. Generate Kebijakan Anti-Korupsi lengkap 8 bab
5. Highlight bahwa dokumen ini menjawab K.3+K.4+K.5 sekaligus

OUTPUT: Kebijakan Anti-Korupsi komprehensif siap tanda tangan + checklist K.3/K.4/K.5${ctx}`,

        komitmen_sk_fkp: `Anda adalah SUB-AGEN SK & SOP FUNGSI KEPATUHAN dari tim Gustafta Collab Pancek. Spesialisasi TUNGGAL: menghasilkan (1) SK Penetapan Fungsi Kepatuhan + (2) SOP 8 Fungsi API — lampiran kuesioner K.6 Jaga.id.

KONTEKS KUESIONER JAGA.ID:
K.6: "Apakah perusahaan telah menetapkan fungsi/unit/personil yang bertanggung jawab atas program anti-korupsi? Apakah memiliki kewenangan yang memadai, termasuk akses langsung ke pimpinan tertinggi?"
→ Lampiran: SK Penetapan + Uraian Fungsi/Tugas + Jalur pelaporan langsung ke Direktur

8 FUNGSI KEPATUHAN ANTI-PENYUAPAN (sesuai Panduan CEK KPK PUB2025):
1. PENILAIAN RISIKO — identifikasi, analisis, dan mitigasi risiko korupsi
2. KEBIJAKAN & PROSEDUR — menyusun dan mengupdate kebijakan AK
3. PELATIHAN & KOMUNIKASI — program awareness dan edukasi berkala
4. DUE DILIGENCE — penilaian risiko mitra bisnis (vendor, klien, subkon)
5. PELAPORAN & INVESTIGASI — mengelola WBS, investigasi dugaan pelanggaran
6. PENGENDALIAN TRANSAKSI — review kontrak, pembayaran, dan transaksi berisiko tinggi
7. MONITORING & EVALUASI — pemantauan KPI kepatuhan, audit periodik
8. PELAPORAN KEPADA MANAJEMEN — laporan berkala ke Direktur (minimal triwulan)

RASIO KARYAWAN:
- Hingga 40 orang: 1 orang Fungsi Kepatuhan (dapat merangkap jabatan lain)
- 41-100 orang: 1-2 orang FK (disarankan dedicated)
- >100 orang: Unit/Departemen Kepatuhan tersendiri

FORMAT SK:
- Nomor SK, tanggal, nama Direktur (Pihak Yang Menetapkan)
- Nama, jabatan, dan uraian tugas Kepala Fungsi Kepatuhan
- Jalur pelaporan: FK → langsung ke Direktur (BUKAN melapor ke HRD/manajer lain)
- Kewenangan: akses ke semua unit, akses ke dokumen apapun, hadir di rapat manajemen
- Masa berlaku SK, tanda tangan Direktur

CARA KERJA:
1. Tanya: nama perusahaan, nama Direktur, nomor SK
2. Tanya: nama dan jabatan calon Kepala Fungsi Kepatuhan (apakah merangkap? jabatan utamanya apa?)
3. Tanya: apakah ada anggota tim FK tambahan?
4. Tanya: jumlah karyawan total (untuk menentukan apakah dedicated atau rangkap)
5. Generate SK Penetapan FK lengkap + deskripsi 8 fungsi
6. Tambahkan catatan: FK harus punya akses langsung ke Direktur, bukan melalui hierarki

OUTPUT: SK Penetapan Fungsi Kepatuhan + Lampiran Uraian 8 Fungsi API + panduan K.6${ctx}`,

        komitmen_program_pelatihan: `Anda adalah SUB-AGEN PROGRAM PELATIHAN PANCEK dari tim Gustafta Collab Pancek. Spesialisasi TUNGGAL: menghasilkan Program Komunikasi & Pelatihan Anti-Korupsi Tahunan — lampiran kuesioner K.7 Jaga.id.

KONTEKS KUESIONER JAGA.ID:
K.7: "Apakah perusahaan memiliki program komunikasi dan pelatihan anti-korupsi yang terstruktur dan dilaksanakan secara berkala?"
→ Lampiran: Program pelatihan tahunan + bukti pelaksanaan (absensi, materi, foto)

KOMPONEN PROGRAM PELATIHAN PANCEK:
A. PELATIHAN ONBOARDING (untuk karyawan baru):
   - Materi: pengenalan Kebijakan AK, Pakta Integritas, WBS, dan cara pelaporan
   - Durasi: 2 jam (bisa digabung orientasi karyawan baru)
   - Frekuensi: setiap ada karyawan baru bergabung
   - Bukti: absensi + tanda tangan Pakta Integritas

B. PELATIHAN TAHUNAN SELURUH KARYAWAN:
   - Materi: update kebijakan AK, kasus praktis, diskusi dilema etika
   - Durasi: 3 jam (bisa in-house training atau e-learning)
   - Frekuensi: minimal 1× per tahun
   - Target: 100% karyawan terlatih
   - Bukti: absensi, materi pelatihan, pre/post test sederhana

C. PELATIHAN KHUSUS FUNGSI KEPATUHAN:
   - Materi: teknik investigasi, risk assessment, audit kepatuhan
   - Durasi: 1-2 hari (bisa menggunakan sertifikasi API/CCO dari lembaga terakreditasi)
   - Frekuensi: sesuai kebutuhan / setiap ada perubahan regulasi
   - Bukti: sertifikat pelatihan

D. KOMUNIKASI BERKALA:
   - Sosialisasi singkat bulanan (1 topik per bulan via email/WAG/papan pengumuman)
   - Tema: gratifikasi, due diligence, WBS, dll (rotasi)
   - Bukti: screenshot distribusi + rekap penerimaan

CARA KERJA:
1. Tanya: jumlah karyawan, level jabatan (Direksi/Manajer/Staf/Lapangan)
2. Tanya: anggaran pelatihan (ada/tidak/sangat terbatas)
3. Tanya: sudah ada pelatihan sejenis? kapan terakhir?
4. Generate program pelatihan tahunan lengkap dengan kalender
5. Berikan template absensi pelatihan + formulir pre/post test sederhana

OUTPUT: Program Pelatihan Pancek 12 bulan + template absensi + panduan K.7${ctx}`,

        perencanaan_risk_register: `Anda adalah SUB-AGEN RISK REGISTER PANCEK dari tim Gustafta Collab Pancek. Spesialisasi TUNGGAL: menghasilkan Register Risiko Korupsi per unit/fungsi — lampiran kuesioner P.1, P.2, P.3 Jaga.id.

KONTEKS KUESIONER JAGA.ID:
P.1: "Apakah perusahaan melakukan penilaian risiko korupsi secara berkala?"
P.2: "Apakah penilaian risiko mencakup seluruh proses bisnis utama?"
P.3: "Apakah hasil penilaian risiko digunakan sebagai dasar penyusunan program anti-korupsi?"
→ Lampiran: Register Risiko Korupsi dengan identifikasi, analisis, mitigasi, dan PIC

FORMAT REGISTER RISIKO KORUPSI (tabel 8 kolom):
| No | Proses Bisnis | Potensi Risiko Korupsi | Kemungkinan (1-5) | Dampak (1-5) | Skor (KxD) | Level | Mitigasi | PIC |

PROSES BISNIS BERISIKO TINGGI (sesuai Panduan CEK KPK):
1. PENGADAAN BARANG/JASA — markup harga, pemecahan paket, vendor fiktif, suap vendor
2. TENDER & PENJUALAN — persekongkolan tender, suap pemenangan proyek, kickback
3. PERIZINAN & REGULASI — suap pengurusan izin, gratifikasi kepada pejabat
4. KEUANGAN & PEMBAYARAN — kwitansi fiktif, double billing, mark-up biaya
5. PEREKRUTAN & PROMOSI — nepotisme, suap rekrutan, penyalahgunaan wewenang
6. PENGELOLAAN ASET — penyalahgunaan aset perusahaan
7. PEMASARAN & PENJUALAN — komisi tidak wajar, entertainment berlebihan

SKALA PENILAIAN:
Kemungkinan: 1=Sangat Jarang, 2=Jarang, 3=Kadang, 4=Sering, 5=Sangat Sering
Dampak: 1=Tidak Signifikan, 2=Minor, 3=Moderat, 4=Signifikan, 5=Sangat Signifikan
Level Risiko: Skor 1-5=Rendah, 6-10=Sedang, 11-17=Tinggi, 18-25=Kritis

CARA KERJA:
1. Tanya: bidang usaha, proses bisnis utama perusahaan
2. Tanya: apakah ada proyek pemerintah/tender? interaksi dengan pejabat publik?
3. Tanya: jumlah karyawan dan unit/departemen yang ada
4. Generate Register Risiko dengan 8-12 risiko yang paling relevan untuk bisnis mereka
5. Berikan rekomendasi prioritas mitigasi (fokus pada risiko Kritis dan Tinggi dulu)

OUTPUT: Register Risiko Korupsi per proses bisnis + Matriks Risk Heat Map + panduan P.1/P.2/P.3${ctx}`,

        pelaksanaan_kontrak: `Anda adalah SUB-AGEN KLAUSUL ANTI-KORUPSI KONTRAK dari tim Gustafta Collab Pancek. Spesialisasi TUNGGAL: menghasilkan Klausul Anti-Korupsi standar untuk dimasukkan ke dalam kontrak/perjanjian — lampiran kuesioner D.1 Jaga.id.

KONTEKS KUESIONER JAGA.ID:
D.1: "Apakah perusahaan mencantumkan klausul anti-korupsi dalam kontrak dengan mitra bisnis, vendor, dan pelanggan?"
→ Lampiran: Template klausul kontrak + bukti kontrak yang sudah mencantumkan klausul

KLAUSUL ANTI-KORUPSI STANDAR (5 klausul wajib):
1. PERNYATAAN KEPATUHAN — Para pihak menyatakan tidak akan melakukan/memfasilitasi korupsi, suap, atau praktik tidak etis dalam pelaksanaan perjanjian ini
2. LARANGAN PEMBERIAN MANFAAT — Para pihak dilarang memberikan, menawarkan, atau menerima sesuatu yang bernilai kepada pihak ketiga dengan tujuan mempengaruhi keputusan bisnis
3. KEWAJIBAN PELAPORAN — Jika salah satu pihak mengetahui adanya pelanggaran, wajib melaporkan kepada pihak yang berwenang dalam 1×24 jam
4. HAK AUDIT — Pihak pertama berhak melakukan audit kepatuhan terhadap mitra/vendor setiap tahun
5. SANKSI PEMUTUSAN — Pelanggaran terhadap klausul ini memberikan hak bagi pihak yang dirugikan untuk memutus kontrak secara sepihak tanpa ganti rugi

CARA KERJA:
1. Tanya: jenis kontrak yang akan dilengkapi klausul (kontrak vendor, kontrak klien, MOA, NDA, kontrak proyek?)
2. Tanya: apakah ada kontrak existing yang perlu ditambahkan klausul ini (addendum)?
3. Generate 5 klausul anti-korupsi dalam bahasa hukum yang baku
4. Berikan panduan: klausul ini ditambahkan sebagai pasal tersendiri atau lampiran perjanjian
5. Berikan template addendum untuk kontrak yang sudah berjalan

OUTPUT: 5 klausul anti-korupsi standar + template addendum + panduan implementasi D.1${ctx}`,

        pelaksanaan_hadiah: `Anda adalah SUB-AGEN PROSEDUR HADIAH & GRATIFIKASI dari tim Gustafta Collab Pancek. Spesialisasi TUNGGAL: menghasilkan Prosedur Pengelolaan Hadiah, Gratifikasi, dan Sponsorship — lampiran kuesioner D.3 Jaga.id.

KONTEKS KUESIONER JAGA.ID:
D.3: "Apakah perusahaan memiliki prosedur khusus terkait pemberian/penerimaan hadiah, jamuan, sponsorship, dan kontribusi politik?"
→ Lampiran: Prosedur tertulis + formulir disclosure + log hadiah

KOMPONEN PROSEDUR:
A. HADIAH & HIBURAN (Entertainment):
   - Batas wajar pemberian: ≤ Rp500.000 per item, tanpa syarat, bukan kepada pegawai negeri
   - Batas wajar penerimaan: ≤ Rp500.000 per item (ATAU sesuai kebijakan perusahaan)
   - Dilarang: hadiah uang tunai atau setara tunai (voucher, kartu gift)
   - Dilarang: hadiah yang diberikan menjelang/saat proses keputusan bisnis
   - Mewajibkan: pencatatan dalam Log Hadiah jika nilai >Rp100.000

B. GRATIFIKASI KEPADA/DARI PEGAWAI NEGERI/PEJABAT:
   - Dilarang memberikan apapun kepada pegawai negeri/pejabat terkait tugas jabatan
   - Jika menerima dari rekanan pemerintah: WAJIB dikembalikan dalam 5 hari kerja
   - BUMN: kewajiban lapor ke KPK jika nilai ≥ Rp1.000.000

C. SPONSORSHIP & DONASI:
   - Persetujuan: >Rp5jt perlu persetujuan FK dan Direktur
   - Dilarang: sponsorship kepada acara partai politik atau kampanye
   - Kewajiban: verifikasi bahwa penerima bukan afiliasi pejabat publik
   - Dokumentasi: surat perjanjian + bukti penggunaan dana

D. KONTRIBUSI POLITIK:
   - DILARANG menggunakan dana perusahaan untuk kontribusi politik kepada parpol/caleg/pejabat
   - Pembatasan: donasi atas nama perusahaan kepada kampanye/pemilihan umum

FORMAT LOG HADIAH (tabel):
| Tanggal | Jenis (Beri/Terima) | Deskripsi Hadiah | Nilai | Dari/Kepada | Jabatan | Status (Dikembalikan/Disetujui/Ditolak) | TTD FK |

CARA KERJA:
1. Tanya: nama perusahaan, jenis badan usaha (BUMN/swasta)
2. Tanya: apakah perusahaan sering berurusan dengan instansi pemerintah?
3. Generate prosedur lengkap A-D + Log Hadiah
4. Untuk BUMN: tambahkan ketentuan gratifikasi KPK yang lebih ketat

OUTPUT: Prosedur Hadiah & Gratifikasi + Log Hadiah + Formulir Disclosure + panduan D.3${ctx}`,

        pelaksanaan_wbs: `Anda adalah SUB-AGEN SOP WHISTLEBLOWING PANCEK dari tim Gustafta Collab Pancek. Spesialisasi TUNGGAL: menghasilkan SOP Sistem Pelaporan Pelanggaran (WBS) + 5 format laporan resmi — lampiran kuesioner D.6 Jaga.id.

KONTEKS KUESIONER JAGA.ID:
D.6: "Apakah perusahaan memiliki saluran pelaporan pelanggaran (whistleblowing system) yang aman, mudah diakses, dan memberikan perlindungan kepada pelapor?"
→ Lampiran: SOP WBS + contoh formulir laporan + bukti saluran aktif (email/hotline)

5 FORMAT LAPORAN WAJIB (sesuai Panduan CEK KPK PUB2025):
1. LAPORAN ANGGOTA ORGANISASI — karyawan melaporkan dugaan korupsi dari dalam perusahaan
2. LAPORAN PIHAK KETIGA — vendor, mitra, atau pihak eksternal melaporkan korupsi yang dialami
3. LAPORAN MANAJEMEN — Kepala FK melaporkan tren dan temuan kepada Direktur (triwulan)
4. LAPORAN PENYELIDIKAN — hasil investigasi dugaan pelanggaran oleh tim investigasi FK
5. LAPORAN KEPADA PIHAK BERWENANG — jika ada indikasi tindak pidana korupsi, FK melaporkan ke KPK/Polri

SOP WBS — ALUR PROSES:
PENERIMAAN: Laporan masuk via email/form/kotak laporan/hotline
→ FK verifikasi kelengkapan & kerahasiaan (1-3 hari)
→ TRIASE: laporan berisiko rendah (admin FK) vs menengah/tinggi (tim investigasi)
→ INVESTIGASI: pengumpulan bukti, wawancara, analisis dokumen (7-30 hari)
→ KESIMPULAN: terbukti (sanksi) vs tidak terbukti (arsip) vs butuh eskalasi (Direktur/penegak hukum)
→ TINDAK LANJUT: implementasi sanksi + notifikasi pelapor + dokumentasi

PERLINDUNGAN PELAPOR (No Retaliation Policy):
- Identitas pelapor WAJIB dijaga kerahasiaannya
- Dilarang: PHK, mutasi, penurunan jabatan sebagai bentuk balas dendam terhadap pelapor
- Hak banding: pelapor yang merasa dibalas dendam dapat eskalasi ke Direktur/Direksi
- Pelaporan anonim DITERIMA (FK investigasi berdasarkan substansi, bukan identitas)

CARA KERJA:
1. Tanya: nama perusahaan, saluran WBS yang tersedia (email/kotak saran/nomor hotline?)
2. Tanya: nama dan jabatan Kepala Fungsi Kepatuhan (penerima laporan utama)
3. Tanya: apakah ada mekanisme anonimitas? (Google Form anonim, kotak saran tanpa nama)
4. Generate SOP WBS lengkap + 5 format laporan
5. Berikan panduan distribusi: poster WBS di area kantor + info di kontrak karyawan

OUTPUT: SOP WBS Pancek + 5 template format laporan + panduan implementasi D.6${ctx}`,

        pelaksanaan_sosialisasi: `Anda adalah SUB-AGEN PROGRAM SOSIALISASI PANCEK dari tim Gustafta Collab Pancek. Spesialisasi TUNGGAL: menghasilkan Program Sosialisasi Anti-Korupsi berkala — lampiran kuesioner D.7 Jaga.id.

KONTEKS KUESIONER JAGA.ID:
D.7: "Apakah program anti-korupsi dan kebijakan perusahaan telah disosialisasikan kepada seluruh karyawan dan mitra bisnis secara berkala?"
→ Lampiran: Kalender sosialisasi + bukti pelaksanaan (foto, absensi, screenshot)

PROGRAM SOSIALISASI 12 BULAN:
Bulan 1: Kick-off — Deklarasi + Pakta Integritas + Kebijakan AK (briefing seluruh karyawan)
Bulan 2: WBS — cara melaporkan, perlindungan pelapor (email blast + poster)
Bulan 3: Gratifikasi — apa boleh/tidak boleh (video pendek 5 menit atau infografis)
Bulan 4: Due Diligence — kenali mitra bisnis Anda (sosialisasi tim pengadaan)
Bulan 5: Kasus Nyata KPK — pembelajaran dari kasus korupsi riil (studi kasus diskusi)
Bulan 6: EVALUASI TENGAH TAHUN — kuesioner pemahaman karyawan
Bulan 7: Benturan Kepentingan — cara disclosure yang benar (simulasi skenario)
Bulan 8: Kontrak & Klausul AK — cara membaca dan menggunakan klausul (tim legal/pengadaan)
Bulan 9: Refresher Kebijakan AK — update terbaru, revisi kebijakan jika ada
Bulan 10: Sosialisasi ke Vendor — distribusi Kebijakan AK ke mitra bisnis utama
Bulan 11: Simulasi WBS — drill latihan cara melaporkan pelanggaran
Bulan 12: EVALUASI TAHUNAN — laporan efektivitas sosialisasi ke Direktur

CARA KERJA:
1. Tanya: jumlah karyawan, apakah ada kantor cabang/lapangan?
2. Tanya: channel komunikasi yang efektif (email, WAG, rapat rutin, papan pengumuman)
3. Tanya: apakah ada vendor/mitra utama yang perlu disosialisasi juga?
4. Generate program sosialisasi 12 bulan + template materi tiap bulan (ringkasan 1 halaman)
5. Berikan template "Bukti Sosialisasi" yang bisa dilampirkan ke Jaga.id

OUTPUT: Kalender Sosialisasi 12 bulan + template materi + panduan dokumentasi + panduan D.7${ctx}`,

        evaluasi_audit_charter: `Anda adalah SUB-AGEN PIAGAM AUDIT PANCEK dari tim Gustafta Collab Pancek. Spesialisasi TUNGGAL: menghasilkan Piagam Audit (Audit Charter) + Rencana Monitoring & Evaluasi — lampiran kuesioner C.1 Jaga.id.

KONTEKS KUESIONER JAGA.ID:
C.1: "Apakah perusahaan melakukan monitoring dan evaluasi terhadap efektivitas program anti-korupsi secara berkala?"
→ Lampiran: Piagam/Charter Audit + Rencana M&E + bukti audit dilaksanakan

KOMPONEN PIAGAM AUDIT ANTI-KORUPSI:
A. MANDAT & TUJUAN:
   - Memastikan kepatuhan terhadap Kebijakan Anti-Korupsi dan prosedur terkait
   - Menilai efektivitas kontrol anti-korupsi
   - Mengidentifikasi gap dan risiko yang belum dimitigasi

B. RUANG LINGKUP AUDIT:
   - Semua unit/departemen (termasuk cabang)
   - Semua proses berisiko: pengadaan, pembayaran, pemasaran, perizinan
   - Ketaatan terhadap klausul kontrak, prosedur gratifikasi, WBS

C. OTORITAS AUDITOR:
   - Akses penuh ke semua dokumen, sistem, dan personil
   - Dapat mewawancarai siapapun tanpa sepengetahuan atasan auditee
   - Laporan langsung ke Direktur (independen dari manajemen lini)

D. METODOLOGI AUDIT:
   - Review dokumen kebijakan dan prosedur
   - Sampling transaksi berisiko tinggi (pengadaan >Rp50jt, pembayaran ke pihak berelasi)
   - Wawancara karyawan terkait (FK, bagian pengadaan, keuangan)
   - Inspeksi Log Hadiah, Log WBS, Register Risiko

E. FREKUENSI:
   - Audit rutin: 1× per tahun (komprehensif)
   - Audit khusus: jika ada laporan WBS atau indikasi pelanggaran
   - Pemantauan berkelanjutan: review Log Hadiah dan transaksi bulanan

F. PELAPORAN:
   - Laporan Audit diserahkan ke Direktur dalam 30 hari setelah audit
   - Temuan dikategorikan: Kritis / Signifikan / Rendah
   - CAPA (Corrective Action Plan) wajib untuk temuan Kritis dan Signifikan

CARA KERJA:
1. Tanya: nama perusahaan, nama Direktur, nama Kepala Fungsi Kepatuhan
2. Tanya: apakah audit internal dilakukan oleh FK sendiri atau tim terpisah?
3. Tanya: target audit pertama kapan?
4. Generate Piagam Audit + Rencana M&E tahunan
5. Berikan template Laporan Audit Kepatuhan sederhana

OUTPUT: Piagam Audit Anti-Korupsi + Rencana M&E + Template Laporan Audit + panduan C.1${ctx}`,

        evaluasi_sanksi: `Anda adalah SUB-AGEN SANKSI & PENGHARGAAN PANCEK dari tim Gustafta Collab Pancek. Spesialisasi TUNGGAL: menghasilkan Mekanisme Sanksi Proporsional + Sistem Penghargaan Integritas — lampiran kuesioner A.1 dan A.2 Jaga.id.

KONTEKS KUESIONER JAGA.ID:
A.1: "Apakah perusahaan memiliki mekanisme sanksi yang jelas dan proporsional terhadap pelanggaran kebijakan anti-korupsi?"
A.2: "Apakah perusahaan memiliki sistem penghargaan/apresiasi bagi karyawan yang menunjukkan integritas tinggi atau melaporkan pelanggaran?"
→ Lampiran: Tabel sanksi + prosedur penjatuhan + skema penghargaan

MATRIKS SANKSI PROPORSIONAL (3 tingkatan):

PELANGGARAN RINGAN (Sanksi: Peringatan Tertulis SP-1):
- Menerima hadiah di atas batas wajar tanpa melapor ke FK
- Melakukan entertainment bisnis melebihi batas tanpa persetujuan
- Tidak mengisi Log Hadiah sesuai prosedur
- Gagal hadir pelatihan anti-korupsi tanpa alasan valid

PELANGGARAN SEDANG (Sanksi: SP-2 + wajib remediation training):
- Memberikan hadiah/gratifikasi tanpa persetujuan FK yang nilai melebihi batas signifikan
- Memiliki benturan kepentingan yang tidak di-disclose
- Menghalangi proses investigasi WBS
- Terlibat dalam pengadaan yang bermasalah tanpa ada keuntungan pribadi langsung

PELANGGARAN BERAT (Sanksi: SP-3 → PHK + Proses Hukum):
- Terbukti memberikan atau menerima suap
- Pemalsuan dokumen atau laporan keuangan
- Korupsi, kolusi, atau nepotisme yang merugikan perusahaan
- Mengancam/membalas dendam pelapor WBS

PROSEDUR PENJATUHAN SANKSI:
1. Laporan masuk (WBS/observasi FK/temuan audit)
2. Investigasi FK (7-30 hari)
3. Sidang etik (Direktur + FK + HRD)
4. Keputusan sanksi (tertulis, ditandatangani Direktur)
5. Implementasi sanksi + monitoring 3 bulan
6. Hak banding karyawan dalam 7 hari kerja

SISTEM PENGHARGAAN INTEGRITAS:
- "Integrity Champion Award" — tahunan, dipilih berdasarkan nominasi dan penilaian FK
- Kriteria: konsisten patuh kebijakan AK, aktif sosialisasi integritas, berani laporkan pelanggaran
- Bentuk penghargaan: sertifikat + pengakuan publik di town hall + (opsional) bonus kecil
- Pelapor WBS yang laporan terbukti: apresiasi khusus + jaminan perlindungan

CARA KERJA:
1. Tanya: nama perusahaan, apakah sudah ada aturan sanksi di PKB/Peraturan Perusahaan?
2. Tanya: jumlah karyawan, ada SP1/SP2/SP3 yang sudah berjalan?
3. Tanya: apakah ingin ada mekanisme penghargaan integritas? (ya/tidak)
4. Generate matriks sanksi proporsional + prosedur sidang etik
5. Generate skema penghargaan yang sesuai kemampuan perusahaan

OUTPUT: Matriks Sanksi + Prosedur Sidang Etik + Skema Penghargaan Integritas + panduan A.1/A.2${ctx}`,
      };

      const promptKey = `${validated.agentKey}_${validated.subAgentKey}`;
      const systemPrompt = SUB_AGENT_PROMPTS[promptKey];
      if (!systemPrompt) {
        return res.status(400).json({ error: `Sub-agen tidak ditemukan: ${promptKey}` });
      }

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const { GoogleGenAI } = await import("@google/genai");
      const genAI = new GoogleGenAI({
        apiKey,
        httpOptions: {
          apiVersion: "",
          baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL || "",
        },
      });

      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "Siap. Saya akan membantu Anda sekarang." }] },
      ];
      for (const msg of validated.messages) {
        contents.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        });
      }

      const stream = await genAI.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents,
      });

      for await (const chunk of stream) {
        const content = chunk.text || "";
        if (content) res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error("Gustafta subagent error:", error);
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "Terjadi kesalahan." })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: "Failed to process sub-agent request" });
      }
    }
  });

  // POST /api/gustafta/collab - SSE streaming for multi-agent SMAP implementation
  app.post("/api/gustafta/collab", isAuthenticated, async (req, res) => {
    try {
      const schema = z.object({
        messages: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        })),
        agent: z.enum(["dokumen", "internal", "eksternal", "surveilance"]),
        companyName: z.string().optional(),
        focus: z.string().optional(),
      });
      const validated = schema.parse(req.body);

      const apiKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "AI tidak tersedia." });
      }

      const AGENT_PROMPTS: Record<string, string> = {
        dokumen: `Anda adalah GUSTAFTA — Agen Dokumen SMAP, spesialis penyiapan dokumentasi wajib SNI ISO 37001:2016.

FASE: SIAP DOKUMEN SMAP
TARGET: Membantu perusahaan menghasilkan dokumen SMAP inti yang lengkap dan sesuai standar.

KEMAMPUAN ANDA:
- Memandu pembuatan setiap dokumen SMAP dengan step-by-step praktis
- Menjelaskan persyaratan klausul ISO 37001:2016 secara aplikatif
- Memberikan outline, struktur, dan contoh konten dokumen
- Mengidentifikasi apa yang perlu dibuat baru vs dokumen yang sudah ada dan bisa diadaptasi
- Review draft dokumen dan berikan saran perbaikan

DOKUMEN PRIORITAS:
1. Pedoman SMAP / Manual ABMS (Klausul 4-10)
2. Kebijakan Anti Penyuapan (Klausul 5.2)
3. SK Penetapan Tim FKAP (Klausul 5.3.2)
4. Prosedur Uji Tuntas Mitra Bisnis (Klausul 8.2)
5. SOP Pelaporan Pelanggaran / Whistleblowing (Klausul 8.9)
6. Register Risiko Penyuapan (Klausul 6.1)
7. Program Awareness & Pelatihan (Klausul 7.2-7.3)
8. Prosedur Pengelolaan Gratifikasi & Hadiah (Klausul 8.7)
9. Prosedur Pengendalian Donasi & Kontribusi Politik (Klausul 8.8)
10. Sasaran Anti Penyuapan & Rencana Pencapaian (Klausul 6.2)

CARA BERDIALOG:
- Tanya dokumen mana yang ingin difokuskan jika belum jelas
- Berikan panduan konkret dan actionable
- Jika diminta, langsung generate outline atau draf konten
- Selalu rujuk klausul ISO 37001:2016 yang relevan
- Respons efisien: langsung ke poin, tidak bertele-tele
${validated.companyName ? `PERUSAHAAN: ${validated.companyName}` : ''}
${validated.focus ? `FOKUS SAAT INI: ${validated.focus}` : ''}`,

        internal: `Anda adalah GUSTAFTA — Agen Audit Internal SMAP, spesialis persiapan audit internal dan evaluasi kesesuaian SNI ISO 37001:2016.

FASE: SIAP AUDIT INTERNAL
TARGET: Memastikan perusahaan siap menjalankan audit internal SMAP yang efektif.

KEMAMPUAN ANDA:
- Membantu menyusun Program dan Jadwal Audit Internal Tahunan
- Membuat checklist audit per klausul ISO 37001 (Klausul 4-10)
- Panduan teknik wawancara dan observasi auditor
- Membantu identifikasi temuan dan kategori NCR (Major/Minor/Observation)
- Menyusun Laporan Hasil Audit dan Rencana Tindakan Korektif
- Simulasi pertanyaan audit untuk persiapan auditee

DOKUMEN AUDIT INTERNAL:
- Prosedur Audit Internal (Klausul 9.2)
- Program Audit Tahunan
- Checklist Audit per Klausul (10 checklist)
- Formulir Temuan Audit (NCR Form)
- Laporan Hasil Audit Internal
- Log Tindakan Korektif (CAPA Log)
- Bukti Penyelesaian Temuan
- Laporan Tinjauan Manajemen (Klausul 9.3)

CARA BERDIALOG:
- Identifikasi apakah sebagai auditor atau auditee yang sedang dibantu
- Berikan simulasi pertanyaan jika diminta
- Bantu menyusun checklist per klausul jika diminta
- Panduan praktis untuk setiap tahap audit
${validated.companyName ? `PERUSAHAAN: ${validated.companyName}` : ''}
${validated.focus ? `FOKUS SAAT INI: ${validated.focus}` : ''}`,

        eksternal: `Anda adalah GUSTAFTA — Agen Sertifikasi SMAP, spesialis persiapan audit eksternal dan sertifikasi SNI ISO 37001:2016.

FASE: SIAP AUDIT EKSTERNAL
TARGET: Memastikan perusahaan lolos sertifikasi SNI ISO 37001:2016 dengan lembaga sertifikasi (Certification Body).

KEMAMPUAN ANDA:
- Gap Analysis: mengidentifikasi kesenjangan antara kondisi saat ini vs persyaratan ISO
- Simulasi audit Stage 1 (document review) dan Stage 2 (implementation audit)
- Mock interview: simulasi pertanyaan auditor eksternal
- Panduan penyiapan dokumen bukti implementasi
- Review kesiapan dokumen dan evidence per klausul
- Matriks pemenuhan klausul (clause compliance matrix)
- Panduan memilih dan berkoordinasi dengan Lembaga Sertifikasi (BSN, Sucofindo, dll.)

DOKUMEN KESIAPAN SERTIFIKASI:
- Checklist Kesiapan Sertifikasi (per klausul)
- Matriks Pemenuhan Klausul 4-10
- Daftar Bukti Implementasi per Klausul
- Daftar Personil untuk Wawancara
- Surat Pernyataan Komitmen Manajemen
- Profil Perusahaan untuk Lembaga Sertifikasi

CARA BERDIALOG:
- Mulai dengan Gap Analysis jika diminta
- Berikan simulasi pertanyaan audit yang realistis
- Identifikasi dokumen bukti (evidence) yang dibutuhkan
- Panduan praktis koordinasi dengan CB
${validated.companyName ? `PERUSAHAAN: ${validated.companyName}` : ''}
${validated.focus ? `FOKUS SAAT INI: ${validated.focus}` : ''}`,

        surveilance: `Anda adalah GUSTAFTA — Agen Surveilance SMAP, spesialis pemeliharaan dan perpanjangan sertifikat SNI ISO 37001:2016.

FASE: SIAP SURVEILANCE
TARGET: Memastikan sertifikat SMAP terjaga efektif dan siap untuk audit surveilance & re-sertifikasi.

KEMAMPUAN ANDA:
- Monitoring efektivitas SMAP (KPI, indikator kinerja anti-penyuapan)
- Membantu pengelolaan insiden dan pelanggaran
- Penyiapan dokumen surveilance tahunan
- Review berkala kesesuaian SMAP
- Membantu proses perbaikan berkelanjutan (continuous improvement)
- Persiapan re-sertifikasi (setiap 3 tahun)
- Alert dan reminder jadwal surveilance

DOKUMEN SURVEILANCE:
- Laporan Kinerja SMAP Tahunan
- Update Register Risiko (revisi tahunan)
- Bukti Perbaikan Berkelanjutan (continual improvement records)
- Statistik Pelaporan Pelanggaran
- Analisis Tren Kepatuhan
- Dokumen Review Manajemen Tahunan
- Rencana Surveilance
- Dokumen Persiapan Re-sertifikasi (tahun ke-3)

CARA BERDIALOG:
- Identifikasi tahun sertifikasi dan jadwal surveilance berikutnya
- Bantu review efektivitas SMAP berdasarkan KPI
- Bantu identifikasi area perbaikan
- Panduan update dokumen yang diperlukan
${validated.companyName ? `PERUSAHAAN: ${validated.companyName}` : ''}
${validated.focus ? `FOKUS SAAT INI: ${validated.focus}` : ''}`,
      };

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const { GoogleGenAI } = await import("@google/genai");
      const genAI = new GoogleGenAI({
        apiKey,
        httpOptions: {
          apiVersion: "",
          baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL || "",
        },
      });

      const systemPrompt = AGENT_PROMPTS[validated.agent];
      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "Siap. Saya adalah Gustafta Collab, siap membantu implementasi SMAP Anda." }] },
      ];

      for (const msg of validated.messages) {
        contents.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        });
      }

      const stream = await genAI.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents,
      });

      for await (const chunk of stream) {
        const content = chunk.text || "";
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error("Gustafta collab error:", error);
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "Terjadi kesalahan." })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: "Failed to process Gustafta Collab" });
      }
    }
  });

  // ============ PAYMENT ROUTES ============

  // Get all subscription plans
  app.get("/api/subscription-plans", async (req, res) => {
    try {
      let plans = await storage.getSubscriptionPlans();
      
      // Seed default plans if none exist
      if (plans.length === 0) {
        const defaultPlans = [
          // SMAP Plans (4 phases)
          {
            name: "Siap Dokumen SMAP",
            category: "smap",
            description: "Persiapan dokumentasi lengkap SNI ISO 37001:2016",
            price: 2500000,
            features: "Profil Perusahaan,Manajemen Tim FKAP,Manajemen Pegawai,270+ Template Dokumen SMAP,AI Prompt Generator,SMAP Mentor AI,PDCA Generator 51 Klausul,Export PDF & Word",
            materials: "Pedoman SMAP,Kebijakan Anti Penyuapan,Manual SMAP,SOP Anti Penyuapan (12 dokumen),Sasaran Anti Penyuapan,Prosedur Pelaporan,Register Risiko,Matriks Komunikasi,Program Awareness,Formulir Uji Tuntas,Dokumen Kontrak Anti Penyuapan,Catatan Pelatihan",
            sortOrder: 1,
          },
          {
            name: "Siap Audit Internal",
            category: "smap",
            description: "Persiapan audit internal dan evaluasi kesesuaian",
            price: 3500000,
            features: "Semua fitur Siap Dokumen,Manajemen Tim Audit,Checklist Audit Internal,Template Laporan Audit,Tracking Temuan Audit,Rencana Tindakan Korektif,Monitoring Tindak Lanjut,Evaluasi Kesesuaian",
            materials: "Semua materi Siap Dokumen,Prosedur Audit Internal,Program Audit Tahunan,Checklist Audit (per klausul),Laporan Hasil Audit,Form Temuan & NCR,Log Tindakan Korektif,Bukti Penyelesaian Temuan,Laporan Tinjauan Manajemen,Risalah Rapat Tinjauan",
            sortOrder: 2,
          },
          {
            name: "Siap Audit Eksternal",
            category: "smap",
            description: "Persiapan sertifikasi SNI ISO 37001:2016",
            price: 5000000,
            features: "Semua fitur Siap Audit Internal,Simulasi Audit Eksternal,Gap Analysis,Pendampingan Sertifikasi,Koordinasi dengan Lembaga Sertifikasi,Mock Interview,Persiapan Dokumen Stage 1 & 2,Tracking Progress Sertifikasi",
            materials: "Semua materi Siap Audit Internal,Checklist Kesiapan Sertifikasi,Matriks Pemenuhan Klausul,Dokumen Bukti Implementasi,Daftar Personil Wawancara,Jadwal Audit Sertifikasi,Template Tanggapan Temuan,Surat Pernyataan Manajemen,Profil Perusahaan untuk CB",
            sortOrder: 3,
          },
          {
            name: "Siap Surveilance",
            category: "smap",
            description: "Pemeliharaan dan perpanjangan sertifikat",
            price: 3000000,
            features: "Semua fitur Siap Audit Eksternal,Monitoring Surveilance Tahunan,Update Dokumentasi Berkala,Review Efektivitas SMAP,Pelaporan Insiden,Persiapan Re-sertifikasi,Continuous Improvement,Alert Jadwal Surveilance",
            materials: "Semua materi Siap Audit Eksternal,Laporan Kinerja SMAP Tahunan,Update Register Risiko,Bukti Perbaikan Berkelanjutan,Statistik Pelaporan,Analisis Tren Kepatuhan,Dokumen Review Tahunan,Rencana Surveilance,Persiapan Perpanjangan 3 Tahun",
            sortOrder: 4,
          },
          // Pancek Plans (3 phases)
          {
            name: "Siap Pengisian Kuesioner",
            category: "pancek",
            description: "Persiapan pengisian kuesioner Platform Jaga.id",
            price: 1500000,
            features: "Profil Perusahaan,Panduan 6 Fase PDCAR,30+ Checklist Item Pancek,25+ Template Dokumen Pancek,AI Prompt Generator,Pancek Mentor AI,Integrasi Referensi Jaga.id,Export PDF",
            materials: "Pedoman Cegah Korupsi (Pancek),Kebijakan Anti Korupsi,Kode Etik Perusahaan,SOP Pencegahan Korupsi,Prosedur Pelaporan Pelanggaran,Formulir Komitmen Integritas,Panduan Pengisian Kuesioner Jaga.id,Checklist Dokumen Pendukung,Template Bukti Implementasi",
            sortOrder: 5,
          },
          {
            name: "Siap Terverifikasi",
            category: "pancek",
            description: "Persiapan verifikasi oleh KPK/Jaga.id",
            price: 2500000,
            features: "Semua fitur Siap Pengisian Kuesioner,Simulasi Verifikasi,Persiapan Dokumen Bukti,Koordinasi Tim Verifikasi,Mock Interview,Tracking Status Verifikasi,Gap Analysis Pancek,Pendampingan Verifikasi",
            materials: "Semua materi Siap Pengisian Kuesioner,Matriks Pemenuhan Indikator,Dokumen Bukti per Indikator,Daftar Personil Verifikasi,Laporan Self-Assessment,Catatan Implementasi Program,Foto Dokumentasi Kegiatan,Notulensi Rapat Terkait,Surat Pengantar Verifikasi",
            sortOrder: 6,
          },
          {
            name: "Siap Surveilance Pancek",
            category: "pancek",
            description: "Pemeliharaan status terverifikasi",
            price: 2000000,
            features: "Semua fitur Siap Terverifikasi,Monitoring Berkala,Update Program Anti Korupsi,Review Efektivitas Pancek,Pelaporan Insiden,Persiapan Re-verifikasi,Alert Jadwal Surveilance,Dashboard Kepatuhan",
            materials: "Semua materi Siap Terverifikasi,Laporan Kinerja Pancek Berkala,Update Catatan Implementasi,Bukti Perbaikan Berkelanjutan,Statistik Pelaporan Pelanggaran,Analisis Tren Kepatuhan,Dokumen Review Tahunan,Rencana Surveilance Pancek",
            sortOrder: 7,
          },
        ];
        
        for (const plan of defaultPlans) {
          await storage.createSubscriptionPlan(plan);
        }
        plans = await storage.getSubscriptionPlans();
      }
      
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscription plans" });
    }
  });

  // Get single subscription plan
  app.get("/api/subscription-plans/:id", async (req, res) => {
    try {
      const plan = await storage.getSubscriptionPlan(req.params.id);
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }
      res.json(plan);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscription plan" });
    }
  });

  // Payment order validation schema
  const createPaymentOrderSchema = z.object({
    planId: z.string().min(1, "Plan ID is required"),
    paymentMethod: z.enum(["bank_transfer", "ewallet"], { 
      errorMap: () => ({ message: "Payment method must be 'bank_transfer' or 'ewallet'" })
    }),
    paymentBank: z.enum(["bca", "mandiri", "bri", "bni"]).optional().nullable(),
    ewalletProvider: z.enum(["gopay", "ovo", "dana", "shopeepay"]).optional().nullable(),
  });

  // Admin user IDs - In production, use a proper role-based system
  const ADMIN_USER_IDS = process.env.ADMIN_USER_IDS?.split(",") || [];

  // Create payment order (authenticated)
  app.post("/api/payment-orders", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as { id: string; email?: string; username?: string };
      
      const validated = createPaymentOrderSchema.parse(req.body);
      
      const plan = await storage.getSubscriptionPlan(validated.planId);
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }

      // Validate bank is required for bank_transfer
      if (validated.paymentMethod === "bank_transfer" && !validated.paymentBank) {
        return res.status(400).json({ error: "Bank selection is required for bank transfer" });
      }

      // Validate e-wallet provider is required for ewallet
      if (validated.paymentMethod === "ewallet" && !validated.ewalletProvider) {
        return res.status(400).json({ error: "E-wallet provider selection is required" });
      }

      // Generate unique order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Store either bank name or e-wallet provider in bankName field
      const paymentProvider = validated.paymentMethod === "bank_transfer" 
        ? validated.paymentBank 
        : validated.ewalletProvider;

      const order = await storage.createPaymentOrder({
        orderNumber,
        userId: user.id,
        userEmail: user.email || null,
        userName: user.username || null,
        planId: validated.planId,
        planName: plan.name,
        amount: plan.price,
        paymentMethod: validated.paymentMethod,
        bankName: paymentProvider || null,
        status: "pending",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      });

      res.status(201).json(order);
    } catch (error) {
      console.error("Payment order error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create payment order" });
    }
  });

  // Get user's payment orders (authenticated)
  app.get("/api/payment-orders", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as { id: string };
      const orders = await storage.getPaymentOrdersByUser(user.id);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payment orders" });
    }
  });

  // Get single payment order
  app.get("/api/payment-orders/:id", isAuthenticated, async (req, res) => {
    try {
      const orderId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const order = await storage.getPaymentOrder(orderId);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payment order" });
    }
  });

  // Confirm payment (user submits confirmation)
  app.post("/api/payment-orders/:id/confirm", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as { id: string };
      const orderId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const order = await storage.getPaymentOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      if (order.userId !== user.id) {
        return res.status(403).json({ error: "Not authorized" });
      }

      // Only allow confirming pending orders
      if (order.status !== "pending") {
        return res.status(400).json({ error: "Order cannot be confirmed in current status" });
      }

      // Check if order has expired
      if (order.expiresAt && new Date(order.expiresAt) < new Date()) {
        return res.status(400).json({ error: "Order has expired" });
      }

      const { notes } = req.body;

      const updatedOrder = await storage.updatePaymentOrder(orderId, {
        status: "pending_confirmation",
        confirmedAt: new Date(),
        notes: notes || null,
      });

      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ error: "Failed to confirm payment" });
    }
  });

  // Get user's subscription status (authenticated)
  app.get("/api/subscription", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as { id: string };
      const subscription = await storage.getUserSubscription(user.id);
      res.json(subscription || null);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscription" });
    }
  });

  // Admin authorization middleware
  const isAdmin = (req: any, res: any, next: any) => {
    const user = req.user as { id: string } | undefined;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    // In production (NODE_ENV=production), require ADMIN_USER_IDS to be set
    // In development, allow if ADMIN_USER_IDS is empty for testing
    const isDevelopment = process.env.NODE_ENV !== "production";
    if (isDevelopment && ADMIN_USER_IDS.length === 0) {
      return next();
    }
    if (ADMIN_USER_IDS.includes(user.id)) {
      return next();
    }
    return res.status(403).json({ error: "Admin access required" });
  };

  // Admin: Verify payment and activate subscription
  app.post("/api/admin/payment-orders/:id/verify", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const orderId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const order = await storage.getPaymentOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      if (order.status === "paid") {
        return res.status(400).json({ error: "Order already verified" });
      }

      // Only allow verifying pending_confirmation orders
      if (order.status !== "pending_confirmation") {
        return res.status(400).json({ error: "Order must be in pending_confirmation status to verify" });
      }

      // Update order status to paid
      const updatedOrder = await storage.updatePaymentOrder(orderId, {
        status: "paid",
        paidAt: new Date(),
      });

      // Create or update user subscription
      const existingSubscription = await storage.getUserSubscription(order.userId);
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription

      if (existingSubscription) {
        await storage.updateUserSubscription(existingSubscription.id, {
          planId: order.planId,
          planName: order.planName,
          status: "active",
          startDate: startDate,
          endDate: endDate,
        });
      } else {
        await storage.createUserSubscription({
          userId: order.userId,
          planId: order.planId,
          planName: order.planName,
          status: "active",
          startDate: startDate,
          endDate: endDate,
        });
      }

      res.json({ message: "Payment verified and subscription activated", order: updatedOrder });
    } catch (error) {
      console.error("Payment verification error:", error);
      res.status(500).json({ error: "Failed to verify payment" });
    }
  });

  // Admin: Get all payment orders
  app.get("/api/admin/payment-orders", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const orders = await storage.getPaymentOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payment orders" });
    }
  });

  // Admin: Reject / cancel a payment order
  app.post("/api/admin/payment-orders/:id/reject", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const orderId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const order = await storage.getPaymentOrder(orderId);
      if (!order) return res.status(404).json({ error: "Order not found" });
      if (order.status === "paid") return res.status(400).json({ error: "Cannot reject already paid order" });
      const updated = await storage.updatePaymentOrder(orderId, { status: "pending" });
      res.json({ message: "Order reset to pending", order: updated });
    } catch (error) {
      res.status(500).json({ error: "Failed to reject order" });
    }
  });

  // Admin: Get subscription stats
  app.get("/api/admin/stats", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const orders = await storage.getPaymentOrders();
      const total = orders.length;
      const pending = orders.filter(o => o.status === "pending").length;
      const pendingConfirmation = orders.filter(o => o.status === "pending_confirmation").length;
      const paid = orders.filter(o => o.status === "paid").length;
      const revenue = orders.filter(o => o.status === "paid").reduce((sum, o) => sum + (o.amount || 0), 0);
      res.json({ total, pending, pendingConfirmation, paid, revenue });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Public: Payment configuration (bank accounts, WhatsApp)
  app.get("/api/payment-config", async (req, res) => {
    try {
      const company = await storage.getCompany();
      const accountHolder =
        process.env.PAYMENT_ACCOUNT_HOLDER ||
        company?.name ||
        "";
      res.json({
        whatsapp: process.env.PAYMENT_WHATSAPP || "",
        accountHolder,
        banks: {
          bca: process.env.PAYMENT_BCA_ACCOUNT || "",
          mandiri: process.env.PAYMENT_MANDIRI_ACCOUNT || "",
          bri: process.env.PAYMENT_BRI_ACCOUNT || "",
          bni: process.env.PAYMENT_BNI_ACCOUNT || "",
        },
        qrisImageUrl: process.env.PAYMENT_QRIS_IMAGE_URL || "",
      });
    } catch {
      res.json({
        whatsapp: process.env.PAYMENT_WHATSAPP || "",
        accountHolder: process.env.PAYMENT_ACCOUNT_HOLDER || "",
        banks: {
          bca: process.env.PAYMENT_BCA_ACCOUNT || "",
          mandiri: process.env.PAYMENT_MANDIRI_ACCOUNT || "",
          bri: process.env.PAYMENT_BRI_ACCOUNT || "",
          bni: process.env.PAYMENT_BNI_ACCOUNT || "",
        },
        qrisImageUrl: process.env.PAYMENT_QRIS_IMAGE_URL || "",
      });
    }
  });

  // Authenticated: Current user subscription status
  app.get("/api/subscription-status", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as { id: string }).id;
      const sub = await storage.getUserSubscription(userId);
      res.json(sub || null);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscription status" });
    }
  });

  // Admin: Check if current user is admin
  app.get("/api/admin/me", isAuthenticated, isAdmin, (req, res) => {
    res.json({ isAdmin: true });
  });

  return httpServer;
}

interface DocumentGenerationContext {
  company?: {
    name?: string | null;
    address?: string | null;
    city?: string | null;
    directorName?: string | null;
    phone?: string | null;
    email?: string | null;
  };
  management?: Array<{ name: string; position: string }>;
  fkap?: Array<{ name: string; role: string; position: string }>;
  vendors?: Array<{ name: string; type: string; dueDiligenceStatus?: string | null }>;
  customData?: Record<string, string>;
}

function generateAdvancedDocument(templateCode: string, context: DocumentGenerationContext) {
  const today = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long", 
    year: "numeric"
  });
  
  const companyName = context.company?.name || "[NAMA PERUSAHAAN]";
  const companyAddress = context.company?.address || "[ALAMAT PERUSAHAAN]";
  const directorName = context.company?.directorName || "[NAMA DIREKTUR]";
  const fkapHead = context.fkap?.[0]?.name || "[KETUA FKAP]";
  
  const templates: Record<string, { title: string; documentNumber: string; clause: string; category: string; content: string }> = {
    "SK-FKAP": {
      title: "Surat Keputusan Penetapan Tim FKAP",
      documentNumber: `SK/FKAP/${new Date().getFullYear()}/001`,
      clause: "5.3.2",
      category: "Surat Keputusan",
      content: `SURAT KEPUTUSAN
NOMOR: SK/FKAP/${new Date().getFullYear()}/001

TENTANG
PENETAPAN TIM FUNGSI KEPATUHAN ANTI PENYUAPAN (FKAP)
${companyName.toUpperCase()}

DIREKTUR ${companyName.toUpperCase()}

Menimbang:
a. bahwa dalam rangka memenuhi persyaratan SNI ISO 37001:2016 tentang Sistem Manajemen Anti Penyuapan, perlu dibentuk Fungsi Kepatuhan Anti Penyuapan (FKAP);
b. bahwa untuk memastikan efektivitas implementasi SMAP, diperlukan tim yang kompeten dan berdedikasi;
c. bahwa berdasarkan pertimbangan sebagaimana dimaksud huruf a dan b, perlu menetapkan Surat Keputusan tentang Penetapan Tim FKAP.

Mengingat:
1. SNI ISO 37001:2016 tentang Sistem Manajemen Anti Penyuapan;
2. Peraturan Menteri PUPR Nomor 08 Tahun 2022 tentang Sistem Manajemen Anti Penyuapan;
3. Anggaran Dasar ${companyName};

MEMUTUSKAN:

Menetapkan:
PERTAMA    : Membentuk Tim Fungsi Kepatuhan Anti Penyuapan (FKAP) dengan susunan sebagai berikut:

${context.fkap?.map((m, i) => `             ${i + 1}. ${m.name} - ${m.role}`).join("\n") || "             [DAFTAR ANGGOTA TIM FKAP]"}

KEDUA      : Tim FKAP bertugas:
             a. Mengawasi pelaksanaan kebijakan anti penyuapan;
             b. Memberikan saran dan rekomendasi terkait SMAP;
             c. Menerima dan menindaklanjuti laporan pelanggaran;
             d. Melakukan sosialisasi dan pelatihan;
             e. Melaporkan kinerja SMAP kepada Manajemen Puncak.

KETIGA     : Tim FKAP bertanggung jawab langsung kepada Direktur.

KEEMPAT    : Segala biaya yang timbul akibat pelaksanaan Surat Keputusan ini dibebankan pada anggaran perusahaan.

KELIMA     : Surat Keputusan ini berlaku sejak tanggal ditetapkan.

                                        Ditetapkan di: ${context.company?.city || "[KOTA]"}
                                        Pada tanggal: ${today}

                                        DIREKTUR,



                                        ${directorName}`,
    },
    
    "KEBIJAKAN-AP": {
      title: "Kebijakan Anti Penyuapan",
      documentNumber: `DOC/KAP/${new Date().getFullYear()}/001`,
      clause: "5.2",
      category: "Kebijakan",
      content: `KEBIJAKAN ANTI PENYUAPAN
${companyName.toUpperCase()}

NOMOR: DOC/KAP/${new Date().getFullYear()}/001
REVISI: 00
TANGGAL EFEKTIF: ${today}

═══════════════════════════════════════════════════════════════

1. PERNYATAAN KOMITMEN

${companyName} berkomitmen penuh untuk menerapkan prinsip-prinsip anti penyuapan dalam seluruh aktivitas bisnis. Kami menerapkan kebijakan ZERO TOLERANCE terhadap segala bentuk penyuapan, baik yang dilakukan oleh personel internal maupun pihak eksternal yang bekerja atas nama perusahaan.

2. RUANG LINGKUP

Kebijakan ini berlaku untuk:
• Seluruh Direksi dan Manajemen
• Seluruh Karyawan tetap dan kontrak
• Mitra Bisnis, Vendor, dan Subkontraktor
• Agen, Konsultan, dan Penasihat
• Seluruh pihak yang bertindak atas nama perusahaan

3. DEFINISI PENYUAPAN

Penyuapan adalah tindakan menawarkan, menjanjikan, memberikan, menerima, atau meminta keuntungan yang tidak semestinya (uang, hadiah, fasilitas, atau apa pun yang bernilai) dengan maksud untuk mempengaruhi keputusan atau tindakan seseorang.

4. LARANGAN

Perusahaan MELARANG setiap personel untuk:
a. Memberikan atau menerima suap dalam bentuk apapun
b. Memfasilitasi pembayaran tidak resmi (facilitation payment)
c. Menerima hadiah/gratifikasi yang dapat mempengaruhi keputusan bisnis
d. Memberikan donasi politik atas nama perusahaan
e. Melakukan tindakan apapun yang dapat dikategorikan sebagai penyuapan

5. KEWAJIBAN

Setiap personel WAJIB:
a. Memahami dan mematuhi kebijakan anti penyuapan
b. Melaporkan dugaan pelanggaran melalui saluran yang tersedia
c. Bekerja sama dalam investigasi pelanggaran
d. Menandatangani Pakta Integritas
e. Mengikuti pelatihan anti penyuapan secara berkala

6. PELAPORAN

Laporan dugaan pelanggaran dapat disampaikan melalui:
• Email: whistleblowing@${companyName.toLowerCase().replace(/\s/g, "")}.co.id
• Telepon: ${context.company?.phone || "[NOMOR HOTLINE]"}
• Kotak Saran (anonim)
• Langsung kepada Tim FKAP

7. PERLINDUNGAN PELAPOR

Perusahaan menjamin kerahasiaan identitas pelapor dan memberikan perlindungan dari segala bentuk pembalasan.

8. SANKSI

Pelanggaran terhadap kebijakan ini akan dikenakan sanksi sesuai peraturan perusahaan, termasuk namun tidak terbatas pada:
• Teguran lisan/tertulis
• Penurunan jabatan
• Pemutusan hubungan kerja
• Pelaporan kepada pihak berwenang

9. TINJAUAN KEBIJAKAN

Kebijakan ini akan ditinjau minimal setiap tahun untuk memastikan kesesuaian dan efektivitasnya.

═══════════════════════════════════════════════════════════════

Kebijakan ini telah disetujui dan ditetapkan oleh:

DIREKTUR,



${directorName}
${companyName}
${today}`,
    },

    "PAKTA-INTEGRITAS": {
      title: "Pakta Integritas Personel",
      documentNumber: `FORM/PI/${new Date().getFullYear()}/001`,
      clause: "7.2.2.3",
      category: "Formulir",
      content: `PAKTA INTEGRITAS
${companyName.toUpperCase()}

NOMOR: FORM/PI/${new Date().getFullYear()}/001

Yang bertanda tangan di bawah ini:

Nama             : ________________________________
NIK              : ________________________________
Jabatan          : ________________________________
Departemen       : ________________________________

Dengan ini menyatakan dengan sungguh-sungguh bahwa:

1. Saya telah membaca, memahami, dan berkomitmen untuk mematuhi Kebijakan Anti Penyuapan ${companyName}.

2. Saya TIDAK AKAN melakukan, memfasilitasi, atau berpartisipasi dalam tindakan penyuapan dalam bentuk apapun.

3. Saya AKAN melaporkan setiap dugaan pelanggaran anti penyuapan yang saya ketahui melalui saluran yang tersedia.

4. Saya TIDAK AKAN menerima atau memberikan hadiah, gratifikasi, atau keuntungan lainnya yang dapat mempengaruhi keputusan bisnis atau tugas saya.

5. Saya bersedia menerima sanksi sesuai peraturan yang berlaku apabila melanggar pernyataan ini.

6. Pernyataan ini saya buat dengan penuh kesadaran dan tanpa paksaan dari pihak manapun.

                                        ${context.company?.city || "[KOTA]"}, ${today}

                                        Yang membuat pernyataan,




                                        (___________________________)
                                        Nama jelas dan tanda tangan


Saksi:
1. Nama: _________________ TTD: _________________
2. Nama: _________________ TTD: _________________


Mengetahui,
Ketua FKAP



${fkapHead}`,
    },

    "SOP-UJI-TUNTAS": {
      title: "SOP Uji Tuntas Mitra Bisnis",
      documentNumber: `SOP/UT/${new Date().getFullYear()}/001`,
      clause: "8.2",
      category: "SOP",
      content: `STANDAR OPERASIONAL PROSEDUR
UJI TUNTAS MITRA BISNIS (DUE DILIGENCE)

NOMOR DOKUMEN  : SOP/UT/${new Date().getFullYear()}/001
REVISI         : 00
TANGGAL        : ${today}
PERUSAHAAN     : ${companyName.toUpperCase()}

═══════════════════════════════════════════════════════════════

1. TUJUAN
Menetapkan prosedur pelaksanaan uji tuntas terhadap mitra bisnis untuk mencegah keterlibatan dengan pihak yang berisiko melakukan penyuapan.

2. RUANG LINGKUP
SOP ini berlaku untuk:
• Vendor/Supplier baru
• Subkontraktor
• Agen dan perantara bisnis
• Konsultan dan penasihat
• Joint venture partners

3. REFERENSI
• SNI ISO 37001:2016 Klausul 8.2
• Permen PU No. 06 Tahun 2025 (menggantikan Permen PU No. 08 Tahun 2022 — detail implementasi dalam proses publikasi)
• Kebijakan Anti Penyuapan ${companyName}

4. DEFINISI
Uji Tuntas: Proses investigasi dan penilaian terhadap calon mitra bisnis untuk mengidentifikasi risiko penyuapan.

5. PROSEDUR

5.1 PENILAIAN TINGKAT RISIKO
┌─────────────┬──────────────────────────────────────┐
│ TINGKAT     │ KRITERIA                             │
├─────────────┼──────────────────────────────────────┤
│ RENDAH      │ Nilai kontrak < 50 juta              │
│             │ Tidak berhubungan dengan pemerintah  │
│             │ Wilayah operasi rendah risiko        │
├─────────────┼──────────────────────────────────────┤
│ SEDANG      │ Nilai kontrak 50 - 500 juta          │
│             │ Beberapa interaksi dengan pemerintah │
│             │ Wilayah operasi sedang risiko        │
├─────────────┼──────────────────────────────────────┤
│ TINGGI      │ Nilai kontrak > 500 juta             │
│             │ Banyak interaksi dengan pemerintah   │
│             │ Wilayah operasi tinggi risiko        │
└─────────────┴──────────────────────────────────────┘

5.2 TAHAPAN UJI TUNTAS

A. TINGKAT DASAR (Risiko Rendah)
   □ Verifikasi dokumen legalitas
   □ Pengecekan daftar hitam/sanksi
   □ Verifikasi identitas pemilik
   □ Penandatanganan Pakta Integritas Mitra

B. TINGKAT MENENGAH (Risiko Sedang)
   □ Semua poin tingkat dasar
   □ Analisis struktur kepemilikan
   □ Riwayat reputasi bisnis
   □ Pengecekan media dan berita
   □ Wawancara dengan referensi bisnis

C. TINGKAT MENDALAM (Risiko Tinggi)
   □ Semua poin tingkat menengah
   □ Investigasi latar belakang manajemen
   □ Audit lapangan (site visit)
   □ Analisis laporan keuangan
   □ Persetujuan Manajemen Puncak

5.3 DOKUMENTASI
Semua hasil uji tuntas harus didokumentasikan dalam:
• Formulir Uji Tuntas Mitra Bisnis
• Laporan Hasil Penilaian Risiko
• Rekomendasi Tim FKAP

6. PERSETUJUAN

┌────────────────┬───────────────────────┬────────────────────┐
│ TINGKAT RISIKO │ UNIT PENYETUJU        │ WAKTU PROSES       │
├────────────────┼───────────────────────┼────────────────────┤
│ RENDAH         │ Procurement Manager   │ 3 hari kerja       │
│ SEDANG         │ Ketua FKAP            │ 7 hari kerja       │
│ TINGGI         │ Direktur              │ 14 hari kerja      │
└────────────────┴───────────────────────┴────────────────────┘

7. PEMANTAUAN BERKELANJUTAN
Mitra bisnis yang telah lolos uji tuntas akan dipantau secara berkala sesuai tingkat risikonya:
• Rendah: Setiap 3 tahun
• Sedang: Setiap 2 tahun
• Tinggi: Setiap tahun

8. DAFTAR MITRA BISNIS SAAT INI

${context.vendors?.map((v, i) => `${i + 1}. ${v.name} (${v.type}) - Status: ${v.dueDiligenceStatus || "Pending"}`).join("\n") || "[DAFTAR VENDOR AKAN DITAMPILKAN DI SINI]"}

═══════════════════════════════════════════════════════════════

Disusun oleh:                          Disetujui oleh:
Tim FKAP                               Direktur



${fkapHead}                            ${directorName}`,
    },

    "RISK-REGISTER": {
      title: "Register Risiko Penyuapan",
      documentNumber: `DOC/RR/${new Date().getFullYear()}/001`,
      clause: "4.5",
      category: "Register",
      content: `REGISTER RISIKO PENYUAPAN
${companyName.toUpperCase()}

NOMOR     : DOC/RR/${new Date().getFullYear()}/001
PERIODE   : Tahun ${new Date().getFullYear()}
STATUS    : [DRAFT/FINAL]

═══════════════════════════════════════════════════════════════

1. PENDAHULUAN

Register ini mendokumentasikan hasil identifikasi dan penilaian risiko penyuapan ${companyName} sesuai persyaratan SNI ISO 37001:2016 klausul 4.5.

2. METODOLOGI PENILAIAN

SKALA KEMUNGKINAN (L - Likelihood):
1 = Sangat Jarang  (< 1x per 5 tahun)
2 = Jarang         (1x per 2-5 tahun)
3 = Mungkin        (1x per tahun)
4 = Sering         (1x per bulan)
5 = Sangat Sering  (1x per minggu atau lebih)

SKALA DAMPAK (I - Impact):
1 = Sangat Kecil   (Kerugian < 10 juta)
2 = Kecil          (Kerugian 10-50 juta)
3 = Sedang         (Kerugian 50-250 juta)
4 = Besar          (Kerugian 250 juta - 1 M)
5 = Sangat Besar   (Kerugian > 1 M atau reputasi)

TINGKAT RISIKO = L x I
┌─────────────────┬────────────┬──────────────────────────┐
│ SKOR            │ KATEGORI   │ TINDAKAN                 │
├─────────────────┼────────────┼──────────────────────────┤
│ 1-5             │ RENDAH     │ Pantau berkala           │
│ 6-12            │ SEDANG     │ Kendalikan & pantau      │
│ 13-19           │ TINGGI     │ Tindakan segera          │
│ 20-25           │ EKSTREM    │ Eskalasi ke Manajemen    │
└─────────────────┴────────────┴──────────────────────────┘

3. DAFTAR RISIKO

┌────┬────────────────────────────┬───┬───┬──────┬───────────────────────────┬────────────────┐
│ NO │ AREA RISIKO                │ L │ I │ SKOR │ PENGENDALIAN              │ PIC            │
├────┼────────────────────────────┼───┼───┼──────┼───────────────────────────┼────────────────┤
│ 1  │ Pengadaan Barang/Jasa      │ 4 │ 4 │ 16   │ SOP Procurement, Tender   │ Procurement    │
│    │                            │   │   │      │ Terbuka, Due Diligence    │ Manager        │
├────┼────────────────────────────┼───┼───┼──────┼───────────────────────────┼────────────────┤
│ 2  │ Perizinan & Regulasi       │ 3 │ 4 │ 12   │ Prosedur resmi, dokumentasi│ Legal         │
│    │                            │   │   │      │ lengkap, monitoring       │                │
├────┼────────────────────────────┼───┼───┼──────┼───────────────────────────┼────────────────┤
│ 3  │ Rekrutmen Karyawan         │ 2 │ 3 │ 6    │ Background check, Pakta   │ HR Manager     │
│    │                            │   │   │      │ Integritas                │                │
├────┼────────────────────────────┼───┼───┼──────┼───────────────────────────┼────────────────┤
│ 4  │ Hubungan dengan Pejabat    │ 3 │ 5 │ 15   │ Kebijakan larangan gift,  │ Direktur       │
│    │ Pemerintah                 │   │   │      │ dokumentasi interaksi     │                │
├────┼────────────────────────────┼───┼───┼──────┼───────────────────────────┼────────────────┤
│ 5  │ Sponsorship & Donasi       │ 2 │ 3 │ 6    │ Persetujuan FKAP, Due     │ FKAP           │
│    │                            │   │   │      │ Diligence penerima        │                │
├────┼────────────────────────────┼───┼───┼──────┼───────────────────────────┼────────────────┤
│ 6  │ Entertainment Bisnis       │ 3 │ 3 │ 9    │ Batasan nilai, persetujuan│ Dept. Head     │
│    │                            │   │   │      │ atasan, pelaporan         │                │
├────┼────────────────────────────┼───┼───┼──────┼───────────────────────────┼────────────────┤
│ 7  │ Penerimaan Hadiah          │ 3 │ 3 │ 9    │ Logbook gratifikasi,      │ FKAP           │
│    │ Gratifikasi                │   │   │      │ batasan nilai, pelaporan  │                │
├────┼────────────────────────────┼───┼───┼──────┼───────────────────────────┼────────────────┤
│ 8  │ Subkontraktor              │ 4 │ 4 │ 16   │ Due diligence, Pakta      │ Project Manager│
│    │                            │   │   │      │ Integritas, monitoring    │                │
└────┴────────────────────────────┴───┴───┴──────┴───────────────────────────┴────────────────┘

4. RINGKASAN PROFIL RISIKO

• Risiko Ekstrem  : 0
• Risiko Tinggi   : 3
• Risiko Sedang   : 3
• Risiko Rendah   : 2

5. RENCANA TINDAK LANJUT

Risiko dengan kategori TINGGI dan EKSTREM memerlukan:
• Rencana mitigasi detail
• Timeline implementasi
• Penanggung jawab jelas
• Pemantauan bulanan
• Pelaporan ke Manajemen Puncak

6. JADWAL TINJAUAN

Register ini akan ditinjau:
• Rutin: Setiap 6 bulan
• Insidentil: Saat ada perubahan signifikan

═══════════════════════════════════════════════════════════════

Disusun oleh:                    Ditinjau oleh:           Disetujui oleh:
Tim FKAP                         Ketua FKAP               Direktur



[___________]                    ${fkapHead}              ${directorName}
Tanggal:                         Tanggal:                 Tanggal:`,
    },

    "AUDIT-CHECKLIST": {
      title: "Checklist Audit Internal SMAP",
      documentNumber: `FORM/AI/${new Date().getFullYear()}/001`,
      clause: "9.2",
      category: "Formulir",
      content: `CHECKLIST AUDIT INTERNAL SMAP
${companyName.toUpperCase()}

NOMOR AUDIT    : FORM/AI/${new Date().getFullYear()}/001
TANGGAL AUDIT  : ${today}
AUDITOR        : ________________________________
AUDITEE        : ________________________________

═══════════════════════════════════════════════════════════════

Petunjuk Pengisian:
✓ = Sesuai (Conforming)
✗ = Tidak Sesuai (Non-Conforming)
OB = Observasi (Observation)
NA = Tidak Berlaku (Not Applicable)

═══════════════════════════════════════════════════════════════

KLAUSUL 4: KONTEKS ORGANISASI

4.1 Memahami Organisasi dan Konteksnya
[ ] Organisasi telah mengidentifikasi isu internal dan eksternal yang relevan
[ ] Analisis konteks didokumentasikan dan ditinjau secara berkala
Temuan: _______________________________________________________________

4.2 Memahami Kebutuhan dan Harapan Pihak Berkepentingan
[ ] Pihak berkepentingan telah diidentifikasi
[ ] Kebutuhan dan harapan mereka terkait SMAP telah ditentukan
Temuan: _______________________________________________________________

4.5 Penilaian Risiko Penyuapan
[ ] Register risiko penyuapan tersedia dan terkini
[ ] Penilaian risiko dilakukan secara berkala
[ ] Kriteria penilaian risiko telah ditetapkan
[ ] Tindakan untuk mengatasi risiko telah diimplementasikan
Temuan: _______________________________________________________________

KLAUSUL 5: KEPEMIMPINAN

5.1 Kepemimpinan dan Komitmen
[ ] Manajemen puncak menunjukkan komitmen terhadap SMAP
[ ] Sumber daya yang diperlukan tersedia
[ ] Budaya anti penyuapan dipromosikan
Temuan: _______________________________________________________________

5.2 Kebijakan Anti Penyuapan
[ ] Kebijakan anti penyuapan tersedia dan terdokumentasi
[ ] Kebijakan dikomunikasikan ke seluruh personel
[ ] Kebijakan ditinjau secara berkala
Temuan: _______________________________________________________________

5.3 Peran, Tanggung Jawab, dan Wewenang
[ ] Peran dan tanggung jawab SMAP telah ditetapkan
[ ] Tim FKAP telah ditunjuk dan beroperasi efektif
[ ] Sumber daya untuk FKAP memadai
Temuan: _______________________________________________________________

KLAUSUL 7: DUKUNGAN

7.2 Kompetensi
[ ] Pelatihan anti penyuapan dilaksanakan secara berkala
[ ] Catatan pelatihan tersedia dan lengkap
[ ] Evaluasi pemahaman dilakukan
Temuan: _______________________________________________________________

7.4 Komunikasi
[ ] Mekanisme pelaporan (whistleblowing) tersedia
[ ] Prosedur komunikasi internal dan eksternal ditetapkan
[ ] Informasi SMAP dapat diakses personel
Temuan: _______________________________________________________________

7.5 Informasi Terdokumentasi
[ ] Dokumen SMAP terkendali dan terkini
[ ] Rekaman terpelihara dengan baik
[ ] Akses terhadap dokumen terkontrol
Temuan: _______________________________________________________________

KLAUSUL 8: OPERASI

8.1 Perencanaan dan Pengendalian Operasional
[ ] Prosedur operasional ditetapkan
[ ] Pengendalian terhadap proses berisiko diterapkan
Temuan: _______________________________________________________________

8.2 Uji Tuntas
[ ] Prosedur uji tuntas tersedia
[ ] Uji tuntas dilaksanakan sebelum kerja sama
[ ] Dokumentasi uji tuntas lengkap
Temuan: _______________________________________________________________

8.9 Mengangkat Kekhawatiran
[ ] Sistem whistleblowing beroperasi efektif
[ ] Laporan ditindaklanjuti tepat waktu
[ ] Perlindungan pelapor dijamin
Temuan: _______________________________________________________________

KLAUSUL 9: EVALUASI KINERJA

9.1 Pemantauan, Pengukuran, Analisis, dan Evaluasi
[ ] Kinerja SMAP dipantau dan diukur
[ ] Sasaran anti penyuapan dipantau pencapaiannya
Temuan: _______________________________________________________________

9.2 Audit Internal
[ ] Program audit internal ditetapkan
[ ] Audit dilaksanakan sesuai jadwal
[ ] Temuan audit ditindaklanjuti
Temuan: _______________________________________________________________

9.3 Tinjauan Manajemen
[ ] Tinjauan manajemen dilaksanakan secara berkala
[ ] Hasil tinjauan didokumentasikan
[ ] Tindak lanjut dari tinjauan diimplementasikan
Temuan: _______________________________________________________________

KLAUSUL 10: PENINGKATAN

10.1 Ketidaksesuaian dan Tindakan Korektif
[ ] Ketidaksesuaian diidentifikasi dan ditangani
[ ] Tindakan korektif diimplementasikan
[ ] Efektivitas tindakan korektif dievaluasi
Temuan: _______________________________________________________________

10.2 Peningkatan Berkelanjutan
[ ] Peluang peningkatan diidentifikasi
[ ] Tindakan peningkatan diimplementasikan
Temuan: _______________________________________________________________

═══════════════════════════════════════════════════════════════

RINGKASAN TEMUAN:

Jumlah Sesuai (✓)      : ____
Jumlah Tidak Sesuai (✗) : ____
Jumlah Observasi (OB)   : ____

KESIMPULAN AUDIT:
[ ] Memenuhi persyaratan SMAP
[ ] Memenuhi dengan catatan minor
[ ] Tidak memenuhi - perlu perbaikan signifikan

CATATAN AUDITOR:
________________________________________________________________
________________________________________________________________
________________________________________________________________

Auditor,                              Auditee,



_______________                       _______________
Tanggal:                              Tanggal:`,
    },

    "BERITA-ACARA-RTM": {
      title: "Berita Acara Rapat Tinjauan Manajemen",
      documentNumber: `BA/RTM/${new Date().getFullYear()}/001`,
      clause: "9.3",
      category: "Berita Acara",
      content: `BERITA ACARA
RAPAT TINJAUAN MANAJEMEN (RTM) SMAP
${companyName.toUpperCase()}

NOMOR         : BA/RTM/${new Date().getFullYear()}/001
HARI/TANGGAL  : ${today}
WAKTU         : __________ s.d. __________
TEMPAT        : ${companyAddress}

═══════════════════════════════════════════════════════════════

I. PESERTA RAPAT

Hadir:
${context.management?.map((m, i) => `${i + 1}. ${m.name} - ${m.position}`).join("\n") || "1. [NAMA] - [JABATAN]\n2. [NAMA] - [JABATAN]"}

II. AGENDA RAPAT

1. Pembukaan
2. Laporan Status Implementasi SMAP
3. Hasil Audit Internal
4. Status Tindakan Korektif
5. Evaluasi Kinerja SMAP
6. Pembahasan Peluang Peningkatan
7. Penutup

III. PEMBAHASAN

A. Status Implementasi SMAP
   • Kebijakan Anti Penyuapan telah dikomunikasikan ke: ___% personel
   • Pakta Integritas telah ditandatangani oleh: ___% personel
   • Pelatihan SMAP telah diikuti oleh: ___% personel
   
B. Hasil Audit Internal
   • Periode audit: ___________
   • Jumlah temuan mayor: ___
   • Jumlah temuan minor: ___
   • Jumlah observasi: ___
   
C. Status Tindakan Korektif
   • Total tindakan korektif: ___
   • Sudah selesai: ___
   • Dalam proses: ___
   • Belum ditindaklanjuti: ___
   
D. Evaluasi Kinerja SMAP
   • Target sasaran tercapai: ___% 
   • Insiden penyuapan terkonfirmasi: ___
   • Laporan whistleblowing diterima: ___
   • Laporan whistleblowing ditindaklanjuti: ___

E. Pembahasan Peluang Peningkatan
   1. ________________________________________________________________
   2. ________________________________________________________________
   3. ________________________________________________________________

IV. KEPUTUSAN RAPAT

1. ________________________________________________________________
2. ________________________________________________________________
3. ________________________________________________________________

V. TINDAK LANJUT

┌────┬────────────────────────────────┬────────────────┬───────────────┐
│ NO │ TINDAKAN                       │ PENANGGUNG JAWAB │ TARGET WAKTU  │
├────┼────────────────────────────────┼────────────────┼───────────────┤
│ 1  │                                │                │               │
├────┼────────────────────────────────┼────────────────┼───────────────┤
│ 2  │                                │                │               │
├────┼────────────────────────────────┼────────────────┼───────────────┤
│ 3  │                                │                │               │
└────┴────────────────────────────────┴────────────────┴───────────────┘

VI. PENUTUP

Demikian Berita Acara ini dibuat untuk dapat dipergunakan sebagaimana mestinya.

═══════════════════════════════════════════════════════════════

Notulis,                              Pimpinan Rapat,



_______________                       ${directorName}
                                      Direktur`,
    },
  };

  const template = templates[templateCode];
  
  if (!template) {
    return {
      title: `Dokumen ${templateCode}`,
      documentNumber: `DOC/${new Date().getFullYear()}/XXX`,
      clause: "-",
      category: "Lainnya",
      content: `[Template '${templateCode}' belum tersedia]\n\nSilakan hubungi administrator untuk menambahkan template ini.`,
    };
  }

  return template;
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

