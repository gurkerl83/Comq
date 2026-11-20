'use client';

import { usePathname } from 'next/navigation';

import {
  createHrefForLocale,
  getLocaleFreePathname,
  SUPPORTED_LOCALES,
  type SupportedLocale
} from '../../lib/i18n/locales';
import { Link } from '../../components/Link';
import styles from './SiteShell.module.css';

const languageNames: Record<SupportedLocale, string> = {
  es: 'Español',
  en: 'English'
};

type LanguageSwitcherProps = {
  /** The page's language; its link gets data-current. */
  locale: SupportedLocale;
  /** The accessible name of the language navigation. */
  label: string;
};

/**
 * Links to the current page in each supported language. The link for the
 * page's own language has data-current, which SiteShell.module.css marks.
 */
export function LanguageSwitcher({ locale, label }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const localeFreePathname = getLocaleFreePathname(pathname);

  return (
    <nav className={styles.languages} aria-label={label}>
      {SUPPORTED_LOCALES.map(language => (
        <Link
          key={language}
          href={createHrefForLocale(language, localeFreePathname)}
          hrefLang={language}
          lang={language}
          aria-label={languageNames[language]}
          data-current={language === locale}
          title={languageNames[language]}
        >
          {language.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
