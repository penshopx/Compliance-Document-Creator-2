import { eq, desc } from "drizzle-orm";
import { db } from "./db";
import {
  companies,
  managementTeam,
  employees,
  fkapTeam,
  auditTeam,
  qualifications,
  equipment,
  projects,
  vendors,
  documents,
  generatedDocuments,
  documentTemplates,
  clauseReferences,
  subscriptionPlans,
  paymentOrders,
  userSubscriptions,
  type Company,
  type InsertCompany,
  type Management,
  type InsertManagement,
  type Employee,
  type InsertEmployee,
  type Fkap,
  type InsertFkap,
  type Audit,
  type InsertAudit,
  type Qualification,
  type InsertQualification,
  type Equipment,
  type InsertEquipment,
  type Project,
  type InsertProject,
  type Vendor,
  type InsertVendor,
  type Document,
  type InsertDocument,
  type GeneratedDocument,
  type InsertGeneratedDocument,
  type DocumentTemplate,
  type InsertDocumentTemplate,
  type ClauseReference,
  type InsertClauseReference,
  type SubscriptionPlan,
  type InsertSubscriptionPlan,
  type PaymentOrder,
  type InsertPaymentOrder,
  type UserSubscription,
  type InsertUserSubscription,
} from "@shared/schema";

export interface IStorage {
  // Company
  getCompany(): Promise<Company | undefined>;
  createCompany(data: InsertCompany): Promise<Company>;
  updateCompany(id: string, data: InsertCompany): Promise<Company>;

  // Management
  getManagement(): Promise<Management[]>;
  createManagement(data: InsertManagement): Promise<Management>;
  updateManagement(id: string, data: InsertManagement): Promise<Management>;
  deleteManagement(id: string): Promise<void>;

  // Employees
  getEmployees(): Promise<Employee[]>;
  createEmployee(data: InsertEmployee): Promise<Employee>;
  updateEmployee(id: string, data: InsertEmployee): Promise<Employee>;
  deleteEmployee(id: string): Promise<void>;

  // FKAP Team
  getFkapTeam(): Promise<Fkap[]>;
  createFkap(data: InsertFkap): Promise<Fkap>;
  updateFkap(id: string, data: InsertFkap): Promise<Fkap>;
  deleteFkap(id: string): Promise<void>;

  // Audit Team
  getAuditTeam(): Promise<Audit[]>;
  createAudit(data: InsertAudit): Promise<Audit>;
  updateAudit(id: string, data: InsertAudit): Promise<Audit>;
  deleteAudit(id: string): Promise<void>;

  // Qualifications
  getQualifications(): Promise<Qualification[]>;
  createQualification(data: InsertQualification): Promise<Qualification>;
  updateQualification(id: string, data: InsertQualification): Promise<Qualification>;
  deleteQualification(id: string): Promise<void>;

  // Equipment
  getEquipment(): Promise<Equipment[]>;
  createEquipment(data: InsertEquipment): Promise<Equipment>;
  updateEquipment(id: string, data: InsertEquipment): Promise<Equipment>;
  deleteEquipment(id: string): Promise<void>;

  // Projects
  getProjects(): Promise<Project[]>;
  createProject(data: InsertProject): Promise<Project>;
  updateProject(id: string, data: InsertProject): Promise<Project>;
  deleteProject(id: string): Promise<void>;

  // Vendors
  getVendors(): Promise<Vendor[]>;
  createVendor(data: InsertVendor): Promise<Vendor>;
  updateVendor(id: string, data: InsertVendor): Promise<Vendor>;
  deleteVendor(id: string): Promise<void>;

  // Documents
  getDocuments(): Promise<Document[]>;
  createDocument(data: InsertDocument): Promise<Document>;
  deleteDocument(id: string): Promise<void>;

  // Generated Documents
  getGeneratedDocuments(): Promise<GeneratedDocument[]>;
  getGeneratedDocument(id: string): Promise<GeneratedDocument | undefined>;
  createGeneratedDocument(data: InsertGeneratedDocument): Promise<GeneratedDocument>;
  updateGeneratedDocument(id: string, data: Partial<InsertGeneratedDocument>): Promise<GeneratedDocument>;
  deleteGeneratedDocument(id: string): Promise<void>;

