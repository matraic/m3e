import { css, CSSResultGroup, unsafeCSS } from "lit";

import { DesignToken } from "@m3e/core";

/**
 * Baseline styles for `M3eIconButtonElement`.
 * @internal
 */
export const IconButtonStyle: CSSResultGroup = css`
  :host {
    display: inline-block;
    outline: none;
    user-select: none;
  }
  .base {
    box-sizing: border-box;
    vertical-align: middle;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
    transition: ${unsafeCSS(
      `background-color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard}`
    )};
  }
  .touch {
    position: absolute;
    aspect-ratio: 1 / 1;
    height: 3rem;
    left: auto;
    right: auto;
  }
  .base.resting,
  .base.pressed {
    transition: ${unsafeCSS(`background-color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard},
          border-radius ${DesignToken.motion.spring.fastEffects}`)};
  }
  .wrapper {
    width: 100%;
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .icon {
    transition: ${unsafeCSS(`color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard}`)};
    --m3e-icon-size: 1em;
  }
  :host(:not(:disabled):not([disabled-interactive])) {
    cursor: pointer;
  }
  :host([disabled-interactive]) {
    cursor: not-allowed;
  }
  ::slotted(*) {
    font-size: inherit !important;
    flex: none;
  }
  ::slotted(svg) {
    width: 1em;
    height: 1em;
  }
  :host([toggle]:not([selected])) .base.with-selected-icon slot[name="selected"],
  :host([toggle][selected]) .base.with-selected-icon slot:not([name]) {
    display: none;
  }
  a {
    all: unset;
    display: block;
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    z-index: 1;
  }
  @media (prefers-reduced-motion) {
    .base,
    .base.resting,
    .base.pressed,
    .icon {
      transition: none;
    }
  }
`;
