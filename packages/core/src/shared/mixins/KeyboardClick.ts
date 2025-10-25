import { LitElement } from "lit";

import { Constructor } from "./Constructor";
import { isDisabledMixin } from "./Disabled";
import { isDisabledInteractiveMixin } from "./DisabledInteractive";

/**
 * Mixin to augment an element with behavior emits a click event on keyboard events.
 * @template T The type of the base class.
 * @param {T} base The base class.
 * @param {boolean} [allowEnter=true] Whether the `ENTER` key emits a click event.
 * @returns {T} A class that extends `base` with keyboard click behavior.
 */
export function KeyboardClick<T extends Constructor<LitElement>>(base: T, allowEnter: boolean = true): T {
  abstract class _KeyboardClickMixin extends base {
    /** @private */
    readonly #keyUpHandler = (e: KeyboardEvent) => this.#handleKeyUp(e);

    /** @inheritdoc */
    override connectedCallback(): void {
      super.connectedCallback();
      this.addEventListener("keyup", this.#keyUpHandler);
    }

    /** @inheritdoc */
    override disconnectedCallback(): void {
      super.disconnectedCallback();
      this.removeEventListener("keyup", this.#keyUpHandler);
    }

    /** @private */
    #handleKeyUp(e: KeyboardEvent): void {
      if (
        e.defaultPrevented ||
        e.target !== e.currentTarget ||
        (isDisabledMixin(this) && this.disabled) ||
        (isDisabledInteractiveMixin(this) && this.disabledInteractive)
      ) {
        return;
      }

      if (e.key === " " || (allowEnter && e.key === "Enter")) {
        // NOTE: the dispatched click event will not be trusted since it is synthetic.
        this.dispatchEvent(
          new MouseEvent("click", {
            cancelable: true,
            bubbles: true,
            composed: true,
          })
        );
      }
    }
  }

  return _KeyboardClickMixin;
}
