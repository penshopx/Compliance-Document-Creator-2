import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import pkg from "pg";
const { Pool } = pkg;
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
  users,
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
  type User,
  type InsertUser,
} from "@shared/schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);

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

  // Users (keeping for compatibility)
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Dashboard
  getDashboardStats(): Promise<{
    company: Company | null;
    employees: number;
    fkap: number;
    qualifications: number;
    equipment: number;
    projects: number;
    vendors: number;
  }>;
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

  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
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

    return {
      company: company ?? null,
      employees: employeeList.length,
      fkap: fkapList.length,
      qualifications: qualificationList.length,
      equipment: equipmentList.length,
      projects: projectList.length,
      vendors: vendorList.length,
    };
  }
}

export const storage = new DatabaseStorage();
