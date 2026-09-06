import Link from 'next/link';

import {
  createHrefForLocale,
  type SupportedLocale
} from '../../lib/i18n/locales';
import type { Dictionary } from '../../lib/i18n/types';
import { SITE_NAME, WHATSAPP_URL } from '../../lib/site/config';
import { LanguageSwitcher } from './LanguageSwitcher';
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
          className={styles.wordmark}
          href={createHrefForLocale(locale, '/')}
        >
          {SITE_NAME}
        </Link>
        <nav
          className={styles.primaryNav}
          aria-label={dictionary.navigation.primary}
        >
          <Link
            className={styles.homeLink}
            href={createHrefForLocale(locale, '/')}
          >
            {dictionary.navigation.home}
          </Link>
          <Link
            className={styles.homeLink}
            href={createHrefForLocale(locale, '/venta')}
          >
            {dictionary.navigation.sales}
          </Link>
          <Link
            className={styles.homeLink}
            href={createHrefForLocale(locale, '/alquiler')}
          >
            {dictionary.navigation.rentals}
          </Link>
          <Link
            className={styles.homeLink}
            href={createHrefForLocale(locale, '/repuestos')}
          >
            {dictionary.navigation.parts}
          </Link>
        </nav>
        <a
          className={styles.whatsappButton}
          href={WHATSAPP_URL}
          target='_blank'
          rel='noopener noreferrer'
        >
          {dictionary.navigation.whatsapp}
          <span aria-hidden='true'>↗</span>
        </a>
        <LanguageSwitcher
          locale={locale}
          label={dictionary.navigation.language}
        />
      </div>
    </header>
  );
}
