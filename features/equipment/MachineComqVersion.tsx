import type { MachineContent } from './machine-content';
import type { EquipmentEntry } from './types';
import styles from './MachineComqVersion.module.css';

type MachineComqVersionProps = {
  /** The machine whose COMQ version the table describes. */
  equipment: EquipmentEntry;
  /** The machine texts in the page's language. */
  content: MachineContent;
};

/**
 * How the version COMQ supplies differs from the factory model: one row per
 * topic, the factory value beside the COMQ value. The page or the preview
 * around it adds the heading.
 */
export function MachineComqVersion({
  equipment,
  content
}: MachineComqVersionProps) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <td />
          <th scope='col'>{content.factoryModel}</th>
          <th scope='col' className={styles.comq}>
            {content.comqVersion}
          </th>
        </tr>
      </thead>
      <tbody>
        {equipment.comqVersion.map(row => (
          <tr key={row.topic}>
            <th scope='row'>{row.topic}</th>
            <td data-label={content.factoryModel}>{row.factory}</td>
            <td data-label={content.comqVersion} className={styles.comq}>
              {row.comq}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
