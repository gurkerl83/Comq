/** A photograph with localized alternative text and its original dimensions. */
export type GalleryImage = {
  /** Local public path or an allowed remote image URL. */
  src: string;
  /** Description of the photograph in the current language. */
  alt: string;
  /** Original image width in pixels. */
  width: number;
  /** Original image height in pixels. */
  height: number;
};

/** Localized names for the gallery and its viewer controls. */
export type GalleryLabels = {
  /** Accessible name for the image collection and viewer. */
  label: string;
  /** Action announced before a thumbnail's image description. */
  openImage: string;
  /** Action announced for the tile representing hidden photographs. */
  moreImages: string;
  /** Text on the button that closes the viewer. */
  close: string;
  /** Text on the button that shows the previous photograph. */
  previous: string;
  /** Text on the button that shows the next photograph. */
  next: string;
  /** Noun preceding the current image number and total. */
  image: string;
};

/** The photographs and interface text that every part of the gallery shows. */
export type GalleryContent = {
  /** Ordered photographs; the gallery never changes this collection. */
  images: GalleryImage[];
  /** Interface text already resolved to the page's language. */
  labels: GalleryLabels;
};

/** The photograph the viewer shows, and a way to show another. */
export type GallerySelection = {
  /** Index of the photograph the viewer shows, or null while it is closed. */
  activeIndex: number | null;
  /** Shows the photograph at this index in the viewer. */
  onSelect: (index: number) => void;
};

/** Reserve the fourth cell for a count when the collection exceeds four images. */
export function getGalleryLayout(imageCount: number) {
  return {
    cellCount: Math.min(imageCount, 4),
    visibleCount: imageCount > 4 ? 3 : imageCount,
    extraCount: imageCount > 4 ? imageCount - 3 : 0
  };
}
