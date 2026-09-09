import Image from 'next/image';

import type { Dictionary } from '../../lib/i18n/types';
import { FOUNDER_NAME, LINKEDIN_URL } from '../../lib/site/config';
import { LinkedInIcon } from '../site/icons';
import styles from './ExperiencePage.module.css';

export function ExperiencePage({ dictionary }: { dictionary: Dictionary }) {
  return (
    <section
      id='expertise'
      className={styles.section}
      aria-labelledby='founder-heading'
    >
      <h1 id='founder-heading'>{dictionary.experience.heading}</h1>
      <div className={styles.profile}>
        <Image
          className={styles.portrait}
          src='/images/company/alberto-llana.jpg'
          alt={FOUNDER_NAME}
          width={481}
          height={481}
          sizes='(max-width: 640px) 240px, 280px'
        />
        <div className={styles.biography}>
          <h2>{FOUNDER_NAME}</h2>
          <p className={styles.role}>{dictionary.experience.founderRole}</p>
          <p>{dictionary.experience.biography}</p>
          <a
            className={styles.profileLink}
            href={LINKEDIN_URL}
            target='_blank'
            rel='noopener noreferrer'
          >
            <LinkedInIcon />
            <span>{dictionary.experience.profileLink}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
