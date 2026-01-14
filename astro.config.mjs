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
		}),
		mdx(),
	],

	vite: {
		plugins: [tailwindcss(), svgr()],
	},
	adapter: vercel(),
});
