import Link from 'next/link';

import {
  createHrefForLocale,
  type SupportedLocale
} from '../../lib/i18n/locales';
import type { Dictionary } from '../../lib/i18n/types';
import { SITE_NAME, WHATSAPP_URL } from '../../lib/site/config';
import { WhatsAppIcon } from './icons';
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
        <a
          className={styles.whatsappButton}
          href={WHATSAPP_URL}
          target='_blank'
          rel='noopener noreferrer'
          aria-label={dictionary.navigation.whatsappLabel}
        >
          <WhatsAppIcon />
          {dictionary.navigation.whatsapp}
        </a>
        <LanguageSwitcher
          locale={locale}
          label={dictionary.navigation.language}
        />
      </div>
    </header>
  );
}
