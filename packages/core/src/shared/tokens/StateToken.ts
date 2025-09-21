import { unsafeCSS } from "lit";

/** Design tokens that control state layer. */
export const StateToken = {
  /** Opacity of the state layer on focus. */
  focusStateLayerOpacity: unsafeCSS("var(--md-sys-state-focus-state-layer-opacity, 10%)"),

  /** Opacity of the state layer on hover. */
  hoverStateLayerOpacity: unsafeCSS("var(--md-sys-state-hover-state-layer-opacity, 8%)"),

  /** Opacity of the state layer on pressed. */
  pressedStateLayerOpacity: unsafeCSS("var(--md-sys-state-pressed-state-layer-opacity, 10%)"),
} as const;
