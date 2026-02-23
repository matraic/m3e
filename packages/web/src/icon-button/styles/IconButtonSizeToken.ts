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
      `calc(var(--m3e-icon-button-extra-small-container-height, 2rem) + ${DesignToken.density.calc(0)})`,
    ),
    outlineThickness: unsafeCSS("var(--m3e-icon-button-extra-small-outline-thickness, 1px)"),
    iconSize: unsafeCSS(`calc(var(--m3e-icon-button-extra-small-icon-size, 1.25rem) + ${DesignToken.density.calc(0)})`),
    shapeRound: unsafeCSS(`var(--m3e-icon-button-extra-small-shape-round, ${DesignToken.shape.corner.full})`),
    shapeSquare: unsafeCSS(`var(--m3e-icon-button-extra-small-shape-square, ${DesignToken.shape.corner.medium})`),
    selectedShapeRound: unsafeCSS(
      `var(--m3e-icon-button-extra-small-selected-shape-round, ${DesignToken.shape.corner.medium})`,
    ),
    selectedShapeSquare: unsafeCSS(
      `var(--m3e-icon-button-extra-small-selected-shape-square, ${DesignToken.shape.corner.full})`,
    ),
    shapePressedMorph: unsafeCSS(
      `var(--m3e-icon-button-extra-small-shape-pressed-morph, ${DesignToken.shape.corner.small})`,
    ),
    narrowLeadingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-extra-small-narrow-leading-space, 0.25rem) + ${DesignToken.density.calc(0)})`,
    ),
    narrowTrailingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-extra-small-narrow-trailing-space, 0.25rem) + ${DesignToken.density.calc(0)})`,
    ),
    defaultLeadingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-extra-small-default-leading-space, 0.375rem) + ${DesignToken.density.calc(0)})`,
    ),
    defaultTrailingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-extra-small-default-trailing-space, 0.375rem) + ${DesignToken.density.calc(0)})`,
    ),
    wideLeadingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-extra-small-wide-leading-space, 0.625rem) + ${DesignToken.density.calc(0)})`,
    ),
    wideTrailingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-extra-small-wide-trailing-space, 0.625rem) + ${DesignToken.density.calc(0)})`,
    ),
  },

  /** Design tokens that control the `small` `size` variant. */
  small: {
    containerHeight: unsafeCSS(
      `calc(var(--m3e-icon-button-small-container-height, 2.5rem) + ${DesignToken.density.calc(-1)})`,
    ),
    outlineThickness: unsafeCSS("var(--m3e-icon-button-small-outline-thickness, 1px)"),
    iconSize: unsafeCSS(`calc(var(--m3e-icon-button-small-icon-size, 1.5rem) + ${DesignToken.density.calc(-1)})`),
    shapeRound: unsafeCSS(`var(--m3e-icon-button-small-shape-round, ${DesignToken.shape.corner.full})`),
    shapeSquare: unsafeCSS(`var(--m3e-icon-button-small-shape-square, ${DesignToken.shape.corner.medium})`),
    selectedShapeRound: unsafeCSS(
      `var(--m3e-icon-button-small-selected-shape-round, ${DesignToken.shape.corner.medium})`,
    ),
    selectedShapeSquare: unsafeCSS(
      `var(--m3e-icon-button-small-selected-shape-square, ${DesignToken.shape.corner.full})`,
    ),
    shapePressedMorph: unsafeCSS(`var(--m3e-icon-button-small-shape-pressed-morph, ${DesignToken.shape.corner.small})`),
    narrowLeadingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-small-narrow-leading-space, 0.25rem) + ${DesignToken.density.calc(-1)})`,
    ),
    narrowTrailingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-small-narrow-trailing-space, 0.25rem) + ${DesignToken.density.calc(-1)})`,
    ),
    defaultLeadingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-small-default-leading-space, 0.5rem) + ${DesignToken.density.calc(-1)})`,
    ),
    defaultTrailingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-small-default-trailing-space, 0.5rem) + ${DesignToken.density.calc(-1)})`,
    ),
    wideLeadingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-small-wide-leading-space, 0.875rem) + ${DesignToken.density.calc(-1)})`,
    ),
    wideTrailingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-small-wide-trailing-space, 0.875rem) + ${DesignToken.density.calc(-1)})`,
    ),
  },

  /** Design tokens that control the `medium` `size` variant. */
  medium: {
    containerHeight: unsafeCSS(
      `calc(var(--m3e-icon-button-medium-container-height, 3.5rem) + ${DesignToken.density.calc(-2)})`,
    ),
    outlineThickness: unsafeCSS("var(--m3e-icon-button-medium-outline-thickness, 1px)"),
    iconSize: unsafeCSS(`calc(var(--m3e-icon-button-medium-icon-size, 1.5rem) + ${DesignToken.density.calc(-2)})`),
    shapeRound: unsafeCSS(`var(--m3e-icon-button-medium-shape-round, ${DesignToken.shape.corner.full})`),
    shapeSquare: unsafeCSS(`var(--m3e-icon-button-medium-shape-square, ${DesignToken.shape.corner.large})`),
    selectedShapeRound: unsafeCSS(
      `var(--m3e-icon-button-medium-selected-shape-round, ${DesignToken.shape.corner.large})`,
    ),
    selectedShapeSquare: unsafeCSS(
      `var(--m3e-icon-button-medium-selected-shape-square, ${DesignToken.shape.corner.full})`,
    ),
    shapePressedMorph: unsafeCSS(
      `var(--m3e-icon-button-medium-shape-pressed-morph, ${DesignToken.shape.corner.medium})`,
    ),
    narrowLeadingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-medium-narrow-leading-space, 0.75rem) + ${DesignToken.density.calc(-2)})`,
    ),
    narrowTrailingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-medium-narrow-trailing-space, 0.75rem) + ${DesignToken.density.calc(-2)})`,
    ),
    defaultLeadingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-medium-default-leading-space, 1rem) + ${DesignToken.density.calc(-2)})`,
    ),
    defaultTrailingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-medium-default-trailing-space, 1rem) + ${DesignToken.density.calc(-2)})`,
    ),
    wideLeadingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-medium-wide-leading-space, 1.5rem) + ${DesignToken.density.calc(-2)})`,
    ),
    wideTrailingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-medium-wide-trailing-space, 1.5rem) + ${DesignToken.density.calc(-2)})`,
    ),
  },

  /** Design tokens that control the `large` `size` variant. */
  large: {
    containerHeight: unsafeCSS(
      `calc(var(--m3e-icon-button-large-container-height, 6rem) + ${DesignToken.density.calc(-3)})`,
    ),
    outlineThickness: unsafeCSS("var(--m3e-icon-button-large-outline-thickness, 0.125rem)"),
    iconSize: unsafeCSS(`calc(var(--m3e-icon-button-large-icon-size, 2rem) + ${DesignToken.density.calc(-3)})`),
    shapeRound: unsafeCSS(`var(--m3e-icon-button-large-shape-round, ${DesignToken.shape.corner.full})`),
    shapeSquare: unsafeCSS(`var(--m3e-icon-button-large-shape-square, ${DesignToken.shape.corner.extraLarge})`),
    selectedShapeRound: unsafeCSS(
      `var(--m3e-icon-button-large-selected-shape-round, ${DesignToken.shape.corner.extraLarge})`,
    ),
    selectedShapeSquare: unsafeCSS(
      `var(--m3e-icon-button-large-selected-shape-square, ${DesignToken.shape.corner.full})`,
    ),
    shapePressedMorph: unsafeCSS(`var(--m3e-icon-button-large-shape-pressed-morph, ${DesignToken.shape.corner.large})`),
    narrowLeadingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-large-narrow-leading-space, 1rem) + ${DesignToken.density.calc(-3)})`,
    ),
    narrowTrailingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-large-narrow-trailing-space, 1rem) + ${DesignToken.density.calc(-3)})`,
    ),
    defaultLeadingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-large-default-leading-space, 2rem) + ${DesignToken.density.calc(-3)})`,
    ),
    defaultTrailingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-large-default-trailing-space, 2rem) + ${DesignToken.density.calc(-3)})`,
    ),
    wideLeadingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-large-wide-leading-space, 3rem) + ${DesignToken.density.calc(-3)})`,
    ),
    wideTrailingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-large-wide-trailing-space, 3rem) + ${DesignToken.density.calc(-3)})`,
    ),
  },

  /** Design tokens that control the `extra-large` `size` variant. */
  "extra-large": {
    containerHeight: unsafeCSS(
      `calc(var(--m3e-icon-button-extra-large-container-height, 8.5rem) + ${DesignToken.density.calc(-3)})`,
    ),
    outlineThickness: unsafeCSS("var(--m3e-icon-button-extra-large-outline-thickness, 0.1875rem)"),
    iconSize: unsafeCSS(`calc(var(--m3e-icon-button-extra-large-icon-size, 2.5rem) + ${DesignToken.density.calc(-3)})`),
    shapeRound: unsafeCSS(`var(--m3e-icon-button-extra-large-shape-round, ${DesignToken.shape.corner.full})`),
    shapeSquare: unsafeCSS(`var(--m3e-icon-button-extra-large-shape-square, ${DesignToken.shape.corner.extraLarge})`),
    selectedShapeRound: unsafeCSS(
      `var(--m3e-icon-button-extra-large-selected-shape-round, ${DesignToken.shape.corner.extraLarge})`,
    ),
    selectedShapeSquare: unsafeCSS(
      `var(--m3e-icon-button-extra-large-selected-shape-square, ${DesignToken.shape.corner.full})`,
    ),
    shapePressedMorph: unsafeCSS(
      `var(--m3e-icon-button-extra-large-shape-pressed-morph, ${DesignToken.shape.corner.large})`,
    ),
    narrowLeadingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-extra-large-narrow-leading-space, 2rem) + ${DesignToken.density.calc(-3)})`,
    ),
    narrowTrailingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-extra-large-narrow-trailing-space, 2rem) + ${DesignToken.density.calc(-3)})`,
    ),
    defaultLeadingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-extra-large-default-leading-space, 3rem) + ${DesignToken.density.calc(-3)})`,
    ),
    defaultTrailingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-extra-large-default-trailing-space, 3rem) + ${DesignToken.density.calc(-3)})`,
    ),
    wideLeadingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-extra-large-wide-leading-space, 4.5rem) + ${DesignToken.density.calc(-3)})`,
    ),
    wideTrailingSpace: unsafeCSS(
      `calc(var(--m3e-icon-button-extra-large-wide-trailing-space, 4.5rem) + ${DesignToken.density.calc(-3)})`,
    ),
  },
} as const;
