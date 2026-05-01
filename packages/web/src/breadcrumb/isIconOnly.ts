/** @internal */
export function isIconOnly(slot: HTMLSlotElement): boolean {
  const elements = slot.assignedElements({ flatten: true });
  if (elements.length === 1) {
    const rect = elements[0].getBoundingClientRect();
    return rect.width <= 28 && rect.height <= 28;
  }
  return false;
}
