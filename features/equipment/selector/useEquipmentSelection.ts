import { useState } from 'react';

import type { SupportedLocale } from '../../../lib/i18n/locales';
import { isValidConfiguration } from '../configuration';
import type {
  EquipmentConfiguration,
  EquipmentCategory,
  EquipmentEntry
} from '../types';
import type { MachineCustomization } from './types';

import { useFormValidation } from '../../../lib/forms/useFormValidation';
import {
  createSelectionValidators,
  getSelectionFields
} from '../selection-validation';

import type { SelectorContent } from '../selector-content';
import { SelectionStep, SELECTION_STEP_ORDER } from '../selection-steps';
import {
  AcquisitionMode,
  getInitialSelectionStep,
  selectCategory,
  selectMachine,
  getSelectionSummary,
  createEnquiryMessage,
  type EquipmentSelection,
  type UpdateSelectionField
} from '../selection';

/**
 * Own the draft and step state for one mounted wizard instance.
 *
 * 1. Use the server-provided initialSelection as the starting state. A known
 *    machine supplies its category, so begin at Machine to review its options;
 *    otherwise begin at the first step in the normal sequence.
 * 2. Back/Continue and Change equipment keep this hook mounted while replacing
 *    the visible step. Their field values survive in the shared draft.
 * 3. The initial props seed state once; they are not continuously copied over
 *    the visitor's edits. A changed server-assigned key creates a fresh instance.
 *
 * Example: select a country and enter a project location, choose Change
 * equipment, then return through Category and Machine. Both answers, the
 * requested purchase/rental mode and rental details remain; choosing another
 * machine initializes its own configuration defaults.
 * The shared validation hook keeps presentation history separate from answers.
 * Leaving a step resets that history, not the draft. DOM focus remains the
 * responsibility of EquipmentWizard.
 */
export function useEquipmentSelection(
  locale: SupportedLocale,
  catalogue: EquipmentEntry[],
  initialSelection: EquipmentSelection,
  translations: SelectorContent
) {
  const [selection, setSelection] = useState(initialSelection);
  const [configurationDraft, setConfigurationDraft] =
    useState<EquipmentConfiguration | null>(null);
  const [step, setStep] = useState<SelectionStep>(() =>
    getInitialSelectionStep(initialSelection)
  );
  const validation = useFormValidation(
    selection,
    createSelectionValidators(selection, catalogue, translations),
    getSelectionFields(step, selection)
  );
  const stepIndex = SELECTION_STEP_ORDER.indexOf(step);
  const hasPreviousStep = stepIndex > 0;
  const isLastStep = stepIndex === SELECTION_STEP_ORDER.length - 1;

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
  const machines = catalogue.filter(
    entry => entry.category === selection.category
  );
  const machine = machines.find(entry => entry.slug === selection.machine);
  const summary = machine
    ? getSelectionSummary(locale, selection, machine, translations)
    : [];
  const message = createEnquiryMessage(
    summary,
    selection.acquisition,
    machine?.isDemo ?? false,
    translations
  );

  const updateField: UpdateSelectionField = (key, value) => {
    setSelection(previous => ({ ...previous, [key]: value }));
    if (key === 'acquisition' && value === AcquisitionMode.Purchase) {
      validation.clearNativeValidity(['rentalDuration', 'startDate']);
    }
  };

  function goToStep(next: SelectionStep) {
    setConfigurationDraft(null);
    validation.reset();
    setStep(next);
  }

  function previousStep() {
    if (!hasPreviousStep) return;
    const [previous] = SELECTION_STEP_ORDER.slice(stepIndex - 1);
    if (previous) goToStep(previous);
  }

  function chooseCategory(category: EquipmentSelection['category']) {
    if (category !== selection.category) setConfigurationDraft(null);
    setSelection(previous => selectCategory(previous, catalogue, category));
  }

  function chooseMachine(slug: EquipmentSelection['machine']) {
    if (slug !== selection.machine) setConfigurationDraft(null);
    setSelection(previous => selectMachine(previous, catalogue, slug));
  }

  // Validate the visible step before advancing. The wizard focuses a returned
  // invalid field; the shared hook controls when its error becomes visible.
  function nextStep(form: HTMLFormElement) {
    // Enter/Continue cannot silently discard or submit unconfirmed option edits.
    if (configurationDraft) return;
    const firstInvalid = validation.validate(form);
    if (firstInvalid) return firstInvalid;
    const [next] = SELECTION_STEP_ORDER.slice(stepIndex + 1);
    if (next) goToStep(next);
  }

  const customization: MachineCustomization = {
    value: selection.configuration,
    draft: configurationDraft,
    onStart() {
      setConfigurationDraft(selection.configuration);
    },
    onChange: setConfigurationDraft,
    onApply() {
      if (!machine || !isValidConfiguration(machine, configurationDraft))
        return;
      setSelection(previous => ({
        ...previous,
        configuration: configurationDraft
      }));
      setConfigurationDraft(null);
    },
    onCancel() {
      setConfigurationDraft(null);
    }
  };

  return {
    customization,
    selection,
    step,
    stepIndex,
    hasPreviousStep,
    isLastStep,
    errors: validation.errors,
    validation,
    categories,
    machines,
    machine,
    summary,
    message,
    updateField,
    goToStep,
    previousStep,
    chooseCategory,
    chooseMachine,
    nextStep
  };
}
