import { unsafeCSS } from "lit";

import { DesignToken } from "@m3e/web/core";

/**
 * Component design tokens for `M3eExpansionHeaderElement`.
 * @internal
 */
export const ExpansionHeaderToken = {
  collapsedHeight: unsafeCSS("var(--m3e-expansion-header-collapsed-height, 48px)"),
  expandedHeight: unsafeCSS("var(--m3e-expansion-header-expanded-height, 64px)"),
  paddingLeft: unsafeCSS(`var(--m3e-expansion-header-padding-left, ${DesignToken.measurement.space300})`),
  paddingRight: unsafeCSS(`var(--m3e-expansion-header-padding-right, ${DesignToken.measurement.space300})`),
  spacing: unsafeCSS(`var(--m3e-expansion-header-spacing, ${DesignToken.measurement.space100})`),
  toggleIconSize: unsafeCSS("var(--m3e-expansion-header-toggle-icon-size, 24px)"),
  fontSize: unsafeCSS(`var(--m3e-expansion-header-font-size, ${DesignToken.typescale.standard.title.medium.fontSize})`),
  fontWeight: unsafeCSS(
    `var(--m3e-expansion-header-font-weight, ${DesignToken.typescale.standard.title.medium.fontWeight})`,
  ),
  lineHeight: unsafeCSS(
    `var(--m3e-expansion-header-line-height, ${DesignToken.typescale.standard.title.medium.lineHeight})`,
  ),
  tracking: unsafeCSS(`var(--m3e-expansion-header-tracking, ${DesignToken.typescale.standard.title.medium.tracking})`),
} as const;
