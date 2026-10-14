import { css, unsafeCSS } from "lit";

import { DesignToken } from "@m3e/web/core";

import { SwitchToken } from "./SwitchToken";

/**
 * State layer styles for `M3eSwitchElement`.
 * @internal
 */
export const SwitchStateLayerStyle = css`
  .state-layer {
    width: ${SwitchToken.stateLayerSize};
    height: ${SwitchToken.stateLayerSize};
    border-radius: ${SwitchToken.stateLayerShape};
    inset-inline-start: calc(
      50% +
        calc(
          calc(var(--_switch-handle-inline-start) - var(--_switch-handle-inline-end)) /
            2 - calc(${SwitchToken.stateLayerSize} / 2)
        )
    );
    top: calc(50% - calc(${SwitchToken.stateLayerSize} / 2));
    transition: ${unsafeCSS(`inset-inline-start ${DesignToken.motion.spring.fastEffects}`)};
  }
  :host(:not([checked])) .state-layer {
    --m3e-state-layer-hover-color: ${SwitchToken.unselectedHoverStateLayerColor};
    --m3e-state-layer-hover-opacity: ${SwitchToken.unselectedHoverStateLayerOpacity};
    --m3e-state-layer-focus-color: ${SwitchToken.unselectedFocusStateLayerColor};
    --m3e-state-layer-focus-opacity: ${SwitchToken.unselectedFocusStateLayerOpacity};
  }
  :host([checked]) .state-layer {
    --m3e-state-layer-hover-color: ${SwitchToken.selectedHoverStateLayerColor};
    --m3e-state-layer-hover-opacity: ${SwitchToken.selectedHoverStateLayerOpacity};
    --m3e-state-layer-focus-color: ${SwitchToken.selectedFocusStateLayerColor};
    --m3e-state-layer-focus-opacity: ${SwitchToken.selectedFocusStateLayerOpacity};
  }
`;
