import { CSSResult, unsafeCSS } from "lit";

import { DesignToken } from "@m3e/core";

import { ButtonSize } from "../ButtonSize";

/** @private */
type _ButtonSizeToken = {
  containerHeight: CSSResult;
  outlineThickness: CSSResult;
  labelTextFontSize: CSSResult;
  labelTextFontWeight: CSSResult;
  labelTextLineHeight: CSSResult;
  labelTextTracking: CSSResult;
  iconSize: CSSResult;
  shapeRound: CSSResult;
  shapeSquare: CSSResult;
  selectedShapeRound: CSSResult;
  selectedShapeSquare: CSSResult;
  shapePressedMorph: CSSResult;
  leadingSpace: CSSResult;
  trailingSpace: CSSResult;
  iconLabelSpace: CSSResult;
};

/**
 * Component design tokens that control the `M3eButtonElement` for all size variants.
 * @internal
 */
export const ButtonSizeToken: Record<ButtonSize, _ButtonSizeToken> = {
  "extra-small": {
    containerHeight: unsafeCSS(
      `calc(var(--m3e-button-extra-small-container-height, 2rem) + ${DesignToken.density.calc(0)})`
    ),
    outlineThickness: unsafeCSS("var(--m3e-button-extra-small-outline-thickness, 1px)"),
    labelTextFontSize: unsafeCSS(
      `var(--m3e-button-extra-small-label-text-font-size, ${DesignToken.typescale.standard.label.large.fontSize})`
    ),
    labelTextFontWeight: unsafeCSS(
      `var(--m3e-button-extra-small-label-text-font-weight, ${DesignToken.typescale.standard.label.large.fontWeight})`
    ),
    labelTextLineHeight: unsafeCSS(
      `var(--m3e-button-extra-small-label-text-line-height, ${DesignToken.typescale.standard.label.large.lineHeight})`
    ),
    labelTextTracking: unsafeCSS(
      `var(--m3e-button-extra-small-label-text-tracking, ${DesignToken.typescale.standard.label.large.tracking})`
    ),
    iconSize: unsafeCSS("var(--m3e-button-extra-small-icon-size, 1.25rem)"),
    shapeRound: unsafeCSS(`var(--m3e-button-extra-small-shape-round, ${DesignToken.shape.corner.full})`),
    shapeSquare: unsafeCSS(`var(--m3e-button-extra-small-shape-square, ${DesignToken.shape.corner.medium})`),
    selectedShapeRound: unsafeCSS(
      `var(--m3e-button-extra-small-selected-shape-round, ${DesignToken.shape.corner.medium})`
    ),
    selectedShapeSquare: unsafeCSS(
      `var(--m3e-button-extra-small-selected-shape-square, ${DesignToken.shape.corner.full})`
    ),
    shapePressedMorph: unsafeCSS(
      `var(--m3e-button-extra-small-shape-pressed-morph, ${DesignToken.shape.corner.small})`
    ),
    leadingSpace: unsafeCSS("var(--m3e-button-extra-small-leading-space, 0.75rem)"),
    trailingSpace: unsafeCSS("var(--m3e-button-extra-small-trailing-space, 0.75rem)"),
    iconLabelSpace: unsafeCSS("var(--m3e-button-extra-small-icon-label-space, 0.5rem)"),
  },
  small: {
    containerHeight: unsafeCSS(
      `calc(var(--m3e-button-small-container-height, 2.5rem) + ${DesignToken.density.calc(-1)})`
    ),
    outlineThickness: unsafeCSS("var(--m3e-button-small-outline-thickness, 1px)"),
    labelTextFontSize: unsafeCSS(
      `var(--m3e-button-small-label-text-font-size, ${DesignToken.typescale.standard.label.large.fontSize})`
    ),
    labelTextFontWeight: unsafeCSS(
      `var(--m3e-button-small-label-text-font-weight, ${DesignToken.typescale.standard.label.large.fontWeight})`
    ),
    labelTextLineHeight: unsafeCSS(
      `var(--m3e-button-small-label-text-line-height, ${DesignToken.typescale.standard.label.large.lineHeight})`
    ),
    labelTextTracking: unsafeCSS(
      `var(--m3e-button-small-label-text-tracking, ${DesignToken.typescale.standard.label.large.tracking})`
    ),
    iconSize: unsafeCSS("var(--m3e-button-small-icon-size, 1.25rem)"),
    shapeRound: unsafeCSS(`var(--m3e-button-small-shape-round, ${DesignToken.shape.corner.full})`),
    shapeSquare: unsafeCSS(`var(--m3e-button-small-shape-square, ${DesignToken.shape.corner.medium})`),
    selectedShapeRound: unsafeCSS(`var(--m3e-button-small-selected-shape-round, ${DesignToken.shape.corner.medium})`),
    selectedShapeSquare: unsafeCSS(`var(--m3e-button-small-selected-shape-square, ${DesignToken.shape.corner.full})`),
    shapePressedMorph: unsafeCSS(`var(--m3e-button-small-shape-pressed-morph, ${DesignToken.shape.corner.small})`),
    leadingSpace: unsafeCSS("var(--m3e-button-small-leading-space, 1rem)"),
    trailingSpace: unsafeCSS("var(--m3e-button-small-trailing-space, 1rem)"),
    iconLabelSpace: unsafeCSS("var(--m3e-button-small-icon-label-space, 0.5rem)"),
  },
  medium: {
    containerHeight: unsafeCSS(
      `calc(var(--m3e-button-medium-container-height, 3.5rem) + ${DesignToken.density.calc(-2)})`
    ),
    outlineThickness: unsafeCSS("var(--m3e-button-medium-outline-thickness, 1px)"),
    labelTextFontSize: unsafeCSS(
      `var(--m3e-button-medium-label-text-font-size, ${DesignToken.typescale.standard.body.large.fontSize})`
    ),
    labelTextFontWeight: unsafeCSS(
      `var(--m3e-button-medium-label-text-font-weight, ${DesignToken.typescale.standard.body.large.fontWeight})`
    ),
    labelTextLineHeight: unsafeCSS(
      `var(--m3e-button-medium-label-text-line-height, ${DesignToken.typescale.standard.body.large.lineHeight})`
    ),
    labelTextTracking: unsafeCSS(
      `var(--m3e-button-medium-label-text-tracking, ${DesignToken.typescale.standard.body.large.tracking})`
    ),
    iconSize: unsafeCSS("var(--m3e-button-medium-icon-size, 1.5rem)"),
    shapeRound: unsafeCSS(`var(--m3e-button-medium-shape-round, ${DesignToken.shape.corner.full})`),
    shapeSquare: unsafeCSS(`var(--m3e-button-medium-shape-square, ${DesignToken.shape.corner.large})`),
    selectedShapeRound: unsafeCSS(`var(--m3e-button-medium-selected-shape-round, ${DesignToken.shape.corner.large})`),
    selectedShapeSquare: unsafeCSS(`var(--m3e-button-medium-selected-shape-square, ${DesignToken.shape.corner.full})`),
    shapePressedMorph: unsafeCSS(`var(--m3e-button-medium-shape-pressed-morph, ${DesignToken.shape.corner.medium})`),
    leadingSpace: unsafeCSS("var(--m3e-button-medium-leading-space, 1.5rem)"),
    trailingSpace: unsafeCSS("var(--m3e-button-medium-trailing-space, 1.5rem)"),
    iconLabelSpace: unsafeCSS("var(--m3e-button-medium-icon-label-space, 0.5rem)"),
  },
  large: {
    containerHeight: unsafeCSS(
      `calc(var(--m3e-button-large-container-height, 6rem) + ${DesignToken.density.calc(-3)})`
    ),
    outlineThickness: unsafeCSS("var(--m3e-button-large-outline-thickness, 0.125rem)"),
    labelTextFontSize: unsafeCSS(
      `var(--m3e-button-large-label-text-font-size, ${DesignToken.typescale.standard.headline.small.fontSize})`
    ),
    labelTextFontWeight: unsafeCSS(
      `var(--m3e-button-large-label-text-font-weight, ${DesignToken.typescale.standard.headline.small.fontWeight})`
    ),
    labelTextLineHeight: unsafeCSS(
      `var(--m3e-button-large-label-text-line-height, ${DesignToken.typescale.standard.headline.small.lineHeight})`
    ),
    labelTextTracking: unsafeCSS(
      `var(--m3e-button-large-label-text-tracking, ${DesignToken.typescale.standard.headline.small.tracking})`
    ),
    iconSize: unsafeCSS("var(--m3e-button-large-icon-size, 2rem)"),
    shapeRound: unsafeCSS(`var(--m3e-button-large-shape-round, ${DesignToken.shape.corner.full})`),
    shapeSquare: unsafeCSS(`var(--m3e-button-large-shape-square, ${DesignToken.shape.corner.extraLarge})`),
    selectedShapeRound: unsafeCSS(
      `var(--m3e-button-large-selected-shape-round, ${DesignToken.shape.corner.extraLarge})`
    ),
    selectedShapeSquare: unsafeCSS(`var(--m3e-button-large-selected-shape-square, ${DesignToken.shape.corner.full})`),
    shapePressedMorph: unsafeCSS(`var(--m3e-button-large-shape-pressed-morph, ${DesignToken.shape.corner.large})`),
    leadingSpace: unsafeCSS("var(--m3e-button-large-leading-space, 3rem)"),
    trailingSpace: unsafeCSS("var(--m3e-button-large-trailing-space, 3rem)"),
    iconLabelSpace: unsafeCSS("var(--m3e-button-large-icon-label-space, 0.75rem)"),
  },
  "extra-large": {
    containerHeight: unsafeCSS(
      `calc(var(--m3e-button-extra-large-container-height, 8.5rem) + ${DesignToken.density.calc(-3)})`
    ),
    outlineThickness: unsafeCSS("var(--m3e-button-extra-large-outline-thickness, 0.1875rem)"),
    labelTextFontSize: unsafeCSS(
      `var(--m3e-button-extra-large-label-text-font-size, ${DesignToken.typescale.standard.headline.large.fontSize})`
    ),
    labelTextFontWeight: unsafeCSS(
      `var(--m3e-button-extra-large-label-text-font-weight, ${DesignToken.typescale.standard.headline.large.fontWeight})`
    ),
    labelTextLineHeight: unsafeCSS(
      `var(--m3e-button-extra-large-label-text-line-height, ${DesignToken.typescale.standard.headline.large.lineHeight})`
    ),
    labelTextTracking: unsafeCSS(
      `var(--m3e-button-extra-large-label-text-tracking, ${DesignToken.typescale.standard.headline.large.tracking})`
    ),
    iconSize: unsafeCSS("var(--m3e-button-extra-large-icon-size, 2.5rem)"),
    shapeRound: unsafeCSS(`var(--m3e-button-extra-large-shape-round, ${DesignToken.shape.corner.full})`),
    shapeSquare: unsafeCSS(`var(--m3e-button-extra-large-shape-square, ${DesignToken.shape.corner.extraLarge})`),
    selectedShapeRound: unsafeCSS(
      `var(--m3e-button-extra-large-selected-shape-round, ${DesignToken.shape.corner.extraLarge})`
    ),
    selectedShapeSquare: unsafeCSS(
      `var(--m3e-button-extra-large-selected-shape-square, ${DesignToken.shape.corner.full})`
    ),
    shapePressedMorph: unsafeCSS(
      `var(--m3e-button-extra-large-shape-pressed-morph, ${DesignToken.shape.corner.large})`
    ),
    leadingSpace: unsafeCSS("var(--m3e-button-extra-large-leading-space, 4rem)"),
    trailingSpace: unsafeCSS("var(--m3e-button-extra-large-trailing-space, 4rem)"),
    iconLabelSpace: unsafeCSS("var(--m3e-button-extra-large-icon-label-space, 1rem)"),
  },
} as const;
