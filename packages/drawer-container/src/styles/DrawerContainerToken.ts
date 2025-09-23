import { unsafeCSS } from "lit";

import { DesignToken } from "@m3e/core";

/**
 * Component design tokens that control `M3eDrawerContainerElement`.
 * @internal
 */
export const DrawerContainerToken = {
  containerColor: unsafeCSS(`var(--m3e-drawer-container-color, ${DesignToken.color.surface})`),
  containerElevation: unsafeCSS(`var(--m3e-drawer-container-elevation, ${DesignToken.elevation.level0})`),
  containerWidth: unsafeCSS(`var(--m3e-drawer-container-width, 22.5rem)`),
  scrimOpacity: unsafeCSS("var(--m3e-drawer-container-scrim-opacity, 32%)"),
  cornerShape: unsafeCSS(`var(--m3e-modal-drawer-corner-shape, ${DesignToken.shape.corner.large})`),
  modalContainerColor: unsafeCSS(`var(--m3e-modal-drawer-container-color, ${DesignToken.color.surfaceContainerLow})`),
  modalContainerElevation: unsafeCSS(`var(--m3e-modal-drawer-elevation, ${DesignToken.elevation.level1})`),
  dividerColor: unsafeCSS(`var(--m3e-drawer-divider-color, ${DesignToken.color.outline})`),
  dividerThickness: unsafeCSS("var(--m3e-drawer-divider-thickness, 1px)"),
} as const;
