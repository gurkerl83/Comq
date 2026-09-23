import Image from 'next/image';

import type { Dictionary } from '../../lib/i18n/types';
import { FOUNDER_NAME, LINKEDIN_URL } from '../../lib/site/config';
import { LinkedInIcon } from '../site/icons';
import { Link } from '../../components/Link';
import { QuoteInvitation } from '../site/QuoteInvitation';
import styles from './ExperiencePage.module.css';

export function ExperiencePage({ dictionary }: { dictionary: Dictionary }) {
  return (
    <>
      <article id='expertise' aria-labelledby='founder-heading'>
        <header className={styles.introduction}>
          <h1 id='founder-heading'>{dictionary.experience.heading}</h1>
        </header>
        <section
          className={styles.highlight}
          aria-labelledby='experience-heading'
        >
          <div className={styles.highlightContent}>
            <h2 id='experience-heading' className={styles.highlightHeading}>
              {dictionary.experience.highlightHeading}
            </h2>
            <div className={styles.profile}>
              {/* The experience figure belongs to Alberto's career, not COMQ's age. */}
              <div>
                <p className={styles.experience}>
                  <strong>35+</strong>
                  <span>{dictionary.experience.yearsLabel}</span>
                </p>
                <div className={styles.person}>
                  <Image
                    className={styles.portrait}
                    src='/images/company/alberto-llana.jpg'
                    alt={FOUNDER_NAME}
                    width={481}
                    height={481}
                    sizes='64px'
                    loading='eager'
                  />
                  <div>
                    <p className={styles.name}>{FOUNDER_NAME}</p>
                    <p className={styles.role}>
                      {dictionary.experience.founderRole}
                    </p>
                  </div>
                </div>
              </div>
              <div className={styles.biography}>
                <p>{dictionary.experience.biography}</p>
                <Link
                  native
                  className={styles.profileLink}
                  href={LINKEDIN_URL}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <LinkedInIcon />
                  <span>{dictionary.experience.profileLink}</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </article>
      <QuoteInvitation dictionary={dictionary} showDivider={false} />
    </>
  );
}
