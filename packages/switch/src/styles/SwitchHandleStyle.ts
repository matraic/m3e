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
      height ${DesignToken.motion.spring.fastEffects}`,
    )};
  }
  .track:not(.pressed) .handle {
    --_switch-handle-effect: ${DesignToken.motion.spring.fastSpatial};
  }
  .track.pressed .handle {
    --_switch-handle-effect: ${DesignToken.motion.spring.fastEffects};
  }
  :host(:not([aria-disabled="true"]):not([checked])[icons="both"]) .track:not(.pressed) .handle {
    width: ${SwitchToken.withIconHandleWidth};
    height: ${SwitchToken.withIconHandleHeight};
  }
  :host(:not([checked]):not([icons="both"])) .track:not(.pressed) .handle,
  :host([aria-disabled="true"]:not([checked])) .handle {
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
  :host(:not([aria-disabled="true"]):not([checked]):not(:focus):not(:hover)) .track:not(.pressed) .handle {
    background-color: ${SwitchToken.unselectedHandleColor};
  }
  :host(:not([aria-disabled="true"]):not([checked]):not(:focus):hover) .track:not(.pressed) .handle {
    background-color: ${SwitchToken.unselectedHoverHandleColor};
  }
  :host(:not([aria-disabled="true"]):not([checked]):focus) .track:not(.pressed) .handle {
    background-color: ${SwitchToken.unselectedFocusHandleColor};
  }
  :host(:not([aria-disabled="true"]):not([checked])) .track.pressed .handle {
    background-color: ${SwitchToken.unselectedPressedHandleColor};
  }
  :host(:not([aria-disabled="true"])[checked]:not(:focus):not(:hover)) .track:not(.pressed) .handle {
    background-color: ${SwitchToken.selectedHandleColor};
  }
  :host(:not([aria-disabled="true"])[checked]:not(:focus):hover) .track:not(.pressed) .handle {
    background-color: ${SwitchToken.selectedHoverHandleColor};
  }
  :host(:not([aria-disabled="true"])[checked]:focus) .track:not(.pressed) .handle {
    background-color: ${SwitchToken.selectedFocusHandleColor};
  }
  :host(:not([aria-disabled="true"])[checked]) .track.pressed .handle {
    background-color: ${SwitchToken.selectedPressedHandleColor};
  }
  :host([aria-disabled="true"]:not([checked])) .handle {
    background-color: color-mix(
      in srgb,
      ${SwitchToken.disabledUnselectedHandleColor} ${SwitchToken.disabledUnselectedHandleOpacity},
      transparent
    );
  }
  :host([aria-disabled="true"][checked]) .handle {
    background-color: color-mix(
      in srgb,
      ${SwitchToken.disabledSelectedHandleColor} ${SwitchToken.disabledSelectedHandleOpacity},
      transparent
    );
  }
  :host(:not(:dir(rtl))[checked]) .track:not(.pressed) .handle {
    transform: translateX(
      calc(${SwitchToken.trackWidth} - ${SwitchToken.selectedHandleWidth} - calc(${SwitchToken.trackOutlineWidth} * 2))
    );
  }
  :host(:dir(rtl)[checked]) .track:not(.pressed) .handle {
    transform: translateX(
      calc(
        0px - calc(
            ${SwitchToken.trackWidth} - ${SwitchToken.selectedHandleWidth} - calc(${SwitchToken.trackOutlineWidth} * 2)
          )
      )
    );
  }
  :host(:not(:dir(rtl))[checked]) .track.pressed .handle {
    transform: translateX(
      calc(${SwitchToken.trackWidth} - ${SwitchToken.pressedHandleWidth} - ${SwitchToken.trackOutlineWidth})
    );
  }
  :host(:dir(rtl)[checked]) .track.pressed .handle {
    transform: translateX(
      calc(0px - calc(${SwitchToken.trackWidth} - ${SwitchToken.pressedHandleWidth} - ${SwitchToken.trackOutlineWidth}))
    );
  }
  :host(:not(:dir(rtl)):not([checked]):not([icons="both"])) .track:not(.pressed) .handle,
  :host(:not(:dir(rtl))[aria-disabled="true"]:not([checked])) .handle {
    transform: translateX(
      calc(
        ${SwitchToken.trackOutlineWidth} + calc(${SwitchToken.pressedHandleWidth} - ${SwitchToken.withIconHandleWidth})
      )
    );
  }
  :host(:dir(rtl):not([checked]):not([icons="both"])) .track:not(.pressed) .handle,
  :host(:dir(rtl)[aria-disabled="true"]:not([checked])) .handle {
    transform: translateX(
      calc(
        0px - calc(
            ${SwitchToken.trackOutlineWidth} +
              calc(${SwitchToken.pressedHandleWidth} - ${SwitchToken.withIconHandleWidth})
          )
      )
    );
  }
  :host(:not(:dir(rtl)):not([aria-disabled="true"]):not([checked])[icons="both"]) .track:not(.pressed) .handle {
    transform: translateX(${SwitchToken.trackOutlineWidth});
  }
  :host(:dir(rtl):not([aria-disabled="true"]):not([checked])[icons="both"]) .track:not(.pressed) .handle {
    transform: translateX(calc(0px - ${SwitchToken.trackOutlineWidth}));
  }
  @media (forced-colors: active) {
    .handle {
      transition: ${unsafeCSS(
        `transform var(--_switch-handle-effect),
      width ${DesignToken.motion.spring.fastEffects},
      height ${DesignToken.motion.spring.fastEffects}`,
      )};
    }
    :host(:not([aria-disabled="true"]):not([checked]):not(:focus):not(:hover)) .track:not(.pressed) .handle,
    :host(:not([aria-disabled="true"]):not([checked]):not(:focus):hover) .track:not(.pressed) .handle,
    :host(:not([aria-disabled="true"]):not([checked]):focus) .track:not(.pressed) .handle,
    :host(:not([aria-disabled="true"]):not([checked])) .track.pressed .handle {
      background-color: ButtonText;
    }
    :host([aria-disabled="true"]:not([checked])) .handle {
      background-color: GrayText;
    }
    :host(:not([aria-disabled="true"])[checked]:not(:focus):not(:hover)) .track:not(.pressed) .handle,
    :host(:not([aria-disabled="true"])[checked]:not(:focus):hover) .track:not(.pressed) .handle,
    :host(:not([aria-disabled="true"])[checked]:focus) .track:not(.pressed) .handle,
    :host(:not([aria-disabled="true"])[checked]) .track.pressed .handle {
      background-color: Canvas;
    }
    :host([aria-disabled="true"][checked]) .handle {
      background-color: Canvas;
    }
  }
  @media (prefers-reduced-motion) {
    .handle {
      transition: none;
    }
  }
`;
