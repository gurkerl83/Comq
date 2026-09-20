import Link from 'next/link';

import { getEquipmentCatalogue } from '../../../features/equipment/catalogue';
import { getCatalogueContent } from '../../../features/equipment/catalogue-content';
import { EquipmentSelector } from '../../../features/equipment/EquipmentSelector';
import type { SelectorQuery } from '../../../features/equipment/selector/types';
import styles from '../../../features/equipment/SelectorPage.module.css';
import { getSelectorContent } from '../../../features/equipment/selector-content';
import { Breadcrumbs } from '../../../features/site/Breadcrumbs';
import { createHrefForLocale } from '../../../lib/i18n/locales';
import { getRouteLocale } from '../../../lib/i18n/route-locale';
import { createPageMetadata } from '../../../lib/site/metadata';

type LocalePageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: LocalePageProps) {
  const locale = await getRouteLocale(params);
  const translations = getSelectorContent(locale);
  const metadata = createPageMetadata(
    locale,
    '/selector',
    translations.title,
    translations.introduction
  );
  if (getEquipmentCatalogue(locale).every(machine => machine.isDemo)) {
    metadata.robots = { index: false, follow: true };
  }
  return metadata;
}

/**
 * Server entrypoint for the localized equipment selector.
 *
 * 1. Next supplies the locale through params and the URL query through
 *    searchParams. For /en/selector?machine=demo-jumbo-j1 these identify
 *    the English page and the requested machine independently.
 * 2. Load the catalogue and translations here. Pass the query promise to
 *    EquipmentSelector, which resolves it and prepares the initial selection
 *    on the server before passing it to the interactive wizard.
 * 3. Reading the query makes this route request-rendered. During client-side
 *    navigation, let Next keep the current page visible until the selector is
 *    ready. The introduction and wizard then appear together, avoiding the
 *    layout jump caused by replacing a short loading message with the form.
 */
export default async function Page({
  params,
  searchParams
}: LocalePageProps & { searchParams: Promise<SelectorQuery> }) {
  const locale = await getRouteLocale(params);
  const catalogue = getEquipmentCatalogue(locale);
  const catalogueContent = getCatalogueContent(locale);
  const translations = getSelectorContent(locale);
  return (
    <article className={styles.page}>
      <Breadcrumbs
        label={translations.breadcrumb}
        ancestors={[
          {
            href: createHrefForLocale(locale, '/venta'),
            label: translations.sales
          }
        ]}
        currentPage={translations.breadcrumbTitle}
      />
      <h1 className={styles.heading}>{translations.title}</h1>
      <p className={styles.intro}>{translations.introduction}</p>
      {catalogue.length > 0 && (
        <p className={styles.cataloguePrompt}>
          {catalogueContent.browsePrompt}{' '}
          <Link
            href={{
              pathname: createHrefForLocale(locale, '/venta'),
              hash: 'equipment-catalogue'
            }}
          >
            {catalogueContent.title}
          </Link>
        </p>
      )}
      {catalogue.some(machine => machine.isDemo) && (
        <p className={styles.demoNotice}>{translations.demo}</p>
      )}
      <EquipmentSelector
        locale={locale}
        catalogue={catalogue}
        translations={translations}
        searchParams={searchParams}
      />
    </article>
  );
}
