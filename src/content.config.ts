import { defineCollection, z } from "astro:content";

const schema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  language: z.enum(["zh", "en"]).default("zh"),
  tags: z.array(z.string()).default([]),
  externalUrl: z.string().url().optional(),
  fileUrl: z.string().optional()
});

export const collections = {
  blog: defineCollection({ schema }),
  essays: defineCollection({ schema }),
  resources: defineCollection({ schema }),
  bookmarks: defineCollection({ schema }),
  downloads: defineCollection({ schema })
};
