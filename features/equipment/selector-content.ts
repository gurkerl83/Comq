import type { SupportedLocale } from '../../lib/i18n/locales';
import { getCountryOptions } from '../../lib/i18n/countries';
import { SelectionStep } from './selection-steps';
import { SELECTION_LIMITS } from './selection-limits';

const en = {
  breadcrumb: 'Breadcrumb',
  sales: 'Equipment sales',
  breadcrumbTitle: 'Equipment selector',
  title: 'Find equipment for your operation',
  introduction:
    'Explore equipment, choose a configuration and prepare your enquiry. You can go back at any time to adjust your selection.',
  demo: 'Machines marked “Demo”, including their specifications and configurations, are fictional examples for trying the selector. They are not actual COMQ offers.',
  entryLink: 'Use the guided selector',
  progress: 'Selection progress',
  steps: {
    [SelectionStep.Category]: {
      title: 'What type of equipment do you need?',
      shortTitle: 'Equipment',
      description: 'Choose a category to see the available examples.'
    },
    [SelectionStep.Machine]: {
      title: 'Choose your machine',
      shortTitle: 'Machine',
      description:
        'Review the key differences and select a machine. Open its page for more detail.'
    },
    [SelectionStep.Requirements]: {
      title: 'Make it fit your enquiry',
      shortTitle: 'Requirements',
      description:
        'Choose a configuration and your preferred purchase or rental option. COMQ will confirm suitability, availability and terms.'
    },
    [SelectionStep.Review]: {
      title: 'Review your selection',
      shortTitle: 'Review',
      description: 'Check the details before opening your enquiry in WhatsApp.'
    }
  },
  next: 'Continue',
  back: 'Back',
  changeEquipment: 'Change equipment',
  edit: 'Edit',
  details: 'View machine details',
  opensNewTab: 'opens in a new tab',
  oneMachine:
    'This category has one machine, so it is selected for you. You can still review its details.',
  configuration: 'Configuration',
  configurationAdvice: 'I need advice on the configuration',
  acquisition: 'How would you like to obtain it?',
  purchase: 'Purchase',
  rental: 'Rental',
  quantity: 'Number of machines',
  country: 'Country',
  countries: getCountryOptions('en'),
  selectCountry: 'Select a country',
  projectLocation: 'Mine / project location',
  projectLocationHelp: 'For example: near Arequipa.',
  required: 'Required',
  optional: 'Optional',
  duration: 'Rental duration',
  durationUnit: 'Unit',
  weeks: 'Weeks',
  months: 'Months',
  startDate: 'Preferred rental start date',
  requirements: 'Operating requirements or questions',
  requirementsHelp:
    'Tell us about the work, access constraints or anything you want to clarify.',
  category: 'Equipment type',
  machine: 'Machine',
  notSpecified: 'Not specified',
  advice: 'Advice requested',
  message: {
    demoTitle: 'DEMO ENQUIRY',
    demoNotice: 'Fictional equipment — not an actual product offer.',
    introduction: 'Hello COMQ, I would like to discuss this equipment:',
    equipment: 'Equipment',
    purchase: 'Purchase request',
    rental: 'Rental request',
    location: 'Location',
    notes: 'Additional requirements',
    labels: {
      category: 'Type',
      machine: 'Machine',
      variant: 'Configuration',
      quantity: 'Quantity',
      country: 'Country',
      projectLocation: 'Mine / project',
      rentalDuration: 'Duration',
      startDate: 'Preferred start date'
    }
  },
  send: 'Open enquiry in WhatsApp',
  chooseCategory: 'Choose an equipment type to continue.',
  chooseMachine: 'Choose a machine to continue.',
  invalidVariant: 'Choose an available configuration or request advice.',
  invalidAcquisition: 'Choose purchase or rental.',
  invalidQuantity: `Enter a whole number of machines between ${SELECTION_LIMITS.quantity.min} and ${SELECTION_LIMITS.quantity.max}.`,
  chooseCountry: 'Choose a country to continue.',
  projectLocationTooLong: `Keep the mine or project location within ${SELECTION_LIMITS.projectLocation.maxLength} characters.`,
  invalidDuration: `Enter a whole rental duration between ${SELECTION_LIMITS.rentalDuration.min} and ${SELECTION_LIMITS.rentalDuration.max}.`,
  invalidRentalUnit: 'Choose weeks or months.',
  invalidDate: 'Enter a valid calendar date: today or a future date.',
  notesTooLong: `Keep operating requirements within ${SELECTION_LIMITS.notes.maxLength} characters.`,
  noMachines:
    'No machines are listed in this category yet. Contact COMQ for advice.',
  emptyCatalogue:
    'The equipment catalogue is being prepared. Contact COMQ to discuss your requirements.',
  contact: 'Contact COMQ',
  confirmation:
    'All model, configuration and delivery details will be confirmed by COMQ.'
};

export type SelectorContent = typeof en;

