import type { FieldErrors, Resolver } from 'react-hook-form';

import type { EquipmentEntry } from '../types';
import type { EquipmentSelection } from '../selection';
import type { SelectorContent } from '../selector-content';
import {
  createSelectionValidators,
  getSelectionFields
} from '../selection-validation';
import { SELECTION_STEP_ORDER } from '../selection-steps';

/**
 * Adapt the equipment rules to React Hook Form's error contract.
 *
 * 1. Evaluate every relevant field, including retained answers on other steps.
 * 2. RHF's trigger(fieldNames) publishes errors and reports success only for
 *    those fields; ordinary input events update the changed field's error.
 * 3. Read the optional date's native parsing state separately from its string.
 *    Unmounting that control clears its ref while retaining its stored answer.
 *
 * @param catalogue - Machines and supported configurations for this enquiry.
 * @param translations - Localized messages and country options.
 * @param hasIncompleteDate - Reports badInput from the mounted date control.
 * @returns A resolver reporting relevant errors without changing stored answers.
 */
export function createSelectionResolver(
  catalogue: EquipmentEntry[],
  translations: SelectorContent,
  hasIncompleteDate: () => boolean
): Resolver<EquipmentSelection> {
  return values => {
    const rules = createSelectionValidators(values, catalogue, translations);
    const errors: FieldErrors<EquipmentSelection> = {};
    const fields = SELECTION_STEP_ORDER.flatMap(step =>
      getSelectionFields(step, values)
    );

    for (const field of fields) {
      const message = rules[field](
        values[field],
        field === 'startDate' && hasIncompleteDate()
      );
      if (message) errors[field] = { type: 'validate', message };
    }

    return {
      values: Object.keys(errors).length > 0 ? {} : values,
      errors
    };
  };
}
