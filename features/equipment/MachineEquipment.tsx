import type { MachineContent } from './machine-content';
import type { EquipmentEntry, EquipmentOption } from './types';
import styles from './MachineEquipment.module.css';

/**
 * Format the available choices, marking the default with its translated label.
 */
function formatOptionChoices(
  option: EquipmentOption,
  defaultLabel: string
): string {
  return option.choices
    .map(choice =>
      choice.id === option.defaultChoice
        ? `${choice.label} (${defaultLabel})`
        : choice.label
    )
    .join(' · ');
}

type MachineEquipmentProps = {
  /** The machine whose options and extras the list shows. */
  equipment: EquipmentEntry;
  /** The machine texts in the page's language. */
  content: MachineContent;
};

/**
 * The machine's options with their choices, then its optional extras, as a
 * list of boxes. The page or the preview around it adds the heading.
 */
export function MachineEquipment({
  equipment,
  content
}: MachineEquipmentProps) {
  return (
    <ul className={styles.list}>
      {equipment.options.map(option => (
        <li key={option.id} className={styles.item}>
          <h3>{option.label}</h3>
          <p>{formatOptionChoices(option, content.defaultValue)}</p>
        </li>
      ))}
      {equipment.extras.length > 0 && (
        <li className={styles.item}>
          <h3>{content.extras}</h3>
          <p>{equipment.extras.map(extra => extra.label).join(', ')}</p>
        </li>
      )}
    </ul>
  );
}
