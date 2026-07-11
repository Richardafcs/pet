# 测试和 CI

本文件补充 [../TEST_PLAN.md](../TEST_PLAN.md) 的工程执行细节。

## 当前公开仓库质量命令

公开 GitHub MVP 仓库只包含最小运行代码，不包含测试文件和 E2E 文件。当前可执行质量命令是：

```bash
npm run typecheck
npm run lint
npm run build
npm audit --omit=dev
```

这些命令必须在公开仓库可通过。

## 本地测试资产

本地工作区保留但不公开提交：

```text
src/**/*.test.ts
src/**/*.test.tsx
src/test/
e2e/
vitest.config.ts
playwright.config.ts
```

这些测试覆盖过：

- planning priority and risk
- pet state calculation
- purchase guard
- AI recognition normalization
- AI daily plan normalization
- inventory partial use / frozen behavior
- dashboard AI plan synchronization
- inventory filtering and editing
- add-items candidate editing

## 重新公开测试的条件

如果团队决定把测试重新推到 GitHub，必须一次性恢复：

- 测试文件。
- `vitest.config.ts` 和 `playwright.config.ts`。
- `package.json` 测试脚本。
- Vitest、Testing Library、jsdom、Playwright devDependencies。
- CI 中对应的 `npm test` / `npm run test:e2e` 步骤。

不能只公开脚本或只公开测试文件。

## 推荐 CI 分层

最小公开仓库 CI：

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run build
      - run: npm audit --omit=dev
```

完整工程 CI 可在后续增加：

```bash
npm test
npm run test:e2e
```

## 必测回归清单

即使测试文件暂不公开，下面场景仍应在本地或手动验证：

- Frozen item remains inventory and shows `frozen pause`.
- AI daily plan removes stale tasks if a Today mission freezes or uses the same item.
- Partial use decreases quantity; zero remaining changes item to `used`.
- Demo `Next day` recalculates mission risk.
- Purchase guard blocks duplicate available inventory.
- AI key absence falls back to mock/demo path.

## 合并门槛

当前最小仓库 PR 合并前至少满足：

- Typecheck 通过。
- Lint 通过。
- Build 通过。
- 生产依赖审计无漏洞。
- 涉及状态同步、AI plan 或库存动作的变更必须在本地补充测试或手动验证记录。
