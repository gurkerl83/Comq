'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  createHrefForLocale,
  isPrefixedLocale,
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
  label
}: {
  locale: SupportedLocale;
  label: string;
}) {
  // Read the live pathname so language links keep the page after navigation.
  const pathname = usePathname();
  const segments = pathname.split('/');
  const localeFreePathname = isPrefixedLocale(segments[1] ?? '')
    ? `/${segments.slice(2).join('/')}`
    : pathname;

  return (
    <nav className={styles.languages} aria-label={label}>
      {SUPPORTED_LOCALES.map(language => (
        <Link
          key={language}
          href={createHrefForLocale(language, localeFreePathname)}
          hrefLang={language}
          lang={language}
          aria-current={language === locale ? 'page' : undefined}
        >
          {languageNames[language]}
        </Link>
      ))}
    </nav>
  );
}
