import { CheckedMixin, isCheckedMixin } from "./Checked";
import { isSelectedMixin, SelectedMixin } from "./Selected";

/** Defines functionality for an element which supports either a checked or selected state. */
export type CheckedOrSelectedMixin = CheckedMixin | SelectedMixin;

/**
 * Determines whether a value is a `CheckedOrSelectedMixin`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `CheckedOrSelectedMixin`.
 */
export function isCheckedOrSelectedMixin(value: unknown): value is CheckedOrSelectedMixin {
  return isCheckedMixin(value) || isSelectedMixin(value);
}

/**
 * Determines whether the state of an element is checked or selected.
 * @param {CheckedOrSelectedMixin} element The element to test.
 * @return {boolean} Whether `element` is checked or selected.
 */
export function isCheckedOrSelected(element: CheckedOrSelectedMixin): boolean {
  return (isCheckedMixin(element) && element.checked) || (isSelectedMixin(element) && element.selected);
}

/**
 * Sets the checked or selected state of an element.
 * @param {CheckedOrSelectedMixin} element The element for which to set the checked or selected state.
 * @param {boolean} checkedOrSelected The checked or selected state.
 */
export function checkOrSelect(element: CheckedOrSelectedMixin, checkedOrSelected: boolean): void {
  if (isCheckedMixin(element)) {
    element.checked = checkedOrSelected;
  } else {
    element.selected = checkedOrSelected;
  }
}
