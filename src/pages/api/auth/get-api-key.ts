export const prerender = false;

import type { APIRoute } from "astro";
import { validSessions } from "./_session-store";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const GET: APIRoute = async ({ cookies }) => {
	// Same check as check-session.ts: the cookie must hold a token issued by validate-pin.
	const token = cookies.get("admin_session")?.value;

	if (!token || !UUID_REGEX.test(token) || !validSessions.has(token)) {
		return new Response(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
			headers: { "Content-Type": "application/json" },
		});
	}

	// Return API key for authenticated admin users
	const API_KEY: string | undefined = import.meta.env.API_KEY;
	if (!API_KEY) {
		return new Response(JSON.stringify({ error: "Admin API is not configured" }), {
			status: 503,
			headers: { "Content-Type": "application/json" },
		});
	}

	return new Response(JSON.stringify({ apiKey: API_KEY }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
};
