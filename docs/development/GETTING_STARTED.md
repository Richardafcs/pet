# 本地开发启动规范

当前项目已经初始化为 Vite + React + TypeScript MVP。

## 当前公开仓库命令

公开 GitHub 最小仓库只保留运行和构建相关脚本：

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
```

`package.json` 当前不包含 `test`、`test:e2e` 或 `test:watch`，因为测试文件和 E2E 文件未随公开 MVP 推送。

## 本地完整工作区

本地工作区仍保留：

- `docs/`
- `e2e/`
- `*.test.ts`
- `*.test.tsx`
- `vitest.config.ts`
- `playwright.config.ts`
- `src/test/`

这些文件被 `.gitignore` 忽略，避免 hackathon 公开仓库过重。

如果要恢复测试公开提交，需要同时恢复：

```bash
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom @playwright/test
```

并在 `package.json` 加回：

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
```

同时从 `.gitignore` 移除测试和 E2E 忽略规则。

## 环境变量

真实 API key 只放在 `.env.local`：

```bash
cp .env.example .env.local
```

不要把真实 key 写入 `.env.example`，也不要使用 `VITE_*` 暴露服务端 key。

## 演示模式

演示模式必须稳定：

- 未配置 AI key 时保留 mock receipt/photo 路径。
- 已配置 `GOOGLE_AI_API_KEY` 时可以使用 AI image recognition、AI coach 和 AI daily plan。
- demo date 控件用于推进日期，不应修改真实系统时间。

## 开发前检查

最小公开仓库：

```bash
npm install
npm run typecheck
npm run lint
npm run build
```

本地完整工作区如果恢复测试依赖后，还应运行：

```bash
npm test
npm run test:e2e
```
