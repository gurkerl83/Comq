import Image from 'next/image';
import Link from 'next/link';

import {
  createHrefForLocale,
  type SupportedLocale
} from '../../lib/i18n/locales';
import type { Dictionary } from '../../lib/i18n/types';
import { SITE_NAME } from '../../lib/site/config';
import { LanguageSwitcher } from './LanguageSwitcher';
import { QuoteLink } from './QuoteLink';
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
          <Image
            className={styles.brandIcon}
            src='/images/comq-symbol.svg'
            alt=''
            width={48}
            height={40}
            loading='eager'
            unoptimized
          />
        </Link>
        <QuoteLink
          label={dictionary.navigation.whatsapp}
          accessibleLabel={dictionary.navigation.whatsappLabel}
        />
        <LanguageSwitcher
          locale={locale}
          label={dictionary.navigation.language}
        />
      </div>
    </header>
  );
}
