# 模块接口契约

本文件定义后续实现时应保持稳定的核心接口。字段应与 [../DATA_MODEL.md](../DATA_MODEL.md) 同步。

## Shared Types

以下类型用于补齐接口契约。实现时可以放在 `src/types/domain.ts` 或按模块拆分，但导出的公共形状应保持一致。

```ts
export type IsoDate = string;
export type IsoDateTime = string;

export type QuantityUnit =
  | "item"
  | "bag"
  | "box"
  | "bottle"
  | "can"
  | "g"
  | "kg"
  | "ml"
  | "l"
  | "serving"
  | "unknown";

export type RecognitionEvidence = {
  kind: "ocr_text" | "image_label" | "barcode" | "user_input";
  value: string;
  confidence?: number;
};

export type RecognitionWarning = {
  code:
    | "LOW_CONFIDENCE"
    | "POSSIBLE_NON_FOOD"
    | "DATE_NOT_FOUND"
    | "QUANTITY_NOT_FOUND"
    | "UNSUPPORTED_IMAGE"
    | "PROVIDER_UNAVAILABLE";
  message: string;
  recoverable: boolean;
};

export type InventoryItemDraft = {
  name: string;
  category: FoodCategory;
  quantity: number;
  unit: QuantityUnit;
  storageLocation: StorageLocation;
  purchaseDate?: IsoDate;
  suggestedUseByDate?: IsoDate;
  labelDate?: IsoDate;
  labelDateType?: LabelDateType;
  notes?: string;
};

export type InventoryItemPatch = Partial<
  Pick<
    InventoryItem,
    | "name"
    | "category"
    | "quantity"
    | "unit"
    | "storageLocation"
    | "purchaseDate"
    | "suggestedUseByDate"
    | "labelDate"
    | "labelDateType"
    | "status"
    | "notes"
  >
>;

export type FoodActionDraft = {
  itemId: string;
  type: FoodActionType;
  quantity: number;
  unit: QuantityUnit;
  occurredAt: IsoDateTime;
  note?: string;
};

export type UserPlanningPreferences = {
  maxTodayItems?: number;
  preferredPrepTimeMinutes?: number;
  hiddenCategories?: FoodCategory[];
};
```

## Recognition Adapter

```ts
export type ReceiptImageInput = {
  file: File;
  capturedAt: string;
};

export type FoodImageInput = {
  file: File;
  capturedAt: string;
};

export type ReceiptParseResult = {
  source: "receipt_ocr";
  candidates: RecognitionCandidate[];
  rawText?: string;
  warnings: RecognitionWarning[];
};

export type ImageClassificationResult = {
  source: "food_photo";
  candidates: RecognitionCandidate[];
  warnings: RecognitionWarning[];
};

export interface ReceiptRecognitionAdapter {
  parseReceipt(input: ReceiptImageInput): Promise<ReceiptParseResult>;
}

export interface FoodImageRecognitionAdapter {
  classifyImage(input: FoodImageInput): Promise<ImageClassificationResult>;
}
```

规则：

- Adapter 不直接写库存。
- Adapter 必须返回候选项，不能跳过用户确认。
- Adapter 错误不能泄露 API key 或原始服务错误中的敏感信息。

## Inventory Service

```ts
export interface InventoryService {
  listActive(): Promise<InventoryItem[]>;
  getById(id: string): Promise<InventoryItem | undefined>;
  addConfirmed(candidate: RecognitionCandidate, edits: InventoryItemDraft): Promise<InventoryItem>;
  addManual(draft: InventoryItemDraft): Promise<InventoryItem>;
  update(id: string, patch: InventoryItemPatch): Promise<InventoryItem>;
  recordAction(action: FoodActionDraft): Promise<FoodAction>;
  delete(id: string): Promise<void>;
}
```

规则：

- `addConfirmed` 只能接受 `accepted` 或 `edited` 候选项。
- 删除应优先软删除，保留行动历史。
- 行动记录不可覆盖，只追加。

## Planning Engine

```ts
export type PlanningInput = {
  items: InventoryItem[];
  actions: FoodAction[];
  today: string;
  preferences?: UserPlanningPreferences;
};

export type PlanningOutput = {
  today: PlanItem[];
  week: PlanItem[];
  review: PlanItem[];
};

export function generatePlan(input: PlanningInput): PlanningOutput;
```

规则：

- `generatePlan` 必须是纯函数。
- 不读写 storage。
- 不依赖当前系统时间，必须由调用方传入 `today`。
- 每个 `PlanItem` 必须包含 `explanation`。

## Pet State Engine

```ts
export type PetStateInput = {
  current: PetState;
  items: InventoryItem[];
  actions: FoodAction[];
  today: string;
};

export function calculatePetState(input: PetStateInput): PetState;
```

规则：

- 必须 clamp 所有数值到 `0-100`。
- 不应产生不可逆失败状态。
- 无高风险物品时，不因用户没行动而惩罚。

## Impact Engine

```ts
export type ImpactMetrics = {
  savedItemCount: number;
  discardedItemCount: number;
  frozenItemCount: number;
  sharedItemCount: number;
  estimatedSavedWeightGrams?: number;
  streakDays: number;
};

export function calculateImpact(input: {
  items: InventoryItem[];
  actions: FoodAction[];
  pet: PetState;
}): ImpactMetrics;
```

规则：

- MVP 可用粗略估算，但 UI 必须标明是估算。
- 不要把丢弃隐藏；丢弃数据对产品改进有价值。
