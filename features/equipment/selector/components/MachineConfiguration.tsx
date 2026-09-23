import type {
  EquipmentEntry,
  EquipmentConfiguration,
  EquipmentExtra,
  EquipmentOption
} from '../../types';
import { createConfiguration } from '../../configuration';
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
  const configuration =
    customization?.draft ?? customization?.value ?? createConfiguration(entry);
  const editing =
    customization?.draft !== null && customization?.draft !== undefined;
  const choices = customization ? configuration.choices : undefined;

  function changeChoice(optionId: string, choiceId: string | null) {
    customization?.onChange({
      ...configuration,
      choices: {
        ...configuration.choices,
        [optionId]: choiceId
      }
    });
  }

  function changeExtra(extraId: string, checked: boolean) {
    customization?.onChange({
      ...configuration,
      extras: checked
        ? [...configuration.extras, extraId]
        : configuration.extras.filter(id => id !== extraId)
    });
  }

  return (
    <div className={styles.configuration} data-validation-field='configuration'>
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
            editing={editing}
            onChange={changeChoice}
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
                editing={editing}
                onChange={changeChoice}
                translations={translations}
              />
            ))}
      </dl>
      {customization && entry.extras.length > 0 && (
        <ConfigurationExtras
          extras={entry.extras}
          selectedIds={configuration.extras}
          editing={editing}
          onChange={changeExtra}
          translations={translations}
        />
      )}
      {editing && customization && (
        <ConfigurationActions
          onCancel={customization.onCancel}
          onApply={customization.onApply}
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
  editing: boolean;
  onChange: (optionId: string, choiceId: string | null) => void;
  translations: SelectorContent;
};

function ConfigurationRow({
  id,
  label,
  baseValue,
  option,
  choices,
  editing,
  onChange,
  translations
}: ConfigurationRowProps) {
  const labelId = `${id}-label`;
  const defaultId = `${id}-default`;
  const selected = option ? choices?.[option.id] : undefined;
  const showDefaultHint =
    option && choices && selected !== option.defaultChoice;
  const defaultLabel = option?.choices.find(
    choice => choice.id === option.defaultChoice
  )?.label;
  const value =
    option && choices
      ? selected === null
        ? translations.advice
        : option.choices.find(choice => choice.id === selected)?.label
      : baseValue;

  return (
    <div className={styles.row}>
      <dt id={labelId}>{label}</dt>
      <dd>
        {option && editing && choices ? (
          <div className={controlStyles.selectWrapper}>
            <select
              name='configuration'
              aria-labelledby={labelId}
              aria-describedby={showDefaultHint ? defaultId : undefined}
              className={`${controlStyles.input} ${controlStyles.select}`}
              value={selected ?? ''}
              onChange={event =>
                onChange(option.id, event.target.value || null)
              }
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
        ) : (
          <span>{value ?? translations.notSpecified}</span>
        )}
        {showDefaultHint && (
          <span id={defaultId} className={styles.hint}>
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
  editing: boolean;
  onChange: (extraId: string, checked: boolean) => void;
  translations: SelectorContent;
};

function ConfigurationExtras({
  extras,
  selectedIds,
  editing,
  onChange,
  translations
}: ConfigurationExtrasProps) {
  if (editing) {
    return (
      <fieldset className={styles.extras}>
        <legend>{translations.optionalEquipment}</legend>
        {extras.map(extra => (
          <label key={extra.id} className={styles.check}>
            <input
              type='checkbox'
              name='configuration'
              value={extra.id}
              checked={selectedIds.includes(extra.id)}
              onChange={event => onChange(extra.id, event.target.checked)}
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
  translations: SelectorContent;
};

function ConfigurationActions({
  onCancel,
  onApply,
  translations
}: ConfigurationActionsProps) {
  return (
    <div className={styles.actions}>
      <button type='button' onClick={onCancel}>
        {translations.cancelCustomization}
      </button>
      <button type='button' className={styles.apply} onClick={onApply}>
        {translations.applyOptions}
      </button>
      <p className={styles.hint}>{translations.applyBeforeContinue}</p>
    </div>
  );
}
