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
          Stable server markup avoids a hydration placeholder or layout shift.
          Show the light action in dark mode, and the dark action in light mode. */}
      <span className='dark-theme-only'>
        <SunIcon />
        <span className={styles.label}>{labels.switchToLight}</span>
      </span>
      <span className='light-theme-only'>
        <MoonIcon />
        <span className={styles.label}>{labels.switchToDark}</span>
      </span>
    </button>
  );
}
