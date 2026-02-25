import { CSSResult, unsafeCSS } from "lit";

import { DesignToken } from "@m3e/web/core";

import { ButtonVariant } from "../ButtonVariant";

/** @private */
type _ButtonVariantToken = {
  labelTextColor: CSSResult;
  iconColor: CSSResult;
  containerColor?: CSSResult;
  containerElevation?: CSSResult;
  outlineColor?: CSSResult;
  unselectedLabelTextColor: CSSResult;
  unselectedIconColor: CSSResult;
  unselectedContainerColor?: CSSResult;
  selectedLabelTextColor: CSSResult;
  selectedIconColor: CSSResult;
  selectedContainerColor?: CSSResult;
  disabled: {
    containerColor: CSSResult;
    containerOpacity: CSSResult;
    iconColor: CSSResult;
    iconOpacity: CSSResult;
    labelTextColor: CSSResult;
    labelTextOpacity: CSSResult;
    containerElevation?: CSSResult;
    outlineColor?: CSSResult;
  };
  hover: {
    iconColor: CSSResult;
    labelTextColor: CSSResult;
    stateLayerColor: CSSResult;
    stateLayerOpacity: CSSResult;
    containerElevation?: CSSResult;
    outlineColor?: CSSResult;
    unselectedLabelTextColor: CSSResult;
    unselectedIconColor: CSSResult;
    unselectedStateLayerColor: CSSResult;
    selectedLabelTextColor: CSSResult;
    selectedIconColor: CSSResult;
    selectedStateLayerColor: CSSResult;
  };
  focus: {
    iconColor: CSSResult;
    labelTextColor: CSSResult;
    stateLayerColor: CSSResult;
    stateLayerOpacity: CSSResult;
    containerElevation?: CSSResult;
    outlineColor?: CSSResult;
    unselectedLabelTextColor: CSSResult;
    unselectedIconColor: CSSResult;
    unselectedStateLayerColor: CSSResult;
    selectedLabelTextColor: CSSResult;
    selectedIconColor: CSSResult;
    selectedStateLayerColor: CSSResult;
  };
  pressed: {
    iconColor: CSSResult;
    labelTextColor: CSSResult;
    stateLayerColor: CSSResult;
    stateLayerOpacity: CSSResult;
    containerElevation?: CSSResult;
    outlineColor?: CSSResult;
    unselectedLabelTextColor: CSSResult;
    unselectedIconColor: CSSResult;
    unselectedStateLayerColor: CSSResult;
    selectedLabelTextColor: CSSResult;
    selectedIconColor: CSSResult;
    selectedStateLayerColor: CSSResult;
  };
};

/**
 * Component design tokens that control the appearance variants of `M3eButtonElement`.
 * @internal
 */
