import { css, CSSResultGroup, html, LitElement, PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import { DesignToken, HoverController, PressedController, Role } from "@m3e/core";
import { M3eButtonElement, ButtonSize } from "@m3e/button";
import { M3eIconButtonElement } from "@m3e/icon-button";

import { SplitButtonVariant } from "./SplitButtonVariant";

/**
 * A button used to show an action with a menu of related actions.
 *
 * @description
 * The `m3e-split-button` component presents a primary action alongside a menu of related actions,
 * uniting two buttons in a single expressive surface. Designed for Material 3, it supports `elevated`,
 * `filled`, `tonal`, and `outlined` variants, and adapts to all button sizes. The leading button triggers
 * the main action, while the trailing icon button reveals additional options, enabling efficient workflows
 * and clear visual hierarchy. The split button ensures accessible, adaptive, and visually harmonious
 * interactions, reflecting Material 3’s principles of clarity, flexibility, and expressive design.
 *
 * @example
 * The following example illustrates use of the `m3e-split-button` to combine the `m3e-button`,
 * `m3e-icon-button`, and `m3e-menu` components into a split button.
 *
 * ```html
 * <m3e-split-button>
 *  <m3e-button slot="leading-button">
 *    <m3e-icon slot="icon" name="edit"></m3e-icon>Edit
 *  </m3e-button>
 *  <m3e-icon-button slot="trailing-button">
 *  <m3e-icon name="keyboard_arrow_down"></m3e-icon>
 *  <m3e-menu-trigger for="menu1"></m3e-menu-trigger>
 * </m3e-icon-button>
 * ```
 *
 * @tag m3e-split-button
 *
 * @slot leading-button - The leading button used to perform the primary action.
 * @slot trailing-button - The trailing icon button used to open a menu of related actions.
 *
 * @attr variant - The appearance variant of the button.
 * @attr size - The size of the button.
 *
 * @cssprop --m3e-split-button-extra-small-trailing-button-unselected-leading-space - Leading space for the trailing button (extra-small, unselected).
 * @cssprop --m3e-split-button-extra-small-trailing-button-unselected-trailing-space - Trailing space for the trailing button (extra-small, unselected).
 * @cssprop --m3e-split-button-small-trailing-button-unselected-leading-space - Leading space for the trailing button (small, unselected).
 * @cssprop --m3e-split-button-small-trailing-button-unselected-trailing-space - Trailing space for the trailing button (small, unselected).
 * @cssprop --m3e-split-button-medium-trailing-button-unselected-leading-space - Leading space for the trailing button (medium, unselected).
 * @cssprop --m3e-split-button-medium-trailing-button-unselected-trailing-space - Trailing space for the trailing button (medium, unselected).
 * @cssprop --m3e-split-button-large-trailing-button-unselected-leading-space - Leading space for the trailing button (large, unselected).
 * @cssprop --m3e-split-button-large-trailing-button-unselected-trailing-space - Trailing space for the trailing button (large, unselected).
 * @cssprop --m3e-split-button-extra-large-trailing-button-unselected-leading-space - Leading space for the trailing button (extra-large, unselected).
 * @cssprop --m3e-split-button-extra-large-trailing-button-unselected-trailing-space - Trailing space for the trailing button (extra-large, unselected).
 * @cssprop --m3e-split-button-extra-small-trailing-button-selected-leading-space - Leading space for the trailing button (extra-small, selected).
 * @cssprop --m3e-split-button-extra-small-trailing-button-selected-trailing-space - Trailing space for the trailing button (extra-small, selected).
 * @cssprop --m3e-split-button-small-trailing-button-selected-leading-space - Leading space for the trailing button (small, selected).
 * @cssprop --m3e-split-button-small-trailing-button-selected-trailing-space - Trailing space for the trailing button (small, selected).
 * @cssprop --m3e-split-button-medium-trailing-button-selected-leading-space - Leading space for the trailing button (medium, selected).
 * @cssprop --m3e-split-button-medium-trailing-button-selected-trailing-space - Trailing space for the trailing button (medium, selected).
 * @cssprop --m3e-split-button-large-trailing-button-selected-leading-space - Leading space for the trailing button (large, selected).
 * @cssprop --m3e-split-button-large-trailing-button-selected-trailing-space - Trailing space for the trailing button (large, selected).
 * @cssprop --m3e-split-button-extra-large-trailing-button-selected-leading-space - Leading space for the trailing button (extra-large, selected).
 * @cssprop --m3e-split-button-extra-large-trailing-button-selected-trailing-space - Trailing space for the trailing button (extra-large, selected).
 * @cssprop --m3e-split-button-extra-small-inner-corner-size - Inner corner size for the leading/trailing button (extra-small).
 * @cssprop --m3e-split-button-small-inner-corner-size - Inner corner size for the leading/trailing button (small).
 * @cssprop --m3e-split-button-medium-inner-corner-size - Inner corner size for the leading/trailing button (medium).
 * @cssprop --m3e-split-button-large-inner-corner-size - Inner corner size for the leading/trailing button (large).
 * @cssprop --m3e-split-button-extra-large-inner-corner-size - Inner corner size for the leading/trailing button (extra-large).
 * @cssprop --m3e-split-button-extra-small-inner-corner-hover-size - Inner corner size on hover (extra-small).
 * @cssprop --m3e-split-button-small-inner-corner-hover-size - Inner corner size on hover (small).
 * @cssprop --m3e-split-button-medium-inner-corner-hover-size - Inner corner size on hover (medium).
 * @cssprop --m3e-split-button-large-inner-corner-hover-size - Inner corner size on hover (large).
 * @cssprop --m3e-split-button-extra-large-inner-corner-hover-size - Inner corner size on hover (extra-large).
 * @cssprop --m3e-split-button-extra-small-inner-corner-pressed-size - Inner corner size on press (extra-small).
 * @cssprop --m3e-split-button-small-inner-corner-pressed-size - Inner corner size on press (small).
 * @cssprop --m3e-split-button-medium-inner-corner-pressed-size - Inner corner size on press (medium).
 * @cssprop --m3e-split-button-large-inner-corner-pressed-size - Inner corner size on press (large).
 * @cssprop --m3e-split-button-extra-large-inner-corner-pressed-size - Inner corner size on press (extra-large).
 * @cssprop --m3e-split-button-extra-small-between-spacing - Spacing between leading and trailing buttons (extra-small).
 * @cssprop --m3e-split-button-small-between-spacing - Spacing between leading and trailing buttons (small).
 * @cssprop --m3e-split-button-medium-between-spacing - Spacing between leading and trailing buttons (medium).
 * @cssprop --m3e-split-button-large-between-spacing - Spacing between leading and trailing buttons (large).
 * @cssprop --m3e-split-button-extra-large-between-spacing - Spacing between leading and trailing buttons (extra-large).
 */
@customElement("m3e-split-button")
export class M3eSplitButtonElement extends Role(LitElement, "group") {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-flex;
      vertical-align: middle;
    }
    ::slotted([slot="leading-button"]) {
      flex: 1 1 auto;
      min-width: 0;
      --_button-start-shape-pressed-morph: var(--_leading-button-shape, ${DesignToken.shape.corner.full});
    }

    ::slotted([slot="trailing-button"]:not([aria-expanded="true"])) {
      --m3e-icon-button-extra-small-default-leading-space: var(
        --m3e-split-button-extra-small-trailing-button-unselected-leading-space,
        0.75rem
      );
      --m3e-icon-button-extra-small-default-trailing-space: var(
        --m3e-split-button-extra-small-trailing-button-unselected-trailing-space,
        0.875rem
      );
      --m3e-icon-button-small-default-leading-space: var(
        --m3e-split-button-small-trailing-button-unselected-leading-space,
        0.75rem
      );
      --m3e-icon-button-small-default-trailing-space: var(
        --m3e-split-button-small-trailing-button-unselected-trailing-space,
        0.875rem
      );
      --m3e-icon-button-medium-default-leading-space: var(
        --m3e-split-button-medium-trailing-button-unselected-leading-space,
        0.8125rem
      );
      --m3e-icon-button-medium-default-trailing-space: var(
        --m3e-split-button-medium-trailing-button-unselected-trailing-space,
        1.0625rem
      );
      --m3e-icon-button-large-default-leading-space: var(
        --m3e-split-button-large-trailing-button-unselected-leading-space,
        1.625rem
      );
      --m3e-icon-button-large-default-trailing-space: var(
        --m3e-split-button-large-trailing-button-unselected-trailing-space,
        2rem
      );
      --m3e-icon-button-extra-large-default-leading-space: var(
        --m3e-split-button-extra-large-trailing-button-unselected-leading-space,
        2.3125rem
      );
      --m3e-icon-button-extra-large-default-trailing-space: var(
        --m3e-split-button-extra-large-trailing-button-unselected-trailing-space,
        3.0625rem
      );
    }

    ::slotted([slot="trailing-button"][aria-expanded="true"]) {
      --m3e-icon-button-extra-small-default-leading-space: var(
        --m3e-split-button-extra-small-trailing-button-selected-leading-space,
        0.8125rem
      );
      --m3e-icon-button-extra-small-default-trailing-space: var(
        --m3e-split-button-extra-small-trailing-button-selected-trailing-space,
        0.8125rem
      );
      --m3e-icon-button-small-default-leading-space: var(
        --m3e-split-button-small-trailing-button-selected-leading-space,
        0.8125rem
      );
      --m3e-icon-button-small-default-trailing-space: var(
        --m3e-split-button-small-trailing-button-selected-trailing-space,
        0.8125rem
      );
      --m3e-icon-button-medium-default-leading-space: var(
        --m3e-split-button-medium-trailing-button-selected-leading-space,
        0.9375rem
      );
      --m3e-icon-button-medium-default-trailing-space: var(
        --m3e-split-button-medium-trailing-button-selected-trailing-space,
        0.9375rem
      );
      --m3e-icon-button-large-default-leading-space: var(
        --m3e-split-button-large-trailing-button-selected-leading-space,
        1.8125rem
      );
      --m3e-icon-button-large-default-trailing-space: var(
        --m3e-split-button-large-trailing-button-selected-trailing-space,
        1.8125rem
      );
      --m3e-icon-button-extra-large-default-leading-space: var(
        --m3e-split-button-extra-large-trailing-button-selected-leading-space,
        2.6875rem
      );
      --m3e-icon-button-extra-large-default-trailing-space: var(
        --m3e-split-button-extra-large-trailing-button-selected-trailing-space,
        2.6875rem
      );
    }

    ::slotted([slot="leading-button"]:not(:hover)),
    ::slotted([slot="leading-button"]:disabled),
    ::slotted([slot="leading-button"][disabled-interactive]) {
      --m3e-connected-button-group-extra-small-inner-shape: var(
        --m3e-split-button-extra-small-inner-corner-size,
        ${DesignToken.shape.corner.extraSmall}
      );
      --m3e-connected-button-group-small-inner-shape: var(
        --m3e-split-button-small-inner-corner-size,
        ${DesignToken.shape.corner.extraSmall}
      );
      --m3e-connected-button-group-medium-inner-shape: var(
        --m3e-split-button-medium-inner-corner-size,
        ${DesignToken.shape.corner.extraSmall}
      );
      --m3e-connected-button-group-large-inner-shape: var(
        --m3e-split-button-large-inner-corner-size,
        ${DesignToken.shape.corner.small}
      );
      --m3e-connected-button-group-extra-large-inner-shape: var(
        --m3e-split-button-extra-large-inner-corner-size,
        ${DesignToken.shape.corner.medium}
      );
    }
    ::slotted([slot="leading-button"]:hover:not(:disabled):not([disabled-interactive])),
    ::slotted([slot="trailing-button"]:not([aria-expanded="true"]):hover:not(:disabled):not([disabled-interactive])) {
      --m3e-connected-button-group-extra-small-inner-shape: var(
        --m3e-split-button-extra-small-inner-corner-hover-size,
        ${DesignToken.shape.corner.small}
      );
      --m3e-connected-button-group-small-inner-shape: var(
        --m3e-split-button-small-inner-corner-hover-size,
        ${DesignToken.shape.corner.medium}
      );
      --m3e-connected-button-group-medium-inner-shape: var(
        --m3e-split-button-medium-inner-corner-hover-size,
        ${DesignToken.shape.corner.medium}
      );
      --m3e-connected-button-group-large-inner-shape: var(
        --m3e-split-button-large-inner-corner-hover-size,
        ${DesignToken.shape.corner.largeIncreased}
      );
      --m3e-connected-button-group-extra-large-inner-shape: var(
        --m3e-split-button-extra-large-inner-corner-hover-size,
        ${DesignToken.shape.corner.largeIncreased}
      );
    }

    ::slotted([slot="leading-button"]),
    ::slotted([slot="trailing-button"]) {
      --m3e-connected-button-group-extra-small-inner-pressed-shape: var(
        --m3e-split-button-extra-small-inner-corner-pressed-size,
        ${DesignToken.shape.corner.small}
      );
      --m3e-connected-button-group-small-inner-pressed-shape: var(
        --m3e-split-button-small-inner-corner-pressed-size,
        ${DesignToken.shape.corner.medium}
      );
      --m3e-connected-button-group-medium-inner-pressed-shape: var(
        --m3e-split-button-medium-inner-corner-pressed-size,
        ${DesignToken.shape.corner.medium}
      );
      --m3e-connected-button-group-large-inner-pressed-shape: var(
        --m3e-split-button-large-inner-corner-pressed-size,
        ${DesignToken.shape.corner.largeIncreased}
      );
      --m3e-connected-button-group-extra-large-inner-pressed-shape: var(
        --m3e-split-button-extra-large-inner-corner-pressed-size,
        ${DesignToken.shape.corner.largeIncreased}
      );
    }

    ::slotted([slot="trailing-button"]:not([aria-expanded="true"]):not(:hover)),
    ::slotted([slot="trailing-button"]:disabled),
    ::slotted([slot="trailing-button"][disabled-interactive]) {
      --m3e-connected-button-group-extra-small-inner-shape: var(
        --m3e-split-button-extra-small-inner-corner-size,
        ${DesignToken.shape.corner.extraSmall}
      );
      --m3e-connected-button-group-small-inner-shape: var(
        --m3e-split-button-small-inner-corner-size,
        ${DesignToken.shape.corner.extraSmall}
      );
      --m3e-connected-button-group-medium-inner-shape: var(
        --m3e-split-button-medium-inner-corner-size,
        ${DesignToken.shape.corner.extraSmall}
      );
      --m3e-connected-button-group-large-inner-shape: var(
        --m3e-split-button-large-inner-corner-size,
        ${DesignToken.shape.corner.small}
      );
      --m3e-connected-button-group-extra-large-inner-shape: var(
        --m3e-split-button-extra-large-inner-corner-size,
        ${DesignToken.shape.corner.medium}
      );
    }

    ::slotted([slot="trailing-button"][aria-expanded="true"]) {
      --_icon-button-icon-transform: rotate(180deg);
      --_button-rounded-start-shape: var(--_trailing-button-shape, ${DesignToken.shape.corner.full});
      --_button-rounded-end-shape: var(--_trailing-button-shape, ${DesignToken.shape.corner.full});
    }
    ::slotted([slot="trailing-button"]) {
      --_button-end-shape-pressed-morph: var(--_trailing-button-shape, ${DesignToken.shape.corner.full});
    }
    .base {
      --m3e-icon-button-extra-small-icon-size: calc(
        var(--m3e-spit-button-extra-small-trailing-button-icon-size, 1.375rem) + ${DesignToken.density.calc(0)}
      );
      --m3e-button-extra-small-icon-size: calc(
        var(--m3e-spit-button-extra-small-trailing-button-icon-size, 1.375rem) + ${DesignToken.density.calc(0)}
      );
      --m3e-icon-button-small-icon-size: calc(
        var(--m3e-spit-button-small-trailing-button-icon-size, 1.375rem) + ${DesignToken.density.calc(-1)}
      );
      --m3e-button-small-icon-size: calc(
        var(--m3e-spit-button-small-trailing-button-icon-size, 1.375rem) + ${DesignToken.density.calc(-1)}
      );
      --m3e-icon-button-medium-icon-size: calc(
        var(--m3e-spit-button-medium-trailing-button-icon-size, 1.625rem) + ${DesignToken.density.calc(-2)}
      );
      --m3e-button-medium-icon-size: calc(
        var(--m3e-spit-button-medium-trailing-button-icon-size, 1.625rem) + ${DesignToken.density.calc(-2)}
      );
      --m3e-icon-button-large-icon-size: calc(
        var(--m3e-spit-button-large-trailing-button-icon-size, 2.375rem) + ${DesignToken.density.calc(-3)}
      );
      --m3e-button-large-icon-size: calc(
        var(--m3e-spit-button-large-trailing-button-icon-size, 2.375rem) + ${DesignToken.density.calc(-3)}
      );
      --m3e-icon-button-extra-large-icon-size: calc(
        var(--m3e-spit-button-extra-large-trailing-button-icon-size, 3.125rem) + ${DesignToken.density.calc(-3)}
      );
      --m3e-button-extra-large-icon-size: calc(
        var(--m3e-spit-button-extra-large-trailing-button-icon-size, 3.125rem) + ${DesignToken.density.calc(-3)}
      );
    }
    :host([size="extra-small"]) .base {
      --m3e-connected-button-group-spacing: var(--m3e-split-button-extra-small-between-spacing, 0.125rem);
    }
    :host([size="small"]) .base {
      --m3e-connected-button-group-spacing: var(--m3e-split-button-small-between-spacing, 0.125rem);
    }
    :host([size="medium"]).base {
      --m3e-connected-button-group-spacing: var(--m3e-split-button-medium-between-spacing, 0.125rem);
    }
    :host([size="large"]) .base {
      --m3e-connected-button-group-spacing: var(--m3e-split-button-large-between-spacing, 0.125rem);
    }
    :host([size="extra-large"]) .base {
      --m3e-connected-button-group-spacing: var(--m3e-split-button-extra-large-between-spacing, 0.125rem);
    }
  `;

  @query(".base") private readonly _base?: HTMLElement;

  /** @private */ #leadingButton?: M3eButtonElement;
  /** @private */ #trailingButton?: M3eIconButtonElement;
  /** @private */ #trailingButtonHover = false;

  /** @private */ readonly #pressedController = new PressedController(this, {
    target: null,
    capture: true,
    isPressedKey: (key) => key === " " || key === "Enter",
    callback: (pressed, _, target) => {
      switch (target) {
        case this.#leadingButton:
          this.#updateLeadingButtonShape(pressed);
          break;
        case this.#trailingButton:
          this.#updateTrailingButtonShape(pressed || this.#trailingButtonHover);
          break;
      }
    },
  });

  /** @private */ readonly #hoverController = new HoverController(this, {
    target: null,
    callback: (hovering, target) => {
      switch (target) {
        case this.#trailingButton:
          if (!this.#trailingButton?.disabled && !this.#trailingButton?.disabledInteractive) {
            this.#trailingButtonHover = hovering;
            this.#updateTrailingButtonShape(hovering);
          }
          break;
      }
    },
  });

  /**
   * The appearance variant of the button.
   * @default "filled"
   */
  @property({ reflect: true }) variant: SplitButtonVariant = "filled";

  /**
   * The size of the button.
   * @default "small"
   */
  @property({ reflect: true }) size: ButtonSize = "small";

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("variant")) {
      this.#updateButtons();
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<m3e-button-group class="base" disable-role variant="connected" size="${this.size}">
      <slot name="leading-button" @slotchange="${this.#handleLeadingSlotChange}"></slot>
      <slot name="trailing-button" @slotchange="${this.#handleTrailingSlotChange}"></slot>
    </m3e-button-group>`;
  }

  /** @private */
  #handleLeadingSlotChange(e: Event): void {
    if (this.#leadingButton) {
      this.#pressedController.unobserve(this.#leadingButton);
    }

    this.#leadingButton = (<HTMLSlotElement>e.target)
      .assignedElements({ flatten: true })
      .find((x) => x instanceof M3eButtonElement);

    if (this.#leadingButton) {
      this.#pressedController.observe(this.#leadingButton);
    }

    this.#updateButtons();
  }

  /** @private */
  #handleTrailingSlotChange(e: Event): void {
    if (this.#trailingButton) {
      this.#pressedController.unobserve(this.#trailingButton);
      this.#hoverController.unobserve(this.#trailingButton);
    }

    this.#trailingButton = (<HTMLSlotElement>e.target)
      .assignedElements({ flatten: true })
      .find((x) => x instanceof M3eIconButtonElement);

    if (this.#trailingButton) {
      this.#pressedController.observe(this.#trailingButton);
      this.#hoverController.observe(this.#trailingButton);
    }

    this.#updateButtons();
  }

  /** @private */
  #updateButtons(): void {
    if (this.#leadingButton) {
      this.#leadingButton.variant = this.variant;
      this.#leadingButton.size = this.size;
      this.#leadingButton.shape = "rounded";
    }

    if (this.#trailingButton) {
      this.#trailingButton.width = "default";
      this.#trailingButton.shape = "rounded";
      this.#trailingButton.setAttribute("variant", this.variant);
      this.#trailingButton.size = this.size;
    }
  }

  /** @private */
  #updateLeadingButtonShape(update: boolean): void {
    if (update && this.#leadingButton) {
      this.#updateButtonShape(this.#leadingButton, "--_leading-button-shape");
    } else {
      this._base?.style.removeProperty("--_leading-button-shape");
    }
  }

  /** @private */
  #updateTrailingButtonShape(update: boolean): void {
    if (update && this.#trailingButton) {
      this.#updateButtonShape(this.#trailingButton, "--_trailing-button-shape");
    } else {
      this._base?.style.removeProperty("--_trailing-button-shape");
    }
  }

  /** @private */
  #updateButtonShape(button: HTMLElement, property: string): void {
    const adjustedShape = button.clientHeight / 2;
    if (adjustedShape) {
      this._base?.style.setProperty(property, `${adjustedShape}px`);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-split-button": M3eSplitButtonElement;
  }
}