  // Document Templates
  getDocumentTemplates(): Promise<DocumentTemplate[]>;
  getDocumentTemplate(id: string): Promise<DocumentTemplate | undefined>;
  getDocumentTemplateByCode(code: string): Promise<DocumentTemplate | undefined>;

  // Clause References
  getClauseReferences(): Promise<ClauseReference[]>;
  getClauseReferencesByPhase(phase: string): Promise<ClauseReference[]>;

  // Dashboard
  getDashboardStats(): Promise<{
    company: Company | null;
    employees: number;
    fkap: number;
    qualifications: number;
    equipment: number;
    projects: number;
    vendors: number;
    generatedDocuments: number;
    management: number;
    audit: number;
  }>;

  // Subscription Plans
  getSubscriptionPlans(): Promise<SubscriptionPlan[]>;
  getSubscriptionPlan(id: string): Promise<SubscriptionPlan | undefined>;
  createSubscriptionPlan(data: InsertSubscriptionPlan): Promise<SubscriptionPlan>;

  // Payment Orders
  getPaymentOrders(): Promise<PaymentOrder[]>;
  getPaymentOrdersByUser(userId: string): Promise<PaymentOrder[]>;
  getPaymentOrder(id: string): Promise<PaymentOrder | undefined>;
  getPaymentOrderByNumber(orderNumber: string): Promise<PaymentOrder | undefined>;
  createPaymentOrder(data: InsertPaymentOrder): Promise<PaymentOrder>;
  updatePaymentOrder(id: string, data: Partial<InsertPaymentOrder>): Promise<PaymentOrder>;

  // User Subscriptions
  getUserSubscription(userId: string): Promise<UserSubscription | undefined>;
  createUserSubscription(data: InsertUserSubscription): Promise<UserSubscription>;
  updateUserSubscription(id: string, data: Partial<InsertUserSubscription>): Promise<UserSubscription>;
}

export class DatabaseStorage implements IStorage {
  // Company
  async getCompany(): Promise<Company | undefined> {
    const result = await db.select().from(companies).limit(1);
    return result[0];
  }

  async createCompany(data: InsertCompany): Promise<Company> {
    const result = await db.insert(companies).values(data).returning();
    return result[0];
  }

  async updateCompany(id: string, data: InsertCompany): Promise<Company> {
    const result = await db.update(companies).set(data).where(eq(companies.id, id)).returning();
    return result[0];
  }

  // Management
  async getManagement(): Promise<Management[]> {
    return db.select().from(managementTeam);
  }

  async createManagement(data: InsertManagement): Promise<Management> {
    const result = await db.insert(managementTeam).values(data).returning();
    return result[0];
  }

  async updateManagement(id: string, data: InsertManagement): Promise<Management> {
    const result = await db.update(managementTeam).set(data).where(eq(managementTeam.id, id)).returning();
    return result[0];
  }

  async deleteManagement(id: string): Promise<void> {
    await db.delete(managementTeam).where(eq(managementTeam.id, id));
  }

  // Employees
  async getEmployees(): Promise<Employee[]> {
    return db.select().from(employees);
  }

  async createEmployee(data: InsertEmployee): Promise<Employee> {
    const result = await db.insert(employees).values(data).returning();
    return result[0];
  }

  async updateEmployee(id: string, data: InsertEmployee): Promise<Employee> {
    const result = await db.update(employees).set(data).where(eq(employees.id, id)).returning();
    return result[0];
  }

  async deleteEmployee(id: string): Promise<void> {
    await db.delete(employees).where(eq(employees.id, id));
  }

  // FKAP Team
  async getFkapTeam(): Promise<Fkap[]> {
    return db.select().from(fkapTeam);
  }

  async createFkap(data: InsertFkap): Promise<Fkap> {
    const result = await db.insert(fkapTeam).values(data).returning();
    return result[0];
  }

  async updateFkap(id: string, data: InsertFkap): Promise<Fkap> {
    const result = await db.update(fkapTeam).set(data).where(eq(fkapTeam.id, id)).returning();
    return result[0];
  }

  async deleteFkap(id: string): Promise<void> {
    await db.delete(fkapTeam).where(eq(fkapTeam.id, id));
  }

