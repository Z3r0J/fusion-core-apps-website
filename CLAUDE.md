# FusionCore Apps Website

Web presence / Google Play landing site for the FusionApps family (Biblia TLA, Bible TPT, CartWise, Claimly) — marketing pages, SEO blog, app comparisons, and a PIN-gated admin panel. Astro-rendered static site with React islands, trilingual (en/es/pt).

## Stack

Exact versions from `package.json`:

- **Astro 5.13.11** — static output with selective server routes via the Vercel adapter.
- **React 19.1.2** islands — `@astrojs/react` 4.3.1, `@types/react` 19.1.17.
- **Tailwind CSS 4.1.11** — via `@tailwindcss/vite` (no `tailwind.config.js`; config is CSS-first in `src/styles/global.css`). Plugins: `@tailwindcss/forms`, `@tailwindcss/typography`, `@tailwindcss/aspect-ratio`. `prettier-plugin-tailwindcss` sorts classes.
- **`@astrojs/vercel` 8.2.11** — deploy target (`adapter: vercel()`), `site: https://www.fusioncoreapps.com`, `trailingSlash: "never"`.
- **`@astrojs/mdx` 4.3.4** — MDX content authoring.
- **`@astrojs/sitemap` 3.5.1** — installed but NOT wired into `integrations` (see Critical Rules).
- **framer-motion 12.38.0** — animation (`AnimatedSection`, `StatsCounter`).
- **zod 4.0.17** — content-collection schemas + API payload validation.
- **lucide-react 0.525.0**, **clsx 2.1.1** + **tailwind-merge 3.3.1** (`cn()` in `src/lib/utils.ts`).
- **google-play-scraper 10.1.2** (devDep) — `scripts/fetch-play-store.mjs` pulls live Play Store data.
- Tooling: **ESLint 9.32** (flat config `eslint.config.js`, `eslint-plugin-astro` + `jsx-a11y`), **Prettier 3.6.2**, **husky 9.1.7** + **lint-staged 16.1.6**, **TypeScript 5.8.3**.
- Package manager: **pnpm** (`pnpm-lock.yaml`). Node pinned via `.nvmrc`.

## Commands

Real scripts from `package.json`:

```bash
pnpm dev            # astro dev — http://localhost:4321
pnpm build          # astro build → .vercel/output
pnpm preview        # astro preview
pnpm check          # astro check && tsc --noEmit  (type gate)
pnpm lint           # eslint .
pnpm lint:fix       # eslint . --fix
pnpm format         # prettier --write .
pnpm format:check   # prettier --check .
# husky "prepare" installs the pre-commit hook (lint-staged)
```

Never run `pnpm build` after a change unless explicitly asked.

## Architecture

- **`src/pages/`** — dual route tree. `src/pages/*.astro` serve the default `en` locale **unprefixed** (`prefixDefaultLocale: false`); `src/pages/[locale]/*.astro` serve `es` + `pt`. `[locale]/index.astro` `getStaticPaths()` hardcodes `["es","pt"]` — `en` is deliberately excluded because it lives in the unprefixed tree. Section subtrees: `apps/`, `blog/`, `compare-apps/`, `cartwise/` (flagship landing + privacy/terms), plus `contact`, `privacy`, `terms`, `404`.
- **`src/pages/admin/index.astro` + `src/pages/api/`** — admin panel. `api/auth/*` = PIN login (`validate-pin.ts`), rate limiting, HTTP-only cookie session, `get-api-key.ts`, `logout.ts`, `check-session.ts`. `api/apps/*` = CRUD (`create`/`update`/`delete`/`[slug]`) that reads/writes Markdown files. `api/contact.ts` = contact form handler. All API routes set `export const prerender = false`.
- **`src/i18n/`** — homegrown i18n (NOT a library). `utils.ts` (god node, 28 edges) exports `Locale` (`'en'|'es'|'pt'`), `useTranslations()` (dot-path lookup over `en.json`/`es.json`/`pt.json`, 331 keys each; missing key → returns the key), and path helpers `getLocalePath` / `stripLocalePath` / `getLocaleFromPath`.
- **`src/content/`** — Zod-typed collections defined in `content/config.ts`: `apps`, `blog`, `comparisons`, `legal`. Entries organized by locale subdirectory (`apps/en/…`, `apps/es/…`, `apps/pt/…`); pages resolve content via `getCollection(..., ({ slug }) => slug.startsWith(\`${locale}/\`))`. `blog`/`comparisons` use `translationKey` to link cross-locale siblings for hreflang.
- **`src/components/`** — `.astro` server components (`AppCard`, `Breadcrumbs`, JSON-LD emitters `AppJsonLd`/`BlogJsonLd`/`FaqJsonLd`) + `.tsx` React islands (`AppGrid`, `AppShowcase`, `ContactForm`, `FaqAccordion`, `LanguagePicker`, `ThemeToggle`, `AnimatedSection`). `src/layouts/BaseLayout.astro` is the shared shell.

