import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentProps
} from 'react';
import Image from 'next/image';

import type {
  GalleryContent,
  GalleryCurrentMark,
  GallerySelection
} from './Gallery.svc';
import { GalleryThumbnails } from './GalleryThumbnails';
import { observeTrack, scrollToSlide, wrapIndex } from './GalleryViewer.svc';
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

/**
 * Show the current image's number, the only part of the header that changes
 * per image.
 *
 * `useSyncExternalStore` subscribes this component to the track on its own, so
 * a new image renders the number without rendering the viewer around it; see
 * `observeTrack`.
 */
function ViewerCounter({
  images,
  labels,
  track
}: GalleryContent & Pick<GallerySelection, 'track'>) {
  const activeIndex = useSyncExternalStore(track.subscribe, track.index);

  return (
    <p className={styles.counter} aria-live='polite' aria-atomic='true'>
      {labels.image} {activeIndex + 1} / {images.length}
    </p>
  );
}

/**
 * Show one slide of the track, hidden from screen readers unless its image is
 * the current one.
 *
 * `useSyncExternalStore` with this slide's own check means React renders it
 * only when it becomes or stops being current, so a new image renders two
 * slides. Its `<Image>` arrives as `children` from the viewer, which does not
 * render again, so the image itself does not render; see `observeTrack`. All
 * other props go to the `<div>`.
 */
function ViewerSlide({
  track,
  isCurrent,
  ...slideProps
}: GalleryCurrentMark & ComponentProps<'div'>) {
  const current = useSyncExternalStore(track.subscribe, isCurrent);

  return <div {...slideProps} aria-hidden={!current} />;
}

/**
 * Show one image at a time in a modal dialog, in a track that scrolls sideways.
 *
 * 1. The gallery renders the viewer only while it is open, so every opening
 *    starts on `initialIndex`.
 * 2. The current image is read from the track, not held in state; see
 *    `observeTrack`. A new image therefore renders only the small components
 *    that show it. This component renders once per opening, so its functions
 *    are created once.
 * 3. The arrows, the keys and the thumbnails only scroll the track, and so does
 *    a swipe. Whatever moved it, the image in view is the current one.
 */
export function GalleryViewer({
  images,
  labels,
  initialIndex,
  onClose
}: GalleryViewerProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // One store per opening; `useState` keeps the same one across renders.
  const [track] = useState(() => observeTrack(trackRef, initialIndex));

  // The gallery renders the viewer only while it is open, so appearing is
  // what opens it: show the dialog and bring in the image it opened on.
  // 1. A layout effect, so the dialog is open before GalleryThumbnails'
  //    Effect scrolls the strip; a child's Effect runs before its parent's.
  // 2. React runs this twice in development; showModal() only runs once.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    scrollToSlide(trackRef.current, initialIndex);
  }, [initialIndex]);

  /**
   * Show the image at this index by scrolling the track to it. The current
   * image then follows from the track's position.
   *
   * @param index - Index of the image to show.
   */
  const selectImage = (index: number) => {
    scrollToSlide(trackRef.current, index);
  };

  /**
   * Show the neighbouring image, wrapping around at either end.
   *
   * @param direction - `-1` for the previous image, `1` for the next one.
   */
  const moveImage = (direction: number) => {
    selectImage(wrapIndex(track.index() + direction, images.length));
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
        <ViewerCounter images={images} labels={labels} track={track} />
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
        <div ref={trackRef} className={styles.track} onScroll={track.notify}>
          {images.map((image, index) => (
            <ViewerSlide
              key={image.src}
              track={track}
              isCurrent={track.isAt(index)}
              className={styles.slide}
            >
              <Image
                className={styles.image}
                src={image.src}
                alt={image.alt}
                fill
                sizes='(max-width: 1152px) 100vw, 1152px'
                loading={index === initialIndex ? 'eager' : 'lazy'}
              />
            </ViewerSlide>
          ))}
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
          track={track}
          onSelect={selectImage}
        />
      )}
    </dialog>
  );
}
