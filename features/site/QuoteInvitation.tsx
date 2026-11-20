import type { Dictionary } from '../../lib/i18n/types';
import { QuoteLink } from './QuoteLink';
import styles from './QuoteInvitation.module.css';

type QuoteInvitationProps = {
  /** The site's texts in the page's language. */
  dictionary: Dictionary;
  /** Draws a line above the section (default). */
  showDivider?: boolean;
};

export function QuoteInvitation({
  dictionary,
  showDivider = true
}: QuoteInvitationProps) {
  return (
    <section
      className={
        showDivider ? `${styles.section} ${styles.withDivider}` : styles.section
      }
      aria-labelledby='quote-invitation-heading'
    >
      <h2 id='quote-invitation-heading' className={styles.heading}>
        {dictionary.quote.invitation}
      </h2>
      <QuoteLink
        label={dictionary.navigation.whatsapp}
        accessibleLabel={dictionary.navigation.whatsappLabel}
      />
    </section>
  );
}
