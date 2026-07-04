# CartWise Comparison Page — Builder Handoff

**Target routes:** `/alternatives/listonic`, `/alternatives/anylist`, `/alternatives/ourgroceries`, `/alternatives/bring`  
**Mockup file:** `design/cartwise-comparison-template.html` (open in any browser; toggle top-right for dark mode)  
**One Astro template renders all four pages** — all variable content comes from per-competitor content files.

---

## 1. Section List & Pattern Reuse

| # | Section | Anchor | Pattern Source |
|---|---------|--------|----------------|
| 1 | Hero | `#hero` | Mirrors `cartwise-landing.html` hero: same dot-grid, cyan glow, orange glow, `landing-hero` class, phone-frame pair, eyebrow, gradient headline, btn-download + btn-ghost, trust badges |
| 2 | Comparison Table | `#comparison` | New pattern (see below). Two-column table: CartWise column has dark header + cyan accent border; competitor column is neutral. Check/cross glyphs reuse landing `.check-list` glyph style. |
| 3 | Why Switch — highlight cards | `#why-switch` | Reuses `feature-card` + `feature-icon-wrap` — identical to the landing's Feature Grid section. |
| 4 | Screenshot Strip | `#screenshots` | Reuses `phone-frame`, `phone-notch`, `phone-shine`, `screenshots-scroll` — identical to the landing's Screenshot Showcase (3 frames instead of 6). |
| 5 | FAQ | `#faq` | Reuses `.faq-item`, `.faq-btn`, `.faq-answer`, `.faq-chevron`, `toggleFaq()` — identical to the landing's FAQ accordion. |
| 6 | Final CTA Band | `#cta` | Reuses `.cta-band` with dot-grid + dual glow + `btn-download` — identical to the landing's CTA band. |

### New patterns introduced by this template

| Pattern | CSS Class | Description |
|---------|-----------|-------------|
| Comparison table | `.compare-table`, `.col-cartwise-head`, `.col-competitor-head`, `.td-cartwise`, `.td-competitor`, `.td-feature` | Borderless table with rounded corners, CartWise column tinted cyan, competitor column neutral |
| Cell check glyph | `.cell-yes` | Cyan checkmark + "Yes" label |
| Cell cross glyph | `.cell-no` | Gray X |
| Winner badge | `.winner-badge` | Cyan gradient pill in CartWise column header ("✓ Recommended") |

---

## 2. Data Model — Content Schema

Each competitor page needs one content file. Suggested location: `src/content/alternatives/<slug>.json` (or `.ts` exporting a typed object).

### TypeScript interface (single source of truth)

