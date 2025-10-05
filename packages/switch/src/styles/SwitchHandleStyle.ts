import { css, unsafeCSS } from "lit";
import { DesignToken } from "@m3e/core";

import { SwitchToken } from "./SwitchToken";

/**
 * Handle styles for `M3eSwitchElement`.
 * @internal
 */
export const SwitchHandleStyle = css`
  .handle {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    transform-origin: center center;
    border-radius: ${SwitchToken.handleShape};
    transition: ${unsafeCSS(
      `background-color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard},
      transform var(--_switch-handle-effect),
      width ${DesignToken.motion.spring.fastEffects},
      height ${DesignToken.motion.spring.fastEffects}`
    )};
  }
  .track:not(.pressed) .handle {
    --_switch-handle-effect: ${DesignToken.motion.spring.fastSpatial};
  }
  .track.pressed .handle {
    --_switch-handle-effect: ${DesignToken.motion.spring.fastEffects};
  }
  :host(:not(:disabled):not([checked])[icons="both"]) .track:not(.pressed) .handle {
    width: ${SwitchToken.withIconHandleWidth};
    height: ${SwitchToken.withIconHandleHeight};
  }
  :host(:not([checked]):not([icons="both"])) .track:not(.pressed) .handle,
  :host(:disabled:not([checked])) .handle {
    width: ${SwitchToken.unselectedHandleWidth};
    height: ${SwitchToken.unselectedHandleHeight};
  }
  :host([checked]) .track:not(.pressed) .handle {
    width: ${SwitchToken.selectedHandleWidth};
    height: ${SwitchToken.selectedHandleHeight};
  }
  .track.pressed .handle {
    width: ${SwitchToken.pressedHandleWidth};
    height: ${SwitchToken.pressedHandleHeight};
  }
  :host(:not(:disabled):not([checked]):not(:focus):not(:hover)) .track:not(.pressed) .handle {
    background-color: ${SwitchToken.unselectedHandleColor};
  }
  :host(:not(:disabled):not([checked]):not(:focus):hover) .track:not(.pressed) .handle {
    background-color: ${SwitchToken.unselectedHoverHandleColor};
  }
  :host(:not(:disabled):not([checked]):focus) .track:not(.pressed) .handle {
    background-color: ${SwitchToken.unselectedFocusHandleColor};
  }
  :host(:not(:disabled):not([checked])) .track.pressed .handle {
    background-color: ${SwitchToken.unselectedPressedHandleColor};
  }
  :host(:not(:disabled)[checked]:not(:focus):not(:hover)) .track:not(.pressed) .handle {
    background-color: ${SwitchToken.selectedHandleColor};
  }
  :host(:not(:disabled)[checked]:not(:focus):hover) .track:not(.pressed) .handle {
    background-color: ${SwitchToken.selectedHoverHandleColor};
  }
  :host(:not(:disabled)[checked]:focus) .track:not(.pressed) .handle {
    background-color: ${SwitchToken.selectedFocusHandleColor};
  }
  :host(:not(:disabled)[checked]) .track.pressed .handle {
    background-color: ${SwitchToken.selectedPressedHandleColor};
  }
  :host(:disabled:not([checked])) .handle {
    background-color: color-mix(
      in srgb,
      ${SwitchToken.disabledUnselectedHandleColor} ${SwitchToken.disabledUnselectedHandleOpacity},
      transparent
    );
  }
  :host(:disabled[checked]) .handle {
    background-color: color-mix(
      in srgb,
      ${SwitchToken.disabledSelectedHandleColor} ${SwitchToken.disabledSelectedHandleOpacity},
      transparent
    );
  }
  :host([checked]) .track:not(.pressed) .handle {
    transform: translateX(
      calc(${SwitchToken.trackWidth} - ${SwitchToken.selectedHandleWidth} - ${SwitchToken.trackOutlineWidth})
    );
  }
  :host([checked]) .track.pressed .handle {
    transform: translateX(
      calc(${SwitchToken.trackWidth} - ${SwitchToken.pressedHandleWidth} - ${SwitchToken.trackOutlineWidth})
    );
  }
  :host(:not([checked]):not([icons="both"])) .track:not(.pressed) .handle,
  :host(:disabled:not([checked])) .handle {
    transform: translateX(
      calc(
        ${SwitchToken.trackOutlineWidth} + calc(${SwitchToken.pressedHandleWidth} - ${SwitchToken.withIconHandleWidth})
      )
    );
  }
  :host(:not(:disabled):not([checked])[icons="both"]) .track:not(.pressed) .handle {
    transform: translateX(${SwitchToken.trackOutlineWidth});
  }
  @media (forced-colors: active) {
    .handle {
      transition: ${unsafeCSS(
        `transform var(--_switch-handle-effect),
      width ${DesignToken.motion.spring.fastEffects},
      height ${DesignToken.motion.spring.fastEffects}`
      )};
    }
    :host(:not(:disabled):not([checked]):not(:focus):not(:hover)) .track:not(.pressed) .handle,
    :host(:not(:disabled):not([checked]):not(:focus):hover) .track:not(.pressed) .handle,
    :host(:not(:disabled):not([checked]):focus) .track:not(.pressed) .handle,
    :host(:not(:disabled):not([checked])) .track.pressed .handle {
      background-color: ButtonText;
    }
    :host(:disabled:not([checked])) .handle {
      background-color: GrayText;
    }
    :host(:not(:disabled)[checked]:not(:focus):not(:hover)) .track:not(.pressed) .handle,
    :host(:not(:disabled)[checked]:not(:focus):hover) .track:not(.pressed) .handle,
    :host(:not(:disabled)[checked]:focus) .track:not(.pressed) .handle,
    :host(:not(:disabled)[checked]) .track.pressed .handle {
      background-color: Canvas;
    }
    :host(:disabled[checked]) .handle {
      background-color: Canvas;
    }
  }
  @media (prefers-reduced-motion) {
    .handle {
      transition: none;
    }
  }
`;
