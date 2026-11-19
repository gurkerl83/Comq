import { useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import type { EquipmentCategory, EquipmentEntry } from '../types';
import type { MachineCustomization } from './types';
import type { SelectorContent } from '../selector-content';
import { getSelectionFields } from '../selection-validation';
import { SelectionStep, SELECTION_STEP_ORDER } from '../selection-steps';
import {
  getInitialSelectionStep,
  selectCategory,
  selectMachine,
  type EquipmentSelection
} from '../selection';
import { createSelectionResolver } from './selection-resolver';
import { useSelectionStep } from './useSelectionStep';

/**
 * Own the applied enquiry, step navigation and customization visibility.
 *
 * 1. React Hook Form seeds answers once and retains unmounted step fields.
 *    The server-assigned wizard key still determines when a new enquiry begins.
 * 2. Native controls validate on blur then edits. Continue validates and touches
 *    its fields without submitting; untouched later fields still wait for blur.
 * 3. The mounted configuration editor owns temporary values. Applying replaces
 *    configuration; closing the editor discards its unfinished changes.
 * 4. Category and machine transitions run against the previous form values so
 *    their dependent defaults change together. Commercial answers survive.
 */
export function useEquipmentSelection(
  catalogue: EquipmentEntry[],
  initialSelection: EquipmentSelection,
  translations: SelectorContent
) {
  const { step, stepIndex, previousStep, nextStep, setStep } = useSelectionStep(
    getInitialSelectionStep(initialSelection)
  );
  const [editing, setEditing] = useState(false);
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

  const [category, machineSlug, configuration] = useWatch({
    control: form.control,
    name: ['category', 'machine', 'configuration']
  });
  const { touchedFields } = form.formState;

  const hasPreviousStep = previousStep !== undefined;
  const isLastStep = nextStep === undefined;
  const categories: EquipmentCategory[] = [
    ...new Map(
      catalogue.map(entry => [
        entry.category,
        {
          id: entry.category,
          name: entry.categoryName,
          description: entry.categoryDescription
        }
      ])
    ).values()
  ];
  const machines = catalogue.filter(entry => entry.category === category);
  const machine = machines.find(entry => entry.slug === machineSlug);

  /**
   * Show another step. The option editor closes, so no step opens with an
   * editor left open.
   *
   * @param next - The step to show.
   */
  function goToStep(next: SelectionStep) {
    setEditing(false);
    setStep(next);
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

  function chooseCategory(nextCategory: EquipmentSelection['category']) {
    if (nextCategory !== form.getValues('category')) setEditing(false);
    form.setValues(values => selectCategory(values, catalogue, nextCategory), {
      shouldDirty: true
    });
    revalidateTouchedFields(['category', 'machine', 'configuration']);
  }

  function chooseMachine(slug: EquipmentSelection['machine']) {
    if (slug !== form.getValues('machine')) setEditing(false);
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
    if (editing || !nextStep) return;
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

  const customization: MachineCustomization = {
    value: configuration,
    editing,
    onStart() {
      setEditing(true);
    },
    /**
     * Apply the validated draft to the enquiry.
     *
     * 1. The editor calls this through draftForm.handleSubmit(customization.onApply).
     * 2. setValue replaces the complete configuration (choices and extras);
     *    the enquiry's other answers and initial defaults remain unchanged.
     * 3. Dirty state compares with initial defaults; touched records Apply, and
     *    validation refreshes configuration errors.
     * 4. Closing the editor discards its separate RHF instance. The enquiry
     *    is not submitted.
     *
     * @param value - Complete choices and extras accepted by the editor.
     */
    onApply(value) {
      form.setValue('configuration', value, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true
      });
      setEditing(false);
    },
    onCancel() {
      setEditing(false);
    }
  };

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
