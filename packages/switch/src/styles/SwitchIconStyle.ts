import { css, unsafeCSS } from "lit";
import { DesignToken } from "@m3e/core";

import { SwitchToken } from "./SwitchToken";

/**
 * Icon styles for `M3eSwitchElement`.
 * @internal
 */
export const SwitchIconStyle = css`
  :host([icons="none"]) .icon,
  :host([icons="selected"]:not([checked])) .icon,
  :host(:disabled:not([checked])) .icon {
    display: none;
  }
  .icon {
    width: 1em;
    transition: ${unsafeCSS(`color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard}`)};
  }
  :host(:not([checked])) .icon {
    font-size: ${SwitchToken.unselectedIconSize};
  }
  :host([checked]) .icon {
    font-size: ${SwitchToken.selectedIconSize};
  }
  :host(:not(:disabled):not([checked]):not(:focus):not(:hover)) .track:not(.pressed) .icon {
    color: ${SwitchToken.unselectedIconColor};
  }
  :host(:not(:disabled):not([checked]):not(:focus):hover) .track:not(.pressed) .icon {
    color: ${SwitchToken.unselectedHoverIconColor};
  }
  :host(:not(:disabled):not([checked]):focus) .track:not(.pressed) .icon {
    color: ${SwitchToken.unselectedFocusIconColor};
  }
  :host(:not(:disabled):not([checked])) .track.pressed .icon {
    color: ${SwitchToken.unselectedPressedIconColor};
  }
  :host(:not(:disabled)[checked]:not(:focus):not(:hover)) .track:not(.pressed) .icon {
    color: ${SwitchToken.selectedIconColor};
  }
  :host(:not(:disabled)[checked]:not(:focus):hover) .track:not(.pressed) .icon {
    color: ${SwitchToken.selectedHoverIconColor};
  }
  :host(:not(:disabled)[checked]:focus) .track:not(.pressed) .icon {
    color: ${SwitchToken.selectedFocusIconColor};
  }
  :host(:not(:disabled)[checked]) .track.pressed .icon {
    color: ${SwitchToken.selectedPressedIconColor};
  }
  :host(:disabled:not([checked])) .icon {
    color: color-mix(
      in srgb,
      ${SwitchToken.disabledUnselectedIconColor} ${SwitchToken.disabledUnselectedIconOpacity},
      transparent
    );
  }
  :host(:disabled[checked]) .icon {
    color: color-mix(
      in srgb,
      ${SwitchToken.disabledSelectedIconColor} ${SwitchToken.disabledSelectedIconOpacity},
      transparent
    );
  }
  @media (forced-colors: active) {
    :host(:not(:disabled):not([checked]):not(:focus):not(:hover)) .track:not(.pressed) .icon,
    :host(:not(:disabled):not([checked]):not(:focus):hover) .track:not(.pressed) .icon,
    :host(:not(:disabled):not([checked]):focus) .track:not(.pressed) .icon,
    :host(:not(:disabled):not([checked])) .track.pressed .icon {
      color: Canvas;
    }
    :host(:not(:disabled)[checked]:not(:focus):not(:hover)) .track:not(.pressed) .icon,
    :host(:not(:disabled)[checked]:not(:focus):hover) .track:not(.pressed) .icon,
    :host(:not(:disabled)[checked]:focus) .track:not(.pressed) .icon,
    :host(:not(:disabled)[checked]) .track.pressed .icon {
      color: CanvasText;
    }
    :host(:disabled:not([checked])) .icon {
      color: Canvas;
    }
    :host(:disabled[checked]) .icon {
      color: GrayText;
    }
  }
  @media (prefers-reduced-motion) {
    .icon {
      transition: none;
    }
  }
`;
