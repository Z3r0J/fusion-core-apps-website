# CartWise Landing Page — Builder Handoff

**Target route:** `/cartwise` on the FusionCore Apps website (Astro)
**Mockup file:** `design/cartwise-landing.html` (open in any browser; toggle button top-right for dark mode)
**Author:** Lynda (design mockup) — hand to Astro builder for production

---

## 1. Page Structure & Section Order

| # | Section | Anchor | Notes |
|---|---------|--------|-------|
| 1 | Hero | `#hero` | App icon + headline + tagline + Google Play CTA + trust line + floating phone frames |
| 2 | Feature Grid | `#features` | 9 feature cards, 3-col auto grid |
| 3 | Screenshot Showcase | `#screenshots` | Horizontal scrollable phone-frame carousel, 6 frames |
| 4 | Free vs Pro | `#plans` | 2-col card comparison; no pricing amounts, no currency |
| 5 | FAQ | `#faq` | Accordion, 5 Q&As |
| 6 | Final CTA | `#cta` | Full-width dark gradient band, Google Play button |

---

## 2. Existing Site Patterns Reused

### Hero glow stack (`app-detail-hero`)
- Dark bg: `linear-gradient(135deg, #0b1c2d 0%, #0e2a42 55%, #0a2535 100%)`
- Dot grid overlay: `radial-gradient(circle, rgba(46,207,255,0.2) 1.5px, transparent 1.5px); background-size: 28px 28px`
- Cyan glow top-right: `h-96 w-96 blur-[100px]` with `rgba(46,207,255,0.6)`
- Orange glow bottom-left: `h-64 w-64 blur-[80px]` with `rgba(255,138,42,0.8)`
- Source: `src/pages/apps/[slug].astro` lines 41–58

### Section label / eyebrow (`.section-label` + `.section-label__dot`)
- CSS lives in `src/styles/global.css` — reuse the classes directly.
- Pattern: `<div class="section-label"><span class="section-label__dot"></span><span>Label text</span></div>`

### Phone-frame screenshot carousel
- Frame dimensions: `width: 180px; height: 360px; border-radius: 1.75rem`
- Frame color: `background: #0b1c2d; border: 2px solid rgba(255,255,255,0.08)`
- Notch: `absolute top-2.5 left-1/2 -translate-x-1/2 h-4 w-14 rounded-full` in `#0b1c2d`
- Hover: `group-hover:-translate-y-2` + shine overlay with `opacity-0 group-hover:opacity-100`
- Scroll container: `flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory` with thin cyan scrollbar
- Source: `src/pages/apps/[slug].astro` lines 204–226

### Gradient CTA buttons
- **Brand cyan (primary):** `linear-gradient(135deg, #2ecfff, #0091cc)` — use `button--primary` class
- **Accent orange (download):** `linear-gradient(135deg, #ff8a2a, #db681a)` — use `button--download` class
- Both have a shimmer `::after` sweep on hover (already in global.css).
- Source: `src/styles/global.css` `.button--primary` / `.button--download`

### Ghost / secondary button
- `border border-gray-300 bg-white text-gray-700 dark:border-white/20 dark:bg-white/10 dark:text-white/80`
- Source: `src/pages/apps/[slug].astro` line 181

### `.app-cta-card` (used for Pro plan card)
- Light: `linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)` + `border: rgba(46,207,255,0.25)`
- Dark: `linear-gradient(135deg, #0b1c2d 0%, #0e2a42 100%)` + `border: rgba(46,207,255,0.15)`

### FAQ accordion
- Pattern from `src/styles/global.css` — `.faq-item`, `.faq-btn`, `.faq-question`, `.faq-answer`
- The accordion JS in the mockup (`toggleFaq()`) is a minimal placeholder; replace with Astro islands or Alpine.js in production.

---

## 3. New Reusable Components to Extract

These patterns appear in the mockup but don't exist yet as standalone components:

| Component | Description | Extract to |
|-----------|-------------|-----------|
| `<PhoneFrame>` | Phone shell wrapper (180×360, notch, shine overlay, hover lift) | `src/components/PhoneFrame.astro` |
| `<FeatureCard>` | Icon + title + description card with cyan border-glow hover | `src/components/FeatureCard.astro` |
| `<PlanCard>` | Free/Pro plan comparison card | `src/components/PlanCard.astro` |
| `<TrustBadge>` | Small inline icon + text trust signal | `src/components/TrustBadge.astro` |
| `<FaqAccordion>` | Self-contained FAQ with Alpine.js or JS | `src/components/FaqAccordion.astro` |

