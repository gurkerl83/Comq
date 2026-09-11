import { notFound } from 'next/navigation';

import { ServicePage } from '../../../../features/services/ServicePage';
import { getDictionary } from '../../../../lib/i18n/dictionaries';
import { isPrefixedLocale } from '../../../../lib/i18n/locales';
import { createPageMetadata } from '../../../../lib/site/metadata';

type LocalePageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) notFound();
  const dictionary = await getDictionary(locale);
  return createPageMetadata(
    locale,
    '/repuestos',
    dictionary.servicePages.pages.parts.title,
    dictionary.servicePages.pages.parts.introduction
  );
}

export default async function Page({ params }: LocalePageProps) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) notFound();
  const dictionary = await getDictionary(locale);
  return <ServicePage dictionary={dictionary} service='parts' />;
}
