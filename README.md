# FusionCore Apps — Astro + React + Tailwind starter

A production‑ready website for your Google Play developer presence.

## Quick start

```bash
pnpm i   # or npm install / yarn
pnpm dev # http://localhost:4321
```

## What you get

- Astro + React islands + Tailwind CSS
- Semantic HTML, accessible nav, responsive layout
- Content collections with Markdown/MDX for apps and legal pages
- Dynamic app pages with JSON‑LD (`MobileApplication`)
- Sitemap & robots.txt (set `site` in `astro.config.mjs`)
- Apps "panel" with React filtering and Google Play CTAs

## Content

- Add new apps in `src/content/apps/*.md(x)` with frontmatter.
- Edit `src/content/legal/privacy.md` for your privacy policy.

Remember to replace `https://your-domain.com` in `astro.config.mjs` and `public/robots.txt`.
