import NextLink from 'next/link';
import type { ComponentProps } from 'react';

/** Props for routed or native links. */
export type LinkProps =
  | (ComponentProps<typeof NextLink> & {
      /** Use Next.js navigation (default). */
      native?: false;
    })
  | (ComponentProps<'a'> & {
      /** Use native browser navigation. */
      native: true;
      /** Destination URL or fragment. */
      href: string;
    });

/**
 * 1. Use Link for every application link, including styled wrappers such as
 *    QuoteLink and WizardActionLink. Only this file imports next/link or
 *    renders native anchors.
 * 2. Routed links default to scroll={true} on mobile and desktop. This enables
 *    Next's normal scrolling; it does not always force the page to the top.
 * 3. Use scroll={false} for in-place updates such as gallery count selection.
 *    It does not control browser Back/Forward restoration.
 * 4. Use native for hashes, external sites, email, telephone and downloads.
 *    Native mode accepts anchor attributes rather than Next-specific props.
 *    Callers supply styling and accessible labels in either mode.
 */
export function Link(props: LinkProps) {
  if (props.native) {
    const { native, ...anchorProps } = props;
    return <a {...anchorProps} />;
  }

  const { native, scroll = true, ...linkProps } = props;
  return <NextLink {...linkProps} scroll={scroll} />;
}
