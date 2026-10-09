# 中英文内容上传与发布指南

本站采用“中文 Markdown + 英文 Markdown”配对的方式发布双语内容。英文内容不会自动翻译，需要分别创建中文和英文两个 `.md` 文件。

## 1. 内容目录

| 内容类型 | 中文目录 | 英文目录 |
| --- | --- | --- |
| 博客 | `src/content/blog/` | `src/content-en/blog/` |
| 随笔 | `src/content/essays/` | `src/content-en/essays/` |
| 研究 | `src/content/research/` | `src/content-en/research/` |
| 资料 | `src/content/resources/` | `src/content-en/resources/` |
| 收藏 | `src/content/bookmarks/` | `src/content-en/bookmarks/` |
| 下载 | `src/content/downloads/` | `src/content-en/downloads/` |

最重要的规则：中英文文件必须使用相同的文件名。

例如：

```text
src/content/blog/20261009.md
src/content-en/blog/20261009.md
```

两份文件的标题可以不同，但文件名必须相同，网站才能将它们识别为同一篇文章。

文件名建议只使用：

- 英文字母
- 数字
- 短横线 `-`

不要在文件名中使用空格，建议不要使用中文文件名。

## 2. 中文文章模板

在中文目录中创建文件，例如：

```text
src/content/blog/20261009.md
```

文件内容：

```md
---
title: "今天的随笔"
description: "记录今天发生的一些事情"
date: "2026-10-09"
language: "zh"
tags: ["生活", "随笔"]
---

这里开始写中文正文。

可以分成多个段落。

## 小标题

这里是小标题下面的内容。
```

## 3. 英文文章模板

在对应的英文目录中创建同名文件：

```text
src/content-en/blog/20261009.md
```

文件内容：

```md
---
title: "Notes From Today"
description: "A short record of what happened today."
date: "2026-10-09"
language: "en"
tags: ["life", "notes"]
---

Write the English version here.

You can separate the article into multiple paragraphs.

## Subtitle

This is the content under the subtitle.
```

注意：

- 中文文件使用 `language: "zh"`。
- 英文文件使用 `language: "en"`。
- 中英文文件的 `date` 建议保持一致。
- `title`、`description`、`tags` 和正文可以分别使用对应语言。

## 4. 在 GitHub 网页创建文章

以发布一篇博客为例：

1. 打开 GitHub 仓库 `cangshudiudiu/TYPC-site`。
2. 进入中文目录 `src/content/blog/`。
3. 点击 **Add file → Create new file**。
4. 文件名填写 `20261009.md`。
5. 粘贴中文模板并修改标题、简介、日期、标签和正文。
6. 点击 **Commit changes** 保存。
7. 进入英文目录 `src/content-en/blog/`。
8. 创建同名文件 `20261009.md`。
9. 粘贴英文模板并填写英文内容。
10. 再次点击 **Commit changes** 保存。

也可以提前在电脑上准备好两个文件，通过 **Add file → Upload files** 一次上传。

## 5. 中英文页面如何显示

如果两个同名文件都存在：

```text
中文地址：/blog/20261009/
英文地址：/en/blog/20261009/
```

- 中文文章右上角会显示 `EN`。
- 英文文章右上角会显示“中文”。
- 点击按钮可以在同一篇文章的中英文版本之间切换。

如果暂时只有中文文件：

- 中文文章仍然可以正常显示。
- 该文章不会显示 `EN` 按钮。
- 以后添加同名英文文件后，语言切换按钮会自动出现。

英文首页不会自动翻译或展示中文正文。只有保存在 `src/content-en/` 中的英文内容才会显示在英文网站中。

## 6. 上传和使用图片

图片统一放在：

```text
public/images/
```

例如上传：

```text
public/images/autumn-2026.jpg
```

在中文正文中插入：

```md
![秋天的照片](/images/autumn-2026.jpg)
```

在英文正文中插入：

```md
![A photo from autumn](/images/autumn-2026.jpg)
```

中英文文章可以共用同一张图片。

图片文件名同样建议只使用英文字母、数字和短横线，避免空格和中文字符。

## 7. 常用 Markdown 写法

```md
# 一级标题

## 二级标题

普通段落文字。

**粗体文字**

*斜体文字*

- 列表第一项
- 列表第二项

[链接文字](https://example.com)

![图片说明](/images/example.jpg)

> 这是一段引用。
```

文章标题通常已经由文件顶部的 `title` 生成，所以正文一般从普通段落或 `## 二级标题` 开始，不必重复写一级标题。

## 8. 发布流程

内容提交到 GitHub 的 `main` 分支后，发布流程为：

```text
GitHub 更新 → Cloudflare 自动构建 → 网站更新
```

通常等待一两分钟后刷新网站即可看到新内容。

如果网站没有更新：

1. 打开 Cloudflare 控制台。
2. 进入 **Workers & Pages → typc-site → Deployments**。
3. 查看最新部署是否对应刚刚提交的 GitHub commit。
4. 如果部署失败，展开最后的错误日志进行检查。

## 9. 发布前检查清单

- [ ] 中文文件放在 `src/content/` 对应栏目中。
- [ ] 英文文件放在 `src/content-en/` 对应栏目中。
- [ ] 中英文文件名完全相同，包括大小写。
- [ ] 中文文件使用 `language: "zh"`。
- [ ] 英文文件使用 `language: "en"`。
- [ ] 日期格式为 `YYYY-MM-DD`。
- [ ] Markdown 文件顶部和底部的 `---` 没有遗漏。
- [ ] 图片已经上传到 `public/images/`。
- [ ] 图片路径以 `/images/` 开头。
- [ ] 修改已经提交到 `main` 分支。

