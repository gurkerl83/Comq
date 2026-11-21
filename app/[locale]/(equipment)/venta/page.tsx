import { connection } from 'next/server';

import { createEquipmentCatalogue } from '../../../../features/equipment/catalogue';
import { EquipmentCatalogue } from '../../../../features/equipment/EquipmentCatalogue';
import { ServicePage } from '../../../../features/services/ServicePage';
import { getServiceMetadata } from '../../../../features/services/metadata';
import { getDictionary } from '../../../../lib/i18n/dictionaries';
import {
  getRouteLocale,
  type LocalePageProps
} from '../../../../lib/i18n/route-locale';

export async function generateMetadata({ params }: LocalePageProps) {
  return getServiceMetadata(await getRouteLocale(params), 'sales');
}

export default async function Page({ params }: LocalePageProps) {
  // The catalogue's address names the chosen machine and tab, so the page
  // renders on request, with the address the visitor opened.
  await connection();
  const locale = await getRouteLocale(params);
  const dictionary = await getDictionary(locale);
  const machines = createEquipmentCatalogue(dictionary.equipment);
  return (
    <ServicePage dictionary={dictionary} service='sales'>
      <EquipmentCatalogue locale={locale} machines={machines} />
    </ServicePage>
  );
}
