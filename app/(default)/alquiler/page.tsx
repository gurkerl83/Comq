import { ServicePage } from '../../../features/services/ServicePage';
import { getDictionary } from '../../../lib/i18n/dictionaries';
import { DEFAULT_LOCALE } from '../../../lib/i18n/locales';
import { createPageMetadata } from '../../../lib/site/metadata';

export async function generateMetadata() {
  const dictionary = await getDictionary(DEFAULT_LOCALE);
  return createPageMetadata(DEFAULT_LOCALE, dictionary, '/alquiler', {
    title: dictionary.services.rentalsTitle,
    description: dictionary.services.rentalsDescription
  });
}

export default async function Page() {
  const dictionary = await getDictionary(DEFAULT_LOCALE);
  return <ServicePage title={dictionary.services.rentalsTitle} />;
}
