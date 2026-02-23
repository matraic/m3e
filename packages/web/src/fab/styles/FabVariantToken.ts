import { CSSResult, unsafeCSS } from "lit";

import { DesignToken } from "@m3e/web/core";

import { FabVariant } from "../FabVariant";

/** @private */
type _FabVariantToken = {
  labelTextColor: CSSResult;
  iconColor: CSSResult;
  containerColor: CSSResult;
  containerElevation: CSSResult;
  loweredContainerElevation: CSSResult;
  loweredContainerColor?: CSSResult;
  disabled: {
    containerColor: CSSResult;
    containerOpacity: CSSResult;
    iconColor: CSSResult;
    iconOpacity: CSSResult;
    labelTextColor: CSSResult;
    labelTextOpacity: CSSResult;
    containerElevation: CSSResult;
    loweredContainerElevation: CSSResult;
  };
  hover: {
    iconColor: CSSResult;
    labelTextColor: CSSResult;
    stateLayerColor: CSSResult;
    stateLayerOpacity: CSSResult;
    containerElevation: CSSResult;
    loweredContainerElevation: CSSResult;
  };
  focus: {
    iconColor: CSSResult;
    labelTextColor: CSSResult;
    stateLayerColor: CSSResult;
    stateLayerOpacity: CSSResult;
    containerElevation: CSSResult;
    loweredContainerElevation: CSSResult;
  };
  pressed: {
    iconColor: CSSResult;
    labelTextColor: CSSResult;
    stateLayerColor: CSSResult;
    stateLayerOpacity: CSSResult;
    containerElevation: CSSResult;
    loweredContainerElevation: CSSResult;
  };
};

/**
 * Component design tokens that control the appearance variants of `M3FabElement`.
 * @internal
 */
