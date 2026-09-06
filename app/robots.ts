import type { MetadataRoute } from 'next';

import { createSiteUrl } from '../lib/site/config';

/**
 * Keep crawler focus on public website pages.
 *
 * @returns Robots policy and sitemap location for the website.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/'
    },
    sitemap: createSiteUrl('/sitemap.xml')
  };
}
