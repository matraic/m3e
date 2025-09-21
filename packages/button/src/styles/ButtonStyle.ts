import { css, CSSResultGroup, unsafeCSS } from "lit";

import { DesignToken } from "@m3e/core";

/**
 * Baseline styles for `M3eButtonElement`.
 * @internal
 */
export const ButtonStyle: CSSResultGroup = css`
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
    height: 3rem;
    left: 0;
    right: 0;
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
  }
  .label {
    justify-self: center;
    flex: 1 1 auto;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: ${unsafeCSS(`color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard}`)};
  }
  .icon {
    transition: ${unsafeCSS(`color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard}`)};
  }
  :host(:not(:disabled):not([disabled-interactive])) {
    cursor: pointer;
  }
  :host([disabled-interactive]) {
    cursor: not-allowed;
  }
  ::slotted([slot="icon"]),
  ::slotted([slot="selected-icon"]),
  ::slotted([slot="trailing-icon"]) {
    font-size: inherit !important;
    flex: none;
  }
  ::slotted(svg[slot="icon"]),
  ::slotted(svg[slot="selected-icon"]),
  ::slotted(svg[slot="trailing-icon"]) {
    width: 1em;
    height: 1em;
  }
  :host([toggle]:not([selected])) .base.with-selected-icon slot[name="selected-icon"],
  :host([toggle][selected]) .base.with-selected-icon slot[name="icon"] {
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
    .label,
    .icon {
      transition: none;
    }
  }
`;
