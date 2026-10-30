import { useId, type RefObject } from 'react';
import Image from 'next/image';

import type { GalleryContent, GallerySelection } from './Gallery.svc';
import { GalleryThumbnails } from './GalleryThumbnails';
import styles from './GalleryViewer.module.css';

/** Inputs for the modal viewer, which shows one photograph at a time. */
type GalleryViewerProps = GalleryContent &
  GallerySelection & {
    /** The viewer's dialog element; the gallery opens it with showModal(). */
    dialogRef: RefObject<HTMLDialogElement | null>;
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
  dialogRef,
  images,
  labels,
  activeIndex,
  onSelect,
  onClose
}: GalleryViewerProps) {
  const titleId = useId();
  const activeImage = activeIndex === null ? undefined : images[activeIndex];

  const moveImage = (direction: number) => {
    if (activeIndex === null) return;
    onSelect((activeIndex + direction + images.length) % images.length);
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
        {activeImage && activeIndex !== null && (
          <p className={styles.counter} aria-live='polite' aria-atomic='true'>
            {labels.image} {activeIndex + 1} / {images.length}
          </p>
        )}
        <button
          type='button'
          className={styles.control}
          aria-label={labels.close}
          title={labels.close}
          onClick={() => dialogRef.current?.close()}
        >
          <ViewerIcon path='m6 6 12 12M6 18 18 6' />
        </button>
      </div>
      {activeImage && activeIndex !== null && (
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
              onSelect={onSelect}
            />
          )}
        </>
      )}
    </dialog>
  );
}
