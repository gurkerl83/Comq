import type { EquipmentEntry } from '../../types';
import styles from './Specifications.module.css';

type SpecificationsProps = {
  /** The rows to show, each a label and its value. */
  items: ReadonlyArray<
    Pick<EquipmentEntry['specifications'][number], 'label' | 'value'>
  >;
  /** The text shown in place of a missing value. */
  fallback: string;
  /** How the rows are drawn; a table when left out. */
  layout?: 'table' | 'inline';
};

/**
 * A machine's specifications as a list of labels and values. The markup is
 * the same in both layouts; Specifications.module.css draws it.
 *
 * 1. table: the label beside its value, a line under each row.
 * 2. inline: one line of small text, each label followed by its value, for
 *    a few figures in little room.
 */
export function Specifications({
  items,
  fallback,
  layout = 'table'
}: SpecificationsProps) {
  return (
    <dl className={`${styles.specifications} ${styles[layout]}`}>
      {items.map(spec => (
        <div key={spec.label} className={styles.row}>
          <dt>{spec.label}</dt>
          <dd>{spec.value ?? fallback}</dd>
        </div>
      ))}
    </dl>
  );
}
