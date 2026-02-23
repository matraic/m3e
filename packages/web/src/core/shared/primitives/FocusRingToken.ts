import { unsafeCSS } from "lit";

import { DesignToken } from "../tokens";

/**
 * Component design tokens that control the `M3eFocusRingElement`.
 * @internal
 */
export const FocusRingToken = {
  /** The color of the focus ring. */
  color: unsafeCSS(`var(--m3e-focus-ring-color, ${DesignToken.color.secondary})`),

  /** The duration of the focus ring animation. */
  duration: unsafeCSS(`var(--m3e-focus-ring-duration, ${DesignToken.motion.duration.long2})`),

  /** The thickness of the focus ring. */
  thickness: unsafeCSS(`var(--m3e-focus-ring-thickness, 0.1875rem)`),

  /** The visibility of the focus ring. */
  visibility: unsafeCSS(`var(--m3e-focus-ring-visibility, visible)`),

  /** The factor by which the focus ring grows. */
  growthFactor: unsafeCSS(`var(--m3e-focus-ring-growth-factor, 2)`),
} as const;
