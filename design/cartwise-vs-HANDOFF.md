# CartWise vs [Competitor] — Editorial Article Handoff

**Mockup:** `design/cartwise-vs-template.html` (CartWise vs Bring! as sample; open in browser, toggle dark/light top-right)  
**Replaces:** `design/cartwise-comparison-template.html` — the old table-landing format is superseded. The file can be deleted.  
**Target routes:** `/compare/cartwise-vs-[slug]` (one Astro template, N content files)

---

## 1. Content Model

Each comparison page is driven by **one Markdown file** with YAML frontmatter. The Markdown body is the full ~2 000-word article (prose + two tables + good/bad lists). The builder renders it; it is never translated at launch.

### 1a. Frontmatter schema

```yaml
# ── Identity ──────────────────────────────────────────────────────────────────
slug: bring                           # URL segment: /compare/cartwise-vs-bring
competitorName: "Bring!"              # Display name used in prose and chrome tokens
updatedAt: "2026-06"                  # "YYYY-MM" — shown in byline as "Updated June 2026"

# ── SEO ───────────────────────────────────────────────────────────────────────
title: "CartWise vs Bring!: Which Grocery List App Wins in 2026?"
description: >
  CartWise vs Bring! — an honest, editorial comparison of features, pricing,
  offline access, and sharing. Updated June 2026.

# ── Ratings (used in hero rating callouts) ───────────────────────────────────
cartwiseRating: 4.7
cartwiseReviewCount: "680+"           # string so you can write "1.2K" or "—"
competitorRating: 4.5
competitorReviewCount: "150K+"        # null if unknown

# ── Hero ──────────────────────────────────────────────────────────────────────
heroDeck: >
  Both apps let you build grocery lists and share them with family. But Bring!
  and CartWise take very different bets on what "smart" means. Here is an honest
  look at both.

heroCtaUrl: "https://play.google.com/store/apps/details?id=com.fusionapps.cartwise"

# ── Related pages (shown in "Read about other alternatives" card grid) ────────
relatedSlugs:
  - listonic
  - anylist
  - ourgroceries

# ── Competitor icon (emoji fallback while no asset exists) ───────────────────
competitorIconEmoji: "🛍️"            # shown in hero icon pair and pro/con card
```

### 1b. Markdown body structure (fixed H2 skeleton)

Every article must follow this section order. H2 text is editorial — write naturally, do not copy the headings literally.

```markdown
## What to keep in mind about grocery list apps
<!-- ~3 paragraphs. Neutral framing before naming either app.
     Sets reader expectations. No winner language here. -->

## Quick breakdown
<!-- Table 1 (see format below).
     Short 1-line intro sentence before the table. -->

## CartWise
<!-- Pro/Con block rendered from the good/bad bullet lists below.
     Writer adds 4 "The good" bullets and 1-2 "The bad" bullets.
     Use the special fenced block syntax (see 1c). -->

## {{competitorName}}
<!-- Pro/Con block for the competitor.
     3 "The good" bullets and 3-4 "The bad" bullets. -->

## CartWise vs {{competitorName}}: Free Features Face-Off
<!-- Table 2 — feature matrix (see format below). -->

## The winner: CartWise
<!-- Mid-article verdict callout. Rendered as the dark `winner-callout` block.
     2–3 sentences. May concede a niche where the competitor wins. -->

## [Themed section 1 title — e.g. "Price tracking & budgeting"]
## [Themed section 2 title — e.g. "Sharing & collaboration"]
## [Themed section 3 title — e.g. "Voice & AI"]
## [Themed section 4 title — e.g. "Offline access & no-account setup"]
<!-- 3–4 themed prose sections, ~3 paragraphs each.
     Head-to-head analysis. Concede real competitor strengths.
     These are body prose — no special blocks. -->

## The winner: CartWise
<!-- Final verdict — 3 paragraphs.
     Summarise the clear winner and the niche exception.
     May optionally contain the mid-article CTA band after this section. -->

## Read about other alternatives
<!-- Rendered as the related-card grid. No prose — the builder generates cards
     from relatedSlugs[] in frontmatter. Just include the heading. -->
```

