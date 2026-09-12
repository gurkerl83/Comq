import { getDictionary } from '../../lib/i18n/dictionaries';
import type { SupportedLocale } from '../../lib/i18n/locales';
import { createPageMetadata } from '../../lib/site/metadata';

/** Build experience metadata for the requested locale. */
export const getExperienceMetadata = async (locale: SupportedLocale) => {
  const dictionary = await getDictionary(locale);
  return createPageMetadata(
    locale,
    '/experiencia',
    dictionary.experience.heading,
    dictionary.experience.biography
  );
};
