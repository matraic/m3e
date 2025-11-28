import { css } from "lit";

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
  }
  :host(:not([checked])[icons="both"]) .track:not(.pressed) .state-layer {
    inset-inline-start: calc(0px - calc(calc(${SwitchToken.stateLayerSize} - ${SwitchToken.withIconHandleWidth}) / 2));
    top: calc(0px - calc(calc(${SwitchToken.stateLayerSize} - ${SwitchToken.withIconHandleHeight}) / 2));
  }
  :host(:not([checked]):not([icons="both"])) .track:not(.pressed) .state-layer {
    inset-inline-start: calc(
      0px - calc(calc(${SwitchToken.stateLayerSize} - ${SwitchToken.unselectedHandleWidth}) / 2)
    );
    top: calc(0px - calc(calc(${SwitchToken.stateLayerSize} - ${SwitchToken.unselectedHandleHeight}) / 2));
  }
  :host([checked]) .track:not(.pressed) .state-layer {
    inset-inline-start: calc(0px - calc(calc(${SwitchToken.stateLayerSize} - ${SwitchToken.selectedHandleWidth}) / 2));
    top: calc(0px - calc(calc(${SwitchToken.stateLayerSize} - ${SwitchToken.selectedHandleHeight}) / 2));
  }
  .track.pressed .state-layer {
    inset-inline-start: calc(0px - calc(calc(${SwitchToken.stateLayerSize} - ${SwitchToken.pressedHandleWidth}) / 2));
    top: calc(0px - calc(calc(${SwitchToken.stateLayerSize} - ${SwitchToken.pressedHandleWidth}) / 2));
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
