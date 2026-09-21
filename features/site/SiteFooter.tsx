import {
  createHrefForLocale,
  type SupportedLocale
} from '../../lib/i18n/locales';
import type { Dictionary } from '../../lib/i18n/types';
import {
  CONTACT_EMAIL,
  LEGAL_NAME,
  LINKEDIN_URL,
  PHONE_NUMBER,
  PHONE_URL
} from '../../lib/site/config';
import { LinkedInIcon, MailIcon, PhoneIcon } from './icons';
import { BrandSymbol } from './BrandSymbol';
import { Link } from '../../components/Link';
import styles from './SiteShell.module.css';

export function SiteFooter({
  locale,
  dictionary
}: {
  locale: SupportedLocale;
  dictionary: Dictionary;
}) {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrand}>
          <BrandSymbol className={styles.footerBrandIcon} />
          <div className={styles.company}>
            <p>{LEGAL_NAME}</p>
            <p className={styles.location}>{dictionary.footer.location}</p>
          </div>
        </div>
        <nav
          className={styles.footerNavigation}
          aria-labelledby='footer-company-heading'
        >
          <h2 id='footer-company-heading'>{dictionary.company.title}</h2>
          <Link
            className={styles.footerLink}
            href={createHrefForLocale(locale, '/empresa')}
          >
            {dictionary.footer.about}
          </Link>
          <Link
            className={styles.footerLink}
            href={createHrefForLocale(locale, '/experiencia')}
          >
            {dictionary.footer.expertise}
          </Link>
        </nav>
        <nav
          className={styles.footerNavigation}
          aria-labelledby='footer-contact-heading'
        >
          <h2 id='footer-contact-heading'>{dictionary.footer.contact}</h2>
          <Link
            native
            className={styles.footerLink}
            href={`mailto:${CONTACT_EMAIL}`}
            aria-label={`${dictionary.footer.email}: ${CONTACT_EMAIL}`}
          >
            <MailIcon />
            {dictionary.footer.email}
          </Link>
          <Link
            native
            className={styles.footerLink}
            href={PHONE_URL}
            aria-label={`${dictionary.footer.phone}: ${PHONE_NUMBER}`}
          >
            <PhoneIcon />
            {dictionary.footer.phone}
          </Link>
        </nav>
        <div className={styles.footerBottom}>
          <p>
            © {new Date().getFullYear()} {LEGAL_NAME}
          </p>
          <Link
            native
            className={styles.footerSocialLink}
            href={LINKEDIN_URL}
            aria-label='LinkedIn'
            title='LinkedIn'
            target='_blank'
            rel='noopener noreferrer'
          >
            <LinkedInIcon />
          </Link>
        </div>
      </div>
    </footer>
  );
}
