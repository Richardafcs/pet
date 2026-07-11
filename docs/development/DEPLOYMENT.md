# 部署文档

## MVP 部署目标

当前 hackathon 目标是最稳的静态 QR demo：

- 一个公开 URL。
- 一个 QR code 指向该 URL。
- 无账号。
- 无真实 AI key。
- 无后端依赖。
- 每个评委手机使用自己的浏览器本地数据。

详细 QR 策略见 [../QR_DEMO_DEPLOYMENT.md](../QR_DEMO_DEPLOYMENT.md)。

## 构建命令

```bash
npm install
npm run build
```

静态输出目录：

```text
dist/
```

部署平台只需要托管 `dist/`。

## 默认环境

公开 QR demo 推荐：

```bash
VITE_APP_MODE=demo
VITE_STATIC_QR_DEMO=true
VITE_ENABLE_REMOTE_AI=false
VITE_ENABLE_REAL_OCR=false
VITE_ENABLE_BARCODE_LOOKUP=false
```

效果：

- 上传图片走稳定 mock recognition。
- AI daily rescue plan 走本地规则。
- 不调用 `/api/*`。
- 不需要 Google/OpenAI key。

## 每个评委的数据隔离

当前状态存储在当前浏览器：

- `InventoryItem[]`
- `FoodAction[]`
- `PetState`
- 当前 UI 派生状态

不同评委用自己的手机扫码时天然隔离。

如果共用同一台设备：

- 使用 `Clear local data`。
- 或打开无痕窗口。
- 或后续实现 query session scoped storage。

## 发布检查清单

- [ ] `npm run build` 通过。
- [ ] 部署后的 URL 能在手机打开。
- [ ] Dashboard 默认 demo 数据可见。
- [ ] Add 页面 mock receipt 可跑通。
- [ ] 上传图片不会出现 API key 错误，而是进入 stable mock recognition。
- [ ] AI daily rescue plan 显示本地菜谱步骤和 usage task。
- [ ] Today mission 行动后 AI daily plan stale task 会同步移除。
- [ ] Inventory 中 frozen item 显示 `frozen pause`。
- [ ] 刷新后当前评委本地状态仍存在。
- [ ] `Clear local data` 只清当前浏览器。
- [ ] 没有真实密钥进入前端 bundle。

## 回滚

Hackathon 展示前保留：

- 一个稳定部署链接。
- 一份本地可运行版本。
- 一组截图或录屏备用。

如果远程 AI 或外部服务不稳定，保持 `VITE_ENABLE_REMOTE_AI=false`，不要让 QR demo 依赖它。

## 后续远程 AI 版本

如果之后要让 QR demo 使用真实 AI：

- 将 `/api/recognize`、`/api/coach`、`/api/daily-plan` 从 Vite dev middleware 迁移到 serverless functions 或后端服务。
- API keys 只放服务端环境变量。
- 前端仍然可以保留浏览器本地库存，避免评委互相干扰。
- 上线前必须单独做限流、错误兜底和隐私说明。
