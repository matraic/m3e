import { css, CSSResult, CSSResultGroup, unsafeCSS } from "lit";

import { AppBarSize } from "../AppBarSize";
import { AppBarSizeToken } from "./AppBarSizeToken";

/** @private */
function appBarStyle(size: AppBarSize): CSSResult {
  return css`
    :host([size="${unsafeCSS(size)}"]) .base:not(.-with-subtitle) {
      min-height: ${AppBarSizeToken[size].containerHeight};
    }
    :host([size="${unsafeCSS(size)}"]) .base.-with-subtitle {
      min-height: ${AppBarSizeToken[size].containerHeightWithSubtitle ?? AppBarSizeToken[size].containerHeight};
    }
    :host([size="${unsafeCSS(size)}"]) .title {
      font-size: ${AppBarSizeToken[size].titleTextFontSize};
      font-weight: ${AppBarSizeToken[size].titleTextFontWeight};
      line-height: ${AppBarSizeToken[size].titleTextLineHeight};
      letter-spacing: ${AppBarSizeToken[size].titleTextTracking};
    }
    :host([size="${unsafeCSS(size)}"]) .subtitle {
      font-size: ${AppBarSizeToken[size].subtitleTextFontSize};
      font-weight: ${AppBarSizeToken[size].subtitleTextFontWeight};
      line-height: ${AppBarSizeToken[size].subtitleTextLineHeight};
      letter-spacing: ${AppBarSizeToken[size].subtitleTextTracking};
    }
    :host(:not([centered])[size="${unsafeCSS(size)}"]) .label {
      padding-inline-start: ${AppBarSizeToken[size].headingPaddingLeft};
      padding-inline-end: ${AppBarSizeToken[size].headingPaddingRight};
    }
    :host([centered][size="${unsafeCSS(size)}"]) .label {
      padding-inline: ${AppBarSizeToken[size].headingPaddingLeft};
    }
    :host([size="${unsafeCSS(size)}"]) .base {
      padding-block-start: ${AppBarSizeToken[size].paddingTop ?? unsafeCSS("unset")};
      padding-block-end: ${AppBarSizeToken[size].paddingBottom ?? unsafeCSS("unset")};
    }
    ${AppBarSizeToken[size].titleMaxLines
      ? css`
          :host([size="${unsafeCSS(size)}"]) .title {
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
          :host([size="${unsafeCSS(size)}"]) .subtitle {
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
