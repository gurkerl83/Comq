import Image from 'next/image';
import Link from 'next/link';

import {
  createHrefForLocale,
  type SupportedLocale
} from '../../lib/i18n/locales';
import { WHATSAPP_URL } from '../../lib/site/config';
import { ServiceImagePlaceholder } from '../home/ServiceImagePlaceholder';
import { Breadcrumbs } from '../site/Breadcrumbs';
import type { EquipmentEntry } from './catalogue';
import styles from './MachinePage.module.css';

const CONTENT = {
  es: {
    breadcrumb: 'Ruta de navegación',
    sales: 'Venta de equipos',
    demo: 'Equipo de demostración',
    demoNotice:
      'Los modelos, las especificaciones y las variantes de esta demostración son ficticios. Sirven para probar el selector y no constituyen una oferta real de venta o alquiler.',
    model: 'Modelo',
    unconfirmed: 'Por confirmar con COMQ',
    noImage: 'Sin fotografía',
    application: 'Aplicación',
    specifications: 'Especificaciones',
    demoSpecifications: 'Especificaciones ficticias de referencia',
    variants: 'Variantes',
    demoVariants: 'Variantes de demostración',
    select: 'Seleccionar este equipo',
    closing: 'Prepara tu consulta',
    next: 'Elige la configuración, indica si prefieres comprar o alquilar y añade los detalles de tu proyecto en el selector. COMQ confirmará la disponibilidad y las condiciones.',
    contact: 'También puedes conversar con COMQ por WhatsApp.',
    contactLabel: 'Conversar con COMQ por WhatsApp (abre otra pestaña)'
  },
  en: {
    breadcrumb: 'Breadcrumb',
    sales: 'Equipment sales',
    demo: 'Demonstration equipment',
    demoNotice:
      'The models, specifications and variants in this demonstration are fictional. They are for trying the selector and do not represent an actual sale or rental offer.',
    model: 'Model',
    unconfirmed: 'To be confirmed with COMQ',
    noImage: 'No photograph',
    application: 'Application',
    specifications: 'Specifications',
    demoSpecifications: 'Fictional reference specifications',
    variants: 'Variants',
    demoVariants: 'Demonstration variants',
    select: 'Select this equipment',
    closing: 'Prepare your enquiry',
    next: 'Choose your configuration, purchase or rental preference, and project details in the selector. COMQ will confirm availability and terms.',
    contact: 'You can also talk to COMQ on WhatsApp.',
    contactLabel: 'Talk to COMQ on WhatsApp (opens a new tab)'
  }
};

export function MachinePage({
  locale,
  equipment
}: {
  locale: SupportedLocale;
  equipment: EquipmentEntry;
}) {
  const content = CONTENT[locale];
  const selectorHref = {
    pathname: createHrefForLocale(locale, '/selector'),
    query: { machine: equipment.slug }
  };

  return (
    <article className={styles.page} aria-labelledby='equipment-title'>
      <Breadcrumbs
        label={content.breadcrumb}
        ancestors={[
          { href: createHrefForLocale(locale, '/venta'), label: content.sales }
        ]}
        currentPage={equipment.name}
      />

      {equipment.isDemo && (
        <aside className={styles.notice} aria-labelledby='demo-label'>
          <strong id='demo-label'>{content.demo}</strong>
          <p>{content.demoNotice}</p>
        </aside>
      )}

      <div className={styles.hero}>
        <header>
          <p className={styles.category}>{equipment.categoryName}</p>
          <h1 id='equipment-title'>{equipment.name}</h1>
          <p className={styles.summary}>{equipment.summary}</p>
          <p className={styles.model}>
            {content.model}:{' '}
            <strong>{equipment.model ?? content.unconfirmed}</strong>
          </p>
          <Link className={styles.action} href={selectorHref}>
            {content.select}
            <span aria-hidden='true'> →</span>
          </Link>
        </header>

        <figure className={styles.media}>
          {equipment.image ? (
            <Image
              className={styles.image}
              src={equipment.image.src}
              alt={equipment.image.alt}
              width={equipment.image.width}
              height={equipment.image.height}
              sizes='(max-width: 640px) 100vw, 50vw'
            />
          ) : (
            <>
              <ServiceImagePlaceholder
                className={styles.image}
                alt={content.noImage}
              />
              <figcaption>{content.noImage}</figcaption>
            </>
          )}
        </figure>
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
          <h2 id='equipment-specifications'>
            {equipment.isDemo
              ? content.demoSpecifications
              : content.specifications}
          </h2>
          <dl className={styles.specifications}>
            {equipment.specifications.map(specification => (
              <div key={specification.label}>
                <dt>{specification.label}</dt>
                <dd>{specification.value ?? content.unconfirmed}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      {equipment.variants.length > 0 && (
        <section
          className={styles.variants}
          aria-labelledby='equipment-variants'
        >
          <h2 id='equipment-variants'>
            {equipment.isDemo ? content.demoVariants : content.variants}
          </h2>
          <ul>
            {equipment.variants.map(variant => (
              <li key={variant.id}>
                <h3>{variant.label}</h3>
                <p>{variant.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={styles.closing} aria-labelledby='equipment-enquiry'>
        <h2 id='equipment-enquiry'>{content.closing}</h2>
        <p>{content.next}</p>
        <Link className={styles.action} href={selectorHref}>
          {content.select}
          <span aria-hidden='true'> →</span>
        </Link>
        <p>
          <a
            href={WHATSAPP_URL}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={content.contactLabel}
          >
            {content.contact}
          </a>
        </p>
      </section>
    </article>
  );
}
