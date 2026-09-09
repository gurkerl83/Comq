import Image from 'next/image';

import styles from './CompanyLogoStrip.module.css';

type LogoVariant = 'monochrome' | 'colour';

const companies = [
  {
    name: 'Sandvik',
    className: styles.sandvik,
    monochrome: { file: 'sandvik-monochrome.svg', width: 308, height: 56 },
    colour: { file: 'sandvik-colour.svg', width: 308, height: 56 }
  },
  {
    name: 'Normet',
    className: styles.normet,
    monochrome: { file: 'normet-monochrome.png', width: 2000, height: 792 },
    colour: { file: 'normet-colour.png', width: 2000, height: 792 }
  },
  {
    name: 'RESEMIN',
    className: styles.resemin,
    monochrome: { file: 'resemin-monochrome.png', width: 175, height: 36 },
    colour: { file: 'resemin-colour.png', width: 202, height: 38 }
  },
  {
    name: 'ZANINGROUP',
    className: styles.zaningroup,
    monochrome: { file: 'zaningroup.jpg', width: 200, height: 200 },
    colour: { file: 'zaningroup.jpg', width: 200, height: 200 }
  }
];

/**
 * Identify the founder's previous employers with their original logo artwork.
 * These companies are not presented as COMQ customers or endorsements.
 * Both variants render static HTML; colour selection is an authoring choice.
 */
export function CompanyLogoStrip({
  catchphrase,
  caption,
  variant = 'monochrome'
}: {
  catchphrase: string;
  caption: string;
  variant?: LogoVariant;
}) {
  return (
    <section
      className={styles.section}
      aria-labelledby='company-experience'
      aria-describedby='company-experience-caption'
    >
      <div className={styles.strip} data-variant={variant}>
        <h2 className={styles.heading} id='company-experience'>
          {catchphrase}
        </h2>
        <p className={styles.caption} id='company-experience-caption'>
          {caption}
        </p>
        <ul className={styles.logos} role='list'>
          {companies.map(company => {
            const image = company[variant];

            return (
              <li key={company.name}>
                <Image
                  className={company.className}
                  src={`/images/experience/${image.file}`}
                  alt={company.name}
                  width={image.width}
                  height={image.height}
                  unoptimized
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
