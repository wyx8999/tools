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
- QQ 信息查询
- 备案查询
- WHOIS 查询
- 域名查价
- 网站信息提取
- 网页快照
- 二级域名查询
- B 站聚合查询
- 网易云点歌
- 表情包搜索
- 其余小宇 API 接口已加入配置，默认隐藏高风险、计费、维护、弃用或异常接口

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
# 可选。设为 true 后，后端才允许调用高风险、计费、维护或敏感接口。
ENABLE_RESTRICTED_TOOLS=false
```

如果页面提示 `服务端未配置 XIAOYU_API_KEY`，说明 Cloudflare Pages Function 没有读取到密钥。请在 Cloudflare Pages 控制台进入项目的 `Settings -> Environment variables`，分别在 `Production` 和需要使用的 `Preview` 环境中添加 `XIAOYU_API_KEY`，保存后重新部署。

不要把真实 API 密钥提交到 GitHub。

## 隐藏工具

高风险、计费、维护、弃用或异常接口默认不会出现在工具列表中。需要查看全部工具时，可以访问：

```text
/?showRestricted=true
```

即使前端显示了隐藏工具，后端仍会默认拒绝这些接口。只有在 Cloudflare Pages 环境变量中设置以下值后，后端才会允许调用：

```env
ENABLE_RESTRICTED_TOOLS=true
```

不建议在公开网站开启该开关，除非你确定能承受滥用、限速、封禁和计费风险。

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
