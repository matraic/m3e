import { LitElement, PropertyValues } from "lit";

import { DesignToken } from "../tokens";

import { AttachInternalsMixin, internals, isAttachInternalsMixin } from "./AttachInternals";
import { Constructor } from "./Constructor";
import { isDisabledMixin } from "./Disabled";
import { isDisabledInteractiveMixin } from "./DisabledInteractive";
import { isTouchedMixin } from "./Touched";
import { hasKeys } from "./hasKeys";

/** Defines functionality for a labelled custom element. */
export interface LabelledMixin extends AttachInternalsMixin {
  /** The label elements that the element is associated with. */
  readonly labels: NodeListOf<HTMLLabelElement>;
}

/**
 * Determines whether a value is a `LabelledMixin`.
 * @param {unknown} value The value to test.
 * @returns A value indicating whether `value` is a `LabelledMixin`.
 */
export function isLabelledMixin(value: unknown): value is LabelledMixin {
  return hasKeys<LabelledMixin>(value, "labels") && isAttachInternalsMixin(value);
}

const _updateLabels = Symbol("_updateLabels");
const _eventHandler = Symbol("_eventHandler");

/**
 * Mixin to augment an element with support for labelling.
 * @template T The type of the base class.
 * @param {T} base The base class.
 * @returns {Constructor<FormAssociatedMixin> & T} A constructor that implements `FormAssociatedMixin`.
 */
export function Labelled<T extends Constructor<LitElement & AttachInternalsMixin>>(
  base: T
): Constructor<LabelledMixin> & T {
  abstract class _Labelled extends base implements LabelledMixin {
    static readonly formAssociated = true;

    private readonly [_eventHandler] = (e: Event) => {
      if (!e.defaultPrevented) {
        this[_updateLabels]();
      }
    };

    get labels(): NodeListOf<HTMLLabelElement> {
      return this[internals].labels as NodeListOf<HTMLLabelElement>;
    }

    override connectedCallback(): void {
      super.connectedCallback();
      this.addEventListener("focusout", this[_eventHandler]);
      this.addEventListener("change", this[_eventHandler]);
    }

    override disconnectedCallback(): void {
      super.disconnectedCallback();
      this.removeEventListener("focusout", this[_eventHandler]);
      this.removeEventListener("change", this[_eventHandler]);
    }

    protected override update(changedProperties: PropertyValues): void {
      super.update(changedProperties);
      this[_updateLabels]();
    }

    private [_updateLabels](): void {
      const disabled =
        (isDisabledMixin(this) && this.disabled) || (isDisabledInteractiveMixin(this) && this.disabledInteractive);
      for (const label of this.labels) {
        label.style.userSelect = "none";
        label.style.cursor = !disabled ? "pointer" : "";
        label.style.color = disabled
          ? `color-mix(in srgb, ${DesignToken.color.onSurface} 38%, transparent)`
          : isTouchedMixin(this) && this.touched && this.ariaInvalid
          ? `${DesignToken.color.error}`
          : "";
      }
    }
  }

  return _Labelled;
}
