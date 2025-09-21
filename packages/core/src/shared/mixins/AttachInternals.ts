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
  formAssociated?: boolean
): Constructor<AttachInternalsMixin> & T {
  abstract class _AttachInternals extends base implements AttachInternalsMixin {
    static readonly formAssociated = formAssociated;

    private [_internals]?: ElementInternals;

    get [internals](): ElementInternals {
      return this[_internals] ?? (this[_internals] = this.attachInternals());
    }
  }

  return _AttachInternals;
}
