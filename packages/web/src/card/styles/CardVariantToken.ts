import { CSSResult, unsafeCSS } from "lit";

import { DesignToken } from "@m3e/web/core";

import { CardVariant } from "../CardVariant";

/** @private */
type _CardVariantToken = {
  textColor: CSSResult;
  containerColor?: CSSResult;
  containerElevation: CSSResult;
  outlineColor?: CSSResult;
  outlineThickness?: CSSResult;
  disabled: {
    textColor: CSSResult;
    textOpacity: CSSResult;
    imageOpacity: CSSResult;
    containerColor?: CSSResult;
    containerOpacity?: CSSResult;
    containerElevation: CSSResult;
    containerElevationColor: CSSResult;
    containerElevationOpacity: CSSResult;
    outlineColor?: CSSResult;
    outlineOpacity?: CSSResult;
  };
  hover: {
    textColor: CSSResult;
    stateLayerColor: CSSResult;
    stateLayerOpacity: CSSResult;
    containerElevation?: CSSResult;
    outlineColor?: CSSResult;
  };
  focus: {
    textColor: CSSResult;
    stateLayerColor: CSSResult;
    stateLayerOpacity: CSSResult;
    containerElevation?: CSSResult;
    outlineColor?: CSSResult;
  };
  pressed: {
    textColor: CSSResult;
    stateLayerColor: CSSResult;
    stateLayerOpacity: CSSResult;
    containerElevation?: CSSResult;
    outlineColor?: CSSResult;
  };
};

/**
 * Component design tokens that control the appearance variants of `M3eCardElement`.
 * @internal
 */
