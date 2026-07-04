import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { copyFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import svgr from "vite-plugin-svgr";

import vercel from "@astrojs/vercel";

// Workaround: Astro runs adapter hooks first (integrations.unshift(adapter)),
// so @astrojs/vercel packages .vercel/output/static BEFORE @astrojs/sitemap
// writes its XML in astro:build:done — the sitemap never reaches the deploy
// and /sitemap-index.xml 404s in production. Copy the files in afterwards.
// Must stay AFTER sitemap() in the integrations array.
const copySitemapToVercelOutput = {
	name: "copy-sitemap-to-vercel-output",
	hooks: {
		"astro:build:done": ({ dir }) => {
			const src = fileURLToPath(dir);
			const dest = fileURLToPath(new URL("./.vercel/output/static/", import.meta.url));
			if (!existsSync(dest)) return;
			for (const file of readdirSync(src)) {
				if (/^sitemap-.*\.xml$/.test(file)) copyFileSync(join(src, file), join(dest, file));
			}
		},
	},
};

export default defineConfig({
	site: "https://www.fusioncoreapps.com",
	trailingSlash: "never",
	i18n: {
		defaultLocale: "en",
		locales: ["en", "es", "pt"],
		routing: {
			prefixDefaultLocale: false,
		},
	},
	integrations: [
		react(),
		sitemap({
			i18n: {
				defaultLocale: "en",
				locales: { en: "en-US", es: "es-419", pt: "pt-BR" },
			},
			filter: (page) =>
				page !== "https://www.fusioncoreapps.com/admin" &&
				page !== "https://www.fusioncoreapps.com/404" &&
				!page.includes("/admin/"),
			serialize(item) {
				const url = item.url;
				const isLocale = /\/(es|pt)\//.test(url) || /\/(es|pt)$/.test(url);
				// Homepage variants
				if (url === "https://www.fusioncoreapps.com/" || url.match(/\/(es|pt)$/)) {
					item.changefreq = "weekly";
					item.priority = isLocale ? 0.9 : 1.0;
					item.lastmod = new Date().toISOString();
					return item;
				}
				// Individual app pages
				if (url.includes("/apps/")) {
					item.changefreq = "monthly";
					item.priority = isLocale ? 0.8 : 0.9;
					return item;
				}
				// Apps listing
				if (url.endsWith("/apps")) {
					item.changefreq = "weekly";
					item.priority = isLocale ? 0.7 : 0.8;
					return item;
				}
				// Blog posts
				if (url.includes("/blog/")) {
					item.changefreq = "monthly";
					item.priority = isLocale ? 0.6 : 0.7;
					return item;
				}
				// CartWise landing
				if (url.endsWith("/cartwise")) {
					item.changefreq = "weekly";
					item.priority = isLocale ? 0.8 : 0.9;
					return item;
				}
				// Comparison detail pages
				if (url.includes("/compare-apps/")) {
					item.changefreq = "monthly";
					item.priority = isLocale ? 0.6 : 0.7;
					return item;
				}
				// Comparison hub
				if (url.endsWith("/compare-apps")) {
					item.changefreq = "weekly";
					item.priority = isLocale ? 0.5 : 0.6;
					return item;
				}
				// Blog listing
				if (url.endsWith("/blog")) {
					item.changefreq = "weekly";
					item.priority = isLocale ? 0.6 : 0.7;
					return item;
				}
				// Contact, privacy, terms, etc.
				item.changefreq = "monthly";
				item.priority = isLocale ? 0.4 : 0.5;
				return item;
			},
		}),
		mdx(),
		copySitemapToVercelOutput,
	],

	vite: {
		plugins: [tailwindcss(), svgr()],
	},
	adapter: vercel(),
});
