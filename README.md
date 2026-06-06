# 万能工具箱

万能工具箱是一个适合部署到 Cloudflare Pages 的 API 聚合工具站，使用 Vite、React、TypeScript、Tailwind CSS 和 Cloudflare Pages Functions 构建。

## 已接入工具

- 天气查询
- IP 信息查询
- 油价查询
- 每日 60 秒
- 历史上的今天
- 实时热榜
- 违禁词检测
- TTS 语音合成
- AI 聊天
- AI 生图

## 技术栈

- Vite
- React
- TypeScript
- Tailwind CSS
- Cloudflare Pages Functions

## 密钥安全

小宇 API 密钥不会写入前端代码。浏览器只请求本站的 `/api/proxy`，由 Cloudflare Pages Function 在服务端读取环境变量并代理请求小宇 API。

在 Cloudflare Pages 项目中配置环境变量：

```env
XIAOYU_API_KEY=你的apikey
XIAOYU_API_BASE=https://api.xiaoyu17love.top/API
```

不要把真实 API 密钥提交到 GitHub。

## Cloudflare Pages 配置

```text
Framework preset: Vite
Build command: npm run build
Build output directory: dist
```

`functions/api/proxy.ts` 会自动映射为：

```text
/api/proxy
```

## GitHub 上传前检查

`.gitignore` 已忽略：

```text
.env
.env.local
.env.*.local
node_modules
dist
.wrangler
```

如果本地需要环境变量，请自己创建 `.env.local`，不要提交它。
