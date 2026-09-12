import { getDictionary } from '../../lib/i18n/dictionaries';
import type { SupportedLocale } from '../../lib/i18n/locales';
import { createPageMetadata } from '../../lib/site/metadata';

/** Build home metadata for the requested locale. */
export const getHomeMetadata = async (locale: SupportedLocale) => {
  const dictionary = await getDictionary(locale);
  return createPageMetadata(
    locale,
    '/',
    dictionary.home.slogan,
    dictionary.home.description
  );
};
