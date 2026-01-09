export const prerender = false;

import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ cookies }) => {
	// Check if user is authenticated
	const session = cookies.get("admin_session");

	if (!session?.value) {
		return new Response(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
			headers: { "Content-Type": "application/json" },
		});
	}

	// Return API key for authenticated admin users
	const API_KEY = import.meta.env.API_KEY || "supersecret";

	return new Response(JSON.stringify({ apiKey: API_KEY }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
};
