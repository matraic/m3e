import { css, CSSResult, CSSResultGroup, unsafeCSS } from "lit";

import { ButtonVariant } from "../ButtonVariant";
import { ButtonVariantToken } from "./ButtonVariantToken";

/** @private */
function buttonVariantStyle(variant: ButtonVariant): CSSResult {
  const selector = unsafeCSS(`:is(:state(--${variant}), :--${variant})`);
  return css`
    :host(${selector}:not(:disabled):not([disabled-interactive])) .base {
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
    :host(${selector}[toggle]:not([selected]):not(:disabled):not([disabled-interactive])) .base {
      background-color: ${ButtonVariantToken[variant].unselectedContainerColor ?? unsafeCSS("unset")};
      --m3e-state-layer-hover-color: ${ButtonVariantToken[variant].hover.unselectedStateLayerColor};
      --m3e-state-layer-focus-color: ${ButtonVariantToken[variant].focus.unselectedStateLayerColor};
      --m3e-ripple-color: ${ButtonVariantToken[variant].pressed.unselectedStateLayerColor};
    }
    :host(${selector}[toggle][selected]:not(:disabled):not([disabled-interactive])) .base {
      background-color: ${ButtonVariantToken[variant].selectedContainerColor ?? unsafeCSS("unset")};
      --m3e-state-layer-hover-color: ${ButtonVariantToken[variant].hover.selectedStateLayerColor};
      --m3e-state-layer-focus-color: ${ButtonVariantToken[variant].focus.selectedStateLayerColor};
      --m3e-ripple-color: ${ButtonVariantToken[variant].pressed.selectedStateLayerColor};
    }
    :host(${selector}:not(:disabled):not([disabled-interactive])) .base {
      outline-color: ${ButtonVariantToken[variant].outlineColor ?? unsafeCSS("unset")};
    }
    :host(${selector}:focus:not(:disabled):not([disabled-interactive])) .base {
      outline-color: ${ButtonVariantToken[variant].focus.outlineColor ?? unsafeCSS("unset")};
    }
    :host(${selector}:hover:not(:disabled):not([disabled-interactive])) .base {
      outline-color: ${ButtonVariantToken[variant].hover.outlineColor ?? unsafeCSS("unset")};
    }
    :host(${selector}:is(:state(--pressed), :--pressed):not(:disabled):not([disabled-interactive])) .base {
      outline-color: ${ButtonVariantToken[variant].pressed.outlineColor ?? unsafeCSS("unset")};
    }
    :host(${selector}:not(:disabled):not([disabled-interactive])) .label {
      color: ${ButtonVariantToken[variant].labelTextColor};
    }
    :host(${selector}[toggle]:not([selected]):not(:disabled):not([disabled-interactive])) .label {
      color: ${ButtonVariantToken[variant].unselectedLabelTextColor};
    }
    :host(${selector}[toggle][selected]:not(:disabled):not([disabled-interactive])) .label {
      color: ${ButtonVariantToken[variant].selectedLabelTextColor};
    }
    :host(${selector}:focus:not(:disabled):not([disabled-interactive])) .label {
      color: ${ButtonVariantToken[variant].focus.labelTextColor};
    }
    :host(${selector}[toggle]:not([selected]):focus:not(:disabled):not([disabled-interactive])) .label {
      color: ${ButtonVariantToken[variant].focus.unselectedLabelTextColor};
    }
    :host(${selector}[toggle][selected]:focus:not(:disabled):not([disabled-interactive])) .label {
      color: ${ButtonVariantToken[variant].focus.selectedLabelTextColor};
    }
    :host(${selector}:hover:not(:disabled):not([disabled-interactive])) .label {
      color: ${ButtonVariantToken[variant].hover.labelTextColor};
    }
    :host(${selector}[toggle]:not([selected]):hover:not(:disabled):not([disabled-interactive])) .label {
      color: ${ButtonVariantToken[variant].hover.unselectedLabelTextColor};
    }
    :host(${selector}[toggle][selected]:hover:not(:disabled):not([disabled-interactive])) .label {
      color: ${ButtonVariantToken[variant].hover.selectedLabelTextColor};
    }
    :host(${selector}:is(:state(--pressed), :--pressed):not(:disabled):not([disabled-interactive])) .label {
      color: ${ButtonVariantToken[variant].pressed.labelTextColor};
    }
    :host(
        ${selector}[toggle]:not([selected]):is(:state(--pressed), :--pressed):not(:disabled):not([disabled-interactive])
      )
      .label {
      color: ${ButtonVariantToken[variant].pressed.unselectedLabelTextColor};
    }
    :host(${selector}[toggle][selected]:is(:state(--pressed), :--pressed):not(:disabled):not([disabled-interactive]))
      .label {
      color: ${ButtonVariantToken[variant].pressed.selectedLabelTextColor};
    }
    :host(${selector}:not(:disabled):not([disabled-interactive])) .icon {
      color: ${ButtonVariantToken[variant].iconColor};
    }
    :host(${selector}[toggle]:not([selected]):not(:disabled):not([disabled-interactive])) .icon {
      color: ${ButtonVariantToken[variant].unselectedIconColor};
    }
    :host(${selector}[toggle][selected]:not(:disabled):not([disabled-interactive])) .icon {
      color: ${ButtonVariantToken[variant].selectedIconColor};
    }
    :host(${selector}:focus:not(:disabled):not([disabled-interactive])) .icon {
      color: ${ButtonVariantToken[variant].focus.iconColor};
    }
    :host(${selector}[toggle]:not([selected]):focus:not(:disabled):not([disabled-interactive])) .icon {
      color: ${ButtonVariantToken[variant].focus.unselectedIconColor};
    }
    :host(${selector}[toggle][selected]:focus:not(:disabled):not([disabled-interactive])) .icon {
      color: ${ButtonVariantToken[variant].focus.selectedIconColor};
    }
    :host(${selector}:hover:not(:disabled):not([disabled-interactive])) .icon {
      color: ${ButtonVariantToken[variant].hover.iconColor};
    }
    :host(${selector}[toggle]:not([selected]):hover:not(:disabled):not([disabled-interactive])) .icon {
      color: ${ButtonVariantToken[variant].hover.unselectedIconColor};
    }
    :host(${selector}[toggle][selected]:hover:not(:disabled):not([disabled-interactive])) .icon {
      color: ${ButtonVariantToken[variant].hover.selectedIconColor};
    }
    :host(${selector}:is(:state(--pressed), :--pressed):not(:disabled):not([disabled-interactive])) .icon {
      color: ${ButtonVariantToken[variant].pressed.iconColor};
    }
    :host(
        ${selector}[toggle]:not([selected]):is(:state(--pressed), :--pressed):not(:disabled):not([disabled-interactive])
      )
      .icon {
      color: ${ButtonVariantToken[variant].pressed.unselectedIconColor};
    }
    :host(${selector}[toggle][selected]:is(:state(--pressed), :--pressed):not(:disabled):not([disabled-interactive]))
      .icon {
      color: ${ButtonVariantToken[variant].pressed.selectedIconColor};
    }
    :host(${selector}:disabled) .base,
    :host(${selector}[disabled-interactive]) .base {
      --m3e-elevation-level: ${ButtonVariantToken[variant].disabled.containerElevation ?? unsafeCSS("unset")};
      outline-color: ${ButtonVariantToken[variant].disabled.outlineColor ?? unsafeCSS("unset")};
      background-color: color-mix(
        in srgb,
        ${ButtonVariantToken[variant].disabled.containerColor} ${ButtonVariantToken[variant].disabled.containerOpacity},
        transparent
      );
    }
    :host(${selector}:disabled) .label,
    :host(${selector}[disabled-interactive]) .label {
      color: color-mix(
        in srgb,
        ${ButtonVariantToken[variant].disabled.labelTextColor} ${ButtonVariantToken[variant].disabled.labelTextOpacity},
        transparent
      );
    }
    :host(${selector}:disabled) .icon,
    :host(${selector}[disabled-interactive]) .icon {
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
    :host([variant="outlined"]:not([toggle][selected]):not(:disabled):not([disabled-interactive])) .base {
      outline-style: solid;
    }
  `,
];
