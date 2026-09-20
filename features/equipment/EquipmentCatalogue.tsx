import type { SupportedLocale } from '../../lib/i18n/locales';
import { getEquipmentCatalogue } from './catalogue';
import { getCatalogueContent } from './catalogue-content';
import { MachineBrowseCard } from './MachineBrowseCard';
import styles from './EquipmentCatalogue.module.css';

/**
 * Render the sales-page catalogue on the server, before the service details.
 * The selector's browse link targets this section. Opening a machine page
 * leads to its existing enquiry link, which starts the wizard at Requirements.
 */
export function EquipmentCatalogue({ locale }: { locale: SupportedLocale }) {
  const machines = getEquipmentCatalogue(locale);
  const translations = getCatalogueContent(locale);
  if (machines.length === 0) return null;

  return (
    <section
      id='equipment-catalogue'
      className={styles.catalogue}
      aria-labelledby='equipment-catalogue-title'
    >
      <h2 id='equipment-catalogue-title'>{translations.title}</h2>
      <p className={styles.introduction}>{translations.introduction}</p>
      {machines.some(machine => machine.isDemo) && (
        <p className={styles.demoNotice}>{translations.demoNotice}</p>
      )}
      <ul className={styles.machines}>
        {machines.map(machine => (
          <MachineBrowseCard
            key={machine.slug}
            locale={locale}
            machine={machine}
            translations={translations}
          />
        ))}
      </ul>
    </section>
  );
}
