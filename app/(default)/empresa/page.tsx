import { CompanyPage } from '../../../features/company/CompanyPage';
import { getDictionary } from '../../../lib/i18n/dictionaries';
import { DEFAULT_LOCALE } from '../../../lib/i18n/locales';
import { createPageMetadata } from '../../../lib/site/metadata';

export async function generateMetadata() {
  const dictionary = await getDictionary(DEFAULT_LOCALE);
  return createPageMetadata(DEFAULT_LOCALE, dictionary, '/empresa', {
    title: dictionary.company.heading,
    description: dictionary.company.description
  });
}

export default async function Page() {
  const dictionary = await getDictionary(DEFAULT_LOCALE);
  return <CompanyPage dictionary={dictionary} />;
}
