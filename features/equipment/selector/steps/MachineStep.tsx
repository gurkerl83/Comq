import { hasError } from '../../../../lib/forms/errors';
import type { SupportedLocale } from '../../../../lib/i18n/locales';
import { WHATSAPP_URL } from '../../../../lib/site/config';
import { Link } from '../../../../components/Link';
import type { EquipmentEntry } from '../../catalogue';
import type { EquipmentSelection } from '../../selection';
import type { ChoiceProps } from '../types';
import { MachineOption } from '../components/MachineOption';
import { RadioGroup } from '../controls/RadioGroup';
import styles from './MachineStep.module.css';

type MachineStepProps = ChoiceProps<EquipmentSelection['machine']> & {
  locale: SupportedLocale;
  machines: readonly EquipmentEntry[];
};

export function MachineStep({
  locale,
  machines,
  value,
  error,
  onChange,
  translations
}: MachineStepProps) {
  return (
    <RadioGroup
      name='machine'
      legend={translations.machine}
      hideLegend
      error={error}
      before={
        machines.length === 1 && (
          <p className={styles.help}>{translations.oneMachine}</p>
        )
      }
      after={
        !machines.length && (
          <p>
            {translations.noMachines}{' '}
            <Link native href={WHATSAPP_URL}>
              {translations.contact}
            </Link>
          </p>
        )
      }
    >
      {machines.map(entry => (
        <MachineOption
          key={entry.slug}
          locale={locale}
          entry={entry}
          checked={value === entry.slug}
          invalid={hasError(error)}
          onChange={() => onChange(entry.slug)}
          translations={translations}
        />
      ))}
    </RadioGroup>
  );
}
