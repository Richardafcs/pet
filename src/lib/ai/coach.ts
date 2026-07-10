import type { InventoryItem, MissionCard, PetState } from "../../types/domain";

export type AiCoachRequest = {
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
      | "status"
    >
  >;
  missions: Array<
    Pick<
      MissionCard,
      | "title"
      | "itemName"
      | "reason"
      | "suggestedAction"
      | "rewardPreview"
      | "urgencyLabel"
    >
  >;
  pet: Pick<PetState, "health" | "mood" | "energy" | "trust" | "visualState">;
  today: string;
};

export type AiCoachResponse = {
  petLine: string;
  planSummary: string;
  suggestedActions: string[];
  provider: "google" | "openai" | "rules";
  model: string;
};

export type AiCoachError = {
  error: string;
  detail?: string;
  missingApiKey?: boolean;
};

export const aiCoachJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["petLine", "planSummary", "suggestedActions"],
  properties: {
    petLine: {
      type: "string",
      description: "A short, gentle line spoken by the pet.",
    },
    planSummary: {
      type: "string",
      description: "One sentence explaining today's plan.",
    },
    suggestedActions: {
      type: "array",
      minItems: 1,
      maxItems: 3,
      items: {
        type: "string",
      },
    },
  },
} as const;
