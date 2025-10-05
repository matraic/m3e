import { css, unsafeCSS } from "lit";
import { DesignToken } from "@m3e/core";

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
      `background-color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard}`
    )};
  }
  :host(:not([checked])) .track {
    border-width: ${SwitchToken.trackOutlineWidth};
    border-style: solid;
  }
  :host(:not(:disabled):not([checked]):not(:focus):not(:hover)) .track:not(.pressed) {
    border-color: ${SwitchToken.trackOutlineColor};
    background-color: ${SwitchToken.unselectedTrackColor};
  }
  :host(:not(:disabled):not([checked]):not(:focus):hover) .track:not(.pressed) {
    border-color: ${SwitchToken.unselectedHoverTrackOutlineColor};
    background-color: ${SwitchToken.unselectedHoverTrackColor};
  }
  :host(:not(:disabled):not([checked]):focus) .track:not(.pressed) {
    border-color: ${SwitchToken.unselectedFocusTrackOutlineColor};
    background-color: ${SwitchToken.unselectedFocusTrackColor};
  }
  :host(:not(:disabled):not([checked])) .track.pressed {
    border-color: ${SwitchToken.unselectedPressedTrackOutlineColor};
    background-color: ${SwitchToken.unselectedPressedTrackColor};
  }
  :host(:disabled:not([checked])) .track {
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
  :host(:not(:disabled)[checked]:not(:focus):not(:hover)) .track:not(.pressed) {
    background-color: ${SwitchToken.selectedTrackColor};
  }
  :host(:not(:disabled)[checked]:not(:focus):hover) .track:not(.pressed) {
    background-color: ${SwitchToken.selectedHoverTrackColor};
  }
  :host(:not(:disabled)[checked]:focus) .track:not(.pressed) {
    background-color: ${SwitchToken.selectedFocusTrackColor};
  }
  :host(:not(:disabled)[checked]) .track.pressed {
    background-color: ${SwitchToken.selectedPressedTrackColor};
  }
  :host(:disabled[checked]) .track {
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
    :host(:not(:disabled):not([checked]):not(:focus):not(:hover)) .track:not(.pressed),
    :host(:not(:disabled):not([checked]):not(:focus):hover) .track:not(.pressed),
    :host(:not(:disabled):not([checked]):focus) .track:not(.pressed),
    :host(:not(:disabled):not([checked])) .track.pressed {
      border-color: ButtonText;
      background-color: Canvas;
    }
    :host(:disabled:not([checked])) .track {
      border-color: GrayText;
      background-color: Canvas;
    }
    :host(:not(:disabled)[checked]:not(:focus):not(:hover)) .track:not(.pressed),
    :host(:not(:disabled)[checked]:not(:focus):hover) .track:not(.pressed),
    :host(:not(:disabled)[checked]:focus) .track:not(.pressed),
    :host(:not(:disabled)[checked]) .track.pressed {
      background-color: ButtonText;
    }
    :host(:disabled[checked]) .track {
      background-color: GrayText;
    }
  }
  @media (prefers-reduced-motion) {
    .track {
      transition: none;
    }
  }
`;
