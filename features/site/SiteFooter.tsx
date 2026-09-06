import type { Dictionary } from '../../lib/i18n/types';
import {
  LEGAL_NAME,
  LINKEDIN_URL,
  WHATSAPP_NUMBER,
  WHATSAPP_URL
} from '../../lib/site/config';
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
            href={WHATSAPP_URL}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={`${dictionary.footer.whatsapp}: ${WHATSAPP_NUMBER}`}
          >
            <svg
              aria-hidden='true'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='1.8'
              viewBox='0 0 24 24'
            >
              <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.79a2 2 0 0 1-.45 2.11L8.09 9.89a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.33 1.83.56 2.79.69A2 2 0 0 1 22 16.92Z' />
            </svg>
            {dictionary.footer.whatsapp}
          </a>
          <a
            className={styles.socialLink}
            href={LINKEDIN_URL}
            target='_blank'
            rel='noopener noreferrer'
          >
            <svg aria-hidden='true' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M0 1.146C0 .513.526 0 1.175 0h21.65C23.474 0 24 .513 24 1.146v21.708C24 23.487 23.474 24 22.825 24H1.175C.526 24 0 23.487 0 22.854V1.146Zm7.278 19.2V9.169H3.565v11.177h3.713ZM5.422 7.64a2.152 2.152 0 1 0 0-4.304 2.152 2.152 0 0 0 0 4.304Zm7.306 12.706V14.11c0-1.643.31-3.233 2.348-3.233 2.01 0 2.034 1.881 2.034 3.337v6.132h3.713v-6.915c0-3.395-.731-6.002-4.692-6.002-1.902 0-3.177 1.045-3.7 2.036h-.05V7.74H8.82v12.606h3.908Z' />
            </svg>
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
