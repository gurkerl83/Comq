import type { EquipmentEntry } from '../../catalogue';
import styles from './Specifications.module.css';

type SpecificationsProps = {
  items: Readonly<EquipmentEntry['specifications']>;
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
