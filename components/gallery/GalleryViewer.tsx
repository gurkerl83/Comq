import { useId, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';

import type { GalleryContent } from './Gallery.svc';
import { GalleryThumbnails } from './GalleryThumbnails';
import styles from './GalleryViewer.module.css';

/** Inputs for the modal viewer, which shows one photograph at a time. */
type GalleryViewerProps = GalleryContent & {
  /** Index of the image the viewer opens on. */
  initialIndex: number;
  /** Called when the dialog closes, by Esc or the close button. */
  onClose: () => void;
};

function ViewerIcon({ path }: { path: string }) {
  return (
    <svg
      aria-hidden='true'
      focusable='false'
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='1.8'
      viewBox='0 0 24 24'
    >
      <path d={path} />
    </svg>
  );
}

export function GalleryViewer({
  images,
  labels,
  initialIndex,
  onClose
}: GalleryViewerProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const activeImage = images[activeIndex];

  // The gallery renders the viewer only while it is open, so appearing is
  // what opens it.
  // 1. A layout effect, so the dialog is open before GalleryThumbnails'
  //    Effect scrolls the strip; a child's Effect runs before its parent's.
  // 2. React runs this twice in development; showModal() only runs once.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const moveImage = (direction: number) => {
    setActiveIndex((activeIndex + direction + images.length) % images.length);
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.viewer}
      aria-labelledby={titleId}
      onClose={onClose}
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
        <p className={styles.counter} aria-live='polite' aria-atomic='true'>
          {labels.image} {activeIndex + 1} / {images.length}
        </p>
        <button
          type='button'
          className={`${styles.control} ${styles.closeControl}`}
          aria-label={labels.close}
          title={labels.close}
          onClick={() => dialogRef.current?.close()}
        >
          <ViewerIcon path='m6 6 12 12M6 18 18 6' />
        </button>
      </div>
      {activeImage && (
        <>
          <div className={styles.viewerStage} data-single={images.length === 1}>
            {images.length > 1 && (
              <button
                type='button'
                className={`${styles.control} ${styles.previousControl}`}
                aria-label={labels.previous}
                title={labels.previous}
                onClick={() => moveImage(-1)}
              >
                <ViewerIcon path='m14 6-6 6 6 6' />
              </button>
            )}
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
            {images.length > 1 && (
              <button
                type='button'
                className={`${styles.control} ${styles.nextControl}`}
                aria-label={labels.next}
                title={labels.next}
                onClick={() => moveImage(1)}
              >
                <ViewerIcon path='m10 6 6 6-6 6' />
              </button>
            )}
          </div>
          {images.length > 1 && (
            <GalleryThumbnails
              images={images}
              labels={labels}
              activeIndex={activeIndex}
              onSelect={setActiveIndex}
            />
          )}
        </>
      )}
    </dialog>
  );
}
