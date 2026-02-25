import { CSSResult, unsafeCSS } from "lit";

import { DesignToken } from "@m3e/web/core";

import { IconButtonVariant } from "../IconButtonVariant";

/** @private */
type _IconButtonVariantToken = {
  iconColor: CSSResult;
  containerColor?: CSSResult;
  containerElevation?: CSSResult;
  outlineColor?: CSSResult;
  unselectedIconColor: CSSResult;
  unselectedContainerColor?: CSSResult;
  selectedIconColor: CSSResult;
  selectedContainerColor?: CSSResult;
  disabled: {
    containerColor: CSSResult;
    containerElevation?: CSSResult;
    containerOpacity: CSSResult;
    iconColor: CSSResult;
    iconOpacity: CSSResult;
    outlineColor?: CSSResult;
  };
  hover: {
    iconColor: CSSResult;
    stateLayerColor: CSSResult;
    stateLayerOpacity: CSSResult;
    containerElevation?: CSSResult;
    outlineColor?: CSSResult;
    unselectedIconColor: CSSResult;
    unselectedStateLayerColor: CSSResult;
    selectedIconColor: CSSResult;
    selectedStateLayerColor: CSSResult;
  };
  focus: {
    iconColor: CSSResult;
    stateLayerColor: CSSResult;
    stateLayerOpacity: CSSResult;
    containerElevation?: CSSResult;
    outlineColor?: CSSResult;
    unselectedIconColor: CSSResult;
    unselectedStateLayerColor: CSSResult;
    selectedIconColor: CSSResult;
    selectedStateLayerColor: CSSResult;
  };
  pressed: {
    iconColor: CSSResult;
    stateLayerColor: CSSResult;
    stateLayerOpacity: CSSResult;
    containerElevation?: CSSResult;
    outlineColor?: CSSResult;
    unselectedIconColor: CSSResult;
    unselectedStateLayerColor: CSSResult;
    selectedIconColor: CSSResult;
    selectedStateLayerColor: CSSResult;
  };
};

/**
 * Component design tokens that control the appearance variants of `M3eIconButtonElement`.
 * @internal
 */
