import type { ComponentProps } from 'react';

import { Link, type LinkProps } from './Link';
import styles from './Button.module.css';

/** Every prop name of a union's members, not only the names they share. */
type KeysOfUnion<Props> = Props extends unknown ? keyof Props : never;

/**
 * A native button: button attributes, and none of the props only a link
 * takes, such as href, target or scroll. Listing those as undefined lets
 * TypeScript reject them; otherwise the union in ButtonProps would let them
 * through onto the button element.
 */
type NativeButtonProps = ComponentProps<'button'> & {
  [
    Key in Exclude<KeysOfUnion<LinkProps>, keyof ComponentProps<'button'>>
  ]?: undefined;
};

/**
 * Props for a button. Without href it is a native button and takes button
 * attributes. With href it is a link and takes every Link prop, routed or
 * native.
 */
export type ButtonProps = {
  /**
   * primary is filled with the action colour; secondary is outlined; text is
   * an underlined label without a box.
   */
  variant: 'primary' | 'secondary' | 'text';
} & (NativeButtonProps | LinkProps);

/**
 * One look for actions and for links that should read as actions.
 *
 * 1. Without href it renders a native button; with href it renders through
 *    Link, so the routing rules stay in Link.
 * 2. variant chooses the look. primary and secondary are boxes whose
 *    dimensions come from the --button-* values in app/theme.css; text is a
 *    label with its own, smaller dimensions.
 * 3. className only places the button in the caller's layout (width, margin,
 *    flex) or sets a --button-* value. It must not set a property the shared
 *    classes set, because the order of two stylesheets is not guaranteed.
 */
export function Button({ variant, className, ...props }: ButtonProps) {
  const look = `${styles.button} ${styles[variant]}`;
  const classes = className ? `${look} ${className}` : look;

  if (props.href === undefined) {
    return <button {...props} className={classes} />;
  }

  return <Link {...props} className={classes} />;
}
