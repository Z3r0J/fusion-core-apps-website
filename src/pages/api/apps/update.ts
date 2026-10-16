export const prerender = false;

import type { APIRoute } from "astro";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

// No fallback key: if API_KEY is not configured, the admin API stays closed.
const API_KEY: string | undefined = import.meta.env.API_KEY;

const Payload = z.object({
	// Either the collection slug the admin lists ("es/biblia-tla") or a bare slug
	// plus `locale`. The regex also keeps the path inside src/content/apps/.
	slug: z.string().regex(/^(?:(?:en|es|pt)\/)?[a-z0-9-]+$/),
	locale: z.enum(["en", "es", "pt"]).optional(),
	title: z.string().min(1),
	tagline: z.string().min(1),
	description: z.string().min(1),
	playStoreUrl: z.string().url(),
	appStoreUrl: z.string().url().optional(),
	category: z.string().min(1),
	icon: z.string().min(1),
	price: z.string().optional(),
	// Optional (not default []) so an update that omits it keeps the screenshots on file.
	screenshots: z.array(z.string()).optional(),
	markdown: z.string().optional(),
	rating: z.coerce.number().min(0).max(5).optional(),
	downloads: z.string().optional(),
	version: z.string().optional(),
});

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

function toYamlLine(key: string, value: unknown) {
	return Array.isArray(value)
		? `${key}: [${value.map((x) => JSON.stringify(x)).join(", ")}]`
		: `${key}: ${JSON.stringify(value)}`;
}

/**
 * Replaces (or appends) only the given top-level keys. Every other block of the
 * existing frontmatter — multi-line arrays, `faq`, `seoTitle`, `ratingCount`,
 * `beta`… — is kept verbatim, so fields this route doesn't know about survive.
 */
function mergeFrontmatter(frontmatter: string, updates: Record<string, unknown>) {
	const blocks: { key: string | null; lines: string[] }[] = [];
	for (const line of frontmatter.split("\n")) {
		const key = /^([A-Za-z_][\w-]*):/.exec(line)?.[1];
		if (key) blocks.push({ key, lines: [line] });
		else if (blocks.length > 0) blocks[blocks.length - 1].lines.push(line);
		else blocks.push({ key: null, lines: [line] });
	}
	for (const [key, value] of Object.entries(updates)) {
		if (value === undefined) continue;
		const block = blocks.find((b) => b.key === key);
		if (block) block.lines = [toYamlLine(key, value)];
		else blocks.push({ key, lines: [toYamlLine(key, value)] });
	}
	return blocks.flatMap((b) => b.lines).join("\n");
}

export const PUT: APIRoute = async ({ request }) => {
	if (!API_KEY || request.headers.get("x-api-key") !== API_KEY) {
		return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
	}

	const parsed = Payload.safeParse(body);
	if (!parsed.success) {
		return new Response(JSON.stringify({ error: parsed.error.issues }), { status: 400 });
	}

	const data = parsed.data;
	// A locale prefix on the slug is where the file actually lives, so it wins over `locale`.
	const [prefix, bareSlug] = data.slug.includes("/") ? data.slug.split("/") : [undefined, data.slug];
	const locale = prefix ?? data.locale ?? "en";
	const file = `src/content/apps/${locale}/${bareSlug}.md`;
	const filepath = path.join(process.cwd(), file);

	if (!existsSync(filepath)) {
		return new Response(JSON.stringify({ error: "App not found" }), { status: 404 });
	}

	try {
		const existing = await readFile(filepath, "utf-8");
		const match = FRONTMATTER.exec(existing);
		if (!match) {
			return new Response(JSON.stringify({ error: "Invalid frontmatter" }), { status: 500 });
		}

		const frontmatter = mergeFrontmatter(match[1], {
			title: data.title,
			tagline: data.tagline,
			description: data.description,
			icon: data.icon,
			playUrl: data.playStoreUrl,
			appStoreUrl: data.appStoreUrl,
			category: data.category,
			price: data.price,
			version: data.version,
			screenshots: data.screenshots,
			rating: data.rating,
			downloads: data.downloads,
		});
		const markdownContent = data.markdown ?? existing.slice(match[0].length);

		await writeFile(filepath, `---\n${frontmatter}\n---\n${markdownContent}`, "utf-8");
		return new Response(JSON.stringify({ ok: true, slug: data.slug, file }), {
			status: 200,
			headers: { "content-type": "application/json" },
		});
	} catch (error) {
		console.error("Update error:", error);
		return new Response(JSON.stringify({ error: "Failed to update app" }), { status: 500 });
	}
};
