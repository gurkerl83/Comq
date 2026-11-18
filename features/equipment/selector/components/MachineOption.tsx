import type { Ref } from 'react';

import {
  createHrefForLocale,
  type SupportedLocale
} from '../../../../lib/i18n/locales';
import { Link } from '../../../../components/Link';
import type { EquipmentEntry } from '../../types';
import type { SelectorContent } from '../../selector-content';
import type { MachineCustomization } from '../types';
import { ChoiceCard } from '../controls/ChoiceCard';
import { MachineConfiguration } from './MachineConfiguration';
import styles from './MachineOption.module.css';

type MachineOptionProps = {
  locale: SupportedLocale;
  entry: EquipmentEntry;
  checked: boolean;
  onChange: () => void;
  /**
   * Registers the selectable card for validation focus.
   */
  selectionRef?: Ref<HTMLDivElement>;
  /**
   * Reports card blur to the enquiry form.
   */
  onBlur?: () => void;
  /**
   * Allows aggregate configuration errors to focus the selected Customize button.
   */
  customizationRef?: Ref<HTMLButtonElement>;
  translations: SelectorContent;
  /** Editing session, supplied only to the selected card. */
  customization?: MachineCustomization;
};

/**
 * One machine in the selector, drawn as a ChoiceCard: its name, summary,
 * details link and specifications, with Customize and the option editor on
 * the selected card.
 */
export function MachineOption({
  locale,
  entry,
  checked,
  onChange,
  selectionRef,
  onBlur,
  customizationRef,
  translations,
  customization
}: MachineOptionProps) {
  const editing = customization?.editing ?? false;

  return (
    <ChoiceCard
      ref={selectionRef}
      className={styles.option}
      selected={checked}
      onSelect={onChange}
      onBlur={onBlur}
    >
      <span className={styles.title}>{entry.name}</span>
      {customization &&
        !editing &&
        (entry.options.length > 0 || entry.extras.length > 0) && (
          <button
            ref={customizationRef}
            type='button'
            className={styles.customize}
            onClick={customization.onStart}
          >
            {translations.customize}
          </button>
        )}
      <p className={styles.description}>{entry.summary}</p>
      <Link
        onClick={event => event.stopPropagation()}
        className={styles.detailLink}
        href={createHrefForLocale(locale, `/equipos/${entry.slug}`)}
        target='_blank'
        rel='noopener noreferrer'
      >
        {translations.details}
      </Link>
      <div className={styles.configuration}>
        <MachineConfiguration
          entry={entry}
          customization={customization}
          translations={translations}
        />
      </div>
    </ChoiceCard>
  );
}
