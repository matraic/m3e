import { unsafeCSS } from "lit";

import { DesignToken } from "../tokens";

/**
 * Component design tokens that control the `M3eRippleElement`.
 * @internal
 */
export const RippleToken = {
  color: unsafeCSS(`var(--m3e-ripple-color, ${DesignToken.color.onSurface})`),
  opacity: unsafeCSS(`var(--m3e-ripple-opacity, ${DesignToken.state.pressedStateLayerOpacity})`),
  enterDuration: unsafeCSS(`var(--m3e-ripple-enter-duration, ${DesignToken.motion.duration.long4})`),
  exitDuration: unsafeCSS(`var(--m3e-ripple-exit-duration, ${DesignToken.motion.duration.short2})`),
  scaleFactor: unsafeCSS(`var(--m3e-ripple-scale-factor, 2.5)`),
} as const;
