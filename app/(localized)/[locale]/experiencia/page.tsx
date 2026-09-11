import { notFound } from 'next/navigation';

import { ExperiencePage } from '../../../../features/experience/ExperiencePage';
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
    '/experiencia',
    dictionary.experience.heading,
    dictionary.experience.biography
  );
}

export default async function Page({ params }: LocalePageProps) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) notFound();
  const dictionary = await getDictionary(locale);
  return <ExperiencePage dictionary={dictionary} />;
}
