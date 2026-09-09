import type { Dictionary } from '../../lib/i18n/types';
import { QuoteLink } from './QuoteLink';
import styles from './QuoteInvitation.module.css';

export function QuoteInvitation({ dictionary }: { dictionary: Dictionary }) {
  return (
    <section
      className={styles.section}
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
