import type { ReactNode } from 'react';

import { hasError } from '../../../../lib/forms/errors';
import messageStyles from './FieldMessage.module.css';
import styles from './RadioGroup.module.css';

type RadioGroupProps = {
  name: string;
  legend: string;
  hideLegend?: boolean;
  error?: string;
  before?: ReactNode;
  after?: ReactNode;
  children: ReactNode;
};

export function RadioGroup({
  name,
  legend,
  hideLegend = false,
  error,
  before,
  after,
  children
}: RadioGroupProps) {
  const hasFieldError = hasError(error);
  let groupLabel: string | undefined;
  if (hideLegend) {
    groupLabel = legend;
  }

  return (
    <fieldset
      className={styles.fieldset}
      aria-label={groupLabel}
      aria-describedby={hasFieldError ? `${name}-error` : undefined}
    >
      {!hideLegend && <legend className={styles.legend}>{legend}</legend>}
      {before}
      <div className={styles.choices}>{children}</div>
      {after}
      {hasFieldError && (
        <p id={`${name}-error`} className={messageStyles.error} role='alert'>
          {error}
        </p>
      )}
    </fieldset>
  );
}
