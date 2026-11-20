import {
  createHrefForLocale,
  type SupportedLocale
} from '../../lib/i18n/locales';
import { WHATSAPP_URL } from '../../lib/site/config';
import { Button } from '../../components/Button';
import { Link } from '../../components/Link';
import type { EquipmentEntry } from './types';
import { getMachineContent } from './machine-content';
import { getMachineTabs } from './machine-tabs';
import { MachineComqVersion } from './MachineComqVersion';
import { MachineEquipment } from './MachineEquipment';
import { MachineMedia } from './MachineMedia';
import { MachineOverview } from './MachineOverview';
import { MachineRangeViews } from './MachineRangeViews';
import { Specifications } from './selector/components/Specifications';
import styles from './MachinePage.module.css';

type MachinePageProps = {
  /** The page's language, for the page texts and links. */
  locale: SupportedLocale;
  /** The machine the page shows. */
  equipment: EquipmentEntry;
};

/**
 * The detail page of one machine. The hero shows its name, summary and model
 * with the enquiry button, next to the image gallery. Below follow the
 * application and the specifications, the range drawings and the COMQ
 * version when the machine has them, and the equipment options. The closing
 * section repeats the enquiry button and offers WhatsApp.
 */
export function MachinePage({ locale, equipment }: MachinePageProps) {
  const content = getMachineContent(locale);
  const tabs = getMachineTabs(equipment);
  const selectorHref = {
    pathname: createHrefForLocale(locale, '/selector'),
    query: { machine: equipment.slug }
  };

  return (
    <article className={styles.page} aria-labelledby='equipment-title'>
      <div className={styles.hero}>
        <MachineOverview equipment={equipment} content={content} heading='h1'>
          <Button
            variant='primary'
            className={styles.action}
            href={selectorHref}
          >
            {content.select}
            <span aria-hidden='true'> →</span>
          </Button>
        </MachineOverview>
        <MachineMedia equipment={equipment} content={content} />
      </div>

      <div className={styles.details}>
        <section
          className={styles.section}
          aria-labelledby='equipment-application'
        >
          <h2 id='equipment-application'>{content.application}</h2>
          <p>{equipment.application}</p>
        </section>

        <section
          className={styles.section}
          aria-labelledby='equipment-specifications'
        >
          <h2 id='equipment-specifications'>{content.specifications}</h2>
          <Specifications
            items={equipment.specifications}
            fallback={content.unconfirmed}
          />
        </section>
      </div>

      {tabs.includes('range') && (
        <section className={styles.block} aria-labelledby='equipment-range'>
          <h2 id='equipment-range'>{content.rangeViews}</h2>
          <MachineRangeViews equipment={equipment} content={content} />
        </section>
      )}

      {tabs.includes('comq') && (
        <section className={styles.block} aria-labelledby='equipment-comq'>
          <h2 id='equipment-comq'>{content.comqVersion}</h2>
          <MachineComqVersion equipment={equipment} content={content} />
        </section>
      )}

      {tabs.includes('options') && (
        <section className={styles.block} aria-labelledby='equipment-options'>
          <h2 id='equipment-options'>{content.options}</h2>
          <MachineEquipment equipment={equipment} content={content} />
        </section>
      )}

      <section className={styles.closing} aria-labelledby='equipment-enquiry'>
        <h2 id='equipment-enquiry'>{content.closing}</h2>
        <p>{content.next}</p>
        <Button variant='primary' className={styles.action} href={selectorHref}>
          {content.select}
          <span aria-hidden='true'> →</span>
        </Button>
        <p>
          <Link
            native
            href={WHATSAPP_URL}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={content.contactLabel}
          >
            {content.contact}
          </Link>
        </p>
      </section>
    </article>
  );
}
