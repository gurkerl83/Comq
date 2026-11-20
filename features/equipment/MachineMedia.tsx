import { Gallery } from '../../components/gallery';
import { ServiceImagePlaceholder } from '../home/ServiceImagePlaceholder';
import type { MachineContent } from './machine-content';
import type { EquipmentEntry } from './types';
import styles from './MachinePage.module.css';

type MachineMediaProps = {
  /** The machine whose pictures the frame shows. */
  equipment: EquipmentEntry;
  /** The machine texts in the page's language. */
  content: MachineContent;
};

/**
 * The machine's pictures in their frame: the Gallery, or a placeholder with
 * a caption while the machine has no photograph.
 */
export function MachineMedia({ equipment, content }: MachineMediaProps) {
  return (
    <figure className={styles.media}>
      {equipment.images.length > 0 ? (
        <Gallery images={equipment.images} labels={content.gallery} />
      ) : (
        <>
          <ServiceImagePlaceholder
            className={styles.image}
            alt={content.noImage}
          />
          <figcaption>{content.noImage}</figcaption>
        </>
      )}
    </figure>
  );
}
