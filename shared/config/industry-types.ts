import { z } from "zod";

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
