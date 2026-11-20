import type { EquipmentEntry } from '../../types';
import styles from './Specifications.module.css';

type SpecificationsProps = {
  /** The rows to show, each a label and its value. */
  items: Readonly<EquipmentEntry['specifications']>;
  /** The text shown in place of a missing value. */
  fallback: string;
};

export function Specifications({ items, fallback }: SpecificationsProps) {
  return (
    <dl className={styles.specifications}>
      {items.map(spec => (
        <div key={spec.label} className={styles.row}>
          <dt>{spec.label}</dt>
          <dd>{spec.value ?? fallback}</dd>
        </div>
      ))}
    </dl>
  );
}
