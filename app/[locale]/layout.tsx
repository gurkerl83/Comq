import { Analytics } from '@vercel/analytics/next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import { isSupportedLocale, SUPPORTED_LOCALES } from '../../lib/i18n/locales';
import '../globals.css';

export const dynamicParams = false;

export const generateStaticParams = () =>
  SUPPORTED_LOCALES.map(locale => ({ locale }));

/**
 * One server root layout owns the document for every supported locale.
 * Next supplies the `[locale]` segment through params, including Spanish when
 * an unprefixed URL is internally rewritten (for example, `/venta` to `/es/venta`).
 * Validate it before declaring the document language; unsupported values never
 * fall back to another language.
 */
export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  return (
    <html lang={locale}>
      <head>
        <link rel='describedby' href='/llms.txt' type='text/plain' />
      </head>
      <body>
        {children}
        {/* All pages share this analytics mount. */}
        <Analytics />
      </body>
    </html>
  );
}
