import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import svgr from "vite-plugin-svgr";

import vercel from "@astrojs/vercel";

// TODO: replace with your real production domain (https://example.com)
export default defineConfig({
	site: "https://www.fusioncoreapps.com",
	trailingSlash: "never",
	integrations: [
		react(),
		sitemap({
			filter: (page) =>
				page !== "https://www.fusioncoreapps.com/admin" &&
				page !== "https://www.fusioncoreapps.com/404" &&
				!page.includes("/admin/"),
			serialize(item) {
				// Homepage
				if (item.url === "https://www.fusioncoreapps.com/") {
					item.changefreq = "weekly";
					item.priority = 1.0;
					item.lastmod = new Date().toISOString();
					return item;
				}
				// Individual app pages
				if (item.url.includes("/apps/") && item.url !== "https://www.fusioncoreapps.com/apps") {
					item.changefreq = "monthly";
					item.priority = 0.9;
					return item;
				}
				// Apps listing
				if (item.url === "https://www.fusioncoreapps.com/apps") {
					item.changefreq = "weekly";
					item.priority = 0.8;
					return item;
				}
				// Blog posts
				if (item.url.includes("/blog/") && item.url !== "https://www.fusioncoreapps.com/blog") {
					item.changefreq = "monthly";
					item.priority = 0.7;
					return item;
				}
				// Blog listing
				if (item.url === "https://www.fusioncoreapps.com/blog") {
					item.changefreq = "weekly";
					item.priority = 0.7;
					return item;
				}
				// Contact, privacy, terms, etc.
				item.changefreq = "monthly";
				item.priority = 0.5;
				return item;
			},
		}),
		mdx(),
	],

	vite: {
		plugins: [tailwindcss(), svgr()],
	},
	adapter: vercel(),
});
