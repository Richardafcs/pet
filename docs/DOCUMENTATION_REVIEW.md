# 文档复核记录

## 复核日期

2026-07-10

## 当前阶段

项目已从空仓库文档骨架升级为 hackathon 项目开发文档，并已初始化可运行 MVP 前端。

## 已复核文件

- `README.md`
- `docs/README.md`
- `docs/PROJECT_SCOPE.md`
- `docs/PRODUCT_REQUIREMENTS.md`
- `docs/UX_FLOWS.md`
- `docs/FRONTEND_EXPERIENCE_DESIGN.md`
- `docs/TECHNICAL_DESIGN.md`
- `docs/DATA_MODEL.md`
- `docs/AI_AND_OCR_PIPELINE.md`
- `docs/PLANNING_ALGORITHM.md`
- `docs/PET_STATE_AND_GAMIFICATION.md`
- `docs/TEST_PLAN.md`
- `docs/DEVELOPMENT_ROADMAP.md`
- `docs/REFERENCES.md`
- `docs/REVIEW_CHECKLIST.md`
- `docs/development/README.md`
- `docs/development/GETTING_STARTED.md`
- `docs/development/PROJECT_STRUCTURE.md`
- `docs/development/CODING_STANDARDS.md`
- `docs/development/MODULE_CONTRACTS.md`
- `docs/development/STATE_AND_STORAGE.md`
- `docs/development/ENVIRONMENT.md`
- `docs/development/API_DESIGN.md`
- `docs/development/TESTING_AND_CI.md`
- `docs/development/DEPLOYMENT.md`
- `docs/development/OBSERVABILITY.md`
- `docs/development/SECURITY_AND_PRIVACY.md`
- `docs/development/TASK_BREAKDOWN.md`
- `docs/development/REQUIREMENTS_TRACEABILITY.md`
- `docs/development/QUALITY_GATES.md`
- `docs/development/DEFINITION_OF_READY.md`
- `docs/development/DEFINITION_OF_DONE.md`
- `docs/development/DEFECT_POLICY.md`
- `docs/development/ENGINEERING_REVIEW.md`
- `docs/development/ADR_TEMPLATE.md`

## 已完成

- 明确项目主题：通过网页端宠物反馈减少家庭食物浪费。
- 定义 MVP 闭环：输入、库存、计划、行动、宠物状态、成果统计。
- 拆分产品需求、用户流程、技术设计、数据模型、识别流程、规划算法、宠物状态、测试计划和路线图。
- 增加外部参考资料，并将参考资料映射到设计决策。
- 加入食品安全、隐私和 OCR 不确定性约束。
- 避免把质量日期误写成食品安全保证。
- 增加完整开发手册，覆盖项目初始化、目录结构、编码规范、模块契约、状态存储、环境变量、API、测试 CI、部署、安全隐私和任务拆分。
- 增加软件工程复核材料，覆盖需求追踪、质量门槛、Ready/Done 标准和缺陷分级。
- 增加前端体验设计，明确 Dashboard 视觉结构、mission card、宠物房间、点击互动、奖励反馈和可访问性要求。
- 初始化 Vite + React + TypeScript 前端，实现 demo Dashboard、mission card、宠物状态、添加、库存和影响页面。
- 拆分前端组件结构，新增 Dashboard、AddItems、Inventory、Impact、Topbar、Toast、Meter 等模块。
- 增加组件测试，覆盖 mission card 行动和购买防护交互。
- 增加真实 AI 图片识别入口，配置 Google AI Studio `GOOGLE_AI_API_KEY` 后通过本地 `/api/recognize` 调用 Gemini；未配置时提示使用 mock。
- 增加 AI coach，配置 key 后通过 `/api/coach` 生成宠物台词和今日计划建议；未配置时使用规则兜底。
- 增加候选物品确认流程，支持 mock 小票/照片候选编辑、拒绝、单项确认和批量确认。
- 增加宠物互动按钮，覆盖今日线索、购物检查和心情检查。
- 增强库存页面，支持默认 available 视图、状态筛选、日期/风险/名称排序和列表内编辑。
- 本地完整工作区曾增加 Playwright E2E，覆盖 demo mission、宠物购物检查、购买防护、覆盖添加、候选编辑确认和刷新持久化；公开最小仓库暂不包含 E2E 文件。

## 仍需后续补充

- 具体 UI 视觉稿或线框图。
- 真实 OCR adapter 的供应商选择。
- 如果恢复公开 E2E，需要扩展移动端、识别失败和拒绝全部候选路径。
- 演示图片和 mock 识别 JSON。
- 部署平台和环境变量说明。

## 下一次复核触发条件

以下任一内容加入仓库后，应更新文档：

- 新页面或核心组件实现。
- mock 数据文件结构变化。
- OCR 或商品 API 集成。
- Playwright E2E 配置。
- 部署配置。
- 演示脚本或 pitch deck。

## 2026-07-11 复核更新

### 本次发现的缺陷

- 部分开发文档仍描述“代码尚未初始化”，与当前 MVP 不一致。
- 测试和 CI 文档仍要求 `npm test`、`npm run test:e2e`，但公开 GitHub 最小仓库已不包含测试文件和测试脚本。
- 项目结构文档仍是推荐结构，没有反映当前 `src/` 实际模块和本地忽略文件策略。
- 技术设计和状态存储文档仍写 IndexedDB/Dexie 为当前实现，但当前 MVP 使用 Zustand persist/localStorage。
- UX 和测试计划没有完整覆盖 `frozen pause`、AI daily plan stale task 同步、demo `Next day` 等最新交互。
- 需求追踪缺少“状态同步”需求项。

### 本次已修复

- `docs/README.md` 增加 `STATE_INTERACTION_MODEL.md` 阅读入口，并说明公开 GitHub 最小提交策略。
- `docs/development/GETTING_STARTED.md` 改为当前项目启动方式，并明确测试文件只保留在本地完整工作区。
- `docs/development/TESTING_AND_CI.md` 分离公开最小仓库质量命令和本地完整测试资产。
- `docs/development/PROJECT_STRUCTURE.md` 改为当前实际结构，并说明公开/本地文件边界。
- `docs/development/STATE_AND_STORAGE.md` 改为 Zustand persist/localStorage、source of truth、派生数据和后续 IndexedDB 迁移说明。
- `docs/UX_FLOWS.md`、`docs/PLANNING_ALGORITHM.md`、`docs/TEST_PLAN.md` 增加 AI daily plan 与 Today missions 同步规则。
- `docs/development/REQUIREMENTS_TRACEABILITY.md` 增加 PRD-015 状态同步。

### 当前仍需注意

- `docs/` 当前被 `.gitignore` 忽略，没有推送到公开 GitHub。
- 如果后续要公开文档，应先确认 README、package scripts、测试文件和 CI 的一致性。
- 如果后续恢复完整测试到公开仓库，需要同步恢复 devDependencies、Vitest/Playwright 配置和 GitHub Actions。
