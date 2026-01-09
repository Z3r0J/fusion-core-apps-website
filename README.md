# FusionCore Apps — Astro + React + Tailwind starter

A production‑ready website for your Google Play developer presence with a fully functional admin panel.

## Quick start

```bash
pnpm i   # or npm install / yarn
pnpm dev # http://localhost:4321
```

## 🎯 Admin Panel

Access the admin panel at `/admin` to manage your apps:

- ✨ Create new apps
- ✏️ Edit existing apps
- 🗑️ Delete apps
- 👁️ View published apps

### Setup Admin Panel

1. **Environment variables** are already configured in `.env`
2. **⚠️ IMPORTANT:** Change the default API key for production:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. Update `.env` with your secure key

📚 **Full documentation:** See [ADMIN_DOCS.md](./ADMIN_DOCS.md)

## What you get

- Astro + React islands + Tailwind CSS
- Semantic HTML, accessible nav, responsive layout
- Content collections with Markdown/MDX for apps and legal pages
- Dynamic app pages with JSON‑LD (`MobileApplication`)
- Sitemap & robots.txt (set `site` in `astro.config.mjs`)
- Apps "panel" with React filtering and Google Play CTAs
- **NEW:** Complete admin panel with CRUD operations

## Content

### Option 1: Use Admin Panel (Recommended)

Navigate to `/admin` and use the UI to create, edit, and delete apps.

### Option 2: Manual Editing

- Add new apps in `src/content/apps/*.md(x)` with frontmatter.
- Edit `src/content/legal/privacy.md` for your privacy policy.

Remember to replace `https://your-domain.com` in `astro.config.mjs` and `public/robots.txt`.
