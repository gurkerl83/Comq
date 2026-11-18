import type { ComponentPropsWithRef, ReactNode } from 'react';

import { hasError } from '../../../../lib/forms/errors';
import type { WithoutClassName } from '../types';
import messageStyles from './FieldMessage.module.css';
import styles from './RadioGroup.module.css';

type RadioGroupProps = WithoutClassName<ComponentPropsWithRef<'fieldset'>> & {
  legend?: string;
  error?: string;
  before?: ReactNode;
  after?: ReactNode;
  children: ReactNode;
};

/**
 * A fieldset with an optional legend, the choices in a grid and the error
 * message below them. Attributes it does not set itself, such as aria-* or
 * data-*, are passed on to the fieldset.
 */
export function RadioGroup({
  legend,
  error,
  before,
  after,
  children,
  ...fieldsetProps
}: RadioGroupProps) {
  const hasFieldError = hasError(error);

  return (
    <fieldset {...fieldsetProps} className={styles.fieldset}>
      {legend && <legend className={styles.legend}>{legend}</legend>}
      {before}
      <div className={styles.choices}>{children}</div>
      {after}
      {hasFieldError && <p className={messageStyles.error}>{error}</p>}
    </fieldset>
  );
}
