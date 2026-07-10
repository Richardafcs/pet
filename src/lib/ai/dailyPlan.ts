import type { InventoryItem, MissionCard, PetState, QuantityUnit } from "../../types/domain";

export type AiDailyPlanRequest = {
  activeItems: Array<
    Pick<
      InventoryItem,
      | "id"
      | "name"
      | "category"
      | "quantity"
      | "unit"
      | "storageLocation"
      | "suggestedUseByDate"
      | "notes"
    >
  >;
  missions: Array<
    Pick<
      MissionCard,
      "itemId" | "itemName" | "reason" | "suggestedAction" | "urgencyLabel"
    >
  >;
  pet: Pick<PetState, "health" | "mood" | "energy" | "trust" | "visualState">;
  today: string;
};

export type AiUsageTask = {
  id: string;
  itemId: string;
  itemName: string;
  actionLabel: string;
  quantity: number;
  unit: QuantityUnit;
  note: string;
};

export type AiRecipe = {
  id: string;
  title: string;
  usesItemIds: string[];
  timeMinutes: number;
  steps: string[];
  expectedLeftovers: string;
};

export type AiDailyPlanResponse = {
  petLine: string;
  planSummary: string;
  recipes: AiRecipe[];
  usageTasks: AiUsageTask[];
  provider: "google" | "openai" | "rules";
  model: string;
};

export type AiDailyPlanError = {
  error: string;
  detail?: string;
  missingApiKey?: boolean;
};

export const aiDailyPlanJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["petLine", "planSummary", "recipes", "usageTasks"],
  properties: {
    petLine: { type: "string" },
    planSummary: { type: "string" },
    recipes: {
      type: "array",
      minItems: 1,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "title", "usesItemIds", "timeMinutes", "steps", "expectedLeftovers"],
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          usesItemIds: {
            type: "array",
            minItems: 1,
            maxItems: 6,
            items: { type: "string" },
          },
          timeMinutes: { type: "number", minimum: 1, maximum: 120 },
          steps: {
            type: "array",
            minItems: 2,
            maxItems: 6,
            items: { type: "string" },
          },
          expectedLeftovers: { type: "string" },
        },
      },
    },
    usageTasks: {
      type: "array",
      minItems: 1,
      maxItems: 6,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "itemId", "itemName", "actionLabel", "quantity", "unit", "note"],
        properties: {
          id: { type: "string" },
          itemId: { type: "string" },
          itemName: { type: "string" },
          actionLabel: { type: "string" },
          quantity: { type: "number", minimum: 0 },
          unit: {
            type: "string",
            enum: ["item", "bag", "box", "bottle", "can", "g", "kg", "ml", "l", "serving", "unknown"],
          },
          note: { type: "string" },
        },
      },
    },
  },
} as const;

export function normalizeDailyPlanResponse(
  response: AiDailyPlanResponse,
  activeItems: InventoryItem[],
): AiDailyPlanResponse {
  const itemById = new Map(activeItems.map((item) => [item.id, item]));
  const usageTasks = response.usageTasks
    .map((task): AiUsageTask | undefined => {
      const item = itemById.get(task.itemId);
      if (!item) return undefined;
      const quantity = normalizeTaskQuantity(task.quantity, item.quantity);
      return {
        ...task,
        itemName: item.name,
        quantity,
        unit: item.unit,
      };
    })
    .filter((task): task is AiUsageTask => Boolean(task));
  const recipes = response.recipes
    .map((recipe): AiRecipe => ({
      ...recipe,
      usesItemIds: recipe.usesItemIds.filter((itemId) => itemById.has(itemId)),
      timeMinutes: Math.max(1, Math.round(recipe.timeMinutes)),
      steps: recipe.steps.filter((step) => step.trim()).slice(0, 6),
    }))
    .filter((recipe) => recipe.usesItemIds.length > 0 && recipe.steps.length > 0);

  return {
    ...response,
    recipes,
    usageTasks,
  };
}

function normalizeTaskQuantity(quantity: number, availableQuantity: number): number {
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return Math.min(1, availableQuantity);
  }
  return Math.min(quantity, availableQuantity);
}
