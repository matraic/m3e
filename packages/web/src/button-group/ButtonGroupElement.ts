import { css, CSSResultGroup, html, LitElement, PropertyValues } from "lit";
import { customElement, property, query, queryAssignedElements } from "lit/decorators.js";

import { PressedController, Role, isSelectedMixin, DesignToken } from "@m3e/web/core";
import { M3eButtonElement } from "@m3e/web/button";
import { M3eIconButtonElement } from "@m3e/web/icon-button";

import { ButtonGroupVariant } from "./ButtonGroupVariant";
import { ButtonGroupSize } from "./ButtonGroupSize";

/**
 * Organizes buttons and adds interactions between them.
 *
 * @description
 * The `m3e-button-group` component arranges multiple buttons into a unified, expressive layout,
 * supporting both `standard` and `connected` variants. It enables seamless, accessible grouping
 * of actions, adapts to various sizes, and ensures consistent spacing, shape, and alignment.
 * Designed according to Material 3 principles, it empowers users to interact with related actions
 * in a visually harmonious and intuitive way.
 *
 * @example
 * The following example illustrates a standard button group.
 * ``` html
 * <m3e-button-group>
 *  <m3e-icon-button variant="tonal" toggle><m3e-icon name="format_bold"></m3e-icon></m3e-icon-button>
 *  <m3e-icon-button variant="tonal" toggle><m3e-icon name="format_italic"></m3e-icon></m3e-icon-button>
 *  <m3e-icon-button variant="tonal" toggle><m3e-icon name="format_underlined"></m3e-icon></m3e-icon-button>
 * </m3e-button-group>
 * ```
 * @example
 * The next example illustrates a connected button group.
 * ```html
 * <m3e-button-group variant="connected">
 *  <m3e-button variant="tonal" shape="square" toggle>Start</m3e-button>
 *  <m3e-button variant="tonal" shape="square" toggle>Directions</m3e-button>
 *  <m3e-button variant="tonal" shape="square" toggle>Share</m3e-button>
 * </m3e-button-group>
 * ```
 *
 * @tag m3e-button-group
 *
 * @slot - Renders the buttons of the group.
 *
 * @attr multi - Whether multiple toggle buttons can be selected.
 * @attr size - The size of the group.
 * @attr variant - The appearance variant of the group.
 *
 * @cssprop --m3e-standard-button-group-extra-small-spacing - Spacing between buttons in standard variant, extra-small size.
 * @cssprop --m3e-standard-button-group-small-spacing - Spacing between buttons in standard variant, small size.
 * @cssprop --m3e-standard-button-group-medium-spacing - Spacing between buttons in standard variant, medium size.
 * @cssprop --m3e-standard-button-group-large-spacing - Spacing between buttons in standard variant, large size.
 * @cssprop --m3e-standard-button-group-extra-large-spacing - Spacing between buttons in standard variant, extra-large size.
 * @cssprop --m3e-connected-button-group-spacing - Spacing between buttons in connected variant.
 * @cssprop --m3e-connected-button-group-extra-small-inner-shape - Corner shape for connected variant, extra-small size.
 * @cssprop --m3e-connected-button-group-extra-small-inner-pressed-shape - Pressed corner shape for connected variant, extra-small size.
 * @cssprop --m3e-connected-button-group-small-inner-shape - Corner shape for connected variant, small size.
 * @cssprop --m3e-connected-button-group-small-inner-pressed-shape - Pressed corner shape for connected variant, small size.
 * @cssprop --m3e-connected-button-group-medium-inner-shape - Corner shape for connected variant, medium size.
 * @cssprop --m3e-connected-button-group-medium-inner-pressed-shape - Pressed corner shape for connected variant, medium size.
 * @cssprop --m3e-connected-button-group-large-inner-shape - Corner shape for connected variant, large size.
 * @cssprop --m3e-connected-button-group-large-inner-pressed-shape - Pressed corner shape for connected variant, large size.
 * @cssprop --m3e-connected-button-group-extra-large-inner-shape - Corner shape for connected variant, extra-large size.
 * @cssprop --m3e-connected-button-group-extra-large-inner-pressed-shape - Pressed corner shape for connected variant, extra-large size.
 */
