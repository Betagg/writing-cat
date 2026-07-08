# 写作猫

写作猫是一个公众号写作网页产品原型：用户输入历史文章，产品提取写作风格，再根据主题或材料生成更像用户、也更好的公众号文章。

## 本地预览

```bash
npm run dev
```

打开：

```text
http://localhost:5173
```

## 部署到 Vercel

最简单方式：

1. 把这个目录提交到 GitHub 仓库。
2. 在 Vercel 新建项目，导入该仓库。
3. Framework Preset 选择 `Other`。
4. Build Command 使用 `npm run build`。
5. Output Directory 留空。
6. 点击 Deploy。

部署完成后，访问首页即可使用当前静态版流程。

## 健康检查

部署后可以访问：

```text
/api/health
```

如果返回 `ok: true`，说明 Vercel 的服务端接口通道可用。

## 后续接正式 API

正式 AI 服务不要在前端直接调用。建议把 API Key 放在 Vercel 环境变量里，再通过 `/api/*` 服务端接口转发。

火山方舟推荐环境变量：

```text
ARK_API_KEY=
ARK_MODEL=
ARK_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
```

其中 `ARK_MODEL` 通常填写火山方舟控制台里的推理接入点 ID 或模型调用名，以控制台显示为准。

当前已接入的统一接口：

```text
/api/generate
```

前端会优先调用 `/api/generate`。如果环境变量还没配置，页面会自动回退到本地 Demo 内容，保证产品可以继续体验。
