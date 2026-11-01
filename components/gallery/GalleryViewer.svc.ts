import type { RefObject } from 'react';

/** Wraps an index that stepped one past either end of `count` items. */
export function wrapIndex(index: number, count: number) {
  return (index + count) % count;
}

/**
 * Scrolls the track to the slide at this index. The slide's own position
 * decides where, so no widths are computed here.
 */
export function scrollToSlide(track: HTMLElement | null, index: number) {
  track?.children[index]?.scrollIntoView({
    block: 'nearest',
    inline: 'center'
  });
}

/**
 * Work out which slide is most in view from the track's scroll position.
 *
 * Each slide is one track wide, so the scroll position divided by the track's
 * width is the position in slides, and rounding it gives the nearest whole
 * slide. Partway through a swipe, that is the slide covering more of the track.
 *
 * @param track - The track that scrolls sideways through the slides.
 * @returns The index of the slide most in view.
 */
export function slideInView(track: HTMLElement) {
  return Math.round(track.scrollLeft / track.clientWidth);
}

/** The current image, as {@link observeTrack} reads it from the track. */
export type TrackObserver = {
  /** Reads the index of the current image. */
  index: () => number;
  /** Makes a check that answers whether one image is the current one. */
  isAt: (at: number) => () => boolean;
  /** Takes the track's scroll event and tells subscribers about a new image. */
  notify: () => void;
  /** Adds a listener for a new image, and returns a way to remove it again. */
  subscribe: (listener: () => void) => () => void;
};

/**
 * Read the current image from the track, as a store for
 * `useSyncExternalStore`.
 *
 * The problem `useSyncExternalStore` solves here: with the current image in
 * `useState`, every new image re-runs the component holding that state. That
 * component also holds the viewer's functions and all its markup, so every
 * function is re-created and every slide, thumbnail and image renders, although
 * only the counter and the marks on two slides and two thumbnails change.
 * `useCallback` does not help, because it still creates the function on each
 * render.
 *
 * How it solves it:
 *
 * 1. The browser already keeps the answer: the image in view follows from the
 *    track's scroll position, and the scroll event announces every change. A
 *    value React does not own is what `useSyncExternalStore` is for, and there
 *    is no copy in React state to keep in step with the track.
 * 2. The viewer holds no state, so it renders once per opening and creates its
 *    functions once.
 * 3. Only the small components that show the current image subscribe, and React
 *    renders one of them only when its own answer changes.
 *
 * How it operates:
 *
 * 1. The track passes its scroll event to `notify`, which reads the image in
 *    view and tells the subscribers if it changed.
 * 2. React then asks each subscribed component for its answer, from `index` or
 *    a check made by `isAt`, and renders those whose answer changed, in one go.
 *
 * @param trackRef - Ref to the track, which is empty until the viewer mounts.
 * @param initialIndex - Index of the image the viewer opens on, which is the
 *   answer until the track exists.
 * @returns The store: `index` and `isAt` to read it, `notify` for the track's
 *   scroll event and `subscribe` for `useSyncExternalStore`.
 */
export function observeTrack(
  trackRef: RefObject<HTMLElement | null>,
  initialIndex: number
): TrackObserver {
  const listeners = new Set<() => void>();
  let lastIndex = initialIndex;

  /**
   * Read the current image from the track.
   *
   * @returns The index of the image in view, or the initial index until the
   *   track exists.
   */
  const index = () => {
    const track = trackRef.current;
    return track ? slideInView(track) : initialIndex;
  };

  return {
    index,
    /**
     * Make a check for one image, for `useSyncExternalStore`. Its answer only
     * changes when that image becomes or stops being the current one, so React
     * renders the component using it only then.
     *
     * @param at - Index of the image to check for.
     * @returns A function that answers whether that image is the current one.
     */
    isAt(at: number) {
      return () => index() === at;
    },
    /**
     * Tell the subscribers that the image in view changed. For the track's
     * scroll event, which fires many times per image: it remembers the image
     * it last told them about, and stays quiet until another one is in view.
     */
    notify() {
      const next = index();
      if (next === lastIndex) return;
      lastIndex = next;
      listeners.forEach(listener => listener());
    },
    /**
     * Add a listener for a new image in view.
     *
     * @param listener - Called whenever another image comes into view.
     * @returns A function that removes the listener again.
     */
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    }
  };
}
