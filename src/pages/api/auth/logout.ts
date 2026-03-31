export const prerender = false;

import type { APIRoute } from "astro";
import { validSessions } from "./_session-store";

export const POST: APIRoute = async ({ cookies }) => {
	const session = cookies.get("admin_session");
	const token = session?.value;

	// Remove from server-side store
	if (token) {
		validSessions.delete(token);
	}

	cookies.delete("admin_session", { path: "/" });

	return new Response(JSON.stringify({ success: true }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
};
