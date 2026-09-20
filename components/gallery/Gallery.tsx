'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';

import {
  getGalleryLayout,
  type GalleryImage,
  type GalleryLabels
} from './Gallery.svc';
import styles from './Gallery.module.css';

/** Inputs for the image mosaic and its keyboard-accessible viewer. */
export type GalleryProps = {
  /** Ordered photographs; the gallery never changes this collection. */
  images: readonly GalleryImage[];
  /** Interface text already resolved to the page's language. */
  labels: GalleryLabels;
};

export function Gallery({ images, labels }: GalleryProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeImage = activeIndex === null ? undefined : images[activeIndex];
  const { cellCount, visibleCount, extraCount } = getGalleryLayout(
    images.length
  );

  // Native modal behavior handles focus containment, Escape and focus restoration.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (activeImage) {
      if (dialog && !dialog.open) dialog.showModal();
    } else {
      dialog?.close();
    }
  }, [activeImage]);

  if (images.length === 0) return null;

  const moveImage = (direction: number) => {
    setActiveIndex(index =>
      index === null
        ? null
        : (index + direction + images.length) % images.length
    );
  };

  return (
    <>
      <div
        className={styles.galleryContainer}
        data-count={cellCount}
        role='group'
        aria-label={labels.label}
      >
        {images.slice(0, visibleCount).map((image, index) => (
          <button
            key={image.src}
            type='button'
            className={styles.tile}
            aria-label={`${labels.openImage}: ${image.alt}`}
            aria-haspopup='dialog'
            onClick={() => setActiveIndex(index)}
          >
            <Image
              className={styles.image}
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes={
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
            className={`${styles.tile} ${styles.placeholder}`}
            aria-label={`${labels.moreImages}: ${extraCount}`}
            aria-haspopup='dialog'
            onClick={() => setActiveIndex(visibleCount)}
          >
            +{extraCount}
          </button>
        )}
      </div>

      <dialog
        ref={dialogRef}
        className={styles.viewer}
        aria-labelledby={titleId}
        onClose={() => setActiveIndex(null)}
        onKeyDown={event => {
          if (event.altKey || event.ctrlKey || event.metaKey) return;
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            moveImage(event.key === 'ArrowLeft' ? -1 : 1);
          }
        }}
      >
        <div className={styles.viewerHeader}>
          <h2 id={titleId}>{labels.label}</h2>
          <button
            type='button'
            className={styles.control}
            onClick={() => dialogRef.current?.close()}
          >
            {labels.close}
          </button>
        </div>
        {activeImage && activeIndex !== null && (
          <>
            <div className={styles.viewerImage}>
              <Image
                key={activeImage.src}
                className={styles.image}
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                sizes='(max-width: 1152px) 100vw, 1152px'
                loading='eager'
              />
            </div>
            <div className={styles.viewerFooter}>
              {images.length > 1 && (
                <button
                  type='button'
                  className={styles.control}
                  onClick={() => moveImage(-1)}
                >
                  {labels.previous}
                </button>
              )}
              <p
                className={styles.counter}
                aria-live='polite'
                aria-atomic='true'
              >
                {labels.image} {activeIndex + 1} / {images.length}
              </p>
              {images.length > 1 && (
                <button
                  type='button'
                  className={styles.control}
                  onClick={() => moveImage(1)}
                >
                  {labels.next}
                </button>
              )}
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
