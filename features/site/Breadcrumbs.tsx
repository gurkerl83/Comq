import Link from 'next/link';

import styles from './Breadcrumbs.module.css';

type BreadcrumbsProps = {
  label: string;
  ancestors: readonly { href: string; label: string }[];
  currentPage: string;
};

/**
 * Render the page hierarchy using localized labels and links from its caller.
 * Ancestors are links; the current page is plain text marked with aria-current.
 * Example: Equipment sales / Equipment selector stays the same at every step.
 */
export function Breadcrumbs({
  label,
  ancestors,
  currentPage
}: BreadcrumbsProps) {
  return (
    <nav aria-label={label}>
      <ol className={styles.list}>
        {ancestors.map(ancestor => (
          <li key={ancestor.href}>
            <Link href={ancestor.href}>{ancestor.label}</Link>
            <span className={styles.separator} aria-hidden='true'>
              /
            </span>
          </li>
        ))}
        <li aria-current='page'>{currentPage}</li>
      </ol>
    </nav>
  );
}
