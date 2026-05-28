# Decap CMS GitHub OAuth 部署步骤

当前 `/admin/` 使用 Decap CMS 和 GitHub OAuth。要让后台真正保存内容，需要部署 GitHub OAuth proxy。

## 1. 创建 GitHub OAuth App

打开 GitHub：

```text
https://github.com/settings/developers
```

进入：

```text
OAuth Apps -> New OAuth App
```

填写：

```text
Application name:
藏书小刊 CMS

Homepage URL:
https://decap-oauth.uquk202268.workers.dev

Authorization callback URL:
https://decap-oauth.uquk202268.workers.dev/callback
```

创建后保存：

- Client ID
- Client Secret

不要把 Client Secret 提交到 GitHub。

## 2. 部署 OAuth Worker

推荐使用现成项目：

```text
https://github.com/sterlingwes/decap-proxy
```

Worker 需要两个 Secret：

```text
GITHUB_OAUTH_ID
GITHUB_OAUTH_SECRET
```

如果仓库是公开仓库，先不用设置私有仓库开关。

## 3. 修改后台配置

OAuth Worker 部署成功后，把 `public/admin/config.yml` 改成：

```yml
backend:
  name: github
  repo: cangshudiudiu/TYPC-site
  branch: main
  base_url: https://decap-oauth.uquk202268.workers.dev
  auth_endpoint: /auth
  use_graphql: true
```

然后提交并推送，Cloudflare 会重新部署网站。

## 4. 验证

打开：

```text
https://typc-site.uquk202268.workers.dev/admin/
```

如果能跳转 GitHub 授权并回到后台，说明 OAuth 已经接通。
