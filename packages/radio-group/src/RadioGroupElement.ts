import { css, CSSResultGroup, html, LitElement, PropertyValues } from "lit";
import { customElement } from "lit/decorators.js";

import {
  AttachInternals,
  Labelled,
  ConstraintValidation,
  DesignToken,
  Dirty,
  Disabled,
  FormAssociated,
  formValue,
  Required,
  RequiredConstraintValidation,
  Touched,
  Role,
} from "@m3e/core";

import { SelectionManager, selectionManager } from "@m3e/core/a11y";

import { M3eRadioElement } from "./RadioElement";

/**
 * @summary
 * A container for a set of radio buttons that enforces single selection.
 *
 * @description
 * The `m3e-radio-group` component orchestrates a collection of `m3e-radio` components, ensuring that
 * only one option is selected at a time. It manages selection state, propagates value changes, and
 * supports form integration through `name` and `value` attributes.
 *
 * @example
 * The following example illustrates using `m3e-radio-group` and `m3e-radio` to present a group of options.
 * ```html
 * <label for="rdg1">Radio group</label>
 * <br />
 * <m3e-radio-group id="rdg1">
 *  <label><m3e-radio value="1"></m3e-radio> Value 1</label>
 *  <label><m3e-radio value="2"></m3e-radio> Value 2</label>
 *  <label><m3e-radio value="3"></m3e-radio> Value 3</label>
 *  <label><m3e-radio value="4"></m3e-radio> Value 4</label>
 * </m3e-radio-group>
 * ```
 *
 * @tag m3e-radio-group
 *
 * @slot - Renders the radio buttons of the group.
 *
 * @attr disabled - Whether the element is disabled.
 * @attr name - The name that identifies the element when submitting the associated form.
 * @attr required - Whether the element is required.
 *
 * @fires change - Emitted when the checked state of a radio button changes.
 *
 * @cssprop --m3e-radio-error-hover-color - Fallback hover color used when the radio is invalid and touched.
 * @cssprop --m3e-radio-error-focus-color - Fallback focus color used when the radio is invalid and touched.
 * @cssprop --m3e-radio-error-ripple-color - Fallback ripple color used when the radio is invalid and touched.
 * @cssprop --m3e-radio-error-icon-color - Fallback icon color used when the radio is invalid and touched.
 */
@customElement("m3e-radio-group")
export class M3eRadioGroupElement extends Labelled(
  RequiredConstraintValidation(
    Dirty(
      Touched(Required(ConstraintValidation(FormAssociated(Disabled(AttachInternals(Role(LitElement, "radiogroup")))))))
    )
  )
) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: inline;
    }
    :host(.-touched:invalid) {
      --m3e-radio-unselected-hover-color: var(--m3e-radio-error-hover-color, ${DesignToken.color.error});
      --m3e-radio-unselected-focus-color: var(--m3e-radio-error-focus-color, ${DesignToken.color.error});
      --m3e-radio-unselected-ripple-color: var(--m3e-radio-error-ripple-color, ${DesignToken.color.error});
      --m3e-radio-unselected-icon-color: var(--m3e-radio-error-icon-color, ${DesignToken.color.error});
      color: var(--m3e-radio-error-icon-color, ${DesignToken.color.error});
    }
    @media (forced-colors: active) {
      :host(.-touched:invalid) {
        --_radio-forced-color: Highlight;
        color: Highlight;
      }
    }
  `;

  /** @private */ readonly #focusOutHandler = () => this.checkValidity();

  /** @internal */
  readonly [selectionManager] = new SelectionManager<M3eRadioElement>().withWrap().onActiveItemChange(() => {
    this[selectionManager].activeItem?.click();
  });

  /** The radio buttons in the group. */
  get radios(): readonly M3eRadioElement[] {
    return this[selectionManager]?.items ?? [];
  }

  /** The selected radio. */
  get selected(): M3eRadioElement | null {
    return this[selectionManager]?.selectedItems[0] ?? null;
  }

  /** The selected value of the radio group. */
  get value(): string | null {
    return this.selected?.value ?? null;
  }

  /** @inheritdoc @internal */
  override get [formValue](): string | File | FormData | null {
    return this.value;
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("focusout", this.#focusOutHandler, { capture: true });
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("focusout", this.#focusOutHandler, { capture: true });
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("disabled") && (changedProperties.get("disabled") !== undefined || this.disabled)) {
      this[selectionManager].disabled = this.disabled;
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<slot
      @slotchange="${this.#handleSlotChange}"
      @keydown="${this.#handleKeyDown}"
      @change="${this.#handleChange}"
    ></slot>`;
  }

  /** @private */
  #handleSlotChange() {
    this[selectionManager].setItems([...this.querySelectorAll("m3e-radio")]);
  }

  /** @private */
  #handleKeyDown(e: KeyboardEvent): void {
    this[selectionManager].onKeyDown(e);
  }

  /** @private */
  #handleChange(e: Event): void {
    e.stopPropagation();
    if (this.ariaInvalid === "true") {
      this.checkValidity();
    }

    this.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-radio-group": M3eRadioGroupElement;
  }
}