  // Audit Team
  async getAuditTeam(): Promise<Audit[]> {
    return db.select().from(auditTeam);
  }

  async createAudit(data: InsertAudit): Promise<Audit> {
    const result = await db.insert(auditTeam).values(data).returning();
    return result[0];
  }

  async updateAudit(id: string, data: InsertAudit): Promise<Audit> {
    const result = await db.update(auditTeam).set(data).where(eq(auditTeam.id, id)).returning();
    return result[0];
  }

  async deleteAudit(id: string): Promise<void> {
    await db.delete(auditTeam).where(eq(auditTeam.id, id));
  }

  // Qualifications
  async getQualifications(): Promise<Qualification[]> {
    return db.select().from(qualifications);
  }

  async createQualification(data: InsertQualification): Promise<Qualification> {
    const result = await db.insert(qualifications).values(data).returning();
    return result[0];
  }

  async updateQualification(id: string, data: InsertQualification): Promise<Qualification> {
    const result = await db.update(qualifications).set(data).where(eq(qualifications.id, id)).returning();
    return result[0];
  }

  async deleteQualification(id: string): Promise<void> {
    await db.delete(qualifications).where(eq(qualifications.id, id));
  }

  // Equipment
  async getEquipment(): Promise<Equipment[]> {
    return db.select().from(equipment);
  }

  async createEquipment(data: InsertEquipment): Promise<Equipment> {
    const result = await db.insert(equipment).values(data).returning();
    return result[0];
  }

  async updateEquipment(id: string, data: InsertEquipment): Promise<Equipment> {
    const result = await db.update(equipment).set(data).where(eq(equipment.id, id)).returning();
    return result[0];
  }

  async deleteEquipment(id: string): Promise<void> {
    await db.delete(equipment).where(eq(equipment.id, id));
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return db.select().from(projects);
  }

  async createProject(data: InsertProject): Promise<Project> {
    const result = await db.insert(projects).values(data).returning();
    return result[0];
  }

  async updateProject(id: string, data: InsertProject): Promise<Project> {
    const result = await db.update(projects).set(data).where(eq(projects.id, id)).returning();
    return result[0];
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Vendors
  async getVendors(): Promise<Vendor[]> {
    return db.select().from(vendors);
  }

  async createVendor(data: InsertVendor): Promise<Vendor> {
    const result = await db.insert(vendors).values(data).returning();
    return result[0];
  }

  async updateVendor(id: string, data: InsertVendor): Promise<Vendor> {
    const result = await db.update(vendors).set(data).where(eq(vendors.id, id)).returning();
    return result[0];
  }

  async deleteVendor(id: string): Promise<void> {
    await db.delete(vendors).where(eq(vendors.id, id));
  }

  // Documents
  async getDocuments(): Promise<Document[]> {
    return db.select().from(documents);
  }

  async createDocument(data: InsertDocument): Promise<Document> {
    const result = await db.insert(documents).values(data).returning();
    return result[0];
  }

  async deleteDocument(id: string): Promise<void> {
    await db.delete(documents).where(eq(documents.id, id));
  }

  // Generated Documents
  async getGeneratedDocuments(): Promise<GeneratedDocument[]> {
    return db.select().from(generatedDocuments).orderBy(generatedDocuments.createdAt);
  }

  async getGeneratedDocument(id: string): Promise<GeneratedDocument | undefined> {
    const result = await db.select().from(generatedDocuments).where(eq(generatedDocuments.id, id));
    return result[0];
  }

  async createGeneratedDocument(data: InsertGeneratedDocument): Promise<GeneratedDocument> {
    const result = await db.insert(generatedDocuments).values(data).returning();
    return result[0];
  }

  async updateGeneratedDocument(id: string, data: Partial<InsertGeneratedDocument>): Promise<GeneratedDocument> {
    const result = await db.update(generatedDocuments)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(generatedDocuments.id, id))
      .returning();
    return result[0];
  }

  async deleteGeneratedDocument(id: string): Promise<void> {
    await db.delete(generatedDocuments).where(eq(generatedDocuments.id, id));
  }

  // Document Templates
  async getDocumentTemplates(): Promise<DocumentTemplate[]> {
    return db.select().from(documentTemplates).orderBy(documentTemplates.sortOrder);
  }

