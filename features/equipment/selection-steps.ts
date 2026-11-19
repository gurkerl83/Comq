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

/**
 * The step before the given one in SELECTION_STEP_ORDER.
 *
 * @param step - A wizard step.
 * @returns The previous step, or undefined for the first step.
 */
export function getPreviousStep(
  step: SelectionStep
): SelectionStep | undefined {
  return SELECTION_STEP_ORDER[SELECTION_STEP_ORDER.indexOf(step) - 1];
}

/**
 * The step after the given one in SELECTION_STEP_ORDER.
 *
 * @param step - A wizard step.
 * @returns The next step, or undefined for the last step.
 */
export function getNextStep(step: SelectionStep): SelectionStep | undefined {
  return SELECTION_STEP_ORDER[SELECTION_STEP_ORDER.indexOf(step) + 1];
}
