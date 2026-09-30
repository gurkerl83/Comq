import {
  createHrefForLocale,
  type SupportedLocale
} from '../../lib/i18n/locales';
import { WHATSAPP_URL } from '../../lib/site/config';
import { ServiceImagePlaceholder } from '../home/ServiceImagePlaceholder';
import { Link } from '../../components/Link';
import type { EquipmentEntry, EquipmentOption } from './types';
import { Gallery } from '../../components/gallery';
import styles from './MachinePage.module.css';

const CONTENT = {
  es: {
    model: 'Modelo',
    unconfirmed: 'Por confirmar con COMQ',
    noImage: 'Sin fotografía',
    gallery: {
      label: 'Imágenes del equipo',
      openImage: 'Abrir imagen',
      moreImages: 'Más imágenes',
      close: 'Cerrar',
      previous: 'Imagen anterior',
      next: 'Imagen siguiente',
      image: 'Imagen'
    },
    application: 'Aplicación',
    specifications: 'Especificaciones',
    options: 'Opciones de equipo',
    defaultValue: 'De serie',
    extras: 'Equipamiento opcional',
    select: 'Preparar una consulta',
    closing: 'Prepara tu consulta',
    next: 'Elige la configuración, indica si prefieres comprar o alquilar y añade los detalles de tu proyecto en el selector. COMQ confirmará la disponibilidad y las condiciones.',
    contact: 'También puedes conversar con COMQ por WhatsApp.',
    contactLabel: 'Conversar con COMQ por WhatsApp (abre otra pestaña)'
  },
  en: {
    model: 'Model',
    unconfirmed: 'To be confirmed with COMQ',
    noImage: 'No photograph',
    gallery: {
      label: 'Equipment images',
      openImage: 'Open image',
      moreImages: 'More images',
      close: 'Close',
      previous: 'Previous image',
      next: 'Next image',
      image: 'Image'
    },
    application: 'Application',
    specifications: 'Specifications',
    options: 'Equipment options',
    defaultValue: 'Default',
    extras: 'Optional equipment',
    select: 'Prepare an enquiry',
    closing: 'Prepare your enquiry',
    next: 'Choose your configuration, purchase or rental preference, and project details in the selector. COMQ will confirm availability and terms.',
    contact: 'You can also talk to COMQ on WhatsApp.',
    contactLabel: 'Talk to COMQ on WhatsApp (opens a new tab)'
  }
};

/**
 * Format the available choices, marking the default with its translated label.
 */
function formatOptionChoices(
  option: EquipmentOption,
  defaultLabel: string
): string {
  return option.choices
    .map(choice =>
      choice.id === option.defaultChoice
        ? `${choice.label} (${defaultLabel})`
        : choice.label
    )
    .join(' · ');
}

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
          {equipment.images.length > 0 ? (
            <Gallery images={equipment.images} labels={content.gallery} />
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
          <h2 id='equipment-specifications'>{content.specifications}</h2>
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

      {(equipment.options.length > 0 || equipment.extras.length > 0) && (
        <section className={styles.options} aria-labelledby='equipment-options'>
          <h2 id='equipment-options'>{content.options}</h2>
          <ul>
            {equipment.options.map(option => (
              <li key={option.id}>
                <h3>{option.label}</h3>
                <p>{formatOptionChoices(option, content.defaultValue)}</p>
              </li>
            ))}
            {equipment.extras.length > 0 && (
              <li>
                <h3>{content.extras}</h3>
                <p>{equipment.extras.map(extra => extra.label).join(', ')}</p>
              </li>
            )}
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
