import { WHATSAPP_URL } from '../../lib/site/config';
import { WhatsAppIcon } from './icons';
import { Link } from '../../components/Link';
import styles from './QuoteLink.module.css';

export function QuoteLink({
  label,
  accessibleLabel
}: {
  label: string;
  accessibleLabel: string;
}) {
  return (
    <Link
      native
      className={styles.link}
      href={WHATSAPP_URL}
      target='_blank'
      rel='noopener noreferrer'
      aria-label={accessibleLabel}
    >
      <WhatsAppIcon />
      {label}
    </Link>
  );
}