// Each server page passes its selected dictionary, including localized country
// options, to the interactive form. The browser uses the supplied labels/order.
const es: SelectorContent = {
  breadcrumb: 'Ruta de navegación',
  sales: 'Venta de equipos',
  breadcrumbTitle: 'Selector de equipos',
  title: 'Encuentra el equipo para tu operación',
  introduction:
    'Explora los equipos, elige una configuración y prepara tu consulta. Puedes volver a cualquier paso para ajustar tu selección.',
  demo: 'Los equipos identificados como “Demo”, junto con sus especificaciones y configuraciones, son ejemplos ficticios para probar el selector. No representan ofertas reales de COMQ.',
  entryLink: 'Usar el selector guiado',
  progress: 'Avance de la selección',
  steps: {
    [SelectionStep.Category]: {
      title: '¿Qué tipo de equipo necesitas?',
      shortTitle: 'Tipo',
      description: 'Elige una categoría para ver los ejemplos disponibles.'
    },
    [SelectionStep.Machine]: {
      title: 'Elige tu equipo',
      shortTitle: 'Equipo',
      description:
        'Compara las características principales y selecciona un equipo. Abre su página para conocer más detalles.'
    },
    [SelectionStep.Requirements]: {
      title: 'Cuéntanos qué necesitas',
      shortTitle: 'Requisitos',
      description:
        'Elige una configuración e indica si prefieres comprar o alquilar. COMQ confirmará si el equipo es adecuado, su disponibilidad y las condiciones.'
    },
    [SelectionStep.Review]: {
      title: 'Revisa tu selección',
      shortTitle: 'Revisión',
      description:
        'Verifica los detalles antes de abrir tu consulta en WhatsApp.'
    }
  },
  next: 'Continuar',
  back: 'Volver',
  changeEquipment: 'Cambiar equipo',
  edit: 'Editar',
  details: 'Ver detalles del equipo',
  opensNewTab: 'se abre en una nueva pestaña',
  oneMachine:
    'Esta categoría tiene un solo equipo, por eso ya está seleccionado. Puedes revisar sus detalles antes de continuar.',
  configuration: 'Configuración',
  configurationAdvice: 'Necesito asesoría sobre la configuración',
  acquisition: '¿Buscas comprar o alquilar?',
  purchase: 'Compra',
  rental: 'Alquiler',
  quantity: 'Cantidad de equipos',
  country: 'País',
  countries: getCountryOptions('es'),
  selectCountry: 'Selecciona un país',
  projectLocation: 'Ubicación de la mina o del proyecto',
  projectLocationHelp: 'Por ejemplo: cerca de Arequipa.',
  required: 'Obligatorio',
  optional: 'Opcional',
  duration: 'Duración del alquiler',
  durationUnit: 'Unidad',
  weeks: 'Semanas',
  months: 'Meses',
  startDate: 'Fecha deseada de inicio del alquiler',
  requirements: 'Necesidades de operación o consultas',
  requirementsHelp:
    'Cuéntanos sobre el trabajo, las restricciones de acceso o cualquier duda que tengas.',
  category: 'Tipo de equipo',
  machine: 'Equipo',
  notSpecified: 'Sin especificar',
  advice: 'Asesoría solicitada',
  message: {
    demoTitle: 'CONSULTA DE DEMOSTRACIÓN',
    demoNotice: 'Equipos ficticios — no constituyen una oferta real.',
    introduction: 'Hola, COMQ. Quisiera consultar sobre este equipo:',
    equipment: 'Equipo',
    purchase: 'Solicitud de compra',
    rental: 'Solicitud de alquiler',
    location: 'Ubicación',
    notes: 'Requisitos adicionales',
    labels: {
      category: 'Tipo',
      machine: 'Equipo',
      variant: 'Configuración',
      quantity: 'Cantidad',
      country: 'País',
      projectLocation: 'Mina / proyecto',
      rentalDuration: 'Duración',
      startDate: 'Fecha deseada de inicio'
    }
  },
  send: 'Abrir consulta en WhatsApp',
  chooseCategory: 'Elige un tipo de equipo para continuar.',
  chooseMachine: 'Elige un equipo para continuar.',
  invalidVariant: 'Elige una configuración disponible o solicita asesoría.',
  invalidAcquisition: 'Elige compra o alquiler.',
  invalidQuantity: `Ingresa una cantidad de equipos entre ${SELECTION_LIMITS.quantity.min} y ${SELECTION_LIMITS.quantity.max}, sin decimales.`,
  chooseCountry: 'Elige un país para continuar.',
  projectLocationTooLong: `Limita la ubicación de la mina o del proyecto a ${SELECTION_LIMITS.projectLocation.maxLength} caracteres.`,
  invalidDuration: `Ingresa una duración del alquiler entre ${SELECTION_LIMITS.rentalDuration.min} y ${SELECTION_LIMITS.rentalDuration.max}, sin decimales.`,
  invalidRentalUnit: 'Elige semanas o meses.',
  invalidDate: 'Ingresa una fecha válida: hoy o una fecha posterior.',
  notesTooLong: `Limita las necesidades de operación a ${SELECTION_LIMITS.notes.maxLength} caracteres.`,
  noMachines:
    'Aún no hay equipos en esta categoría. Contacta a COMQ para recibir asesoría.',
  emptyCatalogue:
    'Estamos preparando el catálogo de equipos. Contacta a COMQ para conversar sobre tus necesidades.',
  contact: 'Contactar a COMQ',
  confirmation:
    'COMQ confirmará todos los detalles del modelo, la configuración y la entrega.'
};

export const getSelectorContent = (locale: SupportedLocale) =>
  ({ es, en })[locale];
