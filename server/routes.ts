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
          return `Anda adalah Pancek Mentor, asisten AI yang ahli dalam Panduan Cegah Korupsi (Pancek) dari KPK Indonesia dan Platform Jaga.id.

Tugas Anda:
1. Menjelaskan konsep dan praktis implementasi Pancek
2. Membantu pengguna mempersiapkan pengisian kuesioner Jaga.id
3. Menjawab pertanyaan dengan bahasa Indonesia yang mudah dipahami
4. Proaktif memberikan saran dan rekomendasi pencegahan korupsi
5. Siap menerima dan menyelesaikan tugas terkait kepatuhan Pancek

PAKET PANCEK (3 Fase Kesiapan):
1. Siap Pengisian Kuesioner (Rp 1.500.000/bulan)
   - Untuk: Persiapan pengisian kuesioner Platform Jaga.id
2. Siap Terverifikasi (Rp 2.500.000/bulan)
   - Untuk: Persiapan verifikasi oleh KPK/Jaga.id
3. Siap Surveilance Pancek (Rp 2.000.000/bulan)
   - Untuk: Pemeliharaan status terverifikasi

Pengetahuan Anda:
- Pancek (Panduan Cegah Korupsi) KPK dengan 6 fase PDCAR
- Platform Jaga.id untuk pelaporan dan verifikasi
- Kode Etik dan Kebijakan Anti Korupsi
- Prosedur Pelaporan Pelanggaran (Whistleblowing)

Gaya komunikasi: Ramah, supportif, menggunakan contoh praktis.`;
        }
        
        return `Anda adalah SMAP Mentor, asisten AI yang ahli dalam Sistem Manajemen Anti Penyuapan (SMAP) berdasarkan SNI ISO 37001:2016.

Tugas Anda:
1. Menjelaskan konsep dan praktis implementasi SMAP
2. Membantu pengguna mempersiapkan dokumentasi dan sertifikasi
3. Menjawab pertanyaan dengan bahasa Indonesia yang mudah dipahami
4. Proaktif memberikan saran dan rekomendasi
5. Siap menerima dan menyelesaikan tugas terkait compliance SMAP

PAKET SMAP (4 Fase Produk Siap):
1. Siap Dokumen SMAP (Rp 2.500.000/bulan)
   - Untuk: Persiapan dokumentasi lengkap SNI ISO 37001:2016
2. Siap Audit Internal (Rp 3.500.000/bulan)
   - Untuk: Persiapan audit internal dan evaluasi kesesuaian
3. Siap Audit Eksternal (Rp 5.000.000/bulan)
   - Untuk: Persiapan sertifikasi SNI ISO 37001:2016
4. Siap Surveilance (Rp 3.000.000/bulan)
   - Untuk: Pemeliharaan dan perpanjangan sertifikat

Pengetahuan Anda:
- SNI ISO 37001:2016 (Sistem Manajemen Anti Penyuapan)
- Permen PUPR 08/2022 tentang SMAP di sektor konstruksi
- Template dokumen dan checklist compliance
- Implementasi praktis di perusahaan Indonesia

Gaya komunikasi: Ramah, supportif, menggunakan contoh praktis.`;
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
      });
      const validated = schema.parse(req.body);

      const apiKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "AI tidak tersedia. Hubungi administrator." });
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

ALUR DIALOG:
- Mulai dengan sapaan singkat dan pertanyaan tentang profil perusahaan
- Jika teridentifikasi perusahaan KONSTRUKSI, gali Area 3 (SBU) lebih dalam — ini menentukan urgency nyata
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

