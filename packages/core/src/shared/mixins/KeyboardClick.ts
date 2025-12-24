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
    /** @private */ #keyPressed = false;

    /** @private */
    readonly #keyDownHandler = (e: KeyboardEvent) => this.#handleKeyDown(e);
    readonly #keyUpHandler = (e: KeyboardEvent) => this.#handleKeyUp(e);
    readonly #focusOutHandler = () => (this.#keyPressed = false);

    /** @inheritdoc */
    override connectedCallback(): void {
      super.connectedCallback();
      this.addEventListener("keydown", this.#keyDownHandler);
      this.addEventListener("keyup", this.#keyUpHandler);
      this.addEventListener("focusout", this.#focusOutHandler);
    }

    /** @inheritdoc */
    override disconnectedCallback(): void {
      super.disconnectedCallback();
      this.removeEventListener("keydown", this.#keyDownHandler);
      this.removeEventListener("keyup", this.#keyUpHandler);
      this.removeEventListener("focusout", this.#focusOutHandler);
    }

    /** @private */
    #handleKeyDown(e: KeyboardEvent): void {
      if (
        e.defaultPrevented ||
        e.target !== e.currentTarget ||
        (isDisabledMixin(this) && this.disabled) ||
        (isDisabledInteractiveMixin(this) && this.disabledInteractive)
      ) {
        return;
      }

      if (e.key === " " || (allowEnter && e.key === "Enter")) {
        this.#keyPressed = true;
      }
    }

    /** @private */
    #handleKeyUp(e: KeyboardEvent): void {
      if (
        e.defaultPrevented ||
        e.target !== e.currentTarget ||
        (isDisabledMixin(this) && this.disabled) ||
        (isDisabledInteractiveMixin(this) && this.disabledInteractive) ||
        !this.#keyPressed
      ) {
        return;
      }
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

  return _KeyboardClickMixin;
}
