import type { FoodCategory, QuantityUnit, RecognitionCandidate } from "../../types/domain";

export type RecognitionMode = "receipt" | "photo";

export type RecognizeImageRequest = {
  mode: RecognitionMode;
  imageDataUrl: string;
  today: string;
};

export type RecognizeImageResponse = {
  candidates: RecognitionCandidate[];
  provider: "google" | "openai";
  model: string;
};

export type RecognizeImageError = {
  error: string;
  detail?: string;
  missingApiKey?: boolean;
};

export const recognitionCategories: FoodCategory[] = [
  "produce",
  "dairy",
  "meat",
  "seafood",
  "bakery",
  "pantry",
  "frozen",
  "prepared",
  "beverage",
  "other",
];

export const recognitionUnits: QuantityUnit[] = [
  "item",
  "bag",
  "box",
  "bottle",
  "can",
  "g",
  "kg",
  "ml",
  "l",
  "serving",
  "unknown",
];

export const recognitionJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["candidates"],
  properties: {
    candidates: {
      type: "array",
      maxItems: 12,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "rawText",
          "proposedName",
          "proposedCategory",
          "proposedQuantity",
          "proposedUnit",
          "proposedPurchaseDate",
          "proposedSuggestedUseByDate",
          "notes",
          "confidence",
          "evidence",
        ],
        properties: {
          rawText: { type: ["string", "null"] },
          proposedName: { type: "string" },
          proposedCategory: { type: "string", enum: recognitionCategories },
          proposedQuantity: { type: "number", minimum: 0 },
          proposedUnit: { type: "string", enum: recognitionUnits },
          proposedPurchaseDate: {
            type: ["string", "null"],
            pattern: "^\\d{4}-\\d{2}-\\d{2}$",
          },
          proposedSuggestedUseByDate: {
            type: ["string", "null"],
            pattern: "^\\d{4}-\\d{2}-\\d{2}$",
          },
          notes: { type: ["string", "null"] },
          confidence: {
            type: "object",
            additionalProperties: false,
            required: ["name", "category", "quantity", "purchaseDate", "suggestedUseByDate"],
            properties: {
              name: { type: "number", minimum: 0, maximum: 1 },
              category: { type: "number", minimum: 0, maximum: 1 },
              quantity: { type: "number", minimum: 0, maximum: 1 },
              purchaseDate: { type: "number", minimum: 0, maximum: 1 },
              suggestedUseByDate: { type: "number", minimum: 0, maximum: 1 },
            },
          },
          evidence: {
            type: "array",
            maxItems: 6,
            items: {
              type: "object",
              additionalProperties: false,
              required: ["kind", "value", "confidence"],
              properties: {
                kind: {
                  type: "string",
                  enum: ["ocr_text", "image_label", "barcode", "user_input"],
                },
                value: { type: "string" },
                confidence: { type: "number", minimum: 0, maximum: 1 },
              },
            },
          },
        },
      },
    },
  },
} as const;

export function normalizeRecognizedCandidates(
  candidates: RecognitionCandidate[],
  mode: RecognitionMode,
): RecognitionCandidate[] {
  return candidates
    .filter((candidate) => candidate.proposedName.trim())
    .map((candidate, index) => {
      const quantityAndUnit = normalizeQuantityAndUnit(candidate);

      return {
        ...candidate,
        id: candidate.id || `ai-${mode}-${index + 1}`,
        proposedName: candidate.proposedName.trim(),
        proposedQuantity: quantityAndUnit.quantity,
        proposedUnit: quantityAndUnit.unit,
        proposedCategory: candidate.proposedCategory ?? "other",
        notes: quantityAndUnit.notes,
        evidence:
          candidate.evidence.length > 0
            ? candidate.evidence
            : [
                {
                  kind: mode === "receipt" ? "ocr_text" : "image_label",
                  value: candidate.rawText ?? candidate.proposedName,
                  confidence: candidate.confidence.name ?? 0.5,
                },
              ],
        status: "pending",
      };
    });
}

type QuantityAndUnit = {
  quantity: number;
  unit: QuantityUnit;
  notes?: string;
};

type PackageMeasure = {
  quantity: number;
  unit: Extract<QuantityUnit, "g" | "kg" | "ml" | "l">;
  label: string;
};

const packageMeasurePattern = /\b(\d+(?:[.,]\d+)?)\s*(kg|g|ml|l)\b/i;

function normalizeQuantityAndUnit(candidate: RecognitionCandidate): QuantityAndUnit {
  const proposedUnit = candidate.proposedUnit ?? "unknown";
  const notes = candidate.notes ?? undefined;
  const text = [
    candidate.rawText,
    candidate.proposedName,
    notes,
    ...candidate.evidence.map((evidence) => evidence.value),
  ]
    .filter(Boolean)
    .join(" ");
  const packageMeasure = extractPackageMeasure(text);
  const purchasedCount = extractPurchasedCount(text);

  if (packageMeasure && purchasedCount !== undefined) {
    return {
      quantity: purchasedCount,
      unit: "item",
      notes: addPackageMeasureNote(notes, packageMeasure),
    };
  }

  if (packageMeasure && isItemLikeUnit(proposedUnit)) {
    return {
      quantity: packageMeasure.quantity,
      unit: packageMeasure.unit,
      notes,
    };
  }

  return {
    quantity: Math.max(1, Math.round(candidate.proposedQuantity ?? 1)),
    unit: proposedUnit,
    notes,
  };
}

function extractPackageMeasure(text: string): PackageMeasure | undefined {
  const match = text.match(packageMeasurePattern);
  if (!match) return undefined;

  const quantity = Number(match[1].replace(",", "."));
  if (!Number.isFinite(quantity) || quantity <= 0) return undefined;

  const unit = match[2].toLowerCase() as PackageMeasure["unit"];

  return {
    quantity,
    unit,
    label: `${formatQuantity(quantity)}${unit}`,
  };
}

function extractPurchasedCount(text: string): number | undefined {
  const countBeforePackageMeasure = text.match(
    /\b(\d+)\s*[x×]\s*\d+(?:[.,]\d+)?\s*(?:kg|g|ml|l)\b/i,
  );
  const packageCount = parsePositiveInteger(countBeforePackageMeasure?.[1]);
  if (packageCount !== undefined) return packageCount;

  const patterns = [
    /\b(\d+)\s+(?:at|@)\s+\$?\d/i,
    /\b(?:qty|quantity)\s*[:x]?\s*(\d+)\b/i,
    /\bx\s*(\d+)\b/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    const count = parsePositiveInteger(match?.[1]);
    if (count !== undefined) return count;
  }
  return undefined;
}

function parsePositiveInteger(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return undefined;
  return parsed;
}

function isItemLikeUnit(unit: QuantityUnit): boolean {
  return ["item", "unknown", "bag", "box", "bottle", "can"].includes(unit);
}

function addPackageMeasureNote(
  notes: string | undefined,
  packageMeasure: PackageMeasure,
): string {
  const packageNote = `${packageMeasure.label} each`;
  if (!notes) return packageNote;
  if (notes.toLowerCase().includes(packageMeasure.label.toLowerCase())) return notes;
  return `${notes}; ${packageNote}`;
}

function formatQuantity(quantity: number): string {
  return Number.isInteger(quantity) ? String(quantity) : String(quantity);
}
