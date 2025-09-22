import { css, CSSResult, CSSResultGroup, unsafeCSS } from "lit";

import { CardVariant } from "../CardVariant";

import { CardVariantToken } from "./CardVariantToken";

/** @private */
function cardVariantStyle(variant: CardVariant): CSSResult {
  return css`
    :host([variant="${unsafeCSS(variant)}"]) .base {
      background-color: ${CardVariantToken[variant].containerColor ?? unsafeCSS("unset")};
      box-shadow: ${CardVariantToken[variant].containerElevation ?? unsafeCSS("unset")};
      border-width: ${CardVariantToken[variant].outlineThickness ?? unsafeCSS("unset")};
    }
    :host([actionable][variant="${unsafeCSS(variant)}"]) .base {
      --m3e-state-layer-hover-color: ${CardVariantToken[variant].hover.stateLayerColor};
      --m3e-state-layer-hover-opacity: ${CardVariantToken[variant].hover.stateLayerOpacity};
      --m3e-state-layer-focus-color: ${CardVariantToken[variant].focus.stateLayerColor};
      --m3e-state-layer-focus-opacity: ${CardVariantToken[variant].focus.stateLayerOpacity};
      --m3e-ripple-color: ${CardVariantToken[variant].pressed.stateLayerColor};
      --m3e-ripple-opacity: ${CardVariantToken[variant].pressed.stateLayerOpacity};
      --m3e-elevation-level: ${CardVariantToken[variant].containerElevation ?? unsafeCSS("unset")};
      --m3e-elevation-hover-level: ${CardVariantToken[variant].hover.containerElevation ?? unsafeCSS("unset")};
      --m3e-elevation-focus-level: ${CardVariantToken[variant].focus.containerElevation ?? unsafeCSS("unset")};
      --m3e-elevation-pressed-level: ${CardVariantToken[variant].pressed.containerElevation ?? unsafeCSS("unset")};
    }
    :host([variant="${unsafeCSS(variant)}"]) .base {
      border-color: ${CardVariantToken[variant].outlineColor ?? unsafeCSS("unset")};
    }
    :host([actionable][variant="${unsafeCSS(variant)}"]:focus .base) {
      border-color: ${CardVariantToken[variant].focus.outlineColor ?? unsafeCSS("unset")};
    }
    :host([actionable][variant="${unsafeCSS(variant)}"]:hover .base) {
      border-color: ${CardVariantToken[variant].hover.outlineColor ?? unsafeCSS("unset")};
    }
    :host([actionable][variant="${unsafeCSS(variant)}"]) .base.pressed {
      border-color: ${CardVariantToken[variant].pressed.outlineColor ?? unsafeCSS("unset")};
    }
    :host([variant="${unsafeCSS(variant)}"]) .base {
      color: ${CardVariantToken[variant].textColor ?? unsafeCSS("unset")};
    }
    :host([actionable][variant="${unsafeCSS(variant)}"]:focus) .base {
      color: ${CardVariantToken[variant].focus.textColor ?? unsafeCSS("unset")};
    }
    :host([actionable][variant="${unsafeCSS(variant)}"]:hover) .base {
      color: ${CardVariantToken[variant].hover.textColor ?? unsafeCSS("unset")};
    }
    :host([actionable][variant="${unsafeCSS(variant)}"]) .base.pressed {
      color: ${CardVariantToken[variant].pressed.textColor ?? unsafeCSS("unset")};
    }
    :host([actionable][variant="${unsafeCSS(variant)}"]:disabled) .base,
    :host([actionable][variant="${unsafeCSS(variant)}"][disabled-interactive]) .base {
      --m3e-elevation-level: ${CardVariantToken[variant].disabled.containerElevation ?? unsafeCSS("unset")};
      --m3e-elevation-color: color-mix(
        in srgb,
        ${CardVariantToken[variant].disabled.containerElevationColor}
          ${CardVariantToken[variant].disabled.containerElevationOpacity},
        transparent
      );
      color: color-mix(
        in srgb,
        ${CardVariantToken[variant].disabled.textColor} ${CardVariantToken[variant].disabled.textOpacity},
        transparent
      );
      background-color: ${CardVariantToken[variant].disabled.containerColor &&
      CardVariantToken[variant].disabled.containerOpacity
        ? unsafeCSS(`color-mix(
        in srgb,
        ${CardVariantToken[variant].disabled.containerColor} ${CardVariantToken[variant].disabled.containerOpacity},
        transparent
      )`)
        : unsafeCSS("unset")};
      border-color: ${CardVariantToken[variant].disabled.outlineColor &&
      CardVariantToken[variant].disabled.outlineOpacity
        ? unsafeCSS(`color-mix(
        in srgb,
        ${CardVariantToken[variant].disabled.outlineColor} ${CardVariantToken[variant].disabled.outlineOpacity},
        transparent
      )`)
        : unsafeCSS("unset")};
    }
  `;
}

/**
 * Appearance variant styles for `M3eCardElement`.
 * @internal
 */
export const CardVariantStyle: CSSResultGroup = [
  cardVariantStyle("filled"),
  cardVariantStyle("elevated"),
  cardVariantStyle("outlined"),
];
