import type { Organization, Thing, WebSite, WithContext } from 'schema-dts';

import { createHrefForLocale, type SupportedLocale } from '../i18n/locales';
import type { Dictionary } from '../i18n/types';
import { createSiteUrl, LEGAL_NAME, PHONE_NUMBER, SITE_NAME } from './config';

/**
 * Serialize JSON-LD in a form safe to place inside a script tag.
 *
 * @param schema - Typed schema.org structured data object or array of objects.
 * @returns React `dangerouslySetInnerHTML` payload for JSON-LD scripts.
 */
export const createJsonLdMarkup = (
  schema: WithContext<Thing> | Array<WithContext<Thing>>
): {
  __html: string;
} => ({
  __html: JSON.stringify(schema).replace(/</g, '\\u003c')
});

/** Describe the localized website and the company using known public facts. */
export const createSiteStructuredData = (
  locale: SupportedLocale,
  dictionary: Dictionary
): Array<WithContext<WebSite> | WithContext<Organization>> => {
  const url = createSiteUrl(createHrefForLocale(locale, '/'));
  const organizationId = createSiteUrl('/#organization');

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${url}#website`,
      name: SITE_NAME,
      url,
      description: dictionary.home.description,
      inLanguage: locale,
      publisher: { '@id': organizationId }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': organizationId,
      name: SITE_NAME,
      legalName: LEGAL_NAME,
      url: createSiteUrl('/'),
      telephone: PHONE_NUMBER,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Lima',
        addressCountry: 'PE'
      }
    }
  ];
};
