---
name: google-genai version pin
description: Why @google/genai is pinned to 1.35.0 in this repl and must not be upgraded
---

The `@google/genai` package is pinned to **1.35.0** via package.json `overrides`.

**Why:** versions ≥1.36 pull in a `protobufjs` dependency whose install hits a
host the Replit environment firewall blocks, so `npm install` / packager fails.

**How to apply:**
- Never run the package installer for `@google/genai` (causes EOVERRIDE) — it is already installed.
- Never edit package.json to bump it.
- If a feature seems to need a newer genai API, find another path rather than upgrading.
