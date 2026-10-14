import { css, unsafeCSS } from "lit";
import { DesignToken } from "@m3e/web/core";

import { SwitchToken } from "./SwitchToken";

/**
 * Handle styles for `M3eSwitchElement`.
 * @internal
 */
export const SwitchHandleStyle = css`
  .handle {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    --_switch-handle-inline-start: 0px;
    --_switch-handle-inline-end: 0px;
    --_switch-handle-height: ${SwitchToken.selectedHandleHeight};
    --_switch-handle-clip-left: var(--_switch-handle-inline-start);
    --_switch-handle-clip-right: var(--_switch-handle-inline-end);
  }
  :host(:is(:state(--rtl), :--rtl)) .handle {
    --_switch-handle-clip-left: var(--_switch-handle-inline-end);
    --_switch-handle-clip-right: var(--_switch-handle-inline-start);
  }
  .handle::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    width: calc(100% - var(--_switch-handle-clip-left) - var(--_switch-handle-clip-right));
    height: var(--_switch-handle-height);
    transform: translateX(var(--_switch-handle-clip-left)) translateY(-50%);
    border-radius: ${SwitchToken.handleShape};
    transition: ${unsafeCSS(
      `background-color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard},
      transform var(--_switch-handle-position-effect),
      width var(--_switch-handle-position-effect),
      height ${DesignToken.motion.spring.fastEffects}`,
    )};
  }
  :host(:not([checked])) .track:not(.pressed) .handle,
  :host([checked]) .track:not(.pressed) .handle {
    --_switch-handle-position-effect: ${DesignToken.motion.spring.fastSpatial};
  }
  .track.pressed .handle {
    --_switch-handle-position-effect: ${DesignToken.motion.spring.fastEffects};
  }
  .handle .base {
    transform: translateX(calc((var(--_switch-handle-clip-left) - var(--_switch-handle-clip-right)) / 2));
    transition: transform var(--_switch-handle-position-effect);
  }
  :host(:not([aria-disabled="true"]):not([checked]):is(:state(--icons-both), :--icons-both))
    .track:not(.pressed)
    .handle {
    --_switch-handle-inline-start: ${SwitchToken.trackOutlineWidth};
    --_switch-handle-inline-end: calc(
      ${SwitchToken.trackWidth} - calc(${SwitchToken.trackOutlineWidth} * 3) - ${SwitchToken.withIconHandleWidth}
    );
    --_switch-handle-height: ${SwitchToken.withIconHandleHeight};
  }
  :host(:not([checked]):not(:is(:state(--icons-both), :--icons-both))) .track:not(.pressed) .handle,
  :host([aria-disabled="true"]:not([checked])) .handle {
    --_switch-handle-inline-start: calc(
      ${SwitchToken.trackOutlineWidth} + ${SwitchToken.pressedHandleWidth} - ${SwitchToken.withIconHandleWidth}
    );
    --_switch-handle-inline-end: calc(
      ${SwitchToken.trackWidth} - calc(${SwitchToken.trackOutlineWidth} * 2) - ${SwitchToken.unselectedHandleWidth} -
        ${SwitchToken.trackOutlineWidth} - ${SwitchToken.pressedHandleWidth} + ${SwitchToken.withIconHandleWidth}
    );
    --_switch-handle-height: ${SwitchToken.unselectedHandleHeight};
  }
  :host([checked]) .track:not(.pressed) .handle {
    --_switch-handle-inline-start: calc(
      ${SwitchToken.trackWidth} - ${SwitchToken.selectedHandleWidth} - calc(${SwitchToken.trackOutlineWidth} * 3)
    );
    --_switch-handle-inline-end: ${SwitchToken.trackOutlineWidth};
    --_switch-handle-height: ${SwitchToken.selectedHandleHeight};
  }
  :host(:not([checked])) .track.pressed .handle {
    --_switch-handle-inline-start: 0px;
    --_switch-handle-inline-end: calc(
      ${SwitchToken.trackWidth} - calc(${SwitchToken.trackOutlineWidth} * 2) - ${SwitchToken.pressedHandleWidth}
    );
    --_switch-handle-height: ${SwitchToken.pressedHandleHeight};
  }
  :host([checked]) .track.pressed .handle {
    --_switch-handle-inline-start: calc(
      ${SwitchToken.trackWidth} - ${SwitchToken.pressedHandleWidth} - calc(${SwitchToken.trackOutlineWidth} * 2)
    );
    --_switch-handle-inline-end: 0px;
    --_switch-handle-height: ${SwitchToken.pressedHandleHeight};
  }
  :host(:not([aria-disabled="true"]):not([checked]):not(:focus):not(:hover)) .track:not(.pressed) .handle::before {
    background-color: ${SwitchToken.unselectedHandleColor};
  }
  :host(:not([aria-disabled="true"]):not([checked]):not(:focus):hover) .track:not(.pressed) .handle::before {
    background-color: ${SwitchToken.unselectedHoverHandleColor};
  }
  :host(:not([aria-disabled="true"]):not([checked]):focus) .track:not(.pressed) .handle::before {
    background-color: ${SwitchToken.unselectedFocusHandleColor};
  }
  :host(:not([aria-disabled="true"]):not([checked])) .track.pressed .handle::before {
    background-color: ${SwitchToken.unselectedPressedHandleColor};
  }
  :host(:not([aria-disabled="true"])[checked]:not(:focus):not(:hover)) .track:not(.pressed) .handle::before {
    background-color: ${SwitchToken.selectedHandleColor};
  }
  :host(:not([aria-disabled="true"])[checked]:not(:focus):hover) .track:not(.pressed) .handle::before {
    background-color: ${SwitchToken.selectedHoverHandleColor};
  }
  :host(:not([aria-disabled="true"])[checked]:focus) .track:not(.pressed) .handle::before {
    background-color: ${SwitchToken.selectedFocusHandleColor};
  }
  :host(:not([aria-disabled="true"])[checked]) .track.pressed .handle::before {
    background-color: ${SwitchToken.selectedPressedHandleColor};
  }
  :host([aria-disabled="true"]:not([checked])) .handle::before {
    background-color: color-mix(
      in srgb,
      ${SwitchToken.disabledUnselectedHandleColor} ${SwitchToken.disabledUnselectedHandleOpacity},
      transparent
    );
  }
  :host([aria-disabled="true"][checked]) .handle::before {
    background-color: color-mix(
      in srgb,
      ${SwitchToken.disabledSelectedHandleColor} ${SwitchToken.disabledSelectedHandleOpacity},
      transparent
    );
  }
  @media (forced-colors: active) {
    .handle::before {
      transition: ${unsafeCSS(
        `transform var(--_switch-handle-position-effect),
      width var(--_switch-handle-position-effect),
      height ${DesignToken.motion.spring.fastEffects}`,
      )};
    }
    :host(:not([aria-disabled="true"]):not([checked]):not(:focus):not(:hover)) .track:not(.pressed) .handle::before,
    :host(:not([aria-disabled="true"]):not([checked]):not(:focus):hover) .track:not(.pressed) .handle::before,
    :host(:not([aria-disabled="true"]):not([checked]):focus) .track:not(.pressed) .handle::before,
    :host(:not([aria-disabled="true"]):not([checked])) .track.pressed .handle::before {
      background-color: ButtonText;
    }
    :host([aria-disabled="true"]:not([checked])) .handle::before {
      background-color: GrayText;
    }
    :host(:not([aria-disabled="true"])[checked]:not(:focus):not(:hover)) .track:not(.pressed) .handle::before,
    :host(:not([aria-disabled="true"])[checked]:not(:focus):hover) .track:not(.pressed) .handle::before,
    :host(:not([aria-disabled="true"])[checked]:focus) .track:not(.pressed) .handle::before,
    :host(:not([aria-disabled="true"])[checked]) .track.pressed .handle::before {
      background-color: Canvas;
    }
    :host([aria-disabled="true"][checked]) .handle::before {
      background-color: Canvas;
    }
  }
  @media (prefers-reduced-motion) {
    .handle::before,
    .handle .base,
    .handle .state-layer {
      transition: none;
    }
  }
`;
