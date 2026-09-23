import type { ComponentPropsWithRef } from 'react';

import { ChevronDownIcon } from '../../../site/icons';
import type { NativeFieldProps } from '../types';
import { FormField } from './FormField';
import styles from './FieldControl.module.css';

type SelectFieldProps = NativeFieldProps<ComponentPropsWithRef<'select'>>;

export function SelectField({
  id,
  label,
  requirementLabel,
  help,
  error,
  'aria-describedby': describedBy,
  'aria-invalid': invalid,
  children,
  ...selectProps
}: SelectFieldProps) {
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
        <div className={styles.selectWrapper}>
          <select
            {...selectProps}
            {...controlProps}
            className={`${styles.input} ${styles.select}`}
          >
            {children}
          </select>
          <ChevronDownIcon />
        </div>
      )}
    </FormField>
  );
}
