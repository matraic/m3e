/**
 * Adapted from Angular Material CDK AriaDescriber
 * Source: https://github.com/angular/components/blob/main/src/cdk/a11y/aria-describer/aria-reference.ts
 *
 * @license MIT
 * Copyright (c) 2025 Google LLC
 * See LICENSE file in the project root for full license text.
 */

/**
 * Gets a list of IDs referenced by an element for the specified ARIA attribute.
 * @param {Element} element The element from which to get referenced IDs.
 * @param {`aria-${string}`} attribute The ARIA attribute from which to get referenced IDs.
 * @returns {string[]} a list of IDs referenced by `element` for `attribute`.
 */
export function getAriaReferenceIds(element: Element, attribute: `aria-${string}`): string[] {
  return element.getAttribute(attribute)?.match(/\S+/g) ?? [];
}

/**
 * Adds an ID to the list of IDs referenced by an element for a given ARIA attribute.
 * @param {Element} element The element to which to add a referenced ID.
 * @param {`aria-${string}`} attribute The ARIA attribute to which to add an ID.
 * @param {string} id The ID to add.
 */
export function addAriaReferencedId(element: Element, attribute: `aria-${string}`, id: string): void {
  id = id.trim();

  const ids = getAriaReferenceIds(element, attribute);
  if (!ids.some((existingId) => existingId.trim() === id)) {
    ids.push(id);
    element.setAttribute(attribute, ids.join(" "));
  }
}

/**
 * Removes an ID from a list of IDs referenced by an element for the specified ARIA attribute.
 * @param {Element} element The element from which to remove an ID.
 * @param {`aria-${string}`} attribute The ARIA attribute from which to remove an ID.
 * @param {string} id The ID to remove.
 */
export function removeAriaReferencedId(element: Element, attribute: `aria-${string}`, id: string): void {
  id = id.trim();
  const ids = getAriaReferenceIds(element, attribute).filter((val) => val !== id);

  if (ids.length > 0) {
    element.setAttribute(attribute, ids.join(" "));
  } else {
    element.removeAttribute(attribute);
  }
}
