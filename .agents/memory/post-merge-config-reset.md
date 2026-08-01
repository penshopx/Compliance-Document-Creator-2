---
name: Post-merge config resets on every merge
description: setPostMergeConfig must be re-applied after every task merge; it does not persist across merges.
---

# Post-merge config resets on every merge

`setPostMergeConfig` writes into `.replit`, but the platform overwrites `.replit` on each task merge (it restores the version from the merged branch). The result is that `scriptPath` and `timeoutMs` are wiped after every merge.

**Why:** The platform owns `.replit` during merges and resets it to the merged commit's version.

**How to apply:**
- After any task merge triggers a `HOOK_NOT_FOUND` post-merge error, immediately call `setPostMergeConfig({ scriptPath: "scripts/post-merge.sh", timeoutMs: 120000 })` followed by `runPostMergeSetup()` to recover.
- The script itself (`scripts/post-merge.sh`) survives in the repo — only the `.replit` pointer needs to be re-set each time.
- Consider checking `getPostMergeConfig()` at the start of any session that follows a merge.
