import { LitElement } from "lit";

import { Constructor } from "./Constructor";
import { hasKeys } from "./hasKeys";

/** A symbol through which to access the `ElementInternals` attached to an element. */
export const internals = Symbol("internals");

/** Defines functionality for an element attached to `ElementInternals`. */
export interface AttachInternalsMixin {
  /** The `ElementInternals` attached to the element. */
  readonly [internals]: ElementInternals;
}

/**
 * Determines whether a value is an `AttachInternalsMixin`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is an `AttachInternalsMixin`.
 */
export function isAttachInternalsMixin(value: unknown): value is AttachInternalsMixin {
  return hasKeys<AttachInternalsMixin>(value, internals);
}

const _internals = Symbol("_internals");

/**
 * Mixin to augment an element with behavior that attaches to `ElementInternals`.
 * @template T The type of the base class.
 * @param {T} base The base class.
 * @param {boolean | undefined} formAssociated Whether the element is "Form Associated".
 * @returns {Constructor<AttachInternalsMixin> & T} A constructor that implements `AttachInternalsMixin`.
 */
export function AttachInternals<T extends Constructor<LitElement>>(
  base: T,
  formAssociated?: boolean,
): Constructor<AttachInternalsMixin> & T {
  abstract class _AttachInternals extends base implements AttachInternalsMixin {
    /** Indicates that this custom element participates in form submission, validation, and form state restoration. */
    static readonly formAssociated = formAssociated;

    /** @private */
    private [_internals]?: ElementInternals;

    /** @internal */
    get [internals](): ElementInternals {
      return this[_internals] ?? (this[_internals] = this.attachInternals());
    }
  }

  return _AttachInternals;
}

/**
 * Convenience function used to test whether an element has a given custom state.
 * @param {AttachInternalsMixin} element The element to test.
 * @param {string} state The custom state to test.
 * @returns {boolean} Whether `element` has `state`.
 */
export function hasCustomState(element: AttachInternalsMixin, state: string): boolean {
  return element[internals].states.has(state);
}

/**
 * Convenience function used to add custom state to an element.
 * @param {AttachInternalsMixin} element The element to which to add custom state.
 * @param {string} state The custom state to add.
 */
export function addCustomState(element: AttachInternalsMixin, state: string): void {
  element[internals]?.states.add(state);
  element[internals]?.states.has(state); // flush
}

/**
 * Convenience function used to delete custom state from an element.
 * @param {AttachInternalsMixin} element The element from which to delete custom state.
 * @param {string} state The custom state to delete.
 * @returns {boolean} Whether `state` was removed from `element`.
 */
export function deleteCustomState(element: AttachInternalsMixin, state: string): boolean {
  if (element[internals]?.states.delete(state)) {
    element[internals]?.states.has(state); // flush
    return true;
  }
  return false;
}

/**
 * Convenience function used to add or delete custom state for an element.
 * @param {AttachInternalsMixin} element The element for which to add or delete custom state.
 * @param {string} state The custom state to add or delete.
 * @param {boolean} value Whether to add or delete `state` from `element`.
 */
export function setCustomState(element: AttachInternalsMixin, state: string, value: boolean): void {
  if (value) {
    addCustomState(element, state);
  } else {
    deleteCustomState(element, state);
  }
}
