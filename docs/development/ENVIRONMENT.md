# 环境变量

MVP mock 模式不需要任何环境变量。

## 前端变量

如果使用 Vite，公开变量必须以 `VITE_` 开头。

```env
VITE_APP_MODE=demo
VITE_ENABLE_REAL_OCR=false
VITE_ENABLE_BARCODE_LOOKUP=false
```

注意：所有 `VITE_` 变量都会进入浏览器包，不能放密钥。

## 服务端变量

本地 AI 识别 API 默认使用 Google AI Studio / Gemini API key：

```env
GOOGLE_AI_API_KEY=
GOOGLE_AI_MODEL=gemini-1.5-flash
```

可选 OpenAI fallback：

```env
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
```

如果后续增加其他 OCR、商品或食品数据库服务：

```env
OCR_PROVIDER=openai
OPENFOODFACTS_USER_AGENT=
USDA_FDC_API_KEY=
```

规则：

- 密钥只在服务端使用。
- 不把密钥提交到 Git。
- `.env.example` 只放变量名和说明，不放真实值。
- 真实 OCR 默认关闭，除非本地显式启用。

## 模式

### demo

- 不调用外部服务。
- 使用 mock OCR 和 mock classifier。
- 适合 hackathon 展示。

### development

- 可选择调用本地 API。
- 可加载 fixtures。
- console 可输出非敏感调试信息。

### production

- 禁止输出小票全文。
- 上传图片前必须显示提示。
- 错误信息必须脱敏。

## `.env.example`

项目初始化后应创建：

```env
VITE_APP_MODE=demo
VITE_ENABLE_REAL_OCR=true
VITE_ENABLE_BARCODE_LOOKUP=false
GOOGLE_AI_API_KEY=
GOOGLE_AI_MODEL=gemini-1.5-flash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
```
