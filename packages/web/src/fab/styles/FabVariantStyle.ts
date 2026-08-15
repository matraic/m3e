import { css, CSSResult, CSSResultGroup, unsafeCSS } from "lit";

import { FabVariant } from "../FabVariant";
import { FabVariantToken } from "./FabVariantToken";

/** @private */
function fabVariantStyle(variant: FabVariant): CSSResult {
  const selector = unsafeCSS(`:is(:state(--${variant}), :--${variant})`);
  return css`
    :host(${selector}:not([lowered])) .base {
      background-color: ${FabVariantToken[variant].containerColor};
      --m3e-elevation-level: ${FabVariantToken[variant].containerElevation};
      --m3e-elevation-hover-level: ${FabVariantToken[variant].hover.containerElevation};
      --m3e-elevation-focus-level: ${FabVariantToken[variant].focus.containerElevation};
      --m3e-elevation-pressed-level: ${FabVariantToken[variant].pressed.containerElevation};
    }
    :host(${selector}[lowered]) .base {
      background-color: ${FabVariantToken[variant].loweredContainerColor ?? FabVariantToken[variant].containerColor};
      --m3e-elevation-level: ${FabVariantToken[variant].loweredContainerElevation};
      --m3e-elevation-hover-level: ${FabVariantToken[variant].hover.loweredContainerElevation};
      --m3e-elevation-focus-level: ${FabVariantToken[variant].focus.loweredContainerElevation};
      --m3e-elevation-pressed-level: ${FabVariantToken[variant].pressed.loweredContainerElevation};
    }
    :host(${selector}) .base {
      --m3e-state-layer-hover-color: ${FabVariantToken[variant].hover.stateLayerColor};
      --m3e-state-layer-hover-opacity: ${FabVariantToken[variant].hover.stateLayerOpacity};
      --m3e-state-layer-focus-color: ${FabVariantToken[variant].focus.stateLayerColor};
      --m3e-state-layer-focus-opacity: ${FabVariantToken[variant].focus.stateLayerOpacity};
      --m3e-ripple-color: ${FabVariantToken[variant].pressed.stateLayerColor};
      --m3e-ripple-opacity: ${FabVariantToken[variant].pressed.stateLayerOpacity};
    }
    :host(${selector}) .label {
      color: ${FabVariantToken[variant].labelTextColor};
    }
    :host(${selector}:focus) .label {
      color: ${FabVariantToken[variant].focus.labelTextColor};
    }
    :host(${selector}:hover) .label {
      color: ${FabVariantToken[variant].hover.labelTextColor};
    }
    :host(${selector}) .base.pressed .label {
      color: ${FabVariantToken[variant].pressed.labelTextColor};
    }
    :host(${selector}) .icon {
      color: ${FabVariantToken[variant].iconColor};
    }
    :host(${selector}:focus) .icon {
      color: ${FabVariantToken[variant].focus.iconColor};
    }
    :host(${selector}:hover) .icon {
      color: ${FabVariantToken[variant].hover.iconColor};
    }
    :host(${selector}) .base.pressed .icon {
      color: ${FabVariantToken[variant].pressed.iconColor};
    }
    :host(${selector}:disabled) .base,
    :host(${selector}[disabled-interactive]) .base {
      --m3e-elevation-level: ${FabVariantToken[variant].disabled.containerElevation};
      background-color: color-mix(
        in srgb,
        ${FabVariantToken[variant].disabled.containerColor} ${FabVariantToken[variant].disabled.containerOpacity},
        transparent
      );
    }
    :host(${selector}:disabled) .label,
    :host(${selector}[disabled-interactive]) .label {
      color: color-mix(
        in srgb,
        ${FabVariantToken[variant].disabled.labelTextColor} ${FabVariantToken[variant].disabled.labelTextOpacity},
        transparent
      );
    }
    :host(${selector}:disabled) .icon,
    :host(${selector}[disabled-interactive]) .icon {
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
