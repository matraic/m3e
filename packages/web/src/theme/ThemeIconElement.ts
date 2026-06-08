import { css, CSSResultGroup, html, LitElement, PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import {
  argbFromHex,
  DynamicScheme,
  Hct,
  hexFromArgb,
  MaterialDynamicColors,
  themeFromSourceColor,
} from "@material/material-color-utilities";

import { customElement, DesignToken, Role } from "@m3e/web/core";

import { ColorScheme } from "./ColorScheme";
import { ThemeVariant } from "./ThemeVariant";

/**
 * An icon that visually presents a preview of a theme.
 *
 * @description
 * The `m3e-theme-icon` renders a small preview of a theme's surface and primary colors.
 *
 * @example
 * The following example presents a preview of a teal light theme.
 * ```html
 * <m3e-theme-icon color="#004f4f" scheme="light"></m3e-theme-icon>
 * ```
 *
 * @tag m3e-theme-icon
 *
 * @attr color - The hex color of the theme to preview
 * @attr scheme - The color scheme of the theme to preview.
 * @attr variant - The color variant of the theme to preview.
 *
 * @cssprop --m3e-theme-icon-size - Size of the theme icon.
 * @cssprop --m3e-theme-icon-shape - Border radius of the icon container.
 * @cssprop --m3e-theme-icon-outline-color - Outline stroke color of the icon border.
 * @cssprop --m3e-theme-icon-outline-opacity - Opacity percentage applied to the outline color.
 * @cssprop --m3e-theme-icon-container-color - Fill color for the container layer of the previewed theme.
 * @cssprop --m3e-theme-icon-color - Fill color for the primary layer of the previewed theme.
 */
@customElement("m3e-theme-icon")
export class M3eThemeIconElement extends Role(LitElement, "img") {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-block;
      width: var(--m3e-theme-icon-size, 1.5rem);
      height: var(--m3e-theme-icon-size, 1.5rem);
    }
    .base {
      width: 100%;
      height: 100%;
      border-radius: var(--m3e-theme-icon-shape, ${DesignToken.shape.corner.extraSmall});
      outline: solid 1px
        color-mix(
          in srgb,
          var(--m3e-theme-icon-outline-color, ${DesignToken.color.outlineVariant})
            var(--m3e-theme-icon-outline-opacity, 50%),
          transparent
        );
    }
    .icon {
      width: 100%;
      height: 100%;
    }
    .container {
      fill: var(--m3e-theme-icon-container-color, var(--_theme-icon-container-color));
    }
    .color {
      fill: var(--m3e-theme-icon-color, var(--_theme-icon-color));
    }
  `;

  /** @private */ #light?: MediaQueryList;
  /** @private */ #dark?: MediaQueryList;
  /** @private */ readonly #colorSchemeChangeHandler = () => this.requestUpdate();

  /**
   * The hex color of the theme to preview
   * @default "#6750A4"
   */
  @property() color = "#6750A4";

  /** The color variant of the theme.
   * @default "neutral"
   */
  @property() variant: ThemeVariant = "neutral";

  /**
   * The color scheme of the theme.
   * @default "auto"
   */
  @property() scheme: ColorScheme = "auto";

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

  /** @private */
  #getVariant(): number {
    switch (this.variant) {
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
      case "content":
        return 6;
      case "rainbow":
        return 7;
      case "fruit-salad":
        return 8;
      default:
        return 0; // monochrome
    }
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();

    this.#light = matchMedia("(prefers-color-scheme: light)");
    this.#dark = matchMedia("(prefers-color-scheme: dark)");

    [this.#light, this.#dark].forEach((x) => x.addEventListener("change", this.#colorSchemeChangeHandler));
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    [this.#light, this.#dark].forEach((x) => x?.removeEventListener("change", this.#colorSchemeChangeHandler));
    this.#light = this.#dark = undefined;
  }

  /** @inheritdoc */
  protected override updated(_changedProperties: PropertyValues): void {
    super.updated(_changedProperties);

    const base = this.shadowRoot?.querySelector<HTMLElement>(".base");

    const color = argbFromHex(this.color);
    const theme = themeFromSourceColor(color);
    const scheme = new DynamicScheme({
      sourceColorHct: Hct.fromInt(color),
      variant: this.#getVariant(),
      contrastLevel: 0,
      isDark: this.isDark,
      primaryPalette: theme.palettes.primary,
      neutralPalette: theme.palettes.neutral,
    });

    const dynamicColors = new MaterialDynamicColors();
    base?.style.setProperty("--_theme-icon-container-color", hexFromArgb(dynamicColors.surface().getArgb(scheme)));
    base?.style.setProperty("--_theme-icon-color", hexFromArgb(dynamicColors.primary().getArgb(scheme)));
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="base">
      <svg viewBox="0 0 80 80" class="icon">
        <path
          class="container"
          d="M77.87 0C79.05 0 80 .95 80 2.13v75.74c0 1.17-.95 2.13-2.13 2.13H2.13C.96 80 0 79.04 0 77.87V2.13C0 .95.96 0 2.13 0h75.74z"
        />
        <path
          class="color"
          d="M54 40c3.32 0 6 2.69 6 6 0 1.2 0-1.2 0 0 0 3.31-2.68 6-6 6H26c-3.31 0-6-2.69-6-6 0-1.2 0 1.2 0 0 0-3.31 2.69-6 6-6h28z"
        />
        <path class="color" d="M0 0h80v17.24H0V0z" />
      </svg>
    </div>`;
  }
}
