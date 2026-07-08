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

建议环境变量：

```text
WRITING_API_BASE_URL=
WRITING_API_KEY=
```

后续接口建议：

```text
/api/analyze-style
/api/generate-trials
/api/generate-plan
/api/generate-article
```
