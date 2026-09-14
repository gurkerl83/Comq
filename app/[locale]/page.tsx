import { HomePage } from '../../features/home/HomePage';
import { getHomeMetadata } from '../../features/home/metadata';
import { getDictionary } from '../../lib/i18n/dictionaries';
import { getRouteLocale } from '../../lib/i18n/route-locale';

type LocalePageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: LocalePageProps) {
  return getHomeMetadata(await getRouteLocale(params));
}

export default async function Page({ params }: LocalePageProps) {
  const locale = await getRouteLocale(params);
  const dictionary = await getDictionary(locale);
  return <HomePage locale={locale} dictionary={dictionary} />;
}
