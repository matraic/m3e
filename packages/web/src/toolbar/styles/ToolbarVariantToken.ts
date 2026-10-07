import { CSSResult, unsafeCSS } from "lit";

import { DesignToken } from "@m3e/web/core";

import { ToolbarVariant } from "../ToolbarVariant";

/** @private */
type _ToolbarVariantToken = {
  containerColor: CSSResult;
  buttonContainerColor: CSSResult;
  selectedButtonContainerColor: CSSResult;
  iconColor: CSSResult;
  selectedIconColor: CSSResult;
  labelColor: CSSResult;
  selectedLabelColor: CSSResult;
  disabled: {
    iconColor: CSSResult;
    iconOpacity: CSSResult;
    labelColor: CSSResult;
    labelOpacity: CSSResult;
  };
  hover: {
    stateLayerColor: CSSResult;
    selectedStateLayerColor: CSSResult;
    stateLayerOpacity: CSSResult;
    iconColor: CSSResult;
    selectedIconColor: CSSResult;
    labelColor: CSSResult;
    selectedLabelColor: CSSResult;
  };
  focus: {
    iconColor: CSSResult;
    stateLayerColor: CSSResult;
    stateLayerOpacity: CSSResult;
    selectedStateLayerColor: CSSResult;
    selectedIconColor: CSSResult;
    labelColor: CSSResult;
    selectedLabelColor: CSSResult;
  };
  pressed: {
    iconColor: CSSResult;
    stateLayerColor: CSSResult;
    stateLayerOpacity: CSSResult;
    selectedStateLayerColor: CSSResult;
    selectedIconColor: CSSResult;
    labelColor: CSSResult;
    selectedLabelColor: CSSResult;
  };
};

/**
 * Component design tokens that control the appearance variants of `M3eToolbarElement`.
 * @internal
 */
