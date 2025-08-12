import { defineCollection, z } from 'astro:content';

const apps = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    description: z.string(),
    icon: z.string().optional(),
    playUrl: z.string().url(),
    category: z.string().default('Tools'),
    tags: z.array(z.string()).default([]),
    locale: z.enum(['en', 'es']).default('en'),
    price: z.string().default('Free'),
    version: z.string().optional(),
    lastUpdated: z.string().optional(),
    screenshots: z.array(z.string()).default([]),
  }),
});

const legal = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    updatedAt: z.string(),
  })
});

export const collections = { apps, legal };
