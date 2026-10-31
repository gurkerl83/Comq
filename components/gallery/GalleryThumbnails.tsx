import { useEffect, useRef } from 'react';
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
  const stripRef = useRef<HTMLDivElement>(null);

  // Glide the current thumbnail into view whenever the current image
  // changes, centred as far as the strip can scroll.
  // 1. One Effect covers every way the image changes: opening the viewer,
  //    the arrows, the arrow keys and a tap on a thumbnail.
  // 2. All of these are clicks or key presses, so React runs the Effect
  //    before the browser paints; a layout effect would add nothing.
  useEffect(() => {
    if (activeIndex === null) return;
    stripRef.current?.children[activeIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }, [activeIndex]);

  return (
    <div
      ref={stripRef}
      className={styles.thumbnails}
      role='group'
      aria-label={labels.label}
    >
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
