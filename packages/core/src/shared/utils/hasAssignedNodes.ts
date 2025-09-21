/**
 * Determines whether a slot has any assigned nodes.
 * @param {HTMLSlotElement} slot The slot to test.
 * @returns {boolean} Whether `slot` has any assigned nodes.
 */
export function hasAssignedNodes(slot: HTMLSlotElement): boolean {
  return slot.assignedNodes({ flatten: true }).length > 0;
}
