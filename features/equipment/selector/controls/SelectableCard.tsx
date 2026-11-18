import type { ComponentProps, KeyboardEvent, MouseEvent } from 'react';

import { Card } from '../../../../components/Card';
import styles from './SelectableCard.module.css';

/**
 * Decide whether a click or a key press on a card counts as choosing it.
 *
 * 1. A click counts wherever it lands in the card; a link that must not
 *    choose the card stops its own click, as the details link does.
 * 2. A key press counts only while the card itself has focus, so keys in a
 *    link, button or field inside the card stay with that element.
 * 3. Only Enter and Space count, as on a button, and their default action is
 *    prevented.
 *
 * @param event - The click or the key press the card received.
 * @returns True when the event counts as choosing the card.
 */
function handleCardActivation(
  event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>
): boolean {
  if (!('key' in event)) return true;
  if (event.target !== event.currentTarget) return false;
  if (event.key !== 'Enter' && event.key !== ' ') return false;

  // The card is a div, not a button, so Space would scroll the page.
  event.preventDefault();
  return true;
}

type SelectableCardProps = Omit<
  ComponentProps<typeof Card>,
  'as' | 'onClick' | 'onKeyDown' | 'tabIndex'
> & {
  /**
   * True while this card is the current choice. The caller computes it from
   * the form value on every render, so it is not a starting value like
   * defaultChecked.
   */
  selected: boolean;
  /** Choose this card; not called while it is already chosen. */
  onSelect: () => void;
};

/**
 * A card the visitor picks from a set, such as a category or a machine. A
 * click anywhere on it, or Enter or Space while the card itself has focus,
 * chooses it. It is a Card; SelectableCard.module.css adds the pointer and,
 * through data-selected, the look of the chosen card. onBlur is reported only
 * when the card itself loses focus, not a link or field inside it. className
 * lays out the card's content; other attributes, the ref and the children go
 * to the Card.
 */
export function SelectableCard({
  selected,
  onSelect,
  onBlur,
  className,
  ...cardProps
}: SelectableCardProps) {
  const classes = className ? `${styles.card} ${className}` : styles.card;

  /**
   * Choose the card when handleCardActivation accepts the event and the card
   * is not chosen yet; focus moves to the card without scrolling the page.
   *
   * @param event - The click or the key press on the card.
   */
  function selectCard(
    event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>
  ) {
    if (!handleCardActivation(event)) return;
    if (selected) return;
    event.currentTarget.focus({ preventScroll: true });
    onSelect();
  }

  return (
    <Card
      {...cardProps}
      className={classes}
      data-selected={selected}
      tabIndex={0}
      onClick={selectCard}
      onKeyDown={selectCard}
      onBlur={event => {
        if (event.target === event.currentTarget) onBlur?.(event);
      }}
    />
  );
}
