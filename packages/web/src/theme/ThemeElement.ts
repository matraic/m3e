import { css, CSSResult, CSSResultGroup, html, LitElement, PropertyValues, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";

import {
  argbFromHex,
  DynamicScheme,
  Hct,
  hexFromArgb,
  MaterialDynamicColors,
  themeFromSourceColor,
} from "@material/material-color-utilities";

import { customElement, DesignToken, registerStyleSheet } from "@m3e/web/core";

import { ColorScheme } from "./ColorScheme";
import { ContrastLevel } from "./ContrastLevel";
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
 * @slot - Renders content styled by the theme.
 *
 * @attr color - The hex color from which to derive dynamic color palettes.
 * @attr contrast - The contrast level of the theme.
 * @attr density - The density scale (0, -1, -2).
 * @attr scheme - The color scheme of the theme.
 * @attr strong-focus - Whether to enable strong focus indicators.
 *
 * @fires change - Dispatched when the theme changes.
 */
@customElement("m3e-theme")
export class M3eThemeElement extends LitElement {
  static {
    if (typeof window !== "undefined") {
      const composeCss = (token: Record<string, CSSResult>): string => {
        let css = "";
        for (const key in token) {
          const cssVar = token[key].toString();
          if (!cssVar.startsWith("var(")) continue;
          const inner = cssVar.trim().slice(4, -1); // remove "var(" and ")"
          const [prop, fallback] = inner.split(/,(.+)/).map((s) => s.trim());

          if (!prop.startsWith("--") || !fallback) continue;
          css += `${prop}:${fallback};`;
        }

        return css;
      };

      const omitKey = <T extends object, K extends keyof T>(obj: T, key: K): Omit<T, K> => {
        const { [key]: _unused, ...rest } = obj;
        void _unused;
        return rest as Omit<T, K>;
      };

      let css = "";
      css += composeCss(DesignToken.typescale.standard.display.large);
      css += composeCss(DesignToken.typescale.standard.display.medium);
      css += composeCss(DesignToken.typescale.standard.display.small);
      css += composeCss(DesignToken.typescale.standard.headline.large);
      css += composeCss(DesignToken.typescale.standard.headline.medium);
      css += composeCss(DesignToken.typescale.standard.headline.small);
      css += composeCss(DesignToken.typescale.standard.title.large);
      css += composeCss(DesignToken.typescale.standard.title.medium);
      css += composeCss(DesignToken.typescale.standard.title.small);
      css += composeCss(DesignToken.typescale.standard.label.large);
      css += composeCss(DesignToken.typescale.standard.label.medium);
      css += composeCss(DesignToken.typescale.standard.label.small);
      css += composeCss(DesignToken.typescale.standard.body.large);
      css += composeCss(DesignToken.typescale.standard.body.medium);
      css += composeCss(DesignToken.typescale.standard.body.small);
      css += composeCss(DesignToken.elevation);
      css += composeCss(DesignToken.shape.corner.value);
      css += composeCss(omitKey(DesignToken.shape.corner, "value"));
      css += composeCss(DesignToken.motion.duration);
      css += composeCss(DesignToken.motion.easing);
      css += composeCss(DesignToken.motion.spring);
      css += composeCss(omitKey(DesignToken.density, "calc"));
      css += composeCss(DesignToken.measurement);
      css += composeCss(DesignToken.state);

      registerStyleSheet(unsafeCSS(`html{${css}}`));
    }
  }

  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: contents;
    }
  `;

  /** @private */ #styleSheet = new CSSStyleSheet();
  /** @private */ #firstUpdated = false;
  /** @private */ #light?: MediaQueryList;
  /** @private */ #dark?: MediaQueryList;
  /** @private */ #forcedColor?: MediaQueryList;

  /** @private */ readonly #colorSchemeChangeHandler = () => this.#apply(true);

  /**
   * The hex color from which to derive dynamic color palettes.
   * @default "#6750A4"
   */
  @property() color = "#6750A4";

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
        if (this.parentElement instanceof HTMLBodyElement) {
          switch (document.documentElement.style.colorScheme) {
            case "light":
              return false;
            case "dark":
              return true;
          }
        }
        return this.#dark?.matches ?? false;
    }
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();

    if (this.parentElement instanceof HTMLBodyElement) {
      if (this.shadowRoot?.adoptedStyleSheets.includes(this.#styleSheet)) {
        this.shadowRoot.adoptedStyleSheets = this.shadowRoot.adoptedStyleSheets.filter((x) => x !== this.#styleSheet);
      }
      if (!document.adoptedStyleSheets.includes(this.#styleSheet)) {
        document.adoptedStyleSheets = [this.#styleSheet, ...document.adoptedStyleSheets];
      }
    } else {
      if (document.adoptedStyleSheets.includes(this.#styleSheet)) {
        document.adoptedStyleSheets = document.adoptedStyleSheets.filter((x) => x !== this.#styleSheet);
      }
      if (this.shadowRoot && !this.shadowRoot.adoptedStyleSheets.includes(this.#styleSheet)) {
        this.shadowRoot.adoptedStyleSheets = [this.#styleSheet, ...this.shadowRoot.adoptedStyleSheets];
      }
    }

    this.#light = matchMedia("(prefers-color-scheme: light)");
    this.#dark = matchMedia("(prefers-color-scheme: dark)");
    this.#forcedColor = matchMedia("(forced-colors: active)");

    [this.#light, this.#dark, this.#forcedColor].forEach((x) =>
      x.addEventListener("change", this.#colorSchemeChangeHandler),
    );
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    [this.#light, this.#dark, this.#forcedColor].forEach((x) =>
      x?.removeEventListener("change", this.#colorSchemeChangeHandler),
    );
    this.#light = this.#dark = this.#forcedColor = undefined;

    if (document.adoptedStyleSheets.includes(this.#styleSheet)) {
      document.adoptedStyleSheets = document.adoptedStyleSheets.filter((x) => x !== this.#styleSheet);
    }
  }

  /** @inheritdoc */
  protected override updated(_changedProperties: PropertyValues<this>): void {
    super.updated(_changedProperties);
    this.#apply(
      this.#firstUpdated &&
        ["color", "scheme", "contrast"].some((x) => _changedProperties.has(<keyof M3eThemeElement>x)),
    );
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
  #apply(forceReflow: boolean): void {
    const color = argbFromHex(this.color);
    const theme = themeFromSourceColor(color);
    const scheme = new DynamicScheme({
      sourceColorHct: Hct.fromInt(color),
      variant: 1,
      contrastLevel: this.#getContrastLevel(),
      isDark: this.isDark,
      primaryPalette: theme.palettes.primary,
      secondaryPalette: theme.palettes.secondary,
      tertiaryPalette: theme.palettes.tertiary,
      neutralPalette: theme.palettes.neutral,
      neutralVariantPalette: theme.palettes.neutralVariant,
      errorPalette: theme.palettes.error,
    });

    let css = "";

    const colors = new MaterialDynamicColors();
    const allColors = [
      ...colors.allColors,
      colors.surfaceVariant(),
      colors.shadow(),
      colors.scrim(),
      colors.surfaceTint(),
    ];

    for (const color of allColors) {
      const token = `--md-sys-color-${color.name.replace(/_/g, "-").toLowerCase()}`;
      const hex = hexFromArgb(color.getArgb(scheme));
      css += `${token}: ${hex};`;
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
    css += `font-size: ${DesignToken.typescale.standard.body.large.fontSize};`;
    css += `font-weight: ${DesignToken.typescale.standard.body.large.fontWeight};`;
    css += `line-height: ${DesignToken.typescale.standard.body.large.lineHeight};`;
    css += `letter-spacing: ${DesignToken.typescale.standard.body.large.tracking};`;

    if (this.parentElement instanceof HTMLBodyElement) {
      this.#styleSheet.replaceSync(`
        html { ${css} }
        @media not (forced-colors: active) {
          body { 
            background-color: var(--md-sys-color-background);
            color: var(--md-sys-color-on-background);
            scrollbar-color: ${DesignToken.scrollbar.color};
          }
        }`);

      switch (this.scheme) {
        case "light":
          document.documentElement.style.colorScheme = "light";
          break;

        case "dark":
          document.documentElement.style.colorScheme = "dark";
          break;

        default:
          switch (document.documentElement.style.colorScheme) {
            case "light":
            case "dark":
              document.documentElement.style.colorScheme = "light dark";
              break;
          }
      }
    } else {
      this.#styleSheet.replaceSync(`:host { ${css} }`);
    }

    if (this.#firstUpdated) {
      this.dispatchEvent(new Event("change", { bubbles: true }));
    }
    if (forceReflow) {
      void document.body.offsetHeight;
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
