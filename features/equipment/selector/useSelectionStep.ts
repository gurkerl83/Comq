import { useEffect, useEffectEvent, useState } from 'react';

import { useQueryParam } from '../../../lib/navigation/useQueryParam';
import {
  getNextStep,
  getPreviousStep,
  getReachableStep,
  readSelectionStep,
  SELECTION_STEP_ORDER,
  SELECTION_STEP_PARAM,
  type SelectionStep
} from '../selection-steps';

/** What the caller decides about the steps. */
type SelectionStepRules = {
  /**
   * Whether a step's answers are complete. A step the address names shows
   * only when every step before it is complete.
   */
  isStepComplete: (step: SelectionStep) => boolean;
  /** Runs before every step change, such as closing the option editor. */
  beforeStepChange: () => void;
};

/**
 * The step the wizard shows, kept in the page address and the browser
 * history.
 *
 * 1. The step starts at the step the address names in SELECTION_STEP_PARAM,
 *    such as ?step=machine, or at initialStep when it names none.
 * 2. goToStep runs beforeStepChange, shows the step and adds a browser
 *    history entry for it, so the browser's Back and Forward move between
 *    steps. The page does not reload, so every answer stays.
 * 3. Back and Forward show the step of the entry they reach, again after
 *    beforeStepChange.
 * 4. A step the address names shows only when every step before it is
 *    complete; otherwise the first incomplete step shows, and the address is
 *    corrected in place.
 * 5. The hook knows nothing about the answers or Customize: isStepComplete
 *    and beforeStepChange come from the caller.
 *
 * @param initialStep - The step shown when the address names none.
 * @param rules - When a step is complete and what runs before a step change.
 * @returns The step, its index, the previous and next steps, and goToStep.
 */
export function useSelectionStep(
  initialStep: SelectionStep,
  { isStepComplete, beforeStepChange }: SelectionStepRules
) {
  const stepParam = useQueryParam(SELECTION_STEP_PARAM);

  /**
   * The step to show for what the address names.
   *
   * @param requested - The step the address names, or null.
   * @returns That step, or the first incomplete step before it; initialStep
   * when the address names no known step.
   */
  function stepFromAddress(requested: string | null): SelectionStep {
    return getReachableStep(
      readSelectionStep(requested) ?? initialStep,
      isStepComplete
    );
  }

  const [step, setStep] = useState(() => stepFromAddress(stepParam.value));

  /**
   * Show another step and add a browser history entry for it.
   * beforeStepChange runs first.
   *
   * @param target - The step to show.
   */
  function goToStep(target: SelectionStep) {
    beforeStepChange();
    setStep(target);
    stepParam.push(target);
  }

  /**
   * Show the step the address names, and keep the address honest.
   *
   * 1. It runs whenever the address's step changes: after the browser's Back
   *    or Forward, and after goToStep's own entry, where it finds that step
   *    already shown and does nothing.
   * 2. A step the answers cannot reach yet shows the first incomplete step
   *    instead, and replace corrects the address without a new entry.
   * 3. Before another step shows, beforeStepChange runs, as in goToStep.
   *
   * Why useEffectEvent (React 19.2):
   * The effect below has to answer two questions separately:
   * 1. When does it run? Only when the address's step changes.
   * 2. What does it read? The current step, isStepComplete and
   *    beforeStepChange.
   * A plain effect cannot separate them. Every value it reads must be a
   * dependency, and every dependency change runs it again:
   * 1. step changes on every goToStep one render before the address does,
   *    because the address follows push one render later (useQueryParam
   *    says why).
   * 2. isStepComplete and beforeStepChange are new functions on every render
   *    of the caller, so the effect would run after every render.
   * useEffectEvent separates them. followAddress reads the current values
   * whenever it is called, but it is not a dependency, so the effect lists
   * only the address and runs only when the address changes. A function made
   * with useEffectEvent may only be called from inside an effect.
   *
   * Example: Continue from Category to Machine.
   *
   * In short: goToStep sets the step at once, and the address follows one
   * render later.
   * 1. A plain effect that lists step runs after render 1 and sees a step
   *    and an address that disagree.
   * 2. The useEffectEvent version lists only the address, so it first runs
   *    after render 2, when both agree.
   *
   * With a plain effect that lists step as a dependency:
   * 1. goToStep('machine') sets the step and pushes ?step=machine.
   * 2. Render 1 shows the step 'machine', while the address still says
   *    'category'.
   * 3. step changed, so the effect runs and reads the old address. It runs
   *    beforeStepChange and switches back to 'category'.
   * 4. A later render brings ?step=machine. The effect runs again and
   *    switches forward to 'machine'.
   * The wizard flips back and forth, and beforeStepChange runs twice.
   *
   * With useEffectEvent:
   * 1. goToStep('machine') sets the step and pushes ?step=machine.
   * 2. Render 1 shows the step 'machine'. The address has not changed yet,
   *    so the effect does not run.
   * 3. Render 2 brings ?step=machine. The address changed, so the effect
   *    runs.
   * 4. followAddress reads the current step 'machine', the same as the
   *    address, and does nothing.
   *
   * @param requested - The step the address names, or null.
   */
  const followAddress = useEffectEvent((requested: string | null) => {
    const target = stepFromAddress(requested);
    if (requested !== null && requested !== target) stepParam.replace(target);
    if (target === step) return;
    beforeStepChange();
    setStep(target);
  });

  // Follow the step the address names whenever it changes.
  const requested = stepParam.value;
  useEffect(() => {
    followAddress(requested);
  }, [requested]);

  return {
    step,
    stepIndex: SELECTION_STEP_ORDER.indexOf(step),
    previousStep: getPreviousStep(step),
    nextStep: getNextStep(step),
    goToStep
  };
}
