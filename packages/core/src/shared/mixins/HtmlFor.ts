import { LitElement, PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import { Constructor } from "./Constructor";
import { hasKeys } from "./hasKeys";

/** Defines functionality for an attached element associated with an interactive control. */
export interface HtmlForMixin {
  /** The identifier of the interactive control to which this element is attached. */
  htmlFor: string | null;

  /** The interactive element to which this element is attached. */
  readonly control: HTMLElement | null;

  /**
   * Attaches the element to an interactive control.
   * @param {HTMLElement} control The element that controls the attachable element.
   */
  attach(control: HTMLElement): void;

  /** Detaches the element from its current interactive control. */
  detach(): void;
}

/**
 * Determines whether a value is a `HtmlForMixin`.
 * @param {unknown} value The value to test.
 * @returns {value is HtmlForMixin} Whether `value` is a `HtmlForMixin`.
 */
export function isHtmlForMixin(value: unknown): value is HtmlForMixin {
  return hasKeys<HtmlForMixin>(value, "htmlFor", "control", "attach", "detach");
}

const _control = Symbol("_control");
const _firstUpdated = Symbol("_firstUpdated");

/**
 * Mixin that creates an attached element associated with an interactive control.
 * @template T The type of the base class.
 * @param {T} base The base class.
 * @returns {Constructor<HtmlForMixin> & T} A constructor extends `base` and implements `HtmlForMixin`.
 */
export function HtmlFor<T extends Constructor<LitElement>>(base: T): Constructor<HtmlForMixin> & T {
  abstract class _HtmlForMixin extends base implements HtmlForMixin {
    /** @private */ private [_control]: HTMLElement | null = null;
    /** @private */ private [_firstUpdated] = false;

    @property({ attribute: "for" }) htmlFor: string | null = null;

    get control() {
      return this[_control];
    }

    protected override firstUpdated(_changedProperties: PropertyValues): void {
      super.firstUpdated(_changedProperties);
      this[_firstUpdated] = true;
    }

    protected override update(changedProperties: PropertyValues<this>): void {
      super.update(changedProperties);

      if (changedProperties.has("htmlFor")) {
        if (this.htmlFor) {
          const control = (this.getRootNode() as ParentNode)?.querySelector(`#${this.htmlFor}`);
          if (control !== this.control) {
            if (this.control) {
              this.detach();
            }
            if (control instanceof HTMLElement) {
              this.attach(control);
            }
          }
        } else if (this.control && this[_firstUpdated]) {
          this.detach();
        }
      }
    }

    attach(control: HTMLElement): void {
      this[_control] = control;
    }

    detach(): void {
      this[_control] = null;
    }
  }

  return _HtmlForMixin;
}
