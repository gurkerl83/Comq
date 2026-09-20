import Link from 'next/link';

import { Gallery } from '../../components/gallery';
import {
  createHrefForLocale,
  type SupportedLocale
} from '../../lib/i18n/locales';
import { ServiceImagePlaceholder } from '../home/ServiceImagePlaceholder';
import { getGalleryDemoImages } from './demo-images';
import styles from './GalleryDemoPage.module.css';

const CONTENT = {
  es: {
    title: 'Ejemplos de la galería',
    introduction:
      'Elige una cantidad para ver cada distribución. Abre una imagen o el recuadro +N para probar el visor.',
    notice:
      'Estas ilustraciones son ficticias y sirven para probar la galería. No son fotografías de equipos disponibles.',
    counts: 'Cantidad de imágenes',
    image: 'imagen',
    images: 'imágenes',
    noImage: 'Sin imágenes',
    layouts: [
      'El ejemplo muestra un marcador cuando no hay imágenes.',
      'Una imagen ocupa todo el ancho.',
      'Dos imágenes, una junto a la otra.',
      'Una imagen grande sobre dos imágenes pequeñas.',
      'Cuatro imágenes en una cuadrícula de 2 × 2.',
      'Tres imágenes visibles y un recuadro +2 para las restantes.',
      'Tres imágenes visibles y un recuadro +3 para las restantes.'
    ],
    gallery: {
      label: 'Ilustraciones de demostración',
      openImage: 'Abrir ilustración',
      moreImages: 'Más ilustraciones',
      close: 'Cerrar',
      previous: 'Ilustración anterior',
      next: 'Ilustración siguiente',
      image: 'Ilustración'
    }
  },
  en: {
    title: 'Gallery examples',
    introduction:
      'Choose an image count to see each layout. Open an image or the +N tile to try the viewer.',
    notice:
      'These fictional illustrations are sample images for the gallery. They are not photographs of available equipment.',
    counts: 'Number of images',
    image: 'image',
    images: 'images',
    noImage: 'No images',
    layouts: [
      'The example displays a placeholder when no images are provided.',
      'One image fills the available width.',
      'Two images sit side by side.',
      'One large image sits above two smaller images.',
      'Four images form a 2 × 2 grid.',
      'Three images remain visible, with a +2 tile for the others.',
      'Three images remain visible, with a +3 tile for the others.'
    ],
    gallery: {
      label: 'Demonstration illustrations',
      openImage: 'Open illustration',
      moreImages: 'More illustrations',
      close: 'Close',
      previous: 'Previous illustration',
      next: 'Next illustration',
      image: 'Illustration'
    }
  }
};

export const getGalleryDemoContent = (locale: SupportedLocale) =>
  CONTENT[locale];

/** Inputs resolved by the localized gallery example route. */
type GalleryDemoPageProps = {
  /** Language for the page, sample descriptions and gallery controls. */
  locale: SupportedLocale;
  /** Validated sample size from zero through six. */
  count: number;
};

export function GalleryDemoPage({ locale, count }: GalleryDemoPageProps) {
  const content = getGalleryDemoContent(locale);
  const images = getGalleryDemoImages(locale).slice(0, count);
  const pathname = createHrefForLocale(locale, '/gallery-demo');

  return (
    <article className={styles.page} aria-labelledby='gallery-demo-title'>
      <h1 id='gallery-demo-title'>{content.title}</h1>
      <p className={styles.introduction}>{content.introduction}</p>
      <p className={styles.notice}>{content.notice}</p>

      <nav className={styles.counts} aria-label={content.counts}>
        {Array.from({ length: 7 }, (_, imageCount) => (
          <Link
            key={imageCount}
            href={{ pathname, query: { count: imageCount } }}
            aria-current={count === imageCount ? 'page' : undefined}
            scroll={false}
          >
            {imageCount} {imageCount === 1 ? content.image : content.images}
          </Link>
        ))}
      </nav>

      <section aria-labelledby='gallery-example-title'>
        <h2 id='gallery-example-title'>
          {count} {count === 1 ? content.image : content.images}
        </h2>
        <p className={styles.description}>{content.layouts[count]}</p>
        <figure className={styles.media}>
          {images.length > 0 ? (
            <Gallery key={count} images={images} labels={content.gallery} />
          ) : (
            <>
              <ServiceImagePlaceholder
                className={styles.placeholder}
                alt={content.noImage}
              />
              <figcaption>{content.noImage}</figcaption>
            </>
          )}
        </figure>
      </section>
    </article>
  );
}
