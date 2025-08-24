export const prerender = false;

import type { APIRoute } from "astro";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

const API_KEY = process.env.API_KEY ?? "supersecret";

const Payload = z.object({
	// del form:
	title: z.string().min(1),
	tagline: z.string().min(1),
	description: z.string().min(1),
	playStoreUrl: z.string().url(),
	appStoreUrl: z.string().url().optional(),
	category: z.string().min(1),
	icon: z.string().min(1),
	price: z.string().optional(),
	screenshots: z.array(z.string()).default([]),
	features: z.array(z.string()).default([]),
	rating: z.coerce.number().min(0).max(5).optional(),
	downloads: z.string().optional(),
	version: z.string().optional(),
	// opcionales calculables:
	locale: z.string().optional(),
	slug: z.string().optional(), // si no viene, lo generamos
});

function slugify(s: string) {
	return s
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)+/g, "");
}

function toFrontmatter(obj: Record<string, unknown>) {
	const lines: string[] = ["---"];
	for (const [k, v] of Object.entries(obj)) {
		if (Array.isArray(v)) {
			lines.push(`${k}: [${v.map((x) => JSON.stringify(x)).join(", ")}]`);
		} else {
			lines.push(`${k}: ${JSON.stringify(v)}`);
		}
	}
	lines.push("---", "");
	return lines.join("\n");
}

export const POST: APIRoute = async ({ request }) => {
	if (request.headers.get("x-api-key") !== API_KEY) {
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
		return new Response(JSON.stringify({ error: parsed.error.flatten() }), { status: 400 });
	}

	const data = parsed.data;
	const slug = data.slug ?? slugify(data.title);

	// Mapear nombres del form -> frontmatter
	const front = {
		title: data.title,
		tagline: data.tagline,
		description: data.description,
		icon: data.icon,
		playUrl: data.playStoreUrl, // <-- mapeo
		appStoreUrl: data.appStoreUrl,
		category: data.category,
		tags: [], // podrías derivar por categoría o dejar vacío
		locale: data.locale ?? "en",
		price: data.price ?? "Free",
		version: data.version ?? "1.0.0",
		lastUpdated: new Date().toISOString().slice(0, 10), // yyyy-mm-dd
		screenshots: data.screenshots,
		rating: data.rating,
		downloads: data.downloads,
	};

	const fm = toFrontmatter(front);
	const featuresSection = data.features.length
		? `## Features\n\n${data.features.map((f) => `- ${f}`).join("\n")}\n`
		: "";

	const md = `${fm}${featuresSection}`;

	const dir = path.join(process.cwd(), "src", "content", "apps");
	if (!existsSync(dir)) await mkdir(dir, { recursive: true });
	const filepath = path.join(dir, `${slug}.md`);
	await writeFile(filepath, md, "utf-8");

	return new Response(JSON.stringify({ ok: true, slug, file: `src/content/apps/${slug}.md` }), {
		status: 201,
		headers: { "content-type": "application/json" },
	});
};