@customElement("m3e-button-group")
export class M3eButtonGroupElement extends Role(LitElement, "group") {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: flex;
      vertical-align: middle;
      flex-wrap: nowrap;
      align-items: center;
    }
    .base {
      display: flex;
      vertical-align: middle;
      flex-wrap: nowrap;
      align-items: center;
    }
    :host([variant="standard"]) {
      justify-content: center;
    }
    :host([variant="connected"]) .base {
      flex: 1 1 auto;
    }
    :host([variant="standard"]) .base {
      width: fit-content;
      flex: none;
    }
    :host([variant="standard"]) .base.pressed {
      justify-content: space-between;
      width: var(--_button-group-width);
    }
    :host([variant="standard"][size="extra-small"]) .base {
      column-gap: var(--m3e-standard-button-group-extra-small-spacing, 1.125rem);
    }
    :host([variant="standard"][size="small"]) .base {
      column-gap: var(--m3e-standard-button-group-small-spacing, 0.75rem);
    }
    :host([variant="standard"][size="medium"]).base {
      column-gap: var(--m3e-standard-button-group-medium-spacing, 0.5rem);
    }
    :host([variant="standard"][size="large"]) .base {
      column-gap: var(--m3e-standard-button-group-large-spacing, 0.5rem);
    }
    :host([variant="standard"][size="extra-large"]) .base {
      column-gap: var(--m3e-standard-button-group-extra-large-spacing, 0.5rem);
    }
    :host([variant="connected"]) .base {
      column-gap: var(--m3e-connected-button-group-spacing, 0.125rem);
    }
    :host([variant="connected"][size="extra-small"]) ::slotted(.-first[size="extra-small"]),
    :host([variant="connected"][size="extra-small"]) ::slotted(:not(.-first):not(.-last)[size="extra-small"]) {
      --_button-rounded-end-shape: var(
        --m3e-connected-button-group-extra-small-inner-shape,
        ${DesignToken.shape.corner.small}
      );
      --_button-square-end-shape: var(
        --m3e-connected-button-group-extra-small-inner-shape,
        ${DesignToken.shape.corner.small}
      );
      --_button-square-end-pressed-shape: var(
        --m3e-connected-button-group-extra-small-inner-pressed-shape,
        ${DesignToken.shape.corner.extraSmall}
      );
    }
    :host([variant="connected"][size="extra-small"]) ::slotted(.-last[size="extra-small"]),
    :host([variant="connected"][size="extra-small"]) ::slotted(:not(.-first):not(.-last)[size="extra-small"]) {
      --_button-rounded-start-shape: var(
        --m3e-connected-button-group-extra-small-inner-shape,
        ${DesignToken.shape.corner.small}
      );
      --_button-square-start-shape: var(
        --m3e-connected-button-group-extra-small-inner-shape,
        ${DesignToken.shape.corner.small}
      );
      --_button-square-start-pressed-shape: var(
        --m3e-connected-button-group-extra-small-inner-pressed-shape,
        ${DesignToken.shape.corner.extraSmall}
      );
    }
    :host([variant="connected"][size="small"]) ::slotted(.-first[size="small"]),
    :host([variant="connected"][size="small"]) ::slotted(:not(.-first):not(.-last)[size="small"]) {
      --_button-rounded-end-shape: var(
        --m3e-connected-button-group-small-inner-shape,
        ${DesignToken.shape.corner.small}
      );
      --_button-square-end-shape: var(
        --m3e-connected-button-group-small-inner-shape,
        ${DesignToken.shape.corner.small}
      );
      --_button-end-shape-pressed-morph: var(
        --m3e-connected-button-group-small-inner-pressed-shape,
        ${DesignToken.shape.corner.extraSmall}
      );
    }
    :host([variant="connected"][size="small"]) ::slotted(.-last[size="small"]),
    :host([variant="connected"][size="small"]) ::slotted(:not(.-first):not(.-last)[size="small"]) {
      --_button-rounded-start-shape: var(
        --m3e-connected-button-group-small-inner-shape,
        ${DesignToken.shape.corner.small}
      );
      --_button-square-start-shape: var(
        --m3e-connected-button-group-small-inner-shape,
        ${DesignToken.shape.corner.small}
      );
      --_button-start-shape-pressed-morph: var(
        --m3e-connected-button-group-small-inner-pressed-shape,
        ${DesignToken.shape.corner.extraSmall}
      );
    }
    :host([variant="connected"][size="medium"]) ::slotted(.-first[size="medium"]),
    :host([variant="connected"][size="medium"]) ::slotted(:not(.-first):not(.-last)[size="medium"]) {
      --_button-rounded-end-shape: var(
        --m3e-connected-button-group-medium-inner-shape,
        ${DesignToken.shape.corner.small}
      );
      --_button-square-end-shape: var(
        --m3e-connected-button-group-medium-inner-shape,
        ${DesignToken.shape.corner.small}
      );
      --_button-square-end-pressed-shape: var(
        --m3e-connected-button-group-medium-inner-pressed-shape,
        ${DesignToken.shape.corner.extraSmall}
      );
    }
    :host([variant="connected"][size="medium"]) ::slotted(.-last[size="medium"]),
    :host([variant="connected"][size="medium"]) ::slotted(:not(.-first):not(.-last)[size="medium"]) {
      --_button-rounded-start-shape: var(
        --m3e-connected-button-group-medium-inner-shape,
        ${DesignToken.shape.corner.small}
      );
      --_button-square-start-shape: var(
        --m3e-connected-button-group-medium-inner-shape,
        ${DesignToken.shape.corner.small}
      );
      --_button-square-start-pressed-shape: var(
        --m3e-connected-button-group-medium-inner-pressed-shape,
        ${DesignToken.shape.corner.extraSmall}
      );
    }
    :host([variant="connected"][size="large"]) ::slotted(.-first[size="large"]),
    :host([variant="connected"][size="large"]) ::slotted(:not(.-first):not(.-last)[size="large"]) {
      --_button-rounded-end-shape: var(
        --m3e-connected-button-group-large-inner-shape,
        ${DesignToken.shape.corner.large}
      );
      --_button-square-end-shape: var(
        --m3e-connected-button-group-large-inner-shape,
        ${DesignToken.shape.corner.large}
      );
      --_button-square-end-pressed-shape: var(
        --m3e-connected-button-group-large-inner-pressed-shape,
        ${DesignToken.shape.corner.medium}
      );
    }
    :host([variant="connected"][size="large"]) ::slotted(.-last[size="large"]),
    :host([variant="connected"][size="large"]) ::slotted(:not(.-first):not(.-last)[size="large"]) {
      --_button-rounded-start-shape: var(
        --m3e-connected-button-group-large-inner-shape,
        ${DesignToken.shape.corner.large}
      );
      --_button-square-start-shape: var(
        --m3e-connected-button-group-large-inner-shape,
        ${DesignToken.shape.corner.large}
      );
      --_button-square-start-pressed-shape: var(
        --m3e-connected-button-group-large-inner-pressed-shape,
        ${DesignToken.shape.corner.medium}
      );
    }
    :host([variant="connected"][size="extra-large"]) ::slotted(.-first[size="extra-large"]),
    :host([variant="connected"][size="extra-large"]) ::slotted(:not(.-first):not(.-last)[size="extra-large"]) {
      --_button-rounded-end-shape: var(
        --m3e-connected-button-group-extra-large-inner-shape,
        ${DesignToken.shape.corner.largeIncreased}
      );
      --_button-square-end-shape: var(
        --m3e-connected-button-group-extra-large-inner-shape,
        ${DesignToken.shape.corner.largeIncreased}
      );
      --_button-square-end-pressed-shape: var(
        --m3e-connected-button-group-extra-large-inner-pressed-shape,
        ${DesignToken.shape.corner.large}
      );
    }
    :host([variant="connected"][size="extra-large"]) ::slotted(.-last[size="extra-large"]),
    :host([variant="connected"][size="extra-large"]) ::slotted(:not(.-first):not(.-last)[size="extra-large"]) {
      --_button-rounded-start-shape: var(
        --m3e-connected-button-group-extra-large-inner-shape,
        ${DesignToken.shape.corner.largeIncreased}
      );
      --_button-square-start-shape: var(
        --m3e-connected-button-group-extra-large-inner-shape,
        ${DesignToken.shape.corner.largeIncreased}
      );
      --_button-square-start-pressed-shape: var(
        --m3e-connected-button-group-extra-large-inner-pressed-shape,
        ${DesignToken.shape.corner.large}
      );
    }
  `;

  /** @private */ readonly #pressedController = new PressedController(this, {
    target: null,
    capture: true,
    minPressedDuration: 150,
    isPressedKey: (key) => key === " ",
    callback: (pressed) => {
      if (!this._base) return;
      if (!pressed || this.variant === "connected") {
        this._base.style.removeProperty("--_button-group-width");
        this._base.classList.remove("pressed");
      } else {
        this._base.classList.add("pressed");
        this._base.style.setProperty("--_button-group-width", `${this._base.getBoundingClientRect().width}px`);
      }
    },
  });

  @query(".base") private readonly _base?: HTMLElement;

  /**
   * The appearance variant of the group.
   * @default "standard"
   */
  @property({ reflect: true }) variant: ButtonGroupVariant = "standard";

  /**
   * The size of the group.
   * @default "small"
   */
  @property({ reflect: true }) size: ButtonGroupSize = "small";

  /**
   * Whether multiple toggle buttons can be selected.
   * @default false
   */
  @property({ type: Boolean }) multi = false;

  /** The buttons contained by the group. */
  @queryAssignedElements({ slot: "", selector: "m3e-button,m3e-icon-button", flatten: true })
  readonly buttons!: ReadonlyArray<M3eButtonElement | M3eIconButtonElement>;

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();

    if (this.hasAttribute("disable-role")) {
      this.role = null;
    }
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._base?.style.removeProperty("--_button-group-width");
    this._base?.classList.remove("pressed");
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("multi") || changedProperties.has("variant")) {
      this.#updateButtons();
    }
    if (changedProperties.has("variant")) {
      this._base?.style.removeProperty("--_button-group-width");
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="base">
      <slot @slotchange="${this.#updateButtons}" @change="${this.#handleChange}"></slot>
    </div>`;
  }

  /** @private */
  #updateButtons(): void {
    const buttons = this.buttons;
    for (const target of this.#pressedController.targets) {
      this.#pressedController.unobserve(target);
    }
    const canToggle = [...buttons].some((x) => x.toggle);

    // disable-role is an internal attribute to by split-button to disable setting roles.
    if (!this.hasAttribute("disable-role")) {
      this.role = canToggle && !this.multi ? "radiogroup" : "group";
    }

    const buttonRole = this.role === "radiogroup" ? "radio" : "button";

    buttons.forEach((button, i) => {
      this.#pressedController.observe(button);
      button.classList.toggle("-connected", this.variant === "connected");
      button.classList.add("-grouped");
      button.classList.toggle("-first", i == 0);
      button.classList.toggle("-last", i == buttons.length - 1);

      if (!this.hasAttribute("disable-role") && button.role !== buttonRole && button.toggle) {
        const checked = !button.toggle ? null : button.selected ? "true" : "false";
        button.role = buttonRole;
        if (button.role === "button") {
          button.ariaPressed = checked;
          button.ariaChecked = null;
        } else {
          button.ariaChecked = checked;
          button.ariaPressed = null;
        }
      }
    });
  }

  /** @private */
  #handleChange(e: Event): void {
    if (this.multi || !(e.target instanceof HTMLElement)) return;
    if (e.target.tagName === "M3E-BUTTON" || e.target.tagName === "M3E-ICON-BUTTON") {
      if (!isSelectedMixin(e.target) || !e.target.selected) {
        return;
      }

      for (const button of this.buttons) {
        if (button === e.target || !button.selected) continue;
        button.selected = false;
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-button-group": M3eButtonGroupElement;
  }
}
