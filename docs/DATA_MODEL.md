# 数据模型

## 设计原则

- 区分识别候选和已确认库存。
- 每个自动推断字段都保留置信度。
- 日期字段必须明确含义，不能只叫 `expiryDate`。
- 行动历史不可直接覆盖，方便计算影响和宠物状态。

## 核心实体

### InventoryItem

```ts
type InventoryItem = {
  id: string;
  name: string;
  normalizedName?: string;
  category: FoodCategory;
  quantity: number;
  unit: QuantityUnit;
  storageLocation: StorageLocation;
  purchaseDate?: string;
  suggestedUseByDate?: string;
  labelDate?: string;
  labelDateType?: LabelDateType;
  openedDate?: string;
  source: ItemSource;
  confidence: ConfidenceMap;
  status: InventoryStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};
```

### RecognitionCandidate

```ts
type RecognitionCandidate = {
  id: string;
  sourceImageId?: string;
  rawText?: string;
  proposedName: string;
  proposedCategory?: FoodCategory;
  proposedQuantity?: number;
  proposedUnit?: QuantityUnit;
  proposedPurchaseDate?: string;
  proposedSuggestedUseByDate?: string;
  notes?: string;
  confidence: ConfidenceMap;
  evidence: RecognitionEvidence[];
  status: "pending" | "accepted" | "rejected" | "edited";
};
```

### FoodAction

```ts
type FoodAction = {
  id: string;
  itemId: string;
  type: FoodActionType;
  quantity: number;
  unit: QuantityUnit;
  occurredAt: string;
  note?: string;
};
```

### PlanItem

```ts
type PlanItem = {
  id: string;
  itemId: string;
  priorityScore: number;
  reasonCodes: PlanReasonCode[];
  explanation: string;
  suggestedAction: SuggestedAction;
  plannedFor: string;
  status: "open" | "done" | "skipped" | "expired";
};
```

### MissionCard

`MissionCard` 是 UI 派生模型，不应直接持久化。它由 `PlanItem`、`InventoryItem` 和宠物奖励规则组合生成。

```ts
type MissionCard = {
  id: string;
  planItemId: string;
  itemId: string;
  phaseLabel: string;
  title: string;
  itemName: string;
  reason: string;
  suggestedAction: string;
  rewardPreview: string;
  urgencyLabel: "Today" | "Soon" | "Review" | "Stable";
  primaryActionLabel: string;
  secondaryActionLabel?: string;
};
```

### PurchaseGuardResult

`PurchaseGuardResult` 是添加前的派生判断，不直接持久化。

```ts
type PurchaseGuardResult =
  | {
      blocked: false;
    }
  | {
      blocked: true;
      reasonCode: "DUPLICATE_ACTIVE_ITEM" | "TOO_MUCH_HIGH_RISK_CATEGORY";
      message: string;
      existingItemIds: string[];
      suggestedAction: "use_existing" | "freeze_existing" | "review_inventory";
    };
```

### PetState

```ts
type PetState = {
  id: string;
  health: number;
  mood: number;
  energy: number;
  trust: number;
  streakDays: number;
  stage: "egg" | "baby" | "grown";
  visualState: "happy" | "calm" | "hungry" | "tired" | "sad" | "sick";
  lastUpdatedAt: string;
};
```

## 枚举

### QuantityUnit

```ts
type QuantityUnit =
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
```

### FoodCategory

```ts
type FoodCategory =
  | "produce"
  | "dairy"
  | "meat"
  | "seafood"
  | "bakery"
  | "pantry"
  | "frozen"
  | "prepared"
  | "beverage"
  | "other";
```

### StorageLocation

```ts
type StorageLocation =
  | "fridge"
  | "freezer"
  | "pantry"
  | "counter"
  | "unknown";
```

### LabelDateType

```ts
type LabelDateType =
  | "best_if_used_by"
  | "use_by"
  | "sell_by"
  | "freeze_by"
  | "unknown";
```

### ItemSource

```ts
type ItemSource =
  | "manual"
  | "receipt_ocr"
  | "food_photo"
  | "barcode"
  | "demo_seed";
```

### InventoryStatus

```ts
type InventoryStatus =
  | "active"
  | "used"
  | "frozen"
  | "shared"
  | "discarded"
  | "deleted";
```

Status semantics:

- `active`: mission-ready food. It can appear in rule missions and AI daily plans.
- `frozen`: preserved food. It remains available inventory, keeps its quantity, and is paused from urgent missions.
- `used`, `shared`, `discarded`: terminal outcome states for planning. They remain useful for history and impact metrics.
- `deleted`: removed locally and hidden from normal workflows.

Use the `available` UI filter for `active + frozen`. Do not show frozen food as `use soon`; show it as paused/preserved.

### FoodActionType

```ts
type FoodActionType =
  | "used"
  | "partially_used"
  | "frozen"
  | "shared"
  | "discarded"
  | "date_adjusted"
  | "quantity_adjusted";
```

## ConfidenceMap

```ts
type ConfidenceMap = {
  name?: number;
  category?: number;
  quantity?: number;
  purchaseDate?: number;
  suggestedUseByDate?: number;
  storageLocation?: number;
};
```

## RecognitionEvidence

```ts
type RecognitionEvidence = {
  kind: "ocr_text" | "image_label" | "barcode" | "user_input";
  value: string;
  confidence?: number;
};
```

置信度范围：`0` 到 `1`。

UI 规则：

- `>= 0.8`: 默认选中，但仍可编辑。
- `0.5 - 0.79`: 显示“请确认”。
- `< 0.5`: 默认不加入库存，提示手动确认。

## 示例记录

```json
{
  "id": "item_001",
  "name": "Spinach",
  "category": "produce",
  "quantity": 1,
  "unit": "bag",
  "storageLocation": "fridge",
  "purchaseDate": "2026-07-10",
  "suggestedUseByDate": "2026-07-13",
  "source": "receipt_ocr",
  "confidence": {
    "name": 0.91,
    "category": 0.82,
    "purchaseDate": 0.95,
    "suggestedUseByDate": 0.62
  },
  "status": "active",
  "createdAt": "2026-07-10T10:00:00.000Z",
  "updatedAt": "2026-07-10T10:00:00.000Z"
}
```
