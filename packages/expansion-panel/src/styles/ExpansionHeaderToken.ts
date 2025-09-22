import { unsafeCSS } from "lit";

import { DesignToken } from "@m3e/core";

/**
 * Component design tokens for `M3eExpansionHeaderElement`.
 * @internal
 */
export const ExpansionHeaderToken = {
  collapsedHeight: unsafeCSS("var(--m3e-expansion-header-collapsed-height, 3rem)"),
  expandedHeight: unsafeCSS("var(--m3e-expansion-header-expanded-height, 4rem)"),
  paddingLeft: unsafeCSS("var(--m3e-expansion-header-padding-left, 1.5rem)"),
  paddingRight: unsafeCSS("var(--m3e-expansion-header-padding-right, 1.5rem)"),
  spacing: unsafeCSS("var(--m3e-expansion-header-spacing, 0.5rem)"),
  toggleIconSize: unsafeCSS("var(--m3e-expansion-header-toggle-icon-size, 1.5rem)"),
  fontSize: unsafeCSS(`var(--m3e-expansion-header-font-size, ${DesignToken.typescale.standard.title.medium.fontSize})`),
  fontWeight: unsafeCSS(
    `var(--m3e-expansion-header-font-weight, ${DesignToken.typescale.standard.title.medium.fontWeight})`
  ),
  lineHeight: unsafeCSS(
    `var(--m3e-expansion-header-line-height, ${DesignToken.typescale.standard.title.medium.lineHeight})`
  ),
  tracking: unsafeCSS(`var(--m3e-expansion-header-tracking, ${DesignToken.typescale.standard.title.medium.tracking})`),
} as const;
