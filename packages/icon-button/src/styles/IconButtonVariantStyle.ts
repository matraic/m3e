import { css, CSSResult, CSSResultGroup, unsafeCSS } from "lit";

import { IconButtonVariant } from "../IconButtonVariant";
import { IconButtonVariantToken } from "./IconButtonVariantToken";

/** @private */
function iconButtonVariantStyle(variant: IconButtonVariant): CSSResult {
  return css`
    :host([variant="${unsafeCSS(variant)}"]) .base {
      background-color: ${IconButtonVariantToken[variant].containerColor ?? unsafeCSS("unset")};
      --m3e-state-layer-hover-color: ${IconButtonVariantToken[variant].hover.stateLayerColor};
      --m3e-state-layer-hover-opacity: ${IconButtonVariantToken[variant].hover.stateLayerOpacity};
      --m3e-state-layer-focus-color: ${IconButtonVariantToken[variant].focus.stateLayerColor};
      --m3e-state-layer-focus-opacity: ${IconButtonVariantToken[variant].focus.stateLayerOpacity};
      --m3e-ripple-color: ${IconButtonVariantToken[variant].pressed.stateLayerColor};
      --m3e-ripple-opacity: ${IconButtonVariantToken[variant].pressed.stateLayerOpacity};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle]:not([selected])) .base {
      background-color: ${IconButtonVariantToken[variant].unselectedContainerColor ?? unsafeCSS("unset")};
      --m3e-state-layer-hover-color: ${IconButtonVariantToken[variant].hover.unselectedStateLayerColor};
      --m3e-state-layer-focus-color: ${IconButtonVariantToken[variant].focus.unselectedStateLayerColor};
      --m3e-ripple-color: ${IconButtonVariantToken[variant].pressed.unselectedStateLayerColor};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle][selected]) .base {
      background-color: ${IconButtonVariantToken[variant].selectedContainerColor ?? unsafeCSS("unset")};
      --m3e-state-layer-hover-color: ${IconButtonVariantToken[variant].hover.selectedStateLayerColor};
      --m3e-state-layer-focus-color: ${IconButtonVariantToken[variant].focus.selectedStateLayerColor};
      --m3e-ripple-color: ${IconButtonVariantToken[variant].pressed.selectedStateLayerColor};
    }
    :host([variant="${unsafeCSS(variant)}"]) .base {
      outline-color: ${IconButtonVariantToken[variant].outlineColor ?? unsafeCSS("unset")};
    }
    :host([variant="${unsafeCSS(variant)}"]:focus) .base {
      outline-color: ${IconButtonVariantToken[variant].focus.outlineColor ?? unsafeCSS("unset")};
    }
    :host([variant="${unsafeCSS(variant)}"]:hover) .base {
      outline-color: ${IconButtonVariantToken[variant].hover.outlineColor ?? unsafeCSS("unset")};
    }
    :host([variant="${unsafeCSS(variant)}"].-pressed) .base {
      outline-color: ${IconButtonVariantToken[variant].pressed.outlineColor ?? unsafeCSS("unset")};
    }
    :host([variant="${unsafeCSS(variant)}"]) .icon {
      color: ${IconButtonVariantToken[variant].iconColor};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle]:not([selected])) .icon {
      color: ${IconButtonVariantToken[variant].unselectedIconColor};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle][selected]) .icon {
      color: ${IconButtonVariantToken[variant].selectedIconColor};
    }
    :host([variant="${unsafeCSS(variant)}"]:focus) .icon {
      color: ${IconButtonVariantToken[variant].focus.iconColor};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle]:not([selected]):focus) .icon {
      color: ${IconButtonVariantToken[variant].focus.unselectedIconColor};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle][selected]:focus) .icon {
      color: ${IconButtonVariantToken[variant].focus.selectedIconColor};
    }
    :host([variant="${unsafeCSS(variant)}"]:hover) .icon {
      color: ${IconButtonVariantToken[variant].hover.iconColor};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle]:not([selected]):hover) .icon {
      color: ${IconButtonVariantToken[variant].hover.unselectedIconColor};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle][selected]:hover) .icon {
      color: ${IconButtonVariantToken[variant].hover.selectedIconColor};
    }
    :host([variant="${unsafeCSS(variant)}"].-pressed) .icon {
      color: ${IconButtonVariantToken[variant].pressed.iconColor};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle]:not([selected]).-pressed) .icon {
      color: ${IconButtonVariantToken[variant].pressed.unselectedIconColor};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle][selected].-pressed) .icon {
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
  css`
    :host([variant="outlined"]) .base {
      outline-style: solid;
    }
  `,
];
