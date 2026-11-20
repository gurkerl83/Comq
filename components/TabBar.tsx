'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

import styles from './TabBar.module.css';

type TabBarProps = {
  /** The tabs: Button elements with the tab variant. */
  children: ReactNode;
  /** The current tab's name; a new one glides that tab into view. */
  current: string;
  /** Places the bar and sets its border, padding or fill. */
  className?: string;
};

/** The sides of a bar on which tabs are scrolled out of view. */
type HiddenSides = 'none' | 'start' | 'end' | 'both';

/**
 * Read on which sides of a bar tabs are scrolled out of view. A tab counts
 * as hidden once more than one pixel of it is cut off, because browsers
 * report scroll positions as fractions that rarely add up exactly.
 *
 * @param bar - The scrolling bar.
 * @returns start when tabs are hidden before the first visible one, end when
 * tabs are hidden after the last, both, or none.
 */
function readHiddenSides(bar: HTMLElement): HiddenSides {
  const hiddenAtStart = bar.scrollLeft > 1;
  const hiddenAtEnd = bar.scrollLeft + bar.clientWidth < bar.scrollWidth - 1;

  if (hiddenAtStart && hiddenAtEnd) return 'both';
  if (hiddenAtStart) return 'start';
  return hiddenAtEnd ? 'end' : 'none';
}

/**
 * A row of tabs on one line, for Button elements with the tab variant.
 *
 * 1. When the tabs don't fit, the bar scrolls sideways and fades out on
 *    each side where tabs are hidden, so a cut-off label reads as "more
 *    this way" (TabBar.module.css draws the fade from data-hidden).
 * 2. The current tab, the one with data-current, glides to the middle of
 *    the bar when current changes: after a tap on a half-visible tab, and
 *    when the page opens on a tab that is out of view.
 */
export function TabBar({ children, current, className }: TabBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [hiddenSides, setHiddenSides] = useState<HiddenSides>('none');

  // Keep hiddenSides right when the widths change.
  // 1. The bar's width changes with the window; the tabs' width changes when
  //    a different set of tabs shows. ResizeObserver reports both, and
  //    reports once when it starts, which sets the first value.
  // 2. Scrolling changes neither width; onScroll below covers it.
  useEffect(() => {
    const bar = barRef.current;
    const tabs = tabsRef.current;
    if (!bar || !tabs) return;

    const observer = new ResizeObserver(() => {
      setHiddenSides(readHiddenSides(bar));
    });
    observer.observe(bar);
    observer.observe(tabs);
    return () => observer.disconnect();
  }, []);

  // Glide the current tab to the middle of the bar, as far as the bar can
  // scroll, so the tabs beside it show too.
  // 1. scrollTo moves only the bar. scrollIntoView would also scroll the
  //    page to the bar when the bar is out of sight.
  // 2. It glides or jumps as TabBar.module.css sets scroll-behavior.
  useEffect(() => {
    const bar = barRef.current;
    const tab = bar?.querySelector("[data-current='true']");
    if (!bar || !tab) return;

    const barBox = bar.getBoundingClientRect();
    const tabBox = tab.getBoundingClientRect();
    const tabStart = bar.scrollLeft + tabBox.left - barBox.left;
    const roomBesideTab = (barBox.width - tabBox.width) / 2;
    bar.scrollTo({ left: tabStart - roomBesideTab });
  }, [current]);

  return (
    <div
      ref={barRef}
      className={className ? `${styles.bar} ${className}` : styles.bar}
      data-hidden={hiddenSides}
      onScroll={event => setHiddenSides(readHiddenSides(event.currentTarget))}
    >
      <div ref={tabsRef} className={styles.tabs}>
        {children}
      </div>
    </div>
  );
}