God nodes (from `graphify-out/GRAPH_REPORT.md`): `@/i18n/utils` (28), `useTranslations()` (20), `Locale` (17), `compilerOptions` (12), `scripts` (11), `validSessions` (4), `POST()` (4), `useDebounced()` (3).

## Critical Rules

- **Islands architecture — hydrate only what is interactive.** Current usage: 9 `client:load` (`AppGrid`, `AppShowcase`, `ContactForm`, `ThemeToggle`, `LanguagePicker`, `NotFound`) + 14 `client:visible` (`AnimatedSection`, `FaqAccordion`). Prefer `client:visible`/`client:idle` for below-the-fold; reserve `client:load` for immediately-interactive UI. Never make a whole page a client component.
- **i18n is homegrown — do not add an i18n library.** Add copy to all three of `en/es/pt.json` under the same dot-path key, and read it via `useTranslations(locale)`. Build locale-aware URLs with `getLocalePath()`, never hand-concatenate prefixes.
- **New pages must exist in BOTH trees.** A route needs `src/pages/<route>.astro` (en, unprefixed) AND `src/pages/[locale]/<route>.astro` (es/pt). Adding one without the other silently drops locales.
- **Sitemap is NOT `@astrojs/sitemap`.** It is generated by prerendered endpoints `src/pages/sitemap-index.xml.ts` + `sitemap-0.xml.ts`. The integration's `astro:build:done` hook runs after the Vercel adapter packages static output, so its XML never ships — see the note in `astro.config.mjs`. Do not "fix" this by re-adding the integration.
- **Validate every API input with Zod.** `api/apps/*` and `api/contact.ts` parse request bodies with `z.object(...).safeParse`; return 400 on failure. API routes are server-rendered (`prerender = false`) and auth-gated (PIN cookie or `x-api-key`).
- **Admin writes go to the filesystem.** `api/apps/create.ts` `writeFile`s Markdown into `src/content/apps/`. This mutates the repo in local dev; on Vercel the FS is ephemeral, so admin edits do not persist to production without a commit + rebuild. Treat the admin panel as a local authoring tool.

## Conventions

- **Tabs** for indentation (`.editorconfig`, `.prettierrc.mjs`), double quotes, semicolons. Run `pnpm format` before committing; lint-staged auto-fixes on commit.
- **Path alias `@/…`** → `src/…` (tsconfig `baseUrl`). Use it instead of deep relative imports.
- **Conventional commits only.** Never add `Co-Authored-By` or AI attribution.
- **Class merging** via `cn()` (`src/lib/utils.ts`); don't hand-concatenate conditional class strings.
- `pnpm check` (astro check + tsc) must pass — TypeScript is the type gate.

## Boundaries

- Do not commit or expose `.env` secrets (`ADMIN_PIN`, `API_KEY`, contact-form keys). `.env.example` documents the shape.
- Do not touch `dist/`, `.vercel/`, `.astro/`, or `graphify-out/` by hand — they are generated.
- Do not run `graphify update .` or `pnpm build` unless asked.
- Surgical changes only: touch what the request requires; match the surrounding tab/quote style; mention dead code, don't silently delete it.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
