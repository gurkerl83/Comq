import type { Metadata } from 'next';

import {
  createHrefForLocale,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type SupportedLocale
} from '../i18n/locales';
import { createSiteUrl, SITE_NAME, SITE_URL } from './config';

const OPEN_GRAPH_LOCALES: Record<SupportedLocale, string> = {
  es: 'es_PE',
  en: 'en_US'
};

/** Build matching language alternates for page metadata and the sitemap. */
export const createLanguageAlternates = (
  pathname: string
): Record<string, string> => ({
  ...Object.fromEntries(
    SUPPORTED_LOCALES.map(locale => [
      locale,
      createSiteUrl(createHrefForLocale(locale, pathname))
    ])
  ),
  'x-default': createSiteUrl(createHrefForLocale(DEFAULT_LOCALE, pathname))
});

/** Use the same localized public URL for canonical and social metadata. */
export const createPageMetadata = (
  locale: SupportedLocale,
  pathname: string,
  pageTitle: string,
  description: string
): Metadata => {
  const title = `${SITE_NAME} | ${pageTitle}`;
  const url = createSiteUrl(createHrefForLocale(locale, pathname));

  return {
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_NAME,
    title,
    description,
    alternates: {
      canonical: url,
      languages: createLanguageAlternates(pathname)
    },
    openGraph: {
      type: 'website',
      url,
      siteName: SITE_NAME,
      title,
      description,
      locale: OPEN_GRAPH_LOCALES[locale],
      alternateLocale: SUPPORTED_LOCALES.filter(
        supportedLocale => supportedLocale !== locale
      ).map(supportedLocale => OPEN_GRAPH_LOCALES[supportedLocale])
    },
    twitter: {
      card: 'summary',
      title,
      description
    }
  };
};
