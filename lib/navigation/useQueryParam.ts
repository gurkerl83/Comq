import { useSearchParams } from 'next/navigation';

/** One query parameter of the page address, read and written as text. */
export type QueryParam = {
  /**
   * The parameter's value, or null when the address has none.
   * It follows the browser's Back and Forward.
   * After push or replace, it changes one render later.
   */
  value: string | null;
  /**
   * Add a browser history entry whose address sets the parameter.
   * null leaves the parameter out of that address.
   */
  push: (newValue: string | null) => void;
  /**
   * Set the parameter in the current entry's address.
   * null takes the parameter out of it.
   */
  replace: (newValue: string | null) => void;
};

/**
 * The address that push and replace hand to the browser's history API.
 * It is the current address with one parameter changed.
 *
 * 1. It starts from the current query, so the other parameters stay.
 * 2. A value sets the parameter.
 *    null removes it.
 * 3. With parameters left, the address is the query alone.
 *    The browser resolves it against the current path.
 * 4. With no parameters left, the address is the path alone.
 *    This keeps a trailing ? out of the address bar.
 *
 * Example: createAddress('page', '2') on /products?view=grid.
 * 1. params starts as view=grid.
 * 2. The value '2' sets page, so params is view=grid&page=2.
 * 3. query is 'view=grid&page=2', so the address is ?view=grid&page=2.
 * 4. The browser shows /products?view=grid&page=2.
 *
 * Example: createAddress('page', null) on /products?page=2.
 * 1. params starts as page=2.
 * 2. null removes page, so params is empty.
 * 3. query is '', so the address is the path alone: /products.
 * 4. The browser shows /products.
 *
 * @param name - The query parameter.
 * @param value - Its new value, or null to remove it.
 * @returns The address for history.pushState and history.replaceState.
 */
function createAddress(name: string, value: string | null): string {
  const params = new URLSearchParams(window.location.search);
  if (value === null) {
    params.delete(name);
  } else {
    params.set(name, value);
  }

  const query = params.toString();
  if (query === '') return window.location.pathname;
  return `?${query}`;
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
 *    null leaves the parameter out of the address.
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
      window.history.pushState(null, '', createAddress(name, newValue)),
    replace: newValue =>
      window.history.replaceState(
        window.history.state,
        '',
        createAddress(name, newValue)
      )
  };
}
