# 技术设计

## 推荐架构

MVP 可采用前端优先架构：

```text
Browser
  ├── React UI
  ├── Local state
  ├── Zustand persist / localStorage persistence
  ├── Mock OCR and image recognition
  └── Planning and pet-state engine

Optional API
  ├── OCR provider adapter
  ├── Product database adapter
  └── Sync or sharing service
```

## 技术栈建议

### 快速 MVP

- Vite + React + TypeScript
- CSS modules/global CSS for fast MVP styling
- Zustand persist for local demo storage
- Zod for validation where schema checks are needed
- Local tests retained in the full workspace; public MVP repo currently keeps only typecheck/lint/build scripts

### 可扩展版本

- Next.js + TypeScript
- Server actions or API routes
- PostgreSQL or SQLite
- Object storage for images
- Background jobs for OCR
- Authentication for shared households

## 模块边界

```text
src/
  app/
    routes and page composition
  components/
    reusable UI components
  features/
    add-items/
    inventory/
    planning/
    pet/
    impact/
  lib/
    storage/
    recognition/
    planning/
    pet-state/
    dates/
    validation/
  data/
    seed demo data
```

## 核心模块

### Recognition

职责：

- 接收图片或小票文本。
- 输出候选物品。
- 给字段添加置信度。
- 保留原始证据，方便用户确认。

### Inventory

职责：

- 保存已确认物品。
- 更新数量、状态和储存位置。
- 记录物品行动历史。

### Planning

职责：

- 根据临期程度、类别、数量和用户偏好排序。
- 生成今日和本周计划。
- 解释推荐原因。

### Pet State

职责：

- 根据用户行动和库存风险计算状态。
- 输出状态标签、数值和动画状态。
- 避免惩罚过重导致用户放弃。

### Impact

职责：

- 统计已使用、冷冻、分享/捐赠和丢弃。
- 估算避免浪费数量。
- 生成演示用可视化指标。

## 数据流

```text
Upload image
  -> Recognition adapter
  -> Candidate items
  -> User confirmation
  -> Inventory items
  -> Planning engine
  -> Action completion
  -> Pet state update
  -> Impact metrics
```

## 存储策略

MVP：

- 当前实现使用 Zustand persist 保存库存、行动和宠物状态。
- Today missions、risk labels、AI daily plan 和 impact metrics 都是派生数据，不作为 source of truth 持久化。
- 图片默认不持久化，或只保存本地 object URL/session preview。
- Demo 数据可以用 JSON seed。

后续：

- 若需要更复杂查询、迁移或大数据量，可迁移到 IndexedDB/Dexie。
- 用户账户和多设备同步需要后端。
- 上传图片应有自动删除策略。
- 小票原图和识别文本要允许用户删除。

## 外部服务适配

使用 adapter pattern，避免 UI 依赖具体服务：

```ts
interface ReceiptRecognitionAdapter {
  parseReceipt(input: ReceiptImageInput): Promise<ReceiptParseResult>;
}

interface FoodImageRecognitionAdapter {
  classifyImage(input: FoodImageInput): Promise<ImageClassificationResult>;
}

interface ProductLookupAdapter {
  lookup(query: ProductLookupQuery): Promise<ProductLookupResult[]>;
}
```

MVP 可以先实现：

- `MockReceiptRecognitionAdapter`
- `MockFoodImageRecognitionAdapter`
- `StaticShelfLifeAdapter`

## 隐私设计

- 明确提示小票可能包含个人信息。
- 默认本地处理演示数据。
- 如果调用第三方 OCR，要在 UI 中说明图片将被发送到外部服务。
- 不在日志中保存原始图片、完整小票文本或用户标识。
- 允许用户删除所有本地数据。

## 错误处理

关键错误状态：

- 上传文件格式不支持。
- 图片太大。
- OCR 无法识别。
- 识别结果置信度低。
- 日期无法推断。
- 本地存储不可用。

每个错误必须提供下一步：

- 重试。
- 手动添加。
- 使用演示数据。
- 删除图片。

## 部署建议

Hackathon 最快路径：

- 静态前端部署到 Vercel、Netlify、Cloudflare Pages 或 GitHub Pages。
- 识别模块先 mock，不依赖服务密钥。

增强版：

- API 部署到 serverless 平台。
- OCR 密钥只保存在服务端。
- 增加速率限制和文件大小限制。
