import { EquipmentNavigation } from '../../../features/equipment/EquipmentNavigation';
import {
  getRouteLocale,
  type LocaleLayoutProps
} from '../../../lib/i18n/route-locale';
import styles from '../content.module.css';

/**
 * Keep the equipment navigation mounted while the child page changes, and
 * give the page the standard spacing below the navigation.
 */
export default async function EquipmentLayout({
  children,
  params
}: LocaleLayoutProps) {
  const locale = await getRouteLocale(params);

  return (
    <>
      <EquipmentNavigation locale={locale} />
      <div className={styles.content}>{children}</div>
    </>
  );
}