export const FabVariantToken: Record<FabVariant, _FabVariantToken> = {
  /** Design tokens that control the `primary` variant. */
  primary: {
    /** Default label color. */
    labelTextColor: unsafeCSS(`var(--m3e-primary-fab-label-text-color, ${DesignToken.color.onPrimary})`),

    /** Default icon color. */
    iconColor: unsafeCSS(`var(--m3e-primary-fab-icon-color, ${DesignToken.color.onPrimary})`),

    /** Default container background color. */
    containerColor: unsafeCSS(`var(--m3e-primary-fab-container-color, ${DesignToken.color.primary})`),

    /** Resting elevation. */
    containerElevation: unsafeCSS(`var(--m3e-primary-fab-container-elevation, ${DesignToken.elevation.level3})`),

    /** Lowered resting elevation. */
    loweredContainerElevation: unsafeCSS(
      `var(--m3e-primary-fab-lowered-container-elevation, ${DesignToken.elevation.level2})`,
    ),

    /** Design tokens that control disabled state. */
    disabled: {
      /** Container background color when disabled. */
      containerColor: unsafeCSS(`var(--m3e-primary-fab-disabled-container-color, ${DesignToken.color.onSurface})`),

      /** Opacity of container when disabled. */
      containerOpacity: unsafeCSS(`var(--m3e-primary-fab-disabled-container-opacity, 10%)`),

      /** Icon color when disabled. */
      iconColor: unsafeCSS(`var(--m3e-primary-fab-disabled-icon-color, ${DesignToken.color.onSurface})`),

      /** Icon opacity when disabled. */
      iconOpacity: unsafeCSS(`var(--m3e-primary-fab-disabled-icon-opacity, 38%)`),

      /** Label color when disabled. */
      labelTextColor: unsafeCSS(`var(--m3e-primary-fab-disabled-label-text-color, ${DesignToken.color.onSurface})`),

      /** Label opacity when disabled. */
      labelTextOpacity: unsafeCSS(`var(--m3e-primary-fab-disabled-label-text-opacity, 38%)`),

      /** Elevation when disabled. */
      containerElevation: unsafeCSS(
        `var(--m3e-primary-fab-disabled-container-elevation, ${DesignToken.elevation.level0})`,
      ),

      /** Lowered elevation when disabled. */
      loweredContainerElevation: unsafeCSS(
        `var(--m3e-primary-fab-lowered-disabled-container-elevation, ${DesignToken.elevation.level0})`,
      ),
    },

    /** Design tokens that control hover state. */
    hover: {
      /** Icon color on hover. */
      iconColor: unsafeCSS(`var(--m3e-primary-fab-hover-icon-color, ${DesignToken.color.onPrimary})`),

      /** Label color on hover. */
      labelTextColor: unsafeCSS(`var(--m3e-primary-fab-hover-label-text-color, ${DesignToken.color.onPrimary})`),

      /** State layer color on hover. */
      stateLayerColor: unsafeCSS(`var(--m3e-primary-fab-hover-state-layer-color, ${DesignToken.color.onPrimary})`),

      /** State layer opacity on hover. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-primary-fab-hover-state-layer-opacity, ${DesignToken.state.hoverStateLayerOpacity})`,
      ),

      /** Elevation on hover. */
      containerElevation: unsafeCSS(
        `var(--m3e-primary-fab-hover-container-elevation, ${DesignToken.elevation.level4})`,
      ),

      /** Lowered elevation on hover. */
      loweredContainerElevation: unsafeCSS(
        `var(--m3e-primary-fab-lowered-hover-container-elevation, ${DesignToken.elevation.level3})`,
      ),
    },

    /** Design tokens that control focus state. */
    focus: {
      /** Icon color on focus. */
      iconColor: unsafeCSS(`var(--m3e-primary-fab-focus-icon-color, ${DesignToken.color.onPrimary})`),

      /** Label color on focus. */
      labelTextColor: unsafeCSS(`var(--m3e-primary-fab-focus-label-text-color, ${DesignToken.color.onPrimary})`),

      /** State layer color on focus. */
      stateLayerColor: unsafeCSS(`var(--m3e-primary-fab-focus-state-layer-color, ${DesignToken.color.onPrimary})`),

      /**State layer opacity on focus. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-primary-fab-focus-state-layer-opacity, ${DesignToken.state.focusStateLayerOpacity})`,
      ),

      /** Elevation on focus. */
      containerElevation: unsafeCSS(
        `var(--m3e-primary-fab-focus-container-elevation, ${DesignToken.elevation.level3})`,
      ),

      /** Lowered elevation on focus. */
      loweredContainerElevation: unsafeCSS(
        `var(--m3e-primary-fab-lowered-focus-container-elevation, ${DesignToken.elevation.level2})`,
      ),
    },

    /** Design tokens that control pressed state. */
    pressed: {
      /** Icon color on pressed. */
      iconColor: unsafeCSS(`var(--m3e-primary-fab-pressed-icon-color, ${DesignToken.color.onPrimary})`),

      /** Label color on pressed. */
      labelTextColor: unsafeCSS(`var(--m3e-primary-fab-pressed-label-text-color, ${DesignToken.color.onPrimary})`),

      /** State layer color on pressed. */
      stateLayerColor: unsafeCSS(`var(--m3e-primary-fab-pressed-state-layer-color, ${DesignToken.color.onPrimary})`),

      /** State layer opacity on pressed. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-primary-fab-pressed-state-layer-opacity, ${DesignToken.state.pressedStateLayerOpacity})`,
      ),

      /** Elevation on pressed. */
      containerElevation: unsafeCSS(
        `var(--m3e-primary-fab-pressed-container-elevation, ${DesignToken.elevation.level3})`,
      ),

      /** Lowered elevation on pressed. */
      loweredContainerElevation: unsafeCSS(
        `var(--m3e-primary-fab-lowered-pressed-container-elevation, ${DesignToken.elevation.level2})`,
      ),
    },
  },

  /** Design tokens that control the `secondary` variant. */
  secondary: {
    /** Default label color. */
    labelTextColor: unsafeCSS(`var(--m3e-secondary-fab-label-text-color, ${DesignToken.color.onSecondary})`),

    /** Default icon color. */
    iconColor: unsafeCSS(`var(--m3e-secondary-fab-icon-color, ${DesignToken.color.onSecondary})`),

    /** Default container background color. */
    containerColor: unsafeCSS(`var(--m3e-secondary-fab-container-color, ${DesignToken.color.secondary})`),

    /** Resting elevation. */
    containerElevation: unsafeCSS(`var(--m3e-secondary-fab-container-elevation, ${DesignToken.elevation.level3})`),

    /** Lowered resting elevation. */
    loweredContainerElevation: unsafeCSS(
      `var(--m3e-secondary-fab-lowered-container-elevation, ${DesignToken.elevation.level2})`,
    ),

    /** Design tokens that control disabled state. */
    disabled: {
      /** Container background color when disabled. */
      containerColor: unsafeCSS(`var(--m3e-secondary-fab-disabled-container-color, ${DesignToken.color.onSurface})`),

      /** Opacity of container when disabled. */
      containerOpacity: unsafeCSS(`var(--m3e-secondary-fab-disabled-container-opacity, 10%)`),

      /** Icon color when disabled. */
      iconColor: unsafeCSS(`var(--m3e-secondary-fab-disabled-icon-color, ${DesignToken.color.onSurface})`),

      /** Icon opacity when disabled. */
      iconOpacity: unsafeCSS(`var(--m3e-secondary-fab-disabled-icon-opacity, 38%)`),

      /** Label color when disabled. */
      labelTextColor: unsafeCSS(`var(--m3e-secondary-fab-disabled-label-text-color, ${DesignToken.color.onSurface})`),

      /** Label opacity when disabled. */
      labelTextOpacity: unsafeCSS(`var(--m3e-secondary-fab-disabled-label-text-opacity, 38%)`),

      /** Elevation when disabled. */
      containerElevation: unsafeCSS(
        `var(--m3e-secondary-fab-disabled-container-elevation, ${DesignToken.elevation.level0})`,
      ),

      /** Lowered elevation when disabled. */
      loweredContainerElevation: unsafeCSS(
        `var(--m3e-secondary-fab-lowered-disabled-container-elevation, ${DesignToken.elevation.level0})`,
      ),
    },

    /** Design tokens that control hover state. */
    hover: {
      /** Icon color on hover. */
      iconColor: unsafeCSS(`var(--m3e-secondary-fab-hover-icon-color, ${DesignToken.color.onSecondary})`),

      /** Label color on hover. */
      labelTextColor: unsafeCSS(`var(--m3e-secondary-fab-hover-label-text-color, ${DesignToken.color.onSecondary})`),

      /** State layer color on hover. */
      stateLayerColor: unsafeCSS(`var(--m3e-secondary-fab-hover-state-layer-color, ${DesignToken.color.onSecondary})`),

      /** State layer opacity on hover. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-secondary-fab-hover-state-layer-opacity, ${DesignToken.state.hoverStateLayerOpacity})`,
      ),

      /** Elevation on hover. */
      containerElevation: unsafeCSS(
        `var(--m3e-secondary-fab-hover-container-elevation, ${DesignToken.elevation.level4})`,
      ),

      /** Lowered elevation on hover. */
      loweredContainerElevation: unsafeCSS(
        `var(--m3e-secondary-fab-lowered-hover-container-elevation, ${DesignToken.elevation.level3})`,
      ),
    },

    /** Design tokens that control focus state. */
    focus: {
      /** Icon color on focus. */
      iconColor: unsafeCSS(`var(--m3e-secondary-fab-focus-icon-color, ${DesignToken.color.onSecondary})`),

      /** Label color on focus. */
      labelTextColor: unsafeCSS(`var(--m3e-secondary-fab-focus-label-text-color, ${DesignToken.color.onSecondary})`),

      /** State layer color on focus. */
      stateLayerColor: unsafeCSS(`var(--m3e-secondary-fab-focus-state-layer-color, ${DesignToken.color.onSecondary})`),

      /**State layer opacity on focus. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-secondary-fab-focus-state-layer-opacity, ${DesignToken.state.focusStateLayerOpacity})`,
      ),

      /** Elevation on focus. */
      containerElevation: unsafeCSS(
        `var(--m3e-secondary-fab-focus-container-elevation, ${DesignToken.elevation.level3})`,
      ),

      /** Lowered elevation on focus. */
      loweredContainerElevation: unsafeCSS(
        `var(--m3e-secondary-fab-lowered-focus-container-elevation, ${DesignToken.elevation.level2})`,
      ),
    },

    /** Design tokens that control pressed state. */
    pressed: {
      /** Icon color on pressed. */
      iconColor: unsafeCSS(`var(--m3e-secondary-fab-pressed-icon-color, ${DesignToken.color.onSecondary})`),

      /** Label color on pressed. */
      labelTextColor: unsafeCSS(`var(--m3e-secondary-fab-pressed-label-text-color, ${DesignToken.color.onSecondary})`),

      /** State layer color on pressed. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-secondary-fab-pressed-state-layer-color, ${DesignToken.color.onSecondary})`,
      ),

      /** State layer opacity on pressed. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-secondary-fab-pressed-state-layer-opacity, ${DesignToken.state.pressedStateLayerOpacity})`,
      ),

      /** Elevation on pressed. */
      containerElevation: unsafeCSS(
        `var(--m3e-secondary-fab-pressed-container-elevation, ${DesignToken.elevation.level3})`,
      ),

      /** Lowered elevation on pressed. */
      loweredContainerElevation: unsafeCSS(
        `var(--m3e-secondary-fab-lowered-pressed-container-elevation, ${DesignToken.elevation.level2})`,
      ),
    },
  },

  /** Design tokens that control the `tertiary` variant. */
  tertiary: {
    /** Default label color. */
    labelTextColor: unsafeCSS(`var(--m3e-tertiary-fab-label-text-color, ${DesignToken.color.onTertiary})`),

    /** Default icon color. */
    iconColor: unsafeCSS(`var(--m3e-tertiary-fab-icon-color, ${DesignToken.color.onTertiary})`),

    /** Default container background color. */
    containerColor: unsafeCSS(`var(--m3e-tertiary-fab-container-color, ${DesignToken.color.tertiary})`),

    /** Resting elevation. */
    containerElevation: unsafeCSS(`var(--m3e-tertiary-fab-container-elevation, ${DesignToken.elevation.level3})`),

    /** Lowered resting elevation. */
    loweredContainerElevation: unsafeCSS(
      `var(--m3e-tertiary-fab-lowered-container-elevation, ${DesignToken.elevation.level2})`,
    ),

    /** Design tokens that control disabled state. */
    disabled: {
      /** Container background color when disabled. */
      containerColor: unsafeCSS(`var(--m3e-tertiary-fab-disabled-container-color, ${DesignToken.color.onSurface})`),

      /** Opacity of container when disabled. */
      containerOpacity: unsafeCSS(`var(--m3e-tertiary-fab-disabled-container-opacity, 10%)`),

      /** Icon color when disabled. */
      iconColor: unsafeCSS(`var(--m3e-tertiary-fab-disabled-icon-color, ${DesignToken.color.onSurface})`),

      /** Icon opacity when disabled. */
      iconOpacity: unsafeCSS(`var(--m3e-tertiary-fab-disabled-icon-opacity, 38%)`),

      /** Label color when disabled. */
      labelTextColor: unsafeCSS(`var(--m3e-tertiary-fab-disabled-label-text-color, ${DesignToken.color.onSurface})`),

      /** Label opacity when disabled. */
      labelTextOpacity: unsafeCSS(`var(--m3e-tertiary-fab-disabled-label-text-opacity, 38%)`),

      /** Elevation when disabled. */
      containerElevation: unsafeCSS(
        `var(--m3e-tertiary-fab-disabled-container-elevation, ${DesignToken.elevation.level0})`,
      ),

      /** Lowered elevation when disabled. */
      loweredContainerElevation: unsafeCSS(
        `var(--m3e-tertiary-fab-lowered-disabled-container-elevation, ${DesignToken.elevation.level0})`,
      ),
    },

    /** Design tokens that control hover state. */
    hover: {
      /** Icon color on hover. */
      iconColor: unsafeCSS(`var(--m3e-tertiary-fab-hover-icon-color, ${DesignToken.color.onTertiary})`),

      /** Label color on hover. */
      labelTextColor: unsafeCSS(`var(--m3e-tertiary-fab-hover-label-text-color, ${DesignToken.color.onTertiary})`),

      /** State layer color on hover. */
      stateLayerColor: unsafeCSS(`var(--m3e-tertiary-fab-hover-state-layer-color, ${DesignToken.color.onTertiary})`),

      /** State layer opacity on hover. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-tertiary-fab-hover-state-layer-opacity, ${DesignToken.state.hoverStateLayerOpacity})`,
      ),

      /** Elevation on hover. */
      containerElevation: unsafeCSS(
        `var(--m3e-tertiary-fab-hover-container-elevation, ${DesignToken.elevation.level4})`,
      ),

      /** Lowered elevation on hover. */
      loweredContainerElevation: unsafeCSS(
        `var(--m3e-tertiary-fab-lowered-hover-container-elevation, ${DesignToken.elevation.level3})`,
      ),
    },

    /** Design tokens that control focus state. */
    focus: {
      /** Icon color on focus. */
      iconColor: unsafeCSS(`var(--m3e-tertiary-fab-focus-icon-color, ${DesignToken.color.onTertiary})`),

      /** Label color on focus. */
      labelTextColor: unsafeCSS(`var(--m3e-tertiary-fab-focus-label-text-color, ${DesignToken.color.onTertiary})`),

      /** State layer color on focus. */
      stateLayerColor: unsafeCSS(`var(--m3e-tertiary-fab-focus-state-layer-color, ${DesignToken.color.onTertiary})`),

      /**State layer opacity on focus. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-tertiary-fab-focus-state-layer-opacity, ${DesignToken.state.focusStateLayerOpacity})`,
      ),

      /** Elevation on focus. */
      containerElevation: unsafeCSS(
        `var(--m3e-tertiary-fab-focus-container-elevation, ${DesignToken.elevation.level3})`,
      ),

      /** Lowered elevation on focus. */
      loweredContainerElevation: unsafeCSS(
        `var(--m3e-tertiary-fab-lowered-focus-container-elevation, ${DesignToken.elevation.level2})`,
      ),
    },

    /** Design tokens that control pressed state. */
    pressed: {
      /** Icon color on pressed. */
      iconColor: unsafeCSS(`var(--m3e-tertiary-fab-pressed-icon-color, ${DesignToken.color.onTertiary})`),

      /** Label color on pressed. */
      labelTextColor: unsafeCSS(`var(--m3e-tertiary-fab-pressed-label-text-color, ${DesignToken.color.onTertiary})`),

      /** State layer color on pressed. */
      stateLayerColor: unsafeCSS(`var(--m3e-tertiary-fab-pressed-state-layer-color, ${DesignToken.color.onTertiary})`),

      /** State layer opacity on pressed. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-tertiary-fab-pressed-state-layer-opacity, ${DesignToken.state.pressedStateLayerOpacity})`,
      ),

      /** Elevation on pressed. */
      containerElevation: unsafeCSS(
        `var(--m3e-tertiary-fab-pressed-container-elevation, ${DesignToken.elevation.level3})`,
      ),

      /** Lowered elevation on pressed. */
      loweredContainerElevation: unsafeCSS(
        `var(--m3e-tertiary-fab-lowered-pressed-container-elevation, ${DesignToken.elevation.level2})`,
      ),
    },
  },
  /** Design tokens that control the `primary-container` variant. */
  "primary-container": {
    /** Default label color. */
    labelTextColor: unsafeCSS(
      `var(--m3e-primary-container-fab-label-text-color, ${DesignToken.color.onPrimaryContainer})`,
    ),

    /** Default icon color. */
    iconColor: unsafeCSS(`var(--m3e-primary-container-fab-icon-color, ${DesignToken.color.onPrimaryContainer})`),

    /** Default container background color. */
    containerColor: unsafeCSS(
      `var(--m3e-primary-container-fab-container-color, ${DesignToken.color.primaryContainer})`,
    ),

    /** Resting elevation. */
    containerElevation: unsafeCSS(
      `var(--m3e-primary-container-fab-container-elevation, ${DesignToken.elevation.level3})`,
    ),

    /** Lowered resting elevation. */
    loweredContainerElevation: unsafeCSS(
      `var(--m3e-primary-container-fab-lowered-container-elevation, ${DesignToken.elevation.level2})`,
    ),

    /** Design tokens that control disabled state. */
    disabled: {
      /** Container background color when disabled. */
      containerColor: unsafeCSS(
        `var(--m3e-primary-container-fab-disabled-container-color, ${DesignToken.color.onSurface})`,
      ),

      /** Opacity of container when disabled. */
      containerOpacity: unsafeCSS(`var(--m3e-primary-container-fab-disabled-container-opacity, 10%)`),

      /** Icon color when disabled. */
      iconColor: unsafeCSS(`var(--m3e-primary-container-fab-disabled-icon-color, ${DesignToken.color.onSurface})`),

      /** Icon opacity when disabled. */
      iconOpacity: unsafeCSS(`var(--m3e-primary-container-fab-disabled-icon-opacity, 38%)`),

      /** Label color when disabled. */
      labelTextColor: unsafeCSS(
        `var(--m3e-primary-container-fab-disabled-label-text-color, ${DesignToken.color.onSurface})`,
      ),

      /** Label opacity when disabled. */
      labelTextOpacity: unsafeCSS(`var(--m3e-primary-container-fab-disabled-label-text-opacity, 38%)`),

      /** Elevation when disabled. */
      containerElevation: unsafeCSS(
        `var(--m3e-primary-container-fab-disabled-container-elevation, ${DesignToken.elevation.level0})`,
      ),

      /** Lowered elevation when disabled. */
      loweredContainerElevation: unsafeCSS(
        `var(--m3e-primary-container-fab-lowered-disabled-container-elevation, ${DesignToken.elevation.level0})`,
      ),
    },

    /** Design tokens that control hover state. */
    hover: {
      /** Icon color on hover. */
      iconColor: unsafeCSS(
        `var(--m3e-primary-container-fab-hover-icon-color, ${DesignToken.color.onPrimaryContainer})`,
      ),

      /** Label color on hover. */
      labelTextColor: unsafeCSS(
        `var(--m3e-primary-container-fab-hover-label-text-color, ${DesignToken.color.onPrimaryContainer})`,
      ),

      /** State layer color on hover. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-primary-container-fab-hover-state-layer-color, ${DesignToken.color.onPrimaryContainer})`,
      ),

      /** State layer opacity on hover. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-primary-container-fab-hover-state-layer-opacity, ${DesignToken.state.hoverStateLayerOpacity})`,
      ),

      /** Elevation on hover. */
      containerElevation: unsafeCSS(
        `var(--m3e-primary-container-fab-hover-container-elevation, ${DesignToken.elevation.level4})`,
      ),

      /** Lowered elevation on hover. */
      loweredContainerElevation: unsafeCSS(
        `var(--m3e-primary-container-fab-lowered-hover-container-elevation, ${DesignToken.elevation.level3})`,
      ),
    },

    /** Design tokens that control focus state. */
    focus: {
      /** Icon color on focus. */
      iconColor: unsafeCSS(
        `var(--m3e-primary-container-fab-focus-icon-color, ${DesignToken.color.onPrimaryContainer})`,
      ),

      /** Label color on focus. */
      labelTextColor: unsafeCSS(
        `var(--m3e-primary-container-fab-focus-label-text-color, ${DesignToken.color.onPrimaryContainer})`,
      ),

      /** State layer color on focus. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-primary-container-fab-focus-state-layer-color, ${DesignToken.color.onPrimaryContainer})`,
      ),

      /**State layer opacity on focus. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-primary-container-fab-focus-state-layer-opacity, ${DesignToken.state.focusStateLayerOpacity})`,
      ),

      /** Elevation on focus. */
      containerElevation: unsafeCSS(
        `var(--m3e-primary-container-fab-focus-container-elevation, ${DesignToken.elevation.level3})`,
      ),

      /** Lowered elevation on focus. */
      loweredContainerElevation: unsafeCSS(
        `var(--m3e-primary-container-fab-lowered-focus-container-elevation, ${DesignToken.elevation.level2})`,
      ),
    },

    /** Design tokens that control pressed state. */
    pressed: {
      /** Icon color on pressed. */
      iconColor: unsafeCSS(
        `var(--m3e-primary-container-fab-pressed-icon-color, ${DesignToken.color.onPrimaryContainer})`,
      ),

      /** Label color on pressed. */
      labelTextColor: unsafeCSS(
        `var(--m3e-primary-container-fab-pressed-label-text-color, ${DesignToken.color.onPrimaryContainer})`,
      ),

      /** State layer color on pressed. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-primary-container-fab-pressed-state-layer-color, ${DesignToken.color.onPrimaryContainer})`,
      ),

      /** State layer opacity on pressed. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-primary-container-fab-pressed-state-layer-opacity, ${DesignToken.state.pressedStateLayerOpacity})`,
      ),

      /** Elevation on pressed. */
      containerElevation: unsafeCSS(
        `var(--m3e-primary-container-fab-pressed-container-elevation, ${DesignToken.elevation.level3})`,
      ),

      /** Lowered elevation on pressed. */
      loweredContainerElevation: unsafeCSS(
        `var(--m3e-primary-container-fab-lowered-pressed-container-elevation, ${DesignToken.elevation.level2})`,
      ),
    },
  },

  /** Design tokens that control the `secondary-container` variant. */
  "secondary-container": {
    /** Default label color. */
    labelTextColor: unsafeCSS(
      `var(--m3e-secondary-container-fab-label-text-color, ${DesignToken.color.onSecondaryContainer})`,
    ),

    /** Default icon color. */
    iconColor: unsafeCSS(`var(--m3e-secondary-container-fab-icon-color, ${DesignToken.color.onSecondaryContainer})`),

    /** Default container background color. */
    containerColor: unsafeCSS(
      `var(--m3e-secondary-container-fab-container-color, ${DesignToken.color.secondaryContainer})`,
    ),

    /** Resting elevation. */
    containerElevation: unsafeCSS(
      `var(--m3e-secondary-container-fab-container-elevation, ${DesignToken.elevation.level3})`,
    ),

    /** Lowered resting elevation. */
    loweredContainerElevation: unsafeCSS(
      `var(--m3e-secondary-container-fab-lowered-container-elevation, ${DesignToken.elevation.level2})`,
    ),

    /** Design tokens that control disabled state. */
    disabled: {
      /** Container background color when disabled. */
      containerColor: unsafeCSS(
        `var(--m3e-secondary-container-fab-disabled-container-color, ${DesignToken.color.onSurface})`,
      ),

      /** Opacity of container when disabled. */
      containerOpacity: unsafeCSS(`var(--m3e-secondary-container-fab-disabled-container-opacity, 10%)`),

      /** Icon color when disabled. */
      iconColor: unsafeCSS(`var(--m3e-secondary-container-fab-disabled-icon-color, ${DesignToken.color.onSurface})`),

      /** Icon opacity when disabled. */
      iconOpacity: unsafeCSS(`var(--m3e-secondary-container-fab-disabled-icon-opacity, 38%)`),

      /** Label color when disabled. */
      labelTextColor: unsafeCSS(
        `var(--m3e-secondary-container-fab-disabled-label-text-color, ${DesignToken.color.onSurface})`,
      ),

      /** Label opacity when disabled. */
      labelTextOpacity: unsafeCSS(`var(--m3e-secondary-container-fab-disabled-label-text-opacity, 38%)`),

      /** Elevation when disabled. */
      containerElevation: unsafeCSS(
        `var(--m3e-secondary-container-fab-disabled-container-elevation, ${DesignToken.elevation.level0})`,
      ),

      /** Lowered elevation when disabled. */
      loweredContainerElevation: unsafeCSS(
        `var(--m3e-secondary-container-fab-lowered-disabled-container-elevation, ${DesignToken.elevation.level0})`,
      ),
    },

    /** Design tokens that control hover state. */
    hover: {
      /** Icon color on hover. */
      iconColor: unsafeCSS(
        `var(--m3e-secondary-container-fab-hover-icon-color, ${DesignToken.color.onSecondaryContainer})`,
      ),

      /** Label color on hover. */
      labelTextColor: unsafeCSS(
        `var(--m3e-secondary-container-fab-hover-label-text-color, ${DesignToken.color.onSecondaryContainer})`,
      ),

      /** State layer color on hover. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-secondary-container-fab-hover-state-layer-color, ${DesignToken.color.onSecondaryContainer})`,
      ),

      /** State layer opacity on hover. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-secondary-container-fab-hover-state-layer-opacity, ${DesignToken.state.hoverStateLayerOpacity})`,
      ),

      /** Elevation on hover. */
      containerElevation: unsafeCSS(
        `var(--m3e-secondary-container-fab-hover-container-elevation, ${DesignToken.elevation.level4})`,
      ),

      /** Lowered elevation on hover. */
      loweredContainerElevation: unsafeCSS(
        `var(--m3e-secondary-container-fab-lowered-hover-container-elevation, ${DesignToken.elevation.level3})`,
      ),
    },

    /** Design tokens that control focus state. */
    focus: {
      /** Icon color on focus. */
      iconColor: unsafeCSS(
        `var(--m3e-secondary-container-fab-focus-icon-color, ${DesignToken.color.onSecondaryContainer})`,
      ),

      /** Label color on focus. */
      labelTextColor: unsafeCSS(
        `var(--m3e-secondary-container-fab-focus-label-text-color, ${DesignToken.color.onSecondaryContainer})`,
      ),

      /** State layer color on focus. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-secondary-container-fab-focus-state-layer-color, ${DesignToken.color.onSecondaryContainer})`,
      ),

      /**State layer opacity on focus. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-secondary-container-fab-focus-state-layer-opacity, ${DesignToken.state.focusStateLayerOpacity})`,
      ),

      /** Elevation on focus. */
      containerElevation: unsafeCSS(
        `var(--m3e-secondary-container-fab-focus-container-elevation, ${DesignToken.elevation.level3})`,
      ),

      /** Lowered elevation on focus. */
      loweredContainerElevation: unsafeCSS(
        `var(--m3e-secondary-container-fab-lowered-focus-container-elevation, ${DesignToken.elevation.level2})`,
      ),
    },

    /** Design tokens that control pressed state. */
    pressed: {
      /** Icon color on pressed. */
      iconColor: unsafeCSS(
        `var(--m3e-secondary-container-fab-pressed-icon-color, ${DesignToken.color.onSecondaryContainer})`,
      ),

      /** Label color on pressed. */
      labelTextColor: unsafeCSS(
        `var(--m3e-secondary-container-fab-pressed-label-text-color, ${DesignToken.color.onSecondaryContainer})`,
      ),

      /** State layer color on pressed. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-secondary-container-fab-pressed-state-layer-color, ${DesignToken.color.onSecondaryContainer})`,
      ),

      /** State layer opacity on pressed. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-secondary-container-fab-pressed-state-layer-opacity, ${DesignToken.state.pressedStateLayerOpacity})`,
      ),

      /** Elevation on pressed. */
      containerElevation: unsafeCSS(
        `var(--m3e-secondary-container-fab-pressed-container-elevation, ${DesignToken.elevation.level3})`,
      ),

      /** Lowered elevation on pressed. */
      loweredContainerElevation: unsafeCSS(
        `var(--m3e-secondary-container-fab-lowered-pressed-container-elevation, ${DesignToken.elevation.level2})`,
      ),
    },
  },

  /** Design tokens that control the `tertiary-container` variant. */
  "tertiary-container": {
    /** Default label color. */
    labelTextColor: unsafeCSS(
      `var(--m3e-tertiary-container-fab-label-text-color, ${DesignToken.color.onTertiaryContainer})`,
    ),

    /** Default icon color. */
    iconColor: unsafeCSS(`var(--m3e-tertiary-container-fab-icon-color, ${DesignToken.color.onTertiaryContainer})`),

    /** Default container background color. */
    containerColor: unsafeCSS(
      `var(--m3e-tertiary-container-fab-container-color, ${DesignToken.color.tertiaryContainer})`,
    ),

    /** Resting elevation. */
    containerElevation: unsafeCSS(
      `var(--m3e-tertiary-container-fab-container-elevation, ${DesignToken.elevation.level3})`,
    ),

    /** Lowered resting elevation. */
    loweredContainerElevation: unsafeCSS(
      `var(--m3e-tertiary-container-fab-lowered-container-elevation, ${DesignToken.elevation.level2})`,
    ),

    /** Design tokens that control disabled state. */
    disabled: {
      /** Container background color when disabled. */
      containerColor: unsafeCSS(
        `var(--m3e-tertiary-container-fab-disabled-container-color, ${DesignToken.color.onSurface})`,
      ),

      /** Opacity of container when disabled. */
      containerOpacity: unsafeCSS(`var(--m3e-tertiary-container-fab-disabled-container-opacity, 10%)`),

      /** Icon color when disabled. */
      iconColor: unsafeCSS(`var(--m3e-tertiary-container-fab-disabled-icon-color, ${DesignToken.color.onSurface})`),

      /** Icon opacity when disabled. */
      iconOpacity: unsafeCSS(`var(--m3e-tertiary-container-fab-disabled-icon-opacity, 38%)`),

      /** Label color when disabled. */
      labelTextColor: unsafeCSS(
        `var(--m3e-tertiary-container-fab-disabled-label-text-color, ${DesignToken.color.onSurface})`,
      ),

      /** Label opacity when disabled. */
      labelTextOpacity: unsafeCSS(`var(--m3e-tertiary-container-fab-disabled-label-text-opacity, 38%)`),

      /** Elevation when disabled. */
      containerElevation: unsafeCSS(
        `var(--m3e-tertiary-container-fab-disabled-container-elevation, ${DesignToken.elevation.level0})`,
      ),

      /** Lowered elevation when disabled. */
      loweredContainerElevation: unsafeCSS(
        `var(--m3e-tertiary-container-fab-lowered-disabled-container-elevation, ${DesignToken.elevation.level0})`,
      ),
    },

    /** Design tokens that control hover state. */
    hover: {
      /** Icon color on hover. */
      iconColor: unsafeCSS(
        `var(--m3e-tertiary-container-fab-hover-icon-color, ${DesignToken.color.onTertiaryContainer})`,
      ),

      /** Label color on hover. */
      labelTextColor: unsafeCSS(
        `var(--m3e-tertiary-container-fab-hover-label-text-color, ${DesignToken.color.onTertiaryContainer})`,
      ),

      /** State layer color on hover. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-tertiary-container-fab-hover-state-layer-color, ${DesignToken.color.onTertiaryContainer})`,
      ),

      /** State layer opacity on hover. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-tertiary-container-fab-hover-state-layer-opacity, ${DesignToken.state.hoverStateLayerOpacity})`,
      ),

      /** Elevation on hover. */
      containerElevation: unsafeCSS(
        `var(--m3e-tertiary-container-fab-hover-container-elevation, ${DesignToken.elevation.level4})`,
      ),

      /** Lowered elevation on hover. */
      loweredContainerElevation: unsafeCSS(
        `var(--m3e-tertiary-container-fab-lowered-hover-container-elevation, ${DesignToken.elevation.level3})`,
      ),
    },

    /** Design tokens that control focus state. */
    focus: {
      /** Icon color on focus. */
      iconColor: unsafeCSS(
        `var(--m3e-tertiary-container-fab-focus-icon-color, ${DesignToken.color.onTertiaryContainer})`,
      ),

      /** Label color on focus. */
      labelTextColor: unsafeCSS(
        `var(--m3e-tertiary-container-fab-focus-label-text-color, ${DesignToken.color.onTertiaryContainer})`,
      ),

      /** State layer color on focus. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-tertiary-container-fab-focus-state-layer-color, ${DesignToken.color.onTertiaryContainer})`,
      ),

      /**State layer opacity on focus. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-tertiary-container-fab-focus-state-layer-opacity, ${DesignToken.state.focusStateLayerOpacity})`,
      ),

      /** Elevation on focus. */
      containerElevation: unsafeCSS(
        `var(--m3e-tertiary-container-fab-focus-container-elevation, ${DesignToken.elevation.level3})`,
      ),

      /** Lowered elevation on focus. */
      loweredContainerElevation: unsafeCSS(
        `var(--m3e-tertiary-container-fab-lowered-focus-container-elevation, ${DesignToken.elevation.level2})`,
      ),
    },

    /** Design tokens that control pressed state. */
    pressed: {
      /** Icon color on pressed. */
      iconColor: unsafeCSS(
        `var(--m3e-tertiary-container-fab-pressed-icon-color, ${DesignToken.color.onTertiaryContainer})`,
      ),

      /** Label color on pressed. */
      labelTextColor: unsafeCSS(
        `var(--m3e-tertiary-container-fab-pressed-label-text-color, ${DesignToken.color.onTertiaryContainer})`,
      ),

      /** State layer color on pressed. */
      stateLayerColor: unsafeCSS(
        `var(--m3e-tertiary-container-fab-pressed-state-layer-color, ${DesignToken.color.onTertiaryContainer})`,
      ),

      /** State layer opacity on pressed. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-tertiary-container-fab-pressed-state-layer-opacity, ${DesignToken.state.pressedStateLayerOpacity})`,
      ),

      /** Elevation on pressed. */
      containerElevation: unsafeCSS(
        `var(--m3e-tertiary-container-fab-pressed-container-elevation, ${DesignToken.elevation.level3})`,
      ),

      /** Lowered elevation on pressed. */
      loweredContainerElevation: unsafeCSS(
        `var(--m3e-tertiary-container-fab-lowered-pressed-container-elevation, ${DesignToken.elevation.level2})`,
      ),
    },
  },
  /** Design tokens that control the `surface` variant. */
  surface: {
    /** Default label color. */
    labelTextColor: unsafeCSS(`var(--m3e-surface-fab-label-text-color, ${DesignToken.color.primary})`),

    /** Default icon color. */
    iconColor: unsafeCSS(`var(--m3e-surface-fab-icon-color, ${DesignToken.color.primary})`),

    /** Default container background color. */
    containerColor: unsafeCSS(`var(--m3e-surface-fab-container-color, ${DesignToken.color.surfaceContainerHigh})`),

    /** Resting elevation. */
    containerElevation: unsafeCSS(`var(--m3e-surface-fab-container-elevation, ${DesignToken.elevation.level3})`),

    /** Lowered resting elevation. */
    loweredContainerElevation: unsafeCSS(
      `var(--m3e-surface-fab-lowered-container-elevation, ${DesignToken.elevation.level2})`,
    ),

    /** Lowered container background color. */
    loweredContainerColor: unsafeCSS(
      `var(--m3e-surface-fab-lowered-container-color, ${DesignToken.color.surfaceContainerLow})`,
    ),

    /** Design tokens that control disabled state. */
    disabled: {
      /** Container background color when disabled. */
      containerColor: unsafeCSS(`var(--m3e-surface-fab-disabled-container-color, ${DesignToken.color.onSurface})`),

      /** Opacity of container when disabled. */
      containerOpacity: unsafeCSS(`var(--m3e-surface-fab-disabled-container-opacity, 10%)`),

      /** Icon color when disabled. */
      iconColor: unsafeCSS(`var(--m3e-surface-fab-disabled-icon-color, ${DesignToken.color.onSurface})`),

      /** Icon opacity when disabled. */
      iconOpacity: unsafeCSS(`var(--m3e-surface-fab-disabled-icon-opacity, 38%)`),

      /** Label color when disabled. */
      labelTextColor: unsafeCSS(`var(--m3e-surface-fab-disabled-label-text-color, ${DesignToken.color.onSurface})`),

      /** Label opacity when disabled. */
      labelTextOpacity: unsafeCSS(`var(--m3e-surface-fab-disabled-label-text-opacity, 38%)`),

      /** Elevation when disabled. */
      containerElevation: unsafeCSS(
        `var(--m3e-surface-fab-disabled-container-elevation, ${DesignToken.elevation.level0})`,
      ),

      /** Lowered elevation when disabled. */
      loweredContainerElevation: unsafeCSS(
        `var(--m3e-surface-fab-lowered-disabled-container-elevation, ${DesignToken.elevation.level0})`,
      ),
    },

    /** Design tokens that control hover state. */
    hover: {
      /** Icon color on hover. */
      iconColor: unsafeCSS(`var(--m3e-surface-fab-hover-icon-color, ${DesignToken.color.primary})`),

      /** Label color on hover. */
      labelTextColor: unsafeCSS(`var(--m3e-surface-fab-hover-label-text-color, ${DesignToken.color.primary})`),

      /** State layer color on hover. */
      stateLayerColor: unsafeCSS(`var(--m3e-surface-fab-hover-state-layer-color, ${DesignToken.color.primary})`),

      /** State layer opacity on hover. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-surface-fab-hover-state-layer-opacity, ${DesignToken.state.hoverStateLayerOpacity})`,
      ),

      /** Elevation on hover. */
      containerElevation: unsafeCSS(
        `var(--m3e-surface-fab-hover-container-elevation, ${DesignToken.elevation.level4})`,
      ),

      /** Lowered elevation on hover. */
      loweredContainerElevation: unsafeCSS(
        `var(--m3e-surface-fab-lowered-hover-container-elevation, ${DesignToken.elevation.level3})`,
      ),
    },

    /** Design tokens that control focus state. */
    focus: {
      /** Icon color on focus. */
      iconColor: unsafeCSS(`var(--m3e-surface-fab-focus-icon-color, ${DesignToken.color.primary})`),

      /** Label color on focus. */
      labelTextColor: unsafeCSS(`var(--m3e-surface-fab-focus-label-text-color, ${DesignToken.color.primary})`),

      /** State layer color on focus. */
      stateLayerColor: unsafeCSS(`var(--m3e-surface-fab-focus-state-layer-color, ${DesignToken.color.primary})`),

      /**State layer opacity on focus. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-surface-fab-focus-state-layer-opacity, ${DesignToken.state.focusStateLayerOpacity})`,
      ),

      /** Elevation on focus. */
      containerElevation: unsafeCSS(
        `var(--m3e-surface-fab-focus-container-elevation, ${DesignToken.elevation.level3})`,
      ),

      /** Lowered elevation on focus. */
      loweredContainerElevation: unsafeCSS(
        `var(--m3e-surface-fab-lowered-focus-container-elevation, ${DesignToken.elevation.level2})`,
      ),
    },

    /** Design tokens that control pressed state. */
    pressed: {
      /** Icon color on pressed. */
      iconColor: unsafeCSS(`var(--m3e-surface-fab-pressed-icon-color, ${DesignToken.color.primary})`),

      /** Label color on pressed. */
      labelTextColor: unsafeCSS(`var(--m3e-surface-fab-pressed-label-text-color, ${DesignToken.color.primary})`),

      /** State layer color on pressed. */
      stateLayerColor: unsafeCSS(`var(--m3e-surface-fab-pressed-state-layer-color, ${DesignToken.color.primary})`),

      /** State layer opacity on pressed. */
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-surface-fab-pressed-state-layer-opacity, ${DesignToken.state.pressedStateLayerOpacity})`,
      ),

      /** Elevation on pressed. */
      containerElevation: unsafeCSS(
        `var(--m3e-surface-fab-pressed-container-elevation, ${DesignToken.elevation.level3})`,
      ),

      /** Lowered elevation on pressed. */
      loweredContainerElevation: unsafeCSS(
        `var(--m3e-surface-fab-lowered-pressed-container-elevation, ${DesignToken.elevation.level2})`,
      ),
    },
  },
} as const;
