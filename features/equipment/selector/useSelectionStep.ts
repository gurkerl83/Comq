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
 * 1. The address names the step in SELECTION_STEP_PARAM: ?step=machine.
 *    initialStep stays out of the address.
 *    An address without the parameter shows initialStep.
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
  const {
    value: requestedStep,
    push: pushStep,
    replace: replaceStep
  } = useQueryParam(SELECTION_STEP_PARAM);

  /**
   * The step to show for what the address names.
   *
   * @param requested - The step the address names, or null.
   * @returns That step, or the first incomplete step before it; initialStep
   * when the address names no known step.
   */
  function getStepFromAddress(requested: string | null): SelectionStep {
    return getReachableStep(
      readSelectionStep(requested) ?? initialStep,
      isStepComplete
    );
  }

  /**
   * The value of SELECTION_STEP_PARAM for a step.
   * initialStep, the step the wizard starts on, gets null.
   * null leaves the parameter out of the address.
   * Every other step gets its ID, such as 'machine'.
   *
   * @param target - The step the address names.
   * @returns null for initialStep, otherwise the step's ID.
   */
  function getStepParamValue(target: SelectionStep): string | null {
    if (target === initialStep) return null;
    return target;
  }

  const [step, setStep] = useState(() => getStepFromAddress(requestedStep));

  /**
   * Change the step shown.
   * Both paths use it: goToStep (fast) and onRequestedStepChange (slow).
   *
   * @param target - The step to show.
   */
  function changeShownStep(target: SelectionStep) {
    // First let the caller close what is open on the step being left.
    beforeStepChange();
    // Then show the new step; both changes reach the screen in one render.
    setStep(target);
  }

  /**
   * The wizard's own step changes come here, such as Continue or Back.
   * This is the fast path: the step shows first, and the address follows.
   * The new history entry lets the browser's Back return to the step left.
   *
   * @param target - The step to show.
   */
  function goToStep(target: SelectionStep) {
    // Fast path: show the step in the click's own render.
    changeShownStep(target);
    // Record the step in the history; the address follows one render later.
    pushStep(getStepParamValue(target));
  }

  /**
   * Show the step the address names, and keep the address honest.
   * It runs whenever the address's step changes.
   * That happens after the browser's Back or Forward and after goToStep.
   * It also runs once right after a full page load.
   * This is the slow path: the address changes first, and the step follows.
   * It writes the address only to correct it, as after a reload.
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
   * useEffectEvent separates them.
   * The function it wraps, `onRequestedStepChange`, reads the current values.
   * That function is not a dependency, so the effect lists only the address.
   * The effect then runs only when the address changes.
   * A function made with useEffectEvent may only be called inside an effect.
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
   * 4. The Effect Event `onRequestedStepChange` sees 'machine' already shown.
   *    That is the step the address names, so it does nothing.
   *
   * @param requested - The step the address names, or null.
   */
  const onRequestedStepChange = useEffectEvent((requested: string | null) => {
    // The named step, or the first incomplete one while it is unreachable.
    const target = getStepFromAddress(requested);
    // How the address names that step; initialStep leaves the parameter out.
    const targetValue = getStepParamValue(target);
    // Correction: replace the address only when it names the wrong step.
    // After the fast path or Back and Forward, it already names the right one.
    // It comes before the return, so a full page load is corrected too.
    if (requested !== targetValue) replaceStep(targetValue);
    // The step already shows, as after the fast path or a full page load.
    if (target === step) return;
    // Slow path: Back or Forward reached another step, so show it now.
    changeShownStep(target);
  });

  // Follow the step the address names whenever it changes.
  useEffect(() => {
    onRequestedStepChange(requestedStep);
  }, [requestedStep]);

  return {
    step,
    stepIndex: SELECTION_STEP_ORDER.indexOf(step),
    previousStep: getPreviousStep(step),
    nextStep: getNextStep(step),
    goToStep
  };
}
