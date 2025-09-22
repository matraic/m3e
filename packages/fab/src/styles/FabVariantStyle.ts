import { css, CSSResult, CSSResultGroup, unsafeCSS } from "lit";

import { FabVariant } from "../FabVariant";
import { FabVariantToken } from "./FabVariantToken";

/** @private */
function fabVariantStyle(variant: FabVariant): CSSResult {
  return css`
    :host([variant="${unsafeCSS(variant)}"]:not([lowered])) .base {
      background-color: ${FabVariantToken[variant].containerColor};
      --m3e-elevation-level: ${FabVariantToken[variant].containerElevation};
      --m3e-elevation-hover-level: ${FabVariantToken[variant].hover.containerElevation};
      --m3e-elevation-focus-level: ${FabVariantToken[variant].focus.containerElevation};
      --m3e-elevation-pressed-level: ${FabVariantToken[variant].pressed.containerElevation};
    }
    :host([variant="${unsafeCSS(variant)}"][lowered]) .base {
      background-color: ${FabVariantToken[variant].loweredContainerColor ?? FabVariantToken[variant].containerColor};
      --m3e-elevation-level: ${FabVariantToken[variant].loweredContainerElevation};
      --m3e-elevation-hover-level: ${FabVariantToken[variant].hover.loweredContainerElevation};
      --m3e-elevation-focus-level: ${FabVariantToken[variant].focus.loweredContainerElevation};
      --m3e-elevation-pressed-level: ${FabVariantToken[variant].pressed.loweredContainerElevation};
    }
    :host([variant="${unsafeCSS(variant)}"]) .base {
      --m3e-state-layer-hover-color: ${FabVariantToken[variant].hover.stateLayerColor};
      --m3e-state-layer-hover-opacity: ${FabVariantToken[variant].hover.stateLayerOpacity};
      --m3e-state-layer-focus-color: ${FabVariantToken[variant].focus.stateLayerColor};
      --m3e-state-layer-focus-opacity: ${FabVariantToken[variant].focus.stateLayerOpacity};
      --m3e-ripple-color: ${FabVariantToken[variant].pressed.stateLayerColor};
      --m3e-ripple-opacity: ${FabVariantToken[variant].pressed.stateLayerOpacity};
    }
    :host([variant="${unsafeCSS(variant)}"]) .label {
      color: ${FabVariantToken[variant].labelTextColor};
    }
    :host([variant="${unsafeCSS(variant)}"]:focus) .label {
      color: ${FabVariantToken[variant].focus.labelTextColor};
    }
    :host([variant="${unsafeCSS(variant)}"]:hover) .label {
      color: ${FabVariantToken[variant].hover.labelTextColor};
    }
    :host([variant="${unsafeCSS(variant)}"]) .base.pressed .label {
      color: ${FabVariantToken[variant].pressed.labelTextColor};
    }
    :host([variant="${unsafeCSS(variant)}"]) .icon {
      color: ${FabVariantToken[variant].iconColor};
    }
    :host([variant="${unsafeCSS(variant)}"]:focus) .icon {
      color: ${FabVariantToken[variant].focus.iconColor};
    }
    :host([variant="${unsafeCSS(variant)}"]:hover) .icon {
      color: ${FabVariantToken[variant].hover.iconColor};
    }
    :host([variant="${unsafeCSS(variant)}"]) .base.pressed .icon {
      color: ${FabVariantToken[variant].pressed.iconColor};
    }
    :host([variant="${unsafeCSS(variant)}"]:disabled) .base,
    :host([variant="${unsafeCSS(variant)}"][disabled-interactive]) .base {
      --m3e-elevation-level: ${FabVariantToken[variant].disabled.containerElevation};
      background-color: color-mix(
        in srgb,
        ${FabVariantToken[variant].disabled.containerColor} ${FabVariantToken[variant].disabled.containerOpacity},
        transparent
      );
    }
    :host([variant="${unsafeCSS(variant)}"]:disabled) .label,
    :host([variant="${unsafeCSS(variant)}"][disabled-interactive]) .label {
      color: color-mix(
        in srgb,
        ${FabVariantToken[variant].disabled.labelTextColor} ${FabVariantToken[variant].disabled.labelTextOpacity},
        transparent
      );
    }
    :host([variant="${unsafeCSS(variant)}"]:disabled) .icon,
    :host([variant="${unsafeCSS(variant)}"][disabled-interactive]) .icon {
      color: color-mix(
        in srgb,
        ${FabVariantToken[variant].disabled.iconColor} ${FabVariantToken[variant].disabled.iconOpacity},
        transparent
      );
    }
  `;
}

/**
 * Appearance variant styles for `M3eFabElement`.
 * @internal
 */
export const FabVariantStyle: CSSResultGroup = [
  fabVariantStyle("primary"),
  fabVariantStyle("secondary"),
  fabVariantStyle("tertiary"),
  fabVariantStyle("primary-container"),
  fabVariantStyle("secondary-container"),
  fabVariantStyle("tertiary-container"),
  fabVariantStyle("surface"),
];
