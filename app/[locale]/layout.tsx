import { Analytics } from '@vercel/analytics/next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import { SiteShell } from '../../features/site/SiteShell';
import { getDictionary } from '../../lib/i18n/dictionaries';
import { isSupportedLocale, SUPPORTED_LOCALES } from '../../lib/i18n/locales';
import '../globals.css';

export const dynamicParams = false;

export const generateStaticParams = () =>
  SUPPORTED_LOCALES.map(locale => ({ locale }));

/**
 * One server root layout owns the document for every supported locale.
 *
 * 1. Resolve the locale from params supplied by Next's `[locale]` segment.
 *    Rewrites supply the default locale for unprefixed URLs: `/venta` serves
 *    `/es/venta` internally, so params.locale is 'es' while the URL stays `/venta`.
 *
 * 2. Validate before setting <html lang> or loading the dictionary.
 *    Unsupported locales return 404 instead of falling back to another language.
 *
 * 3. Keep SiteShell here so the header and footer persist during client-side
 *    navigation within the same locale. For example, `/venta` to `/alquiler`
 *    reuses the Spanish layout and its shell.
 *
 * 4. Pages supply their own content through children, inside that shared shell.
 *    The sales content is replaced by rental content; each page does not create
 *    another header or footer.
 *
 * 5. Switching languages changes the locale segment and can remount its subtree.
 *    For example, `/venta` to `/en/venta` uses the English dictionary and
 *    <html lang="en">. Shell persistence within one locale does not guarantee
 *    that the same shell instance survives a language change.
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
  const dictionary = await getDictionary(locale);

  return (
    <html lang={locale}>
      <head>
        <link rel='describedby' href='/llms.txt' type='text/plain' />
      </head>
      <body>
        <SiteShell locale={locale} dictionary={dictionary}>
          {children}
        </SiteShell>
        {/* All pages share this analytics mount. */}
        <Analytics />
      </body>
    </html>
  );
}
