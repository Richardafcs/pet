import type { FoodActionType, InventoryItem } from "../../types/domain";

export type InventoryUsageResult = {
  item: InventoryItem;
  actionQuantity: number;
};

export function applyInventoryAction(
  item: InventoryItem,
  type: FoodActionType,
  requestedQuantity = item.quantity,
): InventoryUsageResult {
  const actionQuantity = normalizeActionQuantity(requestedQuantity, item.quantity);
  const now = new Date().toISOString();

  if (type === "partially_used") {
    const remainingQuantity = Math.max(0, item.quantity - actionQuantity);
    return {
      actionQuantity,
      item: {
        ...item,
        quantity: remainingQuantity,
        status: remainingQuantity > 0 ? "active" : "used",
        updatedAt: now,
      },
    };
  }

  return {
    actionQuantity,
    item: {
      ...item,
      status:
        type === "used"
          ? "used"
          : type === "frozen"
            ? "frozen"
            : type === "shared"
              ? "shared"
              : type === "discarded"
                ? "discarded"
                : item.status,
      storageLocation: type === "frozen" ? "freezer" : item.storageLocation,
      updatedAt: now,
    },
  };
}

function normalizeActionQuantity(requestedQuantity: number, availableQuantity: number): number {
  if (!Number.isFinite(requestedQuantity) || requestedQuantity <= 0) {
    return availableQuantity;
  }
  return Math.min(requestedQuantity, availableQuantity);
}