### 1c. Table 1 — "Quick breakdown" (markdown table)

6 fixed emoji-labelled rows. Both content columns are free text (no check/cross).

```markdown
| Category          | CartWise                         | {{competitorName}}      |
|-------------------|----------------------------------|-------------------------|
| ⭐ Best feature   | Live price calculator            | Recipe import           |
| 👥 Best for       | Budget-focused shoppers          | Recipe planners         |
| 🔥 Game-changer   | Voice-to-list + AI suggestions   | Community product catalog |
| 🤖 AI             | AI list generation               | None listed             |
| 💎 Pricing        | Free · Pro optional              | Free · Bring! Plus paid |
| ☝️ Overall        | Best for fast, offline shopping  | Better for recipe discovery |
```

### 1d. Table 2 — Feature matrix (markdown table)

Use `✓` / `✗` / short text in cells. CartWise column values are fixed (see defaults). Competitor column changes per page. The builder applies `.td-cw` highlight styling to the CartWise column.

```markdown
| Feature                   | CartWise         | {{competitorName}} |
|---------------------------|------------------|--------------------|
| Real-time price calculator | ✓               | ✗                  |
| Free tier available        | ✓               | ✓                  |
| No account required        | ✓               | Required           |
| Fully works offline        | ✓               | Partial            |
| Voice input                | ✓               | Not listed         |
| AI-generated lists         | ✓               | Not listed         |
| Share via QR + link        | ✓               | Link only          |
| Recipe import              | ✗               | ✓                  |
| iOS + Android              | Android          | Both               |
| Ad-free option             | Pro upgrade      | Bring! Plus        |
```

Cell rendering rules (identical to old handoff §6):
- `✓` → `.cell-yes` (cyan checkmark + "Yes")
- `✗` → `.cell-no` (gray X + "No")
- Any other short string → `.cell-partial` (muted pill label)

### 1e. Pro/Con blocks

Use a fenced div with data attribute so the builder can render the styled card:

```markdown
:::procon{app="cartwise" tagline="Grocery List + Price Calculator · Android · Free" rating="4.7" ratingLabel="4.7"}
**The good**
- **Real-time price calculator.** Running total updates as you check off items.
- **No account required.** Open the app and start immediately.
- **Voice input and AI lists.** Say items or describe a meal, CartWise does the rest.
- **Genuinely offline.** All data lives on-device first.

**The bad**
- **Android only for now.** No iOS app yet.
- **No recipe browser.** CartWise focuses on the shopping act, not discovery.
:::

:::procon{app="competitor" tagline="Shopping List · iOS + Android · Free" rating="4.5" ratingLabel="4.5"}
**The good**
- **Huge community catalog.** Well-established product database with images.
- ...

**The bad**
- **No price calculator.** No built-in spend tracking.
- ...
:::
```

The builder maps `app="cartwise"` to the CartWise icon and `app="competitor"` to `competitorIconEmoji` from frontmatter.

---

## 2. i18n Chrome Keys — `cartwiseCompare.*`

These are the **fixed UI labels** translated across all compare pages. Article prose (H2 text, paragraph body, table cell values) is English-only and lives in the Markdown file — it is NOT translated.

