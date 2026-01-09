export const prerender = false;

import type { APIRoute } from "astro";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const API_KEY = import.meta.env.API_KEY ?? "supersecret";

function parseFrontmatter(content: string) {
	const regex = /^---\n([\s\S]*?)\n---/;
	const match = regex.exec(content);
	if (!match) return null;

	const frontmatterText = match[1];
	const data: Record<string, any> = {};

	frontmatterText.split("\n").forEach((line) => {
		const colonIndex = line.indexOf(":");
		if (colonIndex === -1) return;

		const key = line.slice(0, colonIndex).trim();
		const value = line.slice(colonIndex + 1).trim();

		try {
			data[key] = JSON.parse(value);
		} catch {
			data[key] = value.replaceAll(/(?:^"|"$)/g, "");
		}
	});

	// Extract markdown content after frontmatter
	const markdownContent = content.slice(match[0].length).trim();
	data.markdown = markdownContent;

	return data;
}

export const GET: APIRoute = async ({ url, request }) => {
	if (request.headers.get("x-api-key") !== API_KEY) {
		return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
	}

	const slug = url.searchParams.get("slug");
	if (!slug) {
		return new Response(JSON.stringify({ error: "Missing slug parameter" }), { status: 400 });
	}

	const filepath = path.join(process.cwd(), "src", "content", "apps", `${slug}.md`);

	if (!existsSync(filepath)) {
		return new Response(JSON.stringify({ error: "App not found" }), { status: 404 });
	}

	try {
		const content = await readFile(filepath, "utf-8");
		const data = parseFrontmatter(content);

		if (!data) {
			return new Response(JSON.stringify({ error: "Invalid frontmatter" }), { status: 500 });
		}

		// Map back to form format
		const response = {
			slug,
			title: data.title,
			tagline: data.tagline,
			description: data.description,
			playStoreUrl: data.playUrl,
			appStoreUrl: data.appStoreUrl,
			category: data.category,
			icon: data.icon,
			price: data.price,
			screenshots: data.screenshots || [],
			markdown: data.markdown || "",
			rating: data.rating,
			downloads: data.downloads,
			version: data.version,
		};

		return new Response(JSON.stringify(response), {
			status: 200,
			headers: { "content-type": "application/json" },
		});
	} catch (error) {
		console.error("Read error:", error);
		return new Response(JSON.stringify({ error: "Failed to read app" }), { status: 500 });
	}
};
