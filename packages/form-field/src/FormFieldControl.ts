/**
 * Adapted from Angular Material Form Field Control
 * Source: https://github.com/angular/components/blob/main/src/material/form-field/form-field-control.ts
 *
 * @license MIT
 * Copyright (c) 2025 Google LLC
 * See LICENSE file in the project root for full license text.
 */

/** An interface which allows a control to work inside of a `M3eFormField`. */
export interface FormFieldControl extends HTMLElement {
  /** A value indicating whether the control is disabled. */
  disabled: boolean;

  /** The value of the control. */
  value?: unknown;

  /** A value indicating whether the control is required. */
  required?: boolean;

  /** A value indicated whether the content of the control is read-only. */
  readonly?: boolean;

  /** A value indicating whether the form field's label should try to float. */
  readonly shouldLabelFloat?: boolean;

  /** The error message that would be displayed if the user submits the form, or an empty string if no error message. */
  readonly validationMessage?: string;

  /** The `HTMLFormElement` associated with this element. */
  readonly form?: HTMLFormElement | null;

  /**
   * Handles the click event on the control's container.
   * @param {MouseEvent} event The `MouseEvent`.
   */
  onContainerClick?: (event: MouseEvent) => void;

  /**
   * Returns `true` if the element has no validity problems; otherwise,
   * returns `false`, fires an invalid event.
   */
  checkValidity?: () => boolean;
}

/**
 * Determines whether a value is a `FormFieldControl`.
 * @param {unknown} value The value to test.
 * @returns {value is FormFieldControl} A value indicating whether `value` is a `FormFieldControl`.
 */
export function isFormFieldControl(value: unknown): value is FormFieldControl {
  return (
    value instanceof HTMLInputElement ||
    value instanceof HTMLTextAreaElement ||
    value instanceof HTMLSelectElement ||
    (value instanceof HTMLElement && "disabled" in value)
  );
}

/**
 * Locates the first `FormFieldControl` in a given slot.
 * @param {HTMLSlotElement} slot The slot in which to locate a `FormFieldControl`.
 * @returns {FormFieldControl | null} The `FormFieldControl` located in `slot`.
 */
export function findFormFieldControl(slot: HTMLSlotElement): FormFieldControl | null {
  for (const element of slot.assignedElements({ flatten: true })) {
    if (isFormFieldControl(element)) {
      return element;
    }

    const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT);
    while (walker.nextNode()) {
      if (isFormFieldControl(walker.currentNode)) {
        return walker.currentNode;
      }
    }
  }

  return null;
}
