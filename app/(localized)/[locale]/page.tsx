import { notFound } from 'next/navigation';

import { HomePage } from '../../../features/home/HomePage';
import { getDictionary } from '../../../lib/i18n/dictionaries';
import { isPrefixedLocale } from '../../../lib/i18n/locales';
import { createPageMetadata } from '../../../lib/site/metadata';

type LocalePageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) notFound();
  return createPageMetadata(locale, await getDictionary(locale));
}

export default async function Page({ params }: LocalePageProps) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) notFound();
  return <HomePage locale={locale} dictionary={await getDictionary(locale)} />;
}
