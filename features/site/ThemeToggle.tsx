'use client';

import { useTheme } from 'next-themes';

import type { Dictionary } from '../../lib/i18n/types';
import { MoonIcon, SunIcon } from './icons';
import styles from './ThemeToggle.module.css';

export function ThemeToggle({ labels }: { labels: Dictionary['theme'] }) {
  const { setTheme } = useTheme();

  return (
    <button
      type='button'
      className={styles.toggle}
      onClick={() =>
        setTheme(current => (current === 'light' ? 'dark' : 'light'))
      }
    >
      {/* CSS follows the pre-paint theme for both the icon and accessible action.
          Stable server markup avoids a hydration placeholder or layout shift. */}
      <span className={styles.lightAction}>
        <SunIcon />
        <span className={styles.label}>{labels.switchToLight}</span>
      </span>
      <span className={styles.darkAction}>
        <MoonIcon />
        <span className={styles.label}>{labels.switchToDark}</span>
      </span>
    </button>
  );
}
