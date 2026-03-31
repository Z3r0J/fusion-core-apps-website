import { defineCollection, z } from "astro:content";

const urlOrPath = z
	.string()
	.refine(
		(v) => v.startsWith("/") || /^https?:\/\//i.test(v) || v === "",
		{ message: "Must be an absolute site path (/img.png) or http(s) URL. Or leave empty." },
	);

export const apps = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		tagline: z.string(),
		description: z.string(),

		// Allows local icon or URL; optional since we use a placeholder
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

		// Stores ISO yyyy-mm-dd; if a string arrives, we coerce and normalize
		lastUpdated: z
			.string()
			.optional()
			.transform((v) => v ?? new Date().toISOString().slice(0, 10)),

		// In the UI you display "1K+"; here it's better to store as a flexible string
		downloads: z.union([z.string(), z.number()]).default(0).transform(String),

		// 0-5 optional (the form already has it)
		rating: z.number().min(0).max(5).optional(),

		// Beta / early access apps
		beta: z.boolean().default(false),
		betaGroupUrl: z.string().url().optional(),

		// Absolute site paths or URLs
		screenshots: z.array(urlOrPath).default([]),
	}),
});

const blog = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		description: z.string(),
		publishedAt: z.coerce.date(),
		updatedAt: z.coerce.date().optional(),
		author: z.string().default("FusionCore Apps"),
		tags: z.array(z.string()).default([]),
		image: z.string().optional(),
		featured: z.boolean().default(false),
	}),
});

const legal = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		updatedAt: z.string(),
	}),
});

export const collections = { apps, blog, legal };
