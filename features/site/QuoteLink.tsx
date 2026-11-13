import { WHATSAPP_URL } from '../../lib/site/config';
import { WhatsAppIcon } from './icons';
import { Button } from '../../components/Button';
import styles from './QuoteLink.module.css';

/**
 * The site's quote button: a primary button that opens the WhatsApp chat in a
 * new tab. label is the short visible text; accessibleLabel also names the
 * channel for assistive technology.
 */
export function QuoteLink({
  label,
  accessibleLabel
}: {
  label: string;
  accessibleLabel: string;
}) {
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
