import { unsafeCSS } from "lit";

import { DesignToken } from "@m3e/web/core";

const containerMaxWidth = "max(0px, calc(100vw - var(--m3e-drawer-container-scrim-min-space, 56px)))";

/**
 * Component design tokens that control `M3eDrawerContainerElement`.
 * @internal
 */
export const DrawerContainerToken = {
  containerColor: unsafeCSS(`var(--m3e-drawer-container-color, ${DesignToken.color.surface})`),
  containerElevation: unsafeCSS(`var(--m3e-drawer-container-elevation, ${DesignToken.elevation.level0})`),
  containerWidth: unsafeCSS(`min(var(--m3e-drawer-container-width, 360px), ${containerMaxWidth})`),
  containerMaxWidth: unsafeCSS(containerMaxWidth),
  scrimOpacity: unsafeCSS("var(--m3e-drawer-container-scrim-opacity, 32%)"),
  startShape: unsafeCSS(
    `var(--m3e-modal-drawer-start-shape, var(--m3e-modal-drawer-corner-shape, ${DesignToken.shape.corner.large}))`,
  ),
  endShape: unsafeCSS(
    `var(--m3e-modal-drawer-end-shape, var(--m3e-modal-drawer-corner-shape, ${DesignToken.shape.corner.large}))`,
  ),
  modalContainerColor: unsafeCSS(`var(--m3e-modal-drawer-container-color, ${DesignToken.color.surfaceContainerLow})`),
  modalContainerElevation: unsafeCSS(`var(--m3e-modal-drawer-elevation, ${DesignToken.elevation.level1})`),
  dividerColor: unsafeCSS(`var(--m3e-drawer-divider-color, ${DesignToken.color.outline})`),
  dividerThickness: unsafeCSS("var(--m3e-drawer-divider-thickness, 1px)"),
} as const;
