import type { EquipmentSelection } from './selection';
import type { EquipmentCategory, EquipmentEntry } from './types';

/**
 * The catalogue's categories, each listed once, in the order their first
 * machine appears in the catalogue.
 *
 * @param catalogue - Machines of this enquiry's catalogue.
 * @returns One entry per category with its name and description.
 */
export function listCategories(
  catalogue: EquipmentEntry[]
): EquipmentCategory[] {
  return [
    ...new Map(
      catalogue.map(entry => [
        entry.category,
        {
          id: entry.category,
          name: entry.categoryName,
          description: entry.categoryDescription
        }
      ])
    ).values()
  ];
}

/**
 * The machines of one category, in catalogue order.
 *
 * @param catalogue - Machines of this enquiry's catalogue.
 * @param category - The chosen category, or '' before one is chosen.
 * @returns The category's machines; none while no category is chosen.
 */
export function listMachines(
  catalogue: EquipmentEntry[],
  category: EquipmentSelection['category']
): EquipmentEntry[] {
  return catalogue.filter(entry => entry.category === category);
}
