import Link from 'next/link';

import {
  createHrefForLocale,
  SUPPORTED_LOCALES,
  type SupportedLocale
} from '../../lib/i18n/locales';
import styles from './SiteShell.module.css';

const languageNames: Record<SupportedLocale, string> = {
  es: 'Español',
  en: 'English'
};

export function LanguageSwitcher({
  locale,
  label,
  pathname
}: {
  locale: SupportedLocale;
  label: string;
  pathname: string;
}) {
  return (
    <nav className={styles.languages} aria-label={label}>
      {SUPPORTED_LOCALES.map(language => (
        <Link
          key={language}
          href={createHrefForLocale(language, pathname)}
          hrefLang={language}
          lang={language}
          aria-label={languageNames[language]}
          aria-current={language === locale ? 'page' : undefined}
          title={languageNames[language]}
        >
          {language.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
