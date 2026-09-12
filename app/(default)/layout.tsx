import type { ReactNode } from 'react';

import { SiteShell } from '../../features/site/SiteShell';
import { getDictionary } from '../../lib/i18n/dictionaries';
import { DEFAULT_LOCALE } from '../../lib/i18n/locales';
import '../globals.css';

/**
 * The default language has its own native root layout so Spanish can live at
 * `/` and still declare the document language in the server-rendered HTML.
 * The prefixed branch shares presentation through SiteShell.
 */
export default async function DefaultLocaleLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  const dictionary = await getDictionary(DEFAULT_LOCALE);

  return (
    <html lang={DEFAULT_LOCALE}>
      <head>
        <link rel='describedby' href='/llms.txt' type='text/plain' />
      </head>
      <body>
        <SiteShell locale={DEFAULT_LOCALE} dictionary={dictionary}>
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
