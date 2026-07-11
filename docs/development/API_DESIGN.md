# API 设计预案

MVP 可以无后端运行。本文件定义后续需要服务端时的 API 形状。

## 原则

- 前端领域模型不应依赖某个 OCR provider。
- 图片上传必须有大小和类型限制。
- API 不保存不必要的原始图片。
- 所有外部 provider 错误都要转换成产品可处理的错误码。

## Endpoint 草案

### `POST /api/recognition/receipt`

用途：解析小票图片。

请求：

```http
Content-Type: multipart/form-data
file=<image>
```

响应：

```json
{
  "source": "receipt_ocr",
  "candidates": [],
  "rawText": "...",
  "warnings": []
}
```

### `POST /api/recognition/food-photo`

用途：识别食物照片。

响应：

```json
{
  "source": "food_photo",
  "candidates": [],
  "warnings": []
}
```

### `GET /api/products/search?q=spinach`

用途：查询商品或食物数据。

响应：

```json
{
  "results": [
    {
      "name": "Spinach",
      "category": "produce",
      "source": "usda_fdc",
      "externalId": "..."
    }
  ]
}
```

### `GET /api/products/barcode/:barcode`

用途：条码查询。

响应：

```json
{
  "barcode": "1234567890123",
  "name": "Example Product",
  "brand": "Example",
  "category": "pantry",
  "source": "open_food_facts"
}
```

## 错误格式

```json
{
  "error": {
    "code": "OCR_LOW_CONFIDENCE",
    "message": "We could not read this receipt clearly.",
    "recoverable": true
  }
}
```

错误码：

- `UNSUPPORTED_FILE_TYPE`
- `FILE_TOO_LARGE`
- `OCR_PROVIDER_UNAVAILABLE`
- `OCR_LOW_CONFIDENCE`
- `PRODUCT_NOT_FOUND`
- `RATE_LIMITED`
- `UNKNOWN_ERROR`

## 文件限制

建议初始限制：

- 图片类型：JPEG, PNG, WebP
- 最大大小：8 MB
- 最大边长：4096 px

## 安全

- 服务端校验 MIME 和文件头。
- 不信任前端传来的文件名。
- 不把原始图片写入长期日志。
- 对 OCR endpoint 加速率限制。
