import { LitElement } from "lit";

/**
 * Determines whether an update is pending for an element and waits for it to complete.
 * @param {LitElement} el The element for which to wait for update.
 */
export async function waitForUpdate(el: LitElement): Promise<void> {
  if (el.isUpdatePending) {
    await el.updateComplete;
  }
}
