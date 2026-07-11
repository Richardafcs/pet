# 文档索引

本文档集用于指导 `pet` 后续产品设计、软件开发、测试和 hackathon 演示。

## 推荐阅读顺序

1. [PROJECT_SCOPE.md](PROJECT_SCOPE.md): 项目范围、目标和非目标。
2. [PRODUCT_PIVOT_AND_TOP3_PLAN.md](PRODUCT_PIVOT_AND_TOP3_PLAN.md): 针对 mentor 质疑的产品转向、改进方案、演示策略和前三名目标计划。
3. [PRODUCT_REQUIREMENTS.md](PRODUCT_REQUIREMENTS.md): 产品需求、用户故事、MVP 和成功指标。
4. [UX_FLOWS.md](UX_FLOWS.md): 页面、流程、关键交互和空状态。
5. [FRONTEND_EXPERIENCE_DESIGN.md](FRONTEND_EXPERIENCE_DESIGN.md): 前端视觉方向、任务卡和宠物互动。
6. [TECHNICAL_DESIGN.md](TECHNICAL_DESIGN.md): 架构、模块、技术栈和部署建议。
7. [DATA_MODEL.md](DATA_MODEL.md): 数据实体、状态枚举和示例记录。
8. [AI_AND_OCR_PIPELINE.md](AI_AND_OCR_PIPELINE.md): 小票 OCR、照片识别、商品匹配和人工确认。
9. [PLANNING_ALGORITHM.md](PLANNING_ALGORITHM.md): 物品优先级、使用计划和提醒规则。
10. [PET_STATE_AND_GAMIFICATION.md](PET_STATE_AND_GAMIFICATION.md): 宠物状态、积分、反馈和防挫败设计。
11. [STATE_INTERACTION_MODEL.md](STATE_INTERACTION_MODEL.md): 食物状态、任务状态、宠物状态和 AI plan 同步规则。
12. [TEST_PLAN.md](TEST_PLAN.md): 测试策略、用例和验收标准。
13. [DEVELOPMENT_ROADMAP.md](DEVELOPMENT_ROADMAP.md): hackathon 开发排期和分工建议。
14. [REFERENCES.md](REFERENCES.md): 外部资料、API 和研究参考。
15. [development/README.md](development/README.md): 完整开发手册和工程规范。

## 开发文档

- [development/GETTING_STARTED.md](development/GETTING_STARTED.md): 本地开发启动规范。
- [development/PROJECT_STRUCTURE.md](development/PROJECT_STRUCTURE.md): 推荐目录结构和模块边界。
- [development/CODING_STANDARDS.md](development/CODING_STANDARDS.md): TypeScript、React、样式和数据处理规范。
- [development/MODULE_CONTRACTS.md](development/MODULE_CONTRACTS.md): 核心模块接口契约。
- [development/STATE_AND_STORAGE.md](development/STATE_AND_STORAGE.md): 前端状态、IndexedDB 和数据迁移。
- [development/ENVIRONMENT.md](development/ENVIRONMENT.md): 环境变量和第三方服务配置。
- [development/API_DESIGN.md](development/API_DESIGN.md): 后端/API 设计预案。
- [development/TESTING_AND_CI.md](development/TESTING_AND_CI.md): 测试命令、测试覆盖和 CI。
- [development/DEPLOYMENT.md](development/DEPLOYMENT.md): 部署策略。
- [development/OBSERVABILITY.md](development/OBSERVABILITY.md): 日志、错误、指标和隐私边界。
- [development/SECURITY_AND_PRIVACY.md](development/SECURITY_AND_PRIVACY.md): 安全和隐私开发要求。
- [development/TASK_BREAKDOWN.md](development/TASK_BREAKDOWN.md): 可直接拆 issue 的开发任务。
- [development/REQUIREMENTS_TRACEABILITY.md](development/REQUIREMENTS_TRACEABILITY.md): 需求、模块、测试和任务追踪矩阵。
- [development/QUALITY_GATES.md](development/QUALITY_GATES.md): PR、主分支和发布质量门槛。
- [development/DEFINITION_OF_READY.md](development/DEFINITION_OF_READY.md): 任务进入开发前的准备标准。
- [development/DEFINITION_OF_DONE.md](development/DEFINITION_OF_DONE.md): 任务完成标准。
- [development/DEFECT_POLICY.md](development/DEFECT_POLICY.md): 缺陷分级和报告模板。
- [development/ENGINEERING_REVIEW.md](development/ENGINEERING_REVIEW.md): 软件工程复核报告。
- [development/ADR_TEMPLATE.md](development/ADR_TEMPLATE.md): 技术决策记录模板。

维护文档：

- [DOCUMENTATION_REVIEW.md](DOCUMENTATION_REVIEW.md): 文档复核记录。
- [REVIEW_CHECKLIST.md](REVIEW_CHECKLIST.md): 后续复核清单。

## 文档维护规则

- 需求、算法和测试标准必须互相对应。
- 每个核心功能都应至少有一个验收标准和一个测试用例。
- OCR、照片识别、建议使用日期推断都必须显示置信度，并允许用户确认或修正。
- 购买防护必须先解释原因，并允许用户二次确认覆盖。
- 食品安全相关文本必须谨慎，不能承诺“过期仍安全”或“未过期一定安全”。
- 如果后续实现和文档不一致，优先更新文档中的决策记录和测试计划。

## 当前文档状态

已完成产品和开发文档初稿，并已初始化可运行 MVP 前端。`docs/` 作为协作规范提交到仓库，帮助合作者理解产品定位、状态机、测试标准和部署策略。

后续代码变更应同步更新需求追踪、测试计划和开发任务状态。文档中的产品规则应和代码中的计划算法、宠物状态、购买防护、AI daily plan 同步保持一致。
