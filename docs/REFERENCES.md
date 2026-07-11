# 参考资料

本项目参考资料分为减浪费原则、食品日期和储存、数据/API、OCR，以及行为和游戏化设计。以下资料用于指导产品设计，不代表项目提供食品安全判断。

## 减少食物浪费原则

### EPA Wasted Food Scale

来源：[EPA Wasted Food Scale](https://www.epa.gov/sustainable-management-food/wasted-food-scale)

要点：

- EPA 将防止和转移食物浪费的路径按优先级排序。
- 更优先的路径包括预防浪费、捐赠和 upcycle。
- 填埋、焚烧和倒入下水道是较低优先级路径。

对本项目的启发：

- 计划算法应优先“预防浪费”和“食用/分享”，而不是只在丢弃后统计。
- 行动按钮应把 `used`、`frozen`、`shared` 放在 `discarded` 前。

### ReFED Insights Engine

来源：[ReFED Insights Engine](https://insights.refed.org/) 和 [ReFED Data and Insights](https://refed.org/our-work/data-and-insights)

要点：

- ReFED 提供美国食物浪费数据、原因、影响和解决方案分析。
- Insights Engine 包含 Food Waste Monitor、Solutions Database、Impact Calculator 等工具。

对本项目的启发：

- Impact 页面可以先做轻量估算，后续再参考更完整的影响模型。
- 产品叙事应强调“预防 + 行为改变 + 可衡量影响”。

## 日期标签和储存建议

### FoodKeeper

来源：[FoodKeeper App | FoodSafety.gov](https://www.foodsafety.gov/keep-food-safe/foodkeeper-app) 和 [FSIS FoodKeeper Data | data.gov](https://catalog.data.gov/dataset/fsis-foodkeeper-data)

要点：

- FoodKeeper 帮助用户理解食品和饮料储存，目标是最大化新鲜度和质量。
- FoodKeeper 由 USDA FSIS 与 Cornell University、Food Marketing Institute 开发。
- FoodKeeper 数据可作为储存建议的参考来源。

对本项目的启发：

- 使用 `suggestedUseByDate` 表达“建议优先使用日期”，不要默认叫 `expirationDate`。
- 储存位置必须进入算法，因为冷藏、冷冻和室温影响完全不同。

### FDA/USDA Date Labeling

来源：[USDA-FDA Seek Information About Food Date Labeling](https://www.fda.gov/news-events/press-announcements/usda-fda-seek-information-about-food-date-labeling-aim-provide-further-clarity-transparency-and-cost)

要点：

- FDA 和 USDA 推荐行业自愿使用 “Best if Used By” 作为质量型日期标签。
- 该日期表示质量可能下降，但产品仍可能可以食用。
- “Sell By” 或 “Use By”等标签可能仍存在，前提是真实且不误导。

对本项目的启发：

- UI 必须解释日期标签的含义。
- 不应把所有日期标签都解释成食品安全截止。
- 识别到日期标签时要保存 `labelDateType`。

## 商品和食品数据 API

### Open Food Facts

来源：[Open Food Facts API documentation](https://openfoodfacts.github.io/openfoodfacts-server/api/)

要点：

- Open Food Facts 是开放食品产品数据库。
- API 可根据条码获取包装食品信息，例如配料和营养信息。

对本项目的启发：

- 后续条码扫描可用于补充商品名称、品牌、包装信息。
- Open Food Facts 适合包装食品，不适合所有散装生鲜。

### USDA FoodData Central

来源：[FoodData Central API Guide](https://fdc.nal.usda.gov/api-guide) 和 [FoodData Central](https://fdc.nal.usda.gov/)

要点：

- FoodData Central 提供食品数据 API。
- 数据可用于食品搜索、分类和营养相关信息。
- FoodData Central 数据处于 public domain，并建议注明来源。

对本项目的启发：

- 可用于食物名称标准化和类别匹配。
- 不应把营养数据作为 MVP 必需功能。

## OCR 和收据解析

### Google Cloud Vision OCR

来源：[Cloud Vision OCR documentation](https://docs.cloud.google.com/vision/docs/ocr)

要点：

- Cloud Vision API 支持从图片中进行文字检测和文档文字检测。
- 适合通用 OCR，但小票结构化解析仍需要后处理。

对本项目的启发：

- 可作为真实 OCR adapter 的候选。
- 仍需要 receipt line parser 和用户确认。

### Amazon Textract AnalyzeExpense

来源：[Analyzing Invoices and Receipts with Amazon Textract](https://docs.aws.amazon.com/textract/latest/dg/analyzing-document-expense.html)

要点：

- Amazon Textract 的 AnalyzeExpense 面向发票和收据。
- 可返回结构化 JSON。
- 支持同步和异步处理。

对本项目的启发：

- 如果重点是小票解析，Textract 比纯 OCR 更贴近收据场景。
- 真实接入需要服务端保护凭据，并处理文件大小、格式和区域限制。

## 行为和游戏化设计

产品设计参考方向：

- 降低记录成本比复杂统计更重要。
- 用户必须能修正系统识别，避免自动化错误破坏信任。
- 游戏化反馈应鼓励补救行动，不能羞辱用户。
- 连续完成、宠物成长和即时反馈适合作为轻量激励。

后续可继续补充学术研究：

- 家庭食物浪费行为干预。
- meal planning、shopping list、inventory visibility 对浪费的影响。
- 游戏化在可持续行为中的长期留存效果。

## 设计决策映射

| 设计决策 | 参考来源 |
| --- | --- |
| 优先预防浪费、食用和分享 | EPA Wasted Food Scale |
| 使用 `suggestedUseByDate` 而非简单 `expirationDate` | FoodKeeper, FDA/USDA date labeling |
| 对识别结果做人工确认 | OCR/receipt parsing 的不确定性 |
| 保留置信度 | AI/OCR 结果不稳定 |
| 将宠物设计为温和反馈 | 行为改变和长期留存考虑 |
| MVP 先 mock OCR | hackathon 风险控制 |
