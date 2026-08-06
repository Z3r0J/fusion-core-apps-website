import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

// Prerendered /llms.txt — a plain-text map of the site for LLM agents and AI
// crawlers (see https://llmstxt.org). Mirrors the collection traversal in
// sitemap-0.xml.ts but emits only the canonical English (unprefixed) URLs; the
// /es and /pt siblings are noted at the end. App, blog, and comparison lists are
// generated from the content collections so new entries appear automatically.
export const prerender = true;

const stripEn = (slug: string) => slug.replace(/^en\//, "");

// Stable legal pages: flat collection slugs -> their static routes. Titles are
// pulled from the collection so copy edits flow through without touching this file.
const LEGAL_PAGES: Array<{ slug: string; path: string }> = [
	{ slug: "privacy", path: "/privacy" },
	{ slug: "terms", path: "/terms" },
	{ slug: "cartwise-privacy", path: "/cartwise/privacy" },
	{ slug: "cartwise-terms", path: "/cartwise/terms" },
];

export const GET: APIRoute = async ({ site }) => {
	const abs = (path: string) => new URL(path, site).href;

	// Sort deterministically so the emitted /llms.txt is stable across builds
	// (getCollection traversal order is not guaranteed). Apps/comparisons go
	// alphabetically by title; posts go newest-first by publish date.
	const apps = (await getCollection("apps", ({ slug }) => slug.startsWith("en/"))).sort((a, b) =>
		a.data.title.localeCompare(b.data.title),
	);
	const posts = (await getCollection("blog", ({ slug }) => slug.startsWith("en/"))).sort(
		(a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
	);
	const comparisons = (
		await getCollection("comparisons", ({ slug }) => slug.startsWith("en/"))
	).sort((a, b) => a.data.title.localeCompare(b.data.title));
	const legal = await getCollection("legal");
	const legalBySlug = new Map(legal.map((e) => [e.slug, e]));

	const appLines = apps.map(
		(app) => `- [${app.data.title}](${abs(`/apps/${stripEn(app.slug)}`)}): ${app.data.tagline}`,
	);

	const blogLines = posts.map(
		(post) => `- [${post.data.title}](${abs(`/blog/${stripEn(post.slug)}`)}): ${post.data.description}`,
	);

	const comparisonLines = comparisons.map(
		(entry) =>
			`- [${entry.data.title}](${abs(`/compare-apps/cartwise-vs-${entry.data.competitorSlug}`)}): ${entry.data.description}`,
	);

	const legalLines = LEGAL_PAGES.map((page) => {
		const title = legalBySlug.get(page.slug)?.data.title ?? page.slug;
		return `- [${title}](${abs(page.path)})`;
	});

	const body = `# FusionCore Apps
> Indie Android apps for Bible study, grocery lists, warranty tracking, and food expiry, with a trilingual (en/es/pt) marketing site.

FusionCore Apps is an independent studio building focused, privacy-friendly Android apps published on Google Play. This site is the marketing home for that family of apps — app pages, head-to-head comparisons, and a guide-style blog — published in English, Spanish, and Portuguese.

## Apps
${appLines.join("\n")}

## Blog
${blogLines.join("\n")}

## Comparisons
${comparisonLines.join("\n")}

## Legal
${legalLines.join("\n")}

Spanish (/es) and Portuguese (/pt) translations are available for most pages.
`;

	return new Response(body, {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
};
