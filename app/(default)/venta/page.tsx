import { ServicePage } from '../../../features/services/ServicePage';
import { getDictionary } from '../../../lib/i18n/dictionaries';
import { DEFAULT_LOCALE } from '../../../lib/i18n/locales';
import { createPageMetadata } from '../../../lib/site/metadata';

export async function generateMetadata() {
  const dictionary = await getDictionary(DEFAULT_LOCALE);
  return createPageMetadata(DEFAULT_LOCALE, dictionary, '/venta', {
    title: dictionary.servicePages.pages.sales.title,
    description: dictionary.servicePages.pages.sales.introduction
  });
}

export default async function Page() {
  const dictionary = await getDictionary(DEFAULT_LOCALE);
  return <ServicePage dictionary={dictionary} service='sales' />;
}
