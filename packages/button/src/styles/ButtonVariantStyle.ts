import { css, CSSResult, CSSResultGroup, unsafeCSS } from "lit";

import { ButtonVariant } from "../ButtonVariant";
import { ButtonVariantToken } from "./ButtonVariantToken";

/** @private */
function buttonVariantStyle(variant: ButtonVariant): CSSResult {
  return css`
    :host([variant="${unsafeCSS(variant)}"]) .base {
      background-color: ${ButtonVariantToken[variant].containerColor ?? unsafeCSS("unset")};
      --m3e-state-layer-hover-color: ${ButtonVariantToken[variant].hover.stateLayerColor};
      --m3e-state-layer-hover-opacity: ${ButtonVariantToken[variant].hover.stateLayerOpacity};
      --m3e-state-layer-focus-color: ${ButtonVariantToken[variant].focus.stateLayerColor};
      --m3e-state-layer-focus-opacity: ${ButtonVariantToken[variant].focus.stateLayerOpacity};
      --m3e-ripple-color: ${ButtonVariantToken[variant].pressed.stateLayerColor};
      --m3e-ripple-opacity: ${ButtonVariantToken[variant].pressed.stateLayerOpacity};
      --m3e-elevation-level: ${ButtonVariantToken[variant].containerElevation ?? unsafeCSS("unset")};
      --m3e-elevation-hover-level: ${ButtonVariantToken[variant].hover.containerElevation ?? unsafeCSS("unset")};
      --m3e-elevation-focus-level: ${ButtonVariantToken[variant].focus.containerElevation ?? unsafeCSS("unset")};
      --m3e-elevation-pressed-level: ${ButtonVariantToken[variant].pressed.containerElevation ?? unsafeCSS("unset")};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle]:not([selected])) .base {
      background-color: ${ButtonVariantToken[variant].unselectedContainerColor ?? unsafeCSS("unset")};
      --m3e-state-layer-hover-color: ${ButtonVariantToken[variant].hover.unselectedStateLayerColor};
      --m3e-state-layer-focus-color: ${ButtonVariantToken[variant].focus.unselectedStateLayerColor};
      --m3e-ripple-color: ${ButtonVariantToken[variant].pressed.unselectedStateLayerColor};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle][selected]) .base {
      background-color: ${ButtonVariantToken[variant].selectedContainerColor ?? unsafeCSS("unset")};
      --m3e-state-layer-hover-color: ${ButtonVariantToken[variant].hover.selectedStateLayerColor};
      --m3e-state-layer-focus-color: ${ButtonVariantToken[variant].focus.selectedStateLayerColor};
      --m3e-ripple-color: ${ButtonVariantToken[variant].pressed.selectedStateLayerColor};
    }
    :host([variant="${unsafeCSS(variant)}"]) .base {
      outline-color: ${ButtonVariantToken[variant].outlineColor ?? unsafeCSS("unset")};
    }
    :host([variant="${unsafeCSS(variant)}"]:focus) .base {
      outline-color: ${ButtonVariantToken[variant].focus.outlineColor ?? unsafeCSS("unset")};
    }
    :host([variant="${unsafeCSS(variant)}"]:hover) .base {
      outline-color: ${ButtonVariantToken[variant].hover.outlineColor ?? unsafeCSS("unset")};
    }
    :host([variant="${unsafeCSS(variant)}"].-pressed) .base {
      outline-color: ${ButtonVariantToken[variant].pressed.outlineColor ?? unsafeCSS("unset")};
    }
    :host([variant="${unsafeCSS(variant)}"]) .label {
      color: ${ButtonVariantToken[variant].labelTextColor};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle]:not([selected])) .label {
      color: ${ButtonVariantToken[variant].unselectedLabelTextColor};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle][selected]) .label {
      color: ${ButtonVariantToken[variant].selectedLabelTextColor};
    }
    :host([variant="${unsafeCSS(variant)}"]:focus) .label {
      color: ${ButtonVariantToken[variant].focus.labelTextColor};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle]:not([selected]):focus) .label {
      color: ${ButtonVariantToken[variant].focus.unselectedLabelTextColor};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle][selected]:focus) .label {
      color: ${ButtonVariantToken[variant].focus.selectedLabelTextColor};
    }
    :host([variant="${unsafeCSS(variant)}"]:hover) .label {
      color: ${ButtonVariantToken[variant].hover.labelTextColor};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle]:not([selected]):hover) .label {
      color: ${ButtonVariantToken[variant].hover.unselectedLabelTextColor};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle][selected]:hover) .label {
      color: ${ButtonVariantToken[variant].hover.selectedLabelTextColor};
    }
    :host([variant="${unsafeCSS(variant)}"].-pressed) .label {
      color: ${ButtonVariantToken[variant].pressed.labelTextColor};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle]:not([selected]).-pressed) .label {
      color: ${ButtonVariantToken[variant].pressed.unselectedLabelTextColor};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle][selected].-pressed) .label {
      color: ${ButtonVariantToken[variant].pressed.selectedLabelTextColor};
    }
    :host([variant="${unsafeCSS(variant)}"]) .icon {
      color: ${ButtonVariantToken[variant].iconColor};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle]:not([selected])) .icon {
      color: ${ButtonVariantToken[variant].unselectedIconColor};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle][selected]) .icon {
      color: ${ButtonVariantToken[variant].selectedIconColor};
    }
    :host([variant="${unsafeCSS(variant)}"]:focus) .icon {
      color: ${ButtonVariantToken[variant].focus.iconColor};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle]:not([selected]):focus) .icon {
      color: ${ButtonVariantToken[variant].focus.unselectedIconColor};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle][selected]:focus) .icon {
      color: ${ButtonVariantToken[variant].focus.selectedIconColor};
    }
    :host([variant="${unsafeCSS(variant)}"]:hover) .icon {
      color: ${ButtonVariantToken[variant].hover.iconColor};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle]:not([selected]):hover) .icon {
      color: ${ButtonVariantToken[variant].hover.unselectedIconColor};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle][selected]:hover) .icon {
      color: ${ButtonVariantToken[variant].hover.selectedIconColor};
    }
    :host([variant="${unsafeCSS(variant)}"].-pressed) .icon {
      color: ${ButtonVariantToken[variant].pressed.iconColor};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle]:not([selected]).-pressed) .icon {
      color: ${ButtonVariantToken[variant].pressed.unselectedIconColor};
    }
    :host([variant="${unsafeCSS(variant)}"][toggle][selected].-pressed) .icon {
      color: ${ButtonVariantToken[variant].pressed.selectedIconColor};
    }
    :host([variant="${unsafeCSS(variant)}"]:disabled) .base,
    :host([variant="${unsafeCSS(variant)}"][disabled-interactive]) .base {
      --m3e-elevation-level: ${ButtonVariantToken[variant].disabled.containerElevation ?? unsafeCSS("unset")};
      outline-color: ${ButtonVariantToken[variant].disabled.outlineColor ?? unsafeCSS("unset")};
      background-color: color-mix(
        in srgb,
        ${ButtonVariantToken[variant].disabled.containerColor} ${ButtonVariantToken[variant].disabled.containerOpacity},
        transparent
      );
    }
    :host([variant="${unsafeCSS(variant)}"]:disabled) .label,
    :host([variant="${unsafeCSS(variant)}"][disabled-interactive]) .label {
      color: color-mix(
        in srgb,
        ${ButtonVariantToken[variant].disabled.labelTextColor} ${ButtonVariantToken[variant].disabled.labelTextOpacity},
        transparent
      );
    }
    :host([variant="${unsafeCSS(variant)}"]:disabled) .icon,
    :host([variant="${unsafeCSS(variant)}"][disabled-interactive]) .icon {
      color: color-mix(
        in srgb,
        ${ButtonVariantToken[variant].disabled.iconColor} ${ButtonVariantToken[variant].disabled.iconOpacity},
        transparent
      );
    }
  `;
}

/**
 * Appearance variant styles for `M3eButtonElement`.
 * @internal
 */
export const ButtonVariantStyle: CSSResultGroup = [
  buttonVariantStyle("text"),
  buttonVariantStyle("elevated"),
  buttonVariantStyle("outlined"),
  buttonVariantStyle("filled"),
  buttonVariantStyle("tonal"),
  css`
    :host([variant="outlined"]) .base {
      outline-style: solid;
    }
  `,
];
