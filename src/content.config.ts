import { defineCollection, z } from "astro:content";

const schema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  status: z.enum(["published", "archived"]).default("published"),
  featured: z.boolean().default(false),
  cover: z.string().optional(),
  language: z.enum(["zh", "en"]).default("zh"),
  tags: z.array(z.string()).default([]),
  externalUrl: z.string().optional(),
  fileUrl: z.string().optional()
});

const researchSchema = schema.extend({
  authors: z.array(z.string()).default([]),
  researchStatus: z.enum(["draft", "preprint", "published"]).default("preprint"),
  venue: z.string().optional(),
  doi: z.string().optional(),
  codeUrl: z.string().optional(),
  citation: z.string().optional(),
  attachments: z
    .array(
      z.object({
        label: z.string(),
        type: z.string().default("file"),
        url: z.string()
      })
    )
    .default([])
});

export const collections = {
  research: defineCollection({ schema: researchSchema }),
  blog: defineCollection({ schema }),
  essays: defineCollection({ schema }),
  resources: defineCollection({ schema }),
  bookmarks: defineCollection({ schema }),
  downloads: defineCollection({ schema })
};
