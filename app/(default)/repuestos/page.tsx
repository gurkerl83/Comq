import { ServicePage } from '../../../features/services/ServicePage';
import { getDictionary } from '../../../lib/i18n/dictionaries';
import { DEFAULT_LOCALE } from '../../../lib/i18n/locales';
import { createPageMetadata } from '../../../lib/site/metadata';

export async function generateMetadata() {
  const dictionary = await getDictionary(DEFAULT_LOCALE);
  return createPageMetadata(DEFAULT_LOCALE, dictionary, '/repuestos', {
    title: dictionary.servicePages.pages.parts.title,
    description: dictionary.servicePages.pages.parts.introduction
  });
}

export default async function Page() {
  const dictionary = await getDictionary(DEFAULT_LOCALE);
  return <ServicePage dictionary={dictionary} service='parts' />;
}
