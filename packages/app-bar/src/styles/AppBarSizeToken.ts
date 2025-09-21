import { CSSResult, unsafeCSS } from "lit";

import { DesignToken } from "@m3e/core";

import { AppBarSize } from "../AppBarSize";

/** @private */
type _AppBarSizeToken = {
  containerHeight: CSSResult;
  containerHeightWithSubtitle?: CSSResult;
  paddingTop?: CSSResult;
  paddingBottom?: CSSResult;
  titleTextFontSize: CSSResult;
  titleTextFontWeight: CSSResult;
  titleTextLineHeight: CSSResult;
  titleTextTracking: CSSResult;
  subtitleTextFontSize: CSSResult;
  subtitleTextFontWeight: CSSResult;
  subtitleTextLineHeight: CSSResult;
  subtitleTextTracking: CSSResult;
  titleMaxLines?: CSSResult;
  subtitleMaxLines?: CSSResult;
  headingPaddingLeft: CSSResult;
  headingPaddingRight: CSSResult;
};

/**
 * Component design tokens that control the `M3eAppBarElement` for all size variants.
 * @internal
 */
export const AppBarSizeToken: Record<AppBarSize, _AppBarSizeToken> = {
  small: {
    containerHeight: unsafeCSS(`var(--m3e-app-bar-small-container-height, 4rem)`),
    titleTextFontSize: unsafeCSS(
      `var(--m3e-app-bar-small-title-text-font-size, ${DesignToken.typescale.standard.title.large.fontSize})`
    ),
    titleTextFontWeight: unsafeCSS(
      `var(--m3e-app-bar-small-title-text-font-weight, ${DesignToken.typescale.standard.title.large.fontWeight})`
    ),
    titleTextLineHeight: unsafeCSS(
      `var(--m3e-app-bar-small-title-text-line-height, ${DesignToken.typescale.standard.title.large.lineHeight})`
    ),
    titleTextTracking: unsafeCSS(
      `var(--m3e-app-bar-small-subtitle-text-tracking, ${DesignToken.typescale.standard.title.large.tracking})`
    ),
    subtitleTextFontSize: unsafeCSS(
      `var(--m3e-app-bar-small-subtitle-text-font-size, ${DesignToken.typescale.standard.label.medium.fontSize})`
    ),
    subtitleTextFontWeight: unsafeCSS(
      `var(--m3e-app-bar-small-subtitle-text-font-weight, ${DesignToken.typescale.standard.label.medium.fontWeight})`
    ),
    subtitleTextLineHeight: unsafeCSS(
      `var(--m3e-app-bar-small-subtitle-text-line-height, ${DesignToken.typescale.standard.label.medium.lineHeight})`
    ),
    subtitleTextTracking: unsafeCSS(
      `var(--m3e-app-bar-small-subtitle-text-tracking, ${DesignToken.typescale.standard.label.medium.tracking})`
    ),
    headingPaddingLeft: unsafeCSS(`var(--m3e-app-bar-small-heading-padding-left, 0.25rem)`),
    headingPaddingRight: unsafeCSS(`var(--m3e-app-bar-small-heading-padding-right, 0.25rem)`),
  },
  medium: {
    containerHeight: unsafeCSS(`var(--m3e-app-bar-medium-container-height, 7rem)`),
    containerHeightWithSubtitle: unsafeCSS(`var(--m3e-app-bar-medium-container-height-with-subtitle, 8.5rem)`),
    titleTextFontSize: unsafeCSS(
      `var(--m3e-app-bar-medium-title-text-font-size, ${DesignToken.typescale.standard.headline.medium.fontSize})`
    ),
    titleTextFontWeight: unsafeCSS(
      `var(--m3e-app-bar-medium-title-text-font-weight, ${DesignToken.typescale.standard.headline.medium.fontWeight})`
    ),
    titleTextLineHeight: unsafeCSS(
      `var(--m3e-app-bar-medium-title-text-line-height, ${DesignToken.typescale.standard.headline.medium.lineHeight})`
    ),
    titleTextTracking: unsafeCSS(
      `var(--m3e-app-bar-medium-subtitle-text-tracking, ${DesignToken.typescale.standard.headline.medium.tracking})`
    ),
    subtitleTextFontSize: unsafeCSS(
      `var(--m3e-app-bar-medium-subtitle-text-font-size, ${DesignToken.typescale.standard.title.small.fontSize})`
    ),
    subtitleTextFontWeight: unsafeCSS(
      `var(--m3e-app-bar-medium-subtitle-text-font-weight, ${DesignToken.typescale.standard.title.small.fontWeight})`
    ),
    subtitleTextLineHeight: unsafeCSS(
      `var(--m3e-app-bar-medium-subtitle-text-line-height, ${DesignToken.typescale.standard.title.small.lineHeight})`
    ),
    subtitleTextTracking: unsafeCSS(
      `var(--m3e-app-bar-medium-subtitle-text-tracking, ${DesignToken.typescale.standard.title.small.tracking})`
    ),
    headingPaddingLeft: unsafeCSS(`var(--m3e-app-bar-medium-heading-padding-left, 1rem)`),
    headingPaddingRight: unsafeCSS(`var(--m3e-app-bar-medium-heading-padding-right, 0.25rem)`),
    paddingTop: unsafeCSS(`var(--m3e-app-bar-medium-padding-top, 0.5rem)`),
    paddingBottom: unsafeCSS(`var(--m3e-app-bar-medium-padding-bottom, 0.75rem)`),
    titleMaxLines: unsafeCSS(`var(--m3e-app-bar-medium-title-max-lines, 2)`),
    subtitleMaxLines: unsafeCSS(`var(--m3e-app-bar-medium-subtitle-max-lines, 1)`),
  },
  large: {
    containerHeight: unsafeCSS(`var(--m3e-app-bar-large-container-height, 7.5rem)`),
    containerHeightWithSubtitle: unsafeCSS(`var(--m3e-app-bar-large-container-height-with-subtitle, 9.5rem)`),
    titleTextFontSize: unsafeCSS(
      `var(--m3e-app-bar-large-title-text-font-size, ${DesignToken.typescale.standard.display.small.fontSize})`
    ),
    titleTextFontWeight: unsafeCSS(
      `var(--m3e-app-bar-large-title-text-font-weight, ${DesignToken.typescale.standard.display.small.fontWeight})`
    ),
    titleTextLineHeight: unsafeCSS(
      `var(--m3e-app-bar-large-title-text-line-height, ${DesignToken.typescale.standard.display.small.lineHeight})`
    ),
    titleTextTracking: unsafeCSS(
      `var(--m3e-app-bar-large-subtitle-text-tracking, ${DesignToken.typescale.standard.display.small.tracking})`
    ),
    subtitleTextFontSize: unsafeCSS(
      `var(--m3e-app-bar-large-subtitle-text-font-size, ${DesignToken.typescale.standard.title.medium.fontSize})`
    ),
    subtitleTextFontWeight: unsafeCSS(
      `var(--m3e-app-bar-large-subtitle-text-font-weight, ${DesignToken.typescale.standard.title.medium.fontWeight})`
    ),
    subtitleTextLineHeight: unsafeCSS(
      `var(--m3e-app-bar-large-subtitle-text-line-height, ${DesignToken.typescale.standard.title.medium.lineHeight})`
    ),
    subtitleTextTracking: unsafeCSS(
      `var(--m3e-app-bar-large-subtitle-text-tracking, ${DesignToken.typescale.standard.title.medium.tracking})`
    ),
    headingPaddingLeft: unsafeCSS(`var(--m3e-app-bar-large-heading-padding-left, 1rem)`),
    headingPaddingRight: unsafeCSS(`var(--m3e-app-bar-large-heading-padding-right, 0.25rem)`),
    paddingTop: unsafeCSS(`var(--m3e-app-bar-large-padding-top, 0.5rem)`),
    paddingBottom: unsafeCSS(`var(--m3e-app-bar-large-padding-bottom, 0.75rem)`),
    titleMaxLines: unsafeCSS(`var(--m3e-app-bar-large-title-max-lines, 2)`),
    subtitleMaxLines: unsafeCSS(`var(--m3e-app-bar-large-subtitle-max-lines, 1)`),
  },
} as const;
