import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateDocumentContent as generateAIContent, generateSMAPDocument } from "./replit_integrations/gemini";
import { setupAuth, registerAuthRoutes, isAuthenticated, authStorage } from "./replit_integrations/auth";
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
} from "@shared/schema";

// AI Request Validation Schemas
const aiGenerateSchema = z.object({
  prompt: z.string().min(1).max(10000),
  model: z.enum(["gemini-2.5-flash", "gemini-2.5-pro"]).default("gemini-2.5-flash"),
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
  app.post("/api/ai/generate", async (req, res) => {
    try {
      const validated = aiGenerateSchema.parse(req.body);
      const content = await generateAIContent(validated.prompt, validated.model);
      res.json({ content });
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

  app.post("/api/ai/help-chat", async (req, res) => {
    try {
      const validated = helpChatSchema.parse(req.body);
      
      const systemPrompt = `Anda adalah Help Bot untuk Platform Generator Dokumen Multi-Industri. Tugas Anda adalah membantu pengguna memahami cara menggunakan aplikasi ini.

Platform ini mendukung 20 industri: SMAP, Pancek, Konstruksi, Energi, Migas, Lingkungan, UMKM, ISO, K3, Tender, Keuangan, Kesehatan, Pendidikan, Teknologi, Pertanian, Manufaktur, Properti, Logistik, Pariwisata, dan Telekomunikasi.

Fitur utama aplikasi:
1. Dashboard - Ringkasan data perusahaan dan statistik
2. Profil Perusahaan - Input data perusahaan untuk template
3. Template Dokumen - Library template dokumen per industri
4. AI Generator - Membuat dokumen otomatis dengan AI
5. Chatbot Mentor - AI ahli per industri untuk konsultasi
6. Knowledge Base - Akses knowledge base dari dokumentender.com
7. Pengaturan Industri - Beralih antar industri

Panduan navigasi:
- Sidebar kiri untuk navigasi menu
- Icon chat di pojok kanan bawah untuk chatbot
- Tombol profil di header untuk akun

Berikan jawaban yang singkat, jelas, dan membantu dalam Bahasa Indonesia.`;

      const historyMessages = validated.history?.map(h => ({
        role: h.role as "user" | "model",
        parts: [{ text: h.content }]
      })) || [];

      const prompt = `${systemPrompt}

Riwayat percakapan sebelumnya:
${historyMessages.map(h => `${h.role === "user" ? "User" : "Assistant"}: ${h.parts[0].text}`).join("\n")}

User: ${validated.message}

Berikan jawaban yang membantu:`;

      const response = await generateAIContent(prompt, "gemini-2.5-flash");
      
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

