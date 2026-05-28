# TYPC-site

Personal research journal and static website for 藏书小刊.

## Local development

```bash
npm install
npm run dev
```

## Update content

Add Markdown files under:

- `src/content/blog/`
- `src/content/essays/`
- `src/content/resources/`
- `src/content/bookmarks/`
- `src/content/downloads/`

Each file needs frontmatter:

```md
---
title: "Post title"
description: "Short summary"
date: "2026-05-22"
language: "zh"
tags: ["note"]
---
```

## Deploy

Use Cloudflare Pages:

- Build command: `npm run build`
- Output directory: `dist`
- Node.js version: `22` or newer

## Admin CMS

The admin page lives at `/admin/` and uses Decap CMS.

Before it can save changes on the live site, configure GitHub OAuth for the
repository and set the CMS backend OAuth endpoint in `public/admin/config.yml`.
The content edited in the CMS is committed back to GitHub, then Cloudflare
rebuilds the site automatically.
