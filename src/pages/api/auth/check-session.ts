export const prerender = false;

import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ cookies }) => {
	const session = cookies.get("admin_session");

	if (session?.value) {
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
