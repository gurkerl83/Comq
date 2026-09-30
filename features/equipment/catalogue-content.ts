import type { SupportedLocale } from '../../lib/i18n/locales';

const en = {
  title: 'Browse equipment',
  introduction:
    'Compare machine types and key specifications, then open a machine page for configurations and more detail.',
  details: 'View machine details',
  notSpecified: 'Not specified'
};

export type CatalogueContent = typeof en;

const es: CatalogueContent = {
  title: 'Explorar equipos',
  introduction:
    'Compara tipos de equipos y características principales. Abre la página de un equipo para conocer sus configuraciones y más detalles.',
  details: 'Ver detalles del equipo',
  notSpecified: 'Sin especificar'
};

export const getCatalogueContent = (locale: SupportedLocale) =>
  ({ es, en })[locale];
