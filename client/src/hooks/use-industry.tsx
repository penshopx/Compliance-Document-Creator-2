import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { IndustryConfig, Template } from "@shared/config/industry-types";
import { industryConfigs, getDefaultIndustryId, getIndustryConfig } from "@/data/industry-configs";

interface IndustryContextValue {
  currentIndustryId: string;
  currentIndustry: IndustryConfig | undefined;
  setIndustry: (id: string) => void;
  industries: IndustryConfig[];
  getTemplate: (code: string) => Template | undefined;
  getAllTemplates: () => Template[];
  getTemplatesByCategory: (category: string) => Template[];
  resolveFieldValue: (key: string, customValues?: Record<string, string>) => string;
}

const IndustryContext = createContext<IndustryContextValue | undefined>(undefined);

const STORAGE_KEY = "compliance-hub-industry";

interface IndustryProviderProps {
  children: ReactNode;
}

export function IndustryProvider({ children }: IndustryProviderProps) {
  const [currentIndustryId, setCurrentIndustryId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && industryConfigs[stored]) {
        return stored;
      }
    }
    return getDefaultIndustryId();
  });

  const currentIndustry = getIndustryConfig(currentIndustryId);
  const industries = Object.values(industryConfigs).sort((a, b) => a.sortOrder - b.sortOrder);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currentIndustryId);
  }, [currentIndustryId]);

  const setIndustry = useCallback((id: string) => {
    if (industryConfigs[id]) {
      setCurrentIndustryId(id);
    }
  }, []);

  const getTemplate = useCallback((code: string): Template | undefined => {
    return currentIndustry?.templates.find(t => t.code === code);
  }, [currentIndustry]);

  const getAllTemplates = useCallback((): Template[] => {
    return currentIndustry?.templates || [];
  }, [currentIndustry]);

  const getTemplatesByCategory = useCallback((category: string): Template[] => {
    if (!currentIndustry) return [];
    if (category === "all") return currentIndustry.templates;
    return currentIndustry.templates.filter(t => t.category === category);
  }, [currentIndustry]);

  const resolveFieldValue = useCallback((key: string, customValues?: Record<string, string>): string => {
    if (customValues?.[key]) {
      return customValues[key];
    }
    
    const binding = currentIndustry?.dataBindings.find(b => b.key === key);
    if (!binding) return `{{${key}}}`;
    
    if (binding.source === "system") {
      if (binding.field === "date") {
        return new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
      }
      if (binding.field === "year") {
        return new Date().getFullYear().toString();
      }
    }
    
    return binding.defaultValue || `[${binding.label}]`;
  }, [currentIndustry]);

  const value: IndustryContextValue = {
    currentIndustryId,
    currentIndustry,
    setIndustry,
    industries,
    getTemplate,
    getAllTemplates,
    getTemplatesByCategory,
    resolveFieldValue,
  };

  return (
    <IndustryContext.Provider value={value}>
      {children}
    </IndustryContext.Provider>
  );
}

export function useIndustry() {
  const context = useContext(IndustryContext);
  if (!context) {
    throw new Error("useIndustry must be used within an IndustryProvider");
  }
  return context;
}
