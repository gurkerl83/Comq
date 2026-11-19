import { useState } from 'react';

import {
  getNextStep,
  getPreviousStep,
  SELECTION_STEP_ORDER,
  type SelectionStep
} from '../selection-steps';

/**
 * The step the wizard shows and its place in SELECTION_STEP_ORDER.
 *
 * 1. The step starts at initialStep and changes only through setStep.
 * 2. The hook knows nothing about the answers or Customize. The caller
 *    decides when to change the step and what changes with it, such as
 *    closing the option editor.
 *
 * @param initialStep - The step shown first.
 * @returns The step, its index, the previous and next steps, and setStep.
 */
export function useSelectionStep(initialStep: SelectionStep) {
  const [step, setStep] = useState(initialStep);

  return {
    step,
    stepIndex: SELECTION_STEP_ORDER.indexOf(step),
    previousStep: getPreviousStep(step),
    nextStep: getNextStep(step),
    setStep
  };
}
