/**
 * Resolves a URL fragment reference (`url(path#id)`) based on the current document location.
 *
 * This helper is typically used when constructing fragment-based URLs for SVG
 * references (e.g., masks, clipPaths, filters) where the browser requires a fully
 * qualified `url(...)` value that includes the current path.
 *
 * How it works:
 * - Safely reads `document.location` (guarded for SSR environments).
 * - Extracts the current page's path + query string.
 * - Removes any existing hash fragment from the URL.
 * - Appends `#${id}` to produce a stable fragment reference.
 *
 * Example:
 *   // If the current page is /viewer/page?mode=edit#section2
 *   resolveFragmentUrl("clip") → "url(/viewer/page?mode=edit#clip)"
 *
 * @param id - The fragment identifier to append (e.g., an SVG element's ID).
 * @returns A `url(...)` string pointing to the fragment within the current document.
 */
export function resolveFragmentUrl(id: string): string {
  const location = document?.location ?? null;
  const path = location ? (location.pathname + location.search).split("#")[0] : "";
  return `url(${path}#${id})`;
}
