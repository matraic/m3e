import { CSSResult, unsafeCSS } from "lit";

import { DesignToken } from "@m3e/web/core";

import { IconButtonSize } from "../IconButtonSize";

/** @private */
type _IconButtonSizeToken = {
  containerHeight: CSSResult;
  outlineThickness: CSSResult;
  iconSize: CSSResult;
  shapeRound: CSSResult;
  shapeSquare: CSSResult;
  selectedShapeRound: CSSResult;
  selectedShapeSquare: CSSResult;
  shapePressedMorph: CSSResult;
  narrowLeadingSpace: CSSResult;
  narrowTrailingSpace: CSSResult;
  defaultLeadingSpace: CSSResult;
  defaultTrailingSpace: CSSResult;
  wideLeadingSpace: CSSResult;
  wideTrailingSpace: CSSResult;
};

/**
 * Component design tokens that control the `M3eIconButtonElement` for all size variants.
 * @internal
 */
export const IconButtonSizeToken: Record<IconButtonSize, _IconButtonSizeToken> = {
  /** Design tokens that control the `extra-small` `size` variant. */
  "extra-small": {
    containerHeight: unsafeCSS(
      `calc(var(--m3e-icon-button-extra-small-container-height, var(--m3e-icon-button-container-height, 2rem)) + ${DesignToken.density.calc(-3)})`,
    ),
    outlineThickness: unsafeCSS(
      "var(--m3e-icon-button-extra-small-outline-thickness, var(--m3e-icon-button-outline-thickness, 1px))",
    ),
    iconSize: unsafeCSS(`var(--m3e-icon-button-extra-small-icon-size, var(--m3e-icon-button-icon-size, 1.25rem))`),
    shapeRound: unsafeCSS(
      `var(--m3e-icon-button-extra-small-shape-round, var(--m3e-icon-button-shape-round, ${DesignToken.shape.corner.full}))`,
    ),
    shapeSquare: unsafeCSS(
      `var(--m3e-icon-button-extra-small-shape-square, var(--m3e-icon-button-shape-square, ${DesignToken.shape.corner.medium}))`,
    ),
    selectedShapeRound: unsafeCSS(
      `var(--m3e-icon-button-extra-small-selected-shape-round, var(--m3e-icon-button-selected-shape-round, ${DesignToken.shape.corner.medium}))`,
    ),
    selectedShapeSquare: unsafeCSS(
      `var(--m3e-icon-button-extra-small-selected-shape-square, var(--m3e-icon-button-selected-shape-square, ${DesignToken.shape.corner.full}))`,
    ),
    shapePressedMorph: unsafeCSS(
      `var(--m3e-icon-button-extra-small-shape-pressed-morph, var(--m3e-icon-button-shape-pressed-morph, ${DesignToken.shape.corner.small}))`,
    ),
    narrowLeadingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-extra-small-narrow-leading-space, var(--m3e-icon-button-narrow-leading-space, ${DesignToken.measurement.space50})) + ${DesignToken.density.calcHalf(-3)})`,
    ),
    narrowTrailingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-extra-small-narrow-trailing-space, var(--m3e-icon-button-narrow-trailing-space, ${DesignToken.measurement.space50})) + ${DesignToken.density.calcHalf(-3)})`,
    ),
    defaultLeadingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-extra-small-default-leading-space, var(--m3e-icon-button-default-leading-space, ${DesignToken.measurement.space75})) + ${DesignToken.density.calcHalf(-3)})`,
    ),
    defaultTrailingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-extra-small-default-trailing-space, var(--m3e-icon-button-default-trailing-space, ${DesignToken.measurement.space75})) + ${DesignToken.density.calcHalf(-3)})`,
    ),
    wideLeadingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-extra-small-wide-leading-space, var(--m3e-icon-button-wide-leading-space, ${DesignToken.measurement.space125})) + ${DesignToken.density.calcHalf(-3)})`,
    ),
    wideTrailingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-extra-small-wide-trailing-space, var(--m3e-icon-button-wide-trailing-space, ${DesignToken.measurement.space125})) + ${DesignToken.density.calcHalf(-3)})`,
    ),
  },

  /** Design tokens that control the `small` `size` variant. */
  small: {
    containerHeight: unsafeCSS(
      `calc(var(--m3e-icon-button-small-container-height, var(--m3e-icon-button-container-height, 2.5rem)) + ${DesignToken.density.calc(-3)})`,
    ),
    outlineThickness: unsafeCSS(
      "var(--m3e-icon-button-small-outline-thickness, var(--m3e-icon-button-outline-thickness, 1px))",
    ),
    iconSize: unsafeCSS(`var(--m3e-icon-button-small-icon-size, var(--m3e-icon-button-icon-size, 1.5rem))`),
    shapeRound: unsafeCSS(
      `var(--m3e-icon-button-small-shape-round, var(--m3e-icon-button-shape-round, ${DesignToken.shape.corner.full}))`,
    ),
    shapeSquare: unsafeCSS(
      `var(--m3e-icon-button-small-shape-square, var(--m3e-icon-button-shape-square, ${DesignToken.shape.corner.medium}))`,
    ),
    selectedShapeRound: unsafeCSS(
      `var(--m3e-icon-button-small-selected-shape-round, var(--m3e-icon-button-selected-shape-round, ${DesignToken.shape.corner.medium}))`,
    ),
    selectedShapeSquare: unsafeCSS(
      `var(--m3e-icon-button-small-selected-shape-square, var(--m3e-icon-button-selected-shape-square, ${DesignToken.shape.corner.full}))`,
    ),
    shapePressedMorph: unsafeCSS(
      `var(--m3e-icon-button-small-shape-pressed-morph, var(--m3e-icon-button-shape-pressed-morph, ${DesignToken.shape.corner.small}))`,
    ),
    narrowLeadingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-small-narrow-leading-space, var(--m3e-icon-button-narrow-leading-space, ${DesignToken.measurement.space50})) + ${DesignToken.density.calcHalf(-3)})`,
    ),
    narrowTrailingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-small-narrow-trailing-space, var(--m3e-icon-button-narrow-trailing-space, ${DesignToken.measurement.space50})) + ${DesignToken.density.calcHalf(-3)})`,
    ),
    defaultLeadingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-small-default-leading-space, var(--m3e-icon-button-default-leading-space, ${DesignToken.measurement.space100})) + ${DesignToken.density.calcHalf(-3)})`,
    ),
    defaultTrailingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-small-default-trailing-space, var(--m3e-icon-button-default-trailing-space, ${DesignToken.measurement.space100})) + ${DesignToken.density.calcHalf(-3)})`,
    ),
    wideLeadingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-small-wide-leading-space, var(--m3e-icon-button-wide-leading-space, ${DesignToken.measurement.space175})) + ${DesignToken.density.calcHalf(-3)})`,
    ),
    wideTrailingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-small-wide-trailing-space, var(--m3e-icon-button-wide-trailing-space, ${DesignToken.measurement.space175})) + ${DesignToken.density.calcHalf(-3)})`,
    ),
  },

  /** Design tokens that control the `medium` `size` variant. */
  medium: {
    containerHeight: unsafeCSS(
      `calc(var(--m3e-icon-button-medium-container-height, var(--m3e-icon-button-container-height, 3.5rem)) + ${DesignToken.density.calc(-3)})`,
    ),
    outlineThickness: unsafeCSS(
      "var(--m3e-icon-button-medium-outline-thickness, var(--m3e-icon-button-outline-thickness, 1px))",
    ),
    iconSize: unsafeCSS(`var(--m3e-icon-button-medium-icon-size, var(--m3e-icon-button-icon-size, 1.5rem))`),
    shapeRound: unsafeCSS(
      `var(--m3e-icon-button-medium-shape-round, var(--m3e-icon-button-shape-round, ${DesignToken.shape.corner.full}))`,
    ),
    shapeSquare: unsafeCSS(
      `var(--m3e-icon-button-medium-shape-square, var(--m3e-icon-button-shape-square, ${DesignToken.shape.corner.large}))`,
    ),
    selectedShapeRound: unsafeCSS(
      `var(--m3e-icon-button-medium-selected-shape-round, var(--m3e-icon-button-selected-shape-round, ${DesignToken.shape.corner.large}))`,
    ),
    selectedShapeSquare: unsafeCSS(
      `var(--m3e-icon-button-medium-selected-shape-square, var(--m3e-icon-button-selected-shape-square, ${DesignToken.shape.corner.full}))`,
    ),
    shapePressedMorph: unsafeCSS(
      `var(--m3e-icon-button-medium-shape-pressed-morph, var(--m3e-icon-button-shape-pressed-morph, ${DesignToken.shape.corner.medium}))`,
    ),
    narrowLeadingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-medium-narrow-leading-space, var(--m3e-icon-button-narrow-leading-space, ${DesignToken.measurement.space150})) + ${DesignToken.density.calcHalf(-3)})`,
    ),
    narrowTrailingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-medium-narrow-trailing-space, var(--m3e-icon-button-narrow-trailing-space, ${DesignToken.measurement.space150})) + ${DesignToken.density.calcHalf(-3)})`,
    ),
    defaultLeadingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-medium-default-leading-space, var(--m3e-icon-button-default-leading-space, ${DesignToken.measurement.space200})) + ${DesignToken.density.calcHalf(-3)})`,
    ),
    defaultTrailingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-medium-default-trailing-space, var(--m3e-icon-button-default-trailing-space, ${DesignToken.measurement.space200})) + ${DesignToken.density.calcHalf(-3)})`,
    ),
    wideLeadingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-medium-wide-leading-space, var(--m3e-icon-button-wide-leading-space, ${DesignToken.measurement.space300})) + ${DesignToken.density.calcHalf(-3)})`,
    ),
    wideTrailingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-medium-wide-trailing-space, var(--m3e-icon-button-wide-trailing-space, ${DesignToken.measurement.space300})) + ${DesignToken.density.calcHalf(-3)})`,
    ),
  },

  /** Design tokens that control the `large` `size` variant. */
  large: {
    containerHeight: unsafeCSS(
      `calc(var(--m3e-icon-button-large-container-height, var(--m3e-icon-button-container-height, 6rem)) + ${DesignToken.density.calc(-3)})`,
    ),
    outlineThickness: unsafeCSS(
      "var(--m3e-icon-button-large-outline-thickness, var(--m3e-icon-button-outline-thickness, 2px))",
    ),
    iconSize: unsafeCSS(`var(--m3e-icon-button-large-icon-size, var(--m3e-icon-button-icon-size, 2rem))`),
    shapeRound: unsafeCSS(
      `var(--m3e-icon-button-large-shape-round, var(--m3e-icon-button-shape-round, ${DesignToken.shape.corner.full}))`,
    ),
    shapeSquare: unsafeCSS(
      `var(--m3e-icon-button-large-shape-square, var(--m3e-icon-button-shape-square, ${DesignToken.shape.corner.extraLarge}))`,
    ),
    selectedShapeRound: unsafeCSS(
      `var(--m3e-icon-button-large-selected-shape-round, var(--m3e-icon-button-selected-shape-round, ${DesignToken.shape.corner.extraLarge}))`,
    ),
    selectedShapeSquare: unsafeCSS(
      `var(--m3e-icon-button-large-selected-shape-square, var(--m3e-icon-button-selected-shape-square, ${DesignToken.shape.corner.full}))`,
    ),
    shapePressedMorph: unsafeCSS(
      `var(--m3e-icon-button-large-shape-pressed-morph, var(--m3e-icon-button-shape-pressed-morph, ${DesignToken.shape.corner.large}))`,
    ),
    narrowLeadingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-large-narrow-leading-space, var(--m3e-icon-button-narrow-leading-space, ${DesignToken.measurement.space200})) + ${DesignToken.density.calcHalf(-3)})`,
    ),
    narrowTrailingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-large-narrow-trailing-space, var(--m3e-icon-button-narrow-trailing-space, ${DesignToken.measurement.space200})) + ${DesignToken.density.calcHalf(-3)})`,
    ),
    defaultLeadingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-large-default-leading-space, var(--m3e-icon-button-default-leading-space, ${DesignToken.measurement.space400})) + ${DesignToken.density.calcHalf(-3)})`,
    ),
    defaultTrailingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-large-default-trailing-space, var(--m3e-icon-button-default-trailing-space, ${DesignToken.measurement.space400})) + ${DesignToken.density.calcHalf(-3)})`,
    ),
    wideLeadingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-large-wide-leading-space, var(--m3e-icon-button-wide-leading-space, ${DesignToken.measurement.space600})) + ${DesignToken.density.calcHalf(-3)})`,
    ),
    wideTrailingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-large-wide-trailing-space, var(--m3e-icon-button-wide-trailing-space, ${DesignToken.measurement.space600})) + ${DesignToken.density.calcHalf(-3)})`,
    ),
  },

  /** Design tokens that control the `extra-large` `size` variant. */
  "extra-large": {
    containerHeight: unsafeCSS(
      `calc(var(--m3e-icon-button-extra-large-container-height, var(--m3e-icon-button-container-height, 8.5rem)) + ${DesignToken.density.calc(-3)})`,
    ),
    outlineThickness: unsafeCSS(
      "var(--m3e-icon-button-extra-large-outline-thickness, var(--m3e-icon-button-outline-thickness, 3px))",
    ),
    iconSize: unsafeCSS(`var(--m3e-icon-button-extra-large-icon-size, var(--m3e-icon-button-icon-size, 2.5rem))`),
    shapeRound: unsafeCSS(
      `var(--m3e-icon-button-extra-large-shape-round, var(--m3e-icon-button-shape-round, ${DesignToken.shape.corner.full}))`,
    ),
    shapeSquare: unsafeCSS(
      `var(--m3e-icon-button-extra-large-shape-square, var(--m3e-icon-button-shape-square, ${DesignToken.shape.corner.extraLarge}))`,
    ),
    selectedShapeRound: unsafeCSS(
      `var(--m3e-icon-button-extra-large-selected-shape-round, var(--m3e-icon-button-selected-shape-round, ${DesignToken.shape.corner.extraLarge}))`,
    ),
    selectedShapeSquare: unsafeCSS(
      `var(--m3e-icon-button-extra-large-selected-shape-square, var(--m3e-icon-button-selected-shape-square, ${DesignToken.shape.corner.full}))`,
    ),
    shapePressedMorph: unsafeCSS(
      `var(--m3e-icon-button-extra-large-shape-pressed-morph, var(--m3e-icon-button-shape-pressed-morph, ${DesignToken.shape.corner.large}))`,
    ),
    narrowLeadingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-extra-large-narrow-leading-space, var(--m3e-icon-button-narrow-leading-space, ${DesignToken.measurement.space400})) + ${DesignToken.density.calcHalf(-3)})`,
    ),
    narrowTrailingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-extra-large-narrow-trailing-space, var(--m3e-icon-button-narrow-trailing-space, ${DesignToken.measurement.space400})) + ${DesignToken.density.calcHalf(-3)})`,
    ),
    defaultLeadingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-extra-large-default-leading-space, var(--m3e-icon-button-default-leading-space, ${DesignToken.measurement.space600})) + ${DesignToken.density.calcHalf(-3)})`,
    ),
    defaultTrailingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-extra-large-default-trailing-space, var(--m3e-icon-button-default-trailing-space, ${DesignToken.measurement.space600})) + ${DesignToken.density.calcHalf(-3)})`,
    ),
    wideLeadingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-extra-large-wide-leading-space, var(--m3e-icon-button-wide-leading-space, ${DesignToken.measurement.space900})) + ${DesignToken.density.calcHalf(-3)})`,
    ),
    wideTrailingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-extra-large-wide-trailing-space, var(--m3e-icon-button-wide-trailing-space, ${DesignToken.measurement.space900})) + ${DesignToken.density.calcHalf(-3)})`,
    ),
  },
} as const;
