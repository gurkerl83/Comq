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

/** The query parameter that names the step in the address: ?step=machine. */
export const SELECTION_STEP_PARAM = 'step';

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

/**
 * Read a step ID, such as the step a page address names.
 *
 * @param value - The step ID, or null when there is none.
 * @returns The step with that ID, or undefined for a missing or unknown ID.
 */
export function readSelectionStep(
  value: string | null
): SelectionStep | undefined {
  return SELECTION_STEP_ORDER.find(step => step === value);
}

/**
 * The requested step, or the first step before it whose answers are not
 * complete, so a step never shows ahead of a missing answer.
 *
 * @param requested - The step asked for.
 * @param isStepComplete - Whether a step's answers are complete.
 * @returns The step that may show.
 */
export function getReachableStep(
  requested: SelectionStep,
  isStepComplete: (step: SelectionStep) => boolean
): SelectionStep {
  for (const step of SELECTION_STEP_ORDER) {
    if (step === requested || !isStepComplete(step)) return step;
  }
  return requested;
}
