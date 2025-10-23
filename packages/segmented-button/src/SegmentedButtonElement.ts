import { css, CSSResultGroup, html, LitElement, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";

import {
  AttachInternals,
  DesignToken,
  Dirty,
  Disabled,
  FormAssociated,
  formValue,
  Labelled,
  Role,
  Touched,
} from "@m3e/core";

import { SelectionManager, selectionManager } from "@m3e/core/a11y";

import { M3eButtonSegmentElement } from "./ButtonSegmentElement";

/**
 * A button that allows a user to select from a limited set of options.
 *
 * @description
 * The `m3e-segmented-button` component allows users to select one or more options from a horizontal group.
 * Each segment behaves like a toggle-able button, supporting icon and label content, selection state, and
 * accessibility roles. Built with Material Design 3 principles, it adapts shape, color, and ripple feedback
 * based on interaction state and input modality. Segments are visually unified but independently interactive.
 *
 * @example
 * The following example illustrates a single-select segmented button with four segments.
 * ```html
 * <m3e-segmented-button>
 *  <m3e-button-segment checked>8 oz</m3e-button-segment>
 *  <m3e-button-segment>12 oz</m3e-button-segment>
 *  <m3e-button-segment>16 oz</m3e-button-segment>
 *  <m3e-button-segment>20 oz</m3e-button-segment>
 * </m3e-segmented-button>
 * ```
 * @example
 * The next example illustrates a multiselect segmented button designated using the `multi` attribute.
 * ```html
 * <m3e-segmented-button multi>
 *  <m3e-button-segment checked>$</m3e-button-segment>
 *  <m3e-button-segment checked>$$</m3e-button-segment>
 *  <m3e-button-segment>$$$</m3e-button-segment>
 *  <m3e-button-segment>$$$$</m3e-button-segment>
 * </m3e-segmented-button>
 * ```
 *
 * @tag m3e-segmented-button
 *
 * @slot - Renders the segments of the button.
 *
 * @attr disabled - Whether the element is disabled.
 * @attr hide-selection-indicator - Whether to hide the selection indicator.
 * @attr multi - Whether multiple options can be selected.
 * @attr name - The name that identifies the element when submitting the associated form.
 *
 * @fires input - Emitted when the checked state of a segment changes.
 * @fires change - Emitted when the checked state of a segment changes.
 *
 * @cssprop --m3e-segmented-button-start-shape - Border radius for the first segment in a segmented button.
 * @cssprop --m3e-segmented-button-end-shape - Border radius for the last segment in a segmented button.
 */
@customElement("m3e-segmented-button")
export class M3eSegmentedButtonElement extends Labelled(
  Dirty(Touched(FormAssociated(Disabled(AttachInternals(Role(LitElement, "radiogroup"))))))
) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-flex;
      vertical-align: middle;
      align-items: center;
    }
    ::slotted(:first-child) {
      border-radius: var(
        --m3e-segmented-button-start-shape,
        ${DesignToken.shape.corner.full} ${DesignToken.shape.corner.none} ${DesignToken.shape.corner.none}
          ${DesignToken.shape.corner.full}
      );
    }
    ::slotted(:last-child) {
      border-radius: var(
        --m3e-segmented-button-end-shape,
        ${DesignToken.shape.corner.none} ${DesignToken.shape.corner.full} ${DesignToken.shape.corner.full}
          ${DesignToken.shape.corner.none}
      );
    }
    ::slotted(:not(:first-child)) {
      --_segmented-button-left-border: none;
    }
  `;

  /** @internal */
  readonly [selectionManager] = new SelectionManager<M3eButtonSegmentElement>()
    .withWrap()
    .onActiveItemChange(() => this[selectionManager].activeItem?.click());

  /**
   * Whether multiple options can be selected.
   * @default false
   */
  @property({ type: Boolean }) multi = false;

  /**
   * Whether to hide the selection indicator.
   * @default false
   */
  @property({ attribute: "hide-selection-indicator", type: Boolean }) hideSelectionIndicator = false;

  /** The segments of the button. */
  get segments(): readonly M3eButtonSegmentElement[] {
    return this[selectionManager]?.items ?? [];
  }

  /** The selected segment(s) of the button. */
  get selected(): readonly M3eButtonSegmentElement[] {
    return this[selectionManager]?.selectedItems ?? [];
  }

  /** The selected value(s) of the button. */
  get value(): string | readonly string[] | null {
    const values = this.selected.map((x) => x.value);
    switch (values.length) {
      case 0:
        return null;
      case 1:
        return values[0];
      default:
        return values;
    }
  }

  /** @inheritdoc @internal */
  override get [formValue]() {
    const values = this.value;
    if (Array.isArray(values)) {
      const data = new FormData();
      for (const value of values) {
        data.append(this.name, value);
      }
      return data;
    }
    return <string | null>values;
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();
    this[selectionManager].multi = this.multi;
    this[selectionManager].disableRovingTabIndex(this.multi);
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("disabled") && (changedProperties.get("disabled") !== undefined || this.disabled)) {
      this[selectionManager].disabled = this.disabled;
    }

    if (changedProperties.has("multi")) {
      this.role = this.multi ? "group" : "radiogroup";
      this[selectionManager].multi = this.multi;
      this[selectionManager].disableRovingTabIndex(this.multi);
    }

    if (changedProperties.has("hideSelectionIndicator")) {
      this.segments.forEach((x) => x.classList.toggle("-hide-selection", this.hideSelectionIndicator));
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
    const { added } = this[selectionManager].setItems([...this.querySelectorAll("m3e-button-segment")]);
    added.forEach((x) => x.classList.toggle("-hide-selection", this.hideSelectionIndicator));
  }

  /** @private */
  #handleKeyDown(e: KeyboardEvent): void {
    if (!this.multi) {
      this[selectionManager].onKeyDown(e);
    }
  }

  /** @private */
  #handleChange(e: Event): void {
    e.stopPropagation();
    this.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-segmented-button": M3eSegmentedButtonElement;
  }
}
