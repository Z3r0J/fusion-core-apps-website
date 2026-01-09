export const prerender = false;

import type { APIRoute } from "astro";
import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

const API_KEY = import.meta.env.API_KEY ?? "supersecret";

const Payload = z.object({
	slug: z.string().min(1),
	title: z.string().min(1),
	tagline: z.string().min(1),
	description: z.string().min(1),
	playStoreUrl: z.string().url(),
	appStoreUrl: z.string().url().optional(),
	category: z.string().min(1),
	icon: z.string().min(1),
	price: z.string().optional(),
	screenshots: z.array(z.string()).default([]),
	markdown: z.string().optional(),
	rating: z.coerce.number().min(0).max(5).optional(),
	downloads: z.string().optional(),
	version: z.string().optional(),
});

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

export const PUT: APIRoute = async ({ request }) => {
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
		return new Response(JSON.stringify({ error: parsed.error.issues }), { status: 400 });
	}

	const data = parsed.data;
	const filepath = path.join(process.cwd(), "src", "content", "apps", `${data.slug}.md`);

	if (!existsSync(filepath)) {
		return new Response(JSON.stringify({ error: "App not found" }), { status: 404 });
	}

	const front = {
		title: data.title,
		tagline: data.tagline,
		description: data.description,
		icon: data.icon,
		playUrl: data.playStoreUrl,
		...(data.appStoreUrl && { appStoreUrl: data.appStoreUrl }),
		category: data.category,
		tags: [],
		locale: "en",
		price: data.price ?? "Free",
		version: data.version ?? "1.0.0",
		lastUpdated: new Date().toISOString().slice(0, 10),
		screenshots: data.screenshots,
		...(data.rating && { rating: data.rating }),
		...(data.downloads && { downloads: data.downloads }),
	};

	const fm = toFrontmatter(front);
	const markdownContent = data.markdown || "";

	const md = `${fm}${markdownContent}`;

	try {
		await writeFile(filepath, md, "utf-8");
		return new Response(JSON.stringify({ ok: true, slug: data.slug }), {
			status: 200,
			headers: { "content-type": "application/json" },
		});
	} catch (error) {
		console.error("Update error:", error);
		return new Response(JSON.stringify({ error: "Failed to update app" }), { status: 500 });
	}
};
