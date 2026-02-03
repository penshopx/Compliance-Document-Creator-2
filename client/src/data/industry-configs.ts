import type { IndustryConfig } from "@shared/config/industry-types";
import { smapConfig } from "./smap-config";
import { pancekConfig } from "./pancek-config";
import { konstruksiConfig } from "./konstruksi-config";
import { energiConfig } from "./energi-config";
import { migasConfig } from "./migas-config";
import { lingkunganConfig } from "./lingkungan-config";
import { umkmConfig } from "./umkm-config";
import { isoConfig } from "./iso-config";
import { k3Config } from "./k3-config";
import { tenderConfig } from "./tender-config";
import { keuanganConfig } from "./keuangan-config";

export const industryConfigs: Record<string, IndustryConfig> = {
  smap: smapConfig,
  pancek: pancekConfig,
  konstruksi: konstruksiConfig,
  energi: energiConfig,
  migas: migasConfig,
  lingkungan: lingkunganConfig,
  umkm: umkmConfig,
  iso: isoConfig,
  k3: k3Config,
  tender: tenderConfig,
  keuangan: keuanganConfig,
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

export { 
  smapConfig, 
  pancekConfig,
  konstruksiConfig,
  energiConfig,
  migasConfig,
  lingkunganConfig,
  umkmConfig,
  isoConfig,
  k3Config,
  tenderConfig,
  keuanganConfig,
};
