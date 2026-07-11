# 需求追踪矩阵

本矩阵用于验证每个 MVP 需求都有实现模块、测试路径和开发任务。

## P0/P1 追踪

| 需求 | 实现模块 | 测试类型 | 测试用例 | 开发任务 | 状态 |
| --- | --- | --- | --- | --- | --- |
| PRD-001 手动添加物品 | `features/add-items`, `lib/storage` | Component, E2E | 表单校验；添加后库存出现；刷新仍存在 | DEV-001, DEV-002, DEV-003 | Partial: manual add works; validation can be richer |
| PRD-002 小票上传 | `features/add-items`, `lib/recognition` | Component, E2E | mock 小票生成候选；候选可编辑/拒绝/确认 | DEV-010 | Done for MVP |
| PRD-003 照片上传 | `features/add-items`, `lib/recognition`, `/api/recognize` | Component, E2E | mock 图片生成候选；AI 上传无 key 时可恢复；低置信字段提示 | DEV-011 | Done for MVP |
| PRD-004 用户确认识别结果 | `features/add-items`, `lib/storage` | Component, E2E | 未确认候选不进入库存；编辑后保存；批量确认跳过拒绝项 | DEV-010, DEV-011, DEV-003 | Done for MVP |
| PRD-005 库存列表 | `features/inventory`, `lib/planning` | Component, E2E | 默认 available；frozen 显示 frozen pause；按状态筛选；按日期/风险/名称排序；编辑后更新 | DEV-020 | Done for MVP |
| PRD-006 今日计划 | `features/dashboard`, `lib/planning`, `/api/coach`, `/api/daily-plan` | Unit, Component, E2E | 临期高风险优先；每项有解释；AI coach 失败时规则兜底；AI daily plan stale task 自动同步 | DEV-030, DEV-031 | Done for MVP |
| PRD-007 行动记录 | `features/inventory`, `lib/storage` | Component, E2E | 行动追加；库存状态更新；历史保留 | DEV-021 | Done for MVP |
| PRD-008 宠物状态 | `features/dashboard`, `lib/pet-state` | Unit, Component, E2E | 行动影响状态；clamp；无高风险不惩罚 | DEV-040, DEV-041 | Done for MVP |
| PRD-009 成果指标 | `features/impact`, `lib/impact` | Manual | 完成行动后指标增加；估算标注 | DEV-050 | Done for MVP |
| PRD-010 数据持久化 | `lib/storage` | E2E | 刷新后库存、行动、宠物状态存在 | DEV-003, DEV-060 | Partial: localStorage persistence works; IndexedDB pending |
| PRD-011 参考说明 | `features/add-items`, docs | Component, Manual | 日期和食品安全说明可见；确定性安全判断文案不存在；真实 OCR 上传说明可见 | DEV-001, DEV-010, DEV-011, DEV-061 | Partial |
| PRD-012 任务公布 | `features/dashboard`, `lib/planning` | Component, E2E | mission card 包含标题、原因、行动、奖励 | DEV-031, DEV-060 | Done for MVP |
| PRD-013 宠物互动 | `features/dashboard`, `/api/coach` | Component, E2E, Manual | 点击宠物显示当前提醒；购物检查提示库存风险；AI coach 生成/兜底；完成任务后状态和 toast 变化 | DEV-041, DEV-060 | Done for MVP |
| PRD-014 购买防护 | `features/add-items`, `lib/purchase-guard` | Unit, Component, E2E | 重复/过量物品触发宠物阻止；先处理不会添加；仍然添加可覆盖 | DEV-012, DEV-060 | Done for MVP |
| PRD-015 状态同步 | `features/dashboard`, `features/inventory`, `lib/storage`, `lib/ai` | Component, Manual | frozen 保留数量并改 freezer；AI plan 在 mission action 后移除 stale task；Dashboard empty state 区分无库存和 paused 库存 | DEV-070 | Done for MVP |

## 反向追踪

| 模块 | 覆盖需求 |
| --- | --- |
| `lib/recognition` | PRD-002, PRD-003, PRD-004 |
| `lib/storage` | PRD-001, PRD-004, PRD-007, PRD-010 |
| `lib/planning` | PRD-005, PRD-006 |
| `lib/ai` | PRD-006, PRD-015 |
| `lib/purchase-guard` | PRD-014 |
| `lib/pet-state` | PRD-008 |
| `lib/impact` | PRD-009 |
| `features/add-items` | PRD-001, PRD-002, PRD-003, PRD-004, PRD-014 |
| `features/inventory` | PRD-005, PRD-007 |
| `features/planning` | PRD-006, PRD-012 |
| `features/pet` | PRD-008, PRD-013, PRD-014 |
| `features/impact` | PRD-009 |
| `features/dashboard` | PRD-006, PRD-012, PRD-013, PRD-015 |

## 验收规则

- P0 需求必须至少有 unit 或 integration 测试，并有 E2E 或手动验收路径。
- P1 需求可以先用 component/manual 验收，但进入发布前必须有自动化覆盖。
- 任何需求状态变化都要同步更新本文件和 [TASK_BREAKDOWN.md](TASK_BREAKDOWN.md)。
