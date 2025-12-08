import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.date().optional(),
    parent: z.string().optional(),
    costs: z.array(z.object({
      item: z.string(),
      cost: z.number(),
      date: z.string().optional(),
    })).optional(),
  }),
});

const notepad = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string().optional(),
  }),
});

export const collections = {
  projects,
  notepad,
};
