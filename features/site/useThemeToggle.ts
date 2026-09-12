'use client';

import { useCallback, useLayoutEffect } from 'react';

type Theme = 'light' | 'dark';

// Browser-only interactions set this temporary choice. It survives client
// navigation, but a full reload starts from the OS preference again.
let manualTheme: Theme | undefined;

/**
 * Toggle the native CSS color scheme without a provider or persistent storage.
 * CSS handles the initial OS preference, live OS changes and visible controls.
 * Browser APIs are used only after mounting or in response to a click.
 */
export function useThemeToggle() {
  useLayoutEffect(() => {
    /*
     * Why this effect exists:
     * 1. CSS handles the OS default. Without a manual choice, do nothing.
     * 2. Language navigation can remount the locale root and clear <html>'s
     *    data-theme attribute. Restore the manual choice before paint.
     * 3. Keep the choice in memory on unmount so navigation preserves it.
     *    A full reload resets that memory and returns to the OS preference.
     *
     * Example sequence:
     * 1. OS uses light mode -> CSS displays the light theme.
     * 2. User selects dark -> manualTheme and data-theme both become 'dark'.
     * 3. User switches ES to EN -> the new locale root can clear data-theme.
     * 4. This effect restores 'dark' before paint -> the page stays dark.
     * 5. User reloads -> manualTheme resets -> CSS follows the light OS again.
     */
    if (manualTheme) {
      document.documentElement.dataset.theme = manualTheme;
    }
  }, []);

  return useCallback(() => {
    let isDarkTheme = manualTheme === 'dark';

    if (manualTheme === undefined) {
      isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (isDarkTheme) {
      manualTheme = 'light';
    } else {
      manualTheme = 'dark';
    }

    document.documentElement.dataset.theme = manualTheme;
  }, []);
}