`PhoneFrame` is the highest-value extract — it's already used in `[slug].astro` inline and will appear on multiple landing pages.

---

## 4. Asset Paths (already exist in `public/`)

```
/images/apps/cartwise-grocery-shopping-list/icon.png
/images/screenshots/cartwise-home.jpg
/images/screenshots/cartwise-list.jpg
/images/screenshots/cartwise-create.jpg
/images/screenshots/cartwise-voice.jpg
/images/screenshots/cartwise-ai.jpg
/images/screenshots/cartwise-analytics.jpg
```

Google Play URL: `https://play.google.com/store/apps/details?id=com.fusionapps.cartwise`

---

## 5. i18n Copy Strings — `cartwise.*` Namespace

Wire these keys into `en.json` (and `es.json` / `pt.json`) when internationalizing the page.

### Hero

| Key | Default (en) |
|-----|-------------|
| `cartwise.hero.eyebrow` | `FusionCore Apps · CartWise` |
| `cartwise.hero.appName` | `CartWise` |
| `cartwise.hero.appCategory` | `Shared Grocery List` |
| `cartwise.hero.headline` | `Smarter grocery lists. Real-time prices, shared.` |
| `cartwise.hero.tagline` | `Grocery list with a real-time price calculator, voice input, and instant sharing. No fuss, no signup.` |
| `cartwise.hero.ctaDownload` | `Get it on Google Play` |
| `cartwise.hero.ctaLearnMore` | `See all features ↓` |
| `cartwise.hero.trustNoAccount` | `No account needed` |
| `cartwise.hero.trustFree` | `Free to start` |
| `cartwise.hero.trustOffline` | `Works offline` |

### Features section

| Key | Default (en) |
|-----|-------------|
| `cartwise.features.eyebrow` | `Features` |
| `cartwise.features.headline` | `Everything your grocery trip needs` |
| `cartwise.features.subline` | `Built for real shopping — not for demos.` |
| `cartwise.features.priceCalc.title` | `Real-time Price Calculator` |
| `cartwise.features.priceCalc.desc` | `See the running total update as you tick items. Know your budget before you reach the checkout.` |
| `cartwise.features.voice.title` | `Voice-to-Text Input` |
| `cartwise.features.voice.desc` | `Say "2 liters of milk" and it lands on your list. Hands full? Voice works.` |
| `cartwise.features.ai.title` | `AI-Generated Lists` |
| `cartwise.features.ai.desc` | `Tell CartWise what you're cooking and it builds the ingredient list for you.` |
| `cartwise.features.sharing.title` | `Instant Sharing` |
| `cartwise.features.sharing.desc` | `Share via QR code or WhatsApp link. Everyone sees updates in real time, no account needed.` |
| `cartwise.features.analytics.title` | `Budget Tracker & Analytics` |
| `cartwise.features.analytics.desc` | `Spending reports by category let you spot where the budget is going each week.` |
| `cartwise.features.categories.title` | `Smart Auto-Categorization` |
| `cartwise.features.categories.desc` | `Items are grouped by aisle automatically, so you move through the store in order.` |
| `cartwise.features.reminders.title` | `Smart Reminders` |
| `cartwise.features.reminders.desc` | `Set a reminder to leave the house at the right time — CartWise pings you, not the other way around.` |
| `cartwise.features.offline.title` | `Offline-First` |
| `cartwise.features.offline.desc` | `All your lists are stored locally. No signal in the store? CartWise still works perfectly.` |
| `cartwise.features.languages.title` | `Available in 8 Languages` |
| `cartwise.features.languages.desc` | `English, Spanish, Portuguese, French, German, Italian, Dutch, and Polish.` |

### Screenshots section

| Key | Default (en) |
|-----|-------------|
| `cartwise.screenshots.eyebrow` | `Screenshots` |
| `cartwise.screenshots.headline` | `See it in action` |
| `cartwise.screenshots.count` | `6 screens` |

### Plans section

