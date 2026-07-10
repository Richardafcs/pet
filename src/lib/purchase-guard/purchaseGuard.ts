import type {
  FoodCategory,
  InventoryItem,
  InventoryItemDraft,
  PurchaseGuardResult,
} from "../../types/domain";

const highRiskCategories = new Set<FoodCategory>([
  "produce",
  "dairy",
  "meat",
  "seafood",
  "prepared",
]);

function normalizeName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(fresh|organic|org|large|small)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isSameFoodName(left: string, right: string): boolean {
  const a = normalizeName(left);
  const b = normalizeName(right);
  if (!a || !b) return false;
  return a === b || a.includes(b) || b.includes(a);
}

export function evaluatePurchaseGuard(input: {
  draft: InventoryItemDraft;
  activeItems: InventoryItem[];
}): PurchaseGuardResult {
  const duplicateItems = input.activeItems.filter((item) =>
    isSameFoodName(item.name, input.draft.name),
  );
  const duplicateQuantity =
    duplicateItems.reduce((total, item) => total + item.quantity, 0) +
    input.draft.quantity;

  if (duplicateItems.length > 0 && duplicateQuantity >= 2) {
    const first = duplicateItems[0];
    return {
      blocked: true,
      reasonCode: "DUPLICATE_ACTIVE_ITEM",
      existingItemIds: duplicateItems.map((item) => item.id),
      suggestedAction:
        first.category === "meat" || first.category === "seafood"
          ? "freeze_existing"
          : "use_existing",
      message: `Hold on. We already have ${duplicateItems
        .map((item) => `${item.quantity} ${item.unit} ${item.name}`)
        .join(", ")} in inventory. Try using or freezing what we have before adding more.`,
    };
  }

  if (highRiskCategories.has(input.draft.category)) {
    const sameCategoryItems = input.activeItems.filter(
      (item) => item.category === input.draft.category,
    );
    const categoryQuantity =
      sameCategoryItems.reduce((total, item) => total + item.quantity, 0) +
      input.draft.quantity;
    if (sameCategoryItems.length >= 3 || categoryQuantity >= 8) {
      return {
        blocked: true,
        reasonCode: "TOO_MUCH_HIGH_RISK_CATEGORY",
        existingItemIds: sameCategoryItems.map((item) => item.id),
        suggestedAction: "review_inventory",
        message: `Wait a second. We already have several ${input.draft.category} items waiting. Review the inventory before adding more.`,
      };
    }
  }

  return { blocked: false };
}
