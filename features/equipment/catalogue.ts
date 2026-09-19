import type { SupportedLocale } from '../../lib/i18n/locales';

type EquipmentCategoryId = keyof typeof CATEGORIES;

export type EquipmentEntry = {
  slug: string;
  category: EquipmentCategoryId;
  categoryName: string;
  categoryDescription: string;
  name: string;
  summary: string;
  application: string;
  model: string | null;
  specifications: Array<{ label: string; value: string | null }>;
  variants: Array<{ id: string; label: string; description: string }>;
  image?: { src: string; alt: string; width: number; height: number };
  isDemo: boolean;
};

export type EquipmentCategory = {
  id: EquipmentCategoryId;
  name: EquipmentEntry['categoryName'];
  description: EquipmentEntry['categoryDescription'];
};

type LocalizedText = Record<SupportedLocale, string>;
type EquipmentDefinition = {
  slug: string;
  category: EquipmentCategoryId;
  name: LocalizedText;
  summary: LocalizedText;
  application: LocalizedText;
  model: string | null;
  specifications: Array<{ label: LocalizedText; value: string | null }>;
  variants: Array<{
    id: string;
    label: LocalizedText;
    description: LocalizedText;
  }>;
  image?: { src: string; alt: LocalizedText; width: number; height: number };
  isDemo: boolean;
};

const CATEGORIES = {
  jumbo: {
    name: { es: 'Jumbos', en: 'Jumbos' },
    description: {
      es: 'Explora ejemplos de equipos de perforación subterránea.',
      en: 'Explore examples of underground drilling equipment.'
    }
  },
  scooptram: {
    name: { es: 'Scooptrams', en: 'Scooptrams' },
    description: {
      es: 'Explora ejemplos de equipos de carga y transporte.',
      en: 'Explore examples of loading and hauling equipment.'
    }
  },
  drill: {
    name: { es: 'Perforadoras', en: 'Drilling rigs' },
    description: {
      es: 'Explora ejemplos de equipos para tareas de perforación.',
      en: 'Explore examples of equipment for drilling tasks.'
    }
  }
};

const DEMO_VARIANTS: EquipmentDefinition['variants'] = [
  {
    id: 'standard',
    label: { es: 'Estándar', en: 'Standard' },
    description: {
      es: 'Configuración ficticia de referencia para probar la selección.',
      en: 'Fictional reference configuration for trying the selection process.'
    }
  },
  {
    id: 'compact',
    label: { es: 'Compacta', en: 'Compact' },
    description: {
      es: 'Alternativa compacta ficticia para comparar configuraciones.',
      en: 'Fictional compact alternative for comparing configurations.'
    }
  }
];

