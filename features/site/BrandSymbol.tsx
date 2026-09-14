import Image from 'next/image';

import styles from './BrandSymbol.module.css';

/**
 * Decorative brand mark; the home link or adjacent company name supplies its
 * accessible label. Both exports preserve the original outline and dimensions.
 * CSS selects the artwork for the OS preference or the manual theme choice.
 */
export function BrandSymbol({ className }: { className: string }) {
  return (
    <span className={`${styles.symbol} ${className}`} aria-hidden='true'>
      {/* Load both small variants immediately so theme changes do not wait for
          another image request. SVG files bypass Next's optimizer by default. */}
      <Image
        className={`${styles.image} light-theme-only`}
        src='/images/brand/comq-symbol-light.svg'
        alt=''
        width={847}
        height={702}
        loading='eager'
      />
      <Image
        className={`${styles.image} dark-theme-only`}
        src='/images/brand/comq-symbol-dark.svg'
        alt=''
        width={847}
        height={702}
        loading='eager'
      />
    </span>
  );
}