export const IconButtonVariantToken: Record<IconButtonVariant | "elevated", _IconButtonVariantToken> = {
  /** Design tokens that control the `elevated` variant. */
  elevated: {
    /** Default icon color. */
    iconColor: unsafeCSS(
      `var(--m3e-elevated-icon-button-icon-color, var(--m3e-icon-button-icon-color, ${DesignToken.color.primary}))`,
    ),

    /** Default container background color. */
    containerColor: unsafeCSS(
      `var(--m3e-elevated-icon-button-container-color, var(--m3e-icon-button-container-color, ${DesignToken.color.surfaceContainerLow}))`,
    ),

    /** Resting elevation. */
    containerElevation: unsafeCSS(
      `var(--m3e-elevated-icon-button-container-elevation, var(--m3e-icon-button-container-elevation, ${DesignToken.elevation.level1}))`,
    ),

    /** Unselected icon color. */
    unselectedIconColor: unsafeCSS(
      `var(--m3e-elevated-icon-button-unselected-icon-color, var(--m3e-icon-button-unselected-icon-color, ${DesignToken.color.primary}))`,
    ),

    /** Unselected container background color. */
    unselectedContainerColor: unsafeCSS(
      `var(--m3e-elevated-icon-button-unselected-container-color, var(--m3e-icon-button-unselected-container-color, ${DesignToken.color.surfaceContainerLow}))`,
    ),

    /** Selected icon color. */
    selectedIconColor: unsafeCSS(
      `var(--m3e-elevated-icon-button-selected-icon-color, var(--m3e-icon-button-selected-icon-color, ${DesignToken.color.onPrimary}))`,
    ),

    /** Selected container background color. */
    selectedContainerColor: unsafeCSS(
      `var(--m3e-elevated-icon-button-selected-container-color, var(--m3e-icon-button-selected-container-color, ${DesignToken.color.primary}))`,
    ),

    /** Design tokens that control disabled state. */
    disabled: {
      /** Container background color when disabled. */
      containerColor: unsafeCSS(
        `var(--m3e-elevated-icon-button-disabled-container-color, var(--m3e-icon-button-disabled-container-color, ${DesignToken.color.onSurface}))`,
      ),

      /** Opacity of container when disabled. */
      containerOpacity: unsafeCSS(
        `var(--m3e-elevated-icon-button-disabled-container-opacity, var(--m3e-icon-button-disabled-container-opacity, 10%))`,
      ),

      /** Icon color when disabled. */
      iconColor: unsafeCSS(
        `var(--m3e-elevated-icon-button-disabled-icon-color, var(--m3e-icon-button-disabled-icon-color, ${DesignToken.color.onSurface}))`,
      ),

      /** Icon opacity when disabled. */
      iconOpacity: unsafeCSS(
        `var(--m3e-elevated-icon-button-disabled-icon-opacity, var(--m3e-icon-button-disabled-icon-opacity, 38%))`,
      ),

      /** Elevation when disabled. */
      containerElevation: unsafeCSS(
        `var(--m3e-elevated-icon-button-disabled-container-elevation, var(--m3e-icon-button-disabled-container-elevation, ${DesignToken.elevation.level0}))`,
      ),
    },

    /** Design tokens that control hover state. */
    hover: {
      /** Icon color on hover. */
      iconColor: unsafeCSS(
        `var(--m3e-elevated-icon-button-hover-icon-color, var(--m3e-icon-button-hover-icon-color, ${DesignToken.color.primary}))`,
      ),

      /** State layer color on hover. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-elevated-icon-button-hover-state-layer-color, var(--m3e-icon-button-hover-state-layer-color, ${DesignToken.color.primary}))`,
      ),

      /** State layer opacity on hover. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-elevated-icon-button-hover-state-layer-opacity, var(--m3e-icon-button-hover-state-layer-opacity, ${DesignToken.state.hoverStateLayerOpacity}))`,
      ),

      /** Elevation on hover. */
      containerElevation: unsafeCSS(
        `var(--m3e-elevated-icon-button-hover-container-elevation, var(--m3e-icon-button-hover-container-elevation, ${DesignToken.elevation.level2}))`,
      ),

      /** Unselected icon color on hover. */
      unselectedIconColor: unsafeCSS(
        `var(--m3e-elevated-icon-button-hover-unselected-icon-color, var(--m3e-icon-button-hover-unselected-icon-color, ${DesignToken.color.primary}))`,
      ),

      /** Unselected state layer color on hover. */
      unselectedStateLayerColor: unsafeCSS(
        `var(--m3e-elevated-icon-button-hover-unselected-state-layer-color, var(--m3e-icon-button-hover-unselected-state-layer-color, ${DesignToken.color.primary}))`,
      ),

      /** Selected icon color on hover. */
      selectedIconColor: unsafeCSS(
        `var(--m3e-elevated-icon-button-hover-selected-icon-color, var(--m3e-icon-button-hover-selected-icon-color, ${DesignToken.color.onPrimary}))`,
      ),

      /** Selected ripple color on hover. */
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-elevated-icon-button-hover-selected-state-layer-color, var(--m3e-icon-button-hover-selected-state-layer-color, ${DesignToken.color.onPrimary}))`,
      ),
    },

    /** Design tokens that control focus state. */
    focus: {
      /** Icon color on focus. */
      iconColor: unsafeCSS(
        `var(--m3e-elevated-icon-button-focus-icon-color, var(--m3e-icon-button-focus-icon-color, ${DesignToken.color.primary}))`,
      ),

      /** State layer color on focus. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-elevated-icon-button-focus-state-layer-color, var(--m3e-icon-button-focus-state-layer-color, ${DesignToken.color.primary}))`,
      ),

      /**State layer opacity on focus. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-elevated-icon-button-focus-state-layer-opacity, var(--m3e-icon-button-focus-state-layer-opacity, ${DesignToken.state.focusStateLayerOpacity}))`,
      ),

      /** Elevation on focus. */
      containerElevation: unsafeCSS(
        `var(--m3e-elevated-icon-button-focus-container-elevation, var(--m3e-icon-button-focus-container-elevation, ${DesignToken.elevation.level1}))`,
      ),

      /** Unselected icon color on focus. */
      unselectedIconColor: unsafeCSS(
        `var(--m3e-elevated-icon-button-focus-unselected-icon-color, var(--m3e-icon-button-focus-unselected-icon-color, ${DesignToken.color.primary}))`,
      ),

      /** Unselected ripple color on focus. */
      unselectedStateLayerColor: unsafeCSS(
        `var(--m3e-elevated-icon-button-focus-unselected-state-layer-color, var(--m3e-icon-button-focus-unselected-state-layer-color, ${DesignToken.color.primary}))`,
      ),

      /** Selected icon color on focus. */
      selectedIconColor: unsafeCSS(
        `var(--m3e-elevated-icon-button-focus-selected-icon-color, var(--m3e-icon-button-focus-selected-icon-color, ${DesignToken.color.onPrimary}))`,
      ),

      /** Selected ripple color on focus. */
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-elevated-icon-button-focus-selected-state-layer-color, var(--m3e-icon-button-focus-selected-state-layer-color, ${DesignToken.color.onPrimary}))`,
      ),
    },

    /** Design tokens that control pressed state. */
    pressed: {
      /** Icon color on pressed. */
      iconColor: unsafeCSS(
        `var(--m3e-elevated-icon-button-pressed-icon-color, var(--m3e-icon-button-pressed-icon-color, ${DesignToken.color.primary}))`,
      ),

      /** State layer color on pressed. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-elevated-icon-button-pressed-state-layer-color, var(--m3e-icon-button-pressed-state-layer-color, ${DesignToken.color.primary}))`,
      ),

      /** State layer opacity on pressed. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-elevated-icon-button-pressed-state-layer-opacity, var(--m3e-icon-button-pressed-state-layer-opacity, ${DesignToken.state.pressedStateLayerOpacity}))`,
      ),

      /** Elevation on pressed. */
      containerElevation: unsafeCSS(
        `var(--m3e-elevated-icon-button-pressed-container-elevation, var(--m3e-icon-button-pressed-container-elevation, ${DesignToken.elevation.level1}))`,
      ),

      /** Unselected icon color on pressed. */
      unselectedIconColor: unsafeCSS(
        `var(--m3e-elevated-icon-button-pressed-unselected-icon-color, var(--m3e-icon-button-pressed-unselected-icon-color, ${DesignToken.color.primary}))`,
      ),

      /** Unselected ripple color on pressed. */
      unselectedStateLayerColor: unsafeCSS(
        `var(--m3e-elevated-icon-button-pressed-unselected-state-layer-color, var(--m3e-icon-button-pressed-unselected-state-layer-color, ${DesignToken.color.primary}))`,
      ),

      /** Selected icon color on pressed. */
      selectedIconColor: unsafeCSS(
        `var(--m3e-elevated-icon-button-pressed-selected-icon-color, var(--m3e-icon-button-pressed-selected-icon-color, ${DesignToken.color.onPrimary}))`,
      ),

      /** Selected ripple color on pressed. */
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-elevated-icon-button-pressed-selected-state-layer-color, var(--m3e-icon-button-pressed-selected-state-layer-color, ${DesignToken.color.onPrimary}))`,
      ),
    },
  },
  /** Design tokens that control the `outlined` variant. */
  outlined: {
    /** Default icon color. */
    iconColor: unsafeCSS(
      `var(--m3e-outlined-icon-button-icon-color, var(--m3e-icon-button-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
    ),

    /** Default outline color. */
    outlineColor: unsafeCSS(
      `var(--m3e-outlined-icon-button-outline-color, var(--m3e-icon-button-outline-color, ${DesignToken.color.outlineVariant}))`,
    ),

    /** Unselected icon color. */
    unselectedIconColor: unsafeCSS(
      `var(--m3e-outlined-icon-button-unselected-icon-color, var(--m3e-icon-button-unselected-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
    ),

    /** Selected icon color. */
    selectedIconColor: unsafeCSS(
      `var(--m3e-outlined-icon-button-selected-icon-color, var(--m3e-icon-button-selected-icon-color, ${DesignToken.color.inverseOnSurface}))`,
    ),

    /** Selected container background color. */
    selectedContainerColor: unsafeCSS(
      `var(--m3e-outlined-icon-button-selected-container-color, var(--m3e-icon-button-selected-container-color, ${DesignToken.color.inverseSurface}))`,
    ),

    /** Design tokens that control disabled state. */
    disabled: {
      /** Container background color when disabled. */
      containerColor: unsafeCSS(
        `var(--m3e-outlined-icon-button-disabled-container-color, var(--m3e-icon-button-disabled-container-color, ${DesignToken.color.onSurface}))`,
      ),

      /** Opacity of container when disabled. */
      containerOpacity: unsafeCSS(
        `var(--m3e-outlined-icon-button-disabled-container-opacity, var(--m3e-icon-button-disabled-container-opacity, 10%))`,
      ),

      /** Icon color when disabled. */
      iconColor: unsafeCSS(
        `var(--m3e-outlined-icon-button-disabled-icon-color, var(--m3e-icon-button-disabled-icon-color, ${DesignToken.color.onSurface}))`,
      ),

      /** Icon opacity when disabled. */
      iconOpacity: unsafeCSS(
        `var(--m3e-outlined-icon-button-disabled-icon-opacity, var(--m3e-icon-button-disabled-icon-opacity, 38%))`,
      ),

      /** Outline color when disabled. */
      outlineColor: unsafeCSS(
        `var(--m3e-outlined-icon-button-disabled-outline-color, var(--m3e-icon-button-disabled-outline-color, ${DesignToken.color.outlineVariant}))`,
      ),
    },

    /** Design tokens that control hover state. */
    hover: {
      /** Icon color on hover. */
      iconColor: unsafeCSS(
        `var(--m3e-outlined-icon-button-hover-icon-color, var(--m3e-icon-button-hover-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Outline color on hover. */
      outlineColor: unsafeCSS(
        `var(--m3e-outlined-icon-button-hover-outline-color, var(--m3e-icon-button-hover-outline-color, ${DesignToken.color.outlineVariant}))`,
      ),

      /** State layer color on hover. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-outlined-icon-button-hover-state-layer-color, var(--m3e-icon-button-hover-state-layer-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** State layer opacity on hover. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-outlined-icon-button-hover-state-layer-opacity, var(--m3e-icon-button-hover-state-layer-opacity, ${DesignToken.state.hoverStateLayerOpacity}))`,
      ),

      /** Unselected icon color on hover. */
      unselectedIconColor: unsafeCSS(
        `var(--m3e-outlined-icon-button-hover-unselected-icon-color, var(--m3e-icon-button-hover-unselected-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Unselected state layer color on hover. */
      unselectedStateLayerColor: unsafeCSS(
        `var(--m3e-outlined-icon-button-hover-unselected-state-layer-color, var(--m3e-icon-button-hover-unselected-state-layer-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Selected icon color on hover. */
      selectedIconColor: unsafeCSS(
        `var(--m3e-outlined-icon-button-hover-selected-icon-color, var(--m3e-icon-button-hover-selected-icon-color, ${DesignToken.color.inverseOnSurface}))`,
      ),

      /** Selected state layer color on hover. */
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-outlined-icon-button-hover-selected-state-layer-color, var(--m3e-icon-button-hover-selected-state-layer-color, ${DesignToken.color.inverseOnSurface}))`,
      ),
    },

    /** Design tokens that control focus state. */
    focus: {
      /** Icon color on focus. */
      iconColor: unsafeCSS(
        `var(--m3e-outlined-icon-button-focus-icon-color, var(--m3e-icon-button-focus-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Outline color on focus. */
      outlineColor: unsafeCSS(
        `var(--m3e-outlined-icon-button-focus-outline-color, var(--m3e-icon-button-focus-outline-color, ${DesignToken.color.outlineVariant}))`,
      ),

      /** State layer color on focus. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-outlined-icon-button-focus-state-layer-color, var(--m3e-icon-button-focus-state-layer-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /**State layer opacity on focus. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-outlined-icon-button-focus-state-layer-opacity, var(--m3e-icon-button-focus-state-layer-opacity, ${DesignToken.state.focusStateLayerOpacity}))`,
      ),

      /** Unselected icon color on focus. */
      unselectedIconColor: unsafeCSS(
        `var(--m3e-outlined-icon-button-focus-unselected-icon-color, var(--m3e-icon-button-focus-unselected-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Unselected state layer color on focus. */
      unselectedStateLayerColor: unsafeCSS(
        `var(--m3e-outlined-icon-button-focus-unselected-state-layer-color, var(--m3e-icon-button-focus-unselected-state-layer-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Selected icon color on focus. */
      selectedIconColor: unsafeCSS(
        `var(--m3e-outlined-icon-button-focus-selected-icon-color, var(--m3e-icon-button-focus-selected-icon-color, ${DesignToken.color.inverseOnSurface}))`,
      ),

      /** Selected state layer color on focus. */
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-outlined-icon-button-focus-selected-state-layer-color, var(--m3e-icon-button-focus-selected-state-layer-color, ${DesignToken.color.inverseOnSurface}))`,
      ),
    },

    /** Design tokens that control pressed state. */
    pressed: {
      /** Icon color on pressed. */
      iconColor: unsafeCSS(
        `var(--m3e-outlined-icon-button-pressed-icon-color, var(--m3e-icon-button-pressed-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Outline color on pressed. */
      outlineColor: unsafeCSS(
        `var(--m3e-outlined-icon-button-pressed-outline-color, var(--m3e-icon-button-pressed-outline-color, ${DesignToken.color.outlineVariant}))`,
      ),

      /** State layer color on pressed. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-outlined-icon-button-pressed-state-layer-color, var(--m3e-icon-button-pressed-state-layer-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** State layer opacity on pressed. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-outlined-icon-button-pressed-state-layer-opacity, var(--m3e-icon-button-pressed-state-layer-opacity, ${DesignToken.state.pressedStateLayerOpacity}))`,
      ),

      /** Unselected icon color on pressed. */
      unselectedIconColor: unsafeCSS(
        `var(--m3e-outlined-icon-button-pressed-unselected-icon-color, var(--m3e-icon-button-pressed-unselected-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Unselected state layer color on pressed. */
      unselectedStateLayerColor: unsafeCSS(
        `var(--m3e-outlined-icon-button-pressed-unselected-state-layer-color, var(--m3e-icon-button-pressed-unselected-state-layer-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Selected icon color on pressed. */
      selectedIconColor: unsafeCSS(
        `var(--m3e-outlined-icon-button-pressed-selected-icon-color, var(--m3e-icon-button-pressed-selected-icon-color, ${DesignToken.color.inverseOnSurface}))`,
      ),

      /** Selected state layer color on pressed. */
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-outlined-icon-button-pressed-selected-state-layer-color, var(--m3e-icon-button-pressed-selected-state-layer-color, ${DesignToken.color.inverseOnSurface}))`,
      ),
    },
  },

  /** Design tokens that control the `filled` variant. */
  filled: {
    /** Default icon color. */
    iconColor: unsafeCSS(
      `var(--m3e-filled-icon-button-icon-color, var(--m3e-icon-button-icon-color, ${DesignToken.color.onPrimary}))`,
    ),

    /** Default container background color. */
    containerColor: unsafeCSS(
      `var(--m3e-filled-icon-button-container-color, var(--m3e-icon-button-container-color, ${DesignToken.color.primary}))`,
    ),

    /** Unselected icon color. */
    unselectedIconColor: unsafeCSS(
      `var(--m3e-filled-icon-button-unselected-icon-color, var(--m3e-icon-button-unselected-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
    ),

    /** Unselected container background color. */
    unselectedContainerColor: unsafeCSS(
      `var(--m3e-filled-icon-button-unselected-container-color, var(--m3e-icon-button-unselected-container-color, ${DesignToken.color.surfaceContainer}))`,
    ),

    /** Selected icon color. */
    selectedIconColor: unsafeCSS(
      `var(--m3e-filled-icon-button-selected-icon-color, var(--m3e-icon-button-selected-icon-color, ${DesignToken.color.onPrimary}))`,
    ),

    /** Selected container background color. */
    selectedContainerColor: unsafeCSS(
      `var(--m3e-filled-icon-button-selected-container-color, var(--m3e-icon-button-selected-container-color, ${DesignToken.color.primary}))`,
    ),

    /** Design tokens that control disabled state. */
    disabled: {
      /** Container background color when disabled. */
      containerColor: unsafeCSS(
        `var(--m3e-filled-icon-button-disabled-container-color, var(--m3e-icon-button-disabled-container-color, ${DesignToken.color.onSurface}))`,
      ),

      /** Opacity of container when disabled. */
      containerOpacity: unsafeCSS(
        `var(--m3e-filled-icon-button-disabled-container-opacity, var(--m3e-icon-button-disabled-container-opacity, 10%))`,
      ),

      /** Icon color when disabled. */
      iconColor: unsafeCSS(
        `var(--m3e-filled-icon-button-disabled-icon-color, var(--m3e-icon-button-disabled-icon-color, ${DesignToken.color.onSurface}))`,
      ),

      /** Icon opacity when disabled. */
      iconOpacity: unsafeCSS(
        `var(--m3e-filled-icon-button-disabled-icon-opacity, var(--m3e-icon-button-disabled-icon-opacity, 38%))`,
      ),
    },

    /** Design tokens that control hover state. */
    hover: {
      /** Icon color on hover. */
      iconColor: unsafeCSS(
        `var(--m3e-filled-icon-button-hover-icon-color, var(--m3e-icon-button-hover-icon-color, ${DesignToken.color.onPrimary}))`,
      ),

      /** State layer color on hover. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-filled-icon-button-hover-state-layer-color, var(--m3e-icon-button-hover-state-layer-color, ${DesignToken.color.onPrimary}))`,
      ),

      /** State layer opacity on hover. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-filled-icon-button-hover-state-layer-opacity, var(--m3e-icon-button-hover-state-layer-opacity, ${DesignToken.state.hoverStateLayerOpacity}))`,
      ),

      /** Unselected icon color on hover. */
      unselectedIconColor: unsafeCSS(
        `var(--m3e-filled-icon-button-hover-unselected-icon-color, var(--m3e-icon-button-hover-unselected-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Unselected state layer color on hover. */
      unselectedStateLayerColor: unsafeCSS(
        `var(--m3e-filled-icon-button-hover-unselected-state-layer-color, var(--m3e-icon-button-hover-unselected-state-layer-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Selected icon color on hover. */
      selectedIconColor: unsafeCSS(
        `var(--m3e-filled-icon-button-hover-selected-icon-color, var(--m3e-icon-button-hover-selected-icon-color, ${DesignToken.color.onPrimary}))`,
      ),

      /** Selected state layer color on hover. */
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-filled-icon-button-hover-selected-state-layer-color, var(--m3e-icon-button-hover-selected-state-layer-color, ${DesignToken.color.onPrimary}))`,
      ),
    },

    /** Design tokens that control focus state. */
    focus: {
      /** Icon color on focus. */
      iconColor: unsafeCSS(
        `var(--m3e-filled-icon-button-focus-icon-color, var(--m3e-icon-button-focus-icon-color, ${DesignToken.color.onPrimary}))`,
      ),

      /** State layer color on focus. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-filled-icon-button-focus-state-layer-color, var(--m3e-icon-button-focus-state-layer-color, ${DesignToken.color.onPrimary}))`,
      ),

      /**State layer opacity on focus. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-filled-icon-button-focus-state-layer-opacity, var(--m3e-icon-button-focus-state-layer-opacity, ${DesignToken.state.focusStateLayerOpacity}))`,
      ),

      /** Unselected icon color on focus. */
      unselectedIconColor: unsafeCSS(
        `var(--m3e-filled-icon-button-focus-unselected-icon-color, var(--m3e-icon-button-focus-unselected-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Unselected state layer color on focus. */
      unselectedStateLayerColor: unsafeCSS(
        `var(--m3e-filled-icon-button-focus-unselected-state-layer-color, var(--m3e-icon-button-focus-unselected-state-layer-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Selected icon color on focus. */
      selectedIconColor: unsafeCSS(
        `var(--m3e-filled-icon-button-focus-selected-icon-color, var(--m3e-icon-button-focus-selected-icon-color, ${DesignToken.color.onPrimary}))`,
      ),

      /** Selected state layer color on focus. */
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-filled-icon-button-focus-selected-state-layer-color, var(--m3e-icon-button-focus-selected-state-layer-color, ${DesignToken.color.onPrimary}))`,
      ),
    },

    /** Design tokens that control pressed state. */
    pressed: {
      /** Icon color on pressed. */
      iconColor: unsafeCSS(
        `var(--m3e-filled-icon-button-pressed-icon-color, var(--m3e-icon-button-pressed-icon-color, ${DesignToken.color.onPrimary}))`,
      ),

      /** State layer color on pressed. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-filled-icon-button-pressed-state-layer-color, var(--m3e-icon-button-pressed-state-layer-color, ${DesignToken.color.onPrimary}))`,
      ),

      /** State layer opacity on pressed. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-filled-icon-button-pressed-state-layer-opacity, var(--m3e-icon-button-pressed-state-layer-opacity, ${DesignToken.state.pressedStateLayerOpacity}))`,
      ),

      /** Unselected icon color on pressed. */
      unselectedIconColor: unsafeCSS(
        `var(--m3e-filled-icon-button-pressed-unselected-icon-color, var(--m3e-icon-button-pressed-unselected-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Unselected state layer color on pressed. */
      unselectedStateLayerColor: unsafeCSS(
        `var(--m3e-filled-icon-button-pressed-unselected-state-layer-color, var(--m3e-icon-button-pressed-unselected-state-layer-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Selected icon color on pressed. */
      selectedIconColor: unsafeCSS(
        `var(--m3e-filled-icon-button-pressed-selected-icon-color, var(--m3e-icon-button-pressed-selected-icon-color, ${DesignToken.color.onPrimary}))`,
      ),

      /** Selected state layer color on pressed. */
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-filled-icon-button-pressed-selected-state-layer-color, var(--m3e-icon-button-pressed-selected-state-layer-color, ${DesignToken.color.onPrimary}))`,
      ),
    },
  },

  /** Design tokens that control the `tonal` variant. */
  tonal: {
    /** Default icon color. */
    iconColor: unsafeCSS(
      `var(--m3e-tonal-icon-button-icon-color, var(--m3e-icon-button-icon-color, ${DesignToken.color.onSecondaryContainer}))`,
    ),

    /** Default container background color. */
    containerColor: unsafeCSS(
      `var(--m3e-tonal-icon-button-container-color, var(--m3e-icon-button-container-color, ${DesignToken.color.secondaryContainer}))`,
    ),

    /** Unselected icon color. */
    unselectedIconColor: unsafeCSS(
      `var(--m3e-tonal-icon-button-unselected-icon-color, var(--m3e-icon-button-unselected-icon-color, ${DesignToken.color.onSecondaryContainer}))`,
    ),

    /** Unselected container background color. */
    unselectedContainerColor: unsafeCSS(
      `var(--m3e-tonal-icon-button-unselected-container-color, var(--m3e-icon-button-unselected-container-color, ${DesignToken.color.secondaryContainer}))`,
    ),

    /** Selected icon color. */
    selectedIconColor: unsafeCSS(
      `var(--m3e-tonal-icon-button-selected-icon-color, var(--m3e-icon-button-selected-icon-color, ${DesignToken.color.onSecondary}))`,
    ),

    /** Selected container background color. */
    selectedContainerColor: unsafeCSS(
      `var(--m3e-tonal-icon-button-selected-container-color, var(--m3e-icon-button-selected-container-color, ${DesignToken.color.secondary}))`,
    ),

    /** Design tokens that control disabled state. */
    disabled: {
      /** Container background color when disabled. */
      containerColor: unsafeCSS(
        `var(--m3e-tonal-icon-button-disabled-container-color, var(--m3e-icon-button-disabled-container-color, ${DesignToken.color.onSurface}))`,
      ),

      /** Opacity of container when disabled. */
      containerOpacity: unsafeCSS(
        `var(--m3e-tonal-icon-button-disabled-container-opacity, var(--m3e-icon-button-disabled-container-opacity, 10%))`,
      ),

      /** Icon color when disabled. */
      iconColor: unsafeCSS(
        `var(--m3e-tonal-icon-button-disabled-icon-color, var(--m3e-icon-button-disabled-icon-color, ${DesignToken.color.onSurface}))`,
      ),

      /** Icon opacity when disabled. */
      iconOpacity: unsafeCSS(
        `var(--m3e-tonal-icon-button-disabled-icon-opacity, var(--m3e-icon-button-disabled-icon-opacity, 38%))`,
      ),
    },

    /** Design tokens that control hover state. */
    hover: {
      /** Icon color on hover. */
      iconColor: unsafeCSS(
        `var(--m3e-tonal-icon-button-hover-icon-color, var(--m3e-icon-button-hover-icon-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),

      /** State layer color on hover. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-tonal-icon-button-hover-state-layer-color, var(--m3e-icon-button-hover-state-layer-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),

      /** State layer opacity on hover. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-tonal-icon-button-hover-state-layer-opacity, var(--m3e-icon-button-hover-state-layer-opacity, ${DesignToken.state.hoverStateLayerOpacity}))`,
      ),

      /** Unselected icon color on hover. */
      unselectedIconColor: unsafeCSS(
        `var(--m3e-tonal-icon-button-hover-unselected-icon-color, var(--m3e-icon-button-hover-unselected-icon-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),

      /** Unselected state layer color on hover. */
      unselectedStateLayerColor: unsafeCSS(
        `var(--m3e-tonal-icon-button-hover-unselected-state-layer-color, var(--m3e-icon-button-hover-unselected-state-layer-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),

      /** Selected icon color on hover. */
      selectedIconColor: unsafeCSS(
        `var(--m3e-tonal-icon-button-hover-selected-icon-color, var(--m3e-icon-button-hover-selected-icon-color, ${DesignToken.color.onSecondary}))`,
      ),

      /** Selected state layer color on hover. */
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-tonal-icon-button-hover-selected-state-layer-color, var(--m3e-icon-button-hover-selected-state-layer-color, ${DesignToken.color.onSecondary}))`,
      ),
    },

    /** Design tokens that control focus state. */
    focus: {
      /** Icon color on focus. */
      iconColor: unsafeCSS(
        `var(--m3e-tonal-icon-button-focus-icon-color, var(--m3e-icon-button-focus-icon-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),

      /** State layer color on focus. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-tonal-icon-button-focus-state-layer-color, var(--m3e-icon-button-focus-state-layer-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),

      /**State layer opacity on focus. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-tonal-icon-button-focus-state-layer-opacity, var(--m3e-icon-button-focus-state-layer-opacity, ${DesignToken.state.focusStateLayerOpacity}))`,
      ),

      /** Unselected icon color on focus. */
      unselectedIconColor: unsafeCSS(
        `var(--m3e-tonal-icon-button-focus-unselected-icon-color, var(--m3e-icon-button-focus-unselected-icon-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),

      /** Unselected state layer color on focus. */
      unselectedStateLayerColor: unsafeCSS(
        `var(--m3e-tonal-icon-button-focus-unselected-state-layer-color, var(--m3e-icon-button-focus-unselected-state-layer-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),

      /** Selected icon color on focus. */
      selectedIconColor: unsafeCSS(
        `var(--m3e-tonal-icon-button-focus-selected-icon-color, var(--m3e-icon-button-focus-selected-icon-color, ${DesignToken.color.onSecondary}))`,
      ),

      /** Selected state layer color on focus. */
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-tonal-icon-button-focus-selected-state-layer-color, var(--m3e-icon-button-focus-selected-state-layer-color, ${DesignToken.color.onSecondary}))`,
      ),
    },

    /** Design tokens that control pressed state. */
    pressed: {
      /** Icon color on pressed. */
      iconColor: unsafeCSS(
        `var(--m3e-tonal-icon-button-pressed-icon-color, var(--m3e-icon-button-pressed-icon-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),

      /** State layer color on pressed. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-tonal-icon-button-pressed-state-layer-color, var(--m3e-icon-button-pressed-state-layer-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),

      /** State layer opacity on pressed. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-tonal-icon-button-pressed-state-layer-opacity, var(--m3e-icon-button-pressed-state-layer-opacity, ${DesignToken.state.pressedStateLayerOpacity}))`,
      ),

      /** Unselected icon color on pressed. */
      unselectedIconColor: unsafeCSS(
        `var(--m3e-tonal-icon-button-pressed-unselected-icon-color, var(--m3e-icon-button-pressed-unselected-icon-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),

      /** Unselected state layer color on pressed. */
      unselectedStateLayerColor: unsafeCSS(
        `var(--m3e-tonal-icon-button-pressed-unselected-state-layer-color, var(--m3e-icon-button-pressed-unselected-state-layer-color, ${DesignToken.color.onSecondaryContainer}))`,
      ),

      /** Selected icon color on pressed. */
      selectedIconColor: unsafeCSS(
        `var(--m3e-tonal-icon-button-pressed-selected-icon-color, var(--m3e-icon-button-pressed-selected-icon-color, ${DesignToken.color.onSecondary}))`,
      ),

      /** Selected state layer color on pressed. */
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-tonal-icon-button-pressed-selected-state-layer-color, var(--m3e-icon-button-pressed-selected-state-layer-color, ${DesignToken.color.onSecondary}))`,
      ),
    },
  },

  /** Design tokens that control the `standard` variant. */
  standard: {
    /** Default icon color. */
    iconColor: unsafeCSS(
      `var(--m3e-standard-icon-button-icon-color, var(--m3e-icon-button-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
    ),

    /** Unselected icon color. */
    unselectedIconColor: unsafeCSS(
      `var(--m3e-standard-icon-button-unselected-icon-color, var(--m3e-icon-button-unselected-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
    ),

    /** Selected icon color. */
    selectedIconColor: unsafeCSS(
      `var(--m3e-standard-icon-button-selected-icon-color, var(--m3e-icon-button-selected-icon-color, ${DesignToken.color.primary}))`,
    ),

    /** Design tokens that control disabled state. */
    disabled: {
      /** Container background color when disabled. */
      containerColor: unsafeCSS(
        `var(--m3e-standard-icon-button-disabled-container-color, var(--m3e-icon-button-disabled-container-color, transparent))`,
      ),

      /** Opacity of container when disabled. */
      containerOpacity: unsafeCSS(
        `var(--m3e-standard-icon-button-disabled-container-opacity, var(--m3e-icon-button-disabled-container-opacity, 10%))`,
      ),

      /** Icon color when disabled. */
      iconColor: unsafeCSS(
        `var(--m3e-standard-icon-button-disabled-icon-color, var(--m3e-icon-button-disabled-icon-color, ${DesignToken.color.onSurface}))`,
      ),

      /** Icon opacity when disabled. */
      iconOpacity: unsafeCSS(
        `var(--m3e-standard-icon-button-disabled-icon-opacity, var(--m3e-icon-button-disabled-icon-opacity, 38%))`,
      ),
    },

    /** Design tokens that control hover state. */
    hover: {
      /** Icon color on hover. */
      iconColor: unsafeCSS(
        `var(--m3e-standard-icon-button-hover-icon-color, var(--m3e-icon-button-hover-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** State layer color on hover. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-standard-icon-button-hover-state-layer-color, var(--m3e-icon-button-hover-state-layer-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** State layer opacity on hover. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-standard-icon-button-hover-state-layer-opacity, var(--m3e-icon-button-hover-state-layer-opacity, ${DesignToken.state.hoverStateLayerOpacity}))`,
      ),

      /** Unselected icon color on hover. */
      unselectedIconColor: unsafeCSS(
        `var(--m3e-standard-icon-button-hover-unselected-icon-color, var(--m3e-icon-button-hover-unselected-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Unselected state layer color on hover. */
      unselectedStateLayerColor: unsafeCSS(
        `var(--m3e-standard-icon-button-hover-unselected-state-layer-color, var(--m3e-icon-button-hover-unselected-state-layer-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Selected icon color on hover. */
      selectedIconColor: unsafeCSS(
        `var(--m3e-standard-icon-button-hover-selected-icon-color, var(--m3e-icon-button-hover-selected-icon-color, ${DesignToken.color.primary}))`,
      ),

      /** Selected state layer color on hover. */
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-standard-icon-button-hover-selected-state-layer-color, var(--m3e-icon-button-hover-selected-state-layer-color, ${DesignToken.color.primary}))`,
      ),
    },

    /** Design tokens that control focus state. */
    focus: {
      /** Icon color on focus. */
      iconColor: unsafeCSS(
        `var(--m3e-standard-icon-button-focus-icon-color, var(--m3e-icon-button-focus-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** State layer color on focus. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-standard-icon-button-focus-state-layer-color, var(--m3e-icon-button-focus-state-layer-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /**State layer opacity on focus. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-standard-icon-button-focus-state-layer-opacity, var(--m3e-icon-button-focus-state-layer-opacity, ${DesignToken.state.focusStateLayerOpacity}))`,
      ),

      /** Unselected icon color on focus. */
      unselectedIconColor: unsafeCSS(
        `var(--m3e-standard-icon-button-focus-unselected-icon-color, var(--m3e-icon-button-focus-unselected-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Unselected state layer color on focus. */
      unselectedStateLayerColor: unsafeCSS(
        `var(--m3e-standard-icon-button-focus-unselected-state-layer-color, var(--m3e-icon-button-focus-unselected-state-layer-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Selected icon color on focus. */
      selectedIconColor: unsafeCSS(
        `var(--m3e-standard-icon-button-focus-selected-icon-color, var(--m3e-icon-button-focus-selected-icon-color, ${DesignToken.color.primary}))`,
      ),

      /** Selected state layer color on focus. */
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-standard-icon-button-focus-selected-state-layer-color, var(--m3e-icon-button-focus-selected-state-layer-color, ${DesignToken.color.primary}))`,
      ),
    },

    /** Design tokens that control pressed state. */
    pressed: {
      /** Icon color on pressed. */
      iconColor: unsafeCSS(
        `var(--m3e-standard-icon-button-pressed-icon-color, var(--m3e-icon-button-pressed-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** State layer color on pressed. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-standard-icon-button-pressed-state-layer-color, var(--m3e-icon-button-pressed-state-layer-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** State layer opacity on pressed. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-standard-icon-button-pressed-state-layer-opacity, var(--m3e-icon-button-pressed-state-layer-opacity, ${DesignToken.state.pressedStateLayerOpacity}))`,
      ),

      /** Unselected icon color on pressed. */
      unselectedIconColor: unsafeCSS(
        `var(--m3e-standard-icon-button-pressed-unselected-icon-color, var(--m3e-icon-button-pressed-unselected-icon-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Unselected state layer color on pressed. */
      unselectedStateLayerColor: unsafeCSS(
        `var(--m3e-standard-icon-button-pressed-unselected-state-layer-color, var(--m3e-icon-button-pressed-unselected-state-layer-color, ${DesignToken.color.onSurfaceVariant}))`,
      ),

      /** Selected icon color on pressed. */
      selectedIconColor: unsafeCSS(
        `var(--m3e-standard-icon-button-pressed-selected-icon-color, var(--m3e-icon-button-pressed-selected-icon-color, ${DesignToken.color.primary}))`,
      ),

      /** Selected state layer color on pressed. */
      selectedStateLayerColor: unsafeCSS(
        `var(--m3e-standard-icon-button-pressed-selected-state-layer-color, var(--m3e-icon-button-pressed-selected-state-layer-color, ${DesignToken.color.primary}))`,
      ),
    },
  },
} as const;
