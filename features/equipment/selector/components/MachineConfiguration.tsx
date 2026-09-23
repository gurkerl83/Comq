import {
  Controller,
  useForm,
  useWatch,
  type Control,
  type ResolverResult,
  type UseFormReturn,
  type UseFormRegister
} from 'react-hook-form';

import type {
  EquipmentEntry,
  EquipmentConfiguration,
  EquipmentExtra,
  EquipmentOption
} from '../../types';
import { createConfiguration, isValidConfiguration } from '../../configuration';
import type { SelectorContent } from '../../selector-content';
import type { MachineCustomization } from '../types';
import { ChevronDownIcon } from '../../../site/icons';
import controlStyles from '../controls/FieldControl.module.css';
import styles from './MachineConfiguration.module.css';

/** The selected card may edit choices; other cards show only model facts. */
type MachineConfigurationProps = {
  /** Specifications and supported options for this card. */
  entry: EquipmentEntry;
  /** Present only on the selected machine. */
  customization?: MachineCustomization;
  /** Localized labels for defaults, advice and actions. */
  translations: SelectorContent;
};

/** Keep native option controls outside the machine radio's label. */
export function MachineConfiguration({
  entry,
  customization,
  translations
}: MachineConfigurationProps) {
  if (customization?.editing) {
    return (
      <ConfigurationEditor
        entry={entry}
        customization={customization}
        translations={translations}
      />
    );
  }

  return (
    <ConfigurationFields
      entry={entry}
      customization={customization}
      configuration={customization?.value ?? createConfiguration(entry)}
      translations={translations}
    />
  );
}

/**
 * A temporary form exists only between Customize and Apply/Cancel.
 */
type ConfigurationEditorProps = MachineConfigurationProps & {
  /**
   * Applied values seed this session; only Apply updates the enquiry.
   */
  customization: MachineCustomization;
};

/**
 * Own the draft independently from the enquiry without nesting HTML forms.
 *
 * 1. Seed a separate RHF instance from the applied configuration.
 * 2. Register extras as an array and observe choices for default hints.
 * 3. Apply validates the complete draft before passing it to the enquiry.
 * 4. Cancel or unmounting discards the draft without changing the enquiry.
 *
 * The editor uses RHF's default onSubmit mode. Only choices need a value
 * subscription; native checkboxes retain their own edits.
 */
function ConfigurationEditor({
  entry,
  customization,
  translations
}: ConfigurationEditorProps) {
  const draftForm = useForm<EquipmentConfiguration>({
    defaultValues: customization.value,
    resolver: (values): ResolverResult<EquipmentConfiguration> =>
      isValidConfiguration(entry, values)
        ? { values, errors: {} }
        : {
            values: {},
            errors: {
              root: {
                configuration: {
                  type: 'validate',
                  message: translations.invalidConfiguration
                }
              }
            }
          }
  });
  const choices = useWatch({ control: draftForm.control, name: 'choices' });

  return (
    <ConfigurationFields
      entry={entry}
      customization={customization}
      configuration={{ ...customization.value, choices }}
      translations={translations}
      draftForm={draftForm}
    />
  );
}

/**
 * The same rows display applied values and the temporary editing session.
 */
type ConfigurationFieldsProps = MachineConfigurationProps & {
  /**
   * Values shown by the rows; extras remain native registered controls in edit mode.
   */
  configuration: EquipmentConfiguration;
  /**
   * Present only while editing; never shares the enquiry form's field registry.
   */
  draftForm?: UseFormReturn<EquipmentConfiguration>;
};

/**
 * Preserve specification rows and native controls in the existing card layout.
 */
function ConfigurationFields({
  entry,
  customization,
  configuration,
  translations,
  draftForm
}: ConfigurationFieldsProps) {
  const choices = customization ? configuration.choices : undefined;

  return (
    <div className={styles.configuration}>
      <dl className={styles.specifications}>
        {entry.specifications.map(specification => (
          <ConfigurationRow
            key={specification.id}
            id={`${entry.slug}-${specification.id}`}
            label={specification.label}
            baseValue={specification.value}
            option={entry.options.find(
              option => option.specificationId === specification.id
            )}
            choices={choices}
            control={draftForm?.control}
            translations={translations}
          />
        ))}
        {customization &&
          entry.options
            .filter(option => !option.specificationId)
            .map(option => (
              <ConfigurationRow
                key={option.id}
                id={`${entry.slug}-${option.id}`}
                label={option.label}
                baseValue={null}
                option={option}
                choices={choices}
                control={draftForm?.control}
                translations={translations}
              />
            ))}
      </dl>
      {customization && entry.extras.length > 0 && (
        <ConfigurationExtras
          extras={entry.extras}
          selectedIds={configuration.extras}
          register={draftForm?.register}
          translations={translations}
        />
      )}
      {draftForm && customization && (
        <ConfigurationActions
          onCancel={customization.onCancel}
          onApply={draftForm.handleSubmit(customization.onApply)}
          error={draftForm.formState.errors.root?.configuration?.message}
          isSubmitting={draftForm.formState.isSubmitting}
          translations={translations}
        />
      )}
    </div>
  );
}

