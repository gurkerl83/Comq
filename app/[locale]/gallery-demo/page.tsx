import {
  GalleryDemoPage,
  getGalleryDemoContent
} from '../../../features/gallery-demo/GalleryDemoPage';
import { getRouteLocale } from '../../../lib/i18n/route-locale';
import { createPageMetadata } from '../../../lib/site/metadata';

/** Locale and optional image count supplied by the gallery example URL. */
type GalleryDemoRouteProps = {
  /** Route segment used to resolve the page language. */
  params: Promise<{ locale: string }>;
  /** Requested sample size; repeated or invalid values use all six images. */
  searchParams: Promise<{ count?: string | string[] }>;
};

export async function generateMetadata({ params }: GalleryDemoRouteProps) {
  const locale = await getRouteLocale(params);
  const content = getGalleryDemoContent(locale);
  return {
    ...createPageMetadata(
      locale,
      '/gallery-demo',
      content.title,
      content.introduction
    ),
    robots: { index: false, follow: false }
  };
}

export default async function Page({
  params,
  searchParams
}: GalleryDemoRouteProps) {
  const locale = await getRouteLocale(params);
  const { count: requestedCount } = await searchParams;
  const count =
    typeof requestedCount === 'string' && /^[0-6]$/.test(requestedCount)
      ? Number(requestedCount)
      : 6;

  return <GalleryDemoPage locale={locale} count={count} />;
}