| Key | Default (en) | Notes |
|-----|-------------|-------|
| `cartwiseCompare.breadcrumb.home` | `Home` | |
| `cartwiseCompare.breadcrumb.compare` | `Compare apps` | |
| `cartwiseCompare.hero.vsLabel` | `VS` | icon-pair separator pill |
| `cartwiseCompare.hero.eyebrow` | `CartWise vs {{competitor}}` | `{{competitor}}` = `competitorName` from frontmatter |
| `cartwiseCompare.hero.titleSuffix` | `Which Grocery List App Wins in 2026?` | appended after "CartWise vs X:" |
| `cartwiseCompare.hero.updatedLabel` | `Updated` | shown before the `updatedAt` value |
| `cartwiseCompare.hero.readTime` | `~8 min read` | |
| `cartwiseCompare.hero.byAuthor` | `By FusionCore Apps` | |
| `cartwiseCompare.hero.ctaDownload` | `Get CartWise on Google Play` | hero primary CTA button |
| `cartwiseCompare.hero.ctaCompare` | `See the comparison ↓` | hero ghost button |
| `cartwiseCompare.hero.ratingLabel` | `reviews` | suffix for review count: "4.7 (680+ reviews)" |
| `cartwiseCompare.quickTable.eyebrow` | *(none — section has no eyebrow)* | |
| `cartwiseCompare.quickTable.colCategory` | `Category` | Table 1 column header |
| `cartwiseCompare.quickTable.colCartwise` | `CartWise` | Table 1 column header |
| `cartwiseCompare.quickTable.winnerBadge` | `✓ Recommended` | badge inside CartWise header cell |
| `cartwiseCompare.featureTable.eyebrow` | `Side-by-side comparison` | |
| `cartwiseCompare.featureTable.subhead` | `A factual feature breakdown. No spin — you decide.` | |
| `cartwiseCompare.featureTable.colFeature` | `Feature` | Table 2 column header |
| `cartwiseCompare.featureTable.winnerBadge` | `✓ Recommended` | badge inside CartWise column header |
| `cartwiseCompare.featureTable.footnote` | `Feature information is based on publicly available store listings and official descriptions. Some features may vary by region or app version.` | |
| `cartwiseCompare.procon.goodLabel` | `The good` | pro/con block sub-header |
| `cartwiseCompare.procon.badLabel` | `The bad` | pro/con block sub-header |
| `cartwiseCompare.winnerCallout.label` | `The winner` | dark callout pill label |
| `cartwiseCompare.ctaMid.headline` | `Download CartWise free` | mid-article CTA band |
| `cartwiseCompare.ctaMid.subline` | `No account, no setup — add your first item in under 10 seconds.` | |
| `cartwiseCompare.ctaMid.button` | `Get it on Google Play` | |
| `cartwiseCompare.related.label` | `Read about other alternatives` | section eyebrow |
| `cartwiseCompare.related.heading` | `More CartWise comparisons` | |
| `cartwiseCompare.related.cardTag` | `Compare` | card pill label |
| `cartwiseCompare.related.seeAllLabel` | `All comparisons` | "see all" card tag |
| `cartwiseCompare.related.seeAllTitle` | `See all app comparisons` | |
| `cartwiseCompare.related.seeAllSub` | `Browse every CartWise comparison guide` | |
| `cartwiseCompare.cta.eyebrow` | `Ready to switch?` | final CTA band section label |
| `cartwiseCompare.cta.headline` | `Ready to try a free {{competitor}} alternative?` | `{{competitor}}` interpolated |
| `cartwiseCompare.cta.subline` | `Download CartWise in seconds. No account, no setup — just start your list.` | |
| `cartwiseCompare.cta.ctaButton` | `Download on Google Play` | |
| `cartwiseCompare.cta.trustFree` | `Free` | |
| `cartwiseCompare.cta.trustNoAccount` | `No account` | |
| `cartwiseCompare.cta.trustOffline` | `Works offline` | |
| `cartwiseCompare.cta.trustPlatform` | `Android` | |

Keys that contain `{{competitor}}` (interpolate `competitorName` at build time):
- `cartwiseCompare.hero.eyebrow`
- `cartwiseCompare.cta.headline`

The `hero.titleSuffix` approach avoids embedding the competitor name in an i18n key — the builder concatenates `CartWise vs {{competitorName}}: ` + the translated suffix.

---

## 3. Component / Class Reuse

### Reused from `cartwise-landing.html` (no changes needed)

