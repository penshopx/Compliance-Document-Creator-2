---
name: Industry availability feature flag
description: How to enable/disable industries app-wide and the gotchas (two datasets + standalone routes)
---

# Industry availability flag

`ENABLED_INDUSTRY_IDS` in `shared/data/industry-configs.ts` is the single source of truth for which industries are visible. Helpers: `getEnabledIndustries()`, `isIndustryEnabled(id)`. Re-enable an industry by adding its id to that array (e.g. add `"pancek"`).

**Why:** Product is "temporarily SMAP-only" but all 20 industries must stay intact and re-enableable, not deleted.

**How to apply — gotchas when gating industries:**
- There are TWO independent industry datasets: `industryConfigs` (@shared/data/industry-configs, drives sidebar menus + most pickers) AND `industryCompliances` (@shared/data/industry-pathways, drives welcome-page picker + `/pathway/:industryId/:domainId`). A selector reading from one is NOT covered by gating the other.
- Any user-facing industry selector must source its list from `useIndustry().industries` (already filtered to enabled), never from `Object.keys(industryConfigs)` / `Object.keys(industryCompliances)` directly.
- Route guards: param routes like `/pathway/:industryId/...` must check `isIndustryEnabled(industryId)` before resolving data. Standalone per-industry routes (e.g. `/pancek` in App.tsx) must be conditionally mounted behind `isIndustryEnabled(...)`.
- Sidebar industry switcher is hidden when `industries.length <= 1`.
- `getDefaultIndustryId()` and the `useIndustry` localStorage restore both validate against the enabled set so persistence can't get stuck on a disabled industry.
