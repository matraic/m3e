import { unsafeCSS } from "lit";

import { DesignToken } from "@m3e/web/core";

/** @internal */
export const SearchBarToken = {
  containerColor: unsafeCSS(`var(--m3e-search-bar-container-color, ${DesignToken.color.surfaceContainerHigh})`),
  leadingIconColor: unsafeCSS(`var(--m3e-search-bar-leading-icon-color, ${DesignToken.color.onSurface})`),
  trailingIconColor: unsafeCSS(`var(--m3e-search-bar-trailing-icon-color, ${DesignToken.color.onSurfaceVariant})`),
  containerHeight: unsafeCSS("var(--m3e-search-bar-container-height, 3.5rem)"),
  containerShape: unsafeCSS(`var(--m3e-search-bar-container-shape, ${DesignToken.shape.corner.full})`),
  iconSize: unsafeCSS("var(--m3e-search-bar-icon-size, 1.5rem)"),
  supportingTextColor: unsafeCSS(`var(--m3e-search-bar-supporting-text-color, ${DesignToken.color.onSurfaceVariant})`),
  supportingTextFontSize: unsafeCSS(
    `var(--m3e-search-bar-supporting-text-font-size, ${DesignToken.typescale.standard.body.large.fontSize})`,
  ),
  supportingTextFontWeight: unsafeCSS(
    `var(--m3e-search-bar-supporting-text-font-weight, ${DesignToken.typescale.standard.body.large.fontWeight})`,
  ),
  supportingTextLineHeight: unsafeCSS(
    `var(--m3e-search-bar-supporting-text-line-height, ${DesignToken.typescale.standard.body.large.lineHeight})`,
  ),
  supportingTextTracking: unsafeCSS(
    `var(--m3e-search-bar-supporting-text-tracking, ${DesignToken.typescale.standard.body.large.tracking})`,
  ),
  inputColor: unsafeCSS(`var(--m3e-search-bar-input-color, ${DesignToken.color.onSurface})`),
  inputTextFontSize: unsafeCSS(
    `var(--m3e-search-bar-input-text-font-size, ${DesignToken.typescale.standard.body.large.fontSize})`,
  ),
  inputTextFontWeight: unsafeCSS(
    `var(--m3e-search-bar-input-text-font-weight, ${DesignToken.typescale.standard.body.large.fontWeight})`,
  ),
  inputTextLineHeight: unsafeCSS(
    `var(--m3e-search-bar-input-text-line-height, ${DesignToken.typescale.standard.body.large.lineHeight})`,
  ),
  inputTextTracking: unsafeCSS(
    `var(--m3e-search-bar-input-text-tracking, ${DesignToken.typescale.standard.body.large.tracking})`,
  ),
  leadingSpace: unsafeCSS("var(--m3e-search-bar-leading-space, 0.25rem)"),
  trailingSpace: unsafeCSS("var(--m3e-search-bar-trailing-space, 0.25rem)"),
  noActionsLeadingSpace: unsafeCSS("var(--m3e-search-bar-no-actions-leading-space, 1rem)"),
  noActionsTrailingSpace: unsafeCSS("var(--m3e-search-bar-no-actions-trailing-space, 1rem)"),
  leadingActionsTrailingSpace: unsafeCSS("var(--m3e-search-bar-leading-actions-trailing-space, 0.25rem)"),
  trailingActionsLeadingSpace: unsafeCSS("var(--m3e-search-bar-trailing-actions-leading-space, 0.25rem)"),
  actionsGap: unsafeCSS("var(--m3e-search-bar-actions-gap, 0px)"),
} as const;
