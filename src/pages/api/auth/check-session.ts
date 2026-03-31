export const prerender = false;

import type { APIRoute } from "astro";
import { validSessions } from "./_session-store";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const GET: APIRoute = async ({ cookies }) => {
	const session = cookies.get("admin_session");
	const token = session?.value;

	if (token && UUID_REGEX.test(token) && validSessions.has(token)) {
		return new Response(JSON.stringify({ authenticated: true }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	}

	return new Response(JSON.stringify({ authenticated: false }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
};
