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

export function LanguageSwitcher({
  locale,
  label
}: {
  locale: SupportedLocale;
  label: string;
}) {
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
          aria-current={language === locale ? 'page' : undefined}
          title={languageNames[language]}
        >
          {language.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
