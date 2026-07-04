import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

// Prerendered replacement for @astrojs/sitemap. The integration wrote its XML
// during astro:build:done, but the Vercel adapter's hook runs first (Astro
// unshifts the adapter) and packages .vercel/output/static before the files
// exist — so the sitemap never reached production. An endpoint is built in the
// page phase and ships with every deploy. robots.txt points at /sitemap-index.xml.
export const prerender = true;

const LOCALES = ["en", "es", "pt"] as const;
type Locale = (typeof LOCALES)[number];
const HREFLANG: Record<Locale, string> = { en: "en", es: "es-419", pt: "pt-BR" };

interface Entry {
	loc: string;
	changefreq: string;
	priority: number;
	lastmod?: string;
	// hreflang -> absolute URL (only real translations)
	alternates?: Record<string, string>;
}

export const GET: APIRoute = async ({ site }) => {
	const abs = (path: string) => new URL(path, site).href;
	const localePath = (locale: Locale, path: string) =>
		locale === "en" ? path || "/" : `/${locale}${path}`;

	const entries: Entry[] = [];

	// A page that exists in the given locales; emits one entry per locale with
	// cross-linked hreflang alternates (x-default follows en).
	const addLocalized = (
		paths: Partial<Record<Locale, string>>,
		meta: { changefreq: string; priority: [number, number]; lastmod?: string },
	) => {
		const locales = LOCALES.filter((l) => paths[l] !== undefined);
		const alternates: Record<string, string> = {};
		for (const l of locales) alternates[HREFLANG[l]] = abs(paths[l]!);
		if (paths.en !== undefined) alternates["x-default"] = abs(paths.en);
		for (const l of locales) {
			entries.push({
				loc: abs(paths[l]!),
				changefreq: meta.changefreq,
				priority: l === "en" ? meta.priority[0] : meta.priority[1],
				lastmod: meta.lastmod,
				alternates: locales.length > 1 ? alternates : undefined,
			});
		}
	};

	const allLocalePaths = (path: string) =>
		Object.fromEntries(LOCALES.map((l) => [l, localePath(l, path)]));

	// Static pages (all exist in en + es + pt)
	const STATIC_PAGES: Array<[string, string, [number, number]]> = [
		["", "weekly", [1.0, 0.9]],
		["/cartwise", "weekly", [0.9, 0.8]],
		["/apps", "weekly", [0.8, 0.7]],
		["/blog", "weekly", [0.7, 0.6]],
		["/compare-apps", "weekly", [0.6, 0.5]],
		["/contact", "monthly", [0.5, 0.4]],
		["/privacy", "monthly", [0.5, 0.4]],
		["/terms", "monthly", [0.5, 0.4]],
		["/cartwise/privacy", "monthly", [0.5, 0.4]],
		["/cartwise/terms", "monthly", [0.5, 0.4]],
	];
	for (const [path, changefreq, priority] of STATIC_PAGES) {
		addLocalized(allLocalePaths(path), { changefreq, priority });
	}

	// App detail pages — same slug across locales
	const apps = await getCollection("apps");
	const appSlugs = new Map<string, Locale[]>();
	for (const app of apps) {
		const [locale, ...rest] = app.slug.split("/");
		if (!LOCALES.includes(locale as Locale)) continue;
		const slug = rest.join("/");
		appSlugs.set(slug, [...(appSlugs.get(slug) ?? []), locale as Locale]);
	}
	for (const [slug, locales] of appSlugs) {
		const paths: Partial<Record<Locale, string>> = {};
		for (const l of locales) paths[l] = localePath(l, `/apps/${slug}`);
		addLocalized(paths, { changefreq: "monthly", priority: [0.9, 0.8] });
	}

	// Blog posts — per-locale slugs, siblings resolved via translationKey
	const posts = await getCollection("blog");
	const seenPosts = new Set<string>();
	for (const post of posts) {
		if (seenPosts.has(post.slug)) continue;
		const siblings = post.data.translationKey
			? posts.filter((p) => p.data.translationKey === post.data.translationKey)
			: [post];
		const paths: Partial<Record<Locale, string>> = {};
		let lastmod: Date = post.data.updatedAt ?? post.data.publishedAt;
		for (const sibling of siblings) {
			const [locale, ...rest] = sibling.slug.split("/");
			if (!LOCALES.includes(locale as Locale)) continue;
			paths[locale as Locale] = localePath(locale as Locale, `/blog/${rest.join("/")}`);
			seenPosts.add(sibling.slug);
			const d = sibling.data.updatedAt ?? sibling.data.publishedAt;
			if (d > lastmod) lastmod = d;
		}
		addLocalized(paths, {
			changefreq: "monthly",
			priority: [0.7, 0.6],
			lastmod: lastmod.toISOString(),
		});
	}

	// Comparison pages — same competitorSlug across locales
	const comparisons = await getCollection("comparisons");
	const comparisonSlugs = new Map<string, Locale[]>();
	for (const entry of comparisons) {
		const [locale] = entry.slug.split("/");
		if (!LOCALES.includes(locale as Locale)) continue;
		const slug = `cartwise-vs-${entry.data.competitorSlug}`;
		comparisonSlugs.set(slug, [...(comparisonSlugs.get(slug) ?? []), locale as Locale]);
	}
	for (const [slug, locales] of comparisonSlugs) {
		const paths: Partial<Record<Locale, string>> = {};
		for (const l of locales) paths[l] = localePath(l, `/compare-apps/${slug}`);
		addLocalized(paths, { changefreq: "monthly", priority: [0.7, 0.6] });
	}

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries
	.map((e) => {
		const alternates = e.alternates
			? Object.entries(e.alternates)
					.map(([hreflang, href]) => `<xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}"/>`)
					.join("")
			: "";
		const lastmod = e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : "";
		return `<url><loc>${e.loc}</loc>${lastmod}<changefreq>${e.changefreq}</changefreq><priority>${e.priority.toFixed(1)}</priority>${alternates}</url>`;
	})
	.join("\n")}
</urlset>`;

	return new Response(xml, { headers: { "Content-Type": "application/xml" } });
};
