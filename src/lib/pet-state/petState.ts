import type { FoodAction, InventoryItem, PetState } from "../../types/domain";
import { getRiskLevel } from "../planning/planning";

type PetStateInput = {
  current: PetState;
  items: InventoryItem[];
  actions: FoodAction[];
  today: string;
};

const actionEffects: Record<
  FoodAction["type"],
  Partial<Pick<PetState, "health" | "mood" | "energy" | "trust">>
> = {
  used: { health: 6, mood: 8, energy: 4, trust: 4 },
  partially_used: { health: 3, mood: 4, energy: 2, trust: 2 },
  frozen: { health: 5, mood: 4, energy: 8, trust: 3 },
  shared: { health: 4, mood: 10, energy: 2, trust: 6 },
  discarded: { health: -4, mood: -5, energy: -2 },
  date_adjusted: { mood: 1, trust: 2 },
  quantity_adjusted: { trust: 1 },
};

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function getVisualState(
  state: Pick<PetState, "health" | "mood" | "energy">,
  hasHighRiskItems: boolean,
): PetState["visualState"] {
  const average = (state.health + state.mood + state.energy) / 3;
  if (state.health < 35) return "sick";
  if (state.mood < 40) return "sad";
  if (state.energy < 40) return "tired";
  if (hasHighRiskItems) return "hungry";
  if (average >= 80) return "happy";
  return "calm";
}

export function calculatePetState(input: PetStateInput): PetState {
  const actionsToday = input.actions.filter((action) =>
    action.occurredAt.startsWith(input.today),
  );
  const highRiskItems = input.items.filter((item) => {
    const risk = getRiskLevel(item, input.today);
    return (
      item.status === "active" &&
      (risk === "past_suggested_date" || risk === "use_today")
    );
  });

  let health = input.current.health;
  let mood = input.current.mood;
  let energy = input.current.energy;
  let trust = input.current.trust;

  for (const action of actionsToday) {
    const effect = actionEffects[action.type];
    health += effect.health ?? 0;
    mood += effect.mood ?? 0;
    energy += effect.energy ?? 0;
    trust += effect.trust ?? 0;
  }

  if (highRiskItems.length > 0 && actionsToday.length === 0) {
    mood -= 4;
    energy -= 3;
    trust -= 1;
  }

  const pastSuggestedCount = highRiskItems.filter(
    (item) => getRiskLevel(item, input.today) === "past_suggested_date",
  ).length;
  if (pastSuggestedCount > 0) {
    health -= Math.min(pastSuggestedCount * 2, 8);
  }

  const completedPlanToday = actionsToday.some((action) =>
    ["used", "partially_used", "frozen", "shared"].includes(action.type),
  );
  const nextStreak = completedPlanToday
    ? input.current.streakDays + 1
    : highRiskItems.length === 0
      ? input.current.streakDays
      : 0;

  const next = {
    ...input.current,
    health: clamp(health),
    mood: clamp(mood),
    energy: clamp(energy),
    trust: clamp(trust),
    streakDays: nextStreak,
    lastUpdatedAt: new Date().toISOString(),
  };

  return {
    ...next,
    visualState: getVisualState(next, highRiskItems.length > 0),
  };
}

export function initialPetState(now = new Date().toISOString()): PetState {
  return {
    id: "pet-main",
    health: 70,
    mood: 70,
    energy: 60,
    trust: 50,
    streakDays: 0,
    stage: "baby",
    visualState: "calm",
    lastUpdatedAt: now,
  };
}
