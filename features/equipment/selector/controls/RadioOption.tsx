import type { ComponentPropsWithRef } from 'react';

import styles from './RadioOption.module.css';

/**
 * Native radio props with the label and appearance owned by this component.
 */
type RadioOptionProps = Omit<
  ComponentPropsWithRef<'input'>,
  'type' | 'className' | 'name' | 'value'
> & {
  /** Native group name, also used to locate the group's error message. */
  name: string;
  /** Answer submitted when this option is checked. */
  value: string;
  /** Visible label associated with the radio input. */
  label: string;
  /** Optional supporting text inside the label. */
  description?: string;
  /** Whether the group's exposed validation error applies to this input. */
  invalid?: boolean;
  /** Layout shared with the surrounding choice cards. */
  appearance?: 'card' | 'sharedRows';
};

export function RadioOption({
  name,
  value,
  label,
  description,
  invalid,
  appearance = 'card',
  'aria-describedby': describedBy,
  'aria-invalid': ariaInvalid,
  ...inputProps
}: RadioOptionProps) {
  const descriptionIds: string[] = [];
  if (describedBy) {
    descriptionIds.push(describedBy);
  }
  if (invalid) {
    descriptionIds.push(`${name}-error`);
  }
  const ariaDescribedBy = descriptionIds.join(' ') || undefined;

  return (
    <label className={`${styles.option} ${styles[appearance]}`}>
      <input
        {...inputProps}
        type='radio'
        name={name}
        value={value}
        aria-invalid={invalid ?? ariaInvalid}
        aria-describedby={ariaDescribedBy}
      />
      {description !== undefined ? (
        <span>
          <span className={styles.title}>{label}</span>
          <span className={styles.description}>{description}</span>
        </span>
      ) : (
        <span className={styles.title}>{label}</span>
      )}
    </label>
  );
}
