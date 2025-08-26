import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import svgr from "vite-plugin-svgr";

// TODO: replace with your real production domain (https://example.com)
export default defineConfig({
	site: "https://fusioncoreapps.com",
	integrations: [react(), sitemap(), mdx()],
	vite: {
		plugins: [tailwindcss(), svgr()],
	},
});
