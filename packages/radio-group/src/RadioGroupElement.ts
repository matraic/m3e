import { css, CSSResultGroup, html, LitElement, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";

import { AttachInternals, Labelled, Dirty, Disabled, Touched, Role, Required } from "@m3e/core";

import { SelectionManager, selectionManager } from "@m3e/core/a11y";

import { M3eRadioElement } from "./RadioElement";

/**
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
 */
@customElement("m3e-radio-group")
export class M3eRadioGroupElement extends Labelled(
  Dirty(Touched(Required(Disabled(AttachInternals(Role(LitElement, "radiogroup"))))))
) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: inline;
    }
  `;

  /** @internal */
  readonly [selectionManager] = new SelectionManager<M3eRadioElement>().withWrap().onActiveItemChange(() => {
    this[selectionManager].activeItem?.click();
  });

  /** The name that identifies the element when submitting the associated form. */
  @property({ noAccessor: true }) get name() {
    return this.getAttribute("name") ?? "";
  }
  set name(value: string) {
    const oldName = this.name;
    if (value) {
      this.setAttribute("name", value);
    } else {
      this.removeAttribute("name");
    }
    this.requestUpdate("name", oldName);
  }

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
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("disabled") && (changedProperties.get("disabled") !== undefined || this.disabled)) {
      this[selectionManager].disabled = this.disabled;
    }
    if (changedProperties.has("required") && (changedProperties.get("required") !== undefined || this.required)) {
      this[selectionManager].items.forEach((x) => (x.required = this.required));
    }
    if (changedProperties.has("name")) {
      this[selectionManager].items.forEach((x) => (x.name = this.name));
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<slot @slotchange="${this.#handleSlotChange}" @keydown="${this.#handleKeyDown}"></slot>`;
  }

  /** @private */
  #handleSlotChange() {
    const { added } = this[selectionManager].setItems([...this.querySelectorAll("m3e-radio")]);
    added.forEach((x) => {
      x.name = this.name;
      x.required = this.required;
    });
  }

  /** @private */
  #handleKeyDown(e: KeyboardEvent): void {
    this[selectionManager].onKeyDown(e);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-radio-group": M3eRadioGroupElement;
  }
}