export const ButtonVariantToken: Record<ButtonVariant, _ButtonVariantToken> = {
  /** Design tokens that control the `elevated` variant. */
  elevated: {
    /** Default label color. */
    labelTextColor: unsafeCSS(
      `var(--m3e-elevated-button-label-text-color, var(--m3e-button-label-text-color, ${DesignToken.color.primary}))`,
    ),

    /** Default icon color. */
    iconColor: unsafeCSS(
      `var(--m3e-elevated-button-icon-color, var(--m3e-button-icon-color, ${DesignToken.color.primary}))`,
    ),

    /** Default container background color. */
    containerColor: unsafeCSS(
      `var(--m3e-elevated-button-container-color, var(--m3e-button-container-color, ${DesignToken.color.surfaceContainerLow}))`,
    ),

    /** Resting elevation. */
    containerElevation: unsafeCSS(
      `var(--m3e-elevated-button-container-elevation, var(--m3e-button-container-elevation, ${DesignToken.elevation.level1}))`,
    ),

    /** Unselected label color. */
    unselectedLabelTextColor: unsafeCSS(
      `var(--m3e-elevated-button-unselected-label-text-color, var(--m3e-button-unselected-label-text-color, ${DesignToken.color.primary}))`,
    ),

    /** Unselected icon color. */
    unselectedIconColor: unsafeCSS(
      `var(--m3e-elevated-button-unselected-icon-color, var(--m3e-button-unselected-icon-color, ${DesignToken.color.primary}))`,
    ),

    /** Unselected container background color. */
    unselectedContainerColor: unsafeCSS(
      `var(--m3e-elevated-button-unselected-container-color, var(--m3e-button-unselected-container-color, ${DesignToken.color.surfaceContainerLow}))`,
    ),

    /** Selected label color. */
    selectedLabelTextColor: unsafeCSS(
      `var(--m3e-elevated-button-selected-label-text-color, var(--m3e-button-selected-label-text-color, ${DesignToken.color.onPrimary}))`,
    ),

    /** Selected icon color. */
    selectedIconColor: unsafeCSS(
      `var(--m3e-elevated-button-selected-icon-color, var(--m3e-button-selected-icon-color, ${DesignToken.color.onPrimary}))`,
    ),

    /** Selected container background color. */
    selectedContainerColor: unsafeCSS(
      `var(--m3e-elevated-button-selected-container-color, var(--m3e-button-selected-container-color, ${DesignToken.color.primary}))`,
    ),

    /** Design tokens that control disabled state. */
    disabled: {
      /** Container background color when disabled. */
      containerColor: unsafeCSS(
        `var(--m3e-elevated-button-disabled-container-color, var(--m3e-button-disabled-container-color, ${DesignToken.color.onSurface}))`,
      ),

      /** Opacity of container when disabled. */
      containerOpacity: unsafeCSS(
        `var(--m3e-elevated-button-disabled-container-opacity, var(--m3e-button-disabled-container-opacity, 10%))`,
      ),

      /** Icon color when disabled. */
      iconColor: unsafeCSS(
        `var(--m3e-elevated-button-disabled-icon-color, var(--m3e-button-disabled-icon-color, ${DesignToken.color.onSurface}))`,
      ),

      /** Icon opacity when disabled. */
      iconOpacity: unsafeCSS(
        `var(--m3e-elevated-button-disabled-icon-opacity, var(--m3e-button-disabled-icon-opacity, 38%))`,
      ),

      /** Label color when disabled. */
      labelTextColor: unsafeCSS(
        `var(--m3e-elevated-button-disabled-label-text-color, var(--m3e-button-disabled-label-text-color, ${DesignToken.color.onSurface}))`,
      ),

      /** Label opacity when disabled. */
      labelTextOpacity: unsafeCSS(
        `var(--m3e-elevated-button-disabled-label-text-opacity, var(--m3e-button-disabled-label-text-opacity, 38%))`,
      ),

      /** Elevation when disabled. */
      containerElevation: unsafeCSS(
        `var(--m3e-elevated-button-disabled-container-elevation, var(--m3e-button-disabled-container-elevation, ${DesignToken.elevation.level0}))`,
      ),
    },

    /** Design tokens that control hover state. */
    hover: {
      /** Icon color on hover. */
      iconColor: unsafeCSS(
        `var(--m3e-elevated-button-hover-icon-color, var(--m3e-button-hover-icon-color, ${DesignToken.color.primary}))`,
      ),

      /** Label color on hover. */
      labelTextColor: unsafeCSS(
        `var(--m3e-elevated-button-hover-label-text-color, var(--m3e-button-hover-label-text-color, ${DesignToken.color.primary}))`,
      ),

      /** State layer color on hover. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-elevated-button-hover-state-layer-color, var(--m3e-button-hover-state-layer-color, ${DesignToken.color.primary}))`,
      ),

      /** State layer opacity on hover. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-elevated-button-hover-state-layer-opacity, var(--m3e-button-hover-state-layer-opacity, ${DesignToken.state.hoverStateLayerOpacity}))`,
      ),

      /** Elevation on hover. */
      containerElevation: unsafeCSS(
        `var(--m3e-elevated-button-hover-container-elevation, var(--m3e-button-hover-container-elevation, ${DesignToken.elevation.level2}))`,
      ),

      /** Unselected icon color on hover. */
      unselectedIconColor: unsafeCSS(
        `var(--m3e-elevated-button-hover-unselected-icon-color, var(--m3e-button-hover-unselected-icon-color, ${DesignToken.color.primary}))`,
      ),

      /** Unselected label color on hover. */
      unselectedLabelTextColor: unsafeCSS(
        `var(--m3e-elevated-button-hover-unselected-label-text-color, var(--m3e-button-hover-unselected-label-text-color, ${DesignToken.color.primary}))`,
      ),

      /** Unselected state layer color on hover. */
      unselectedStateLayerColor: unsafeCSS(
        `var(--m3e-elevated-button-hover-unselected-state-layer-color, var(--m3e-button-hover-unselected-state-layer-color, ${DesignToken.color.primary}))`,
      ),

      /** Selected icon color on hover. */
      selectedIconColor: unsafeCSS(
        `var(--m3e-elevated-button-hover-selected-icon-color, var(--m3e-button-hover-selected-icon-color, ${DesignToken.color.onPrimary}))`,
      ),

      /** Selected label color on hover. */
      selectedLabelTextColor: unsafeCSS(
        `var(--m3e-elevated-button-hover-selected-label-text-color, var(--m3e-button-hover-selected-label-text-color, ${DesignToken.color.onPrimary}))`,
      ),

      /** Selected ripple color on hover. */
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-elevated-button-hover-selected-state-layer-color, var(--m3e-button-hover-selected-state-layer-color, ${DesignToken.color.onPrimary}))`,
      ),
    },

    /** Design tokens that control focus state. */
    focus: {
      /** Icon color on focus. */
      iconColor: unsafeCSS(
        `var(--m3e-elevated-button-focus-icon-color, var(--m3e-button-focus-icon-color, ${DesignToken.color.primary}))`,
      ),

      /** Label color on focus. */
      labelTextColor: unsafeCSS(
        `var(--m3e-elevated-button-focus-label-text-color, var(--m3e-button-focus-label-text-color, ${DesignToken.color.primary}))`,
      ),

      /** State layer color on focus. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-elevated-button-focus-state-layer-color, var(--m3e-button-focus-state-layer-color, ${DesignToken.color.primary}))`,
      ),

      /**State layer opacity on focus. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-elevated-button-focus-state-layer-opacity, var(--m3e-button-focus-state-layer-opacity, ${DesignToken.state.focusStateLayerOpacity}))`,
      ),

      /** Elevation on focus. */
      containerElevation: unsafeCSS(
        `var(--m3e-elevated-button-focus-container-elevation, var(--m3e-button-focus-container-elevation, ${DesignToken.elevation.level1}))`,
      ),

      /** Unselected label color on focus. */
      unselectedLabelTextColor: unsafeCSS(
        `var(--m3e-elevated-button-focus-unselected-label-text-color, var(--m3e-button-focus-unselected-label-text-color, ${DesignToken.color.primary}))`,
      ),

      /** Unselected icon color on focus. */
      unselectedIconColor: unsafeCSS(
        `var(--m3e-elevated-button-focus-unselected-icon-color, var(--m3e-button-focus-unselected-icon-color, ${DesignToken.color.primary}))`,
      ),

      /** Unselected ripple color on focus. */
      unselectedStateLayerColor: unsafeCSS(
        `var(--m3e-elevated-button-focus-unselected-state-layer-color, var(--m3e-button-focus-unselected-state-layer-color, ${DesignToken.color.primary}))`,
      ),

      /** Selected icon color on focus. */
      selectedIconColor: unsafeCSS(
        `var(--m3e-elevated-button-focus-selected-icon-color, var(--m3e-button-focus-selected-icon-color, ${DesignToken.color.onPrimary}))`,
      ),

      /** Selected label color on focus. */
      selectedLabelTextColor: unsafeCSS(
        `var(--m3e-elevated-button-focus-selected-label-text-color, var(--m3e-button-focus-selected-label-text-color, ${DesignToken.color.onPrimary}))`,
      ),

      /** Selected ripple color on focus. */
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-elevated-button-focus-selected-state-layer-color, var(--m3e-button-focus-selected-state-layer-color, ${DesignToken.color.onPrimary}))`,
      ),
    },

    /** Design tokens that control pressed state. */
    pressed: {
      /** Icon color on pressed. */
      iconColor: unsafeCSS(
        `var(--m3e-elevated-button-pressed-icon-color, var(--m3e-button-pressed-icon-color, ${DesignToken.color.primary}))`,
      ),

      /** Label color on pressed. */
      labelTextColor: unsafeCSS(
        `var(--m3e-elevated-button-pressed-label-text-color, var(--m3e-button-pressed-label-text-color, ${DesignToken.color.primary}))`,
      ),

      /** State layer color on pressed. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-elevated-button-pressed-state-layer-color, var(--m3e-button-pressed-state-layer-color, ${DesignToken.color.primary}))`,
      ),

      /** State layer opacity on pressed. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-elevated-button-pressed-state-layer-opacity, var(--m3e-button-pressed-state-layer-opacity, ${DesignToken.state.pressedStateLayerOpacity}))`,
      ),

      /** Elevation on pressed. */
      containerElevation: unsafeCSS(
        `var(--m3e-elevated-button-pressed-container-elevation, var(--m3e-button-pressed-container-elevation, ${DesignToken.elevation.level1}))`,
      ),

      /** Unselected label color on pressed. */
      unselectedLabelTextColor: unsafeCSS(
        `var(--m3e-elevated-button-pressed-unselected-label-text-color, var(--m3e-button-pressed-unselected-label-text-color, ${DesignToken.color.primary}))`,
      ),

      /** Unselected icon color on pressed. */
      unselectedIconColor: unsafeCSS(
        `var(--m3e-elevated-button-pressed-unselected-icon-color, var(--m3e-button-pressed-unselected-icon-color, ${DesignToken.color.primary}))`,
      ),

      /** Unselected ripple color on pressed. */
      unselectedStateLayerColor: unsafeCSS(
        `var(--m3e-elevated-button-pressed-unselected-state-layer-color, var(--m3e-button-pressed-unselected-state-layer-color, ${DesignToken.color.primary}))`,
      ),

      /** Selected icon color on pressed. */
      selectedIconColor: unsafeCSS(
        `var(--m3e-elevated-button-pressed-selected-icon-color, var(--m3e-button-pressed-selected-icon-color, ${DesignToken.color.onPrimary}))`,
      ),

      /** Selected label color on pressed. */
      selectedLabelTextColor: unsafeCSS(
        `var(--m3e-elevated-button-pressed-selected-label-text-color, var(--m3e-button-pressed-selected-label-text-color, ${DesignToken.color.onPrimary}))`,
      ),

      /** Selected ripple color on pressed. */
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-elevated-button-pressed-selected-state-layer-color, var(--m3e-button-pressed-selected-state-layer-color, ${DesignToken.color.onPrimary}))`,
      ),
    },
  },

  /** Design tokens that control the `outlined` variant. */
  outlined: {
    /** Default label color. */
    labelTextColor: unsafeCSS(
      `var(--m3e-outlined-button-label-text-color, var(--m3e-button-label-text-color, ${DesignToken.color.onSurfaceVariant}))`,
    ),

    /** Default icon color. */
    iconColor: unsafeCSS(
      `var(--m3e-outlined-button-icon-color, var(--m3e-button-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
    ),

    /** Default outline color. */
    outlineColor: unsafeCSS(
      `var(--m3e-outlined-button-outline-color, var(--m3e-button-outline-color, ${DesignToken.color.outlineVariant}))`,
    ),

    /** Unselected label color. */
    unselectedLabelTextColor: unsafeCSS(
      `var(--m3e-outlined-button-unselected-label-text-color, var(--m3e-button-unselected-label-text-color, ${DesignToken.color.onSurfaceVariant}))`,
    ),

    /** Unselected icon color. */
    unselectedIconColor: unsafeCSS(
      `var(--m3e-outlined-button-unselected-icon-color, var(--m3e-button-unselected-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
    ),

    /** Selected label color. */
    selectedLabelTextColor: unsafeCSS(
      `var(--m3e-outlined-button-selected-label-text-color, var(--m3e-button-selected-label-text-color, ${DesignToken.color.inverseOnSurface}))`,
    ),

    /** Selected icon color. */
    selectedIconColor: unsafeCSS(
      `var(--m3e-outlined-button-selected-icon-color, var(--m3e-button-selected-icon-color, ${DesignToken.color.inverseOnSurface}))`,
    ),

    /** Selected container background color. */
    selectedContainerColor: unsafeCSS(
      `var(--m3e-outlined-button-selected-container-color, var(--m3e-button-selected-container-color, ${DesignToken.color.inverseSurface}))`,
    ),

    /** Design tokens that control disabled state. */
    disabled: {
      /** Container background color when disabled. */
      containerColor: unsafeCSS(
        `var(--m3e-outlined-button-disabled-container-color, var(--m3e-button-disabled-container-color, ${DesignToken.color.onSurface}))`,
      ),

      /** Opacity of container when disabled. */
      containerOpacity: unsafeCSS(
        `var(--m3e-outlined-button-disabled-container-opacity, var(--m3e-button-disabled-container-opacity, 10%))`,
      ),

      /** Icon color when disabled. */
      iconColor: unsafeCSS(
        `var(--m3e-outlined-button-disabled-icon-color, var(--m3e-button-disabled-icon-color, ${DesignToken.color.onSurface}))`,
      ),

      /** Icon opacity when disabled. */
      iconOpacity: unsafeCSS(
        `var(--m3e-outlined-button-disabled-icon-opacity, var(--m3e-button-disabled-icon-opacity, 38%))`,
      ),

      /** Label color when disabled. */
      labelTextColor: unsafeCSS(
        `var(--m3e-outlined-button-disabled-label-text-color, var(--m3e-button-disabled-label-text-color, ${DesignToken.color.onSurface}))`,
      ),

      /** Label opacity when disabled. */
      labelTextOpacity: unsafeCSS(
        `var(--m3e-outlined-button-disabled-label-text-opacity, var(--m3e-button-disabled-label-text-opacity, 38%))`,
      ),

      /** Outline color when disabled. */
      outlineColor: unsafeCSS(
        `var(--m3e-outlined-button-disabled-outline-color, var(--m3e-button-disabled-outline-color, ${DesignToken.color.outlineVariant}))`,
      ),
    },

    /** Design tokens that control hover state. */
    hover: {
      /** Icon color on hover. */
      iconColor: unsafeCSS(
        `var(--m3e-outlined-button-hover-icon-color, var(--m3e-button-hover-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Label color on hover. */
      labelTextColor: unsafeCSS(
        `var(--m3e-outlined-button-hover-label-text-color, var(--m3e-button-hover-label-text-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Outline color on hover. */
      outlineColor: unsafeCSS(
        `var(--m3e-outlined-button-hover-outline-color, var(--m3e-button-hover-outline-color, ${DesignToken.color.outlineVariant}))`,
      ),

      /** State layer color on hover. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-outlined-button-hover-state-layer-color, var(--m3e-button-hover-state-layer-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** State layer opacity on hover. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-outlined-button-hover-state-layer-opacity, var(--m3e-button-hover-state-layer-opacity, ${DesignToken.state.hoverStateLayerOpacity}))`,
      ),

      /** Unselected icon color on hover. */
      unselectedIconColor: unsafeCSS(
        `var(--m3e-outlined-button-hover-unselected-icon-color, var(--m3e-button-hover-unselected-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Unselected label color on hover. */
      unselectedLabelTextColor: unsafeCSS(
        `var(--m3e-outlined-button-hover-unselected-label-text-color, var(--m3e-button-hover-unselected-label-text-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Unselected state layer color on hover. */
      unselectedStateLayerColor: unsafeCSS(
        `var(--m3e-outlined-button-hover-unselected-state-layer-color, var(--m3e-button-hover-unselected-state-layer-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Selected icon color on hover. */
      selectedIconColor: unsafeCSS(
        `var(--m3e-outlined-button-hover-selected-icon-color, var(--m3e-button-hover-selected-icon-color, ${DesignToken.color.inverseOnSurface}))`,
      ),

      /** Selected label color on hover. */
      selectedLabelTextColor: unsafeCSS(
        `var(--m3e-outlined-button-hover-selected-label-text-color, var(--m3e-button-hover-selected-label-text-color, ${DesignToken.color.inverseOnSurface}))`,
      ),

      /** Selected state layer color on hover. */
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-outlined-button-hover-selected-state-layer-color, var(--m3e-button-hover-selected-state-layer-color, ${DesignToken.color.inverseOnSurface}))`,
      ),
    },

    /** Design tokens that control focus state. */
    focus: {
      /** Icon color on focus. */
      iconColor: unsafeCSS(
        `var(--m3e-outlined-button-focus-icon-color, var(--m3e-button-focus-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Label color on focus. */
      labelTextColor: unsafeCSS(
        `var(--m3e-outlined-button-focus-label-text-color, var(--m3e-button-focus-label-text-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Outline color on focus. */
      outlineColor: unsafeCSS(
        `var(--m3e-outlined-button-focus-outline-color, var(--m3e-button-focus-outline-color, ${DesignToken.color.outlineVariant}))`,
      ),

      /** State layer color on focus. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-outlined-button-focus-state-layer-color, var(--m3e-button-focus-state-layer-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /**State layer opacity on focus. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-outlined-button-focus-state-layer-opacity, var(--m3e-button-focus-state-layer-opacity, ${DesignToken.state.focusStateLayerOpacity}))`,
      ),

      /** Unselected icon color on focus. */
      unselectedIconColor: unsafeCSS(
        `var(--m3e-outlined-button-focus-unselected-icon-color, var(--m3e-button-focus-unselected-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Unselected label color on focus. */
      unselectedLabelTextColor: unsafeCSS(
        `var(--m3e-outlined-button-focus-unselected-label-text-color, var(--m3e-button-focus-unselected-label-text-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Unselected state layer color on focus. */
      unselectedStateLayerColor: unsafeCSS(
        `var(--m3e-outlined-button-focus-unselected-state-layer-color, var(--m3e-button-focus-unselected-state-layer-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Selected icon color on focus. */
      selectedIconColor: unsafeCSS(
        `var(--m3e-outlined-button-focus-selected-icon-color, var(--m3e-button-focus-selected-icon-color, ${DesignToken.color.inverseOnSurface}))`,
      ),

      /** Selected label color on focus. */
      selectedLabelTextColor: unsafeCSS(
        `var(--m3e-outlined-button-focus-selected-label-text-color, var(--m3e-button-focus-selected-label-text-color, ${DesignToken.color.inverseOnSurface}))`,
      ),

      /** Selected state layer color on focus. */
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-outlined-button-focus-selected-state-layer-color, var(--m3e-button-focus-selected-state-layer-color, ${DesignToken.color.inverseOnSurface}))`,
      ),
    },

    /** Design tokens that control pressed state. */
    pressed: {
      /** Icon color on pressed. */
      iconColor: unsafeCSS(
        `var(--m3e-outlined-button-pressed-icon-color, var(--m3e-button-pressed-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Label color on pressed. */
      labelTextColor: unsafeCSS(
        `var(--m3e-outlined-button-pressed-label-text-color, var(--m3e-button-pressed-label-text-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Outline color on pressed. */
      outlineColor: unsafeCSS(
        `var(--m3e-outlined-button-pressed-outline-color, var(--m3e-button-pressed-outline-color, ${DesignToken.color.outlineVariant}))`,
      ),

      /** State layer color on pressed. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-outlined-button-pressed-state-layer-color, var(--m3e-button-pressed-state-layer-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** State layer opacity on pressed. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-outlined-button-pressed-state-layer-opacity, var(--m3e-button-pressed-state-layer-opacity, ${DesignToken.state.pressedStateLayerOpacity}))`,
      ),

      /** Unselected icon color on pressed. */
      unselectedIconColor: unsafeCSS(
        `var(--m3e-outlined-button-pressed-unselected-icon-color, var(--m3e-button-pressed-unselected-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Unselected label color on pressed. */
      unselectedLabelTextColor: unsafeCSS(
        `var(--m3e-outlined-button-pressed-unselected-label-text-color, var(--m3e-button-pressed-unselected-label-text-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Unselected state layer color on pressed. */
      unselectedStateLayerColor: unsafeCSS(
        `var(--m3e-outlined-button-pressed-unselected-state-layer-color, var(--m3e-button-pressed-unselected-state-layer-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Selected icon color on pressed. */
      selectedIconColor: unsafeCSS(
        `var(--m3e-outlined-button-pressed-selected-icon-color, var(--m3e-button-pressed-selected-icon-color, ${DesignToken.color.inverseOnSurface}))`,
      ),

      /** Selected label color on pressed. */
      selectedLabelTextColor: unsafeCSS(
        `var(--m3e-outlined-button-pressed-selected-label-text-color, var(--m3e-button-pressed-selected-label-text-color, ${DesignToken.color.inverseOnSurface}))`,
      ),

      /** Selected state layer color on pressed. */
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-outlined-button-pressed-selected-state-layer-color, var(--m3e-button-pressed-selected-state-layer-color, ${DesignToken.color.inverseOnSurface}))`,
      ),
    },
  },

  /** Design tokens that control the `filled` variant. */
  filled: {
    /** Default label color. */
    labelTextColor: unsafeCSS(
      `var(--m3e-filled-button-label-text-color, var(--m3e-button-label-text-color, ${DesignToken.color.onPrimary}))`,
    ),

    /** Default icon color. */
    iconColor: unsafeCSS(
      `var(--m3e-filled-button-icon-color, var(--m3e-button-icon-color, ${DesignToken.color.onPrimary}))`,
    ),

    /** Default container background color. */
    containerColor: unsafeCSS(
      `var(--m3e-filled-button-container-color, var(--m3e-button-container-color, ${DesignToken.color.primary}))`,
    ),

    /** Resting elevation. */
    containerElevation: unsafeCSS(
      `var(--m3e-filled-button-container-elevation, var(--m3e-button-container-elevation, ${DesignToken.elevation.level0}))`,
    ),

    /** Unselected label color. */
    unselectedLabelTextColor: unsafeCSS(
      `var(--m3e-filled-button-unselected-label-text-color, var(--m3e-button-unselected-label-text-color, ${DesignToken.color.onSurfaceVariant}))`,
    ),

    /** Unselected icon color. */
    unselectedIconColor: unsafeCSS(
      `var(--m3e-filled-button-unselected-icon-color, var(--m3e-button-unselected-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
    ),

    /** Unselected container background color. */
    unselectedContainerColor: unsafeCSS(
      `var(--m3e-filled-button-unselected-container-color, var(--m3e-button-unselected-container-color, ${DesignToken.color.surfaceContainer}))`,
    ),

    /** Selected label color. */
    selectedLabelTextColor: unsafeCSS(
      `var(--m3e-filled-button-selected-label-text-color, var(--m3e-button-selected-label-text-color, ${DesignToken.color.onPrimary}))`,
    ),

    /** Selected icon color. */
    selectedIconColor: unsafeCSS(
      `var(--m3e-filled-button-selected-icon-color, var(--m3e-button-selected-icon-color, ${DesignToken.color.onPrimary}))`,
    ),

    /** Selected container background color. */
    selectedContainerColor: unsafeCSS(
      `var(--m3e-filled-button-selected-container-color, var(--m3e-button-selected-container-color, ${DesignToken.color.primary}))`,
    ),

    /** Design tokens that control disabled state. */
    disabled: {
      /** Container background color when disabled. */
      containerColor: unsafeCSS(
        `var(--m3e-filled-button-disabled-container-color, var(--m3e-button-disabled-container-color, ${DesignToken.color.onSurface}))`,
      ),

      /** Opacity of container when disabled. */
      containerOpacity: unsafeCSS(
        `var(--m3e-filled-button-disabled-container-opacity, var(--m3e-button-disabled-container-opacity, 10%))`,
      ),

      /** Icon color when disabled. */
      iconColor: unsafeCSS(
        `var(--m3e-filled-button-disabled-icon-color, var(--m3e-button-disabled-icon-color, ${DesignToken.color.onSurface}))`,
      ),

      /** Icon opacity when disabled. */
      iconOpacity: unsafeCSS(
        `var(--m3e-filled-button-disabled-icon-opacity, var(--m3e-button-disabled-icon-opacity, 38%))`,
      ),

      /** Label color when disabled. */
      labelTextColor: unsafeCSS(
        `var(--m3e-filled-button-disabled-label-text-color, var(--m3e-button-disabled-label-text-color, ${DesignToken.color.onSurface}))`,
      ),

      /** Label opacity when disabled. */
      labelTextOpacity: unsafeCSS(
        `var(--m3e-filled-button-disabled-label-text-opacity, var(--m3e-button-disabled-label-text-opacity, 38%))`,
      ),

      /** Elevation when disabled. */
      containerElevation: unsafeCSS(
        `var(--m3e-filled-button-disabled-container-elevation, var(--m3e-button-disabled-container-elevation, ${DesignToken.elevation.level0}))`,
      ),
    },

    /** Design tokens that control hover state. */
    hover: {
      /** Icon color on hover. */
      iconColor: unsafeCSS(
        `var(--m3e-filled-button-hover-icon-color, var(--m3e-button-hover-icon-color, ${DesignToken.color.onPrimary}))`,
      ),

      /** Label color on hover. */
      labelTextColor: unsafeCSS(
        `var(--m3e-filled-button-hover-label-text-color, var(--m3e-button-hover-label-text-color, ${DesignToken.color.onPrimary}))`,
      ),

      /** State layer color on hover. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-filled-button-hover-state-layer-color, var(--m3e-button-hover-state-layer-color, ${DesignToken.color.onPrimary}))`,
      ),

      /** State layer opacity on hover. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-filled-button-hover-state-layer-opacity, var(--m3e-button-hover-state-layer-opacity, ${DesignToken.state.hoverStateLayerOpacity}))`,
      ),

      /** Elevation on hover. */
      containerElevation: unsafeCSS(
        `var(--m3e-filled-button-hover-container-elevation, var(--m3e-button-hover-container-elevation, ${DesignToken.elevation.level1}))`,
      ),

      /** Unselected icon color on hover. */
      unselectedIconColor: unsafeCSS(
        `var(--m3e-filled-button-hover-unselected-icon-color, var(--m3e-button-hover-unselected-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Unselected label color on hover. */
      unselectedLabelTextColor: unsafeCSS(
        `var(--m3e-filled-button-hover-unselected-label-text-color, var(--m3e-button-hover-unselected-label-text-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Unselected state layer color on hover. */
      unselectedStateLayerColor: unsafeCSS(
        `var(--m3e-filled-button-hover-unselected-state-layer-color, var(--m3e-button-hover-unselected-state-layer-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Selected icon color on hover. */
      selectedIconColor: unsafeCSS(
        `var(--m3e-filled-button-hover-selected-icon-color, var(--m3e-button-hover-selected-icon-color, ${DesignToken.color.onPrimary}))`,
      ),

      /** Selected label color on hover. */
      selectedLabelTextColor: unsafeCSS(
        `var(--m3e-filled-button-hover-selected-label-text-color, var(--m3e-button-hover-selected-label-text-color, ${DesignToken.color.onPrimary}))`,
      ),

      /** Selected state layer color on hover. */
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-filled-button-hover-selected-state-layer-color, var(--m3e-button-hover-selected-state-layer-color, ${DesignToken.color.onPrimary}))`,
      ),
    },

    /** Design tokens that control focus state. */
    focus: {
      /** Icon color on focus. */
      iconColor: unsafeCSS(
        `var(--m3e-filled-button-focus-icon-color, var(--m3e-button-focus-icon-color, ${DesignToken.color.onPrimary}))`,
      ),

      /** Label color on focus. */
      labelTextColor: unsafeCSS(
        `var(--m3e-filled-button-focus-label-text-color, var(--m3e-button-focus-label-text-color, ${DesignToken.color.onPrimary}))`,
      ),

      /** State layer color on focus. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-filled-button-focus-state-layer-color, var(--m3e-button-focus-state-layer-color, ${DesignToken.color.onPrimary}))`,
      ),

      /**State layer opacity on focus. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-filled-button-focus-state-layer-opacity, var(--m3e-button-focus-state-layer-opacity, ${DesignToken.state.focusStateLayerOpacity}))`,
      ),

      /** Elevation on focus. */
      containerElevation: unsafeCSS(
        `var(--m3e-filled-button-focus-container-elevation, var(--m3e-button-focus-container-elevation, ${DesignToken.elevation.level0}))`,
      ),

      /** Unselected icon color on focus. */
      unselectedIconColor: unsafeCSS(
        `var(--m3e-filled-button-focus-unselected-icon-color, var(--m3e-button-focus-unselected-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Unselected label color on focus. */
      unselectedLabelTextColor: unsafeCSS(
        `var(--m3e-filled-button-focus-unselected-label-text-color, var(--m3e-button-focus-unselected-label-text-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Unselected state layer color on focus. */
      unselectedStateLayerColor: unsafeCSS(
        `var(--m3e-filled-button-focus-unselected-state-layer-color, var(--m3e-button-focus-unselected-state-layer-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Selected icon color on focus. */
      selectedIconColor: unsafeCSS(
        `var(--m3e-filled-button-focus-selected-icon-color, var(--m3e-button-focus-selected-icon-color, ${DesignToken.color.onPrimary}))`,
      ),

      /** Selected label color on focus. */
      selectedLabelTextColor: unsafeCSS(
        `var(--m3e-filled-button-focus-selected-label-text-color, var(--m3e-button-focus-selected-label-text-color, ${DesignToken.color.onPrimary}))`,
      ),

      /** Selected state layer color on focus. */
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-filled-button-focus-selected-state-layer-color, var(--m3e-button-focus-selected-state-layer-color, ${DesignToken.color.onPrimary}))`,
      ),
    },

    /** Design tokens that control pressed state. */
    pressed: {
      /** Icon color on pressed. */
      iconColor: unsafeCSS(
        `var(--m3e-filled-button-pressed-icon-color, var(--m3e-button-pressed-icon-color, ${DesignToken.color.onPrimary}))`,
      ),

      /** Label color on pressed. */
      labelTextColor: unsafeCSS(
        `var(--m3e-filled-button-pressed-label-text-color, var(--m3e-button-pressed-label-text-color, ${DesignToken.color.onPrimary}))`,
      ),

      /** State layer color on pressed. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-filled-button-pressed-state-layer-color, var(--m3e-button-pressed-state-layer-color, ${DesignToken.color.onPrimary}))`,
      ),

      /** State layer opacity on pressed. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-filled-button-pressed-state-layer-opacity, var(--m3e-button-pressed-state-layer-opacity, ${DesignToken.state.pressedStateLayerOpacity}))`,
      ),

      /** Elevation on pressed. */
      containerElevation: unsafeCSS(
        `var(--m3e-filled-button-pressed-container-elevation, var(--m3e-button-pressed-container-elevation, ${DesignToken.elevation.level0}))`,
      ),

      /** Unselected icon color on pressed. */
      unselectedIconColor: unsafeCSS(
        `var(--m3e-filled-button-pressed-unselected-icon-color, var(--m3e-button-pressed-unselected-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Unselected label color on pressed. */
      unselectedLabelTextColor: unsafeCSS(
        `var(--m3e-filled-button-pressed-unselected-label-text-color, var(--m3e-button-pressed-unselected-label-text-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Unselected state layer color on pressed. */
      unselectedStateLayerColor: unsafeCSS(
        `var(--m3e-filled-button-pressed-unselected-state-layer-color, var(--m3e-button-pressed-unselected-state-layer-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Selected icon color on pressed. */
      selectedIconColor: unsafeCSS(
        `var(--m3e-filled-button-pressed-selected-icon-color, var(--m3e-button-pressed-selected-icon-color, ${DesignToken.color.onPrimary}))`,
      ),

      /** Selected label color on pressed. */
      selectedLabelTextColor: unsafeCSS(
        `var(--m3e-filled-button-pressed-selected-label-text-color, var(--m3e-button-pressed-selected-label-text-color, ${DesignToken.color.onPrimary}))`,
      ),

      /** Selected state layer color on pressed. */
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-filled-button-pressed-selected-state-layer-color, var(--m3e-button-pressed-selected-state-layer-color, ${DesignToken.color.onPrimary}))`,
      ),
    },
  },

  /** Design tokens that control the `tonal` variant. */
  tonal: {
    /** Default label color. */
    labelTextColor: unsafeCSS(
      `var(--m3e-tonal-button-label-text-color, var(--m3e-button-label-text-color, ${DesignToken.color.onSecondaryContainer}))`,
    ),

    /** Default icon color. */
    iconColor: unsafeCSS(
      `var(--m3e-tonal-button-icon-color, var(--m3e-button-icon-color, ${DesignToken.color.onSecondaryContainer}))`,
    ),

    /** Default container background color. */
    containerColor: unsafeCSS(
      `var(--m3e-tonal-button-container-color, var(--m3e-button-container-color, ${DesignToken.color.secondaryContainer}))`,
    ),

    /** Resting elevation. */
    containerElevation: unsafeCSS(
      `var(--m3e-tonal-button-container-elevation, var(--m3e-button-container-elevation, ${DesignToken.elevation.level0}))`,
    ),

    /** Unselected label color. */
    unselectedLabelTextColor: unsafeCSS(
      `var(--m3e-tonal-button-unselected-label-text-color, var(--m3e-button-unselected-label-text-color, ${DesignToken.color.onSecondaryContainer}))`,
    ),

    /** Unselected icon color. */
    unselectedIconColor: unsafeCSS(
      `var(--m3e-tonal-button-unselected-icon-color, var(--m3e-button-unselected-icon-color, ${DesignToken.color.onSecondaryContainer}))`,
    ),

    /** Unselected container background color. */
    unselectedContainerColor: unsafeCSS(
      `var(--m3e-tonal-button-unselected-container-color, var(--m3e-button-unselected-container-color, ${DesignToken.color.secondaryContainer}))`,
    ),

    /** Selected label color. */
    selectedLabelTextColor: unsafeCSS(
      `var(--m3e-tonal-button-selected-label-text-color, var(--m3e-button-selected-label-text-color, ${DesignToken.color.onSecondary}))`,
    ),

    /** Selected icon color. */
    selectedIconColor: unsafeCSS(
      `var(--m3e-tonal-button-selected-icon-color, var(--m3e-button-selected-icon-color, ${DesignToken.color.onSecondary}))`,
    ),

    /** Selected container background color. */
    selectedContainerColor: unsafeCSS(
      `var(--m3e-tonal-button-selected-container-color, var(--m3e-button-selected-container-color, ${DesignToken.color.secondary}))`,
    ),

    /** Design tokens that control disabled state. */
    disabled: {
      /** Container background color when disabled. */
      containerColor: unsafeCSS(
        `var(--m3e-tonal-button-disabled-container-color, var(--m3e-button-disabled-container-color, ${DesignToken.color.onSurface}))`,
      ),

      /** Opacity of container when disabled. */
      containerOpacity: unsafeCSS(
        `var(--m3e-tonal-button-disabled-container-opacity, var(--m3e-button-disabled-container-opacity, 10%))`,
      ),

      /** Icon color when disabled. */
      iconColor: unsafeCSS(
        `var(--m3e-tonal-button-disabled-icon-color, var(--m3e-button-disabled-icon-color, ${DesignToken.color.onSurface}))`,
      ),

      /** Icon opacity when disabled. */
      iconOpacity: unsafeCSS(
        `var(--m3e-tonal-button-disabled-icon-opacity, var(--m3e-button-disabled-icon-opacity, 38%))`,
      ),

      /** Label color when disabled. */
      labelTextColor: unsafeCSS(
        `var(--m3e-tonal-button-disabled-label-text-color, var(--m3e-button-disabled-label-text-color, ${DesignToken.color.onSurface}))`,
      ),

      /** Label opacity when disabled. */
      labelTextOpacity: unsafeCSS(
        `var(--m3e-tonal-button-disabled-label-text-opacity, var(--m3e-button-disabled-label-text-opacity, 38%))`,
      ),

      /** Elevation when disabled. */
      containerElevation: unsafeCSS(
        `var(--m3e-tonal-button-disabled-container-elevation, var(--m3e-button-disabled-container-elevation, ${DesignToken.elevation.level0}))`,
      ),
    },

    /** Design tokens that control hover state. */
    hover: {
      /** Icon color on hover. */
      iconColor: unsafeCSS(
        `var(--m3e-tonal-button-hover-icon-color, var(--m3e-button-hover-icon-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),

      /** Label color on hover. */
      labelTextColor: unsafeCSS(
        `var(--m3e-tonal-button-hover-label-text-color, var(--m3e-button-hover-label-text-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),

      /** State layer color on hover. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-tonal-button-hover-state-layer-color, var(--m3e-button-hover-state-layer-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),

      /** State layer opacity on hover. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-tonal-button-hover-state-layer-opacity, var(--m3e-button-hover-state-layer-opacity, ${DesignToken.state.hoverStateLayerOpacity}))`,
      ),

      /** Elevation on hover. */
      containerElevation: unsafeCSS(
        `var(--m3e-tonal-button-hover-container-elevation, var(--m3e-button-hover-container-elevation, ${DesignToken.elevation.level1}))`,
      ),

      /** Unselected icon color on hover. */
      unselectedIconColor: unsafeCSS(
        `var(--m3e-tonal-button-hover-unselected-icon-color, var(--m3e-button-hover-unselected-icon-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),

      /** Unselected label color on hover. */
      unselectedLabelTextColor: unsafeCSS(
        `var(--m3e-tonal-button-hover-unselected-label-text-color, var(--m3e-button-hover-unselected-label-text-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),

      /** Unselected state layer color on hover. */
      unselectedStateLayerColor: unsafeCSS(
        `var(--m3e-tonal-button-hover-unselected-state-layer-color, var(--m3e-button-hover-unselected-state-layer-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),

      /** Selected icon color on hover. */
      selectedIconColor: unsafeCSS(
        `var(--m3e-tonal-button-hover-selected-icon-color, var(--m3e-button-hover-selected-icon-color, ${DesignToken.color.onSecondary}))`,
      ),

      /** Selected label color on hover. */
      selectedLabelTextColor: unsafeCSS(
        `var(--m3e-tonal-button-hover-selected-label-text-color, var(--m3e-button-hover-selected-label-text-color, ${DesignToken.color.onSecondary}))`,
      ),

      /** Selected state layer color on hover. */
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-tonal-button-hover-selected-state-layer-color, var(--m3e-button-hover-selected-state-layer-color, ${DesignToken.color.onSecondary}))`,
      ),
    },

    /** Design tokens that control focus state. */
    focus: {
      /** Icon color on focus. */
      iconColor: unsafeCSS(
        `var(--m3e-tonal-button-focus-icon-color, var(--m3e-button-focus-icon-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),

      /** Label color on focus. */
      labelTextColor: unsafeCSS(
        `var(--m3e-tonal-button-focus-label-text-color, var(--m3e-button-focus-label-text-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),

      /** State layer color on focus. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-tonal-button-focus-state-layer-color, var(--m3e-button-focus-state-layer-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),

      /**State layer opacity on focus. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-tonal-button-focus-state-layer-opacity, var(--m3e-button-focus-state-layer-opacity, ${DesignToken.state.focusStateLayerOpacity}))`,
      ),

      /** Elevation on focus. */
      containerElevation: unsafeCSS(
        `var(--m3e-tonal-button-focus-container-elevation, var(--m3e-button-focus-container-elevation, ${DesignToken.elevation.level0}))`,
      ),

      /** Unselected icon color on focus. */
      unselectedIconColor: unsafeCSS(
        `var(--m3e-tonal-button-focus-unselected-icon-color, var(--m3e-button-focus-unselected-icon-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),

      /** Unselected label color on focus. */
      unselectedLabelTextColor: unsafeCSS(
        `var(--m3e-tonal-button-focus-unselected-label-text-color, var(--m3e-button-focus-unselected-label-text-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),

      /** Unselected state layer color on focus. */
      unselectedStateLayerColor: unsafeCSS(
        `var(--m3e-tonal-button-focus-unselected-state-layer-color, var(--m3e-button-focus-unselected-state-layer-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),

      /** Selected icon color on focus. */
      selectedIconColor: unsafeCSS(
        `var(--m3e-tonal-button-focus-selected-icon-color, var(--m3e-button-focus-selected-icon-color, ${DesignToken.color.onSecondary}))`,
      ),

      /** Selected label color on focus. */
      selectedLabelTextColor: unsafeCSS(
        `var(--m3e-tonal-button-focus-selected-label-text-color, var(--m3e-button-focus-selected-label-text-color, ${DesignToken.color.onSecondary}))`,
      ),

      /** Selected state layer color on focus. */
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-tonal-button-focus-selected-state-layer-color, var(--m3e-button-focus-selected-state-layer-color, ${DesignToken.color.onSecondary}))`,
      ),
    },

    /** Design tokens that control pressed state. */
    pressed: {
      /** Icon color on pressed. */
      iconColor: unsafeCSS(
        `var(--m3e-tonal-button-pressed-icon-color, var(--m3e-button-pressed-icon-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),

      /** Label color on pressed. */
      labelTextColor: unsafeCSS(
        `var(--m3e-tonal-button-pressed-label-text-color, var(--m3e-button-pressed-label-text-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),

      /** State layer color on pressed. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-tonal-button-pressed-state-layer-color, var(--m3e-button-pressed-state-layer-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),

      /** State layer opacity on pressed. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-tonal-button-pressed-state-layer-opacity, var(--m3e-button-pressed-state-layer-opacity, ${DesignToken.state.pressedStateLayerOpacity}))`,
      ),

      /** Elevation on pressed. */
      containerElevation: unsafeCSS(
        `var(--m3e-tonal-button-pressed-container-elevation, var(--m3e-button-pressed-container-elevation, ${DesignToken.elevation.level0}))`,
      ),

      /** Unselected icon color on pressed. */
      unselectedIconColor: unsafeCSS(
        `var(--m3e-tonal-button-pressed-unselected-icon-color, var(--m3e-button-pressed-unselected-icon-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),

      /** Unselected label color on pressed. */
      unselectedLabelTextColor: unsafeCSS(
        `var(--m3e-tonal-button-pressed-unselected-label-text-color, var(--m3e-button-pressed-unselected-label-text-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),

      /** Unselected state layer color on pressed. */
      unselectedStateLayerColor: unsafeCSS(
        `var(--m3e-tonal-button-pressed-unselected-state-layer-color, var(--m3e-button-pressed-unselected-state-layer-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),

      /** Selected icon color on pressed. */
      selectedIconColor: unsafeCSS(
        `var(--m3e-tonal-button-pressed-selected-icon-color, var(--m3e-button-pressed-selected-icon-color, ${DesignToken.color.onSecondary}))`,
      ),

      /** Selected label color on pressed. */
      selectedLabelTextColor: unsafeCSS(
        `var(--m3e-tonal-button-pressed-selected-label-text-color, var(--m3e-button-pressed-selected-label-text-color, ${DesignToken.color.onSecondary}))`,
      ),

      /** Selected state layer color on pressed. */
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-tonal-button-pressed-selected-state-layer-color, var(--m3e-button-pressed-selected-state-layer-color, ${DesignToken.color.onSecondary}))`,
      ),
    },
  },

  /** Design tokens that control the `text` variant. */
  text: {
    /** Default label color. */
    labelTextColor: unsafeCSS(
      `var(--m3e-text-button-label-text-color, var(--m3e-button-label-text-color, ${DesignToken.color.primary}))`,
    ),

    /** Default icon color. */
    iconColor: unsafeCSS(
      `var(--m3e-text-button-icon-color, var(--m3e-button-icon-color, ${DesignToken.color.primary}))`,
    ),

    /** Unselected label color. */
    unselectedLabelTextColor: unsafeCSS(
      `var(--m3e-text-button-unselected-label-text-color, var(--m3e-button-unselected-label-text-color, ${DesignToken.color.primary}))`,
    ),

    /** Unselected icon color. */
    unselectedIconColor: unsafeCSS(
      `var(--m3e-text-button-unselected-icon-color, var(--m3e-button-unselected-icon-color, ${DesignToken.color.primary}))`,
    ),

    /** Selected label color. */
    selectedLabelTextColor: unsafeCSS(
      `var(--m3e-text-button-selected-label-text-color, var(--m3e-button-selected-label-text-color, ${DesignToken.color.primary}))`,
    ),

    /** Selected icon color. */
    selectedIconColor: unsafeCSS(
      `var(--m3e-text-button-selected-icon-color, var(--m3e-button-selected-icon-color, ${DesignToken.color.primary}))`,
    ),

    /** Design tokens that control disabled state. */
    disabled: {
      /** Container background color when disabled. */
      containerColor: unsafeCSS(
        `var(--m3e-text-button-disabled-container-color, var(--m3e-button-disabled-container-color, ${DesignToken.color.onSurface}))`,
      ),

      /** Opacity of container when disabled. */
      containerOpacity: unsafeCSS(
        `var(--m3e-text-button-disabled-container-opacity, var(--m3e-button-disabled-container-opacity, 10%))`,
      ),

      /** Icon color when disabled. */
      iconColor: unsafeCSS(
        `var(--m3e-text-button-disabled-icon-color, var(--m3e-button-disabled-icon-color, ${DesignToken.color.onSurface}))`,
      ),

      /** Icon opacity when disabled. */
      iconOpacity: unsafeCSS(
        `var(--m3e-text-button-disabled-icon-opacity, var(--m3e-button-disabled-icon-opacity, 38%))`,
      ),

      /** Label color when disabled. */
      labelTextColor: unsafeCSS(
        `var(--m3e-text-button-disabled-label-text-color, var(--m3e-button-disabled-label-text-color, ${DesignToken.color.onSurface}))`,
      ),

      /** Label opacity when disabled. */
      labelTextOpacity: unsafeCSS(
        `var(--m3e-text-button-disabled-label-text-opacity, var(--m3e-button-disabled-label-text-opacity, 38%))`,
      ),
    },

    /** Design tokens that control hover state. */
    hover: {
      /** Icon color on hover. */
      iconColor: unsafeCSS(
        `var(--m3e-text-button-hover-icon-color, var(--m3e-button-hover-icon-color, ${DesignToken.color.primary}))`,
      ),

      /** Label color on hover. */
      labelTextColor: unsafeCSS(
        `var(--m3e-text-button-hover-label-text-color, var(--m3e-button-hover-label-text-color, ${DesignToken.color.primary}))`,
      ),

      /** State layer color on hover. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-text-button-hover-state-layer-color, var(--m3e-button-hover-state-layer-color, ${DesignToken.color.primary}))`,
      ),

      /** State layer opacity on hover. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-text-button-hover-state-layer-opacity, var(--m3e-button-hover-state-layer-opacity, ${DesignToken.state.hoverStateLayerOpacity}))`,
      ),

      /** Unselected icon color on hover. */
      unselectedIconColor: unsafeCSS(
        `var(--m3e-text-button-hover-unselected-icon-color, var(--m3e-button-hover-unselected-icon-color, ${DesignToken.color.primary}))`,
      ),

      /** Unselected label color on hover. */
      unselectedLabelTextColor: unsafeCSS(
        `var(--m3e-text-button-hover-unselected-label-text-color, var(--m3e-button-hover-unselected-label-text-color, ${DesignToken.color.primary}))`,
      ),

      /** Unselected state layer color on hover. */
      unselectedStateLayerColor: unsafeCSS(
        `var(--m3e-text-button-hover-unselected-state-layer-color, var(--m3e-button-hover-unselected-state-layer-color, ${DesignToken.color.primary}))`,
      ),

      /** Selected icon color on hover. */
      selectedIconColor: unsafeCSS(
        `var(--m3e-text-button-hover-selected-icon-color, var(--m3e-button-hover-selected-icon-color, ${DesignToken.color.primary}))`,
      ),

      /** Selected label color on hover. */
      selectedLabelTextColor: unsafeCSS(
        `var(--m3e-text-button-hover-selected-label-text-color, var(--m3e-button-hover-selected-label-text-color, ${DesignToken.color.primary}))`,
      ),

      /** Selected state layer color on hover. */
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-text-button-hover-selected-state-layer-color, var(--m3e-button-hover-selected-state-layer-color, ${DesignToken.color.primary}))`,
      ),
    },

    /** Design tokens that control focus state. */
    focus: {
      /** Icon color on focus. */
      iconColor: unsafeCSS(
        `var(--m3e-text-button-focus-icon-color, var(--m3e-button-focus-icon-color, ${DesignToken.color.primary}))`,
      ),

      /** Label color on focus. */
      labelTextColor: unsafeCSS(
        `var(--m3e-text-button-focus-label-text-color, var(--m3e-button-focus-label-text-color, ${DesignToken.color.primary}))`,
      ),

      /** State layer color on focus. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-text-button-focus-state-layer-color, var(--m3e-button-focus-state-layer-color, ${DesignToken.color.primary}))`,
      ),

      /**State layer opacity on focus. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-text-button-focus-state-layer-opacity, var(--m3e-button-focus-state-layer-opacity, ${DesignToken.state.focusStateLayerOpacity}))`,
      ),

      /** Unselected icon color on focus. */
      unselectedIconColor: unsafeCSS(
        `var(--m3e-text-button-focus-unselected-icon-color, var(--m3e-button-focus-unselected-icon-color, ${DesignToken.color.primary}))`,
      ),

      /** Unselected label color on focus. */
      unselectedLabelTextColor: unsafeCSS(
        `var(--m3e-text-button-focus-unselected-label-text-color, var(--m3e-button-focus-unselected-label-text-color, ${DesignToken.color.primary}))`,
      ),

      /** Unselected state layer color on focus. */
      unselectedStateLayerColor: unsafeCSS(
        `var(--m3e-text-button-focus-unselected-state-layer-color, var(--m3e-button-focus-unselected-state-layer-color, ${DesignToken.color.primary}))`,
      ),

      /** Selected icon color on focus. */
      selectedIconColor: unsafeCSS(
        `var(--m3e-text-button-focus-selected-icon-color, var(--m3e-button-focus-selected-icon-color, ${DesignToken.color.primary}))`,
      ),

      /** Selected label color on focus. */
      selectedLabelTextColor: unsafeCSS(
        `var(--m3e-text-button-focus-selected-label-text-color, var(--m3e-button-focus-selected-label-text-color, ${DesignToken.color.primary}))`,
      ),

      /** Selected state layer color on focus. */
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-text-button-focus-selected-state-layer-color, var(--m3e-button-focus-selected-state-layer-color, ${DesignToken.color.primary}))`,
      ),
    },

    /** Design tokens that control pressed state. */
    pressed: {
      /** Icon color on pressed. */
      iconColor: unsafeCSS(
        `var(--m3e-text-button-pressed-icon-color, var(--m3e-button-pressed-icon-color, ${DesignToken.color.primary}))`,
      ),

      /** Label color on pressed. */
      labelTextColor: unsafeCSS(
        `var(--m3e-text-button-pressed-label-text-color, var(--m3e-button-pressed-label-text-color, ${DesignToken.color.primary}))`,
      ),

      /** State layer color on pressed. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-text-button-pressed-state-layer-color, var(--m3e-button-pressed-state-layer-color, ${DesignToken.color.primary}))`,
      ),

      /** State layer opacity on pressed. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-text-button-pressed-state-layer-opacity, var(--m3e-button-pressed-state-layer-opacity, ${DesignToken.state.pressedStateLayerOpacity}))`,
      ),

      /** Unselected icon color on pressed. */
      unselectedIconColor: unsafeCSS(
        `var(--m3e-text-button-pressed-unselected-icon-color, var(--m3e-button-pressed-unselected-icon-color, ${DesignToken.color.primary}))`,
      ),

      /** Unselected label color on pressed. */
      unselectedLabelTextColor: unsafeCSS(
        `var(--m3e-text-button-pressed-unselected-label-text-color, var(--m3e-button-pressed-unselected-label-text-color, ${DesignToken.color.primary}))`,
      ),

      /** Unselected state layer color on pressed. */
      unselectedStateLayerColor: unsafeCSS(
        `var(--m3e-text-button-pressed-unselected-state-layer-color, var(--m3e-button-pressed-unselected-state-layer-color, ${DesignToken.color.primary}))`,
      ),

      /** Selected icon color on pressed. */
      selectedIconColor: unsafeCSS(
        `var(--m3e-text-button-pressed-selected-icon-color, var(--m3e-button-pressed-selected-icon-color, ${DesignToken.color.primary}))`,
      ),

      /** Selected label color on pressed. */
      selectedLabelTextColor: unsafeCSS(
        `var(--m3e-text-button-pressed-selected-label-text-color, var(--m3e-button-pressed-selected-label-text-color, ${DesignToken.color.primary}))`,
      ),

      /** Selected state layer color on pressed. */
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-text-button-pressed-selected-state-layer-color, var(--m3e-button-pressed-selected-state-layer-color, ${DesignToken.color.primary}))`,
      ),
    },
  },
} as const;
