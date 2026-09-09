import { ServicePage } from '../../../features/services/ServicePage';
import { getDictionary } from '../../../lib/i18n/dictionaries';
import { DEFAULT_LOCALE } from '../../../lib/i18n/locales';
import { createPageMetadata } from '../../../lib/site/metadata';

export async function generateMetadata() {
  const dictionary = await getDictionary(DEFAULT_LOCALE);
  return createPageMetadata(DEFAULT_LOCALE, dictionary, '/alquiler', {
    title: dictionary.servicePages.pages.rentals.title,
    description: dictionary.servicePages.pages.rentals.introduction
  });
}

export default async function Page() {
  const dictionary = await getDictionary(DEFAULT_LOCALE);
  return <ServicePage dictionary={dictionary} service='rentals' />;
}
