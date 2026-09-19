import type { getSelectionSummary } from '../../selection';
import type { SelectorContent } from '../../selector-content';
import type { SelectionStep } from '../../selection-steps';
import styles from './ReviewStep.module.css';

type ReviewStepProps = {
  rows: Readonly<ReturnType<typeof getSelectionSummary>>;
  onEdit: (step: SelectionStep) => void;
  translations: SelectorContent;
};

export function ReviewStep({ rows, onEdit, translations }: ReviewStepProps) {
  return (
    <>
      <dl className={styles.summary}>
        {rows.map(row => (
          <div key={row.label} className={styles.row}>
            <dt>{row.label}</dt>
            <dd>
              <span>{row.value}</span>
              <button
                className={styles.editButton}
                type='button'
                onClick={() => onEdit(row.step)}
                aria-label={`${translations.edit}: ${row.label}`}
              >
                {translations.edit}
              </button>
            </dd>
          </div>
        ))}
      </dl>
      <p className={styles.note}>{translations.confirmation}</p>
    </>
  );
}
