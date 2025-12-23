/**
 * Asynchronously attempts to focus an element once it becomes focusable.
 * @param {HTMLElement} element The element to to focus.
 * @param {number} [timeout=200] The maximum amount of time to attempt to focus `el`.
 * @returns {Promise<boolean>} A `Promise` that resolves to whether `el` was focused.
 */
export async function focusWhenReady(element: HTMLElement, timeout: number = 200): Promise<boolean> {
  element.focus();

  const start = performance.now();
  while (element.shadowRoot?.activeElement !== element) {
    if (!element.isConnected || performance.now() - start > timeout) {
      return false;
    }

    await new Promise(requestAnimationFrame);
    element.focus();
  }

  return true;
}