```ts
export interface ComparisonPageData {
  // ── Identity ──────────────────────────────────────────────────
  /** URL slug, e.g. "listonic" — used in getStaticPaths */
  slug: string;

  /** Display name, e.g. "Listonic" */
  competitorName: string;

  // ── SEO ───────────────────────────────────────────────────────
  seo: {
    /** <title> tag. Keep under 60 chars.
     *  Example: "CartWise vs Listonic — Free Listonic Alternative" */
    title: string;

    /** <meta name="description">. Keep under 155 chars. */
    description: string;

    /** Canonical URL path, e.g. "/alternatives/listonic" */
    canonical: string;
  };

  // ── Hero ──────────────────────────────────────────────────────
  hero: {
    /** H1 text. Should mention competitor and a key CartWise differentiator.
     *  Example: "The free Listonic alternative with a real price calculator" */
    headline: string;

    /** 1–2 sentence subhead expanding on the headline.
     *  Keep factual, no superlatives. Max ~180 chars. */
    subhead: string;
  };

  // ── Comparison table ──────────────────────────────────────────
  /** Ordered list of feature rows. Rendered top-to-bottom in the table. */
  comparison: ComparisonRow[];

  // ── Highlight cards (Why Switch section) ─────────────────────
  /** 3 or 4 highlight cards. 4 is the design default; 3 is also valid. */
  highlights: HighlightCard[];

  // ── FAQ ───────────────────────────────────────────────────────
  /** 4–6 Q&A pairs. The first 3 (free?, import?, account?) can be
   *  shared defaults overridden per competitor. The last 1–3 should
   *  be competitor-specific. */
  faq: FaqItem[];
}

// ── Sub-types ────────────────────────────────────────────────────────────

export interface ComparisonRow {
  /** Feature label shown in left column. Keep under 40 chars.
   *  Example: "Real-time price calculator" */
  feature: string;

  /** CartWise cell value.
   *  Use "✓" for a checkmark cell, "✗" for a cross cell,
   *  or a short string (≤ 30 chars) for nuanced text.
   *  Example: "✓" | "Pro upgrade" | "Android" */
  cartwise: "✓" | "✗" | string;

  /** Competitor cell value — same rules as cartwise.
   *  Use "✓" | "✗" | short text.
   *  NEVER use language that disparages the competitor.
   *  Example: "✗" | "Paid only" | "iOS + Android" */
  competitor: "✓" | "✗" | string;
}

export interface HighlightCard {
  /** Lucide icon name (maps to an SVG in the Astro component).
   *  Available options: "calculator" | "mic" | "sparkles" | "share-2" |
   *  "bar-chart-2" | "wifi-off" | "bell" | "layout-grid" | "globe"
   *  (matches the icon set used on the landing feature grid) */
  icon: string;

  /** Card title. Keep under 35 chars. */
  title: string;

  /** 1–2 sentence description. Keep under 120 chars. */
  desc: string;
}

export interface FaqItem {
  /** Question text. May include the competitor name. Max 90 chars. */
  q: string;

  /** Answer text. Plain text, 1–4 sentences. No HTML.
   *  NEVER make absolute claims about the competitor.
   *  "CartWise also has X" is fine; "{{competitor}} doesn't have X" requires verification. */
  a: string;
}
```

### Minimum required rows for the comparison table

The template ships with these 9 rows in order. Content authors should provide a value for every row — use a short text string if ✓/✗ is not accurate.

| Index | Feature label (fixed chrome) | CartWise default |
|-------|------------------------------|-----------------|
| 0 | Real-time price calculator | `"✓"` |
| 1 | Free tier available | `"✓"` |
| 2 | No account required | `"✓"` |
| 3 | Works offline | `"✓"` |
| 4 | Voice input | `"✓"` |
| 5 | AI-generated lists | `"✓"` |
| 6 | Share via QR + WhatsApp | `"✓"` |
| 7 | Ad-free option | `"Pro upgrade"` |
| 8 | Platforms | `"Android"` |

CartWise values are fixed — only the competitor column values change per page.

### Example content file — `listonic.json`

