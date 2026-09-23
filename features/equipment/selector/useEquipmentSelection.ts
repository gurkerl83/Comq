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
  const [step, setStep] = useState<SelectionStep>(() =>
    getInitialSelectionStep(initialSelection)
  );
  const [editing, setEditing] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const startDateRef = useRef<HTMLInputElement>(null);
  const advancePending = useRef(false);
  const navigationVersion = useRef(0);

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

  const stepIndex = SELECTION_STEP_ORDER.indexOf(step);
  const hasPreviousStep = stepIndex > 0;
  const isLastStep = step === SelectionStep.Review;
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

  function goToStep(next: SelectionStep) {
    navigationVersion.current += 1;
    setEditing(false);
    setStep(next);
  }

  function previousStep() {
    const previous = SELECTION_STEP_ORDER[stepIndex - 1];
    if (previous) goToStep(previous);
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
    navigationVersion.current += 1;
    form.setValues(values => selectCategory(values, catalogue, nextCategory), {
      shouldDirty: true
    });
    revalidateTouchedFields(['category', 'machine', 'configuration']);
  }

  function chooseMachine(slug: EquipmentSelection['machine']) {
    if (slug !== form.getValues('machine')) setEditing(false);
    navigationVersion.current += 1;
    form.setValues(values => selectMachine(values, catalogue, slug), {
      shouldDirty: true
    });
    revalidateTouchedFields(['machine', 'configuration']);
  }

  /**
   * Validate the active step without submitting the enquiry form.
   *
   * 1. Trigger the current step's fields, or all relevant answers before Review.
   * 2. shouldTouch lets corrections revalidate under onTouched after Continue;
   *    later fields remain untouched and the form's isSubmitted stays false.
   * 3. A ref blocks repeated attempts immediately; isAdvancing drives the button.
   * 4. Ignore results if navigation or equipment changed during validation.
   * 5. Return the invalid field so the wizard mounts its step before focus.
   *
   * @returns The first invalid field and its step, or undefined when the
   * attempt succeeds or is ignored.
   */
  async function nextStep() {
    if (editing || advancePending.current || isLastStep) return;
    advancePending.current = true;
    setIsAdvancing(true);
    const version = navigationVersion.current;
    const next = SELECTION_STEP_ORDER[stepIndex + 1];
    const values = form.getValues();
    const stepsToValidate =
      step === SelectionStep.Requirements ? SELECTION_STEP_ORDER : [step];
    const fields = stepsToValidate.flatMap(id =>
      getSelectionFields(id, values)
    );

    try {
      const valid = await form.trigger(fields, { shouldTouch: true });
      if (version !== navigationVersion.current) return;
      if (valid) {
        if (next) goToStep(next);
        return;
      }
      for (const id of stepsToValidate) {
        const field = getSelectionFields(id, values).find(
          name => form.getFieldState(name).invalid
        );
        if (field) return { field, step: id };
      }
    } finally {
      advancePending.current = false;
      setIsAdvancing(false);
    }
  }

  const customization: MachineCustomization = {
    value: configuration,
    editing,
    onStart() {
      navigationVersion.current += 1;
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
    isAdvancing,
    categories,
    machines,
    machine,
    goToStep,
    previousStep,
    chooseCategory,
    chooseMachine,
    nextStep
  };
}
