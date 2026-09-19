import type { SupportedLocale } from '../../lib/i18n/locales';
import { createPageMetadata } from '../../lib/site/metadata';
import type { EquipmentEntry } from './catalogue';

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
  ...(equipment.isDemo && { robots: { index: false, follow: true } })
});
