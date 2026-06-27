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
import { kesehatanConfig } from "./kesehatan-config";
import { pendidikanConfig } from "./pendidikan-config";
import { teknologiConfig } from "./teknologi-config";
import { pertanianConfig } from "./pertanian-config";
import { manufakturConfig } from "./manufaktur-config";
import { propertiConfig } from "./properti-config";
import { logistikConfig } from "./logistik-config";
import { pariwisataConfig } from "./pariwisata-config";
import { telekomunikasiConfig } from "./telekomunikasi-config";

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
  kesehatan: kesehatanConfig,
  pendidikan: pendidikanConfig,
  teknologi: teknologiConfig,
  pertanian: pertanianConfig,
  manufaktur: manufakturConfig,
  properti: propertiConfig,
  logistik: logistikConfig,
  pariwisata: pariwisataConfig,
  telekomunikasi: telekomunikasiConfig,
};

export const getIndustryConfig = (id: string): IndustryConfig | undefined => {
  return industryConfigs[id];
};

// Feature flag: which industries are currently active/visible in the app.
// To re-enable a hidden industry later, just add its id here (e.g. "pancek").
export const ENABLED_INDUSTRY_IDS: string[] = ["smap"];

export const isIndustryEnabled = (id: string): boolean => {
  return ENABLED_INDUSTRY_IDS.includes(id);
};

export const getAllIndustries = (): IndustryConfig[] => {
  return Object.values(industryConfigs).sort((a, b) => a.sortOrder - b.sortOrder);
};

export const getEnabledIndustries = (): IndustryConfig[] => {
  return getAllIndustries().filter((c) => ENABLED_INDUSTRY_IDS.includes(c.id));
};

export const getDefaultIndustryId = (): string => {
  const first = ENABLED_INDUSTRY_IDS[0];
  return first && industryConfigs[first] ? first : "smap";
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
  kesehatanConfig,
  pendidikanConfig,
  teknologiConfig,
  pertanianConfig,
  manufakturConfig,
  propertiConfig,
  logistikConfig,
  pariwisataConfig,
  telekomunikasiConfig,
};
