import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

const dateStringSchema = z.preprocess(
  (val) => {
    if (val === "" || val === null || val === undefined) return null;
    if (typeof val === "string") return val;
    return null;
  },
  z.string().nullable().optional()
);

// Company Profile
export const companies = pgTable("companies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  province: text("province").notNull(),
  postalCode: text("postal_code"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  npwp: text("npwp"),
  siup: text("siup"),
  nib: text("nib"),
  directorName: text("director_name"),
  directorPosition: text("director_position"),
  establishedDate: text("established_date"),
  businessType: text("business_type"),
  employeeCount: integer("employee_count"),
});

export const insertCompanySchema = createInsertSchema(companies).omit({ id: true }).extend({
  establishedDate: dateStringSchema,
});
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;

// Management Team
export const managementTeam = pgTable("management_team", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  position: text("position").notNull(),
  department: text("department"),
  phone: text("phone"),
  email: text("email"),
  joinDate: text("join_date"),
  responsibilities: text("responsibilities"),
});

export const insertManagementSchema = createInsertSchema(managementTeam).omit({ id: true }).extend({
  joinDate: dateStringSchema,
});
export type InsertManagement = z.infer<typeof insertManagementSchema>;
export type Management = typeof managementTeam.$inferSelect;

// Employees
export const employees = pgTable("employees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  position: text("position").notNull(),
  department: text("department"),
  nik: text("nik"),
  phone: text("phone"),
  email: text("email"),
  joinDate: text("join_date"),
  status: text("status").default("active"),
});

export const insertEmployeeSchema = createInsertSchema(employees).omit({ id: true }).extend({
  joinDate: dateStringSchema,
});
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Employee = typeof employees.$inferSelect;

// FKAP Team (Fungsi Kepatuhan Anti Penyuapan)
export const fkapTeam = pgTable("fkap_team", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  position: text("position").notNull(),
  role: text("role").notNull(),
  department: text("department"),
  phone: text("phone"),
  email: text("email"),
  responsibilities: text("responsibilities"),
  appointmentDate: text("appointment_date"),
});

export const insertFkapSchema = createInsertSchema(fkapTeam).omit({ id: true }).extend({
  appointmentDate: dateStringSchema,
});
export type InsertFkap = z.infer<typeof insertFkapSchema>;
export type Fkap = typeof fkapTeam.$inferSelect;

// Internal Audit Team
export const auditTeam = pgTable("audit_team", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  position: text("position").notNull(),
  role: text("role").notNull(),
  certification: text("certification"),
  phone: text("phone"),
  email: text("email"),
  experience: text("experience"),
  appointmentDate: text("appointment_date"),
});

export const insertAuditSchema = createInsertSchema(auditTeam).omit({ id: true }).extend({
  appointmentDate: dateStringSchema,
});
export type InsertAudit = z.infer<typeof insertAuditSchema>;
export type Audit = typeof auditTeam.$inferSelect;

// SBU Qualifications
export const qualifications = pgTable("qualifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull(),
  classification: text("classification").notNull(),
  subClassification: text("sub_classification"),
  grade: text("grade"),
  validFrom: text("valid_from"),
  validUntil: text("valid_until"),
  issuingBody: text("issuing_body"),
  certificateNumber: text("certificate_number"),
});

export const insertQualificationSchema = createInsertSchema(qualifications).omit({ id: true }).extend({
  validFrom: dateStringSchema,
  validUntil: dateStringSchema,
});
export type InsertQualification = z.infer<typeof insertQualificationSchema>;
export type Qualification = typeof qualifications.$inferSelect;

// Equipment
export const equipment = pgTable("equipment", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(),
  brand: text("brand"),
  model: text("model"),
  serialNumber: text("serial_number"),
  quantity: integer("quantity").default(1),
  condition: text("condition").default("good"),
  location: text("location"),
  purchaseDate: text("purchase_date"),
  lastMaintenanceDate: text("last_maintenance_date"),
});

export const insertEquipmentSchema = createInsertSchema(equipment).omit({ id: true }).extend({
  purchaseDate: dateStringSchema,
  lastMaintenanceDate: dateStringSchema,
});
export type InsertEquipment = z.infer<typeof insertEquipmentSchema>;
export type Equipment = typeof equipment.$inferSelect;

// Projects
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  clientName: text("client_name").notNull(),
  contractValue: text("contract_value"),
  location: text("location"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  status: text("status").default("ongoing"),
  description: text("description"),
  projectManager: text("project_manager"),
});

export const insertProjectSchema = createInsertSchema(projects).omit({ id: true }).extend({
  startDate: dateStringSchema,
  endDate: dateStringSchema,
});
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// Vendors
export const vendors = pgTable("vendors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(),
  address: text("address"),
  city: text("city"),
  phone: text("phone"),
  email: text("email"),
  contactPerson: text("contact_person"),
  npwp: text("npwp"),
  bankAccount: text("bank_account"),
  bankName: text("bank_name"),
  dueDiligenceStatus: text("due_diligence_status").default("pending"),
});

export const insertVendorSchema = createInsertSchema(vendors).omit({ id: true });
export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type Vendor = typeof vendors.$inferSelect;

// Documents
export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  type: text("type").notNull(),
  clause: text("clause"),
  status: text("status").default("draft"),
  content: text("content"),
  generatedAt: timestamp("generated_at").defaultNow(),
  version: text("version").default("1.0"),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({ id: true, generatedAt: true });
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

// Generated Documents (SMAP)
export const generatedDocuments = pgTable("generated_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  documentNumber: text("document_number"),
  templateType: text("template_type").notNull(),
  clause: text("clause"),
  category: text("category"),
  content: text("content").notNull(),
  status: text("status").default("draft"),
  version: text("version").default("1.0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  approvedBy: text("approved_by"),
  approvedAt: timestamp("approved_at"),
  notes: text("notes"),
});

export const insertGeneratedDocumentSchema = createInsertSchema(generatedDocuments).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export type InsertGeneratedDocument = z.infer<typeof insertGeneratedDocumentSchema>;
export type GeneratedDocument = typeof generatedDocuments.$inferSelect;

// Document Templates
export const documentTemplates = pgTable("document_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  title: text("title").notNull(),
  titleEn: text("title_en"),
  category: text("category").notNull(),
  clause: text("clause"),
  description: text("description"),
  templateContent: text("template_content").notNull(),
  requiredFields: text("required_fields"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
});

export const insertDocumentTemplateSchema = createInsertSchema(documentTemplates).omit({ id: true });
export type InsertDocumentTemplate = z.infer<typeof insertDocumentTemplateSchema>;
export type DocumentTemplate = typeof documentTemplates.$inferSelect;

// Clause Reference Library
export const clauseReferences = pgTable("clause_references", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clauseNumber: text("clause_number").notNull(),
  title: text("title").notNull(),
  titleEn: text("title_en"),
  description: text("description"),
  requirements: text("requirements"),
  evidenceRequired: text("evidence_required"),
  pdcaPhase: text("pdca_phase"),
  parentClause: text("parent_clause"),
  sortOrder: integer("sort_order").default(0),
});

export const insertClauseReferenceSchema = createInsertSchema(clauseReferences).omit({ id: true });
export type InsertClauseReference = z.infer<typeof insertClauseReferenceSchema>;
export type ClauseReference = typeof clauseReferences.$inferSelect;

// Keep the users table for compatibility
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
