import type { AriaAttributes, ReactNode } from 'react';

import type { FieldDetails } from '../types';
import { getFieldAccessibility } from './field-accessibility';
import styles from './FormField.module.css';
import messageStyles from './FieldMessage.module.css';

type FieldControlProps = Pick<
  AriaAttributes,
  'aria-describedby' | 'aria-invalid'
> & {
  id: string;
};

type FormFieldProps = FieldDetails &
  Pick<AriaAttributes, 'aria-describedby' | 'aria-invalid'> & {
    children: (props: FieldControlProps) => ReactNode;
  };

/**
 * Render the label, control and messages using one accessibility binding.
 * The helper supplies both message IDs and the control's references to them,
 * so removing a message also removes its generated reference. The native
 * label/control association continues to use the required field id.
 */
export function FormField({
  id,
  label,
  requirementLabel,
  help,
  error,
  'aria-describedby': describedBy,
  'aria-invalid': invalid,
  children
}: FormFieldProps) {
  const { helpId, errorId, attributes } = getFieldAccessibility({
    id,
    help,
    error,
    'aria-describedby': describedBy,
    'aria-invalid': invalid
  });
  const controlProps: FieldControlProps = { id, ...attributes };

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
      {helpId && (
        <span id={helpId} className={messageStyles.help}>
          {help}
        </span>
      )}
      {errorId && (
        <span id={errorId} className={messageStyles.error} role='alert'>
          {error}
        </span>
      )}
    </div>
  );
}
