import { getDictionary } from '../../lib/i18n/dictionaries';
import type { SupportedLocale } from '../../lib/i18n/locales';
import type { ServiceKey } from '../../lib/i18n/types';
import { createPageMetadata } from '../../lib/site/metadata';

// These locale-free paths match the authored service routes under `[locale]`.
const SERVICE_PATHNAMES = {
  sales: '/venta',
  rentals: '/alquiler',
  parts: '/repuestos'
};

/** Select matching service metadata and its canonical path in one place. */
export const getServiceMetadata = async (
  locale: SupportedLocale,
  service: ServiceKey
) => {
  const dictionary = await getDictionary(locale);
  const content = dictionary.servicePages.pages[service];
  return createPageMetadata(
    locale,
    SERVICE_PATHNAMES[service],
    content.title,
    content.introduction
  );
};
