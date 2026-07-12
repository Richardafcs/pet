# 开发文档总览

本目录是 `EcoPaw` 后续开发的工程手册。产品需求和算法说明在上级 `docs/` 中，本目录关注“如何把它实现出来”。

## 阅读顺序

1. [GETTING_STARTED.md](GETTING_STARTED.md): 本地开发启动规范。
2. [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md): 推荐目录结构和模块边界。
3. [CODING_STANDARDS.md](CODING_STANDARDS.md): TypeScript、React、样式和数据处理规范。
4. [MODULE_CONTRACTS.md](MODULE_CONTRACTS.md): 核心模块接口契约。
5. [STATE_AND_STORAGE.md](STATE_AND_STORAGE.md): 前端状态、Zustand persist、派生数据和后续 IndexedDB 迁移。
6. [ENVIRONMENT.md](ENVIRONMENT.md): 环境变量和第三方服务配置。
7. [API_DESIGN.md](API_DESIGN.md): 后端/API 设计预案。
8. [TESTING_AND_CI.md](TESTING_AND_CI.md): 测试命令、测试覆盖和 CI。
9. [DEPLOYMENT.md](DEPLOYMENT.md): 部署策略。
10. [OBSERVABILITY.md](OBSERVABILITY.md): 日志、错误、指标和隐私边界。
11. [SECURITY_AND_PRIVACY.md](SECURITY_AND_PRIVACY.md): 安全和隐私开发要求。
12. [TASK_BREAKDOWN.md](TASK_BREAKDOWN.md): 可直接拆 issue 的开发任务。
13. [REQUIREMENTS_TRACEABILITY.md](REQUIREMENTS_TRACEABILITY.md): 需求、模块、测试和任务追踪矩阵。
14. [QUALITY_GATES.md](QUALITY_GATES.md): PR、主分支和发布质量门槛。
15. [DEFINITION_OF_READY.md](DEFINITION_OF_READY.md): 任务进入开发前的准备标准。
16. [DEFINITION_OF_DONE.md](DEFINITION_OF_DONE.md): 任务完成标准。
17. [DEFECT_POLICY.md](DEFECT_POLICY.md): 缺陷分级和报告模板。
18. [ENGINEERING_REVIEW.md](ENGINEERING_REVIEW.md): 软件工程复核报告。
19. [ADR_TEMPLATE.md](ADR_TEMPLATE.md): 技术决策记录模板。

## 开发原则

- 先实现可演示闭环，再接入真实 OCR 和后端。
- 所有自动识别结果必须可编辑、可拒绝、可追溯来源。
- 计划算法和宠物状态必须是纯函数，便于测试。
- 食品安全相关文案必须保守，不输出确定性安全判断。
- 小票和图片属于敏感输入，默认本地处理；如果上传外部服务，必须明确告知用户。

## 当前推荐技术路线

MVP 推荐：

- Vite + React + TypeScript
- CSS modules/global CSS for fast MVP styling
- Zustand 或 React state
- Zustand persist / localStorage for public MVP
- Zod where schema validation is useful
- Vitest unit/component tests for core flows

如果团队偏 Next.js，也可以使用 Next.js，但必须保持核心领域逻辑与框架解耦。
