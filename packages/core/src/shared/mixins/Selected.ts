import { LitElement, PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import { Constructor } from "./Constructor";
import { hasKeys } from "./hasKeys";

/** Defines functionality for an element which supports a selected state. */
export interface SelectedMixin {
  /**
   * Whether the element is selected.
   * @default false
   */
  selected: boolean;
}

/**
 * Determines whether a value is a `SelectedMixin`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `SelectedMixin`.
 */
export function isSelectedMixin(value: unknown): value is SelectedMixin {
  return hasKeys<SelectedMixin>(value, "selected");
}

/**
 * Mixin to augment an element with behavior that supports a selected state.
 * @template T The type of the base class.
 * @param {T} base The base class.
 * @returns {Constructor<SelectedMixin> & T} A constructor that implements `SelectedMixin`.
 */
export function Selected<T extends Constructor<LitElement>>(base: T): Constructor<SelectedMixin> & T {
  abstract class _SelectedMixin extends base implements SelectedMixin {
    @property({ type: Boolean, reflect: true }) selected = false;

    protected override update(changedProperties: PropertyValues<this>): void {
      super.update(changedProperties);

      if (changedProperties.has("selected")) {
        if (this.role === "button") {
          this.ariaPressed = `${this.selected}`;
          this.ariaSelected = null;
        } else if (this.role && this.role !== "none" && this.role !== "presentation") {
          this.ariaSelected = `${this.selected}`;
          this.ariaPressed = null;
        }
      }
    }
  }
  return _SelectedMixin;
}
