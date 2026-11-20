import { useSearchParams } from 'next/navigation';

/** One query parameter of the page address, read and written as text. */
export type QueryParam = {
  /**
   * The parameter's value, or null when the address has none.
   * It follows the browser's Back and Forward.
   * After push or replace, it changes one render later.
   */
  value: string | null;
  /** Add a browser history entry whose address sets the parameter. */
  push: (newValue: string) => void;
  /** Set the parameter in the current entry's address. */
  replace: (newValue: string) => void;
};

/**
 * The current address's query string with one parameter set.
 * Other parameters stay.
 *
 * @param name - The query parameter.
 * @param value - Its new value.
 * @returns The query string for history.pushState and history.replaceState.
 */
function createQueryString(name: string, value: string): string {
  const params = new URLSearchParams(window.location.search);
  params.set(name, value);
  return `?${params.toString()}`;
}

/**
 * One query parameter of the page address, such as ?tab=details.
 * It is kept in the browser history.
 *
 * 1. value comes from Next's useSearchParams.
 *    The server render knows it too.
 *    It follows pushState, replaceState and the browser's Back and Forward.
 * 2. push adds a browser history entry.
 *    replace changes the current entry.
 *    Both use the browser's history API.
 *    Next keeps that API in sync with its router, and the page stays loaded.
 * 3. value changes one render after push or replace.
 *    a. Next replaces window.history.pushState and replaceState.
 *       Its versions hand the new address to React inside startTransition.
 *    b. A state update made together with push renders first.
 *       An example is a state update in the same click handler.
 * 4. replace passes the entry's current history state on.
 *    a. Next keeps its own data in each entry's state.
 *       Next ignores Back and Forward to an entry without it.
 *    b. Next's versions of pushState and replaceState keep that data.
 *       Next installs them only after the page's first effects have run.
 *    c. After a full page load, a replace can run before Next installs them.
 *       It then reaches the browser's own replaceState.
 *       Only the state passed on keeps Next's data in the entry.
 * 5. It treats the value as plain text.
 *    Any text can be a value.
 *
 * @param name - The query parameter, such as 'tab'.
 * @returns The parameter's value and the functions that write it.
 */
export function useQueryParam(name: string): QueryParam {
  const value = useSearchParams().get(name);

  return {
    value,
    push: newValue =>
      window.history.pushState(null, '', createQueryString(name, newValue)),
    replace: newValue =>
      window.history.replaceState(
        window.history.state,
        '',
        createQueryString(name, newValue)
      )
  };
}
