import { css, CSSResultGroup, html, LitElement, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";

import {
  argbFromHex,
  CorePalette,
  DynamicColor,
  DynamicScheme,
  hexFromArgb,
  MaterialDynamicColors,
} from "@material/material-color-utilities";

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
 *  <m3e-theme color="#7D67BE" scheme="auto" motion="expressive" strong-focus>
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
   * @default "#7D67BE"
   */
  @property() color = "#7D67BE";
  /**
   * The color variant of the theme.
   * @default "vibrant"
   */
  @property() variant: ThemeVariant = "vibrant";

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
  #apply(): void {
    const color = argbFromHex(this.color);
    const palette = CorePalette.of(color);
    const scheme = new DynamicScheme({
      sourceColorArgb: color,
      variant: this.#getVariant(),
      contrastLevel: this.#getContrastLevel(),
      isDark: this.isDark,
      primaryPalette: palette.a1,
      secondaryPalette: palette.a2,
      tertiaryPalette: palette.a3,
      neutralPalette: palette.n1,
      neutralVariantPalette: palette.n2,
    });

    let css = "";

    for (const key in MaterialDynamicColors) {
      if (!key.endsWith("PaletteKeyColor")) {
        const dynamicColor: unknown = MaterialDynamicColors[key as keyof MaterialDynamicColors];
        if (dynamicColor instanceof DynamicColor) {
          css += `--md-sys-color-${key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}: ${hexFromArgb(
            dynamicColor.getArgb(scheme)
          )};`;
        }
      }
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
    css += `--m3e-scrollbar-thumb-color: ${hexFromArgb(palette.n1.tone(60))};`;
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
  #getVariant(): number {
    switch (this.variant) {
      case "monochrome":
        return 0;
      case "neutral":
        return 1;
      case "tonal-spot":
        return 2;
      case "vibrant":
        return 3;
      case "expressive":
        return 4;
      case "fidelity":
        return 5;
      case "rainbow":
        return 7;
      case "fruit-salad":
        return 8;
      default: // content
        return 6;
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
