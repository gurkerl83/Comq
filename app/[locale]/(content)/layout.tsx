import type { LocaleLayoutProps } from '../../../lib/i18n/route-locale';
import styles from '../content.module.css';

/** Standard page spacing below the site header. */
export default function ContentLayout({ children }: LocaleLayoutProps) {
  return <div className={styles.content}>{children}</div>;
}
