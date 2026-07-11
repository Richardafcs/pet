# 质量门槛

本文件定义 PR、主分支和发布前必须满足的质量要求。

## Pull Request 门槛

每个 PR 必须满足：

- TypeScript typecheck 通过。
- Lint 通过。
- Unit tests 通过。
- Build 通过。
- 涉及 UI 的改动有截图或手动验证说明。
- 涉及 P0 需求的改动更新需求追踪矩阵。
- 涉及数据模型的改动更新 `DATA_MODEL.md` 和相关测试。
- 涉及食品安全文案的改动经过人工复核。

## 主分支门槛

合并到 `main` 前：

- 不允许提交真实密钥。
- 不允许跳过用户确认直接把识别结果加入库存。
- 不允许把真实 OCR 设置为默认开启。
- 不允许 console 输出小票全文或图片内容。
- P0 功能不得只有 UI，没有数据保存或错误状态。

## 发布门槛

发布演示版本前：

- 核心 E2E 路径通过或有手动验收记录。
- demo mode 断网可运行。
- 首页、添加、库存、计划、宠物、影响页面可打开。
- 清除本地数据可用。
- 移动端布局经过检查。
- 食品安全和隐私提示可见。

## 建议覆盖率目标

MVP 阶段不强制高覆盖率，但核心领域逻辑应达到：

- `lib/planning`: 80% line coverage。
- `lib/pet-state`: 80% line coverage。
- `lib/storage`: 关键 CRUD 和 migration 覆盖。
- `lib/recognition`: mock adapter 和 parser 覆盖。

## 阻断级问题

以下问题必须阻断合并：

- P0 流程不可用。
- Typecheck 失败。
- Build 失败。
- 用户数据丢失且无恢复说明。
- 未确认 OCR 候选直接进入计划。
- 前端 bundle 包含真实 API key。
- 食品安全文案承诺确定性安全判断。
