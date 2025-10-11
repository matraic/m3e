import { html, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";

import { AttachInternals, Labelled, Dirty, Disabled, FormAssociated, formValue, Touched, Role } from "@m3e/core";
import { SelectionManager, selectionManager } from "@m3e/core/a11y";

import { M3eChipSetElement } from "./ChipSetElement";
import { M3eFilterChipElement } from "./FilterChipElement";

/**
 * @summary
 * A container that organizes filter chips into a cohesive group, enabling selection and
 * deselection of values used to refine content or trigger contextual behavior.
 *
 * @description
 * The `m3e-filter-chip-set` component presents a group of filter chips, enabling users to select
 * one or more options to filter content or data sets. It supports single and multi-selection,
 * keyboard navigation, accessibility, and seamless form association, providing expressive and
 * interactive filtering experiences in line with Material 3 guidelines.
 *
 * @example
 * The following example illustrates a single-select `m3e-filter-chip-set` containing multiple `m3e-filter-chip` components that
 * allow a user to choose an option. You can use the `multi` attribute to enable multiselect.
 * ```html
 * <m3e-filter-chip-set aria-label="Filter by topic">
 *  <m3e-filter-chip><m3e-icon slot="icon" name="palette"></m3e-icon>Design</m3e-filter-chip>
 *  <m3e-filter-chip><m3e-icon slot="icon" name="accessibility_new"></m3e-icon>Accessibility</m3e-filter-chip>
 *  <m3e-filter-chip><m3e-icon slot="icon" name="motion_photos_on"></m3e-icon>Motion</m3e-filter-chip>
 *  <m3e-filter-chip><m3e-icon slot="icon" name="description"></m3e-icon>Documentation</m3e-filter-chip>
 * </m3e-filter-chip-set>
 * ```
 *
 * @tag m3e-filter-chip-set
 *
 * @slot - Renders the chips of the set.
 *
 * @attr disabled - Whether the element is disabled.
 * @attr hide-selection-indicator - Whether to hide the selection indicator.
 * @attr multi - Whether multiple chips can be selected.
 * @attr name - The name that identifies the element when submitting the associated form.
 * @attr vertical - Whether the element is oriented vertically.
 *
 * @fires input - Emitted when the selected state of a chip changes.
 * @fires change - Emitted when the selected state of a chip changes.
 *
 * @cssprop --m3e-chip-set-spacing - The spacing (gap) between chips in the set.
 */
@customElement("m3e-filter-chip-set")
export class M3eFilterChipSetElement extends Labelled(
  Dirty(Touched(FormAssociated(Disabled(AttachInternals(Role(M3eChipSetElement, "listbox"))))))
) {
  /** @internal */
  readonly [selectionManager] = new SelectionManager<M3eFilterChipElement>()
    .onActiveItemChange(() => this[selectionManager].activeItem?.focus())
    .withWrap();

  /**
   * Whether multiple chips can be selected.
   * @default false
   */
  @property({ type: Boolean }) multi = false;

  /**
   * Whether to hide the selection indicator.
   * @default false
   */
  @property({ attribute: "hide-selection-indicator", type: Boolean }) hideSelectionIndicator = false;

  /** The chips of the set. */
  get chips(): readonly M3eFilterChipElement[] {
    return this[selectionManager]?.items ?? [];
  }

  /** The selected chip(s) of the set. */
  get selected(): readonly M3eFilterChipElement[] {
    return this[selectionManager]?.selectedItems ?? [];
  }

  /** The selected value(s) of the set. */
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
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("vertical")) {
      this[selectionManager].vertical = this.vertical;
    }

    if (changedProperties.has("disabled") && (changedProperties.get("disabled") !== undefined || this.disabled)) {
      this[selectionManager].disabled = this.disabled;
    }

    if (changedProperties.has("multi")) {
      this.ariaMultiSelectable = `${this.multi}`;
      this[selectionManager].multi = this.multi;
      this[selectionManager].disableRovingTabIndex(this.multi);
    }

    if (changedProperties.has("hideSelectionIndicator")) {
      this.chips.forEach((x) => x.classList.toggle("-hide-selection", this.hideSelectionIndicator));
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

  /** @internal */
  #handleSlotChange() {
    const { added } = this[selectionManager].setItems([...this.querySelectorAll("m3e-filter-chip")]);
    added.forEach((x) => x.classList.toggle("-hide-selection", this.hideSelectionIndicator));
  }

  /** @internal */
  #handleKeyDown(e: KeyboardEvent): void {
    if (!this.multi) {
      this[selectionManager].onKeyDown(e);
    }
  }

  /** @internal */
  #handleChange(e: Event): void {
    e.stopPropagation();
    this.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-filter-chip-set": M3eFilterChipSetElement;
  }
}
