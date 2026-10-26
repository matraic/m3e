import { unsafeCSS } from "lit";

import { DesignToken } from "@pulse/web/core";

/**
 * Component design tokens for `M3eCardElement`.
 * @internal
 */
export const CardToken = {
  padding: unsafeCSS(`var(--m3e-card-padding, ${DesignToken.measurement.space200})`),
  shape: unsafeCSS(`var(--m3e-card-shape, ${DesignToken.shape.corner.medium});`),
} as const;
