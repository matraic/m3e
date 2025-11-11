import { css } from "lit";
import { SwitchToken } from "./SwitchToken";

/**
 * Baseline styles for `M3eSwitchElement`.
 * @internal
 */
export const SwitchStyle = css`
  :host {
    display: inline-block;
    position: relative;
    outline: none;
    height: fit-content;
    width: fit-content;
    user-select: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  :host(:not([aria-disabled="true"])) {
    cursor: pointer;
  }
  .focus-ring {
    border-radius: ${SwitchToken.trackShape};
  }
  .touch {
    position: absolute;
    height: 3rem;
    left: 0;
    right: 0;
  }
  .base {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
