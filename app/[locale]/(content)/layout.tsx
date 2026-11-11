import type { ReactNode } from 'react';

import styles from '../content.module.css';

/** Standard page spacing below the site header. */
export default function ContentLayout({ children }: { children: ReactNode }) {
  return <div className={styles.content}>{children}</div>;
}
