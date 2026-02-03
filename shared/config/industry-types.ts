import { z } from "zod";

// 5 Core Compliance Domains for Indonesian Businesses
export const ComplianceDomainEnum = z.enum([
  "legalitas",      // Legalitas - Legal documents (Akta, NIB, NPWP, etc.)
  "perijinan",      // Perijinan - Licensing (SBU, SKK, permits, etc.)
  "sertifikasi",    // Sertifikasi - Certification (ISO, SNI, K3, etc.)
  "tender",         // Tender - Procurement documents
  "operasional",    // Operasional/Produksi - Operational documents
]);

export type ComplianceDomain = z.infer<typeof ComplianceDomainEnum>;

export const ComplianceDomainInfoSchema = z.object({
  id: ComplianceDomainEnum,
  name: z.string(),
  shortName: z.string(),
  description: z.string(),
  icon: z.string(),
  color: z.string(),
  examples: z.array(z.string()),
});

export type ComplianceDomainInfo = z.infer<typeof ComplianceDomainInfoSchema>;

// Standard domain definitions used across all industries
export const COMPLIANCE_DOMAINS: ComplianceDomainInfo[] = [
  {
    id: "legalitas",
    name: "Legalitas Perusahaan",
    shortName: "Legalitas",
    description: "Dokumen dasar legalitas usaha seperti akta pendirian, NIB, NPWP, dan dokumen hukum lainnya",
    icon: "Scale",
    color: "blue",
    examples: ["Akta Pendirian", "NIB (OSS)", "NPWP", "TDP", "Domisili", "PKP"],
  },
  {
    id: "perijinan",
    name: "Perijinan Usaha",
    shortName: "Perijinan",
    description: "Izin-izin khusus yang diperlukan sesuai bidang usaha dan regulasi terkait",
    icon: "FileCheck",
    color: "green",
    examples: ["SBU", "SKK", "SIUP", "Izin Lokasi", "Izin Lingkungan"],
  },
  {
    id: "sertifikasi",
    name: "Sertifikasi & Standar",
    shortName: "Sertifikasi",
    description: "Sertifikasi nasional dan internasional untuk standarisasi mutu dan kepatuhan",
    icon: "Award",
    color: "amber",
    examples: ["ISO 9001", "ISO 14001", "SNI", "K3", "SMAP ISO 37001"],
  },
  {
    id: "tender",
    name: "Tender & Pengadaan",
    shortName: "Tender",
    description: "Dokumen untuk mengikuti tender, lelang, dan proses pengadaan barang/jasa",
    icon: "Gavel",
    color: "purple",
    examples: ["Dokumen Kualifikasi", "Penawaran", "RAB", "Metode Kerja"],
  },
  {
    id: "operasional",
    name: "Operasional & Produksi",
    shortName: "Operasional",
    description: "Dokumen operasional harian, SOP, laporan, dan dokumen produksi",
    icon: "Settings",
    color: "cyan",
    examples: ["SOP", "Laporan Proyek", "Quality Control", "HSE"],
  },
];

export const MenuItemSchema = z.object({
  title: z.string(),
  url: z.string(),
  icon: z.string(),
  badge: z.string().optional(),
});

export const MenuGroupSchema = z.object({
  label: z.string(),
  items: z.array(MenuItemSchema),
});

export const FeatureSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
});

export const TemplateSchema = z.object({
  code: z.string(),
  title: z.string(),
  titleEn: z.string().optional(),
  description: z.string(),
  category: z.string(),
  domain: ComplianceDomainEnum.optional(), // Link to one of 5 compliance domains
  clause: z.string().optional(),
  icon: z.string(),
  color: z.string(),
  promptTemplate: z.string(),
  requiredFields: z.array(z.string()).optional(),
});

export const DataBindingSchema = z.object({
  key: z.string(),
  label: z.string(),
  source: z.string(),
  field: z.string(),
  defaultValue: z.string().optional(),
});

export const ChatbotPersonaSchema = z.object({
  name: z.string(),
  description: z.string(),
  systemPrompt: z.string(),
  greetings: z.array(z.string()),
  suggestedTopics: z.array(z.string()),
  color: z.string(),
});

export const LandingContentSchema = z.object({
  badge: z.string(),
  headline: z.string(),
  headlineHighlight: z.string(),
  subheadline: z.string(),
  ctaPrimary: z.string(),
  ctaSecondary: z.string(),
  features: z.array(FeatureSchema),
  stats: z.array(z.object({
    value: z.string(),
    label: z.string(),
  })),
});

export const IndustryConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  shortName: z.string(),
  tagline: z.string(),
  description: z.string(),
  icon: z.string(),
  color: z.string(),
  landingContent: LandingContentSchema,
  menuGroups: z.array(MenuGroupSchema),
  templates: z.array(TemplateSchema),
  templateCategories: z.array(z.object({
    id: z.string(),
    label: z.string(),
  })),
  dataBindings: z.array(DataBindingSchema),
  chatbot: ChatbotPersonaSchema,
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

export type MenuItem = z.infer<typeof MenuItemSchema>;
export type MenuGroup = z.infer<typeof MenuGroupSchema>;
export type Feature = z.infer<typeof FeatureSchema>;
export type Template = z.infer<typeof TemplateSchema>;
export type DataBinding = z.infer<typeof DataBindingSchema>;
export type ChatbotPersona = z.infer<typeof ChatbotPersonaSchema>;
export type LandingContent = z.infer<typeof LandingContentSchema>;
export type IndustryConfig = z.infer<typeof IndustryConfigSchema>;
