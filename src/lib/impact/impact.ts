import type { FoodAction, ImpactMetrics, InventoryItem, PetState } from "../../types/domain";

export function calculateImpact(input: {
  items: InventoryItem[];
  actions: FoodAction[];
  pet: PetState;
}): ImpactMetrics {
  const savedActions = input.actions.filter((action) =>
    ["used", "partially_used"].includes(action.type),
  );
  const frozenActions = input.actions.filter((action) => action.type === "frozen");
  const sharedActions = input.actions.filter((action) => action.type === "shared");
  const discardedActions = input.actions.filter((action) => action.type === "discarded");

  return {
    savedItemCount: savedActions.length,
    discardedItemCount: discardedActions.length,
    frozenItemCount: frozenActions.length,
    sharedItemCount: sharedActions.length,
    estimatedSavedWeightGrams: savedActions.length * 250 + frozenActions.length * 200,
    streakDays: input.pet.streakDays,
  };
}