  async getDocumentTemplate(id: string): Promise<DocumentTemplate | undefined> {
    const result = await db.select().from(documentTemplates).where(eq(documentTemplates.id, id));
    return result[0];
  }

  async getDocumentTemplateByCode(code: string): Promise<DocumentTemplate | undefined> {
    const result = await db.select().from(documentTemplates).where(eq(documentTemplates.code, code));
    return result[0];
  }

  // Clause References
  async getClauseReferences(): Promise<ClauseReference[]> {
    return db.select().from(clauseReferences).orderBy(clauseReferences.sortOrder);
  }

  async getClauseReferencesByPhase(phase: string): Promise<ClauseReference[]> {
    return db.select().from(clauseReferences).where(eq(clauseReferences.pdcaPhase, phase)).orderBy(clauseReferences.sortOrder);
  }

  // Dashboard Stats
  async getDashboardStats() {
    const [company] = await db.select().from(companies).limit(1);
    const employeeList = await db.select().from(employees);
    const fkapList = await db.select().from(fkapTeam);
    const qualificationList = await db.select().from(qualifications);
    const equipmentList = await db.select().from(equipment);
    const projectList = await db.select().from(projects);
    const vendorList = await db.select().from(vendors);
    const generatedDocList = await db.select().from(generatedDocuments);
    const managementList = await db.select().from(managementTeam);
    const auditList = await db.select().from(auditTeam);

    return {
      company: company ?? null,
      employees: employeeList.length,
      fkap: fkapList.length,
      qualifications: qualificationList.length,
      equipment: equipmentList.length,
      projects: projectList.length,
      vendors: vendorList.length,
      generatedDocuments: generatedDocList.length,
      management: managementList.length,
      audit: auditList.length,
    };
  }

  // Subscription Plans
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return db.select().from(subscriptionPlans).orderBy(subscriptionPlans.sortOrder);
  }

  async getSubscriptionPlan(id: string): Promise<SubscriptionPlan | undefined> {
    const [plan] = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, id));
    return plan;
  }

  async createSubscriptionPlan(data: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    const [plan] = await db.insert(subscriptionPlans).values(data).returning();
    return plan;
  }

  // Payment Orders
  async getPaymentOrders(): Promise<PaymentOrder[]> {
    return db.select().from(paymentOrders).orderBy(desc(paymentOrders.createdAt));
  }

  async getPaymentOrdersByUser(userId: string): Promise<PaymentOrder[]> {
    return db.select().from(paymentOrders).where(eq(paymentOrders.userId, userId)).orderBy(desc(paymentOrders.createdAt));
  }

  async getPaymentOrder(id: string): Promise<PaymentOrder | undefined> {
    const [order] = await db.select().from(paymentOrders).where(eq(paymentOrders.id, id));
    return order;
  }

  async getPaymentOrderByNumber(orderNumber: string): Promise<PaymentOrder | undefined> {
    const [order] = await db.select().from(paymentOrders).where(eq(paymentOrders.orderNumber, orderNumber));
    return order;
  }

  async createPaymentOrder(data: InsertPaymentOrder): Promise<PaymentOrder> {
    const [order] = await db.insert(paymentOrders).values(data).returning();
    return order;
  }

  async updatePaymentOrder(id: string, data: Partial<InsertPaymentOrder>): Promise<PaymentOrder> {
    const [order] = await db.update(paymentOrders).set(data).where(eq(paymentOrders.id, id)).returning();
    return order;
  }

  // User Subscriptions
  async getUserSubscription(userId: string): Promise<UserSubscription | undefined> {
    const [sub] = await db.select().from(userSubscriptions).where(eq(userSubscriptions.userId, userId));
    return sub;
  }

  async createUserSubscription(data: InsertUserSubscription): Promise<UserSubscription> {
    const [sub] = await db.insert(userSubscriptions).values(data).returning();
    return sub;
  }

  async updateUserSubscription(id: string, data: Partial<InsertUserSubscription>): Promise<UserSubscription> {
    const [sub] = await db.update(userSubscriptions).set(data).where(eq(userSubscriptions.id, id)).returning();
    return sub;
  }
}

export const storage = new DatabaseStorage();
