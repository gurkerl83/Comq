'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';

import { getGalleryLayout, type GalleryContent } from './Gallery.svc';
import { GalleryViewer } from './GalleryViewer';
import styles from './Gallery.module.css';

/** Inputs for the image mosaic and its keyboard-accessible viewer. */
export type GalleryProps = GalleryContent;

export function Gallery({ images, labels }: GalleryProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { cellCount, visibleCount, extraCount } = getGalleryLayout(
    images.length
  );

  if (images.length === 0) return null;

  const openImage = (index: number) => {
    setActiveIndex(index);
    dialogRef.current?.showModal();
  };

  return (
    <div className={styles.gallery}>
      <div
        className={styles.tiles}
        data-cells={cellCount}
        role='group'
        aria-label={labels.label}
      >
        {images.slice(0, visibleCount).map((image, index) => (
          <button
            key={image.src}
            type='button'
            className={`${styles.tile} ${styles.band}`}
            aria-label={`${labels.openImage}: ${image.alt}`}
            aria-haspopup='dialog'
            onClick={() => openImage(index)}
          >
            <Image
              className={styles.image}
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes={
                // Row-filling tiles in Gallery.module.css are twice as wide.
                cellCount === 1 || (cellCount === 3 && index === 0)
                  ? '(max-width: 640px) 100vw, 50vw'
                  : '(max-width: 640px) 50vw, 25vw'
              }
            />
          </button>
        ))}
        {extraCount > 0 && (
          <button
            type='button'
            className={`${styles.tile} ${styles.band}`}
            aria-label={`${labels.moreImages}: ${extraCount}`}
            aria-haspopup='dialog'
            onClick={() => openImage(visibleCount)}
          >
            <span className={styles.moreCount}>{`+${extraCount}`}</span>
          </button>
        )}
      </div>

      <GalleryViewer
        dialogRef={dialogRef}
        images={images}
        labels={labels}
        activeIndex={activeIndex}
        onSelect={setActiveIndex}
        onClose={() => setActiveIndex(null)}
      />
    </div>
  );
}
