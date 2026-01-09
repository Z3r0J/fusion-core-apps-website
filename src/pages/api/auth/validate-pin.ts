export const prerender = false;

import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies }) => {
	try {
		const body = await request.json();
		const { pin } = body;

		const ADMIN_PIN = import.meta.env.ADMIN_PIN || "1234";

		if (!pin) {
			return new Response(JSON.stringify({ error: "PIN is required" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		if (pin === ADMIN_PIN) {
			// Generate a simple session token
			const sessionToken = crypto.randomUUID();

			// Set HTTP-only cookie (more secure than sessionStorage)
			cookies.set("admin_session", sessionToken, {
				httpOnly: true,
				secure: import.meta.env.PROD,
				sameSite: "strict",
				maxAge: 60 * 60 * 8, // 8 hours
				path: "/",
			});

			return new Response(JSON.stringify({ success: true }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
		}

		return new Response(JSON.stringify({ error: "Invalid PIN" }), {
			status: 401,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("PIN validation error:", error);
		return new Response(JSON.stringify({ error: "Authentication failed" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
};
