import { unsafeCSS } from "lit";

import { DesignToken } from "../tokens";

/**
 * Component design tokens that control the `M3eStateLayerElement`.
 * @internal
 */
export const StateLayerToken = {
  hoverColor: unsafeCSS(`var(--m3e-state-layer-hover-color, ${DesignToken.color.onSurface})`),
  hoverOpacity: unsafeCSS(`var(--m3e-state-layer-hover-opacity, ${DesignToken.state.hoverStateLayerOpacity})`),
  focusColor: unsafeCSS(`var(--m3e-state-layer-focus-color, ${DesignToken.color.onSurface})`),
  focusOpacity: unsafeCSS(`var(--m3e-state-layer-focus-opacity, ${DesignToken.state.focusStateLayerOpacity})`),
  duration: unsafeCSS(`var(--m3e-state-layer-duration, ${DesignToken.motion.duration.medium1})`),
  easing: unsafeCSS(`var(--m3e-state-layer-easing, ${DesignToken.motion.easing.standard})`),
} as const;