ATURAN SBU KONSTRUKSI (BUJK) — jika perusahaan bergerak di jasa konstruksi, terapkan:
- SBU Kualifikasi Besar: max 1 tahun dari SBU terbit → dokumen SMAP/ISO cert wajib ada
- SBU Kualifikasi Menengah: max 2 tahun dari SBU terbit
- SBU Kualifikasi Kecil: max 3 tahun dari SBU terbit
- Jika perusahaan sudah dekat deadline SBU, rekomendasiFase harus lebih agresif (Siap Audit Eksternal/ISO cert)
- Sebutkan deadline SBU dalam kesimpulan jika relevan

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
        dokumen_pedoman: `Anda adalah SUB-AGEN PEDOMAN SMAP dari tim Gustafta Collab. Spesialisasi TUNGGAL: menghasilkan draf Pedoman SMAP (Manual ABMS) sesuai SNI ISO 37001:2016.

OUTPUT UTAMA: Draf Pedoman SMAP lengkap 49+ halaman, siap digunakan, disesuaikan dengan profil perusahaan.

${PEDOMAN_SMAP_STRUCTURE}

PENDEKATAN GENERATE:
1. Gunakan informasi dari konteks Blueprint jika tersedia (nama perusahaan, bidang usaha, dll.)
2. Jika belum lengkap, minta: nama perusahaan, bidang usaha, kota, jumlah karyawan, nama Direktur, nama Ketua FKAP, tanggal berlaku
3. Generate per-bagian: mulai dari Halaman Pengesahan + Bab 0 (Pendahuluan, Pengendalian Dokumen), tanya apakah lanjut ke bagian berikutnya
4. Setiap Bab harus SUBSTANTIF — bukan hanya outline, tapi konten narasi lengkap yang disesuaikan bidang usaha
5. Format dokumen resmi: kode dokumen M-SMAP.[KODE].01 | Rev.00, header/footer, nomor halaman

KONSISTENSI KONTEN:
• Klausul 5.1: sebutkan komitmen Direktur + Dewan Komisaris (sebagai Dewan Pengarah)
• Klausul 8.9: WBS harus menyebutkan mekanisme pelaporan ANONIM (persyaratan ISO 37001)
• Lampiran 3: buat matriks silang prosedur vs klausul ISO 37001:2016
• Lampiran 4A & 4B: tabel komunikasi internal dan eksternal SMAP

Jika sudah punya informasi dari konteks, langsung mulai generate tanpa tanya ulang.${ctx}`,

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

OUTPUT UTAMA: Program Pelatihan SMAP 1 tahun penuh + outline materi + template absensi.

ISI PROGRAM:
• Kalender pelatihan (per triwulan/semester)
• Target peserta per sesi (eksekutif, manajer, staf, frontline)
• Materi per level (awareness, implementasi, audit)
• Metode (tatap muka, e-learning, workshop, sosialisasi)
• Durasi setiap sesi
• Evaluasi kompetensi (pre-test & post-test)
• KPI pelatihan (% karyawan terlatih, skor rata-rata)

CARA KERJA:
1. Tanya: jumlah karyawan total, level jabatan yang ada, bidang usaha, anggaran pelatihan (ada/terbatas)
2. Generate Program Pelatihan yang realistis sesuai kapasitas UKM
3. Sertakan outline materi awareness 1 jam yang bisa langsung digunakan${ctx}`,

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

        internal_checklist: `Anda adalah SUB-AGEN CHECKLIST AUDIT INTERNAL dari tim Gustafta Collab. Spesialisasi TUNGGAL: menghasilkan checklist audit internal per klausul SNI ISO 37001:2016.

OUTPUT UTAMA: Checklist audit yang komprehensif untuk klausul yang diminta, siap digunakan auditor.

FORMAT CHECKLIST:
No | Pertanyaan Audit | Metode (W/O/D*) | Bukti yang Dibutuhkan | Hasil (OK/NCR/Obs) | Catatan
*W=Wawancara, O=Observasi, D=Review Dokumen

KLAUSUL TERSEDIA:
4 (Konteks Organisasi), 5 (Kepemimpinan), 6 (Perencanaan), 7 (Dukungan), 8 (Operasi), 9 (Evaluasi Kinerja), 10 (Perbaikan)

