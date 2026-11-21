import type { SupportedLocale } from '../../lib/i18n/locales';

/** The texts of the machine page and its sections, in English. */
const en = {
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
  rangeViews: 'Range views',
  views: {
    coverage: 'Coverage area',
    side: 'Side view',
    turning: 'Turning radius'
  },
  dimensions: 'Dimensions in mm',
  comqVersion: 'COMQ version',
  factoryModel: 'Factory model',
  options: 'Equipment options',
  defaultValue: 'Default',
  extras: 'Optional equipment',
  select: 'Prepare an enquiry',
  closing: 'Prepare your enquiry',
  next: 'Choose your configuration, purchase or rental preference, and project details in the selector. COMQ will confirm availability and terms.',
  contact: 'You can also talk to COMQ on WhatsApp.',
  contactLabel: 'Talk to COMQ on WhatsApp (opens a new tab)'
};

/** The machine texts of one language; Spanish has the English shape. */
export type MachineContent = typeof en;

const es: MachineContent = {
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
  rangeViews: 'Vistas de alcance',
  views: {
    coverage: 'Área de cobertura',
    side: 'Vista lateral',
    turning: 'Radio de giro'
  },
  dimensions: 'Medidas en mm',
  comqVersion: 'Versión COMQ',
  factoryModel: 'Modelo de fábrica',
  options: 'Opciones de equipo',
  defaultValue: 'De serie',
  extras: 'Equipamiento opcional',
  select: 'Preparar una consulta',
  closing: 'Prepara tu consulta',
  next: 'Elige la configuración, indica si prefieres comprar o alquilar y añade los detalles de tu proyecto en el selector. COMQ confirmará la disponibilidad y las condiciones.',
  contact: 'También puedes conversar con COMQ por WhatsApp.',
  contactLabel: 'Conversar con COMQ por WhatsApp (abre otra pestaña)'
};

/**
 * The machine texts in a language, for the machine page and its sections.
 *
 * @param locale - The page's language.
 * @returns The texts in that language.
 */
export const getMachineContent = (locale: SupportedLocale): MachineContent =>
  ({ es, en })[locale];
