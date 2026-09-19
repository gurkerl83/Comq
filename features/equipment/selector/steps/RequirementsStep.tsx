import type { EquipmentEntry } from '../../catalogue';
import {
  AcquisitionMode,
  type EquipmentSelection,
  type SelectionErrors,
  type UpdateSelectionField
} from '../../selection';
import type { SelectorContent } from '../../selector-content';
import { SELECTION_LIMITS } from '../../selection-limits';
import { SelectField } from '../controls/SelectField';
import { TextAreaField } from '../controls/TextAreaField';
import { TextField } from '../controls/TextField';
import { AcquisitionChoices } from '../fields/AcquisitionChoices';
import { ConfigurationChoices } from '../fields/ConfigurationChoices';
import { RentalFields } from '../fields/RentalFields';
import styles from './RequirementsStep.module.css';

type RequirementsStepProps = {
  machine: EquipmentEntry;
  selection: EquipmentSelection;
  errors: SelectionErrors;
  onChange: UpdateSelectionField;
  onChangeEquipment: () => void;
  translations: SelectorContent;
};

/**
 * Show the selected equipment before asking for its configuration and enquiry
 * details. Change equipment asks the parent wizard to open Category while
 * keeping the draft. Selecting another machine resets its configuration;
 * the visitor's purchase/rental preference and rental details stay unchanged.
 */
export function RequirementsStep({
  machine,
  selection,
  errors,
  onChange,
  onChangeEquipment,
  translations
}: RequirementsStepProps) {
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
      {machine.variants.length > 0 && (
        <ConfigurationChoices
          variants={machine.variants}
          value={selection.variant}
          error={errors.variant}
          onChange={value => onChange('variant', value)}
          translations={translations}
        />
      )}
      <AcquisitionChoices
        value={selection.acquisition}
        error={errors.acquisition}
        onChange={value => onChange('acquisition', value)}
        translations={translations}
      />
      <div className={styles.fields}>
        {selection.acquisition === AcquisitionMode.Rental && (
          <RentalFields
            value={selection}
            errors={errors}
            onChange={onChange}
            translations={translations}
          />
        )}
        <div className={styles.quantity}>
          <TextField
            id='quantity'
            name='quantity'
            label={translations.quantity}
            requirementLabel={translations.required}
            error={errors.quantity}
            type='number'
            min={SELECTION_LIMITS.quantity.min}
            max={SELECTION_LIMITS.quantity.max}
            step={1}
            inputMode='numeric'
            required
            value={selection.quantity}
            onChange={event => onChange('quantity', event.target.value)}
          />
        </div>
        <SelectField
          id='country'
          name='country'
          label={translations.country}
          requirementLabel={translations.required}
          error={errors.country}
          required
          value={selection.country}
          onChange={event => onChange('country', event.target.value)}
        >
          <option value=''>{translations.selectCountry}</option>
          {translations.countries.map(country => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </SelectField>
        <TextField
          id='projectLocation'
          name='projectLocation'
          label={translations.projectLocation}
          requirementLabel={translations.optional}
          help={translations.projectLocationHelp}
          error={errors.projectLocation}
          type='text'
          value={selection.projectLocation}
          onChange={event => onChange('projectLocation', event.target.value)}
        />
        <div className={styles.fullWidth}>
          <TextAreaField
            id='notes'
            name='notes'
            label={translations.requirements}
            requirementLabel={translations.optional}
            help={translations.requirementsHelp}
            rows={4}
            error={errors.notes}
            value={selection.notes}
            onChange={event => onChange('notes', event.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
