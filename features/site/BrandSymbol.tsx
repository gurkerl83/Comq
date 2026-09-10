import styles from './BrandSymbol.module.css';

/**
 * Decorative brand mark; the home link or adjacent company name supplies its
 * accessible label. CSS colors the original outline without modifying artwork.
 */
export function BrandSymbol({ className }: { className: string }) {
  return (
    <span className={`${styles.symbol} ${className}`} aria-hidden='true' />
  );
}
