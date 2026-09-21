import {
  createHrefForLocale,
  type SupportedLocale
} from '../../lib/i18n/locales';
import { ArrowRightIcon } from '../site/icons';
import { Link } from '../../components/Link';
import { getEquipmentNavigationContent } from './navigation-content';
import styles from './EquipmentActions.module.css';

/** Inputs for the homepage's two equipment entry links. */
type EquipmentActionsProps = {
  /** Language used for the link labels and destinations. */
  locale: SupportedLocale;
};

/** Offer direct browsing alongside the guided equipment selector. */
export function EquipmentActions({ locale }: EquipmentActionsProps) {
  const content = getEquipmentNavigationContent(locale);

  return (
    <div className={styles.actions}>
      <Link
        href={createHrefForLocale(locale, '/venta')}
        className={styles.primary}
      >
        {content.browse}
        <ArrowRightIcon />
      </Link>
      <Link
        href={createHrefForLocale(locale, '/selector')}
        className={styles.secondary}
      >
        {content.selector}
        <ArrowRightIcon />
      </Link>
    </div>
  );
}