| Key | Default (en) |
|-----|-------------|
| `cartwise.plans.eyebrow` | `Plans` |
| `cartwise.plans.headline` | `Start free. Upgrade when you're ready.` |
| `cartwise.plans.subline` | `CartWise is free to use. Pro is an optional upgrade for power users.` |
| `cartwise.plans.free.label` | `Free` |
| `cartwise.plans.free.price` | `$0` |
| `cartwise.plans.free.priceNote` | `Always free` |
| `cartwise.plans.free.feature1` | `Up to 3 lists` |
| `cartwise.plans.free.feature2` | `Real-time price calculator` |
| `cartwise.plans.free.feature3` | `Voice input` |
| `cartwise.plans.free.feature4` | `Instant sharing (QR + WhatsApp)` |
| `cartwise.plans.free.feature5` | `Offline-first` |
| `cartwise.plans.free.noPro1` | `Includes ads` |
| `cartwise.plans.free.cta` | `Download Free` |
| `cartwise.plans.pro.label` | `Pro` |
| `cartwise.plans.pro.badge` | `PRO` |
| `cartwise.plans.pro.price` | `Optional upgrade` |
| `cartwise.plans.pro.priceNote` | `Unlock the full experience` |
| `cartwise.plans.pro.feature1` | `Unlimited lists` |
| `cartwise.plans.pro.feature2` | `Ad-free experience` |
| `cartwise.plans.pro.feature3` | `Priority sync for shared lists` |
| `cartwise.plans.pro.feature4` | `Early access to new features` |
| `cartwise.plans.pro.feature5` | `Everything in Free` |
| `cartwise.plans.pro.cta` | `Get CartWise — It's Free` |
| `cartwise.plans.pro.ctaNote` | `Upgrade to Pro available inside the app` |

### FAQ section

| Key | Default (en) |
|-----|-------------|
| `cartwise.faq.eyebrow` | `FAQ` |
| `cartwise.faq.headline` | `Common questions` |
| `cartwise.faq.q1` | `Do I need an account to use CartWise?` |
| `cartwise.faq.a1` | `No. CartWise works entirely without an account. Open the app and start shopping. Sharing a list doesn't require the other person to sign up either.` |
| `cartwise.faq.q2` | `Is CartWise free?` |
| `cartwise.faq.a2` | `Yes. The free tier covers everything most shoppers need: up to 3 lists, price calculator, voice input, and sharing. Pro is an optional upgrade that removes ads, unlocks unlimited lists, and adds priority sync.` |
| `cartwise.faq.q3` | `How does list sharing work?` |
| `cartwise.faq.a3` | `Tap the share button on any list to generate a QR code or a WhatsApp link. Anyone who scans or taps the link joins the list instantly. Changes made by any member appear in real time for everyone.` |
| `cartwise.faq.q4` | `Does voice input record or store my audio?` |
| `cartwise.faq.a4` | `No. Speech is converted to text on your device using Android's built-in speech recognition. No audio is sent to FusionCore's servers or stored anywhere.` |
| `cartwise.faq.q5` | `What platforms is CartWise available on?` |
| `cartwise.faq.a5` | `CartWise is currently available on Android via Google Play. iOS support is on our roadmap.` |

### Final CTA band

| Key | Default (en) |
|-----|-------------|
| `cartwise.cta.headline` | `Your next grocery run starts here.` |
| `cartwise.cta.subline` | `Free to download. No account. Works offline. Share instantly.` |
| `cartwise.cta.download` | `Download on Google Play` |
| `cartwise.cta.trust` | `No account needed · Free to start · Android` |

---

## 6. Dark-Mode Notes

The mockup patches inline `style` colors with a small JS observer on toggle. In the Astro implementation, **use CSS classes only** — no inline color styles. Replace all `style="color: #0f172a"` patterns with Tailwind classes like `text-gray-900 dark:text-white` or the global.css color variables.

The `html.dark` selector toggles via the existing `ThemeToggle` component in the site header — no new toggle needed in production.

---

## 7. FAQ Interactivity

The mockup uses a 15-line vanilla JS accordion (`toggleFaq()`). In Astro production, use one of:
- **Alpine.js** `x-data` / `x-show` (already used elsewhere on the site if applicable)
- **Astro `<script>`** island with the same vanilla pattern
- The existing `.faq-item` / `.faq-btn` CSS classes already in `global.css` — they just need the `open` class toggled

---

## 8. SEO / Meta Suggestions

```html
<title>CartWise — Shared Grocery List with Real-Time Prices | FusionCore Apps</title>
<meta name="description" content="Free grocery list app with real-time price calculator, voice input, AI-generated lists, and instant sharing via QR or WhatsApp. No account needed." />
<link rel="canonical" href="https://fusioncoreapps.com/cartwise" />
```

OG image: use the app icon or a composed screenshot collage.
