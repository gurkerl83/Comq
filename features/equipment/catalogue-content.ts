import type { SupportedLocale } from '../../lib/i18n/locales';

const en = {
  title: 'Browse equipment',
  introduction:
    'Compare machine types and key specifications, then open a machine page for configurations and more detail.',
  demo: 'Demo',
  demoNotice:
    'Machines marked “Demo” and their specifications are fictional examples, not actual COMQ offers.',
  details: 'View machine details',
  notSpecified: 'Not specified',
  browsePrompt: 'Prefer to browse?'
};

export type CatalogueContent = typeof en;

const es: CatalogueContent = {
  title: 'Explorar equipos',
  introduction:
    'Compara tipos de equipos y características principales. Abre la página de un equipo para conocer sus configuraciones y más detalles.',
  demo: 'Demo',
  demoNotice:
    'Los equipos identificados como “Demo” y sus especificaciones son ejemplos ficticios, no ofertas reales de COMQ.',
  details: 'Ver detalles del equipo',
  notSpecified: 'Sin especificar',
  browsePrompt: '¿Prefieres explorar los equipos?'
};

export const getCatalogueContent = (locale: SupportedLocale) =>
  ({ es, en })[locale];
