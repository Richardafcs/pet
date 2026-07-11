# 开发任务拆分

以下任务可直接转成 issue。

## Foundation

### DEV-001 初始化前端项目

状态：Done

范围：

- Vite + React + TypeScript。
- ESLint、Prettier、Vitest。
- 基础路由和布局。

验收：

- `npm run dev` 可启动。
- `npm run build` 通过。
- 首页显示 app shell。

### DEV-002 建立领域类型

状态：Done

范围：

- `InventoryItem`
- `RecognitionCandidate`
- `FoodAction`
- `PlanItem`
- `PetState`

验收：

- 类型与 `docs/DATA_MODEL.md` 一致。
- Typecheck 通过。

### DEV-003 建立本地存储

状态：Done for MVP

范围：

- Dexie schema。
- CRUD。
- 清空数据。
- demo seed。

验收：

- 刷新后库存保留。
- 可一键清除和恢复 demo 数据。

## Recognition

### DEV-010 Mock 小票识别

状态：Done for MVP

范围：

- mock receipt 入口。
- mock receipt adapter。
- 候选项列表。
- 候选项字段编辑。
- 单项确认、拒绝和批量确认。
- 与购买防护联动。

验收：

- 点击 mock receipt 后出现候选项。
- 用户可编辑、拒绝、单项确认和批量确认。
- 编辑后的候选项进入库存。
- 组件测试和 E2E 覆盖候选编辑确认。

### DEV-011 Mock 照片识别

状态：Done for MVP

范围：

- mock photo 入口。
- mock image adapter。
- 候选项确认。
- 与购买防护联动。
- AI image recognition 上传入口。
- 拖拽上传图片。
- 未配置 `GOOGLE_AI_API_KEY` 或 fallback key 时显示可恢复错误并保留 mock 路径。

验收：

- 点击 mock photo 后出现候选项。
- 低置信字段显示确认提示。
- 上传真实图片会调用 `/api/recognize`，有 Google AI Studio key 时返回 AI 候选项，无 key 时提示配置。
- 支持小票、单个食物、多物品和冰箱/食品柜照片的上传说明。

### DEV-012 购买防护

状态：Done

范围：

- `evaluatePurchaseGuard`
- 添加物品前检查重复或过量库存。
- 宠物阻止提示 UI。
- 仍然添加 override。

验收：

- 同名 active 物品触发阻止提示。
- 提示说明库存原因。
- 用户选择先处理现有库存时不添加新物品。
- 用户二次确认后可以添加。
- 单元测试覆盖重复、过量和安全添加。

## Inventory

### DEV-020 库存列表

状态：Done for MVP

范围：

- 列表。
- 风险标签。
- 筛选和排序。
- 编辑入口。
- 编辑名称、数量、储存位置和建议使用日期。

验收：

- 按建议使用日期排序。
- active 以外状态默认隐藏。
- 可切换 all、used、frozen、shared、discarded 状态视图。
- 可按日期、风险和名称排序。
- 编辑后本地库存更新并重新计算计划/宠物状态。

### DEV-021 行动记录

状态：Done

范围：

- 已使用。
- 冷冻。
- 分享/捐赠。
- 丢弃。

验收：

- 行动记录追加保存。
- 库存状态正确更新。

## Planning

### DEV-030 风险等级和优先级

状态：Done

范围：

- `getRiskLevel`
- `calculatePriorityScore`
- reason codes。

验收：

- 单元测试覆盖主要类别和日期。

### DEV-031 今日计划

状态：Done

范围：

- `generatePlan`
- 今日 mission card UI。
- 推荐原因。
- 奖励预览。
- AI coach 计划文案增强。

验收：

- 临期高风险物品优先。
- 每项都有解释。
- 每张任务卡有标题、原因、行动、奖励和主按钮。
- AI coach 可生成计划总结和轻量行动建议；失败时使用规则兜底。

## Pet

### DEV-040 宠物状态引擎

状态：Done

范围：

- `calculatePetState`
- 行动影响。
- 每日 tick。

验收：

- 数值 clamp。
- 无高风险物品不惩罚。
- 单元测试通过。

### DEV-041 宠物 UI

状态：Done for MVP

范围：

- visualState。
- 状态条。
- 文案。
- 点击宠物反馈。
- 今日线索、购物检查和心情检查按钮。
- AI coach 宠物台词和计划建议。
- 奖励 toast。
- 宠物房间状态。

验收：

- 至少 happy、calm、tired、sad 四种展示。
- 不只靠动画传达状态。
- 点击宠物显示状态文案。
- 购物检查提示先查看库存和处理临期物品。
- AI coach 有 Google key 时生成灵活宠物文案，无 key 时显示规则兜底。
- 完成任务后状态条和 toast 变化。

## Impact

### DEV-050 成果统计

状态：Done

范围：

- 已拯救物品数。
- 冷冻数。
- 分享数。
- 丢弃数。
- streak。

验收：

- 完成行动后指标更新。
- 估算指标标注为估算。

## Quality

### DEV-060 E2E 核心路径

状态：Done

范围：

- 新用户。
- 加载 demo。
- 生成计划。
- 完成行动。
- 刷新验证。

验收：

- Playwright 测试通过。

### DEV-061 部署

状态：Not started

范围：

- 选择平台。
- 配置 build。
- 发布 preview。

验收：

- 有可访问 URL。
- demo mode 可用。
