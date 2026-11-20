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
  /** The machine's pictures, when the overview lays them out itself. */
  media?: ReactNode;
  /** The machine's buttons, when the overview places them itself. */
  actions?: ReactNode;
  /** What follows the model, such as the key figures. */
  children: ReactNode;
};

/**
 * The machine's category, name, summary and model, followed by what the
 * caller passes in, such as the actions.
 *
 * 1. Without media it is one column; the page around it places the pictures,
 *    as the machine page does.
 * 2. With media it lays out a stage from 900px: the category and the name
 *    across the top, below them the pictures on the left and the rest on the
 *    right. Below 900px the same order runs top to bottom: the category and
 *    the name, the pictures, then the rest.
 * 3. actions are shown side by side below everything else; in the stage
 *    they sit to the right of the name, as Customize sits beside a machine
 *    card's title in the selector.
 */
export function MachineOverview({
  equipment,
  content,
  heading: Heading,
  media,
  actions,
  children
}: MachineOverviewProps) {
  return (
    <header className={media ? styles.stage : undefined}>
      <p className={styles.category}>{equipment.categoryName}</p>
      <Heading id='equipment-title' className={styles.name}>
        {equipment.name}
      </Heading>
      {media}
      <div className={styles.facts}>
        <p className={styles.summary}>{equipment.summary}</p>
        <p className={styles.model}>
          {content.model}:{' '}
          <strong>{equipment.model ?? content.unconfirmed}</strong>
        </p>
        {children}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
}
