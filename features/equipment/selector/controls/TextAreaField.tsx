import type { ComponentPropsWithRef } from 'react';

import type { NativeFieldProps } from '../types';
import { FormField } from './FormField';
import styles from './FieldControl.module.css';

type TextAreaFieldProps = NativeFieldProps<ComponentPropsWithRef<'textarea'>>;

/**
 * A labelled textarea inside FormField. Attributes it does not set itself,
 * such as aria-* or data-*, are passed on to the textarea.
 */
export function TextAreaField({
  id,
  label,
  requirementLabel,
  help,
  error,
  ...textareaProps
}: TextAreaFieldProps) {
  return (
    <FormField
      id={id}
      label={label}
      requirementLabel={requirementLabel}
      help={help}
      error={error}
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
