import type { ReactNode } from 'react';

import type { SupportedLocale } from '../../lib/i18n/locales';
import type { Dictionary } from '../../lib/i18n/types';
import { SiteNav } from './SiteNav';
import { SiteFooter } from './SiteFooter';
import styles from './SiteShell.module.css';

/**
 * The locale layout owns this shell so navigation and footer markup persist
 * between pages in the same language. The root layout owns the document and
 * analytics; LanguageSwitcher reads the current pathname on navigation.
 */
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
    <div className={styles.shell}>
      <a className={styles.skipLink} href='#main-content'>
        {dictionary.navigation.skipToContent}
      </a>
      <SiteNav locale={locale} dictionary={dictionary} />
      <main id='main-content' tabIndex={-1}>
        {/* Pages own closing actions so service-specific quotes are not duplicated. */}
        {children}
      </main>
      <SiteFooter locale={locale} dictionary={dictionary} />
    </div>
  );
}
