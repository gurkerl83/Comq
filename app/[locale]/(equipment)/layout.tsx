import type { ReactNode } from 'react';

import { EquipmentNavigation } from '../../../features/equipment/EquipmentNavigation';
import { getRouteLocale } from '../../../lib/i18n/route-locale';
import styles from '../content.module.css';

/** Equipment pages sharing navigation within the current locale. */
type EquipmentLayoutProps = {
  /** The active browse, selector or machine page. */
  children: ReactNode;
  /** Locale supplied by the parent route segment. */
  params: Promise<{ locale: string }>;
};

/**
 * Keep the equipment navigation mounted while the child page changes, and
 * give the page the standard spacing below the navigation.
 */
export default async function EquipmentLayout({
  children,
  params
}: EquipmentLayoutProps) {
  const locale = await getRouteLocale(params);

  return (
    <>
      <EquipmentNavigation locale={locale} />
      <div className={styles.content}>{children}</div>
    </>
  );
}
