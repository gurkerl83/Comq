import Link from 'next/link';

import {
  createHrefForLocale,
  type SupportedLocale
} from '../../lib/i18n/locales';
import { ArrowRightIcon } from '../site/icons';
import { getSelectorContent } from './selector-content';
import styles from './SelectorLink.module.css';

/**
 * The sales page and homepage share the same localized selector entry.
 */
export function SelectorLink({ locale }: { locale: SupportedLocale }) {
  const translations = getSelectorContent(locale);
  return (
    <Link
      href={createHrefForLocale(locale, '/selector')}
      className={styles.link}
    >
      {translations.entryLink}
      <ArrowRightIcon />
    </Link>
  );
}
