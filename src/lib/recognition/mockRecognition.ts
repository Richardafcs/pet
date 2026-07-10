import type { RecognitionCandidate } from "../../types/domain";

export const mockReceiptCandidates: RecognitionCandidate[] = [
  {
    id: "candidate-receipt-spinach",
    rawText: "ORG SPINACH 5OZ",
    proposedName: "Spinach",
    proposedCategory: "produce",
    proposedQuantity: 1,
    proposedUnit: "bag",
    proposedPurchaseDate: "2026-07-10",
    proposedSuggestedUseByDate: "2026-07-13",
    confidence: { name: 0.88, category: 0.81, suggestedUseByDate: 0.62 },
    evidence: [{ kind: "ocr_text", value: "ORG SPINACH 5OZ", confidence: 0.88 }],
    status: "pending",
  },
  {
    id: "candidate-receipt-yogurt",
    rawText: "GREEK YOGURT 4PK",
    proposedName: "Greek yogurt",
    proposedCategory: "dairy",
    proposedQuantity: 4,
    proposedUnit: "item",
    proposedPurchaseDate: "2026-07-10",
    proposedSuggestedUseByDate: "2026-07-16",
    confidence: { name: 0.84, category: 0.79, suggestedUseByDate: 0.58 },
    evidence: [{ kind: "ocr_text", value: "GREEK YOGURT 4PK", confidence: 0.84 }],
    status: "pending",
  },
];

export const mockPhotoCandidates: RecognitionCandidate[] = [
  {
    id: "candidate-photo-bananas",
    proposedName: "Bananas",
    proposedCategory: "produce",
    proposedQuantity: 6,
    proposedUnit: "item",
    proposedPurchaseDate: "2026-07-10",
    proposedSuggestedUseByDate: "2026-07-14",
    confidence: { name: 0.86, category: 0.84, suggestedUseByDate: 0.52 },
    evidence: [{ kind: "image_label", value: "banana", confidence: 0.86 }],
    status: "pending",
  },
];