```json
{
  "slug": "listonic",
  "competitorName": "Listonic",
  "seo": {
    "title": "CartWise vs Listonic — Free Listonic Alternative",
    "description": "Looking for a Listonic alternative? CartWise is free, works offline, and adds a real-time price calculator and voice input — no account needed.",
    "canonical": "/alternatives/listonic"
  },
  "hero": {
    "headline": "The free Listonic alternative with a real price calculator",
    "subhead": "CartWise gives you offline grocery lists, live budget totals, and instant sharing — all without creating an account."
  },
  "comparison": [
    { "feature": "Real-time price calculator", "cartwise": "✓", "competitor": "✗" },
    { "feature": "Free tier available",        "cartwise": "✓", "competitor": "✓" },
    { "feature": "No account required",        "cartwise": "✓", "competitor": "✗" },
    { "feature": "Works offline",              "cartwise": "✓", "competitor": "Partial" },
    { "feature": "Voice input",                "cartwise": "✓", "competitor": "✓" },
    { "feature": "AI-generated lists",         "cartwise": "✓", "competitor": "✗" },
    { "feature": "Share via QR + WhatsApp",    "cartwise": "✓", "competitor": "Link only" },
    { "feature": "Ad-free option",             "cartwise": "Pro upgrade", "competitor": "Paid plan" },
    { "feature": "Platforms",                  "cartwise": "Android", "competitor": "iOS + Android" }
  ],
  "highlights": [
    {
      "icon": "calculator",
      "title": "Live price calculator",
      "desc": "Running total updates as you check off items. Know your spend before you reach the register."
    },
    {
      "icon": "mic",
      "title": "Voice-to-list in seconds",
      "desc": "Say items out loud while cooking and CartWise adds them automatically — no typing needed."
    },
    {
      "icon": "sparkles",
      "title": "AI-generated lists",
      "desc": "Tell CartWise what you're cooking — it builds the ingredient list automatically."
    },
    {
      "icon": "share-2",
      "title": "Share via QR or WhatsApp",
      "desc": "Anyone can join a shared list by scanning a QR code or tapping a link. No account required."
    }
  ],
  "faq": [
    {
      "q": "Is CartWise really free?",
      "a": "Yes. CartWise is free to download with no trial period and no required subscription. The free tier includes the price calculator, voice input, list sharing, and offline access. Pro is an optional paid upgrade for an ad-free experience and unlimited lists."
    },
    {
      "q": "Can I import my Listonic list into CartWise?",
      "a": "CartWise doesn't connect to Listonic's servers directly. The fastest way to start is to use the AI list generator — type a meal or pantry keyword and it builds a full ingredient list in seconds."
    },
    {
      "q": "Does CartWise need an account?",
      "a": "No. Open the app and start adding items immediately — no email, no password, no phone number. Sharing a list with someone else also requires no account on their end."
    },
    {
      "q": "Does CartWise show the total cost like Listonic?",
      "a": "Yes — and CartWise updates the total in real time as you tick items off. Add a price to each item when you create it, and CartWise tracks exactly how much you're spending as you shop."
    },
    {
      "q": "What platforms does CartWise support?",
      "a": "CartWise is available on Android via Google Play. If you're switching from Listonic on Android, it's a full replacement. iOS support is on the roadmap."
    }
  ]
}
```

---

## 3. i18n Chrome Keys — `cartwiseCompare.*`

These are the **fixed UI labels** that should be translated (they appear identically across all four comparison pages). The per-competitor data fields (`hero.headline`, `comparison`, `highlights`, `faq`) are NOT translated at launch — they are English-only content.

| Key | Default (en) | Notes |
|-----|-------------|-------|
| `cartwiseCompare.hero.eyebrow` | `CartWise vs {{competitor}}` | `{{competitor}}` is the runtime `competitorName` value |
| `cartwiseCompare.hero.appCategory` | `Grocery List App` | |
| `cartwiseCompare.hero.ctaDownload` | `Get it on Google Play` | |
| `cartwiseCompare.hero.ctaCompare` | `See the comparison ↓` | |
| `cartwiseCompare.hero.trustFree` | `Free` | |
| `cartwiseCompare.hero.trustNoAccount` | `No account needed` | |
| `cartwiseCompare.hero.trustOffline` | `Works offline` | |
| `cartwiseCompare.table.eyebrow` | `Side-by-side comparison` | |
| `cartwiseCompare.table.headline` | `CartWise vs {{competitor}}` | |
| `cartwiseCompare.table.subhead` | `A factual feature breakdown. No spin — you decide.` | |
| `cartwiseCompare.table.colFeature` | `Feature` | Column header |
| `cartwiseCompare.table.colCartwiseBadge` | `✓ Recommended` | Winner badge in CartWise header |
| `cartwiseCompare.table.footnote` | `Feature information is based on publicly available descriptions. Some features may vary by region or app version.` | Legal/accuracy disclaimer |
| `cartwiseCompare.highlights.eyebrow` | `Why switch` | |
| `cartwiseCompare.highlights.headline` | `What CartWise does that {{competitor}} doesn't` | |
| `cartwiseCompare.highlights.subhead` | `These are CartWise's standout capabilities — the ones shoppers mention most.` | |
| `cartwiseCompare.screenshots.eyebrow` | `App screenshots` | |
| `cartwiseCompare.screenshots.headline` | `See CartWise in action` | |
| `cartwiseCompare.screenshots.caption1` | `Live price total` | |
| `cartwiseCompare.screenshots.caption2` | `Voice input` | |
| `cartwiseCompare.screenshots.caption3` | `AI lists` | |
| `cartwiseCompare.faq.eyebrow` | `FAQ` | |
| `cartwiseCompare.faq.headline` | `Questions about switching from {{competitor}}` | |
| `cartwiseCompare.cta.headline` | `Ready to try a free {{competitor}} alternative?` | |
| `cartwiseCompare.cta.subline` | `Download CartWise in seconds. No account, no setup — just start your list.` | |
| `cartwiseCompare.cta.ctaButton` | `Download on Google Play` | |
| `cartwiseCompare.cta.trust` | `Free · No account · Works offline · Android` | |

