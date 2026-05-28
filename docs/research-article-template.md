# 研究文章 Markdown 模板

复制下面内容到后台“研究”栏目，替换标题、摘要、正文和附件即可。

```md
---
title: "研究文章标题"
description: "用一两句话说明这篇研究文章的主题、问题或结论。"
date: "2026-05-28"
status: "published"
featured: false
language: "zh"
tags: ["研究", "主题标签"]
authors: ["作者姓名"]
researchStatus: "preprint"
venue: ""
doi: ""
codeUrl: ""
citation: ""
attachments:
  - label: "论文 PDF"
    type: "PDF"
    url: "/uploads/example.pdf"
  - label: "补充材料"
    type: "Supplement"
    url: "/uploads/example-supplement.pdf"
---

## 摘要

这里写研究摘要或文章开头。

## 背景

这里写研究背景、问题来源和相关说明。

## 方法

这里写研究方法、材料、数据来源或分析流程。

## 结果

这里写主要发现。

## 讨论

这里写解释、限制和后续计划。
```

## 发布前检查

- 确认 `status` 是 `published` 才会公开展示。
- 不确定是否公开时先设为 `archived`。
- 附件链接要能公开访问，且不包含隐私、密钥或未授权资料。
- DOI、代码链接、引用格式可以先留空，后续再补。
