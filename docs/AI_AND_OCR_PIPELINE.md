# AI 和 OCR 流程

## 目标

把小票和食物照片转成可编辑的候选库存项。系统不应直接把识别结果当成事实，必须经过用户确认。

## 小票识别流程

```text
Receipt image
  -> image validation
  -> OCR text extraction
  -> receipt line segmentation
  -> non-food line filtering
  -> item normalization
  -> category matching
  -> purchase date extraction
  -> shelf-life suggestion
  -> user confirmation
  -> inventory
```

## 小票解析字段

候选字段：

- 商店名
- 购买日期
- 原始行文本
- 商品名称
- 数量
- 单位
- 包装规格或购买件数说明
- 单价或总价
- 类别
- 是否可能是非食物
- 置信度

## 小票解析难点

- 商品名缩写，例如 `ORG SPINACH 5OZ`。
- 折扣、税费、付款行混入商品行。
- 一张小票内有非食品、清洁用品或餐具。
- 购买日期可能不在同一位置。
- 多语言、低光照、折痕或倾斜。

## 照片识别流程

```text
Food image
  -> image validation
  -> object detection or classification
  -> candidate food labels
  -> category mapping
  -> freshness/date question
  -> user confirmation
  -> inventory
```

## MVP 策略

MVP 不依赖真实 AI 服务也可以完成演示：

- 准备 2 到 3 张演示小票图片。
- 使用 mock OCR 返回固定候选项，候选项可编辑、拒绝、单项确认或批量确认。
- 准备 2 到 3 张食物照片。
- 使用 mock classifier 返回固定候选项，并复用同一套候选确认和购买防护流程。
- UI 保持真实确认流程。候选项必须经过用户确认才能进入库存。

这样可以先验证产品闭环。当前实现也提供 `AI image recognition` 入口：配置服务端 Google AI Studio 的 `GOOGLE_AI_API_KEY` 后，本地 `/api/recognize` 会调用 Gemini vision-capable model，把真实小票或食物照片转成同一套候选项结构；未配置 key 时 UI 会提示使用 mock demo。`OPENAI_API_KEY` 作为可选 fallback 保留。

## OpenAI 识别模式

本地开发服务器提供：

```text
POST /api/recognize
```

输入：

- `mode`: `receipt` 或 `photo`
- `imageDataUrl`: 浏览器读取的图片 data URL
- `today`: 当前日期，用于建议日期推断

输出：

- `candidates`: `RecognitionCandidate[]`
- `provider`: `google` 或 `openai`
- `model`: 当前 `GOOGLE_AI_MODEL` 或 `OPENAI_MODEL`

安全规则：

- `GOOGLE_AI_API_KEY` 和 `OPENAI_API_KEY` 只允许在服务端读取，不能使用 `VITE_` 前缀。
- AI 输出仍必须经过用户确认，不能直接进入库存。
- 建议使用日期只是计划提示，不是食品安全保证。
- mock 识别必须保留，作为 hackathon 现场无网或无 key 的稳定路径。

## 图片上传体验

前端支持两种上传方式：

- 点击选择本地图片。
- 把图片拖拽到 `AI image recognition` 上传区。

支持的图片类型：

- 小票照片：最适合识别商品名称、数量和购买日期。
- 单个食物照片：适合识别明显可见的食物类别和粗略数量。
- 一堆食物照片：可返回多个候选项，但需要用户逐项确认。
- 冰箱内部或食品柜照片：适合快速盘点可见物品，但 AI 可能漏掉隐藏、堆叠、遮挡或裁切严重的食物。

UI 必须提醒用户：照片识别结果是不完整候选，不是事实清单；确认前不能进入库存。

## 数量和单位规则

识别结果必须区分“购买件数”和“包装规格”：

- `Coles Full Cream Milk 3L` -> `quantity=3`, `unit=l`。
- `Pork Mince 500g` -> `quantity=500`, `unit=g`。
- `Beef Mince 500g 2 at $7.50 each` -> `quantity=2`, `unit=item`，`notes=500g each`。
- 如果商品名同时包含购买件数和包装规格，优先把实际购买件数放入 `quantity/unit`，把包装规格写进 notes。

前端候选卡必须允许用户编辑 quantity、unit 和 notes，因为收据 OCR 很容易把 `3L`、`500g`、`2 at ... each` 混淆。

## 增强版服务选项

### OCR

- Google Cloud Vision text detection: 适合通用图片文字识别。
- Amazon Textract AnalyzeExpense: 面向收据和发票字段抽取。
- Tesseract.js: 可本地运行，但对复杂小票稳定性有限。

### 商品数据

- Open Food Facts: 可通过条码或搜索获取包装食品信息。
- USDA FoodData Central: 可查询食品基础数据和类别。
- FoodKeeper: 可作为储存期建议的参考思路。

## 置信度处理

每个候选字段都应有置信度。计划引擎只使用已确认库存。

推荐 UI：

- 高置信字段正常显示。
- 中置信字段加“请确认”标签。
- 低置信字段显示为空或要求用户选择。

## 建议使用日期推断

建议使用日期推断输入：

- 商品类别。
- 购买日期。
- 储存位置。
- 包装状态。
- 标签日期。
- 用户确认的新鲜程度。

输出：

- `suggestedUseByDate`
- `confidence`
- `explanation`

示例解释：

```text
Leafy greens are high-priority produce. This suggestion assumes refrigerated storage.
```

## 食品安全边界

文案必须避免：

- “这个食物一定安全”
- “过了这个日期就必须丢弃”
- “未过期就一定能吃”

推荐文案：

- “建议优先使用”
- “请结合气味、外观、包装和储存情况判断”
- “如果不确定安全性，请遵循当地食品安全建议”

## 测试样本

MVP 应准备：

- 清晰小票。
- 模糊小票。
- 含非食品的小票。
- 单个食物照片。
- 多个食物照片。
- 无法识别的照片。

每个样本都应有期望候选输出，方便回归测试。
