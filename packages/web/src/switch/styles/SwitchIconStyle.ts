import { css, unsafeCSS } from "lit";
import { DesignToken } from "@pulse/web/core";

import { SwitchToken } from "./SwitchToken";

/**
 * Icon styles for `M3eSwitchElement`.
 * @internal
 */
export const SwitchIconStyle = css`
  :host(:is(:state(--icons-none), :--icons-none)) .icon,
  :host(:is(:state(--icons-selected), :--icons-selected):not([checked])) .icon.selected,
  :host(:is(:state(--icons-selected), :--icons-selected)) .icon.unselected,
  :host([aria-disabled="true"]:not([checked])) .icon {
    display: none;
  }
  .icon {
    width: 1em;
    transition: ${unsafeCSS(`color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard}`)};
  }
  :host(:is(:state(--icons-both), :--icons-both)) .icon {
    opacity: 0;
    transition:
      color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard},
      opacity 0s;
  }
  :host(:is(:state(--icons-both), :--icons-both):not([checked])) .icon.unselected,
  :host(:is(:state(--icons-both), :--icons-both)[checked]) .icon.selected {
    opacity: 1;
    transition: ${unsafeCSS(
      `color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard},
      opacity ${DesignToken.motion.duration.short2} ${DesignToken.motion.easing.standard}`,
    )};
  }
  .icon.unselected {
    font-size: ${SwitchToken.unselectedIconSize};
  }
  .icon.selected {
    font-size: ${SwitchToken.selectedIconSize};
  }
  :host(:not([aria-disabled="true"]):not(:focus):not(:hover)) .track:not(.pressed) .icon.unselected {
    color: ${SwitchToken.unselectedIconColor};
  }
  :host(:not([aria-disabled="true"]):not(:focus):hover) .track:not(.pressed) .icon.unselected {
    color: ${SwitchToken.unselectedHoverIconColor};
  }
  :host(:not([aria-disabled="true"]):focus) .track:not(.pressed) .icon.unselected {
    color: ${SwitchToken.unselectedFocusIconColor};
  }
  :host(:not([aria-disabled="true"])) .track.pressed .icon.unselected {
    color: ${SwitchToken.unselectedPressedIconColor};
  }
  :host(:not([aria-disabled="true"]):not(:focus):not(:hover)) .track:not(.pressed) .icon.selected {
    color: ${SwitchToken.selectedIconColor};
  }
  :host(:not([aria-disabled="true"]):not(:focus):hover) .track:not(.pressed) .icon.selected {
    color: ${SwitchToken.selectedHoverIconColor};
  }
  :host(:not([aria-disabled="true"]):focus) .track:not(.pressed) .icon.selected {
    color: ${SwitchToken.selectedFocusIconColor};
  }
  :host(:not([aria-disabled="true"])) .track.pressed .icon.selected {
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
    :host(:not([aria-disabled="true"]):not(:focus):not(:hover)) .track:not(.pressed) .icon.unselected,
    :host(:not([aria-disabled="true"]):not(:focus):hover) .track:not(.pressed) .icon.unselected,
    :host(:not([aria-disabled="true"]):focus) .track:not(.pressed) .icon.unselected,
    :host(:not([aria-disabled="true"])) .track.pressed .icon.unselected {
      color: Canvas;
    }
    :host(:not([aria-disabled="true"]):not(:focus):not(:hover)) .track:not(.pressed) .icon.selected,
    :host(:not([aria-disabled="true"]):not(:focus):hover) .track:not(.pressed) .icon.selected,
    :host(:not([aria-disabled="true"]):focus) .track:not(.pressed) .icon.selected,
    :host(:not([aria-disabled="true"])) .track.pressed .icon.selected {
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
    :host(:is(:state(--icons-both), :--icons-both):not([checked])) .icon.unselected,
    :host(:is(:state(--icons-both), :--icons-both)[checked]) .icon.selected {
      transition: none;
    }
  }
`;
