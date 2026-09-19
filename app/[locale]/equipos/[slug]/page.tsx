import { notFound } from 'next/navigation';

import {
  EQUIPMENT_SLUGS,
  getEquipmentCatalogue
} from '../../../../features/equipment/catalogue';
import { MachinePage } from '../../../../features/equipment/MachinePage';
import { getEquipmentMetadata } from '../../../../features/equipment/metadata';
import { getRouteLocale } from '../../../../lib/i18n/route-locale';

type EquipmentPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamicParams = false;

// The parent layout supplies each supported locale; this segment bounds slugs.
export const generateStaticParams = () =>
  EQUIPMENT_SLUGS.map(slug => ({ slug }));

const resolveEquipment = async (params: EquipmentPageProps['params']) => {
  const locale = await getRouteLocale(params);
  const { slug } = await params;
  const equipment = getEquipmentCatalogue(locale).find(
    entry => entry.slug === slug
  );
  if (!equipment) notFound();
  return { locale, equipment };
};

export async function generateMetadata({ params }: EquipmentPageProps) {
  const { locale, equipment } = await resolveEquipment(params);
  return getEquipmentMetadata(locale, equipment);
}

export default async function Page({ params }: EquipmentPageProps) {
  const { locale, equipment } = await resolveEquipment(params);
  return <MachinePage locale={locale} equipment={equipment} />;
}
