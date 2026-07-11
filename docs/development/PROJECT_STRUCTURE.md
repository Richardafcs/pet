# 项目结构

## 当前公开仓库结构

公开 GitHub MVP 仓库采用最小结构：

```text
.
├── .env.example
├── .gitignore
├── README.md
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
├── eslint.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── src/
    ├── app/
    ├── components/
    ├── data/
    ├── features/
    ├── lib/
    ├── types/
    ├── main.tsx
    └── styles.css
```

未公开提交但本地保留：

```text
docs/
e2e/
src/**/*.test.ts
src/**/*.test.tsx
src/test/
vitest.config.ts
playwright.config.ts
```

## 源码目录

```text
src/
├── app/
│   ├── App.tsx
│   └── types.ts
├── components/
│   ├── layout/
│   └── ui/
├── data/
│   └── demoData.ts
├── features/
│   ├── add-items/
│   ├── dashboard/
│   ├── impact/
│   └── inventory/
├── lib/
│   ├── ai/
│   ├── dates/
│   ├── impact/
│   ├── pet-state/
│   ├── planning/
│   ├── purchase-guard/
│   ├── recognition/
│   └── storage/
└── types/
    └── domain.ts
```

## 模块边界

### `features/*`

面向用户流程的 UI 模块，包含页面片段、表单、列表和交互状态。

复杂业务规则不应直接写在 UI 中。规划、宠物状态、识别归一化、购买防护和库存动作应放入 `lib/`。

### `lib/planning`

负责从库存、行动历史和 demo 日期生成计划：

- 输入 `InventoryItem[]`、`FoodAction[]`、`today`。
- 输出 `PlanItem[]`。
- 只规划 `active` 食物。
- 不读写浏览器存储。
- 不依赖 React。

### `lib/ai`

负责 AI coach 和 AI daily plan 的数据契约：

- AI daily plan 是临时执行层，不是 source of truth。
- AI daily plan 只接收当前 active items 和 Today missions。
- 客户端必须重新归一化 AI 返回结果，移除不存在或已不可用的 item task。

### `lib/pet-state`

负责宠物状态计算：

- 输入当前宠物状态、行动历史、库存风险和日期。
- 输出新宠物状态。
- `frozen` 食物不应让宠物进入 hungry。

### `lib/recognition`

负责识别 schema、mock candidates、AI 结果归一化：

- mock 小票/照片候选。
- AI image recognition 输出归一化。
- 数量/单位后处理，例如 `3L` -> `3 l`，`2 x 500g` -> `2 item` with notes。

### `lib/storage`

负责 Zustand 持久化和库存动作：

- local storage persistence。
- demo seed。
- `applyInventoryAction` 负责 partial use、used、frozen、shared、discarded 的状态迁移。

### `types/domain.ts`

集中定义跨模块共享类型。类型应和 [../DATA_MODEL.md](../DATA_MODEL.md) 同步。

## 禁止的耦合

- UI 组件直接调用 OCR provider SDK。
- 计划算法直接读取浏览器存储。
- 宠物组件直接修改库存。
- AI 直接修改库存或 mission 权威状态。
- 食品安全判断散落在多个组件中。

## 文件命名

- React 组件：`PascalCase.tsx`
- pure utility：`camelCase.ts`
- tests：`*.test.ts` 或 `*.test.tsx`
- E2E：`*.spec.ts`

## 公开仓库维护规则

如果继续保持最小公开仓库：

- 不提交 `docs/`、`e2e/`、测试文件或本地结果文件。
- README 只描述运行和核心功能。
- `package.json` 不应包含不存在的测试脚本。

如果转为完整工程仓库：

- 同步恢复测试文件、测试配置、测试依赖和 CI。
- 更新 `.gitignore`。
- 更新 README 的质量检查命令。
