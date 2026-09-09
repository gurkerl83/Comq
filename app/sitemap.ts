import type { MetadataRoute } from 'next';

import { createHrefForLocale, SUPPORTED_LOCALES } from '../lib/i18n/locales';
import { createSiteUrl } from '../lib/site/config';
import { createLanguageAlternates } from '../lib/site/metadata';

/**
 * Declare the canonical public pages for crawlers.
 *
 * Only published pages are listed; modification dates require actual content
 * changes and are not inferred from when the application builds or runs.
 *
 * @returns Sitemap entries for Spanish and English home, service, company and experience pages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    '/',
    '/venta',
    '/alquiler',
    '/repuestos',
    '/empresa',
    '/experiencia'
  ].flatMap(pathname =>
    SUPPORTED_LOCALES.map(locale => ({
      url: createSiteUrl(createHrefForLocale(locale, pathname)),
      alternates: {
        languages: createLanguageAlternates(pathname)
      }
    }))
  );
}
