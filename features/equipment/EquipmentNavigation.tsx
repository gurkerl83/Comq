'use client';

import { useSelectedLayoutSegment } from 'next/navigation';

import {
  createHrefForLocale,
  type SupportedLocale
} from '../../lib/i18n/locales';
import { Link } from '../../components/Link';
import { getEquipmentNavigationContent } from './navigation-content';
import styles from './EquipmentNavigation.module.css';

/** Navigation inputs supplied by the equipment layout. */
type EquipmentNavigationProps = {
  /** Language used for link labels and destination URLs. */
  locale: SupportedLocale;
};

/** Update the active section while the surrounding layout remains mounted. */
export function EquipmentNavigation({ locale }: EquipmentNavigationProps) {
  const segment = useSelectedLayoutSegment();
  const content = getEquipmentNavigationContent(locale);
  const browseCurrent =
    segment === 'venta'
      ? 'page'
      : segment === 'equipos'
        ? 'location'
        : undefined;

  return (
    <nav aria-label={content.label} className={styles.navigation}>
      <ul className={styles.links}>
        <li>
          <Link
            href={createHrefForLocale(locale, '/venta')}
            aria-current={browseCurrent}
          >
            {content.browse}
          </Link>
        </li>
        <li>
          <Link
            href={createHrefForLocale(locale, '/selector')}
            aria-current={segment === 'selector' ? 'page' : undefined}
          >
            {content.selector}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
