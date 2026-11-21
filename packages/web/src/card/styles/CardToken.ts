import { unsafeCSS } from "lit";

import { DesignToken } from "@m3e/web/core";

/**
 * Component design tokens for `M3eCardElement`.
 * @internal
 */
export const CardToken = {
  padding: unsafeCSS(`var(--m3e-card-padding, ${DesignToken.measurement.space200})`),
  shape: unsafeCSS(`var(--m3e-card-shape, ${DesignToken.shape.corner.medium});`),
  shapeFamily: {
    startStart: unsafeCSS(
      `var(--m3e-card-shape-family-start-start, var(--m3e-card-shape-family, ${DesignToken.shape.family.startStart}))`,
    ),
    startEnd: unsafeCSS(
      `var(--m3e-card-shape-family-start-end, var(--m3e-card-shape-family, ${DesignToken.shape.family.startEnd}))`,
    ),
    endStart: unsafeCSS(
      `var(--m3e-card-shape-family-end-start, var(--m3e-card-shape-family, ${DesignToken.shape.family.endStart}))`,
    ),
    endEnd: unsafeCSS(
      `var(--m3e-card-shape-family-end-end, var(--m3e-card-shape-family, ${DesignToken.shape.family.endEnd}))`,
    ),
  },
} as const;
