import Link from 'next/link';

import {
  createHrefForLocale,
  type SupportedLocale
} from '../../lib/i18n/locales';
import type { Dictionary } from '../../lib/i18n/types';
import { SITE_NAME } from '../../lib/site/config';
import { BrandSymbol } from './BrandSymbol';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import styles from './SiteShell.module.css';

export function SiteNav({
  locale,
  dictionary
}: {
  locale: SupportedLocale;
  dictionary: Dictionary;
}) {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link
          className={styles.brandLink}
          href={createHrefForLocale(locale, '/')}
          aria-label={`${SITE_NAME} — ${dictionary.navigation.home}`}
        >
          <BrandSymbol className={styles.brandIcon} />
        </Link>
        <div className={styles.preferences}>
          <LanguageSwitcher
            locale={locale}
            label={dictionary.navigation.language}
          />
          <ThemeToggle labels={dictionary.theme} />
        </div>
      </div>
    </header>
  );
}
