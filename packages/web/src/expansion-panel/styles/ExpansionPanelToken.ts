import { unsafeCSS } from "lit";

import { DesignToken } from "@m3e/web/core";

/**
 * Component design tokens for `M3eExpansionPanelElement`.
 * @internal
 */
export const ExpansionPanelToken = {
  textColor: unsafeCSS(`var(--m3e-expansion-panel-text-color, ${DesignToken.color.onSurface})`),
  disabledTextColor: unsafeCSS(`var(--m3e-expansion-panel-disabled-text-color, ${DesignToken.color.onSurface})`),
  disabledTextOpacity: unsafeCSS(`var(--m3e-expansion-panel-disabled-text-opacity, 38%)`),
  containerColor: unsafeCSS("var(--m3e-expansion-panel-container-color)"),
  collapsedElevation: unsafeCSS("var(--m3e-expansion-panel-elevation)"),
  collapsedShape: unsafeCSS("var(--m3e-expansion-panel-shape)"),
  expandedElevation: unsafeCSS("var(--m3e-expansion-panel-open-elevation, var(--m3e-expansion-panel-elevation))"),
  expandedShape: unsafeCSS("var(--m3e-expansion-panel-open-shape, var(--m3e-expansion-panel-shape))"),
  expandedSpace: unsafeCSS("var(--_expansion-panel-open-spacing)"),
  contentPadding: unsafeCSS("var(--m3e-expansion-panel-content-padding, 0 1.5rem 1rem 1.5rem)"),
  actionsSpacing: unsafeCSS("var(--m3e-expansion-panel-actions-spacing, 0.5rem)"),
  actionsPadding: unsafeCSS("var(--m3e-expansion-panel-actions-padding, 1rem 1.5rem 1rem 1.5rem)"),
  actionsDividerThickness: unsafeCSS(
    "var(--m3e-expansion-panel-actions-divider-thickness, var(--m3e-divider-thickness, 1px))",
  ),
  actionsDividerColor: unsafeCSS(
    `var(--m3e-expansion-panel-actions-divider-color, var(--m3e-divider-color, ${DesignToken.color.outlineVariant}))`,
  ),
} as const;