type ConfigurationRowProps = {
  /** Machine slug and row ID combined into a stable accessibility prefix. */
  id: string;
  label: string;
  baseValue: string | null;
  option?: EquipmentOption;
  /** Undefined on unselected cards, which display the original model facts. */
  choices: EquipmentConfiguration['choices'] | undefined;
  /**
   * Owns nullable select values only while customization is open.
   */
  control?: Control<EquipmentConfiguration>;
  translations: SelectorContent;
};

/**
 * Render a specification or a nullable choice using the same row layout.
 * The Controller render callback maps between the select's empty string and
 * the configuration's null advice value. Default hints compare with the
 * catalogue default, not form dirty state.
 */
function ConfigurationRow({
  id,
  label,
  baseValue,
  option,
  choices,
  control,
  translations
}: ConfigurationRowProps) {
  const labelId = `${id}-label`;
  const defaultHintId = `${id}-default`;
  const selectedChoiceId = option ? choices?.[option.id] : undefined;
  const showDefaultHint =
    option && choices && selectedChoiceId !== option.defaultChoice;
  const defaultLabel = option?.choices.find(
    choice => choice.id === option.defaultChoice
  )?.label;
  let displayValue = baseValue;
  if (option && choices) {
    if (selectedChoiceId === null) {
      displayValue = translations.advice;
    } else {
      displayValue =
        option.choices.find(choice => choice.id === selectedChoiceId)?.label ??
        null;
    }
  }

  return (
    <div className={styles.row}>
      <dt id={labelId}>{label}</dt>
      <dd>
        {option && control && choices ? (
          <Controller
            control={control}
            name={`choices.${option.id}`}
            render={({ field }) => (
              <div className={controlStyles.selectWrapper}>
                <select
                  {...field}
                  aria-labelledby={labelId}
                  aria-describedby={showDefaultHint ? defaultHintId : undefined}
                  className={`${controlStyles.input} ${controlStyles.select}`}
                  value={field.value ?? ''}
                  onChange={event => field.onChange(event.target.value || null)}
                >
                  {option.choices.map(choice => (
                    <option key={choice.id} value={choice.id}>
                      {choice.label}
                      {choice.id === option.defaultChoice
                        ? ` · ${translations.defaultValue}`
                        : ''}
                    </option>
                  ))}
                  <option value=''>{translations.configurationAdvice}</option>
                </select>
                <ChevronDownIcon />
              </div>
            )}
          />
        ) : (
          <span>{displayValue ?? translations.notSpecified}</span>
        )}
        {showDefaultHint && (
          <span id={defaultHintId} className={styles.hint}>
            {translations.defaultValue}: {defaultLabel}
          </span>
        )}
      </dd>
    </div>
  );
}

type ConfigurationExtrasProps = {
  extras: EquipmentExtra[];
  selectedIds: string[];
  /**
   * Registers independent native checkboxes; absent in read-only mode.
   */
  register?: UseFormRegister<EquipmentConfiguration>;
  translations: SelectorContent;
};

/**
 * Register independent native extras while editing; list applied extras otherwise.
 * The editor's default extras array keeps even a single checkbox array-valued.
 */
function ConfigurationExtras({
  extras,
  selectedIds,
  register,
  translations
}: ConfigurationExtrasProps) {
  if (register) {
    return (
      <fieldset className={styles.extras}>
        <legend>{translations.optionalEquipment}</legend>
        {extras.map(extra => (
          <label key={extra.id} className={styles.check}>
            <input
              type='checkbox'
              {...register('extras')}
              value={extra.id}
              defaultChecked={selectedIds.includes(extra.id)}
            />
            {extra.label}
          </label>
        ))}
      </fieldset>
    );
  }

  const selectedExtras = extras.filter(extra => selectedIds.includes(extra.id));

  return (
    <dl className={styles.specifications}>
      <div className={styles.row}>
        <dt>{translations.optionalEquipment}</dt>
        <dd className={styles.extraValues}>
          {selectedExtras.length > 0 ? (
            <ul className={styles.extraList}>
              {selectedExtras.map(extra => (
                <li key={extra.id}>{extra.label}</li>
              ))}
            </ul>
          ) : (
            translations.noExtras
          )}
        </dd>
      </div>
    </dl>
  );
}

type ConfigurationActionsProps = {
  onCancel: () => void;
  onApply: () => void;
  /**
   * Whole-configuration validation feedback after an unsuccessful Apply.
   */
  error?: string;
  /**
   * Prevent duplicate applications while validation completes.
   */
  isSubmitting: boolean;
  translations: SelectorContent;
};

/**
 * Apply the local form through handleSubmit or discard it without submission.
 */
function ConfigurationActions({
  onCancel,
  onApply,
  error,
  isSubmitting,
  translations
}: ConfigurationActionsProps) {
  return (
    <div className={styles.actions}>
      <button type='button' onClick={onCancel}>
        {translations.cancelCustomization}
      </button>
      <button
        type='button'
        className={styles.apply}
        onClick={onApply}
        disabled={isSubmitting}
      >
        {translations.applyOptions}
      </button>
      {error && <p role='alert'>{error}</p>}
      <p className={styles.hint}>{translations.applyBeforeContinue}</p>
    </div>
  );
}
