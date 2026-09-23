import type { SupportedLocale } from '../../lib/i18n/locales';

/** Labels shared by equipment navigation and homepage entry links. */
const CONTENT = {
  en: {
    label: 'Equipment navigation',
    browse: 'Browse equipment',
    selector: 'Equipment selector'
  },
  es: {
    label: 'Navegación de equipos',
    browse: 'Explorar equipos',
    selector: 'Selector de equipos'
  }
};

export const getEquipmentNavigationContent = (locale: SupportedLocale) =>
  CONTENT[locale];
