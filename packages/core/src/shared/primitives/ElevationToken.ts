import { unsafeCSS } from "lit";

import { DesignToken } from "../tokens";

/**
 * Component design tokens that control the `M3eElevationElement`.
 * @internal
 */
export const ElevationToken = {
  liftDuration: unsafeCSS(`var(--m3e-elevation-lift-duration, ${DesignToken.motion.duration.short4})`),
  liftEasing: unsafeCSS(`var(--m3e-elevation-lift-easing, ${DesignToken.motion.easing.standard})`),
  settleDuration: unsafeCSS(`var(--m3e-elevation-settle-duration, ${DesignToken.motion.duration.short3})`),
  settleEasing: unsafeCSS(`var(--m3e-elevation-settle-easing, ${DesignToken.motion.easing.standardAccelerate})`),
  level: unsafeCSS(`var(--m3e-elevation-level, ${DesignToken.elevation.level0})`),
  hoverLevel: unsafeCSS(`var(--m3e-elevation-hover-level, ${DesignToken.elevation.level0})`),
  focusLevel: unsafeCSS(`var(--m3e-elevation-focus-level, ${DesignToken.elevation.level0})`),
  pressedLevel: unsafeCSS(`var(--m3e-elevation-pressed-level, ${DesignToken.elevation.level0})`),
} as const;
