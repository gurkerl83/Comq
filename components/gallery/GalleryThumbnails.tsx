import {
  useEffect,
  useRef,
  useSyncExternalStore,
  type ComponentProps
} from 'react';
import Image from 'next/image';

import type {
  GalleryContent,
  GalleryCurrentMark,
  GallerySelection
} from './Gallery.svc';
import styles from './GalleryThumbnails.module.css';

/** Inputs for the strip of thumbnails in the viewer. */
type GalleryThumbnailsProps = GalleryContent & GallerySelection;

/**
 * Show one thumbnail, marked when its image is the current one.
 *
 * `useSyncExternalStore` with this thumbnail's own check means React renders it
 * only when it becomes or stops being current, so a new image renders two
 * thumbnails. Its `<Image>` arrives as `children` from the strip, which does
 * not render again, so the image itself does not render; see `observeTrack`.
 * All other props go to the `<button>`.
 */
function Thumbnail({
  track,
  isCurrent,
  ...buttonProps
}: GalleryCurrentMark & ComponentProps<'button'>) {
  const current = useSyncExternalStore(track.subscribe, isCurrent);

  return <button {...buttonProps} aria-current={current} />;
}

/**
 * Show the strip of thumbnails, which follows the current image.
 *
 * The strip renders once per opening, like the viewer: a new image renders only
 * the two thumbnails that change, and the strip glides through its own
 * subscription; see `observeTrack`.
 */
export function GalleryThumbnails({
  images,
  labels,
  track,
  onSelect
}: GalleryThumbnailsProps) {
  const stripRef = useRef<HTMLDivElement>(null);

  // Glide the current thumbnail into view when the viewer opens and whenever
  // the current image changes, centred as far as the strip can scroll.
  // 1. One subscription covers every way the image changes: the arrows, the
  //    arrow keys, a tap on a thumbnail and a swipe.
  // 2. It subscribes directly: `useSyncExternalStore` would render the strip
  //    for every image, and nothing the strip renders changes.
  // 3. The strip glides anyway, so it does not matter if the browser paints
  //    first; a layout effect would add nothing.
  useEffect(() => {
    /** Glide the current image's thumbnail into view. */
    const glide = () => {
      stripRef.current?.children[track.index()]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    };

    glide();
    return track.subscribe(glide);
  }, [track]);

  return (
    <div
      ref={stripRef}
      className={styles.thumbnails}
      role='group'
      aria-label={labels.label}
    >
      {images.map((image, index) => (
        <Thumbnail
          key={image.src}
          track={track}
          isCurrent={track.isAt(index)}
          type='button'
          className={styles.thumbnail}
          aria-label={`${labels.image} ${index + 1}: ${image.alt}`}
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
        </Thumbnail>
      ))}
    </div>
  );
}
