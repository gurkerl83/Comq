import { WHATSAPP_URL } from '../../lib/site/config';
import { WhatsAppIcon } from './icons';
import { Button } from '../../components/Button';
import styles from './QuoteLink.module.css';

type QuoteLinkProps = {
  /** The short visible text. */
  label: string;
  /** The name for assistive technology; it also names the channel. */
  accessibleLabel: string;
};

/**
 * The site's quote button: a primary button that opens the WhatsApp chat in a
 * new tab.
 */
export function QuoteLink({ label, accessibleLabel }: QuoteLinkProps) {
  return (
    <Button
      native
      variant='primary'
      className={styles.link}
      href={WHATSAPP_URL}
      target='_blank'
      rel='noopener noreferrer'
      aria-label={accessibleLabel}
    >
      <WhatsAppIcon />
      {label}
    </Button>
  );
}
