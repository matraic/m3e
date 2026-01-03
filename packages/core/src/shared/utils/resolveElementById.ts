/**
 * Resolves an element by ID, waiting for document readiness if needed.
 * @param {string} id - The element ID to resolve.
 * @param {ParentNode} root - Optional root node to query from (defaults to document).
 * @returns {Promise<T | null>} A promise that resolves with the element or `null` if not found.
 */
export function resolveElementById<T extends Element>(id: string, root: ParentNode = document): Promise<T | null> {
  return new Promise((resolve) => {
    const element = root.querySelector<T>(`#${id}`);
    if (element) {
      resolve(element);
      return;
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
      resolve(root.querySelector<T>(`#${id}`));
      return;
    }

    document.addEventListener("DOMContentLoaded", () => resolve(root.querySelector<T>(`#${id}`)), { once: true });
  });
}