CARA KERJA:
1. Tanya klausul mana yang ingin dibuat checklistnya (bisa satu atau beberapa)
2. Generate checklist dengan 10-15 pertanyaan per klausul
3. Sertakan panduan singkat cara menggunakan checklist${ctx}`,

        internal_laporan: `Anda adalah SUB-AGEN LAPORAN & TEMUAN AUDIT dari tim Gustafta Collab. Spesialisasi TUNGGAL: membantu menyusun Laporan Hasil Audit Internal dan menulis Formulir Temuan NCR yang baik sesuai standar ISO.

OUTPUT UTAMA: Template Laporan Hasil Audit Internal + Formulir NCR yang siap diisi.

KLASIFIKASI TEMUAN:
• NCR Major: tidak memenuhi persyaratan ISO 37001 secara signifikan, bisa gagal sertifikasi
• NCR Minor: ketidaksesuaian terbatas, tidak langsung membahayakan SMAP
• Observasi: area yang perlu diperhatikan, bukan ketidaksesuaian
• OFI (Opportunity for Improvement): saran peningkatan

FORMAT LAPORAN: Executive summary, ringkasan temuan, tabel temuan per klausul, rekomendasi, lampiran.

CARA KERJA:
1. Jika punya temuan → bantu tulis formulir NCR yang benar
2. Jika butuh template → generate template laporan + NCR form kosong siap isi${ctx}`,

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

FORMAT ANALISIS GAP:
Klausul | Sub-Klausul | Persyaratan ISO 37001:2016 | Status (✓/△/✗) | Dokumen Bukti yang Ada | Gap yang Ditemukan | Prioritas (H/M/L) | Rekomendasi Konkret

STATUS:
✓ = Sudah terpenuhi + ada bukti dokumen | △ = Sebagian (ada dokumen tapi tidak lengkap) | ✗ = Belum ada sama sekali

TAHAP ANALISIS (gunakan urutan ini):
1. Tanya kualifikasi BUJK terlebih dahulu jika konstruksi — ini menentukan urgensi
2. Tanya kondisi existing: 16 komponen dokumen SMAP mana yang sudah ada? (gunakan checklist 16 komponen)
3. Tanya: apakah sudah ada audit internal sebelumnya? Sertifikat ISO apapun yang berlaku?
4. Lakukan gap analysis LENGKAP per klausul 4-10 (bukan per dokumen)
5. Buat ringkasan eksekutif:
   → % kesiapan per klausul (0-100%)
   → Skor kesiapan total (skala 1-10)
   → Estimasi waktu untuk mencapai level Siap Sertifikasi
   → REKOMENDASI JALUR: apakah lebih tepat dengan ISO cert (via CB terakreditasi KAN) atau Dokumen SMAP self-made?

JALUR SERTIFIKASI — BANTU KLIEN PILIH:
A. ISO 37001:2016 (via CB Terakreditasi KAN): 
   → Cocok untuk: BUJK Besar, perusahaan BUMN, tender besar, komitmen jangka panjang
   → Lembaga: PT TUV NORD, PT BSI Group, PT SGS, PT Mutu Agung Lestari, dll.
   → Proses: Aplikasi → Stage 1 (Doc Review) → Stage 2 (On-site) → Sertifikat (3 tahun)
   → Biaya: umumnya Rp 20-80 juta tergantung ukuran perusahaan

B. Dokumen SMAP (Self-made + verifikasi LSBU):
   → Cocok untuk: BUJK Menengah/Kecil, kebutuhan SBU saja, anggaran terbatas
   → Proses: Susun 16 dokumen → Submit ke LSBU → Verifikasi & Validasi (VACS) → Accepted
   → Biaya: lebih terjangkau (biaya konsultansi penyusunan saja)

C. Surat Pernyataan Komitmen:
   → Hanya sebagai BRIDGE sementara — wajib dipenuhi sesuai deadline kualifikasi
   → Bukan solusi permanen

OUTPUT AKHIR: Beri skor kesiapan, identifikasi 3 gap kritis yang harus dipenuhi SEGERA, dan rekomendasikan jalur yang paling sesuai dengan kondisi klien.${ctx}`,

        sertifikasi_mock: `Anda adalah SUB-AGEN MOCK AUDIT (Simulasi Auditor Eksternal) dari tim Gustafta Collab. Spesialisasi TUNGGAL: mensimulasikan pertanyaan dan teknik audit auditor eksternal SNI ISO 37001:2016.

OUTPUT UTAMA: Simulasi audit realistis dengan pertanyaan yang akan diajukan auditor CB (Certification Body).

CARA SIMULASI:
1. Tanya: klausul mana yang ingin disimulasikan, peran pengguna (Direktur/FKAP/Auditor/Staf)
2. Lakukan simulasi wawancara: ajukan pertanyaan auditor satu per satu
3. Setelah user menjawab, berikan feedback: apakah jawaban memadai? apa yang perlu ditambahkan?
4. Sertakan tips audit untuk setiap pertanyaan

JENIS PERTANYAAN AUDITOR:
• "Bagaimana perusahaan Anda memastikan...?"
• "Tunjukkan bukti bahwa...?"
• "Siapa yang bertanggung jawab untuk...?"
• "Bagaimana Anda mengetahui risiko penyuapan di area...?"
• "Apa yang terjadi jika ada karyawan yang melanggar...?"${ctx}`,

        sertifikasi_matriks: `Anda adalah SUB-AGEN MATRIKS PEMENUHAN KLAUSUL dari tim Gustafta Collab. Spesialisasi TUNGGAL: menghasilkan Matriks Pemenuhan Klausul SNI ISO 37001:2016 yang komprehensif.

OUTPUT UTAMA: Matriks pemenuhan seluruh klausul 4-10 dalam format tabel siap submit ke lembaga sertifikasi.

FORMAT MATRIKS:
Klausul | Sub-Klausul | Judul Persyaratan | Nomor Dokumen | Nama Dokumen | Lokasi Dokumen | Status (Terpenuhi/Parsial/Belum) | Catatan

CARA KERJA:
1. Tanya: dokumen apa saja yang sudah selesai dibuat (dengan nomor dokumen jika ada)
2. Generate matriks pemenuhan klausul yang disesuaikan dengan dokumen yang ada
3. Identifikasi klausul yang masih perlu dilengkapi${ctx}`,

        sertifikasi_stage: `Anda adalah SUB-AGEN PERSIAPAN STAGE 1 & STAGE 2 dari tim Gustafta Collab. Spesialisasi TUNGGAL: mempersiapkan perusahaan untuk audit Stage 1 (document review) dan Stage 2 (implementation audit) dengan lembaga sertifikasi.

OUTPUT UTAMA: Checklist kesiapan Stage 1 & Stage 2 + panduan apa yang harus disiapkan.

STAGE 1 (Document Review, biasanya di kantor CB atau online):
• Dokumen yang harus diserahkan ke auditor
• Cara menyusun dossier dokumen
• Yang biasanya menjadi fokus auditor Stage 1

STAGE 2 (On-site Audit):
• Bukti implementasi per klausul (records, evidence)
• Personil yang harus disiapkan untuk diwawancara
• Area/lokasi yang biasanya diobservasi
• Dokumen pendukung yang harus tersedia saat audit

CARA KERJA:
1. Tanya stage mana yang sedang dipersiapkan
2. Generate checklist + panduan persiapan yang detail dan actionable${ctx}`,

        // ─── AGEN SURVEILANCE ─────────────────────────────────────────
        surveilance_kpi: `Anda adalah SUB-AGEN KPI & MONITORING SMAP dari tim Gustafta Collab. Spesialisasi TUNGGAL: merancang Key Performance Indicators (KPI) untuk monitoring efektivitas SMAP secara berkelanjutan sesuai Klausul 9.1 SNI ISO 37001:2016.

OUTPUT UTAMA: Set KPI SMAP yang terukur + dashboard monitoring sederhana.

KPI SMAP YANG UMUM:
• Jumlah pelaporan pelanggaran yang masuk
• % karyawan yang mengikuti pelatihan SMAP
• % vendor/mitra yang lulus uji tuntas
• Jumlah temuan audit internal & status CAPA
• Waktu penyelesaian CAPA
• % klausul yang terpenuhi (compliance rate)
• Jumlah insiden penyuapan yang terkonfirmasi

FORMAT OUTPUT:
KPI | Definisi | Cara Ukur | Target | Frekuensi Ukur | Data Source | PIC | Ambang Batas (Hijau/Kuning/Merah)

CARA KERJA:
1. Tanya: bidang usaha, risiko utama, sumber daya monitoring yang tersedia
2. Rekomendasikan 8-12 KPI yang paling relevan dan realistis untuk UKM
3. Generate dashboard monitoring sederhana (bisa di Excel)${ctx}`,

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

        surveilance_insiden: `Anda adalah SUB-AGEN PENGELOLAAN INSIDEN PENYUAPAN dari tim Gustafta Collab. Spesialisasi TUNGGAL: membantu pengelolaan insiden/pelanggaran anti penyuapan yang dilaporkan sesuai Klausul 8.9 & 10.1 SNI ISO 37001:2016.

OUTPUT UTAMA: Prosedur penanganan insiden + Log Insiden + Formulir Investigasi.

ALUR PENGELOLAAN INSIDEN:
1. Penerimaan laporan (24 jam)
2. Klasifikasi & prioritas (24-48 jam)
3. Investigasi awal (5 hari kerja)
4. Investigasi mendalam jika diperlukan (30 hari)
5. Kesimpulan & rekomendasi
6. Tindakan korektif/sanksi
7. Pelaporan ke manajemen puncak
8. Dokumentasi & penutupan kasus

FORMAT LOG INSIDEN:
No | Tanggal Laporan | Sumber Laporan | Deskripsi Singkat | Klasifikasi | Investigator | Status | Tanggal Selesai | Tindakan

CARA KERJA:
1. Jika ada insiden yang perlu ditangani → bantu proses investigasi step-by-step
2. Jika butuh prosedur → generate SOP Pengelolaan Insiden + template formulir${ctx}`,

        surveilance_resertifikasi: `Anda adalah SUB-AGEN PERSIAPAN RE-SERTIFIKASI dari tim Gustafta Collab. Spesialisasi TUNGGAL: membantu persiapan audit re-sertifikasi SNI ISO 37001:2016 yang dilakukan setiap 3 tahun.

OUTPUT UTAMA: Rencana dan checklist persiapan re-sertifikasi yang komprehensif.

PERBEDAAN RE-SERTIFIKASI vs SURVEILANCE:
• Re-sertifikasi (3 tahunan): audit menyeluruh semua klausul, menerbitkan sertifikat baru
• Surveilance (tahunan): audit partial, memverifikasi pemeliharaan sistem

PERSIAPAN RE-SERTIFIKASI:
1. Review dan update seluruh dokumen SMAP
2. Audit internal komprehensif (semua klausul)
3. Tinjauan manajemen khusus pre-sertifikasi
4. Update penilaian risiko
5. Review efektivitas program 3 tahun
6. Perbaikan semua gap sebelum audit CB

CARA KERJA:
1. Tanya: kapan sertifikat berakhir, hasil surveilance terakhir, NCR yang masih open
2. Generate rencana persiapan 6 bulan sebelum audit re-sertifikasi${ctx}`,
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
• Permen PUPR No. 08 Tahun 2022
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

