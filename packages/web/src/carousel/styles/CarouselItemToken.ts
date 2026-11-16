import { unsafeCSS } from "lit";

import { DesignToken } from "@m3e/web/core";

const outlineColor = unsafeCSS(`var(--m3e-carousel-item-outline-color, ${DesignToken.color.outline})`);
const pressedStateLayerColor = unsafeCSS(
  `var(--m3e-carousel-item-pressed-state-layer-color, ${DesignToken.color.onSurface})`,
);
const pressedStateLayerOpacity = unsafeCSS(
  `var(--m3e-carousel-item-pressed-state-layer-opacity, ${DesignToken.state.pressedStateLayerOpacity})`,
);

/**
 * Component design tokens shared by carousel items and their primary actions.
 * @internal
 */
export const CarouselItemToken = {
  shape: unsafeCSS(`var(--m3e-carousel-item-shape, ${DesignToken.shape.corner.extraLarge})`),
  shapePressedMorph: unsafeCSS(`var(--m3e-carousel-item-shape-pressed-morph, ${DesignToken.shape.corner.large})`),
  shapeMotion: DesignToken.motion.spring.fastEffects,
  outlineWidth: unsafeCSS("var(--m3e-carousel-item-outline-width, 1px)"),
  outlineColor,

  textColor: unsafeCSS("var(--m3e-carousel-item-text-color, #fff)"),
  scrimColor: unsafeCSS(`var(--m3e-carousel-item-scrim-color, ${DesignToken.color.scrim})`),
  scrimOpacity: unsafeCSS("var(--m3e-carousel-item-scrim-opacity, 0)"),

  title: {
    textColor: unsafeCSS("var(--m3e-carousel-item-title-text-color, inherit)"),
    fontSize: unsafeCSS(
      `var(--m3e-carousel-item-title-font-size, ${DesignToken.typescale.standard.title.large.fontSize})`,
    ),
    fontWeight: DesignToken.typescale.standard.title.large.fontWeight,
    lineHeight: DesignToken.typescale.standard.title.large.lineHeight,
    tracking: DesignToken.typescale.standard.title.large.tracking,
  },

  subtitle: {
    textColor: unsafeCSS("var(--m3e-carousel-item-subtitle-text-color, inherit)"),
    fontSize: unsafeCSS(
      `var(--m3e-carousel-item-subtitle-font-size, ${DesignToken.typescale.standard.body.medium.fontSize})`,
    ),
    fontWeight: DesignToken.typescale.standard.body.medium.fontWeight,
    lineHeight: DesignToken.typescale.standard.body.medium.lineHeight,
    tracking: DesignToken.typescale.standard.body.medium.tracking,
  },

  hover: {
    elevation: unsafeCSS(`var(--m3e-carousel-item-hover-elevation, ${DesignToken.elevation.level1})`),
    outlineColor: unsafeCSS(`var(--m3e-carousel-item-hover-outline-color, ${outlineColor})`),
    stateLayerColor: unsafeCSS(`var(--m3e-carousel-item-hover-state-layer-color, ${DesignToken.color.onSurface})`),
    stateLayerOpacity: unsafeCSS(
      `var(--m3e-carousel-item-hover-state-layer-opacity, ${DesignToken.state.hoverStateLayerOpacity})`,
    ),
  },

  focus: {
    outlineColor: unsafeCSS(`var(--m3e-carousel-item-focus-outline-color, ${DesignToken.color.onSurface})`),
    stateLayerColor: unsafeCSS(`var(--m3e-carousel-item-focus-state-layer-color, ${DesignToken.color.onSurface})`),
    stateLayerOpacity: unsafeCSS(
      `var(--m3e-carousel-item-focus-state-layer-opacity, ${DesignToken.state.focusStateLayerOpacity})`,
    ),
  },

  pressed: {
    outlineColor: unsafeCSS(`var(--m3e-carousel-item-pressed-outline-color, ${outlineColor})`),
    stateLayerColor: pressedStateLayerColor,
    stateLayerOpacity: pressedStateLayerOpacity,
  },

  disabled: {
    outlineColor: unsafeCSS(`var(--m3e-carousel-item-disabled-outline-color, ${outlineColor})`),
    outlineOpacity: unsafeCSS("var(--m3e-carousel-item-disabled-outline-opacity, 12%)"),
  },

  ripple: {
    color: unsafeCSS(`var(--m3e-carousel-item-ripple-color, ${pressedStateLayerColor})`),
    opacity: unsafeCSS(`var(--m3e-carousel-item-ripple-opacity, ${pressedStateLayerOpacity})`),
  },
};
