import {
  useEffect,
  useRef,
  type KeyboardEvent,
  type MouseEvent,
  type Ref
} from 'react';

import {
  createHrefForLocale,
  type SupportedLocale
} from '../../../../lib/i18n/locales';
import { Link } from '../../../../components/Link';
import type { EquipmentEntry } from '../../types';
import type { SelectorContent } from '../../selector-content';
import type { MachineCustomization } from '../types';
import { MachineConfiguration } from './MachineConfiguration';
import styles from './MachineOption.module.css';

/** Accept clicks and Enter/Space from the focused card itself. */
function handleCardActivation(
  event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>
): boolean {
  if (!('key' in event)) return true;
  if (event.target !== event.currentTarget) return false;
  if (event.key !== 'Enter' && event.key !== ' ') return false;

  event.preventDefault();
  return true;
}

type MachineOptionProps = {
  locale: SupportedLocale;
  entry: EquipmentEntry;
  checked: boolean;
  invalid: boolean;
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
  /**
   * Feedback linked to the selected card's configuration trigger.
   */
  configurationError?: string;
  translations: SelectorContent;
  /** Editing session, supplied only to the selected card. */
  customization?: MachineCustomization;
};

export function MachineOption({
  locale,
  entry,
  checked,
  invalid,
  onChange,
  selectionRef,
  onBlur,
  customizationRef,
  configurationError,
  translations,
  customization
}: MachineOptionProps) {
  const editing = customization?.editing ?? false;
  const titleId = `machine-${entry.slug}-title`;
  const summaryId = `machine-${entry.slug}-summary`;
  const customizeButton = useRef<HTMLButtonElement>(null);
  const wasEditing = useRef(false);
  useEffect(() => {
    // Opening leaves focus untouched. Apply/Cancel disappear when editing ends,
    // so return focus to the trigger without scrolling.
    if (!editing && wasEditing.current && checked)
      customizeButton.current?.focus({ preventScroll: true });
    wasEditing.current = editing;
  }, [editing, checked]);

  function selectCard(
    event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>
  ) {
    if (!handleCardActivation(event)) return;
    if (checked) return;
    event.currentTarget.focus({ preventScroll: true });
    onChange();
  }

  return (
    <div
      ref={selectionRef}
      className={styles.option}
      role='group'
      tabIndex={0}
      aria-current={checked || undefined}
      aria-invalid={invalid}
      aria-labelledby={titleId}
      aria-describedby={invalid ? `${summaryId} machine-error` : summaryId}
      aria-keyshortcuts='Enter Space'
      onClick={selectCard}
      onKeyDown={selectCard}
      onBlur={event => {
        if (event.target === event.currentTarget) onBlur?.();
      }}
    >
      <span id={titleId} className={styles.title}>
        {entry.name}
      </span>
      <p id={summaryId} className={styles.description}>
        {entry.summary}
      </p>
      {customization &&
        (entry.options.length > 0 || entry.extras.length > 0) && (
          <button
            ref={button => {
              customizeButton.current = button;
              if (typeof customizationRef === 'function')
                return customizationRef(button);
              if (customizationRef) customizationRef.current = button;
            }}
            type='button'
            className={styles.customize}
            aria-expanded={editing}
            aria-controls={`${entry.slug}-configuration`}
            aria-disabled={editing}
            aria-invalid={Boolean(configurationError) || undefined}
            aria-describedby={
              configurationError ? 'configuration-error' : undefined
            }
            onClick={() => {
              if (!editing) customization.onStart();
            }}
          >
            {translations.customize}
          </button>
        )}
      <div id={`${entry.slug}-configuration`} className={styles.configuration}>
        <MachineConfiguration
          entry={entry}
          customization={customization}
          translations={translations}
        />
      </div>
      <Link
        onClick={event => event.stopPropagation()}
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
