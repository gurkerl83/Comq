import { getDictionary } from '../../lib/i18n/dictionaries';
import type { SupportedLocale } from '../../lib/i18n/locales';
import { createPageMetadata } from '../../lib/site/metadata';

/** Build company metadata for the requested locale. */
export const getCompanyMetadata = async (locale: SupportedLocale) => {
  const dictionary = await getDictionary(locale);
  return createPageMetadata(
    locale,
    '/empresa',
    dictionary.company.heading,
    dictionary.company.description
  );
};
