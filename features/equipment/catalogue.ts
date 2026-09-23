import type { EquipmentContent } from '../../lib/i18n/types';
import type { EquipmentEntry } from './types';
import { EQUIPMENT, EQUIPMENT_SLUGS } from './catalogue-data';

/**
 * Assemble machine records with the selected language's equipment text.
 *
 * 1. Read each machine by its slug, preserving catalogue order.
 * 2. Resolve descriptions, labels and image alternatives through stable keys.
 * 3. Return display-ready entries without changing the records or dictionary.
 *
 * @param text - Equipment translations for the selected language.
 * @returns A new catalogue containing localized text and the shared machine facts.
 *
 * @example
 * // After loading the English dictionary:
 * // createEquipmentCatalogue(dictionary.equipment) includes the J1 power
 * // specification with label "Power" and its shared value "105 kW".
 */
export const createEquipmentCatalogue = (
  text: EquipmentContent
): EquipmentEntry[] =>
  EQUIPMENT_SLUGS.map(slug => {
    const entry = EQUIPMENT[slug];

    return {
      slug,
      category: entry.category,
      categoryName: text.categories[entry.category].name,
      categoryDescription: text.categories[entry.category].description,
      ...text.machines[slug],
      model: entry.model,
      specifications: entry.specifications.map(specification => ({
        ...specification,
        label: text.specifications[specification.id]
      })),
      options: entry.options.map(option => ({
        ...option,
        label: text.specifications[option.label],
        choices: option.choices.map(choice => ({ ...choice }))
      })),
      extras: entry.extras.map(id => ({ id, label: text.extras[id] })),
      images: entry.images.map(image => ({
        ...image,
        alt: text.images[image.alt]
      })),
      isDemo: entry.isDemo
    };
  });
