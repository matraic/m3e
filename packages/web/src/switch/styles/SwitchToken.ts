import { unsafeCSS } from "lit";

import { DesignToken } from "@m3e/web/core";

/**
 * Component design tokens that control `M3eSwitchElement`.
 * @internal
 */
export const SwitchToken = {
  selectedIconColor: unsafeCSS(`var(--m3e-switch-selected-icon-color, ${DesignToken.color.onPrimaryContainer})`),
  selectedIconSize: unsafeCSS("var(--m3e-switch-selected-icon-size, 1rem)"),
  unselectedIconColor: unsafeCSS(
    `var(--m3e-switch-unselected-icon-color, ${DesignToken.color.surfaceContainerHighest})`,
  ),
  unselectedIconSize: unsafeCSS("var(--m3e-switch-unselected-icon-size, 1rem)"),
  trackHeight: unsafeCSS("var(--m3e-switch-track-height, 2rem)"),
  trackWidth: unsafeCSS("var(--m3e-switch-track-width, 3.25rem)"),
  trackOutlineColor: unsafeCSS(`var(--m3e-switch-track-outline-color, ${DesignToken.color.outline})`),
  trackOutlineWidth: unsafeCSS("var(--m3e-switch-track-outline-width, 2px)"),
  trackShape: unsafeCSS(`var(--m3e-switch-track-shape, ${DesignToken.shape.corner.full})`),
  selectedTrackColor: unsafeCSS(`var(--m3e-switch-selected-track-color, ${DesignToken.color.primary})`),
  unselectedTrackColor: unsafeCSS(
    `var(--m3e-switch-unselected-track-color, ${DesignToken.color.surfaceContainerHighest})`,
  ),
  unselectedHandleHeight: unsafeCSS("var(--m3e-switch-unselected-handle-height, 1rem)"),
  unselectedHandleWidth: unsafeCSS("var(--m3e-switch-unselected-handle-width, 1rem)"),
  withIconHandleHeight: unsafeCSS("var(--m3e-switch-with-icon-handle-height, 1.5rem)"),
  withIconHandleWidth: unsafeCSS("var(--m3e-switch-with-icon-handle-width, 1.5rem)"),
  selectedHandleHeight: unsafeCSS("var(--m3e-switch-selected-handle-height, 1.5rem)"),
  selectedHandleWidth: unsafeCSS("var(--m3e-switch-selected-handle-width, 1.5rem)"),
  pressedHandleHeight: unsafeCSS("var(--m3e-switch-pressed-handle-height, 1.75rem)"),
  pressedHandleWidth: unsafeCSS("var(--m3e-switch-pressed-handle-width, 1.75rem)"),
  handleShape: unsafeCSS(`var(--m3e-switch-handle-shape, ${DesignToken.shape.corner.full})`),
  selectedHandleColor: unsafeCSS(`var(--m3e-switch-selected-handle-color, ${DesignToken.color.onPrimary})`),
  unselectedHandleColor: unsafeCSS(`var(--m3e-switch-unselected-handle-color, ${DesignToken.color.outline})`),
  stateLayerSize: unsafeCSS("var(--m3e-switch-state-layer-size, 2.5rem)"),
  stateLayerShape: unsafeCSS(`var(--m3e-switch-state-layer-shape, ${DesignToken.shape.corner.full})`),
  disabledSelectedIconColor: unsafeCSS(
    `var(--m3e-switch-disabled-selected-icon-color, ${DesignToken.color.onSurface})`,
  ),
  disabledSelectedIconOpacity: unsafeCSS("var(--m3e-switch-disabled-selected-icon-opacity, 38%)"),
  disabledUnselectedIconColor: unsafeCSS(
    `var(--m3e-switch-disabled-unselected-icon-color, ${DesignToken.color.surfaceContainerHighest})`,
  ),
  disabledUnselectedIconOpacity: unsafeCSS("var(--m3e-switch-disabled-unselected-icon-opacity, 38%)"),
  disabledTrackOpacity: unsafeCSS("var(--m3e-switch-disabled-track-opacity, 12%)"),
  disabledSelectedTrackColor: unsafeCSS(
    `var(--m3e-switch-disabled-selected-track-color, ${DesignToken.color.onSurface})`,
  ),
  disabledUnselectedTrackColor: unsafeCSS(
    `var(--m3e-switch-disabled-unselected-track-color, ${DesignToken.color.surfaceContainerHighest})`,
  ),
  disabledUnselectedTrackOutlineColor: unsafeCSS(
    `var(--m3e-switch-disabled-unselected-track-outline-color, ${DesignToken.color.onSurface})`,
  ),
  disabledUnselectedHandleOpacity: unsafeCSS("var(--m3e-switch-disabled-unselected-handle-opacity, 38%)"),
  disabledSelectedHandleOpacity: unsafeCSS("var(--m3e-switch-disabled-selected-handle-opacity, 100%)"),
  disabledSelectedHandleColor: unsafeCSS(
    `var(--m3e-switch-disabled-selected-handle-color, ${DesignToken.color.surface})`,
  ),
  disabledUnselectedHandleColor: unsafeCSS(
    `var(--m3e-switch-disabled-unselected-handle-color, ${DesignToken.color.onSurface})`,
  ),
  selectedHoverIconColor: unsafeCSS(
    `var(--m3e-switch-selected-hover-icon-color, ${DesignToken.color.onPrimaryContainer})`,
  ),
  unselectedHoverIconColor: unsafeCSS(
    `var(--m3e-switch-unselected-hover-icon-color, ${DesignToken.color.surfaceContainerHighest})`,
  ),
  selectedHoverTrackColor: unsafeCSS(`var(--m3e-switch-selected-hover-track-color, ${DesignToken.color.primary})`),
  selectedHoverStateLayerColor: unsafeCSS(
    `var(--m3e-switch-selected-hover-state-layer-color, ${DesignToken.color.primary})`,
  ),
  selectedHoverStateLayerOpacity: unsafeCSS("var(--m3e-switch-selected-hover-state-layer-opacity, 8%)"),
  unselectedHoverTrackColor: unsafeCSS(
    `var(--m3e-switch-unselected-hover-track-color, ${DesignToken.color.surfaceContainerHighest})`,
  ),
  unselectedHoverTrackOutlineColor: unsafeCSS(
    `var(--m3e-switch-unselected-hover-track-outline-color, ${DesignToken.color.outline})`,
  ),
  unselectedHoverStateLayerColor: unsafeCSS(
    `var(--m3e-switch-unselected-hover-state-layer-color, ${DesignToken.color.onSurface})`,
  ),
  unselectedHoverStateLayerOpacity: unsafeCSS("var(--m3e-switch-unselected-hover-state-layer-opacity, 8%)"),
  selectedHoverHandleColor: unsafeCSS(
    `var(--m3e-switch-selected-hover-handle-color, ${DesignToken.color.surfaceContainerHighest})`,
  ),
  unselectedHoverHandleColor: unsafeCSS(
    `var(--m3e-switch-unselected-hover-handle-color, ${DesignToken.color.onSurfaceVariant})`,
  ),
  selectedFocusIconColor: unsafeCSS(
    `var(--m3e-switch-selected-focus-icon-color, ${DesignToken.color.onPrimaryContainer})`,
  ),
  unselectedFocusIconColor: unsafeCSS(
    `var(--m3e-switch-unselected-focus-icon-color, ${DesignToken.color.surfaceContainerHighest})`,
  ),
  selectedFocusTrackColor: unsafeCSS(`var(--m3e-switch-selected-focus-track-color, ${DesignToken.color.primary})`),
  selectedFocusStateLayerColor: unsafeCSS(
    `var(--m3e-switch-selected-focus-state-layer-color, ${DesignToken.color.primary})`,
  ),
  selectedFocusStateLayerOpacity: unsafeCSS("var(--m3e-switch-selected-focus-state-layer-opacity, 10%)"),
  unselectedFocusTrackColor: unsafeCSS(
    `var(--m3e-switch-unselected-focus-track-color, ${DesignToken.color.surfaceContainerHighest})`,
  ),
  unselectedFocusTrackOutlineColor: unsafeCSS(
    `var(--m3e-switch-unselected-focus-track-outline-color, ${DesignToken.color.outline})`,
  ),
  unselectedFocusStateLayerColor: unsafeCSS(
    `var(--m3e-switch-unselected-focus-state-layer-color, ${DesignToken.color.onSurface})`,
  ),
  unselectedFocusStateLayerOpacity: unsafeCSS("var(--m3e-switch-unselected-focus-state-layer-opacity, 10%)"),
  selectedFocusHandleColor: unsafeCSS(
    `var(--m3e-switch-selected-focus-handle-color, ${DesignToken.color.primaryContainer})`,
  ),
  unselectedFocusHandleColor: unsafeCSS(
    `var(--m3e-switch-unselected-focus-handle-color, ${DesignToken.color.onSurfaceVariant})`,
  ),
  selectedPressedIconColor: unsafeCSS(
    `var(--m3e-switch-selected-pressed-icon-color, ${DesignToken.color.onPrimaryContainer})`,
  ),
  unselectedPressedIconColor: unsafeCSS(
    `var(--m3e-switch-unselected-pressed-icon-color, ${DesignToken.color.surfaceContainerHighest})`,
  ),
  selectedPressedTrackColor: unsafeCSS(`var(--m3e-switch-selected-pressed-track-color, ${DesignToken.color.primary})`),
  selectedPressedStateLayerColor: unsafeCSS(
    `var(--m3e-switch-selected-pressed-state-layer-color, ${DesignToken.color.primary})`,
  ),
  selectedPressedStateLayerOpacity: unsafeCSS("var(--m3e-switch-selected-pressed-state-layer-opacity, 10%)"),
  unselectedPressedTrackColor: unsafeCSS(
    `var(--m3e-switch-unselected-pressed-track-color, ${DesignToken.color.surfaceContainerHighest})`,
  ),
  unselectedPressedTrackOutlineColor: unsafeCSS(
    `var(--m3e-switch-unselected-pressed-track-outline-color, ${DesignToken.color.outline})`,
  ),
  unselectedPressedStateLayerColor: unsafeCSS(
    `var(--m3e-switch-unselected-pressed-state-layer-color, ${DesignToken.color.onSurface})`,
  ),
  unselectedPressedStateLayerOpacity: unsafeCSS("var(--m3e-switch-unselected-pressed-state-layer-opacity, 10%)"),
  selectedPressedHandleColor: unsafeCSS(
    `var(--m3e-switch-selected-pressed-handle-color, ${DesignToken.color.primaryContainer})`,
  ),
  unselectedPressedHandleColor: unsafeCSS(
    `var(--m3e-switch-unselected-pressed-handle-color, ${DesignToken.color.onSurfaceVariant})`,
  ),
} as const;
