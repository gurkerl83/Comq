import type { HTMLAttributes, RefCallback } from 'react';

import styles from './Card.module.css';

/**
 * Props for a card: as chooses the element, a div or a list item, and the
 * other props are HTML attributes both take. The ref is a callback ref, such
 * as React Hook Form's, because a callback fits either element.
 */
type CardProps = HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'li';
  ref?: RefCallback<HTMLElement>;
};

/**
 * The frame every card shares, as Button is the look every action shares.
 *
 * 1. It renders a div; with as='li' it renders a list item, for a card that is
 *    itself an item of a list grid.
 * 2. The frame comes from Card.module.css: padding, border, corners and the
 *    fill from --card-background in app/theme.css, which a section can set
 *    for the cards inside it.
 * 3. className lays out the card's content. It must not set padding, border,
 *    border-radius or background in a plain class rule, because the order of
 *    two stylesheets is not guaranteed; a more specific rule, such as :hover,
 *    may.
 * 4. Other attributes, the ref and the children go to the element.
 */
export function Card({ as: Element = 'div', className, ...props }: CardProps) {
  const classes = className ? `${styles.card} ${className}` : styles.card;

  return <Element {...props} className={classes} />;
}
