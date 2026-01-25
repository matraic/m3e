import { PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";

import { AttachInternals, Dirty, Disabled, FormAssociated, formValue, Labelled, Role, Touched } from "@m3e/core";
import { SelectionManager, selectionManager } from "@m3e/core/a11y";

import { M3eListElement } from "./ListElement";
import { M3eListOptionElement } from "./ListOptionElement";

/**
 * A list of selectable options.
 *
 * @description
 * The `m3e-selection-list` component provides a container for managing selectable list items with
 * single or multi-select capabilities. It implements robust keyboard navigation, form association,
 * and state management for both individual options and the list as a whole. The component supports
 * flexible layout, custom theming via CSS custom properties, and comprehensive accessibility features
 * including aria roles, roving tabindex management, and semantic event handling following Material 3
 * design principles.
 *
 * @tag m3e-selection-list
 *
 * @slot - Renders the items of the list.
 *
 * @attr hide-selection-indicator - Whether to hide the selection indicator.
 * @attr multi - Whether multiple items can be selected.
 * @attr variant - The appearance variant of the list.
 *
 * @fires input - Emitted when the selected state of an option changes.
 * @fires change - Emitted when the selected state of an option changes.
 *
 * @cssprop --m3e-list-divider-inset-start-size - Start inset for dividers within the list.
 * @cssprop --m3e-list-divider-inset-end-size - End inset for dividers within the list.
 * @cssprop --m3e-segmented-list-segment-gap - Gap between list items in segmented variant.
 * @cssprop --m3e-segmented-list-container-shape - Border radius of the segmented list container.
 * @cssprop --m3e-segmented-list-item-container-color - Background color of items in segmented variant.
 * @cssprop --m3e-segmented-list-item-disabled-container-color - Background color of disabled items in segmented variant.
 * @cssprop --m3e-segmented-list-item-container-shape - Border radius of items in segmented variant.
 * @cssprop --m3e-segmented-list-item-hover-container-shape - Border radius of items in segmented variant on hover.
 * @cssprop --m3e-segmented-list-item-focus-container-shape - Border radius of items in segmented variant on focus.
 * @cssprop --m3e-segmented-list-item-selected-container-shape - Border radius of items in segmented variant when selected.
 */
@customElement("m3e-selection-list")
export class M3eSelectionListElement extends Labelled(
  Dirty(Touched(FormAssociated(Disabled(AttachInternals(Role(M3eListElement, "listbox")))))),
) {
  /** @private */ readonly #keyDownHandler = (e: KeyboardEvent) => this[selectionManager].onKeyDown(e);
  /** @private */ readonly #changeHandler = (e: Event) => this.#handleChange(e);

  /** @private */
  readonly [selectionManager] = new SelectionManager<M3eListOptionElement>()
    .withWrap()
    .withHomeAndEnd()
    .withVerticalOrientation();

  /**
   * Whether multiple items can be selected.
   * @default false
   */
  @property({ type: Boolean }) multi = false;

  /**
   * Whether to hide the selection indicator.
   * @default false
   */
  @property({ attribute: "hide-selection-indicator", type: Boolean }) hideSelectionIndicator = false;

  /** The options of the list. */
  get options(): readonly M3eListOptionElement[] {
    return this[selectionManager]?.items ?? [];
  }

  /** The selected option(s) of the list. */
  get selected(): readonly M3eListOptionElement[] {
    return this[selectionManager]?.selectedItems ?? [];
  }

  /** The selected (enabled) value(s) of the set. */
  get value(): string | readonly string[] | null {
    const values = this.selected.filter((x) => !x.disabled).map((x) => x.value);
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

    this.addEventListener("keydown", this.#keyDownHandler);
    this.addEventListener("change", this.#changeHandler);
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.removeEventListener("keydown", this.#keyDownHandler);
    this.removeEventListener("change", this.#changeHandler);
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("disabled") && (changedProperties.get("disabled") !== undefined || this.disabled)) {
      this[selectionManager].disabled = this.disabled;
    }

    if (changedProperties.has("multi")) {
      this[selectionManager].multi = this.multi;

      if (this.multi) {
        this.setAttribute("aria-multiselectable", "true");
      } else {
        this.removeAttribute("aria-multiselectable");
      }

      this[selectionManager].items.forEach((x) => x.requestUpdate());
    }

    if (changedProperties.has("hideSelectionIndicator")) {
      this[selectionManager].items.forEach((x) => x.classList.toggle("-hide-selection", this.hideSelectionIndicator));
    }
  }

  /** @inheritdoc */
  override notifyItemsChange(): void {
    const { added } = this[selectionManager].setItems(this.items.filter((x) => x instanceof M3eListOptionElement));
    added.forEach((x) => x.classList.toggle("-hide-selection", this.hideSelectionIndicator));

    if (!this[selectionManager].activeItem) {
      this[selectionManager].updateActiveItem(added.find((x) => !x.disabled));
    }
  }

  /** @private */
  #handleChange(e: Event): void {
    if (e.target !== this) {
      e.stopImmediatePropagation();
      e.stopPropagation();
      this.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-selection-list": M3eSelectionListElement;
  }
}
