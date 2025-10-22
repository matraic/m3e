import { LitElement, PropertyValues } from "lit";

import { Constructor } from "./Constructor";
import { DisabledMixin } from "./Disabled";

const _tabindex = Symbol("_tabindex");

/**
 * Mixin to augment an element with behavior that supports a focused state.
 * @template T The type of the base class.
 * @param {T} base The base class.
 * @returns {Constructor & T} A constructor that implements focusable behavior.
 */
export function Focusable<T extends Constructor<LitElement & DisabledMixin>>(base: T): Constructor & T {
  abstract class _FocusableMixin extends base {
    /** @private */
    private [_tabindex] = 0;

    /** @inheritdoc */
    override connectedCallback(): void {
      this[_tabindex] = Number.parseInt(this.getAttribute("tabindex") ?? "0");
      super.connectedCallback();
    }

    /** @inheritdoc */
    protected override firstUpdated(_changedProperties: PropertyValues<this>): void {
      super.firstUpdated(_changedProperties);

      if (!this.hasAttribute("tabindex") && !_changedProperties.has("disabled")) {
        this.setAttribute("tabindex", `${this[_tabindex]}`);
      }
    }

    /** @inheritdoc */
    protected override update(changedProperties: PropertyValues<this>): void {
      super.update(changedProperties);

      if (changedProperties.has("disabled")) {
        if (!this.disabled && this.role !== "none") {
          if (!this.hasAttribute("tabindex")) {
            this.setAttribute("tabindex", `${this[_tabindex]}`);
          }
        } else {
          const tabIndex = this.getAttribute("tabindex");
          if (tabIndex) {
            this[_tabindex] = Number.parseInt(tabIndex);
          }
          this.removeAttribute("tabindex");
        }
      }
    }
  }

  return _FocusableMixin;
}
