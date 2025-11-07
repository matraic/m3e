import { css, CSSResultGroup, html, LitElement, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";

import {
  argbFromHex,
  DynamicScheme,
  Hct,
  hexFromArgb,
  MaterialDynamicColors,
  Platform,
  SpecVersion,
  Variant,
} from "@materialx/material-color-utilities";

import { DesignToken } from "@m3e/core";

import { ColorScheme } from "./ColorScheme";
import { ContrastLevel } from "./ContrastLevel";
import { ThemeVariant } from "./ThemeVariant";
import { MotionScheme } from "./MotionScheme";

/**
 * A non-visual element responsible for application-level theming.
 *
 * @description
 * The `m3e-theme` component is a non-visual element used to apply dynamic color, expressive motion, density, and strong focus indicators
 * to nested, theme-aware elements.
 *
 * When `m3e-theme` is nested directly beneath the `<body>` of a document, the `<body>`'s `background-color` is set to the computed
 * value of `--md-sys-color-background` and `color` is set to the computed value of `--md-sys-color-on-background`. In addition,
 * the document's `scrollbar-color` is set to the computed values of `--m3e-scrollbar-thumb-color` and `--m3e-scrollbar-track-color` which,
 * when supported, cascades to all viewport scrollbars.
 *
 * @example
 * The following example adds a top-level `m3e-theme` directly beneath a document's `<body>` element to
 * apply application-level theming.  In this example, `color` and `scheme` are used to create a dynamic color
 * palette which automatically adjusts to a user's light or dark color preference. In addition, expressive motion
 * and strong focus indicators are enabled.
 *
 * ```html
 * <body>
 *  <m3e-theme color="#6750A4" scheme="auto" motion="expressive" strong-focus>
 *      <!-- Normal body content here. -->
 *  </m3e-theme>
 * <body/>
 * ```
 * @tag m3e-theme
 *
 * @attr color - The hex color from which to derive dynamic color palettes.
 * @attr contrast - The contrast level of the theme.
 * @attr density - The density scale (0, -1, -2).
 * @attr scheme - The color scheme of the theme.
 * @attr strong-focus - Whether to enable strong focus indicators.
 * @attr variant - The color variant of the theme.
 *
 * @fires change - Dispatched when the theme changes.
 */
@customElement("m3e-theme")
export class M3eThemeElement extends LitElement {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: contents;
      font-size: ${DesignToken.typescale.standard.body.large.fontSize};
      font-weight: ${DesignToken.typescale.standard.body.large.fontWeight};
      line-height: ${DesignToken.typescale.standard.body.large.lineHeight};
      letter-spacing: ${DesignToken.typescale.standard.body.large.tracking};
    }
  `;

  /** @private */ #styleSheet = new CSSStyleSheet();
  /** @private */ #firstUpdated = false;
  /** @private */ #light?: MediaQueryList;
  /** @private */ #dark?: MediaQueryList;
  /** @private */ #forcedColor?: MediaQueryList;

  /** @private */ readonly #colorSchemeChangeHandler = () => this.#apply();

  /**
   * The hex color from which to derive dynamic color palettes.
   * @default "#6750A4"
   */
  @property() color = "#6750A4";

  /**
   * The color variant of the theme.
   * @default "content"
   */
  @property() variant: ThemeVariant = "content";

  /**
   * The color scheme of the theme.
   * @default "auto"
   */
  @property() scheme: ColorScheme = "auto";

  /**
   * The contrast level of the theme.
   * @default "standard"
   */
  @property() contrast: ContrastLevel = "standard";

  /**
   * Whether to enable strong focus indicators.
   * @default false
   */
  @property({ attribute: "strong-focus", type: Boolean }) strongFocus = false;

  /**
   * The density scale (0, -1, -2).
   * @default 0
   */
  @property({ type: Number }) density = 0;

  /** The motion scheme.
   * @default "standard"
   */
  @property() motion: MotionScheme = "standard";

  /** Whether a dark theme is applied. */
  get isDark(): boolean {
    switch (this.scheme) {
      case "light":
        return false;
      case "dark":
        return true;
      default: // auto
        return this.#dark?.matches ?? false;
    }
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();

    if (this.shadowRoot && !this.shadowRoot.adoptedStyleSheets.includes(this.#styleSheet)) {
      this.shadowRoot.adoptedStyleSheets = [...this.shadowRoot.adoptedStyleSheets, this.#styleSheet];
    }

    this.#light = matchMedia("(prefers-color-scheme: light)");
    this.#dark = matchMedia("(prefers-color-scheme: dark)");
    this.#forcedColor = matchMedia("(forced-colors: active)");

    [this.#light, this.#dark, this.#forcedColor].forEach((x) =>
      x.addEventListener("change", this.#colorSchemeChangeHandler)
    );
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    [this.#light, this.#dark, this.#forcedColor].forEach((x) =>
      x?.removeEventListener("change", this.#colorSchemeChangeHandler)
    );
    this.#light = this.#dark = this.#forcedColor = undefined;
  }

  /** @inheritdoc */
  protected override updated(_changedProperties: PropertyValues<this>): void {
    super.updated(_changedProperties);
    this.#apply();
  }

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    this.#firstUpdated = true;
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<slot></slot>`;
  }

  /** @private */
  #createScheme(sourceColor: Hct): DynamicScheme {
    let variant: Variant = Variant.CONTENT;

    switch (this.variant) {
      case "expressive":
        variant = Variant.EXPRESSIVE;
        break;
      case "fidelity":
        variant = Variant.FIDELITY;
        break;
      case "fruit-salad":
        variant = Variant.FRUIT_SALAD;
        break;
      case "monochrome":
        variant = Variant.MONOCHROME;
        break;
      case "neutral":
        variant = Variant.NEUTRAL;
        break;
      case "rainbow":
        variant = Variant.RAINBOW;
        break;
      case "tonal-spot":
        variant = Variant.TONAL_SPOT;
        break;
      case "vibrant":
        variant = Variant.VIBRANT;
        break;
    }

    return DynamicScheme.from({
      sourceColorHct: sourceColor,
      isDark: this.isDark,
      contrastLevel: this.#getContrastLevel(),
      variant: variant,
      specVersion: SpecVersion.SPEC_2025,
      platform: Platform.PHONE,
    });
  }

  /** @private */
  #apply(): void {
    const color = argbFromHex(this.color);
    const scheme = this.#createScheme(Hct.fromInt(color));

    let css = "";

    for (const dynamicColor of new MaterialDynamicColors().allDynamicColors.filter(
      (x) => !x.name.includes("palette")
    )) {
      css += `--md-sys-color-${dynamicColor.name.replace(/_/g, "-").toLowerCase()}: ${hexFromArgb(
        dynamicColor.getArgb(scheme)
      )};`;
    }

    if (this.motion === "expressive") {
      css += "--md-sys-motion-spring-fast-spatial: 350ms cubic-bezier(0.42, 1.67, 0.21, 0.90);";
      css += "--md-sys-motion-spring-default-spatial: 500ms cubic-bezier(0.38, 1.21, 0.22, 1.00);";
      css += "--md-sys-motion-spring-slow-spatial: 650ms cubic-bezier(0.39, 1.29, 0.35, 0.98);";
      css += "--md-sys-motion-spring-fast-effects: 150ms cubic-bezier(0.31, 0.94, 0.34, 1.00);";
      css += "--md-sys-motion-spring-default-effects: 200ms cubic-bezier(0.34, 0.80, 0.34, 1.00);";
      css += "--md-sys-motion-spring-slow-effects: 300ms cubic-bezier(0.34, 0.88, 0.34, 1.00);";
    }

    css += `--md-sys-density-scale: ${this.density};`;
    css += `--m3e-scrollbar-thumb-color: ${hexFromArgb(scheme.neutralPalette.tone(60))};`;
    css += `--m3e-focus-ring-visibility: ${this.strongFocus ? "visible" : "hidden"};`;

    this.#styleSheet.replaceSync(`:host { ${css} }`);

    if (this.parentElement instanceof HTMLBodyElement) {
      const computedStyle = getComputedStyle(this);

      if (this.#forcedColor?.matches) {
        this.parentElement.style.backgroundColor =
          this.parentElement.style.color =
          this.parentElement.ownerDocument.documentElement.style.scrollbarColor =
          this.parentElement.style.scrollbarColor =
            "";
      } else {
        this.parentElement.style.backgroundColor = computedStyle.getPropertyValue("--md-sys-color-background");
        this.parentElement.style.color = computedStyle.getPropertyValue("--md-sys-color-on-background");

        this.parentElement.ownerDocument.documentElement.style.scrollbarColor =
          this.parentElement.style.scrollbarColor = `${computedStyle.getPropertyValue(
            "--m3e-scrollbar-thumb-color"
          )} ${computedStyle.getPropertyValue("--m3e-scrollbar-track-color")}`;
      }
    }

    if (this.#firstUpdated) {
      this.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  /** @private */
  #getContrastLevel(): number {
    switch (this.contrast) {
      case "high":
        return 1;
      case "medium":
        return 0.5;
      default: // standard
        return 0;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-theme": M3eThemeElement;
  }
}
