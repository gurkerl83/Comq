import {
  createHrefForLocale,
  type SupportedLocale
} from '../../lib/i18n/locales';
import { Link } from '../../components/Link';
import type { EquipmentEntry } from './catalogue';
import type { CatalogueContent } from './catalogue-content';
import { Specifications } from './selector/components/Specifications';
import styles from './MachineBrowseCard.module.css';

type MachineBrowseCardProps = {
  locale: SupportedLocale;
  machine: EquipmentEntry;
  translations: CatalogueContent;
};

/**
 * A server-rendered preview linking to the full machine page.
 * Show the first two specifications in their authored order; the same labels
 * and values appear in the wizard and machine page, which show the full list.
 */
export function MachineBrowseCard({
  locale,
  machine,
  translations
}: MachineBrowseCardProps) {
  return (
    <li className={styles.card}>
      <p className={styles.category}>
        {machine.categoryName}
        {machine.isDemo && <span> · {translations.demo}</span>}
      </p>
      <h3 className={styles.name}>{machine.name}</h3>
      <p className={styles.summary}>{machine.summary}</p>
      <Specifications
        items={machine.specifications.slice(0, 2)}
        fallback={translations.notSpecified}
      />
      <Link
        className={styles.details}
        href={createHrefForLocale(locale, `/equipos/${machine.slug}`)}
        aria-label={`${translations.details}: ${machine.name}`}
      >
        {translations.details}
      </Link>
    </li>
  );
}
