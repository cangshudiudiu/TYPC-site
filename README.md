# TYPC-site

Personal homepage and blog for `cangshuzhijia`.

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
- Node.js version: `20` or newer
