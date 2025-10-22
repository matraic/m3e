import { LitElement, PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import { Constructor } from "./Constructor";
import { DisabledMixin, isDisabledMixin } from "./Disabled";
import { hasKeys } from "./hasKeys";

/** Defines functionality for an element which supports an interactive disabled state. */
export interface DisabledInteractiveMixin extends DisabledMixin {
  /**
   * Whether the element is disabled and interactive.
   * @default false
   */
  disabledInteractive: boolean;
}

/**
 * Determines whether a value is a `DisabledInteractiveMixin`.
 * @param {unknown} value The value to test.
 * @returns {value is DisabledInteractiveMixin} Whether `value` is a `DisabledInteractiveMixin`.
 */
export function isDisabledInteractiveMixin(value: unknown): value is DisabledInteractiveMixin {
  return hasKeys<DisabledInteractiveMixin>(value, "disabledInteractive") && isDisabledMixin(value);
}

const SUPPRESSED_EVENTS = ["click", "dblclick", "auxclick", "keydown", "keyup"];
const INTERACTIVE_KEYS = ["Tab", "ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown", "Left", "Up", "Right", "Down"];
const _suppressedEventHandler = Symbol("_suppressedEventHandler");

/**
 * Mixin to augment an element with behavior that supports an interactive disabled state.
 * @template T The type of the base class.
 * @param {T} base The base class.
 * @returns {Constructor<DisabledInteractiveMixin>} A constructor that implements `DisabledInteractiveMixin`.
 */
export function DisabledInteractive<T extends Constructor<LitElement & DisabledMixin>>(
  base: T
): Constructor<DisabledInteractiveMixin> & T {
  abstract class _DisabledInteractiveMixin extends base implements DisabledInteractiveMixin {
    /** @private */
    private readonly [_suppressedEventHandler] = (e: Event) => {
      if (this.disabledInteractive) {
        // Only allow specific keys when disabled and interactive.
        if (e instanceof KeyboardEvent && INTERACTIVE_KEYS.includes(e.key)) {
          return;
        }
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    };

    /**
     * Whether the element is disabled and interactive.
     * @default false
     */
    @property({ attribute: "disabled-interactive", type: Boolean, reflect: true }) disabledInteractive = false;

    /** @inheritdoc */
    override connectedCallback(): void {
      SUPPRESSED_EVENTS.forEach((x) => this.addEventListener(x, this[_suppressedEventHandler], true));
      super.connectedCallback();
    }

    /** @inheritdoc */
    override disconnectedCallback(): void {
      SUPPRESSED_EVENTS.forEach((x) => this.removeEventListener(x, this[_suppressedEventHandler], true));
      super.disconnectedCallback();
    }

    /** @inheritdoc */
    protected override update(changedProperties: PropertyValues<this>): void {
      super.update(changedProperties);

      if (
        (changedProperties.has("disabled") || changedProperties.has("disabledInteractive")) &&
        this.role &&
        this.role !== "none" &&
        this.role !== "presentation" &&
        this.role !== "none"
      ) {
        this.ariaDisabled = this.disabled || this.disabledInteractive ? "true" : null;
      }
    }
  }

  return _DisabledInteractiveMixin;
}
