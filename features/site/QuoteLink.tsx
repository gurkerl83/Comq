import { WHATSAPP_URL } from '../../lib/site/config';
import { WhatsAppIcon } from './icons';
import styles from './QuoteLink.module.css';

export function QuoteLink({
  label,
  accessibleLabel
}: {
  label: string;
  accessibleLabel: string;
}) {
  return (
    <a
      className={styles.link}
      href={WHATSAPP_URL}
      target='_blank'
      rel='noopener noreferrer'
      aria-label={accessibleLabel}
    >
      <WhatsAppIcon />
      {label}
    </a>
  );
}
