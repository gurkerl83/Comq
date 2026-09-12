import { ServicePage } from '../../../features/services/ServicePage';
import { getServiceMetadata } from '../../../features/services/metadata';
import { SiteShell } from '../../../features/site/SiteShell';
import { getDictionary } from '../../../lib/i18n/dictionaries';
import { getRouteLocale } from '../../../lib/i18n/route-locale';

type LocalePageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: LocalePageProps) {
  return getServiceMetadata(await getRouteLocale(params), 'sales');
}

export default async function Page({ params }: LocalePageProps) {
  const locale = await getRouteLocale(params);
  const dictionary = await getDictionary(locale);
  return (
    <SiteShell locale={locale} dictionary={dictionary} pathname='/venta'>
      <ServicePage dictionary={dictionary} service='sales' />
    </SiteShell>
  );
}
