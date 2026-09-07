import type { Dictionary } from '../../lib/i18n/types';
import {
  CONTACT_EMAIL,
  LEGAL_NAME,
  LINKEDIN_URL,
  PHONE_NUMBER,
  PHONE_URL
} from '../../lib/site/config';
import { LinkedInIcon, MailIcon, PhoneIcon } from './icons';
import styles from './SiteShell.module.css';

export function SiteFooter({ dictionary }: { dictionary: Dictionary }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.company}>
          <p>{LEGAL_NAME}</p>
          <p className={styles.location}>{dictionary.footer.location}</p>
        </div>
        <div className={styles.contacts}>
          <a
            className={styles.socialLink}
            href={`mailto:${CONTACT_EMAIL}`}
            aria-label={`${dictionary.footer.email}: ${CONTACT_EMAIL}`}
          >
            <MailIcon />
            {dictionary.footer.email}
          </a>
          <a
            className={styles.socialLink}
            href={PHONE_URL}
            aria-label={`${dictionary.footer.phone}: ${PHONE_NUMBER}`}
          >
            <PhoneIcon />
            {dictionary.footer.phone}
          </a>
          <a
            className={styles.socialLink}
            href={LINKEDIN_URL}
            target='_blank'
            rel='noopener noreferrer'
          >
            <LinkedInIcon />
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
