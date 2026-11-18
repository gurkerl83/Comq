import type { ComponentPropsWithRef } from 'react';

import { ChevronDownIcon } from '../../../site/icons';
import type { NativeFieldProps } from '../types';
import { FormField } from './FormField';
import styles from './FieldControl.module.css';

type SelectFieldProps = NativeFieldProps<ComponentPropsWithRef<'select'>>;

/**
 * A labelled select inside FormField, with the chevron icon. Attributes it
 * does not set itself, such as aria-* or data-*, are passed on to the select.
 */
export function SelectField({
  id,
  label,
  requirementLabel,
  help,
  error,
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
