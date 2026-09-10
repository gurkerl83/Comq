import Image from 'next/image';

import styles from './CompanyLogoStrip.module.css';

type LogoVariant = 'monochrome' | 'colour';

const companies = [
  {
    name: 'Sandvik',
    className: styles.sandvik,
    file: 'sandvik.svg',
    width: 308,
    height: 56
  },
  {
    name: 'Normet',
    className: styles.normet,
    file: 'normet.png',
    width: 2000,
    height: 792
  },
  {
    name: 'RESEMIN',
    className: styles.resemin,
    file: 'resemin.svg',
    width: 2064,
    height: 356
  },
  {
    name: 'ZANINGROUP',
    className: styles.zaningroup,
    file: 'zaningroup.svg',
    width: 1122,
    height: 744
  }
];

/**
 * Identify the founder's previous employers with local logo artwork.
 * RESEMIN and ZANINGROUP use supplied vector reconstructions unchanged.
 * These companies are not presented as COMQ customers or endorsements.
 * Both variants render static HTML; colour selection is an authoring choice.
 * Variant folders share company filenames and image dimensions.
 */
export function CompanyLogoStrip({
  catchphrase,
  variant = 'monochrome'
}: {
  catchphrase: string;
  variant?: LogoVariant;
}) {
  return (
    <section
      className={styles.section}
      data-variant={variant}
      aria-labelledby='company-experience'
    >
      <div className={styles.strip}>
        <h2 className={styles.heading} id='company-experience'>
          {catchphrase}
        </h2>
        <ul className={styles.logos} role='list'>
          {companies.map(company => (
            <li key={company.name}>
              <Image
                className={company.className}
                src={`/images/experience/${variant}/${company.file}`}
                alt={company.name}
                width={company.width}
                height={company.height}
                unoptimized
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
