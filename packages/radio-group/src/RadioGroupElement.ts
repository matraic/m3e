import { css, CSSResultGroup, html, LitElement, PropertyValues } from "lit";
import { customElement } from "lit/decorators.js";

import {
  AttachInternals,
  Labelled,
  Dirty,
  Disabled,
  Touched,
  Role,
  Required,
  ConstraintValidation,
  FormAssociated,
  RequiredConstraintValidation,
  updateLabels,
} from "@m3e/core";

import { SelectionManager, selectionManager } from "@m3e/core/a11y";

import { M3eRadioElement } from "./RadioElement";

/**
 * A container for a set of radio buttons.
 *
 * @description
 * The `m3e-radio-group` component is a semantic container that orchestrates a set of `m3e-radio` elements.
 * It provides accessible grouping, keyboard navigation, and validation logic for mutually exclusive selection.
 * When marked as `required`, the group enforces selection constraints and reflects validation state, while
 * delegating form submission to the checked radio. The group does not submit a value itself—it coordinates
 * behavior, focus, and feedback across its radios.
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
 */
@customElement("m3e-radio-group")
export class M3eRadioGroupElement extends Labelled(
  RequiredConstraintValidation(
    Dirty(
      Touched(Required(ConstraintValidation(FormAssociated(Disabled(AttachInternals(Role(LitElement, "radiogroup")))))))
    )
  )
) {
  /** The list of attributes corresponding to the registered properties. */
  static override get observedAttributes() {
    return [...super.observedAttributes, "aria-invalid"];
  }

  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: inline;
    }
  `;

  /** @private */ readonly #focusOutHandler = () => this.#handleChange();

  /** @internal */
  readonly [selectionManager] = new SelectionManager<M3eRadioElement>().withWrap().onActiveItemChange(() => {
    this[selectionManager].activeItem?.click();
  });

  /** The radios in the group. */
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

  /** @inheritdoc */
  override markAsTouched(): void {
    super.markAsTouched();
    this.radios.forEach((x) => x.markAsTouched());
  }

  /** @inheritdoc */
  override markAsUntouched(): void {
    super.markAsUntouched();
    this.radios.forEach((x) => x.markAsUntouched());
  }

  /** @inheritdoc */
  override markAsDirty(): void {
    super.markAsDirty();
    this.radios.forEach((x) => x.markAsDirty());
  }

  /** @inheritdoc */
  override markAsPristine(): void {
    super.markAsPristine();
    this.radios.forEach((x) => x.markAsPristine());
  }

  /** Synchronizes property values when attributes change. */
  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);

    switch (name) {
      case "name":
        this.radios.forEach((x) => (x.name = this.name));
        break;

      case "aria-invalid":
        this.radios.forEach((x) => {
          x.classList.toggle("-invalid", newValue === "true");
          x[updateLabels]?.();
        });
        break;
    }
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("focusout", this.#focusOutHandler);
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("focusout", this.#focusOutHandler);
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("disabled")) {
      this.ariaDisabled = null;
    }

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
    const { added } = this[selectionManager].setItems([...this.querySelectorAll("m3e-radio")]);
    added.forEach((x) => (x.name = x.name || this.name));
  }

  /** @private */
  #handleKeyDown(e: KeyboardEvent): void {
    this[selectionManager].onKeyDown(e);
  }

  /** @private */
  #handleChange(): void {
    this.checkValidity();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-radio-group": M3eRadioGroupElement;
  }
}
