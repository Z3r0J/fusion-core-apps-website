import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// TODO: replace with your real production domain (https://example.com)
export default defineConfig({
  site: 'https://fusioncore.app',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: true, // Changed back to true to ensure Tailwind works
    }),
    sitemap(),
    mdx()
  ],
  vite: {
    optimizeDeps: {
      include: ['react', 'react-dom', 'lucide-react', 'framer-motion']
    }
  }
});
