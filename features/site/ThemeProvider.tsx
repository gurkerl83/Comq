'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

/**
 * Both locale roots share one browser preference. Restore it before paint so
 * full page loads between Spanish and English keep the chosen appearance.
 * Server-rendered children remain static; no request cookies are needed.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemeProvider
      attribute='data-theme'
      defaultTheme='dark'
      enableSystem={false}
      storageKey='comq-theme'
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
}
