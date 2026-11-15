export type PancekPlanCounts = {
  totalDocuments: number;
  totalChecklistItems: number;
};

export function normalizePancekPlanFeatures(
  features: string,
  counts: PancekPlanCounts,
): string {
  return features
    .replace("25+ Template Dokumen Pancek", `${counts.totalDocuments} Dokumen Pancek`)
    .replace("30+ Checklist Item Pancek", `${counts.totalChecklistItems} Item Checklist Pancek`)
    .replace("Integrasi Referensi Jaga.id", "Panduan Jaga.id (proses resmi dilakukan manual)");
}
