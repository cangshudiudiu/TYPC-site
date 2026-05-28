# 安全发布与后台使用说明

本站第一版保持静态站架构：GitHub 保存源码和 Markdown 内容，Cloudflare 负责构建和部署，后台只给站长登录使用。

## 后台使用

- `/admin/` 仅供站长使用 GitHub 登录。
- 内容保存后先进入 Decap CMS 的审核流程，再发布到 `main` 分支。
- 不直接删除文章；需要隐藏时把 `status` 改为 `archived`。
- GitHub OAuth Secret 只保存在 Cloudflare Worker 环境变量里，不写入仓库。
- 如果 Secret 曾经泄露，必须在 GitHub OAuth App 里重新生成，并更新 Cloudflare 的 `GITHUB_OAUTH_SECRET`。

## 投稿处理

- 投稿页只生成 Markdown 或打开 GitHub Issue，不会自动发布。
- 外部投稿默认生成 `status: "archived"`，站长审核后再改成 `published`。
- 投稿正文、外链和附件链接都需要检查来源、授权和安全性。
- 不接收账号密钥、隐私文件、未授权转载内容或不能公开的附件。

## 研究文章附件

- 研究文章可以同时包含正文和附件下载。
- 附件可以是 PDF、数据、代码、补充材料或普通文件。
- 正式附件建议由站长在后台上传到 `public/uploads`，或使用可靠的公开链接。
- 发布前确认附件不会泄露个人信息、未公开数据或受限资料。
