import {
  validateInteger,
  validateOptionalText,
  validateOptionalFutureDate,
  type FieldValidator
} from '../../lib/forms/validation';
import type { EquipmentEntry } from './types';
import { isValidConfiguration } from './configuration';
import { AcquisitionMode, type EquipmentSelection } from './selection';
import { SELECTION_LIMITS } from './selection-limits';
import { SelectionStep } from './selection-steps';
import type { SelectorContent } from './selector-content';

/**
 * Build field rules from the current draft and catalogue. The shared form hook
 * applies them on blur, on edits after an error and when submitting the step.
 * Rules return messages without mutating answers or deciding navigation.
 */
export function createSelectionValidators(
  selection: EquipmentSelection,
  catalogue: EquipmentEntry[],
  translations: SelectorContent
): Record<keyof EquipmentSelection, FieldValidator> {
  const machine = catalogue.find(
    entry =>
      entry.slug === selection.machine && entry.category === selection.category
  );

  return {
    category: value => {
      if (!catalogue.some(entry => entry.category === value))
        return translations.chooseCategory;
      return null;
    },
    machine: value => {
      if (
        !catalogue.some(
          entry => entry.slug === value && entry.category === selection.category
        )
      ) {
        return translations.chooseMachine;
      }
      return null;
    },
    configuration: value =>
      machine && isValidConfiguration(machine, value)
        ? null
        : translations.invalidConfiguration,
    acquisition: value => {
      if (!Object.values(AcquisitionMode).some(mode => mode === value))
        return translations.invalidAcquisition;
      return null;
    },
    quantity: value =>
      validateInteger(
        value,
        SELECTION_LIMITS.quantity,
        translations.invalidQuantity
      ),
    country: value => {
      if (!translations.countries.some(country => country.code === value))
        return translations.chooseCountry;
      return null;
    },
    projectLocation: value =>
      validateOptionalText(
        value,
        SELECTION_LIMITS.projectLocation.maxLength,
        translations.projectLocationTooLong
      ),
    // Retain rental answers when purchasing, but stop validating inactive fields.
    rentalDuration: value => {
      if (selection.acquisition !== AcquisitionMode.Rental) return null;
      return validateInteger(
        value,
        SELECTION_LIMITS.rentalDuration,
        translations.invalidDuration
      );
    },
    rentalUnit: value => {
      if (selection.acquisition !== AcquisitionMode.Rental) return null;
      if (value !== 'weeks' && value !== 'months')
        return translations.invalidRentalUnit;
      return null;
    },
    startDate: (value, badInput) => {
      if (selection.acquisition !== AcquisitionMode.Rental) return null;
      // Native date controls may expose an empty value during an incomplete
      // edit. Distinguish that from an intentionally empty optional answer.
      if (badInput) return translations.invalidDate;
      return validateOptionalFutureDate(value, translations.invalidDate);
    },
    notes: value =>
      validateOptionalText(
        value,
        SELECTION_LIMITS.notes.maxLength,
        translations.notesTooLong
      )
  };
}

/**
 * Validate only the current step and its relevant fields, in display order.
 * Switching to purchase leaves rental values in the draft but excludes their
 * errors from rendering and from the checks that can block Continue.
 */
export function getSelectionFields(
  step: SelectionStep,
  selection: EquipmentSelection
): Array<keyof EquipmentSelection> {
  if (step === SelectionStep.Category) return ['category'];
  if (step === SelectionStep.Machine) return ['machine', 'configuration'];
  if (step !== SelectionStep.Requirements) return [];

  const fields: Array<keyof EquipmentSelection> = ['acquisition'];
  if (selection.acquisition === AcquisitionMode.Rental) {
    fields.push('rentalDuration', 'rentalUnit', 'startDate');
  }
  fields.push('quantity', 'country', 'projectLocation', 'notes');
  return fields;
}
