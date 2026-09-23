import { useEffect, useRef, type ComponentPropsWithRef, type Ref } from 'react';

import {
  createHrefForLocale,
  type SupportedLocale
} from '../../../../lib/i18n/locales';
import { Link } from '../../../../components/Link';
import type { EquipmentEntry } from '../../types';
import type { SelectorContent } from '../../selector-content';
import { RadioOption } from '../controls/RadioOption';
import type { MachineCustomization } from '../types';
import { MachineConfiguration } from './MachineConfiguration';
import styles from './MachineOption.module.css';

type MachineOptionProps = {
  locale: SupportedLocale;
  entry: EquipmentEntry;
  checked: boolean;
  invalid: boolean;
  onChange: () => void;
  /**
   * Registers the actual radio for validation focus without owning its transition.
   */
  inputRef?: ComponentPropsWithRef<'input'>['ref'];
  /**
   * Reports native radio blur to the enquiry form.
   */
  onBlur?: ComponentPropsWithRef<'input'>['onBlur'];
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
  inputRef,
  onBlur,
  customizationRef,
  configurationError,
  translations,
  customization
}: MachineOptionProps) {
  const editing = customization?.editing ?? false;
  const customizeButton = useRef<HTMLButtonElement>(null);
  const wasEditing = useRef(false);
  useEffect(() => {
    // Opening leaves focus untouched. Apply/Cancel disappear when editing ends,
    // so return focus to the trigger without scrolling.
    if (!editing && wasEditing.current && checked)
      customizeButton.current?.focus({ preventScroll: true });
    wasEditing.current = editing;
  }, [editing, checked]);

  return (
    <div className={styles.option}>
      <RadioOption
        ref={inputRef}
        name='machine'
        value={entry.slug}
        checked={checked}
        onChange={onChange}
        onBlur={onBlur}
        required
        invalid={invalid}
        label={entry.name}
        description={entry.summary}
        appearance='sharedRows'
      />
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
