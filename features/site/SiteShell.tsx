import type { ReactNode } from 'react';

import type { SupportedLocale } from '../../lib/i18n/locales';
import type { Dictionary } from '../../lib/i18n/types';
import { SiteNav } from './SiteNav';
import { SiteFooter } from './SiteFooter';
import styles from './SiteShell.module.css';

/**
 * Pages supply their locale-free path so language links target the equivalent
 * page without a client routing hook. Keep navigation and footer markup shared;
 * the locale root layout owns the document and analytics.
 */
export function SiteShell({
  children,
  locale,
  dictionary,
  pathname
}: {
  children: ReactNode;
  locale: SupportedLocale;
  dictionary: Dictionary;
  pathname: string;
}) {
  return (
    <>
      <a className={styles.skipLink} href='#main-content'>
        {dictionary.navigation.skipToContent}
      </a>
      <SiteNav locale={locale} dictionary={dictionary} pathname={pathname} />
      <main id='main-content' tabIndex={-1}>
        {/* Pages own closing actions so service-specific quotes are not duplicated. */}
        {children}
      </main>
      <SiteFooter locale={locale} dictionary={dictionary} />
    </>
  );
}
