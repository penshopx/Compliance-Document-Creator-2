import assert from "node:assert/strict";
import { test } from "node:test";

import { pancekConfig } from "@shared/data/pancek-config";
import { getPancekStats } from "@shared/data/pancek-data";
import { normalizePancekPlanFeatures } from "./pancek-plan-copy";

test("synchronizes legacy Pancek plan counts and clarifies manual Jaga.id workflow", () => {
  const result = normalizePancekPlanFeatures(
    "30+ Checklist Item Pancek,25+ Template Dokumen Pancek,Integrasi Referensi Jaga.id",
    { totalDocuments: 23, totalChecklistItems: 33 },
  );

  assert.equal(
    result,
    "33 Item Checklist Pancek,23 Dokumen Pancek,Panduan Jaga.id (proses resmi dilakukan manual)",
  );
});

test("leaves unrelated or already-customized plan copy unchanged", () => {
  const customCopy = "Dokumen dan checklist khusus perusahaan";
  assert.equal(
    normalizePancekPlanFeatures(customCopy, { totalDocuments: 23, totalChecklistItems: 33 }),
    customCopy,
  );
});

test("keeps Pancek landing counts and navigation aligned with its own workflow", () => {
  const stats = getPancekStats();
  const landingStats = new Map(pancekConfig.landingContent.stats.map(({ label, value }) => [label, value]));
  const menuItems = pancekConfig.menuGroups.flatMap((group) => group.items);

  assert.equal(landingStats.get("Dokumen Pancek"), String(stats.totalDocuments));
  assert.equal(landingStats.get("Fase PDCAR"), String(stats.totalPhases));
  assert.equal(landingStats.get("Item Checklist"), String(stats.totalChecklistItems));
  assert.equal(landingStats.get("Item Wajib"), String(stats.requiredItems));
  assert.ok(menuItems.some((item) => item.url === "/pancek/checklist"));
  assert.ok(menuItems.some((item) => item.url === "/pancek/documents"));
  assert.ok(!menuItems.some((item) => ["/smap-checklist", "/smap-reference", "/template-repository"].includes(item.url)));
});
