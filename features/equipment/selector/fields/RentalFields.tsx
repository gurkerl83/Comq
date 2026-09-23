import { useEffect, type RefObject } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';

import type { EquipmentSelection } from '../../selection';
import type { SelectorContent } from '../../selector-content';
import { SELECTION_LIMITS } from '../../selection-limits';
import { SelectField } from '../controls/SelectField';
import { TextField } from '../controls/TextField';

/**
 * Rental copy and the native date input inspected by the enquiry resolver.
 */
type RentalFieldsProps = {
  /** Labels, requirement hints and unit names. */
  translations: SelectorContent;
  /** Distinguishes an incomplete native date from an intentionally empty date. */
  startDateRef: RefObject<HTMLInputElement | null>;
};

export function RentalFields({
  translations,
  startDateRef
}: RentalFieldsProps) {
  const { control, register, getValues, getFieldState, trigger } =
    useFormContext<EquipmentSelection>();

  const { errors, touchedFields } = useFormState({
    control,
    name: ['rentalDuration', 'rentalUnit', 'startDate'],
    exact: true
  });

  const startDate = register('startDate');

  // A remounted date input has discarded any unfinished native edit. Recheck
  // an existing error so a previous badInput message cannot linger.
  useEffect(() => {
    if (getFieldState('startDate').invalid) void trigger('startDate');
  }, [getFieldState, trigger]);

  return (
    <>
      <TextField
        {...register('rentalDuration')}
        id='rentalDuration'
        label={translations.duration}
        requirementLabel={translations.required}
        error={errors.rentalDuration?.message}
        type='number'
        min={SELECTION_LIMITS.rentalDuration.min}
        max={SELECTION_LIMITS.rentalDuration.max}
        step={1}
        inputMode='numeric'
        required
        defaultValue={getValues('rentalDuration')}
      />
      <SelectField
        {...register('rentalUnit')}
        id='rentalUnit'
        label={translations.durationUnit}
        error={errors.rentalUnit?.message}
        defaultValue={getValues('rentalUnit')}
      >
        <option value='weeks'>{translations.weeks}</option>
        <option value='months'>{translations.months}</option>
      </SelectField>
      <TextField
        {...startDate}
        ref={element => {
          startDate.ref(element);
          startDateRef.current = element;
        }}
        id='startDate'
        label={translations.startDate}
        requirementLabel={translations.optional}
        error={errors.startDate?.message}
        type='date'
        defaultValue={getValues('startDate')}
        onInput={() => {
          // Partial date edits can change native validity without changing "".
          if (touchedFields.startDate) void trigger('startDate');
        }}
      />
    </>
  );
}
