import type { ReactNode } from 'react';

import type { SupportedLocale } from '../../lib/i18n/locales';
import type { Dictionary } from '../../lib/i18n/types';
import { SiteNav } from './SiteNav';
import { SiteFooter } from './SiteFooter';
import { QuoteInvitation } from './QuoteInvitation';
import styles from './SiteShell.module.css';

export function SiteShell({
  children,
  locale,
  dictionary
}: {
  children: ReactNode;
  locale: SupportedLocale;
  dictionary: Dictionary;
}) {
  return (
    <>
      <a className={styles.skipLink} href='#main-content'>
        {dictionary.navigation.skipToContent}
      </a>
      <SiteNav locale={locale} dictionary={dictionary} />
      <main id='main-content' tabIndex={-1}>
        {children}
        <QuoteInvitation dictionary={dictionary} />
      </main>
      <SiteFooter locale={locale} dictionary={dictionary} />
    </>
  );
}
