import Image from 'next/image';

import type { GalleryContent, GallerySelection } from './Gallery.svc';
import styles from './GalleryThumbnails.module.css';

/** Inputs for the strip of thumbnails in the viewer. */
type GalleryThumbnailsProps = GalleryContent & GallerySelection;

export function GalleryThumbnails({
  images,
  labels,
  activeIndex,
  onSelect
}: GalleryThumbnailsProps) {
  return (
    <div className={styles.thumbnails} role='group' aria-label={labels.label}>
      {images.map((image, index) => (
        <button
          key={image.src}
          type='button'
          className={styles.thumbnail}
          aria-label={`${labels.image} ${index + 1}: ${image.alt}`}
          aria-current={index === activeIndex ? 'true' : undefined}
          title={image.alt}
          onClick={() => onSelect(index)}
        >
          <Image
            className={styles.image}
            src={image.src}
            alt=''
            width={image.width}
            height={image.height}
            sizes='(max-width: 640px) 64px, 80px'
          />
        </button>
      ))}
    </div>
  );
}
