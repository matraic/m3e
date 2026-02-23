import { css, CSSResultGroup, unsafeCSS } from "lit";

import { DesignToken } from "@m3e/web/core";

/**
 * Baseline styles for `M3eButtonElement`.
 * @internal
 */
export const ButtonStyle: CSSResultGroup = css`
  :host {
    display: inline-block;
    outline: none;
    user-select: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
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
      `background-color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard}`,
    )};
  }
  .touch {
    position: absolute;
    height: 3rem;
    left: 0;
    right: 0;
  }
  :host(.-pressed) .base,
  :host(.-resting) .base {
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
  :host(.-grouped.-connected) {
    flex: 1 1 auto;
  }
  :host(.-grouped:not(.-connected)) {
    transition: ${unsafeCSS(`padding-inline ${DesignToken.motion.spring.fastEffects}`)};
  }
  :host(.-grouped:not(.-connected):not(.-adjacent-pressed):not(.-pressed)) {
    flex-shrink: 0;
    flex-grow: 0;
  }
  :host(.-grouped:not(.-connected).-adjacent-pressed:not(.-pressed)) {
    flex-shrink: 1;
    min-width: 0;
  }
  :host(.-grouped:not(.-connected).-adjacent-pressed:not(.-pressed)) .label {
    text-overflow: clip;
  }
  :host(.-grouped:not(.-connected).-pressed:not([disabled-interactive]):not(:disabled)) {
    flex-shrink: 0;
    flex-basis: calc(
      var(--_button-width) + calc(var(--_button-width) * var(--m3e-standard-button-group-width-multiplier, 0.15))
    );
  }
  @media (forced-colors: active) {
    .base,
    .label,
    .icon {
      transition: none;
    }
    :host(.-pressed) .base,
    :host(.-resting) .base {
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
      background-color: ButtonText;
      outline: none;
    }
    :host([variant]:not(:disabled):not([disabled-interactive])[toggle][selected]) .label,
    :host([variant]:not(:disabled):not([disabled-interactive])[toggle][selected]) .icon {
      forced-color-adjust: none;
      color: ButtonFace;
      background-color: ButtonText;
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
      outline-offset: calc(0px - var(--m3e-button-extra-small-outline-thickness, 1px));
      outline-width: var(--m3e-button-extra-small-outline-thickness, 1px);
    }
    :host([size="small"]) .base {
      outline-offset: calc(0px - var(--m3e-button-small-outline-thickness, 1px));
      outline-width: var(--m3e-button-small-outline-thickness, 1px);
    }
    :host([size="medium"]) .base {
      outline-offset: calc(0px - var(--m3e-button-medium-outline-thickness, 1px));
      outline-width: var(--m3e-button-medium-outline-thickness, 1px);
    }
    :host([size="large"]) .base {
      outline-offset: calc(0px - var(--m3e-button-large-outline-thickness, 0.125rem));
      outline-width: var(--m3e-button-large-outline-thickness, 0.125rem);
    }
    :host([size="extra-large"]) .base {
      outline-offset: calc(0px - var(--m3e-button-extra-large-outline-thickness, 0.1875rem));
      outline-width: var(--m3e-button-extra-large-outline-thickness, 0.1875rem);
    }
  }
  @media (prefers-reduced-motion) {
    :host(.-pressed) .base,
    :host(.-resting) .base,
    .base,
    .label,
    .icon {
      transition: none;
    }
  }
`;
