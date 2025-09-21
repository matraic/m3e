import { unsafeCSS } from "lit";

import { DesignToken } from "@m3e/core";

/**
 * Component design tokens that control `M3eAppBarElement`.
 * @internal
 */
export const AppBarToken = {
  containerColor: unsafeCSS(`var(--m3e-app-bar-container-color, ${DesignToken.color.surface})`),
  containerColorOnScroll: unsafeCSS(
    `var(--m3e-app-bar-container-color-on-scroll, ${DesignToken.color.surfaceContainer})`
  ),
  containerElevation: unsafeCSS(`var(--m3e-app-bar-container-elevation, ${DesignToken.elevation.level0})`),
  containerElevationOnScroll: unsafeCSS(
    `var(--m3e-app-bar-container-elevation-on-scroll, ${DesignToken.elevation.level1})`
  ),
  titleTextColor: unsafeCSS(`var(--m3e-app-bar-title-text-color, ${DesignToken.color.onSurface})`),
  subtitleTextColor: unsafeCSS(`var(--m3e-app-bar-subtitle-text-color, ${DesignToken.color.onSurfaceVariant})`),
  paddingLeft: unsafeCSS(`var(--m3e-app-bar-padding-left, 0.25rem)`),
  paddingRight: unsafeCSS(`var(--m3e-app-bar-padding-right, 0.25rem)`),
} as const;
