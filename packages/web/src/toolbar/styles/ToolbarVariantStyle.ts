import { CSSResult, CSSResultGroup, unsafeCSS } from "lit";

import { ToolbarVariant } from "../ToolbarVariant";
import { ToolbarVariantToken } from "./ToolbarVariantToken";

/** @private */
function iconButtonStateStyle(
  variant: ToolbarVariant,
  prefix: string,
  state: "focus" | "hover" | "pressed",
): CSSResult {
  return unsafeCSS(`
    ${prefix}-${state}-state-layer-color: ${ToolbarVariantToken[variant].hover.stateLayerColor};
    ${prefix}-${state}-unselected-state-layer-color: ${ToolbarVariantToken[variant].hover.stateLayerColor};
    ${prefix}-${state}-selected-state-layer-color: ${ToolbarVariantToken[variant].hover.selectedStateLayerColor};
    ${prefix}-${state}-state-layer-opacity: ${ToolbarVariantToken[variant].hover.stateLayerOpacity};
    ${prefix}-${state}-icon-color: ${ToolbarVariantToken[variant].hover.iconColor};
    ${prefix}-${state}-unselected-icon-color: ${ToolbarVariantToken[variant].hover.iconColor};
    ${prefix}-${state}-selected-icon-color: ${ToolbarVariantToken[variant].hover.selectedIconColor};`);
}

/** @private */
function iconButtonStyle(variant: ToolbarVariant) {
  const prefix = `--m3e-standard-icon-button`;
  return unsafeCSS(`
      ${prefix}-container-color: ${ToolbarVariantToken[variant].buttonContainerColor};
      ${prefix}-unselected-container-color: ${ToolbarVariantToken[variant].buttonContainerColor};
      ${prefix}-selected-container-color: ${ToolbarVariantToken[variant].selectedButtonContainerColor};
      ${prefix}-icon-color: ${ToolbarVariantToken[variant].iconColor};
      ${prefix}-unselected-icon-color: ${ToolbarVariantToken[variant].iconColor};
      ${prefix}-selected-icon-color: ${ToolbarVariantToken[variant].selectedIconColor};
      ${prefix}-disabled-icon-color: ${ToolbarVariantToken[variant].disabled.iconColor};
      ${prefix}-disabled-icon-opacity: ${ToolbarVariantToken[variant].disabled.iconOpacity};
      ${prefix}-disabled-container-color: transparent;
      ${iconButtonStateStyle(variant, prefix, "hover")}
      ${iconButtonStateStyle(variant, prefix, "focus")}
      ${iconButtonStateStyle(variant, prefix, "pressed")}
  `);
}

/** @private */
function buttonStateStyle(variant: ToolbarVariant, prefix: string, state: "focus" | "hover" | "pressed"): CSSResult {
  return unsafeCSS(`
    ${prefix}-${state}-state-layer-color: ${ToolbarVariantToken[variant].hover.stateLayerColor};
    ${prefix}-${state}-unselected-state-layer-color: ${ToolbarVariantToken[variant].hover.stateLayerColor};
    ${prefix}-${state}-selected-state-layer-color: ${ToolbarVariantToken[variant].hover.selectedStateLayerColor};
    ${prefix}-${state}-state-layer-opacity: ${ToolbarVariantToken[variant].hover.stateLayerOpacity};
    ${prefix}-${state}-icon-color: ${ToolbarVariantToken[variant].hover.iconColor};
    ${prefix}-${state}-unselected-icon-color: ${ToolbarVariantToken[variant].hover.iconColor};
    ${prefix}-${state}-selected-icon-color: ${ToolbarVariantToken[variant].hover.selectedIconColor};
    ${prefix}-${state}-label-text-color: ${ToolbarVariantToken[variant].hover.labelColor};
    ${prefix}-${state}-unselected-label-text-color: ${ToolbarVariantToken[variant].hover.labelColor};
    ${prefix}-${state}-selected-label-text-color: ${ToolbarVariantToken[variant].hover.selectedLabelColor};`);
}

/** @private */
function buttonStyle(variant: ToolbarVariant) {
  const prefix = `--m3e-text-button`;
  return unsafeCSS(`
      ${prefix}-container-color: ${ToolbarVariantToken[variant].buttonContainerColor};
      ${prefix}-unselected-container-color: ${ToolbarVariantToken[variant].buttonContainerColor};
      ${prefix}-selected-container-color: ${ToolbarVariantToken[variant].selectedButtonContainerColor};
      ${prefix}-icon-color: ${ToolbarVariantToken[variant].iconColor};
      ${prefix}-unselected-icon-color: ${ToolbarVariantToken[variant].iconColor};
      ${prefix}-selected-icon-color: ${ToolbarVariantToken[variant].selectedIconColor};
      ${prefix}-label-text-color: ${ToolbarVariantToken[variant].labelColor};
      ${prefix}-unselected-label-text-color: ${ToolbarVariantToken[variant].labelColor};
      ${prefix}-selected-label-text-color: ${ToolbarVariantToken[variant].selectedLabelColor};
      ${prefix}-disabled-icon-color: ${ToolbarVariantToken[variant].disabled.iconColor};
      ${prefix}-disabled-icon-opacity: ${ToolbarVariantToken[variant].disabled.iconOpacity};
      ${prefix}-disabled-label-text-color: ${ToolbarVariantToken[variant].disabled.labelColor};
      ${prefix}-disabled-label-text-opacity: ${ToolbarVariantToken[variant].disabled.labelOpacity};
      ${prefix}-disabled-container-color: transparent;
      ${buttonStateStyle(variant, prefix, "hover")}
      ${buttonStateStyle(variant, prefix, "focus")}
      ${buttonStateStyle(variant, prefix, "pressed")}
  `);
}

/** @private */
function toolbarVariantStyle(variant: ToolbarVariant): CSSResult {
  const selector = unsafeCSS(`:is(:state(--${variant}), :--${variant})`);
  return unsafeCSS(`
    :host(${selector}) .state-layer {
      background-color: ${ToolbarVariantToken[variant].containerColor};
    }
    :host(${selector}) .base {
      color: ${ToolbarVariantToken[variant].labelColor};
      ${iconButtonStyle(variant)}
      ${buttonStyle(variant)}
    }
  `);
}

/**
 * Appearance variant styles for `M3eToolbarElement`.
 * @internal
 */
export const ToolbarVariantStyle: CSSResultGroup = [toolbarVariantStyle("standard"), toolbarVariantStyle("vibrant")];
