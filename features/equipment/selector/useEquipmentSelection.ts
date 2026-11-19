import { useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import type { EquipmentEntry } from '../types';
import type { SelectorContent } from '../selector-content';
import { listCategories, listMachines } from '../catalogue-lists';
import { getSelectionFields } from '../selection-validation';
import { SelectionStep, SELECTION_STEP_ORDER } from '../selection-steps';
import {
  getInitialSelectionStep,
  selectCategory,
  selectMachine,
  type EquipmentSelection
} from '../selection';
import { createSelectionResolver } from './selection-resolver';
import { useMachineCustomization } from './useMachineCustomization';
import { useSelectionStep } from './useSelectionStep';

/**
 * The equipment selector's state: the enquiry form, the step shown, the
 * option editor and the moves between steps.
 *
 * 1. React Hook Form seeds answers once and retains unmounted step fields.
 *    The server-assigned wizard key still determines when a new enquiry begins.
 * 2. Native controls validate on blur then edits. Continue validates and touches
 *    its fields without submitting; untouched later fields still wait for blur.
 * 3. useSelectionStep holds the step shown. goToStep is the only way to change
 *    it, and it closes the option editor first.
 * 4. useMachineCustomization holds whether the option editor is open. A step
 *    change or another machine closes it through closeEditor.
 * 5. Category and machine transitions run against the previous form values so
 *    their dependent defaults change together. Commercial answers survive.
 *
 * @param catalogue - Machines and supported configurations for this enquiry.
 * @param initialSelection - The starting answers the server prepared, with a
 * machine when the address names a known one.
 * @param translations - Localized messages and country options.
 * @returns What EquipmentWizard renders and calls: the form, the step and its
 * moves, the option editor, the catalogue lists and the equipment choices.
 */
export function useEquipmentSelection(
  catalogue: EquipmentEntry[],
  initialSelection: EquipmentSelection,
  translations: SelectorContent
) {
  const { step, stepIndex, previousStep, nextStep, setStep } = useSelectionStep(
    getInitialSelectionStep(initialSelection)
  );
  const startDateRef = useRef<HTMLInputElement>(null);

  const form = useForm<EquipmentSelection>({
    defaultValues: initialSelection,
    mode: 'onTouched',
    shouldUnregister: false,
    resolver: createSelectionResolver(
      catalogue,
      translations,
      () => startDateRef.current?.validity.badInput ?? false
    )
  });

  const [category, machineSlug] = useWatch({
    control: form.control,
    name: ['category', 'machine']
  });
  const { customization, closeEditor } = useMachineCustomization(form);
  const { touchedFields } = form.formState;

  const hasPreviousStep = previousStep !== undefined;
  const isLastStep = nextStep === undefined;
  const categories = listCategories(catalogue);
  const machines = listMachines(catalogue, category);
  const machine = machines.find(entry => entry.slug === machineSlug);

  /**
   * Show another step. The option editor closes, so no step opens with an
   * editor left open.
   *
   * @param target - The step to show.
   */
  function goToStep(target: SelectionStep) {
    closeEditor();
    setStep(target);
  }

  /** Show the previous step, as Back does; the first step has none. */
  function goToPreviousStep() {
    if (previousStep) goToStep(previousStep);
  }

  /**
   * Revalidate touched fields after an equipment transition.
   *
   * Category and machine changes update dependent answers through setValues.
   * Keep untouched fields quiet until blur or Continue.
   *
   * @param fields - Fields affected by the category or machine change.
   */
  function revalidateTouchedFields(fields: Array<keyof EquipmentSelection>) {
    const fieldsToValidate = fields.filter(name => touchedFields[name]);
    if (fieldsToValidate.length > 0) void form.trigger(fieldsToValidate);
  }

  /**
   * Choose a category, as the Equipment step does. selectCategory adjusts the
   * machine and its options to it, and touched fields among the three are
   * checked again.
   *
   * @param nextCategory - The category the visitor chose.
   */
  function chooseCategory(nextCategory: EquipmentSelection['category']) {
    form.setValues(values => selectCategory(values, catalogue, nextCategory), {
      shouldDirty: true
    });
    revalidateTouchedFields(['category', 'machine', 'configuration']);
  }

  function chooseMachine(slug: EquipmentSelection['machine']) {
    if (slug !== form.getValues('machine')) closeEditor();
    form.setValues(values => selectMachine(values, catalogue, slug), {
      shouldDirty: true
    });
    revalidateTouchedFields(['machine', 'configuration']);
  }

  /**
   * Validate the active step without submitting the enquiry form and, when
   * it passes, show the next step, as Continue does.
   *
   * 1. Trigger the current step's fields, or all relevant answers before Review.
   * 2. shouldTouch lets corrections revalidate under onTouched after Continue;
   *    later fields remain untouched and the form's isSubmitted stays false.
   * 3. Return the invalid field so the wizard mounts its step before focus.
   *
   * @returns The first invalid field and its step, or undefined when the
   * attempt succeeds or is ignored.
   */
  async function goToNextStep() {
    if (customization.editing || !nextStep) return;
    const values = form.getValues();
    const stepsToValidate =
      step === SelectionStep.Requirements ? SELECTION_STEP_ORDER : [step];
    const fields = stepsToValidate.flatMap(id =>
      getSelectionFields(id, values)
    );

    const valid = await form.trigger(fields, { shouldTouch: true });
    if (valid) {
      goToStep(nextStep);
      return;
    }
    for (const id of stepsToValidate) {
      const field = getSelectionFields(id, values).find(
        name => form.getFieldState(name).invalid
      );
      if (field) return { field, step: id };
    }
  }

  return {
    form,
    startDateRef,
    customization,
    step,
    stepIndex,
    hasPreviousStep,
    isLastStep,
    categories,
    machines,
    machine,
    goToStep,
    goToPreviousStep,
    chooseCategory,
    chooseMachine,
    goToNextStep
  };
}
