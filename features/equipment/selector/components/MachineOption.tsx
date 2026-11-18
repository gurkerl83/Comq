import type { Ref, RefCallback } from 'react';

import {
  createHrefForLocale,
  type SupportedLocale
} from '../../../../lib/i18n/locales';
import { Link } from '../../../../components/Link';
import type { EquipmentEntry } from '../../types';
import type { SelectorContent } from '../../selector-content';
import type { MachineCustomization } from '../types';
import { SelectableCard } from '../controls/SelectableCard';
import { MachineConfiguration } from './MachineConfiguration';
import styles from './MachineOption.module.css';

type MachineOptionProps = {
  locale: SupportedLocale;
  entry: EquipmentEntry;
  checked: boolean;
  onChange: () => void;
  /**
   * The machine field's ref from React Hook Form, attached to the card, so
   * setFocus('machine') can focus it when no machine is chosen.
   */
  ref?: RefCallback<HTMLElement>;
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
 * One machine in the selector, drawn as a SelectableCard: its name, summary,
 * details link and specifications, with Customize and the option editor on
 * the selected card.
 */
export function MachineOption({
  locale,
  entry,
  checked,
  onChange,
  ref,
  onBlur,
  customizationRef,
  translations,
  customization
}: MachineOptionProps) {
  const editing = customization?.editing ?? false;

  return (
    <SelectableCard
      ref={ref}
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
    </SelectableCard>
  );
}
