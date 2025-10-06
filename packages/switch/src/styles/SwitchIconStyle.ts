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
  :host([aria-disabled="true"]:not([checked])) .icon {
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
  :host(:not([aria-disabled="true"]):not([checked]):not(:focus):not(:hover)) .track:not(.pressed) .icon {
    color: ${SwitchToken.unselectedIconColor};
  }
  :host(:not([aria-disabled="true"]):not([checked]):not(:focus):hover) .track:not(.pressed) .icon {
    color: ${SwitchToken.unselectedHoverIconColor};
  }
  :host(:not([aria-disabled="true"]):not([checked]):focus) .track:not(.pressed) .icon {
    color: ${SwitchToken.unselectedFocusIconColor};
  }
  :host(:not([aria-disabled="true"]):not([checked])) .track.pressed .icon {
    color: ${SwitchToken.unselectedPressedIconColor};
  }
  :host(:not([aria-disabled="true"])[checked]:not(:focus):not(:hover)) .track:not(.pressed) .icon {
    color: ${SwitchToken.selectedIconColor};
  }
  :host(:not([aria-disabled="true"])[checked]:not(:focus):hover) .track:not(.pressed) .icon {
    color: ${SwitchToken.selectedHoverIconColor};
  }
  :host(:not([aria-disabled="true"])[checked]:focus) .track:not(.pressed) .icon {
    color: ${SwitchToken.selectedFocusIconColor};
  }
  :host(:not([aria-disabled="true"])[checked]) .track.pressed .icon {
    color: ${SwitchToken.selectedPressedIconColor};
  }
  :host([aria-disabled="true"]:not([checked])) .icon {
    color: color-mix(
      in srgb,
      ${SwitchToken.disabledUnselectedIconColor} ${SwitchToken.disabledUnselectedIconOpacity},
      transparent
    );
  }
  :host([aria-disabled="true"][checked]) .icon {
    color: color-mix(
      in srgb,
      ${SwitchToken.disabledSelectedIconColor} ${SwitchToken.disabledSelectedIconOpacity},
      transparent
    );
  }
  @media (forced-colors: active) {
    :host(:not([aria-disabled="true"]):not([checked]):not(:focus):not(:hover)) .track:not(.pressed) .icon,
    :host(:not([aria-disabled="true"]):not([checked]):not(:focus):hover) .track:not(.pressed) .icon,
    :host(:not([aria-disabled="true"]):not([checked]):focus) .track:not(.pressed) .icon,
    :host(:not([aria-disabled="true"]):not([checked])) .track.pressed .icon {
      color: Canvas;
    }
    :host(:not([aria-disabled="true"])[checked]:not(:focus):not(:hover)) .track:not(.pressed) .icon,
    :host(:not([aria-disabled="true"])[checked]:not(:focus):hover) .track:not(.pressed) .icon,
    :host(:not([aria-disabled="true"])[checked]:focus) .track:not(.pressed) .icon,
    :host(:not([aria-disabled="true"])[checked]) .track.pressed .icon {
      color: CanvasText;
    }
    :host([aria-disabled="true"]:not([checked])) .icon {
      color: Canvas;
    }
    :host([aria-disabled="true"][checked]) .icon {
      color: GrayText;
    }
  }
  @media (prefers-reduced-motion) {
    .icon {
      transition: none;
    }
  }
`;
