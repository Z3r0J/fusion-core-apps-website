export const prerender = false;

import type { APIRoute } from "astro";
import { validSessions } from "./_session-store";

// Rate limiting: track failed attempts per IP
const failedAttempts = new Map<string, { count: number; firstAttempt: number }>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getClientIp(request: Request): string {
	return (
		request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
		request.headers.get("x-real-ip") ||
		"unknown"
	);
}

function isRateLimited(ip: string): boolean {
	const record = failedAttempts.get(ip);
	if (!record) return false;

	const now = Date.now();

	// Window expired — clear record
	if (now - record.firstAttempt > WINDOW_MS) {
		failedAttempts.delete(ip);
		return false;
	}

	return record.count >= MAX_ATTEMPTS;
}

function recordFailedAttempt(ip: string): void {
	const now = Date.now();
	const record = failedAttempts.get(ip);

	if (!record || now - record.firstAttempt > WINDOW_MS) {
		failedAttempts.set(ip, { count: 1, firstAttempt: now });
	} else {
		record.count++;
	}
}

export const POST: APIRoute = async ({ request, cookies }) => {
	try {
		const ADMIN_PIN = import.meta.env.ADMIN_PIN;

		if (!ADMIN_PIN) {
			console.warn("[auth] ADMIN_PIN environment variable is not configured");
			return new Response(JSON.stringify({ error: "Admin not configured" }), {
				status: 503,
				headers: { "Content-Type": "application/json" },
			});
		}

		const clientIp = getClientIp(request);

		if (isRateLimited(clientIp)) {
			return new Response(JSON.stringify({ error: "Too many attempts. Try again later." }), {
				status: 429,
				headers: { "Content-Type": "application/json" },
			});
		}

		const body = await request.json();
		const { pin } = body;

		if (!pin) {
			return new Response(JSON.stringify({ error: "PIN is required" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		if (pin === ADMIN_PIN) {
			// Generate a simple session token
			const sessionToken = crypto.randomUUID();

			// Track in server-side store
			validSessions.add(sessionToken);

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

		recordFailedAttempt(clientIp);

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
