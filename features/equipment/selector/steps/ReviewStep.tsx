import { useFormContext, useWatch } from 'react-hook-form';

import { Button } from '../../../../components/Button';
import type { SupportedLocale } from '../../../../lib/i18n/locales';
import { WHATSAPP_URL } from '../../../../lib/site/config';
import type { EquipmentEntry } from '../../types';
import {
  createEnquiryMessage,
  getSelectionSummary,
  type EquipmentSelection
} from '../../selection';
import { WizardActions } from '../WizardActions';
import type { SelectorContent } from '../../selector-content';
import type { SelectionStep } from '../../selection-steps';
import styles from './ReviewStep.module.css';

/**
 * Catalogue context, localized copy and navigation for reviewing the enquiry.
 */
type ReviewStepProps = {
  /** Locale used for summary numbers and dates. */
  locale: SupportedLocale;
  /** Validated machine whose applied options appear in the enquiry. */
  machine: EquipmentEntry;
  /** Return to Requirements without losing answers. */
  onBack: () => void;
  /** Open the step that owns an answer while preserving the enquiry. */
  onEdit: (step: SelectionStep) => void;
  /** Summary labels, action text and WhatsApp message wording. */
  translations: SelectorContent;
};

/**
 * Subscribe to the complete enquiry only while its review is visible.
 * The same rows drive the displayed answers and the explicit WhatsApp link.
 */
export function ReviewStep({
  locale,
  machine,
  onBack,
  onEdit,
  translations
}: ReviewStepProps) {
  const { control } = useFormContext<EquipmentSelection>();
  const { rows, message } = useWatch({
    control,
    compute: selection => {
      const rows = getSelectionSummary(
        locale,
        selection,
        machine,
        translations
      );
      return {
        rows,
        message: createEnquiryMessage(rows, selection.acquisition, translations)
      };
    }
  });

  return (
    <>
      <dl className={styles.summary}>
        {rows.map(row => (
          <div key={row.label} className={styles.row}>
            <dt>{row.label}</dt>
            <dd>
              <span>{row.value}</span>
              <Button
                variant='text'
                type='button'
                onClick={() => onEdit(row.step)}
                aria-label={`${translations.edit}: ${row.label}`}
              >
                {translations.edit}
              </Button>
            </dd>
          </div>
        ))}
      </dl>
      <p className={styles.note}>{translations.confirmation}</p>
      <WizardActions
        onBack={onBack}
        backLabel={translations.back}
        nextLabel={translations.next}
        nextDisabled={false}
        isLastStep
        finalAction={
          <Button
            native
            variant='primary'
            href={`${WHATSAPP_URL}?text=${encodeURIComponent(message)}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            {translations.send}
          </Button>
        }
      />
    </>
  );
}
