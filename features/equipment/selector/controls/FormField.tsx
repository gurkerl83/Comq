import type { ReactNode } from 'react';

import { hasError } from '../../../../lib/forms/errors';
import type { FieldDetails } from '../types';
import styles from './FormField.module.css';
import messageStyles from './FieldMessage.module.css';

/** What FormField passes to its control. */
type FieldControlProps = {
  /** Connects the native label to the control. */
  id: string;
  /**
   * True while an error is shown; FieldControl.module.css draws the invalid
   * border from it.
   */
  'data-invalid': boolean;
};

type FormFieldProps = FieldDetails & {
  /** Renders the control; it receives the field id and data-invalid. */
  children: (props: FieldControlProps) => ReactNode;
};

/**
 * The label, the control and the help and error messages below it. The
 * control receives the field id, which the native label points at, and
 * data-invalid, which is true while an error is shown.
 */
export function FormField({
  id,
  label,
  requirementLabel,
  help,
  error,
  children
}: FormFieldProps) {
  const controlProps: FieldControlProps = {
    id,
    'data-invalid': hasError(error)
  };

  return (
    <div className={styles.field}>
      <label htmlFor={id}>
        {label}
        {requirementLabel && (
          <span className={messageStyles.requirement}>
            {' · '}
            {requirementLabel}
          </span>
        )}
      </label>
      {children(controlProps)}
      {help && <span className={messageStyles.help}>{help}</span>}
      {hasError(error) && <span className={messageStyles.error}>{error}</span>}
    </div>
  );
}
