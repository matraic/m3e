/**
 * Determines whether an element is a custom element and waits for it to be upgraded.
 * @param {Element} el The element for which to wait for upgrade.
 */
export async function waitForUpgrade(el: Element): Promise<void> {
  const tag = el.tagName.toLowerCase();

  if (!tag.includes("-")) return;
  if (!customElements.get(tag)) {
    await customElements.whenDefined(tag);
  }

  const ctor = customElements.get(tag);
  if (!ctor || el instanceof ctor) {
    return;
  }

  await Promise.resolve();
  if (el instanceof ctor) {
    return;
  }

  await Promise.resolve();
}
