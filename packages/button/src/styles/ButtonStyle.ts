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
  @media (forced-colors: active) {
    .base,
    .label,
    .icon {
      transition: none;
    }
    .base.resting,
    .base.pressed {
      transition: ${unsafeCSS(`border-radius ${DesignToken.motion.spring.fastEffects}`)};
    }
    :host([variant]:not(:disabled):not([disabled-interactive]):not([toggle])) .base {
      background-color: ButtonFace;
      outline-color: ButtonText;
    }
    :host([variant]:not(:disabled):not([disabled-interactive]):not([toggle])) .label,
    :host([variant]:not(:disabled):not([disabled-interactive]):not([toggle])) .icon {
      color: ButtonText;
    }
    :host([variant]:not(:disabled):not([disabled-interactive])[toggle]:not([selected])) .base {
      background-color: ButtonFace;
      outline-color: ButtonText;
    }
    :host([variant]:not(:disabled):not([disabled-interactive])[toggle]:not([selected])) .label,
    :host([variant]:not(:disabled):not([disabled-interactive])[toggle]:not([selected])) .icon {
      color: ButtonText;
    }
    :host([variant]:not(:disabled):not([disabled-interactive])[toggle][selected]) .base {
      background-color: Highlight;
      outline-color: HighlightText;
    }
    :host([variant]:not(:disabled):not([disabled-interactive])[toggle][selected]) .label,
    :host([variant]:not(:disabled):not([disabled-interactive])[toggle][selected]) .icon {
      forced-color-adjust: none;
      color: HighlightText;
      background-color: Highlight;
    }
    :host([variant]:disabled) .base,
    :host([variant][disabled-interactive]) .base {
      outline-color: GrayText;
      background-color: unset;
    }
    :host([variant]:disabled) .label,
    :host([variant][disabled-interactive]) .label,
    :host([variant]:disabled) .icon,
    :host([variant][disabled-interactive]) .icon {
      color: GrayText;
    }
    .base {
      outline-style: solid;
    }
    :host([size="extra-small"]) .base {
      outline-width: var(--m3e-button-extra-small-outline-thickness, 1px);
    }
    :host([size="small"]) .base {
      outline-width: var(--m3e-button-small-outline-thickness, 1px);
    }
    :host([size="medium"]) .base {
      outline-width: var(--m3e-button-medium-outline-thickness, 1px);
    }
    :host([size="large"]) .base {
      outline-width: var(--m3e-button-large-outline-thickness, 0.125rem);
    }
    :host([size="extra-large"]) .base {
      outline-width: var(--m3e-button-extra-large-outline-thickness, 0.1875rem);
    }
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
