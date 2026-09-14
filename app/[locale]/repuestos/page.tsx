import { ServicePage } from '../../../features/services/ServicePage';
import { getServiceMetadata } from '../../../features/services/metadata';
import { getDictionary } from '../../../lib/i18n/dictionaries';
import { getRouteLocale } from '../../../lib/i18n/route-locale';

type LocalePageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: LocalePageProps) {
  return getServiceMetadata(await getRouteLocale(params), 'parts');
}

export default async function Page({ params }: LocalePageProps) {
  const locale = await getRouteLocale(params);
  const dictionary = await getDictionary(locale);
  return <ServicePage dictionary={dictionary} service='parts' />;
}
