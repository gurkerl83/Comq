/**
 * Stable IDs keep validation, rendering and review links tied to a step.
 */
export const SelectionStep = {
  Category: 'category',
  Machine: 'machine',
  Requirements: 'requirements',
  Review: 'review'
} as const;

export type SelectionStep = (typeof SelectionStep)[keyof typeof SelectionStep];

/**
 * The single sequence for initial selection, Back/Next and progress.
 * Translations supply text by ID; they do not define navigation order.
 */
export const SELECTION_STEP_ORDER = [
  SelectionStep.Category,
  SelectionStep.Machine,
  SelectionStep.Requirements,
  SelectionStep.Review
] as const;
