import type { ComponentPropsWithRef } from 'react';

import styles from './RadioOption.module.css';

/**
 * Native radio props with the label and appearance owned by this component.
 */
type RadioOptionProps = Omit<
  ComponentPropsWithRef<'input'>,
  'type' | 'className' | 'name' | 'value'
> & {
  /** Native group name. */
  name: string;
  /** Answer submitted when this option is checked. */
  value: string;
  /** Visible label associated with the radio input. */
  label: string;
  /** Optional supporting text inside the label. */
  description?: string;
};

/**
 * A native radio inside a card label, with a title and an optional
 * description. Attributes it does not set itself, such as aria-* or data-*,
 * are passed on to the input; type, name and value are its own.
 */
export function RadioOption({
  name,
  value,
  label,
  description,
  ...inputProps
}: RadioOptionProps) {
  return (
    <label className={`${styles.option} ${styles.card}`}>
      <input {...inputProps} type='radio' name={name} value={value} />
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
