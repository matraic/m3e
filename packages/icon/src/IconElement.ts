import { css, CSSResultGroup, html, LitElement, PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import { Role } from "@m3e/core";

import { IconVariant } from "./IconVariant";
import { IconGrade } from "./IconGrade";

/**
 * A small symbol used to easily identify an action or category.
 *
 * @description
 * The `m3e-icon` component makes it easier to use Material Symbols in your application. Material Symbols are Google's newest icons supporting
 * a range of design variants. For more information, see:
 * - {@link https://developers.google.com/fonts/docs/material_symbols|Material Symbol Guide}
 * - {@link https://fonts.google.com/icons|Material Symbol Library}
 *
 * The Material Symbols font is the easiest way to incorporate Material Symbols into your application. Using the
 * {@link https://developers.google.com/fonts/docs/css2#forming_api_urls|Fonts CSS API}, you can use variable fonts to optimize icon
 * usage within your application. See {@link https://caniuse.com/variable-fonts|Can I Use's Variable Fonts} to determine whether
 * your user's browser support variable fonts.
 *
 * @example
 * The following example illustrates showing the `home` icon. The `name` attribute specifies the icon to present.
 * ```html
 * <m3e-icon name="home"></m3e-icon>
 * ```
 * @example
 * The next example illustrates a link used to download a variable font for outlined icons with fill support.
 * ```html
 * <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0" rel="stylesheet"/>
 * ```
 *
 * @tag m3e-icon
 *
 * @attr filled - Whether the icon is filled.
 * @attr grade - The grade of the icon.
 * @attr optical-size - A value from 20 to 48 indicating the optical size of the icon.
 * @attr name - The name of the icon.
 * @attr variant - The appearance variant of the icon.
 * @attr weight - A value from 100 to 700 indicating the weight of the icon.
 */
@customElement("m3e-icon")
export class M3eIconElement extends Role(LitElement, "img") {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-block;
      user-select: none;
      font-size: var(--m3e-icon-size, 1.5rem);
      width: 1em;
      vertical-align: middle;
      overflow: hidden;
    }
    .icon {
      font-weight: normal;
      font-style: normal;
      line-height: 1;
      letter-spacing: normal;
      text-transform: none;
      white-space: nowrap;
      word-wrap: normal;
      direction: ltr;
      font-feature-settings: "liga";
      -webkit-font-smoothing: antialiased;
      width: inherit;
      height: inherit;
      vertical-align: inherit;
      font-variation-settings:
        "FILL" var(--_icon-fill, 0),
        "wght" var(--_icon-weight, 400),
        "GRAD" var(--_icon-grade, 0),
        "opsz" var(--_icon-optical-size, 24);
    }
    :host([variant="outlined"]) .icon {
      font-family: "Material Symbols Outlined";
    }
    :host([variant="rounded"]) .icon {
      font-family: "Material Symbols Rounded";
    }
    :host([variant="sharp"]) .icon {
      font-family: "Material Symbols Sharp";
    }
  `;

  /** @private */ @query(".icon") private readonly _icon?: HTMLSpanElement;

  /** The name of the icon. */
  @property() name: string = "";

  /**
   * The appearance variant of the icon.
   * @default "outlined"
   */
  @property({ reflect: true }) variant: IconVariant = "outlined";

  /**
   * Whether the icon is filled.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) filled = false;

  /**
   * The grade of the icon.
   * @default "medium"
   */
  @property() grade: IconGrade = "medium";

  /**
   * A value from 100 to 700 indicating the weight of the icon.
   * @default 400
   */
  @property({ type: Number }) weight = 400;

  /**
   * A value from 20 to 48 indicating the optical size of the icon.
   * @default 24
   */
  @property({ attribute: "optical-size", type: Number }) opticalSize = 24;

  /** @inheritdoc */
  override connectedCallback(): void {
    if (
      !this.hasAttribute("aria-label") &&
      !this.hasAttribute("aria-labelledby") &&
      !this.hasAttribute("aria-hidden")
    ) {
      this.ariaHidden = "true";
    }

    super.connectedCallback();
  }

  /** @inheritdoc */
  protected override updated(_changedProperties: PropertyValues<this>): void {
    super.updated(_changedProperties);

    if (_changedProperties.has("filled")) {
      this._icon?.style.setProperty("--_icon-fill", this.filled ? "1" : "0");
    }
    if (_changedProperties.has("grade")) {
      this._icon?.style.setProperty(
        "--_icon-grade",
        this.grade === "low" ? "-25" : this.grade === "high" ? "200" : "0"
      );
    }
    if (_changedProperties.has("weight")) {
      this._icon?.style.setProperty("--_icon-weight", `${this.weight}`);
    }
    if (_changedProperties.has("opticalSize")) {
      this._icon?.style.setProperty("--_icon-optical-size", `${this.opticalSize}`);
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="icon" aria-hidden="true">${this.name}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-icon": M3eIconElement;
  }
}
