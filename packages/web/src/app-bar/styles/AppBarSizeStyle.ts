import { css, CSSResult, CSSResultGroup, unsafeCSS } from "lit";

import { AppBarSize } from "../AppBarSize";
import { AppBarSizeToken } from "./AppBarSizeToken";

/** @private */
function appBarStyle(size: AppBarSize): CSSResult {
  const selector = `:is(:state(--${size}), :--${size})`;
  return css`
    :host(${unsafeCSS(selector)}) .base:not(.with-subtitle) {
      min-height: ${AppBarSizeToken[size].containerHeight};
    }
    :host(${unsafeCSS(selector)}) .base.with-subtitle {
      min-height: ${AppBarSizeToken[size].containerHeightWithSubtitle ?? AppBarSizeToken[size].containerHeight};
    }
    :host(${unsafeCSS(selector)}) .title {
      font-size: ${AppBarSizeToken[size].titleTextFontSize};
      font-weight: ${AppBarSizeToken[size].titleTextFontWeight};
      line-height: ${AppBarSizeToken[size].titleTextLineHeight};
      letter-spacing: ${AppBarSizeToken[size].titleTextTracking};
    }
    :host(${unsafeCSS(selector)}) .subtitle {
      font-size: ${AppBarSizeToken[size].subtitleTextFontSize};
      font-weight: ${AppBarSizeToken[size].subtitleTextFontWeight};
      line-height: ${AppBarSizeToken[size].subtitleTextLineHeight};
      letter-spacing: ${AppBarSizeToken[size].subtitleTextTracking};
    }
    :host(:not([centered])${unsafeCSS(selector)}) .label {
      padding-inline-start: ${AppBarSizeToken[size].headingPaddingLeft};
      padding-inline-end: ${AppBarSizeToken[size].headingPaddingRight};
    }
    :host([centered]${unsafeCSS(selector)}) .label {
      padding-inline: ${AppBarSizeToken[size].headingPaddingLeft};
    }
    :host(${unsafeCSS(selector)}) .base {
      padding-block-start: ${AppBarSizeToken[size].paddingTop ?? unsafeCSS("unset")};
      padding-block-end: ${AppBarSizeToken[size].paddingBottom ?? unsafeCSS("unset")};
    }
    ${AppBarSizeToken[size].titleMaxLines
      ? css`
          :host(${unsafeCSS(selector)}) .title {
            display: -webkit-box;
            -webkit-line-clamp: ${AppBarSizeToken[size].titleMaxLines};
            -webkit-box-orient: vertical;
            overflow: hidden;
            line-clamp: ${AppBarSizeToken[size].titleMaxLines};
          }
        `
      : css``}
    ${AppBarSizeToken[size].subtitleMaxLines
      ? css`
          :host(${unsafeCSS(selector)}) .subtitle {
            display: -webkit-box;
            -webkit-line-clamp: ${AppBarSizeToken[size].subtitleMaxLines};
            -webkit-box-orient: vertical;
            overflow: hidden;
            line-clamp: ${AppBarSizeToken[size].subtitleMaxLines};
          }
        `
      : css``}
  `;
}

/**
 * Size variant styles for `M3eAppBarElement`.
 * @internal
 */
export const AppBarSizeStyle: CSSResultGroup = [appBarStyle("small"), appBarStyle("medium"), appBarStyle("large")];
