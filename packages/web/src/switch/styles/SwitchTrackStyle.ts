import { css, unsafeCSS } from "lit";
import { DesignToken } from "@m3e/web/core";

import { SwitchToken } from "./SwitchToken";

/**
 * Track styles for `M3eSwitchElement`.
 * @internal
 */
export const SwitchTrackStyle = css`
  .track {
    display: flex;
    align-items: center;
    position: relative;
    box-sizing: border-box;
    border-radius: ${SwitchToken.trackShape};
    width: ${SwitchToken.trackWidth};
    height: ${SwitchToken.trackHeight};
    transition: ${unsafeCSS(
      `background-color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard}`,
    )};
  }
  :host(:not([checked])) .track {
    border-width: ${SwitchToken.trackOutlineWidth};
    border-style: solid;
  }
  :host(:not([aria-disabled="true"]):not([checked]):not(:focus):not(:hover)) .track:not(.pressed) {
    border-color: ${SwitchToken.trackOutlineColor};
    background-color: ${SwitchToken.unselectedTrackColor};
  }
  :host(:not([aria-disabled="true"]):not([checked]):not(:focus):hover) .track:not(.pressed) {
    border-color: ${SwitchToken.unselectedHoverTrackOutlineColor};
    background-color: ${SwitchToken.unselectedHoverTrackColor};
  }
  :host(:not([aria-disabled="true"]):not([checked]):focus) .track:not(.pressed) {
    border-color: ${SwitchToken.unselectedFocusTrackOutlineColor};
    background-color: ${SwitchToken.unselectedFocusTrackColor};
  }
  :host(:not([aria-disabled="true"]):not([checked])) .track.pressed {
    border-color: ${SwitchToken.unselectedPressedTrackOutlineColor};
    background-color: ${SwitchToken.unselectedPressedTrackColor};
  }
  :host([aria-disabled="true"]:not([checked])) .track {
    border-color: color-mix(
      in srgb,
      ${SwitchToken.disabledUnselectedTrackOutlineColor} ${SwitchToken.disabledTrackOpacity},
      transparent
    );
    background-color: color-mix(
      in srgb,
      ${SwitchToken.disabledUnselectedTrackColor} ${SwitchToken.disabledTrackOpacity},
      transparent
    );
  }
  :host(:not([aria-disabled="true"])[checked]:not(:focus):not(:hover)) .track:not(.pressed) {
    background-color: ${SwitchToken.selectedTrackColor};
  }
  :host(:not([aria-disabled="true"])[checked]:not(:focus):hover) .track:not(.pressed) {
    background-color: ${SwitchToken.selectedHoverTrackColor};
  }
  :host(:not([aria-disabled="true"])[checked]:focus) .track:not(.pressed) {
    background-color: ${SwitchToken.selectedFocusTrackColor};
  }
  :host(:not([aria-disabled="true"])[checked]) .track.pressed {
    background-color: ${SwitchToken.selectedPressedTrackColor};
  }
  :host([aria-disabled="true"][checked]) .track {
    background-color: color-mix(
      in srgb,
      ${SwitchToken.disabledSelectedTrackColor} ${SwitchToken.disabledTrackOpacity},
      transparent
    );
  }
  @media (forced-colors: active) {
    .track {
      transition: none;
    }
    :host(:not([aria-disabled="true"]):not([checked]):not(:focus):not(:hover)) .track:not(.pressed),
    :host(:not([aria-disabled="true"]):not([checked]):not(:focus):hover) .track:not(.pressed),
    :host(:not([aria-disabled="true"]):not([checked]):focus) .track:not(.pressed),
    :host(:not([aria-disabled="true"]):not([checked])) .track.pressed {
      border-color: ButtonText;
      background-color: Canvas;
    }
    :host([aria-disabled="true"]:not([checked])) .track {
      border-color: GrayText;
      background-color: Canvas;
    }
    :host(:not([aria-disabled="true"])[checked]:not(:focus):not(:hover)) .track:not(.pressed),
    :host(:not([aria-disabled="true"])[checked]:not(:focus):hover) .track:not(.pressed),
    :host(:not([aria-disabled="true"])[checked]:focus) .track:not(.pressed),
    :host(:not([aria-disabled="true"])[checked]) .track.pressed {
      background-color: ButtonText;
    }
    :host([aria-disabled="true"][checked]) .track {
      background-color: GrayText;
    }
  }
  @media (prefers-reduced-motion) {
    .track {
      transition: none;
    }
  }
`;