export const CardVariantToken: Record<CardVariant, _CardVariantToken> = {
  filled: {
    textColor: unsafeCSS(`var(--m3e-filled-card-text-color, ${DesignToken.color.onSurface})`),
    containerColor: unsafeCSS(`var(--m3e-filled-card-container-color, ${DesignToken.color.surfaceContainerHighest})`),
    containerElevation: unsafeCSS(`var(--m3e-filled-card-container-elevation, ${DesignToken.elevation.level0})`),
    disabled: {
      textColor: unsafeCSS(`var(--m3e-filled-card-disabled-text-color, ${DesignToken.color.onSurface})`),
      textOpacity: unsafeCSS(`var(--m3e-filled-card-disabled-text-opacity, 38%)`),
      imageOpacity: unsafeCSS(`var(--m3e-filled-card-disabled-image-opacity, 38%)`),
      containerColor: unsafeCSS(`var(--m3e-filled-card-disabled-container-color, ${DesignToken.color.surfaceVariant})`),
      containerElevation: unsafeCSS(
        `var(--m3e-filled-card-disabled-container-elevation, ${DesignToken.elevation.level0})`,
      ),
      containerElevationColor: unsafeCSS(
        `var(--m3e-filled-card-disabled-container-elevation-color, ${DesignToken.color.onSurface})`,
      ),
      containerElevationOpacity: unsafeCSS(`var(--m3e-filled-card-disabled-container-elevation-opacity, 38%)`),
      containerOpacity: unsafeCSS(`var(--m3e-filled-card-disabled-container-opacity, 38%)`),
    },
    hover: {
      textColor: unsafeCSS(`var(--m3e-filled-card-hover-text-color, ${DesignToken.color.onSurface})`),
      stateLayerColor: unsafeCSS(`var(--m3e-filled-card-hover-state-layer-color, ${DesignToken.color.onSurface})`),
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-filled-card-hover-state-layer-opacity, ${DesignToken.state.hoverStateLayerOpacity})`,
      ),
      containerElevation: unsafeCSS(
        `var(--m3e-filled-card-hover-container-elevation, ${DesignToken.elevation.level1})`,
      ),
    },
    focus: {
      textColor: unsafeCSS(`var(--m3e-filled-card-focus-text-color, ${DesignToken.color.onSurface})`),
      stateLayerColor: unsafeCSS(`var(--m3e-filled-card-focus-state-layer-color, ${DesignToken.color.onSurface})`),
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-filled-card-focus-state-layer-opacity, ${DesignToken.state.focusStateLayerOpacity})`,
      ),
      containerElevation: unsafeCSS(
        `var(--m3e-filled-card-focus-container-elevation, ${DesignToken.elevation.level0})`,
      ),
    },
    pressed: {
      textColor: unsafeCSS(`var(--m3e-filled-card-pressed-text-color, ${DesignToken.color.onSurface})`),
      stateLayerColor: unsafeCSS(`var(--m3e-filled-card-pressed-state-layer-color, ${DesignToken.color.onSurface})`),
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-filled-card-pressed-state-layer-opacity, ${DesignToken.state.pressedStateLayerOpacity})`,
      ),
      containerElevation: unsafeCSS(
        `var(--m3e-filled-card-pressed-container-elevation, ${DesignToken.elevation.level0})`,
      ),
    },
  },
  elevated: {
    textColor: unsafeCSS(`var(--m3e-elevated-card-text-color, ${DesignToken.color.onSurface})`),
    containerColor: unsafeCSS(`var(--m3e-elevated-card-container-color, ${DesignToken.color.surfaceContainerLow})`),
    containerElevation: unsafeCSS(`var(--m3e-elevated-card-container-elevation, ${DesignToken.elevation.level1})`),
    disabled: {
      textColor: unsafeCSS(`var(--m3e-elevated-card-disabled-text-color, ${DesignToken.color.onSurface})`),
      textOpacity: unsafeCSS(`var(--m3e-elevated-card-disabled-text-opacity, 38%)`),
      imageOpacity: unsafeCSS(`var(--m3e-elevated-card-disabled-image-opacity, 38%)`),
      containerColor: unsafeCSS(`var(--m3e-elevated-card-disabled-container-color, ${DesignToken.color.surface})`),
      containerElevation: unsafeCSS(
        `var(--m3e-elevated-card-disabled-container-elevation, ${DesignToken.elevation.level1})`,
      ),
      containerElevationColor: unsafeCSS(
        `var(--m3e-elevated-card-disabled-container-elevation-color, ${DesignToken.color.onSurface})`,
      ),
      containerElevationOpacity: unsafeCSS(`var(--m3e-elevated-card-disabled-container-elevation-opacity, 38%)`),
      containerOpacity: unsafeCSS(`var(--m3e-elevated-card-disabled-container-opacity, 38%)`),
    },
    hover: {
      textColor: unsafeCSS(`var(--m3e-elevated-card-hover-text-color, ${DesignToken.color.onSurface})`),
      stateLayerColor: unsafeCSS(`var(--m3e-elevated-card-hover-state-layer-color, ${DesignToken.color.onSurface})`),
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-elevated-card-hover-state-layer-opacity, ${DesignToken.state.hoverStateLayerOpacity})`,
      ),
      containerElevation: unsafeCSS(
        `var(--m3e-elevated-card-hover-container-elevation, ${DesignToken.elevation.level2})`,
      ),
    },
    focus: {
      textColor: unsafeCSS(`var(--m3e-elevated-card-focus-text-color, ${DesignToken.color.onSurface})`),
      stateLayerColor: unsafeCSS(`var(--m3e-elevated-card-focus-state-layer-color, ${DesignToken.color.onSurface})`),
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-elevated-card-focus-state-layer-opacity, ${DesignToken.state.focusStateLayerOpacity})`,
      ),
      containerElevation: unsafeCSS(
        `var(--m3e-elevated-card-focus-container-elevation, ${DesignToken.elevation.level1})`,
      ),
    },
    pressed: {
      textColor: unsafeCSS(`var(--m3e-elevated-card-pressed-text-color, ${DesignToken.color.onSurface})`),
      stateLayerColor: unsafeCSS(`var(--m3e-elevated-card-pressed-state-layer-color, ${DesignToken.color.onSurface})`),
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-elevated-card-pressed-state-layer-opacity, ${DesignToken.state.pressedStateLayerOpacity})`,
      ),
      containerElevation: unsafeCSS(
        `var(--m3e-elevated-card-pressed-container-elevation, ${DesignToken.elevation.level1})`,
      ),
    },
  },
  outlined: {
    textColor: unsafeCSS(`var(--m3e-outlined-card-text-color, ${DesignToken.color.onSurface})`),
    containerElevation: unsafeCSS(`var(--m3e-outlined-card-container-elevation, ${DesignToken.elevation.level0})`),
    outlineColor: unsafeCSS(`var(--m3e-outlined-card-outline-color, ${DesignToken.color.outlineVariant})`),
    outlineThickness: unsafeCSS("var(--m3e-outlined-card-outline-thickness, 1px)"),
    disabled: {
      textColor: unsafeCSS(`var(--m3e-outlined-card-disabled-text-color, ${DesignToken.color.onSurface})`),
      textOpacity: unsafeCSS(`var(--m3e-outlined-card-disabled-text-opacity, 38%)`),
      imageOpacity: unsafeCSS(`var(--m3e-outlined-card-disabled-image-opacity, 38%)`),
      containerElevation: unsafeCSS(
        `var(--m3e-outlined-card-disabled-container-elevation, ${DesignToken.elevation.level0})`,
      ),
      containerElevationColor: unsafeCSS(
        `var(--m3e-outlined-card-disabled-container-elevation-color, ${DesignToken.color.onSurface})`,
      ),
      containerElevationOpacity: unsafeCSS(`var(--m3e-outlined-card-disabled-container-elevation-opacity, 38%)`),
      outlineColor: unsafeCSS(`var(--m3e-outlined-card-disabled-outline-color, ${DesignToken.color.outline})`),
      outlineOpacity: unsafeCSS(`var(--m3e-outlined-card-disabled-outline-opacity, 12%)`),
    },
    hover: {
      textColor: unsafeCSS(`var(--m3e-outlined-card-hover-text-color, ${DesignToken.color.onSurface})`),
      stateLayerColor: unsafeCSS(`var(--m3e-outlined-card-hover-state-layer-color, ${DesignToken.color.onSurface})`),
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-outlined-card-hover-state-layer-opacity, ${DesignToken.state.hoverStateLayerOpacity})`,
      ),
      containerElevation: unsafeCSS(
        `var(--m3e-outlined-card-hover-container-elevation, ${DesignToken.elevation.level1})`,
      ),
      outlineColor: unsafeCSS(`var(--m3e-outlined-card-hover-outline-color, ${DesignToken.color.outlineVariant})`),
    },
    focus: {
      textColor: unsafeCSS(`var(--m3e-outlined-card-focus-text-color, ${DesignToken.color.onSurface})`),
      stateLayerColor: unsafeCSS(`var(--m3e-outlined-card-focus-state-layer-color, ${DesignToken.color.onSurface})`),
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-outlined-card-focus-state-layer-opacity, ${DesignToken.state.focusStateLayerOpacity})`,
      ),
      containerElevation: unsafeCSS(
        `var(--m3e-outlined-card-focus-container-elevation, ${DesignToken.elevation.level0})`,
      ),
      outlineColor: unsafeCSS(`var(--m3e-outlined-card-focus-outline-color, ${DesignToken.color.onSurface})`),
    },
    pressed: {
      textColor: unsafeCSS(`var(--m3e-outlined-card-pressed-text-color, ${DesignToken.color.onSurface})`),
      stateLayerColor: unsafeCSS(`var(--m3e-outlined-card-pressed-state-layer-color, ${DesignToken.color.onSurface})`),
      stateLayerOpacity: unsafeCSS(
        `var(--m3e-outlined-card-pressed-state-layer-opacity, ${DesignToken.state.pressedStateLayerOpacity})`,
      ),
      containerElevation: unsafeCSS(
        `var(--m3e-outlined-card-pressed-container-elevation, ${DesignToken.elevation.level0})`,
      ),
      outlineColor: unsafeCSS(`var(--m3e-outlined-card-pressed-outline-color, ${DesignToken.color.outlineVariant})`),
    },
  },
} as const;