// These records are intentionally fictional. Add confirmed catalogue records
// here with isDemo: false; keep their stable slugs and variant IDs language-free.
const EQUIPMENT: EquipmentDefinition[] = [
  {
    slug: 'demo-jumbo-j1',
    category: 'jumbo',
    name: { es: 'Jumbo Demo J1', en: 'Demo Jumbo J1' },
    summary: {
      es: 'Jumbo ficticio de un brazo para probar la selección de equipo, variante y modalidad.',
      en: 'Fictional single-boom jumbo for trying equipment, variant and purchase or rental selection.'
    },
    application: {
      es: 'Ejemplo de una operación de perforación subterránea. Describe tu proyecto al preparar la consulta.',
      en: 'An example underground drilling operation. Describe your project when preparing the enquiry.'
    },
    model: 'DEMO J1',
    specifications: [
      { label: { es: 'Brazos', en: 'Booms' }, value: '1' },
      { label: { es: 'Potencia', en: 'Power' }, value: '105 kW' },
      { label: { es: 'Ancho', en: 'Width' }, value: '1.8 m' }
    ],
    variants: DEMO_VARIANTS,
    isDemo: true
  },
  {
    slug: 'demo-jumbo-j2',
    category: 'jumbo',
    name: { es: 'Jumbo Demo J2', en: 'Demo Jumbo J2' },
    summary: {
      es: 'Segundo jumbo ficticio para comparar modelos de una misma categoría y preparar una consulta de compra o alquiler.',
      en: 'A second fictional jumbo for comparing models in the same category and preparing a purchase or rental enquiry.'
    },
    application: {
      es: 'Ejemplo de una operación de perforación con dos brazos. Las cifras solo ilustran las opciones del selector.',
      en: 'An example drilling operation with two booms. The figures only illustrate the selector options.'
    },
    model: 'DEMO J2',
    specifications: [
      { label: { es: 'Brazos', en: 'Booms' }, value: '2' },
      { label: { es: 'Potencia', en: 'Power' }, value: '145 kW' },
      { label: { es: 'Ancho', en: 'Width' }, value: '2.4 m' }
    ],
    variants: DEMO_VARIANTS,
    isDemo: true
  },
  {
    slug: 'demo-scooptram-s1',
    category: 'scooptram',
    name: { es: 'Scooptram Demo S1', en: 'Demo Scooptram S1' },
    summary: {
      es: 'Scooptram ficticio para explorar una consulta de carga y transporte, en compra o alquiler.',
      en: 'Fictional scooptram for exploring a loading and hauling enquiry, for purchase or rental.'
    },
    application: {
      es: 'Ejemplo de tareas de carga y transporte de material. La capacidad indicada es un dato de demostración.',
      en: 'An example of material loading and hauling tasks. The stated capacity is demonstration data.'
    },
    model: 'DEMO S1',
    specifications: [
      { label: { es: 'Capacidad de carga', en: 'Payload' }, value: '3 t' },
      { label: { es: 'Potencia', en: 'Power' }, value: '90 kW' },
      { label: { es: 'Ancho', en: 'Width' }, value: '1.6 m' }
    ],
    variants: DEMO_VARIANTS,
    isDemo: true
  },
  {
    slug: 'demo-drill-d1',
    category: 'drill',
    name: { es: 'Perforadora Demo D1', en: 'Demo Drilling Rig D1' },
    summary: {
      es: 'Perforadora ficticia para probar la elección de una configuración y preparar una consulta de compra o alquiler.',
      en: 'Fictional drilling rig for trying configuration selection and preparing a purchase or rental enquiry.'
    },
    application: {
      es: 'Ejemplo de un proyecto de perforación. El método y las condiciones de trabajo se describen en la consulta.',
      en: 'An example drilling project. Describe the method and working conditions in the enquiry.'
    },
    model: 'DEMO D1',
    specifications: [
      {
        label: { es: 'Diámetro de perforación', en: 'Drilling diameter' },
        value: '76 mm'
      },
      { label: { es: 'Potencia', en: 'Power' }, value: '75 kW' },
      { label: { es: 'Ancho', en: 'Width' }, value: '1.5 m' }
    ],
    variants: DEMO_VARIANTS,
    isDemo: true
  }
];

export const EQUIPMENT_SLUGS: string[] = EQUIPMENT.map(entry => entry.slug);

/**
 * Resolve catalogue text on the server, then pass serializable entries to UI.
 */
export const getEquipmentCatalogue = (
  locale: SupportedLocale
): EquipmentEntry[] =>
  EQUIPMENT.map(entry => ({
    slug: entry.slug,
    category: entry.category,
    categoryName: CATEGORIES[entry.category].name[locale],
    categoryDescription: CATEGORIES[entry.category].description[locale],
    name: entry.name[locale],
    summary: entry.summary[locale],
    application: entry.application[locale],
    model: entry.model,
    specifications: entry.specifications.map(specification => ({
      label: specification.label[locale],
      value: specification.value
    })),
    variants: entry.variants.map(variant => ({
      id: variant.id,
      label: variant.label[locale],
      description: variant.description[locale]
    })),
    ...(entry.image && {
      image: { ...entry.image, alt: entry.image.alt[locale] }
    }),
    isDemo: entry.isDemo
  }));