export const ToolbarVariantToken: Record<ToolbarVariant, _ToolbarVariantToken> = {
  standard: {
    containerColor: unsafeCSS(
      `var(--m3e-toolbar-standard-container-color, var(--m3e-toolbar-container-color, ${DesignToken.color.surfaceContainer}))`,
    ),
    buttonContainerColor: unsafeCSS(
      `var(--m3e-toolbar-standard-button-container-color, var(--m3e-toolbar-button-container-color, ${DesignToken.color.surfaceContainer}))`,
    ),
    selectedButtonContainerColor: unsafeCSS(
      `var(--m3e-toolbar-standard-selected-button-container-color, var(--m3e-toolbar-selected-button-container-color, ${DesignToken.color.secondaryContainer}))`,
    ),
    iconColor: unsafeCSS(
      `var(--m3e-toolbar-standard-icon-color, var(--m3e-toolbar-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
    ),
    selectedIconColor: unsafeCSS(
      `var(--m3e-toolbar-standard-selected-icon-color, var(--m3e-toolbar-selected-icon-color, ${DesignToken.color.onSecondaryContainer}))`,
    ),
    labelColor: unsafeCSS(
      `var(--m3e-toolbar-standard-label-color, var(--m3e-toolbar-label-color, ${DesignToken.color.onSurfaceVariant}))`,
    ),
    selectedLabelColor: unsafeCSS(
      `var(--m3e-toolbar-standard-selected-label-color, var(--m3e-toolbar-selected-label-color, ${DesignToken.color.onSecondaryContainer}))`,
    ),
    disabled: {
      iconColor: unsafeCSS(
        `var(--m3e-toolbar-standard-disabled-icon-color, var(--m3e-toolbar-disabled-icon-color, ${DesignToken.color.onSurface}))`,
      ),
      iconOpacity: unsafeCSS(
        `var(--m3e-toolbar-standard-disabled-icon-opacity, var(--m3e-toolbar-disabled-icon-opacity, 38%))`,
      ),
      labelColor: unsafeCSS(
        `var(--m3e-toolbar-standard-disabled-label-color, var(--m3e-toolbar-disabled-label-color, ${DesignToken.color.onSurface}))`,
      ),
      labelOpacity: unsafeCSS(
        `var(--m3e-toolbar-standard-disabled-label-opacity, var(--m3e-toolbar-label-icon-opacity, 38%))`,
      ),
    },
    hover: {
      stateLayerColor: unsafeCSS(
        `var(--m3e-toolbar-standard-hover-state-layer-color, var(--m3e-toolbar-hover-state-layer-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-toolbar-standard-hover-selected-state-layer-color, var(--m3e-toolbar-hover-selected-state-layer-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-toolbar-standard-hover-state-layer-opacity, var(--m3e-toolbar-hover-state-layer-opacity, ${DesignToken.state.hoverStateLayerOpacity}))`,
      ),
      iconColor: unsafeCSS(
        `var(--m3e-toolbar-standard-hover-icon-color, var(--m3e-toolbar-hover-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),
      selectedIconColor: unsafeCSS(
        `var(--m3e-toolbar-standard-hover-selected-icon-color, var(--m3e-toolbar-hover-selected-icon-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),
      labelColor: unsafeCSS(
        `var(--m3e-toolbar-standard-hover-label-color, var(--m3e-toolbar-hover-label-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),
      selectedLabelColor: unsafeCSS(
        `var(--m3e-toolbar-standard-hover-selected-label-color, var(--m3e-toolbar-hover-selected-label-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),
    },
    focus: {
      stateLayerColor: unsafeCSS(
        `var(--m3e-toolbar-standard-focus-state-layer-color, var(--m3e-toolbar-focus-state-layer-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-toolbar-standard-focus-selected-state-layer-color, var(--m3e-toolbar-focus-selected-state-layer-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-toolbar-standard-focus-state-layer-opacity, var(--m3e-toolbar-focus-state-layer-opacity, ${DesignToken.state.focusStateLayerOpacity}))`,
      ),
      iconColor: unsafeCSS(
        `var(--m3e-toolbar-standard-focus-icon-color, var(--m3e-toolbar-focus-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),
      selectedIconColor: unsafeCSS(
        `var(--m3e-toolbar-standard-focus-selected-icon-color, var(--m3e-toolbar-focus-selected-icon-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),
      labelColor: unsafeCSS(
        `var(--m3e-toolbar-standard-focus-label-color, var(--m3e-toolbar-focus-label-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),
      selectedLabelColor: unsafeCSS(
        `var(--m3e-toolbar-standard-focus-selected-label-color, var(--m3e-toolbar-focus-selected-label-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),
    },
    pressed: {
      stateLayerColor: unsafeCSS(
        `var(--m3e-toolbar-standard-pressed-state-layer-color, var(--m3e-toolbar-pressed-state-layer-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-toolbar-standard-pressed-selected-state-layer-color, var(--m3e-toolbar-pressed-selected-state-layer-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-toolbar-standard-pressed-state-layer-opacity, var(--m3e-toolbar-pressed-state-layer-opacity, ${DesignToken.state.pressedStateLayerOpacity}))`,
      ),
      iconColor: unsafeCSS(
        `var(--m3e-toolbar-standard-pressed-icon-color, var(--m3e-toolbar-pressed-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),
      selectedIconColor: unsafeCSS(
        `var(--m3e-toolbar-standard-pressed-selected-icon-color, var(--m3e-toolbar-pressed-selected-icon-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),
      labelColor: unsafeCSS(
        `var(--m3e-toolbar-standard-pressed-label-color, var(--m3e-toolbar-pressed-label-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),
      selectedLabelColor: unsafeCSS(
        `var(--m3e-toolbar-standard-pressed-selected-label-color, var(--m3e-toolbar-pressed-selected-label-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),
    },
  },
  vibrant: {
    containerColor: unsafeCSS(
      `var(--m3e-toolbar-vibrant-container-color, var(--m3e-toolbar-container-color, ${DesignToken.color.primaryContainer}))`,
    ),
    buttonContainerColor: unsafeCSS(
      `var(--m3e-toolbar-vibrant-button-container-color, var(--m3e-toolbar-button-container-color, ${DesignToken.color.primaryContainer}))`,
    ),
    selectedButtonContainerColor: unsafeCSS(
      `var(--m3e-toolbar-vibrant-selected-button-container-color, var(--m3e-toolbar-selected-button-container-color, ${DesignToken.color.surfaceContainer}))`,
    ),
    iconColor: unsafeCSS(
      `var(--m3e-toolbar-vibrant-icon-color, var(--m3e-toolbar-icon-color, ${DesignToken.color.onPrimaryContainer}))`,
    ),
    selectedIconColor: unsafeCSS(
      `var(--m3e-toolbar-vibrant-selected-icon-color, var(--m3e-toolbar-selected-icon-color, ${DesignToken.color.onSurface}))`,
    ),
    labelColor: unsafeCSS(
      `var(--m3e-toolbar-vibrant-label-color, var(--m3e-toolbar-label-color, ${DesignToken.color.onPrimaryContainer}))`,
    ),
    selectedLabelColor: unsafeCSS(
      `var(--m3e-toolbar-vibrant-selected-label-color, var(--m3e-toolbar-selected-label-color, ${DesignToken.color.onSurface}))`,
    ),
    disabled: {
      iconColor: unsafeCSS(
        `var(--m3e-toolbar-vibrant-disabled-icon-color, var(--m3e-toolbar-disabled-icon-color, ${DesignToken.color.onSurface}))`,
      ),
      iconOpacity: unsafeCSS(
        `var(--m3e-toolbar-vibrant-disabled-icon-opacity, var(--m3e-toolbar-disabled-icon-opacity, 38%))`,
      ),
      labelColor: unsafeCSS(
        `var(--m3e-toolbar-vibrant-disabled-label-color, var(--m3e-toolbar-disabled-label-color, ${DesignToken.color.onSurface}))`,
      ),
      labelOpacity: unsafeCSS(
        `var(--m3e-toolbar-vibrant-disabled-label-opacity, var(--m3e-toolbar-label-icon-opacity, 38%))`,
      ),
    },
    hover: {
      stateLayerColor: unsafeCSS(
        `var(--m3e-toolbar-vibrant-hover-state-layer-color, var(--m3e-toolbar-hover-state-layer-color, ${DesignToken.color.onPrimaryContainer}))`,
      ),
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-toolbar-vibrant-hover-selected-state-layer-color, var(--m3e-toolbar-hover-selected-state-layer-color, ${DesignToken.color.onSurface}))`,
      ),
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-toolbar-vibrant-hover-state-layer-opacity, var(--m3e-toolbar-hover-state-layer-opacity, ${DesignToken.state.hoverStateLayerOpacity}))`,
      ),
      iconColor: unsafeCSS(
        `var(--m3e-toolbar-vibrant-hover-icon-color, var(--m3e-toolbar-hover-icon-color, ${DesignToken.color.onPrimaryContainer}))`,
      ),
      selectedIconColor: unsafeCSS(
        `var(--m3e-toolbar-vibrant-hover-selected-icon-color, var(--m3e-toolbar-hover-selected-icon-color, ${DesignToken.color.onSurface}))`,
      ),
      labelColor: unsafeCSS(
        `var(--m3e-toolbar-vibrant-hover-label-color, var(--m3e-toolbar-hover-label-color, ${DesignToken.color.onPrimaryContainer}))`,
      ),
      selectedLabelColor: unsafeCSS(
        `var(--m3e-toolbar-vibrant-hover-selected-label-color, var(--m3e-toolbar-hover-selected-label-color, ${DesignToken.color.onSurface}))`,
      ),
    },
    focus: {
      stateLayerColor: unsafeCSS(
        `var(--m3e-toolbar-vibrant-focus-state-layer-color, var(--m3e-toolbar-focus-state-layer-color, ${DesignToken.color.onPrimaryContainer}))`,
      ),
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-toolbar-vibrant-focus-selected-state-layer-color, var(--m3e-toolbar-focus-selected-state-layer-color, ${DesignToken.color.onSurface}))`,
      ),
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-toolbar-vibrant-focus-state-layer-opacity, var(--m3e-toolbar-focus-state-layer-opacity, ${DesignToken.state.focusStateLayerOpacity}))`,
      ),
      iconColor: unsafeCSS(
        `var(--m3e-toolbar-vibrant-focus-icon-color, var(--m3e-toolbar-focus-icon-color, ${DesignToken.color.onPrimaryContainer}))`,
      ),
      selectedIconColor: unsafeCSS(
        `var(--m3e-toolbar-vibrant-focus-selected-icon-color, var(--m3e-toolbar-focus-selected-icon-color, ${DesignToken.color.onSurface}))`,
      ),
      labelColor: unsafeCSS(
        `var(--m3e-toolbar-vibrant-focus-label-color, var(--m3e-toolbar-focus-label-color, ${DesignToken.color.onPrimaryContainer}))`,
      ),
      selectedLabelColor: unsafeCSS(
        `var(--m3e-toolbar-vibrant-focus-selected-label-color, var(--m3e-toolbar-focus-selected-label-color, ${DesignToken.color.onSurface}))`,
      ),
    },
    pressed: {
      stateLayerColor: unsafeCSS(
        `var(--m3e-toolbar-vibrant-pressed-state-layer-color, var(--m3e-toolbar-pressed-state-layer-color, ${DesignToken.color.onPrimaryContainer}))`,
      ),
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-toolbar-vibrant-pressed-selected-state-layer-color, var(--m3e-toolbar-pressed-selected-state-layer-color, ${DesignToken.color.onSurface}))`,
      ),
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-toolbar-vibrant-pressed-state-layer-opacity, var(--m3e-toolbar-pressed-state-layer-opacity, ${DesignToken.state.pressedStateLayerOpacity}))`,
      ),
      iconColor: unsafeCSS(
        `var(--m3e-toolbar-vibrant-pressed-icon-color, var(--m3e-toolbar-pressed-icon-color, ${DesignToken.color.onPrimaryContainer}))`,
      ),
      selectedIconColor: unsafeCSS(
        `var(--m3e-toolbar-vibrant-pressed-selected-icon-color, var(--m3e-toolbar-pressed-selected-icon-color, ${DesignToken.color.onSurface}))`,
      ),
      labelColor: unsafeCSS(
        `var(--m3e-toolbar-vibrant-pressed-label-color, var(--m3e-toolbar-pressed-label-color, ${DesignToken.color.onPrimaryContainer}))`,
      ),
      selectedLabelColor: unsafeCSS(
        `var(--m3e-toolbar-vibrant-pressed-selected-label-color, var(--m3e-toolbar-pressed-selected-label-color, ${DesignToken.color.onSurface}))`,
      ),
    },
  },
} as const;
