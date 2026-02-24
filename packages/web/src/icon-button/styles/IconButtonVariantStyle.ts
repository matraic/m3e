import { css, CSSResult, CSSResultGroup, unsafeCSS } from "lit";

import { IconButtonVariant } from "../IconButtonVariant";
import { IconButtonVariantToken } from "./IconButtonVariantToken";

/** @private */
function iconButtonVariantStyle(variant: IconButtonVariant | "elevated"): CSSResult {
  return css`
    :host([variant="${unsafeCSS(variant)}"]:not(:disabled):not([disabled-interactive])) .base {
      background-color: ${IconButtonVariantToken[variant].containerColor ?? unsafeCSS("unset")};
      --m3e-state-layer-hover-color: ${IconButtonVariantToken[variant].hover.stateLayerColor};
      --m3e-state-layer-hover-opacity: ${IconButtonVariantToken[variant].hover.stateLayerOpacity};
      --m3e-state-layer-focus-color: ${IconButtonVariantToken[variant].focus.stateLayerColor};
      --m3e-state-layer-focus-opacity: ${IconButtonVariantToken[variant].focus.stateLayerOpacity};
      --m3e-ripple-color: ${IconButtonVariantToken[variant].pressed.stateLayerColor};
      --m3e-ripple-opacity: ${IconButtonVariantToken[variant].pressed.stateLayerOpacity};
      --m3e-elevation-level: ${IconButtonVariantToken[variant].containerElevation ?? unsafeCSS("unset")};
      --m3e-elevation-hover-level: ${IconButtonVariantToken[variant].hover.containerElevation ?? unsafeCSS("unset")};
      --m3e-elevation-focus-level: ${IconButtonVariantToken[variant].focus.containerElevation ?? unsafeCSS("unset")};
      --m3e-elevation-pressed-level: ${IconButtonVariantToken[variant].pressed.containerElevation ??
      unsafeCSS("unset")};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle]:not([selected]):not(:disabled):not([disabled-interactive])) .base {
      background-color: ${IconButtonVariantToken[variant].unselectedContainerColor ?? unsafeCSS("unset")};
      --m3e-state-layer-hover-color: ${IconButtonVariantToken[variant].hover.unselectedStateLayerColor};
      --m3e-state-layer-focus-color: ${IconButtonVariantToken[variant].focus.unselectedStateLayerColor};
      --m3e-ripple-color: ${IconButtonVariantToken[variant].pressed.unselectedStateLayerColor};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle][selected]:not(:disabled):not([disabled-interactive])) .base {
      background-color: ${IconButtonVariantToken[variant].selectedContainerColor ?? unsafeCSS("unset")};
      --m3e-state-layer-hover-color: ${IconButtonVariantToken[variant].hover.selectedStateLayerColor};
      --m3e-state-layer-focus-color: ${IconButtonVariantToken[variant].focus.selectedStateLayerColor};
      --m3e-ripple-color: ${IconButtonVariantToken[variant].pressed.selectedStateLayerColor};
    }
    :host([variant="${unsafeCSS(variant)}"]:not(:disabled):not([disabled-interactive])) .base {
      outline-color: ${IconButtonVariantToken[variant].outlineColor ?? unsafeCSS("unset")};
    }
    :host([variant="${unsafeCSS(variant)}"]:focus:not(:disabled):not([disabled-interactive])) .base {
      outline-color: ${IconButtonVariantToken[variant].focus.outlineColor ?? unsafeCSS("unset")};
    }
    :host([variant="${unsafeCSS(variant)}"]:hover:not(:disabled):not([disabled-interactive])) .base {
      outline-color: ${IconButtonVariantToken[variant].hover.outlineColor ?? unsafeCSS("unset")};
    }
    :host([variant="${unsafeCSS(variant)}"].-pressed:not(:disabled):not([disabled-interactive])) .base {
      outline-color: ${IconButtonVariantToken[variant].pressed.outlineColor ?? unsafeCSS("unset")};
    }
    :host([variant="${unsafeCSS(variant)}"]:not(:disabled):not([disabled-interactive])) .icon {
      color: ${IconButtonVariantToken[variant].iconColor};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle]:not([selected]):not(:disabled):not([disabled-interactive])) .icon {
      color: ${IconButtonVariantToken[variant].unselectedIconColor};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle][selected]:not(:disabled):not([disabled-interactive])) .icon {
      color: ${IconButtonVariantToken[variant].selectedIconColor};
    }
    :host([variant="${unsafeCSS(variant)}"]:focus:not(:disabled):not([disabled-interactive])) .icon {
      color: ${IconButtonVariantToken[variant].focus.iconColor};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle]:not([selected]):focus:not(:disabled):not([disabled-interactive]))
      .icon {
      color: ${IconButtonVariantToken[variant].focus.unselectedIconColor};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle][selected]:focus:not(:disabled):not([disabled-interactive])) .icon {
      color: ${IconButtonVariantToken[variant].focus.selectedIconColor};
    }
    :host([variant="${unsafeCSS(variant)}"]:hover:not(:disabled):not([disabled-interactive])) .icon {
      color: ${IconButtonVariantToken[variant].hover.iconColor};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle]:not([selected]):hover:not(:disabled):not([disabled-interactive]))
      .icon {
      color: ${IconButtonVariantToken[variant].hover.unselectedIconColor};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle][selected]:hover:not(:disabled):not([disabled-interactive])) .icon {
      color: ${IconButtonVariantToken[variant].hover.selectedIconColor};
    }
    :host([variant="${unsafeCSS(variant)}"].-pressed:not(:disabled):not([disabled-interactive])) .icon {
      color: ${IconButtonVariantToken[variant].pressed.iconColor};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle]:not([selected]).-pressed:not(:disabled):not([disabled-interactive]))
      .icon {
      color: ${IconButtonVariantToken[variant].pressed.unselectedIconColor};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle][selected].-pressed:not(:disabled):not([disabled-interactive]))
      .icon {
      color: ${IconButtonVariantToken[variant].pressed.selectedIconColor};
    }
    :host([variant="${unsafeCSS(variant)}"]:disabled) .base,
    :host([variant="${unsafeCSS(variant)}"][disabled-interactive]) .base {
      outline-color: ${IconButtonVariantToken[variant].disabled.outlineColor ?? unsafeCSS("unset")};
      background-color: color-mix(
        in srgb,
        ${IconButtonVariantToken[variant].disabled.containerColor}
          ${IconButtonVariantToken[variant].disabled.containerOpacity},
        transparent
      );
    }
    :host([variant="${unsafeCSS(variant)}"]:disabled) .icon,
    :host([variant="${unsafeCSS(variant)}"][disabled-interactive]) .icon {
      color: color-mix(
        in srgb,
        ${IconButtonVariantToken[variant].disabled.iconColor} ${IconButtonVariantToken[variant].disabled.iconOpacity},
        transparent
      );
    }
  `;
}

/**
 * Appearance variant styles for `M3eIconButtonElement`.
 * @internal
 */
export const IconButtonVariantStyle: CSSResultGroup = [
  iconButtonVariantStyle("standard"),
  iconButtonVariantStyle("outlined"),
  iconButtonVariantStyle("filled"),
  iconButtonVariantStyle("tonal"),
  iconButtonVariantStyle("elevated"),
  css`
    :host([variant="outlined"]:not([toggle][selected]):not(:disabled):not([disabled-interactive])) .base {
      outline-style: solid;
    }
  `,
];
