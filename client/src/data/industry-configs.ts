import type { IndustryConfig } from "@shared/config/industry-types";
import { smapConfig } from "./smap-config";
import { pancekConfig } from "./pancek-config";

export const industryConfigs: Record<string, IndustryConfig> = {
  smap: smapConfig,
  pancek: pancekConfig,
};

export const getIndustryConfig = (id: string): IndustryConfig | undefined => {
  return industryConfigs[id];
};

export const getAllIndustries = (): IndustryConfig[] => {
  return Object.values(industryConfigs).sort((a, b) => a.sortOrder - b.sortOrder);
};

export const getDefaultIndustryId = (): string => {
  return "smap";
};

export { smapConfig, pancekConfig };
