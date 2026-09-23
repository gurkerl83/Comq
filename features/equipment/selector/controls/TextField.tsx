import type { ComponentPropsWithRef } from 'react';

import type { NativeFieldProps } from '../types';
import { FormField } from './FormField';
import styles from './FieldControl.module.css';

type TextFieldProps = NativeFieldProps<ComponentPropsWithRef<'input'>>;

export function TextField({
  id,
  label,
  requirementLabel,
  help,
  error,
  'aria-describedby': describedBy,
  'aria-invalid': invalid,
  ...inputProps
}: TextFieldProps) {
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
        <input {...inputProps} {...controlProps} className={styles.input} />
      )}
    </FormField>
  );
}
