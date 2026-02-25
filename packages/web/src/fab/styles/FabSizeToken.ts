import { CSSResult, unsafeCSS } from "lit";

import { DesignToken } from "@m3e/web/core";
import { FabSize } from "../FabSize";

/** @private */
type _FabSizeToken = {
  containerHeight: CSSResult;
  labelTextFontSize: CSSResult;
  labelTextFontWeight: CSSResult;
  labelTextLineHeight: CSSResult;
  labelTextTracking: CSSResult;
  iconSize: CSSResult;
  extendedIconSize: CSSResult;
  shape: CSSResult;
  leadingSpace: CSSResult;
  trailingSpace: CSSResult;
  extendedLeadingSpace: CSSResult;
  extendedTrailingSpace: CSSResult;
  iconLabelSpace: CSSResult;
};

/**
 * Component design tokens that control the `M3eFabElement` for all size variants.
 * @internal
 */
export const FabSizeToken: Record<FabSize, _FabSizeToken> = {
  /** Design tokens that control the `small` `size` variant. */
  small: {
    containerHeight: unsafeCSS(
      `calc(var(--m3e-fab-small-container-height, var(--m3e-fab-container-height, 3.5rem)) + ${DesignToken.density.calc(-3)})`,
    ),
    labelTextFontSize: unsafeCSS(
      `var(--m3e-fab-small-label-text-font-size, var(--m3e-fab-label-text-font-size, ${DesignToken.typescale.standard.title.medium.fontSize}))`,
    ),
    labelTextFontWeight: unsafeCSS(
      `var(--m3e-fab-small-label-text-font-weight, var(--m3e-fab-label-text-font-weight, ${DesignToken.typescale.standard.title.medium.fontWeight}))`,
    ),
    labelTextLineHeight: unsafeCSS(
      `var(--m3e-fab-small-label-text-line-height, var(--m3e-fab-label-text-line-height, ${DesignToken.typescale.standard.title.medium.lineHeight}))`,
    ),
    labelTextTracking: unsafeCSS(
      `var(--m3e-fab-small-label-text-tracking, var(--m3e-fab-label-text-tracking, ${DesignToken.typescale.standard.title.medium.tracking}))`,
    ),
    iconSize: unsafeCSS(
      `calc(var(--m3e-fab-small-icon-size, var(--m3e-fab-icon-size, 1.5rem)) + ${DesignToken.density.calc(-3)})`,
    ),
    extendedIconSize: unsafeCSS("var(--m3e-fab-small-icon-size, var(--m3e-fab-icon-size, 1.5rem))"),
    shape: unsafeCSS(`var(--m3e-fab-small-shape, var(--m3e-fab-shape, ${DesignToken.shape.corner.large}))`),
    leadingSpace: unsafeCSS(
      `calc(var(--m3e-fab-small-leading-space, var(--m3e-fab-leading-space, 1rem)) + ${DesignToken.density.calc(-3)})`,
    ),
    trailingSpace: unsafeCSS(
      `calc(var(--m3e-fab-small-trailing-space, var(--m3e-fab-trailing-space, 1rem)) + ${DesignToken.density.calc(-3)})`,
    ),
    iconLabelSpace: unsafeCSS("var(--m3e-fab-small-icon-label-space, var(--m3e-fab-icon-label-space, 0.5rem))"),
    extendedLeadingSpace: unsafeCSS("var(--m3e-fab-small-leading-space, var(--m3e-fab-leading-space, 1rem))"),
    extendedTrailingSpace: unsafeCSS("var(--m3e-fab-small-trailing-space, var(--m3e-fab-trailing-space, 1rem))"),
  },

  /** Design tokens that control the `medium` `size` variant. */
  medium: {
    containerHeight: unsafeCSS(
      `calc(var(--m3e-fab-medium-container-height, var(--m3e-fab-container-height, 5rem)) + ${DesignToken.density.calc(-3)})`,
    ),
    labelTextFontSize: unsafeCSS(
      `var(--m3e-fab-medium-label-text-font-size, var(--m3e-fab-label-text-font-size, ${DesignToken.typescale.standard.title.large.fontSize}))`,
    ),
    labelTextFontWeight: unsafeCSS(
      `var(--m3e-fab-medium-label-text-font-weight, var(--m3e-fab-label-text-font-weight, ${DesignToken.typescale.standard.title.large.fontWeight}))`,
    ),
    labelTextLineHeight: unsafeCSS(
      `var(--m3e-fab-medium-label-text-line-height, var(--m3e-fab-label-text-line-height, ${DesignToken.typescale.standard.title.large.lineHeight}))`,
    ),
    labelTextTracking: unsafeCSS(
      `var(--m3e-fab-medium-label-text-tracking, var(--m3e-fab-label-text-tracking, ${DesignToken.typescale.standard.title.large.tracking}))`,
    ),
    iconSize: unsafeCSS(
      `calc(var(--m3e-fab-medium-icon-size, var(--m3e-fab-icon-size, 1.75rem)) + ${DesignToken.density.calc(-3)})`,
    ),
    extendedIconSize: unsafeCSS("var(--m3e-fab-medium-icon-size, var(--m3e-fab-icon-size, 1.75rem))"),
    shape: unsafeCSS(`var(--m3e-fab-medium-shape, var(--m3e-fab-shape, ${DesignToken.shape.corner.largeIncreased}))`),
    leadingSpace: unsafeCSS(
      `calc(var(--m3e-fab-medium-leading-space, var(--m3e-fab-leading-space, 1.625rem)) + ${DesignToken.density.calc(-3)})`,
    ),
    trailingSpace: unsafeCSS(
      `calc(var(--m3e-fab-medium-trailing-space, var(--m3e-fab-trailing-space, 1.625rem)) + ${DesignToken.density.calc(-3)})`,
    ),
    iconLabelSpace: unsafeCSS("var(--m3e-fab-medium-icon-label-space, var(--m3e-fab-icon-label-space, 0.75rem))"),
    extendedLeadingSpace: unsafeCSS("var(--m3e-fab-medium-leading-space, var(--m3e-fab-leading-space, 1.625rem))"),
    extendedTrailingSpace: unsafeCSS("var(--m3e-fab-medium-trailing-space, var(--m3e-fab-trailing-space, 1.625rem))"),
  },

  /** Design tokens that control the `large` `size` variant. */
  large: {
    containerHeight: unsafeCSS(
      `calc(var(--m3e-fab-large-container-height, var(--m3e-fab-container-height, 6rem)) + ${DesignToken.density.calc(-3)})`,
    ),
    labelTextFontSize: unsafeCSS(
      `var(--m3e-fab-large-label-text-font-size, var(--m3e-fab-label-text-font-size, ${DesignToken.typescale.standard.headline.small.fontSize}))`,
    ),
    labelTextFontWeight: unsafeCSS(
      `var(--m3e-fab-large-label-text-font-weight, var(--m3e-fab-label-text-font-weight, ${DesignToken.typescale.standard.headline.small.fontWeight}))`,
    ),
    labelTextLineHeight: unsafeCSS(
      `var(--m3e-fab-large-label-text-line-height, var(--m3e-fab-label-text-line-height, ${DesignToken.typescale.standard.headline.small.lineHeight}))`,
    ),
    labelTextTracking: unsafeCSS(
      `var(--m3e-fab-large-label-text-tracking, var(--m3e-fab-label-text-tracking, ${DesignToken.typescale.standard.headline.small.tracking}))`,
    ),
    iconSize: unsafeCSS(
      `calc(var(--m3e-fab-large-icon-size, var(--m3e-fab-icon-size, 2.25rem)) + ${DesignToken.density.calc(-3)})`,
    ),
    extendedIconSize: unsafeCSS("var(--m3e-fab-large-icon-size, var(--m3e-fab-icon-size, 2.25rem))"),
    shape: unsafeCSS(`var(--m3e-fab-large-shape, var(--m3e-fab-shape, ${DesignToken.shape.corner.extraLarge}))`),
    leadingSpace: unsafeCSS(
      `calc(var(--m3e-fab-large-leading-space, var(--m3e-fab-leading-space, 1.75rem)) + ${DesignToken.density.calc(-3)})`,
    ),
    trailingSpace: unsafeCSS(
      `calc(var(--m3e-fab-large-trailing-space, var(--m3e-fab-trailing-space, 1.75rem)) + ${DesignToken.density.calc(-3)})`,
    ),
    iconLabelSpace: unsafeCSS("var(--m3e-fab-large-icon-label-space, var(--m3e-fab-icon-label-space, 1rem))"),
    extendedLeadingSpace: unsafeCSS("var(--m3e-fab-large-leading-space, var(--m3e-fab-leading-space, 1.75rem))"),
    extendedTrailingSpace: unsafeCSS("var(--m3e-fab-large-trailing-space, var(--m3e-fab-trailing-space, 1.75rem))"),
  },
} as const;
