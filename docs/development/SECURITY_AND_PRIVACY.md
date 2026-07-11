# 安全和隐私

## 数据敏感性

小票和照片可能包含：

- 门店位置。
- 购物时间。
- 会员号。
- 付款卡号后四位。
- 家庭饮食习惯。
- 冰箱或居住环境照片。

因此默认策略是本地优先、少保存、可删除。

## MVP 隐私规则

- 默认不上传图片到外部服务。
- 使用 mock OCR 时明确说明是演示识别。
- 不在日志中输出小票全文。
- 提供清除本地数据入口。
- 识别结果加入库存前必须经用户确认。

## 真实 OCR 模式

如果启用真实 OCR：

- 上传前显示说明：图片会发送到第三方服务。
- 服务端保存密钥，前端不暴露密钥。
- 设置文件大小限制。
- 设置速率限制。
- 不长期保存原图，除非用户明确选择。

## 前端安全

- 不渲染未经转义的 OCR 文本为 HTML。
- 不使用 `dangerouslySetInnerHTML` 展示识别文本。
- 文件上传校验类型和大小。
- 对外部 API 返回值做 schema validation。

## 后端安全

如果加入 API：

- 校验 MIME 和 magic bytes。
- 限制请求体大小。
- 对 OCR endpoint 加 rate limit。
- 错误信息脱敏。
- 日志中只保留错误码和请求 id。

## 食品安全边界

项目只提供计划辅助，不提供食品安全判断。

UI 必须包含：

```text
Dates and suggestions are planning aids. Check smell, appearance, packaging, storage conditions, and local food safety guidance before eating.
```

中文：

```text
日期和建议仅用于规划。食用前请结合气味、外观、包装、储存条件和当地食品安全建议判断。
```
