# 内容更新与后台计划

## 手动更新内容

所有栏目内容都在 `src/content/` 下面：

- 博客：`src/content/blog/`
- 随笔：`src/content/essays/`
- 资料：`src/content/resources/`
- 收藏：`src/content/bookmarks/`
- 下载：`src/content/downloads/`

新增文章时，复制一个已有 Markdown 文件，改文件名和开头的 frontmatter。

```md
---
title: "文章标题"
description: "一句话摘要"
date: "2026-05-22"
language: "zh"
tags: ["标签"]
---

这里写正文。
```

更新后提交到 GitHub：

```powershell
cd "C:\Users\宋宋\Documents\工作文件\TYPC-site"
git add .
git commit -m "Update content"
git push
```

Cloudflare 会在 GitHub 更新后自动重新部署。

## 管理后台

后台入口：

```text
/admin/
```

后台使用 Decap CMS。它会把网页里编辑的内容保存回 GitHub，然后触发 Cloudflare 自动部署。

当前已配置的内容集合：

- 博客
- 随笔
- 资料
- 收藏
- 下载

## 后台登录还需要配置

Decap CMS 的 GitHub 后台需要 OAuth 登录服务。官方说明里提到，GitHub 认证必须经过一个服务端或边缘函数处理；Netlify 可以代管这个流程，如果站点不在 Netlify，就需要一个 OAuth proxy。

推荐方案：

1. 创建 GitHub OAuth App
2. 用 Cloudflare Worker 或 Cloudflare Pages Functions 部署 OAuth proxy
3. 把 OAuth proxy 地址填入 `public/admin/config.yml` 的 `backend.base_url`
4. 重新部署网站

后台配置中的 `auth_endpoint` 应保持为 `/auth`。`base_url` 不能使用占位地址，必须替换成实际 OAuth Worker 地址，例如：

```yml
backend:
  name: github
  repo: cangshudiudiu/TYPC-site
  branch: main
  base_url: https://decap-oauth.example.workers.dev
  auth_endpoint: /auth
```

## 投稿系统计划

建议分两期做：

第一期：GitHub 审核流

- 开启 Decap CMS open authoring
- 投稿进入 GitHub Pull Request
- 站长审核合并后发布

第二期：网页投稿表单

- 新增 `/submit/` 投稿页面
- 投稿先进入审核队列
- 站长在后台审核
- 审核通过后生成 Markdown 并同步 GitHub

第二期需要 Cloudflare D1 或其他数据库，不建议一开始就做。
