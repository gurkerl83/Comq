import type { ComponentPropsWithRef, KeyboardEvent, MouseEvent } from 'react';

import styles from './ChoiceCard.module.css';

/** Accept clicks and Enter/Space from the focused card itself. */
function handleCardActivation(
  event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>
): boolean {
  if (!('key' in event)) return true;
  if (event.target !== event.currentTarget) return false;
  if (event.key !== 'Enter' && event.key !== ' ') return false;

  event.preventDefault();
  return true;
}

type ChoiceCardProps = Omit<
  ComponentPropsWithRef<'div'>,
  'onClick' | 'onKeyDown' | 'tabIndex'
> & {
  /** Whether this card is the chosen one of its set. */
  selected: boolean;
  /** Choose this card; not called while it is already chosen. */
  onSelect: () => void;
};

/**
 * A card the visitor picks from a set, such as a category or a machine. A
 * click anywhere on it, or Enter or Space while the card itself has focus,
 * chooses it. data-selected marks the chosen card for ChoiceCard.module.css,
 * which also draws the card. onBlur is reported only when the card itself
 * loses focus, not a link or field inside it. className lays out the card's
 * content; other attributes, the ref and the children go to the div.
 */
export function ChoiceCard({
  selected,
  onSelect,
  onBlur,
  className,
  ...divProps
}: ChoiceCardProps) {
  /**
   * Choose the card when handleCardActivation accepts the event and the card
   * is not chosen yet; focus moves to the card without scrolling the page.
   *
   * @param event - The click or the key press on the card.
   */
  function selectCard(
    event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>
  ) {
    if (!handleCardActivation(event)) return;
    if (selected) return;
    event.currentTarget.focus({ preventScroll: true });
    onSelect();
  }

  return (
    <div
      {...divProps}
      className={className ? `${styles.card} ${className}` : styles.card}
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