| Element | Class / pattern |
|---------|----------------|
| Dot-grid overlay | Inline `background-image: radial-gradient(circle, ...)` — copy verbatim |
| Cyan glow blob | Inline absolutely-positioned div — copy verbatim |
| Orange glow blob | Inline absolutely-positioned div — copy verbatim |
| Section eyebrow | `.section-label` + `.section-label__dot` |
| Download button | `.btn-download` |
| Ghost button | `.btn-ghost` |
| Trust badges | `.trust-badge` |
| Final CTA band | `.cta-band` + same dark gradient background |

### New patterns introduced in this template

| Block | CSS class(es) | Description |
|-------|--------------|-------------|
| Breadcrumb | `.breadcrumb`, `.breadcrumb-sep`, `.breadcrumb-current`, `.breadcrumb a` | Slim nav trail above hero title |
| App icon pair | `.hero-icon-pair`, `.hero-app-icon`, `.hero-icon-vs` | CartWise + VS pill + competitor icon row |
| Byline row | `.byline`, `.byline-author`, `.byline-sep` | Author + date + read time below hero CTA |
| Rating callout | `.rating-callout`, `.star-row` | Small pill with stars + score + count |
| Table 1 — Quick breakdown | `.table-quick`, `.th-label/.th-cartwise/.th-competitor`, `.td-label/.td-cartwise/.td-competitor`, `.winner-badge-quick` | 6-row emoji-labelled at-a-glance table |
| Table 2 — Feature matrix | `.table-matrix`, `.th-feature/.th-cw/.th-comp`, `.td-feat/.td-cw/.td-comp`, `.winner-badge-matrix` | Full feature check/cross table; CartWise column highlighted |
| Cell glyphs | `.cell-yes`, `.cell-no`, `.cell-partial` | Inline check/cross/text cell renderers |
| Pro/Con card | `.procon-card`, `.procon-header`, `.procon-app-icon`, `.procon-app-name`, `.procon-tagline`, `.procon-list`, `.pro-icon`, `.con-icon`, `.procon-list-header.good/.bad`, `.pros-section` | App icon + name + rating + good/bad lists |
| Winner callout (dark) | `.winner-callout`, `.winner-callout-inner`, `.winner-label`, `.winner-headline`, `.winner-sub` | Dark card with glow + dot-grid, mid-article verdict |
| Mid-article CTA band | `.cta-band-mid`, `.cta-band-mid-inner`, `.cta-band-mid-text` | Dark inline CTA with text + download button |
| Prose body | `.prose-article`, `.prose-h2` | Themed section paragraphs; h2 styling for article headings |
| Related card grid | `.related-card`, `.related-card-tag`, `.related-card-title`, `.related-card-sub` | Auto-fill grid of sibling compare links |

### Dark-mode implementation note

All inline `color:` values in the mockup are patched by the JS toggle. In Astro production, **replace every inline color with Tailwind classes** (`text-gray-900 dark:text-white`, etc.). The `html.dark` class comes from the existing `ThemeToggle` component in the site header. The dark body background (`#020617`) and the article-hero gradient are already in the site's `global.css` — do not duplicate them.

---

## 4. Fairness guidelines for content authors

- In Table 2, only use `✓` when the feature is documented in the competitor's public App Store / Play listing or official website.
- Only use `✗` when the feature is verifiably absent — not just unlisted. Use `"Not listed"` when uncertain.
- In pro/con "The bad" bullets for the competitor, prefer "CartWise also has X" framing over "{{competitor}} doesn't have X" unless the absence is verifiable.
- The `winner-callout` and `winner-badge` are clearly labelled as self-promotion — acceptable as-is per standard editorial practice for app-maker comparison guides.
- Concede at least one real competitor strength in the "The good" section and in the final verdict paragraph. This is both honest and essential for credibility.

---

## 5. Asset paths

```
/images/apps/cartwise-grocery-shopping-list/icon.png   — CartWise icon (hero + pro/con card)
/images/apps/[competitor-slug]/icon.png                — competitor icon (use emoji fallback if missing)
```

Google Play URL (hardcoded in template): `https://play.google.com/store/apps/details?id=com.fusionapps.cartwise`
