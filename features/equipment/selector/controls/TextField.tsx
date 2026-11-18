import type { ComponentPropsWithRef } from 'react';

import { CalendarIcon } from '../../../site/icons';
import type { NativeFieldProps } from '../types';
import { FormField } from './FormField';
import styles from './FieldControl.module.css';

type TextFieldProps = NativeFieldProps<ComponentPropsWithRef<'input'>>;

/**
 * A labelled input inside FormField; a date input gets the calendar icon.
 * Attributes it does not set itself, such as aria-* or data-*, are passed on
 * to the input.
 */
export function TextField({
  id,
  label,
  requirementLabel,
  help,
  error,
  ...inputProps
}: TextFieldProps) {
  return (
    <FormField
      id={id}
      label={label}
      requirementLabel={requirementLabel}
      help={help}
      error={error}
    >
      {controlProps => {
        const input = (
          <input {...inputProps} {...controlProps} className={styles.input} />
        );

        return inputProps.type === 'date' ? (
          <div className={styles.dateWrapper}>
            {input}
            <CalendarIcon />
          </div>
        ) : (
          input
        );
      }}
    </FormField>
  );
}
