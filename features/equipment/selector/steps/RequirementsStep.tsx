import type { RefObject } from 'react';
import { useFormContext, useFormState, useWatch } from 'react-hook-form';

import type { EquipmentEntry } from '../../types';
import { AcquisitionMode, type EquipmentSelection } from '../../selection';
import type { SelectorContent } from '../../selector-content';
import { SELECTION_LIMITS } from '../../selection-limits';
import { SelectField } from '../controls/SelectField';
import { TextAreaField } from '../controls/TextAreaField';
import { TextField } from '../controls/TextField';
import { AcquisitionChoices } from '../fields/AcquisitionChoices';
import { RentalFields } from '../fields/RentalFields';
import styles from './RequirementsStep.module.css';

/**
 * Selected equipment context and navigation surrounding the enquiry fields.
 */
type RequirementsStepProps = {
  /** Applied machine displayed above the commercial requirements. */
  machine: EquipmentEntry;
  /** Return to equipment selection while preserving entered requirements. */
  onChangeEquipment: () => void;
  /** Labels, country options, help text and requirement hints. */
  translations: SelectorContent;
  /** Native date input used by the resolver to detect unfinished edits. */
  startDateRef: RefObject<HTMLInputElement | null>;
};

/**
 * Show the selected machine and collect project and commercial requirements.
 * Change equipment opens Category while retaining the applied enquiry.
 * Selecting another machine resets its configuration and preserves requirements.
 */
export function RequirementsStep({
  machine,
  onChangeEquipment,
  translations,
  startDateRef
}: RequirementsStepProps) {
  const { control, register, getValues } = useFormContext<EquipmentSelection>();

  const acquisition = useWatch({ control, name: 'acquisition' });
  const { errors } = useFormState({
    control,
    name: ['quantity', 'country', 'projectLocation', 'notes'],
    exact: true
  });

  return (
    <div className={styles.requirements}>
      <div className={styles.selectedEquipment}>
        <p className={styles.selectedMachine}>
          <strong>{machine.name}</strong>
          <span>{machine.categoryName}</span>
        </p>
        <button
          type='button'
          className={styles.changeEquipment}
          onClick={onChangeEquipment}
        >
          {translations.changeEquipment}
        </button>
      </div>
      <AcquisitionChoices translations={translations} />
      <div className={styles.fields}>
        {acquisition === AcquisitionMode.Rental && (
          <RentalFields
            translations={translations}
            startDateRef={startDateRef}
          />
        )}
        <div className={styles.quantity}>
          <TextField
            {...register('quantity')}
            id='quantity'
            label={translations.quantity}
            requirementLabel={translations.required}
            error={errors.quantity?.message}
            type='number'
            min={SELECTION_LIMITS.quantity.min}
            max={SELECTION_LIMITS.quantity.max}
            step={1}
            inputMode='numeric'
            required
            defaultValue={getValues('quantity')}
          />
        </div>
        <SelectField
          {...register('country')}
          id='country'
          label={translations.country}
          requirementLabel={translations.required}
          error={errors.country?.message}
          required
          defaultValue={getValues('country')}
        >
          <option value=''>{translations.selectCountry}</option>
          {translations.countries.map(country => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </SelectField>
        <TextField
          {...register('projectLocation')}
          id='projectLocation'
          label={translations.projectLocation}
          requirementLabel={translations.optional}
          help={translations.projectLocationHelp}
          error={errors.projectLocation?.message}
          type='text'
          defaultValue={getValues('projectLocation')}
        />
        <div className={styles.fullWidth}>
          <TextAreaField
            {...register('notes')}
            id='notes'
            label={translations.requirements}
            requirementLabel={translations.optional}
            help={translations.requirementsHelp}
            rows={4}
            error={errors.notes?.message}
            defaultValue={getValues('notes')}
          />
        </div>
      </div>
    </div>
  );
}
