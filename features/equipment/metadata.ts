import type { SupportedLocale } from '../../lib/i18n/locales';
import { createPageMetadata } from '../../lib/site/metadata';
import type { EquipmentEntry } from './types';

export const getEquipmentMetadata = (
  locale: SupportedLocale,
  equipment: EquipmentEntry
) => ({
  ...createPageMetadata(
    locale,
    `/equipos/${equipment.slug}`,
    equipment.name,
    equipment.summary
  ),
  // Revisit this restriction when the catalogue is ready for search.
  robots: { index: false, follow: true }
});
