import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import { SiteShell } from '../../../features/site/SiteShell';
import { getDictionary } from '../../../lib/i18n/dictionaries';
import { isPrefixedLocale, PREFIXED_LOCALES } from '../../../lib/i18n/locales';
import '../../globals.css';

export const dynamicParams = false;

export const generateStaticParams = () =>
  PREFIXED_LOCALES.map(locale => ({ locale }));

/**
 * Only non-default languages have a public locale prefix. Validate the URL
 * instead of silently falling back to Spanish for an unsupported locale.
 * Switching root layouts performs a full page load under normal Next routing.
 */
export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) notFound();
  const dictionary = await getDictionary(locale);

  return (
    // The provider restores data-theme and color-scheme before hydration.
    <html lang={locale} data-theme='dark' suppressHydrationWarning>
      <head>
        <link rel='describedby' href='/llms.txt' type='text/plain' />
      </head>
      <body>
        <SiteShell locale={locale} dictionary={dictionary}>
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
