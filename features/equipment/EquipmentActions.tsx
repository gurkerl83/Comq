import {
  createHrefForLocale,
  type SupportedLocale
} from '../../lib/i18n/locales';
import { ArrowRightIcon } from '../site/icons';
import { Button } from '../../components/Button';
import { getEquipmentNavigationContent } from './navigation-content';
import styles from './EquipmentActions.module.css';

/** Inputs for the homepage's two equipment entry links. */
type EquipmentActionsProps = {
  /** Language used for the link labels and destinations. */
  locale: SupportedLocale;
};

/**
 * Offer direct browsing alongside the guided equipment selector, as a primary
 * and a secondary button.
 */
export function EquipmentActions({ locale }: EquipmentActionsProps) {
  const content = getEquipmentNavigationContent(locale);

  return (
    <div className={styles.actions}>
      <Button variant='primary' href={createHrefForLocale(locale, '/venta')}>
        {content.browse}
        <ArrowRightIcon />
      </Button>
      <Button
        variant='secondary'
        href={createHrefForLocale(locale, '/selector')}
      >
        {content.selector}
        <ArrowRightIcon />
      </Button>
    </div>
  );
}
