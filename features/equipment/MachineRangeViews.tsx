'use client';

import { useState } from 'react';
import Image from 'next/image';

import { Button } from '../../components/Button';
import type { MachineContent } from './machine-content';
import type { EquipmentDrawingView, EquipmentEntry } from './types';
import styles from './MachineRangeViews.module.css';

type MachineRangeViewsProps = {
  /** The machine whose range drawings the section shows. */
  equipment: EquipmentEntry;
  /** The machine texts in the page's language. */
  content: MachineContent;
};

/**
 * The machine's range drawings, one at a time: a tab per view, then the
 * drawing with its caption. The page or the preview around it adds the
 * heading; nothing shows when the machine has no drawings.
 */
export function MachineRangeViews({
  equipment,
  content
}: MachineRangeViewsProps) {
  const [chosenView, setChosenView] = useState<EquipmentDrawingView | null>(
    null
  );
  // The chosen view's drawing, or the first drawing until a view is chosen.
  const drawing =
    equipment.drawings.find(item => item.view === chosenView) ??
    equipment.drawings[0];
  if (!drawing) return null;

  const caption = [
    content.views[drawing.view],
    equipment.drawingNotes?.[drawing.view],
    content.dimensions
  ];

  return (
    <>
      <div className={styles.views}>
        {equipment.drawings.map(item => (
          <Button
            key={item.view}
            variant='tab'
            type='button'
            className={styles.view}
            data-current={item.view === drawing.view}
            onClick={() => setChosenView(item.view)}
          >
            {content.views[item.view]}
          </Button>
        ))}
      </div>
      <figure className={styles.drawing}>
        <Image
          className={styles.image}
          src={drawing.src}
          width={drawing.width}
          height={drawing.height}
          alt={`${content.views[drawing.view]}: ${equipment.name}`}
        />
        <figcaption>{caption.filter(Boolean).join(' · ')}</figcaption>
      </figure>
    </>
  );
}
