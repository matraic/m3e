import { unsafeCSS } from "lit";

import { DesignToken } from "@m3e/web/core";

/**
 * Component design tokens that control `M3eToolbarElement`.
 * @internal
 */
export const ToolbarToken = {
  size: unsafeCSS(`var(--m3e-toolbar-size, 64px)`),
  spacing: unsafeCSS(`var(--m3e-toolbar-spacing, ${DesignToken.measurement.space50})`),
} as const;
