import type {
  EquipmentSelection,
  SelectionErrors,
  UpdateSelectionField
} from '../../selection';
import type { SelectorContent } from '../../selector-content';
import { SELECTION_LIMITS } from '../../selection-limits';
import { SelectField } from '../controls/SelectField';
import { TextField } from '../controls/TextField';

type RentalValues = Pick<
  EquipmentSelection,
  'rentalDuration' | 'rentalUnit' | 'startDate'
>;

type RentalFieldsProps = {
  value: RentalValues;
  errors: Pick<SelectionErrors, keyof RentalValues>;
  onChange: UpdateSelectionField<keyof RentalValues>;
  translations: SelectorContent;
};

export function RentalFields({
  value,
  errors,
  onChange,
  translations
}: RentalFieldsProps) {
  return (
    <>
      <TextField
        id='rentalDuration'
        name='rentalDuration'
        label={translations.duration}
        requirementLabel={translations.required}
        error={errors.rentalDuration}
        type='number'
        min={SELECTION_LIMITS.rentalDuration.min}
        max={SELECTION_LIMITS.rentalDuration.max}
        step={1}
        inputMode='numeric'
        required
        value={value.rentalDuration}
        onChange={event => onChange('rentalDuration', event.target.value)}
      />
      <SelectField
        id='rentalUnit'
        name='rentalUnit'
        label={translations.durationUnit}
        error={errors.rentalUnit}
        value={value.rentalUnit}
        onChange={event =>
          onChange(
            'rentalUnit',
            event.target.value === 'weeks' ? 'weeks' : 'months'
          )
        }
      >
        <option value='weeks'>{translations.weeks}</option>
        <option value='months'>{translations.months}</option>
      </SelectField>
      <TextField
        id='startDate'
        name='startDate'
        label={translations.startDate}
        requirementLabel={translations.optional}
        error={errors.startDate}
        type='date'
        value={value.startDate}
        onChange={event => onChange('startDate', event.target.value)}
      />
    </>
  );
}
