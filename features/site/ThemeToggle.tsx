'use client';

import type { Dictionary } from '../../lib/i18n/types';
import { MoonIcon, SunIcon } from './icons';
import styles from './ThemeToggle.module.css';
import { useThemeToggle } from './useThemeToggle';

export function ThemeToggle({ labels }: { labels: Dictionary['theme'] }) {
  const toggleTheme = useThemeToggle();

  return (
    <button type='button' className={styles.toggle} onClick={toggleTheme}>
      {/* CSS follows the OS or manual theme for the icon and accessible action.
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
