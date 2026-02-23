import { unsafeCSS } from "lit";

import { DesignToken } from "@m3e/web/core";

export const LoadingIndicatorToken = {
  activeIndicatorSize: unsafeCSS(`var(--m3e-loading-indicator-size, 2.375rem)`),
  activeIndicatorColor: unsafeCSS(`var(--m3e-loading-indicator-active-indicator-color, ${DesignToken.color.primary})`),
  containedActiveIndicatorColor: unsafeCSS(
    `var(--m3e-loading-indicator-contained-active-indicator-color, ${DesignToken.color.onPrimaryContainer})`,
  ),
  containedContainerColor: unsafeCSS(
    `var(--m3e-loading-indicator-contained-container-color, ${DesignToken.color.secondaryContainer})`,
  ),
  containerShape: unsafeCSS(`var(--m3e-loading-indicator-container-shape, ${DesignToken.shape.corner.full})`),
  containerSize: unsafeCSS(`var(--m3e-loading-indicator-container-size, 3rem)`),
} as const;
