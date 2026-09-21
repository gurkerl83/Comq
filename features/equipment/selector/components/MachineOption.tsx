import {
  createHrefForLocale,
  type SupportedLocale
} from '../../../../lib/i18n/locales';
import { Link } from '../../../../components/Link';
import type { EquipmentEntry } from '../../catalogue';
import type { SelectorContent } from '../../selector-content';
import { RadioOption } from '../controls/RadioOption';
import { Specifications } from './Specifications';
import styles from './MachineOption.module.css';

type MachineOptionProps = {
  locale: SupportedLocale;
  entry: EquipmentEntry;
  checked: boolean;
  invalid: boolean;
  onChange: () => void;
  translations: SelectorContent;
};

export function MachineOption({
  locale,
  entry,
  checked,
  invalid,
  onChange,
  translations
}: MachineOptionProps) {
  return (
    <div className={styles.option}>
      <RadioOption
        name='machine'
        value={entry.slug}
        checked={checked}
        onChange={onChange}
        required
        invalid={invalid}
        label={entry.name}
        description={entry.summary}
        appearance='sharedRows'
      />
      <Specifications
        items={entry.specifications}
        fallback={translations.notSpecified}
      />
      <Link
        className={styles.detailLink}
        href={createHrefForLocale(locale, `/equipos/${entry.slug}`)}
        target='_blank'
        rel='noopener noreferrer'
        aria-label={`${translations.details}: ${entry.name} (${translations.opensNewTab})`}
      >
        {translations.details}
      </Link>
    </div>
  );
}
