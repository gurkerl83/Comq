import Image from 'next/image';

import { ServiceImagePlaceholder } from '../home/ServiceImagePlaceholder';
import type { CatalogueContent } from './catalogue-content';
import { Specifications } from './selector/components/Specifications';
import { SelectableCard } from './selector/controls/SelectableCard';
import type { EquipmentEntry } from './types';
import styles from './MachineBrowseCard.module.css';

type MachineBrowseCardProps = {
  /** The machine the card shows. */
  machine: EquipmentEntry;
  /** Whether the preview shows this machine. */
  selected: boolean;
  /** Shows this machine in the preview. */
  onSelect: () => void;
  /** The catalogue texts: the text for a missing value. */
  translations: CatalogueContent;
};

/**
 * One machine in the catalogue list, drawn as a SelectableCard: a thumbnail
 * of its first photograph, its name and, on one line, its first two
 * specifications in their authored order, so machines can be compared in
 * the list. Choosing it shows the machine in the preview.
 */
export function MachineBrowseCard({
  machine,
  selected,
  onSelect,
  translations
}: MachineBrowseCardProps) {
  const [image] = machine.images;

  return (
    <SelectableCard
      className={styles.card}
      selected={selected}
      onSelect={onSelect}
    >
      <span className={styles.thumbnail}>
        {image ? (
          <Image
            className={styles.image}
            src={image.src}
            alt=''
            width={image.width}
            height={image.height}
            sizes='10rem'
          />
        ) : (
          <ServiceImagePlaceholder className={styles.image} alt='' />
        )}
      </span>
      <span className={styles.name}>{machine.name}</span>
      <Specifications
        items={machine.specifications.slice(0, 2)}
        fallback={translations.notSpecified}
        layout='inline'
      />
    </SelectableCard>
  );
}
