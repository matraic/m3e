import { LitElement, PropertyValues } from "lit";

import { DesignToken } from "../tokens";

import { AttachInternalsMixin, internals, isAttachInternalsMixin } from "./AttachInternals";
import { Constructor } from "./Constructor";
import { isDisabledMixin } from "./Disabled";
import { isDisabledInteractiveMixin } from "./DisabledInteractive";
import { isTouchedMixin } from "./Touched";
import { hasKeys } from "./hasKeys";

/** A symbol through which to update labels to reflect a control's current state. */
export const updateLabels = Symbol("updateLabels");

/** Defines functionality for a labelled custom element. */
export interface LabelledMixin extends AttachInternalsMixin {
  /** The label elements that the element is associated with. */
  readonly labels: NodeListOf<HTMLLabelElement>;

  /** Updates labels to reflect the current state of the control. */
  [updateLabels]?(): void;
}

/**
 * Determines whether a value is a `LabelledMixin`.
 * @param {unknown} value The value to test.
 * @returns A value indicating whether `value` is a `LabelledMixin`.
 */
export function isLabelledMixin(value: unknown): value is LabelledMixin {
  return hasKeys<LabelledMixin>(value, "labels") && isAttachInternalsMixin(value);
}

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
    /** Indicates that this custom element participates in form submission, validation, and form state restoration. */
    static readonly formAssociated = true;

    /** @private */
    private readonly [_eventHandler] = (e: Event) => {
      if (!e.defaultPrevented) {
        this[updateLabels]();
      }
    };

    /** The label elements that the element is associated with. */
    get labels(): NodeListOf<HTMLLabelElement> {
      return this[internals].labels as NodeListOf<HTMLLabelElement>;
    }

    /** @inheritdoc */
    override connectedCallback(): void {
      super.connectedCallback();
      this.addEventListener("focusout", this[_eventHandler]);
      this.addEventListener("change", this[_eventHandler]);
    }

    /** @inheritdoc */
    override disconnectedCallback(): void {
      super.disconnectedCallback();
      this.removeEventListener("focusout", this[_eventHandler]);
      this.removeEventListener("change", this[_eventHandler]);
    }

    /** @inheritdoc */
    protected override update(changedProperties: PropertyValues): void {
      super.update(changedProperties);
      this[updateLabels]();
    }

    /** @internal */
    [updateLabels](): void {
      const focusable = this.hasAttribute("tabindex");
      const disabled =
        (isDisabledMixin(this) && this.disabled) || (isDisabledInteractiveMixin(this) && this.disabledInteractive);

      for (const label of this.labels ?? []) {
        label.style.userSelect = focusable ? "none" : "";
        label.style.cursor = !disabled && focusable ? "pointer" : "";

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
