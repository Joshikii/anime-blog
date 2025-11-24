import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    image: z.string().optional(),
    category: z.string(),
    author: z.string().default('Alex'),
  }),
});

export const collections = { blog };