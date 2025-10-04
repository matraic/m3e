import { LitElement, PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import { Constructor } from "./Constructor";
import { hasKeys } from "./hasKeys";

/** Defines functionality for an element which supports a read-only state. */
export interface ReadOnlyMixin {
  /**
   * A value indicating whether the element is read-only.
   * @default false
   */
  readOnly: boolean;
}

/**
 * Determines whether a value is a `ReadOnlyMixin`.
 * @param {unknown} value The value to test.
 * @returns A value indicating whether `value` is a `ReadOnlyMixin`.
 */
export function isReadOnlyMixin(value: unknown): value is ReadOnlyMixin {
  return hasKeys<ReadOnlyMixin>(value, "readOnly");
}

/**
 * Mixin to augment an element with behavior that supports a read-only state.
 * @template T The type of the base class.
 * @param {T} base The base class.
 * @param {boolean} reflect A value indicating whether the read-only state is reflected as an attribute. The default value is `true`.
 * @returns {Constructor<ReadOnlyMixin> & T} A constructor that implements `ReadOnlyMixin`.
 */
export function ReadOnly<T extends Constructor<LitElement>>(
  base: T,
  reflect: boolean = true
): Constructor<ReadOnlyMixin> & T {
  abstract class _ReadOnlyMixin extends base implements ReadOnlyMixin {
    @property({ attribute: "readonly", type: Boolean, reflect: reflect }) readOnly = false;

    protected override update(changedProperties: PropertyValues<this>): void {
      super.update(changedProperties);

      if (changedProperties.has("readOnly")) {
        this.ariaReadOnly = this.readOnly ? "true" : null;
      }
    }
  }
  return _ReadOnlyMixin;
}
