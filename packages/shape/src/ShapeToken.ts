import { unsafeCSS } from "lit";

import { DesignToken } from "@m3e/core";

/**
 * Component design tokens that control the `M3eShapeElement` for all variants.
 * @internal
 */
export const ShapeToken = {
  /** Default size of the shape. */
  size: unsafeCSS(`var(--m3e-shape-size, 3rem)`),

  /** Container (background) color of the shape. */
  containerColor: unsafeCSS(`var(--m3e-shape-container-color, ${DesignToken.color.primary})`),

  /** Transition used to morph between shapes. */
  transition: unsafeCSS(`var(--m3e-shape-transition, clip-path ${DesignToken.motion.spring.slowEffects})`),
} as const;
