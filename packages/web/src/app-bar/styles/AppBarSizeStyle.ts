import { css, CSSResult, CSSResultGroup, unsafeCSS } from "lit";

import { AppBarSize } from "../AppBarSize";
import { AppBarSizeToken } from "./AppBarSizeToken";
import { AppBarToken } from "./AppBarToken";

/** @private */
function appBarStyle(size: AppBarSize): CSSResult {
  const selector = unsafeCSS(`:is(:state(--${size}), :--${size})`);
  return css`
    :host(${selector}) .wrapper:not(.with-subtitle) {
      min-height: ${AppBarSizeToken[size].containerHeight};
    }
    :host(${selector}) .wrapper.with-subtitle {
      min-height: ${AppBarSizeToken[size].containerHeightWithSubtitle ?? AppBarSizeToken[size].containerHeight};
    }
    :host(${selector}) .title {
      font-size: ${AppBarSizeToken[size].titleTextFontSize};
      font-weight: ${AppBarSizeToken[size].titleTextFontWeight};
      line-height: ${AppBarSizeToken[size].titleTextLineHeight};
      letter-spacing: ${AppBarSizeToken[size].titleTextTracking};
    }
    :host(${selector}) .subtitle {
      font-size: ${AppBarSizeToken[size].subtitleTextFontSize};
      font-weight: ${AppBarSizeToken[size].subtitleTextFontWeight};
      line-height: ${AppBarSizeToken[size].subtitleTextLineHeight};
      letter-spacing: ${AppBarSizeToken[size].subtitleTextTracking};
    }
    :host(:not([centered])${selector}) .label {
      padding-inline-start: ${AppBarSizeToken[size].headingPaddingLeft};
      padding-inline-end: ${AppBarSizeToken[size].headingPaddingRight};
    }
    :host([centered]${selector}) .label {
      padding-inline: ${AppBarSizeToken[size].headingPaddingLeft};
    }
    :host(${selector}) .wrapper {
      padding-block-start: ${AppBarSizeToken[size].paddingTop ?? unsafeCSS("unset")};
      padding-block-end: ${AppBarSizeToken[size].paddingBottom ?? unsafeCSS("unset")};
    }
    ${AppBarSizeToken[size].titleMaxLines
      ? css`
          :host(${selector}) .title {
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
          :host(${selector}) .subtitle {
            display: -webkit-box;
            -webkit-line-clamp: ${AppBarSizeToken[size].subtitleMaxLines};
            -webkit-box-orient: vertical;
            overflow: hidden;
            line-clamp: ${AppBarSizeToken[size].subtitleMaxLines};
          }
        `
      : css``}
    ${size === "small" ? css`` : compressedStyle(selector)}
  `;
}

/** @private */
function compressedStyle(selector: CSSResult): CSSResult {
  const small = AppBarSizeToken.small;
  return css`
    :host(${selector}) .wrapper.compress {
      min-height: 0;
      --_target: ${small.containerHeight};
    }
    :host(${selector}) .wrapper.compress.with-subtitle {
      --_target: ${small.containerHeightWithSubtitle ?? small.containerHeight};
    }
    :host(${selector}) .wrapper.compact {
      flex-direction: row;
      align-items: flex-start;
      padding-block: 0;
      padding-inline-start: ${AppBarToken.paddingLeft};
      padding-inline-end: ${AppBarToken.paddingRight};
    }
    :host(${selector}) .wrapper.compact .leading-icon,
    :host(${selector}) .wrapper.compact .trailing-icon,
    :host(${selector}) .wrapper.compact .label {
      min-height: ${small.containerHeight};
      box-sizing: border-box;
    }
    :host(${selector}) .wrapper.compact .label {
      justify-content: center;
    }
    :host(${selector}) .wrapper.compact .heading {
      display: contents;
    }
    :host(${selector}) .wrapper.compact .spacer {
      display: none;
    }
    :host(${selector}) .wrapper.compact .leading-icon {
      order: 0;
    }
    :host(${selector}) .wrapper.compact .label {
      order: 1;
      flex: 1 1 auto;
      min-width: 0;
      padding-inline-start: ${small.headingPaddingLeft};
      padding-inline-end: ${small.headingPaddingRight};
    }
    :host(${selector}) .wrapper.compact .trailing-icon {
      order: 2;
    }
    :host(${selector}) .wrapper.compact .title,
    :host(${selector}) .wrapper.compact .subtitle {
      display: block;
      -webkit-line-clamp: unset;
      line-clamp: unset;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: start;
    }
    :host(${selector}) .wrapper.compact .title {
      font-size: ${small.titleTextFontSize};
      font-weight: ${small.titleTextFontWeight};
      line-height: ${small.titleTextLineHeight};
      letter-spacing: ${small.titleTextTracking};
    }
    :host(${selector}) .wrapper.compact .subtitle {
      font-size: ${small.subtitleTextFontSize};
      font-weight: ${small.subtitleTextFontWeight};
      line-height: ${small.subtitleTextLineHeight};
      letter-spacing: ${small.subtitleTextTracking};
    }
    :host([centered]${selector}) .wrapper.compact .label {
      padding-inline: ${small.headingPaddingLeft};
    }
    :host([centered]${selector}) .wrapper.compact .title,
    :host([centered]${selector}) .wrapper.compact .subtitle {
      text-align: center;
    }
  `;
}

/**
 * Size variant styles for `M3eAppBarElement`.
 * @internal
 */
export const AppBarSizeStyle: CSSResultGroup = [appBarStyle("small"), appBarStyle("medium"), appBarStyle("large")];
