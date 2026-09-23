import type { TextareaHTMLAttributes } from 'react';

import type { NativeFieldProps } from '../types';
import { FormField } from './FormField';
import styles from './FieldControl.module.css';

type TextAreaFieldProps = NativeFieldProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>
>;

export function TextAreaField({
  id,
  label,
  requirementLabel,
  help,
  error,
  'aria-describedby': describedBy,
  'aria-invalid': invalid,
  ...textareaProps
}: TextAreaFieldProps) {
  return (
    <FormField
      id={id}
      label={label}
      requirementLabel={requirementLabel}
      help={help}
      error={error}
      aria-describedby={describedBy}
      aria-invalid={invalid}
    >
      {controlProps => (
        <textarea
          {...textareaProps}
          {...controlProps}
          className={styles.textarea}
        />
      )}
    </FormField>
  );
}
