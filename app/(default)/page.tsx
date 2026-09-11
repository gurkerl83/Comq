import { HomePage } from '../../features/home/HomePage';
import { getDictionary } from '../../lib/i18n/dictionaries';
import { DEFAULT_LOCALE } from '../../lib/i18n/locales';
import { createPageMetadata } from '../../lib/site/metadata';

export async function generateMetadata() {
  const dictionary = await getDictionary(DEFAULT_LOCALE);
  return createPageMetadata(
    DEFAULT_LOCALE,
    '/',
    dictionary.home.slogan,
    dictionary.home.description
  );
}

export default async function Page() {
  return (
    <HomePage
      locale={DEFAULT_LOCALE}
      dictionary={await getDictionary(DEFAULT_LOCALE)}
    />
  );
}
