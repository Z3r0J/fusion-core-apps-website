export const prerender = false;

import type { APIRoute } from "astro";
import { existsSync } from "node:fs";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

// No fallback key: if API_KEY is not configured, the admin API stays closed.
const API_KEY: string | undefined = import.meta.env.API_KEY;

const Payload = z.object({
	// Same shape as update.ts: optional locale folder + kebab-case slug. Keeps the path inside src/content/apps/.
	slug: z.string().regex(/^(?:(?:en|es|pt)\/)?[a-z0-9-]+$/),
});

export const DELETE: APIRoute = async ({ request }) => {
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

	const { slug } = parsed.data;
	const filepath = path.join(process.cwd(), "src", "content", "apps", `${slug}.md`);

	if (!existsSync(filepath)) {
		return new Response(JSON.stringify({ error: "App not found" }), { status: 404 });
	}

	try {
		await unlink(filepath);
		return new Response(JSON.stringify({ ok: true, slug }), {
			status: 200,
			headers: { "content-type": "application/json" },
		});
	} catch (error) {
		console.error("Delete error:", error);
		return new Response(JSON.stringify({ error: "Failed to delete app" }), { status: 500 });
	}
};