### Keys that use `{{competitor}}`

These five keys contain the `{{competitor}}` token — the Astro template should interpolate `competitorName` from the content file at build time:

- `cartwiseCompare.hero.eyebrow`
- `cartwiseCompare.table.headline`
- `cartwiseCompare.highlights.headline`
- `cartwiseCompare.faq.headline`
- `cartwiseCompare.cta.headline`

---

## 4. Astro Template Skeleton

```astro
---
// src/pages/alternatives/[slug].astro
import BaseLayout from "@/layouts/BaseLayout.astro";
import { type ComparisonPageData } from "@/content/alternatives/_schema";

export async function getStaticPaths() {
  // Import all JSON files from src/content/alternatives/
  const pages = import.meta.glob<ComparisonPageData>(
    "../../content/alternatives/*.json",
    { eager: true }
  );
  return Object.values(pages).map((data) => ({
    params: { slug: data.slug },
    props: { data },
  }));
}

const { data } = Astro.props;
const { competitorName, seo, hero, comparison, highlights, faq } = data;
---

<BaseLayout
  title={seo.title}
  description={seo.description}
  canonical={new URL(seo.canonical, Astro.site).href}
>
  <!-- Section 1: Hero -->
  <!-- Section 2: Comparison Table -->
  <!-- Section 3: Highlight Cards -->
  <!-- Section 4: Screenshot Strip -->
  <!-- Section 5: FAQ -->
  <!-- Section 6: CTA Band -->
</BaseLayout>
```

---

## 5. Asset Paths (already in `public/`)

```
/images/apps/cartwise-grocery-shopping-list/icon.png  (used in hero, table header, CTA)
/images/screenshots/cartwise-list.jpg                  (screenshot 1 — price total)
/images/screenshots/cartwise-voice.jpg                 (screenshot 2 — voice)
/images/screenshots/cartwise-ai.jpg                    (screenshot 3 — AI)
```

Google Play URL (hardcoded in template): `https://play.google.com/store/apps/details?id=com.fusionapps.cartwise`

---

## 6. Fairness Guidelines for Content Authors

When filling competitor cells in the `comparison` array:

- Use `"✓"` only when the feature is documented in the competitor's public App Store/Play listing or official website.
- Use `"✗"` only when the feature is verifiably absent — not just unlisted.
- When uncertain, use a short text description like `"Partial"`, `"Paid only"`, or `"Not listed"`.
- FAQ answers must not make absolute negative claims about a competitor. "CartWise also has X" is preferred over "{{competitor}} doesn't have X" unless verifiable.
- The `winner-badge` ("✓ Recommended") in the CartWise column header is a self-promotion label, not a comparative claim — it is acceptable as-is.

---

## 7. Dark Mode Notes

The mockup patches inline `style` colors with a small JS observer on toggle. In the Astro implementation, **replace all inline `color:` values with Tailwind classes** (`text-gray-900 dark:text-white`, etc.) — no inline color styles in production. The `html.dark` toggle comes from the existing `ThemeToggle` component in the site header.

---

## 8. Comparison Table — Production Rendering Note

The `compare-table` uses `border-collapse: separate` + `border-spacing: 0` to achieve rounded corners via `border-radius` on the wrapper. This is correct behavior in all modern browsers. In Astro, wrap the `<table>` in a `<div class="overflow-x-auto -webkit-overflow-scrolling-touch">` for mobile scroll safety.

The CartWise column uses `border-left: 2px solid rgba(46,207,255,0.12)` to visually separate it from the feature label column. This is applied via `.td-cartwise` — do not remove it; it is part of the accent treatment.
