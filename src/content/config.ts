import { defineCollection, z } from "astro:content";

const urlOrPath = z
	.string()
	.refine(
		(v) => v.startsWith("/") || /^https?:\/\//i.test(v) || v.startsWith("data:") || v === "",
		{ message: "Debe ser ruta absoluta del sitio (/img.png) o URL http(s). O dejar vacío." },
	);

export const apps = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		tagline: z.string(),
		description: z.string(),

		// Permite icono local o URL; opcional por si usas placeholder
		icon: urlOrPath.optional(),

		// Stores
		playUrl: z.string().url(),
		appStoreUrl: z.string().url().optional(),

		category: z.string().default("Tools"),
		tags: z.array(z.string()).default([]),

		// i18n
		locale: z.enum(["en", "es"]).default("en"),

		price: z.string().default("Free"),
		version: z.string().optional(),

		// Guarda ISO yyyy-mm-dd; si te llega string, lo coercionamos y normalizamos
		lastUpdated: z
			.string()
			.optional()
			.transform((v) => v ?? new Date().toISOString().slice(0, 10)),

		// En el UI muestras "1K+"; aquí mejor guardarlo como string flexible
		downloads: z.union([z.string(), z.number()]).default(0).transform(String),

		// 0–5 opcional (tu form ya lo tiene)
		rating: z.number().min(0).max(5).optional(),

		// Rutas absolutas del sitio o URLs
		screenshots: z.array(urlOrPath).default([]),
	}),
});

const legal = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		updatedAt: z.string(),
	}),
});

export const collections = { apps, legal };
