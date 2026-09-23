import type { ReactNode, Ref } from 'react';
import { useFormContext, useFormState, useWatch } from 'react-hook-form';

import { hasError } from '../../../../lib/forms/errors';
import type { SupportedLocale } from '../../../../lib/i18n/locales';
import { WHATSAPP_URL } from '../../../../lib/site/config';
import { Link } from '../../../../components/Link';
import type { EquipmentEntry } from '../../types';
import type { EquipmentSelection } from '../../selection';
import type { MachineCustomization } from '../types';
import type { SelectorContent } from '../../selector-content';
import { MachineOption } from '../components/MachineOption';
import { RadioGroup } from '../controls/RadioGroup';
import styles from './MachineStep.module.css';

/**
 * Available machines, selection actions and configuration-error focus target.
 */
type MachineStepProps = {
  /** Apply the machine and its defaults together. */
  onChange: (value: EquipmentSelection['machine']) => void;
  /** Localized labels and configuration actions. */
  translations: SelectorContent;
  /** Locale used by links to individual machine pages. */
  locale: SupportedLocale;
  /** Machines available in the selected equipment category. */
  machines: readonly EquipmentEntry[];
  /**
   * The selected machine's current configuration and actions to customize it.
   */
  customization: MachineCustomization;
  /** Focus target for a configuration error after this step mounts. */
  customizationRef: Ref<HTMLButtonElement>;
};

export function MachineStep({
  locale,
  machines,
  onChange,
  translations,
  customization,
  customizationRef
}: MachineStepProps) {
  const { control, register } = useFormContext<EquipmentSelection>();

  const selectedMachineSlug = useWatch({ control, name: 'machine' });
  const { errors } = useFormState({
    control,
    name: ['machine', 'configuration']
  });

  // The wizard handles machine changes together with configuration resets.
  // Keep RHF's native registration and blur handling.
  const { ref, onBlur } = register('machine');

  const machineError = errors.machine?.message;
  const configurationError = errors.configuration?.message;

  let feedback: ReactNode = null;
  if (machines.length === 0) {
    feedback = (
      <p>
        {translations.noMachines}{' '}
        <Link native href={WHATSAPP_URL}>
          {translations.contact}
        </Link>
      </p>
    );
  } else if (configurationError) {
    feedback = (
      <p id='configuration-error' role='alert'>
        {configurationError}
      </p>
    );
  }

  return (
    <RadioGroup
      name='machine'
      legend={translations.machine}
      hideLegend
      error={machineError}
      before={
        machines.length === 1 && (
          <p className={styles.help}>{translations.oneMachine}</p>
        )
      }
      after={feedback}
    >
      {machines.map(entry => (
        <MachineOption
          key={entry.slug}
          locale={locale}
          entry={entry}
          checked={selectedMachineSlug === entry.slug}
          invalid={hasError(machineError)}
          onChange={() => onChange(entry.slug)}
          inputRef={ref}
          onBlur={onBlur}
          customizationRef={
            selectedMachineSlug === entry.slug ? customizationRef : undefined
          }
          configurationError={
            selectedMachineSlug === entry.slug ? configurationError : undefined
          }
          translations={translations}
          customization={
            selectedMachineSlug === entry.slug ? customization : undefined
          }
        />
      ))}
    </RadioGroup>
  );
}
