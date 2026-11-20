import type { ReactNode } from 'react';

import type { MachineContent } from './machine-content';
import type { EquipmentEntry } from './types';
import styles from './MachinePage.module.css';

type MachineOverviewProps = {
  /** The machine the overview names. */
  equipment: EquipmentEntry;
  /** The machine texts in the page's language. */
  content: MachineContent;
  /**
   * The element for the machine's name: h1 on the machine page, h2 inside a
   * page that has its own h1.
   */
  heading: 'h1' | 'h2';
  /** What follows the model, such as the enquiry button. */
  children: ReactNode;
};

/**
 * The machine's category, name, summary and model, followed by what the
 * caller passes in, such as the actions.
 */
export function MachineOverview({
  equipment,
  content,
  heading: Heading,
  children
}: MachineOverviewProps) {
  return (
    <header>
      <p className={styles.category}>{equipment.categoryName}</p>
      <Heading id='equipment-title' className={styles.name}>
        {equipment.name}
      </Heading>
      <p className={styles.summary}>{equipment.summary}</p>
      <p className={styles.model}>
        {content.model}:{' '}
        <strong>{equipment.model ?? content.unconfirmed}</strong>
      </p>
      {children}
    </header>
  );
}
