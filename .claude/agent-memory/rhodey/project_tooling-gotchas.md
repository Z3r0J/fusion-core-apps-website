---
name: project-tooling-gotchas
description: Repo-wide formatter/linter behavior on fusion-core-apps-website — pnpm format reflows the entire repo, and check/lint are red on pre-existing non-feature issues.
metadata:
  type: project
---

`pnpm format` (= `prettier --write .`) reformats the ENTIRE repo, not just your changed files. Committed code uses 2-space indentation but `.prettierrc.mjs` sets `useTabs: true` (JSON/MD overridden to spaces), so one run rewrites ~100 files from spaces to tabs, reorders imports, and reflows long lines — burying the real change in `git diff --stat`.

**Why:** During the Expiroo launch-band task the instructed `pnpm format` blew `git diff --stat` up to 105 tracked files (e.g. `AppCard.astro` +135/-78 though never touched). Only 1 file was pure-whitespace under `git diff -w`; the rest mixed real branch work with prettier structural reflow, so hunks can't be cleanly isolated after the fact.

**How to apply:** On a feature branch here, prefer `pnpm exec prettier --write <specific files>` over `pnpm format`. Verify your deliverables by targeted grep, not diff-stat. Pre-existing red states unrelated to your feature (do not try to "fix" them in scope):
- `pnpm check`: ~9 ts errors — `src/pages/admin/index.astro` (`.value`/`.disabled` on `Element`), `src/layouts/BaseLayout.astro` (firebase inline script), `eslint.config.js` (ts2742).
- `pnpm lint`: repo-wide red (~2782 errors), almost all `astro/sort-attributes` (even the hero at `index.astro` L56/L120). The `lint-staged` pre-commit hook runs `eslint --fix` on staged `.astro`, which auto-normalizes attribute order at commit time.

See [[design-system-conventions]] for the art-direction rules that pair with this.
