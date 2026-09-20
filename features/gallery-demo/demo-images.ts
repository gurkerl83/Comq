import type { GalleryImage } from '../../components/gallery';
import type { SupportedLocale } from '../../lib/i18n/locales';

/** A sample image with alternative text for every supported language. */
type GalleryDemoImage = Omit<GalleryImage, 'alt'> & {
  /** Description of the illustration in each supported language. */
  alt: Record<SupportedLocale, string>;
};

/** Standalone fixtures; product catalogue changes do not alter these examples. */
const GALLERY_DEMO_IMAGES: GalleryDemoImage[] = [
  {
    src: '/images/gallery-demo/machine-side.svg',
    width: 1200,
    height: 800,
    alt: {
      es: 'Ilustración de demostración 01: vista lateral de un equipo minero ficticio.',
      en: 'Demo illustration 01: side view of a fictional mining machine.'
    }
  },
  {
    src: '/images/gallery-demo/machine-front.svg',
    width: 900,
    height: 1200,
    alt: {
      es: 'Ilustración de demostración 02: vista frontal de un equipo minero ficticio.',
      en: 'Demo illustration 02: front view of a fictional mining machine.'
    }
  },
  {
    src: '/images/gallery-demo/hydraulic-boom.svg',
    width: 1200,
    height: 800,
    alt: {
      es: 'Ilustración de demostración 03: detalle de un brazo hidráulico ficticio.',
      en: 'Demo illustration 03: detail of a fictional hydraulic boom.'
    }
  },
  {
    src: '/images/gallery-demo/operator-cab.svg',
    width: 900,
    height: 900,
    alt: {
      es: 'Ilustración de demostración 04: cabina y controles de un equipo ficticio.',
      en: 'Demo illustration 04: operator cab and controls of a fictional machine.'
    }
  },
  {
    src: '/images/gallery-demo/wheel-detail.svg',
    width: 900,
    height: 1200,
    alt: {
      es: 'Ilustración de demostración 05: detalle de una rueda de un equipo ficticio.',
      en: 'Demo illustration 05: wheel detail of a fictional machine.'
    }
  },
  {
    src: '/images/gallery-demo/machine-rear.svg',
    width: 1200,
    height: 800,
    alt: {
      es: 'Ilustración de demostración 06: vista posterior de un equipo minero ficticio.',
      en: 'Demo illustration 06: rear view of a fictional mining machine.'
    }
  }
];

/** Resolve the gallery's own fixtures for the requested language. */
export const getGalleryDemoImages = (locale: SupportedLocale): GalleryImage[] =>
  GALLERY_DEMO_IMAGES.map(image => ({ ...image, alt: image.alt[locale] }));
