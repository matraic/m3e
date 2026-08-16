import { css, CSSResultGroup, unsafeCSS } from "lit";

import { DesignToken } from "@m3e/web/core";

/**
 * Baseline styles for `M3eIconButtonElement`.
 * @internal
 */
export const IconButtonStyle: CSSResultGroup = css`
  :host {
    display: inline-block;
    outline: none;
    user-select: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  :host([hidden]) {
    display: none;
  }
  .layout,
  .base {
    box-sizing: border-box;
    vertical-align: middle;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .layout {
    width: var(--_icon-button-size, 100%);
    min-width: var(--_icon-button-min-size);
    min-height: var(--_icon-button-min-size);
    height: var(--_icon-button-size, 100%);
  }
  .base {
    position: relative;
    width: var(--_icon-button-size, 100%);
    transition: ${unsafeCSS(
      `background-color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard}`,
    )};
  }
  .touch {
    position: absolute;
    aspect-ratio: 1 / 1;
    height: 48px;
    left: auto;
    right: auto;
  }
  :host(:is(:state(--pressed), :--pressed)) .base,
  :host(:is(:state(--resting), :--resting)) .base {
    transition: ${unsafeCSS(`background-color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard},
          border-radius ${DesignToken.motion.spring.fastEffects}`)};
  }
  .wrapper {
    width: 100%;
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: ${unsafeCSS(`padding-inline ${DesignToken.motion.spring.fastEffects}`)};
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
    transform: var(--_icon-button-icon-transform);
    transform-origin: center center;
    transition: ${unsafeCSS(
      `transform var(--_icon-button-icon-transform-transition, ${DesignToken.motion.spring.fastEffects})`,
    )};
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
  :host(:is(:state(--grouped), :--grouped):is(:state(--connected), :--connected)) {
    flex: 1 1 auto;
  }
  :host(:is(:state(--grouped), :--grouped):not(:is(:state(--connected), :--connected))) {
    transition: ${unsafeCSS(`width ${DesignToken.motion.spring.fastEffects}`)};
  }
  :host(:is(:state(--grouped), :--grouped):not(:is(:state(--connected), :--connected))) .wrapper {
    transition: ${unsafeCSS(`padding-inline ${DesignToken.motion.spring.fastEffects}`)};
  }
  :host(:is(:state(--grouped), :--grouped):not(:is(:state(--connected), :--connected))) {
    flex-shrink: 0;
    flex-grow: 0;
  }
  :host(
    :is(:state(--grouped), :--grouped):not(:is(:state(--connected), :--connected)):not(
        :is(:state(--pressed), :--pressed, :state(--adjacent-pressed), :--adjacent-pressed)
      )
  ) {
    width: var(--_button-width);
  }
  :host(
    :is(:state(--grouped), :--grouped):not(:is(:state(--connected), :--connected)):not(
        :is(:state(--pressed), :--pressed)
      ):is(:state(--adjacent-pressed), :--adjacent-pressed)
  ) {
    width: calc(var(--_button-width) - var(--_adjacent-shrink, 0px));
  }
  :host(
    :is(:state(--grouped), :--grouped):not(:is(:state(--connected), :--connected)):is(
        :state(--pressed),
        :--pressed
      ):not([disabled-interactive]):not(:disabled)
  ) {
    width: calc(
      var(--_button-width) + calc(var(--_button-width) * var(--m3e-standard-button-group-width-multiplier, 0.15))
    );
  }
  @media (forced-colors: active) {
    .base,
    .icon {
      transition: none;
    }
    :host(:is(:state(--pressed), :--pressed)) .base,
    :host(:is(:state(--resting), :--resting)) .base {
      transition: border-radius ${DesignToken.motion.spring.fastEffects};
    }
    :host(:not(:disabled):not([disabled-interactive]):not([toggle])) .base {
      background-color: ButtonFace !important;
      outline-color: ButtonText !important;
    }
    :host(:not(:disabled):not([disabled-interactive]):not([toggle])) .icon {
      color: ButtonText !important;
    }
    :host(:not(:disabled):not([disabled-interactive])[toggle]:not([selected])) .base {
      background-color: ButtonFace !important;
      outline-color: ButtonText !important;
    }
    :host(:not(:disabled):not([disabled-interactive])[toggle]:not([selected])) .icon,
    :host(:hover:not(:disabled):not([disabled-interactive])[toggle]:not([selected])) .icon,
    :host(:not(:disabled):not([disabled-interactive])[toggle]:not([selected]):focus) .icon {
      color: ButtonText !important;
    }
    :host(:not(:disabled):not([disabled-interactive])[toggle][selected]) .base {
      background-color: ButtonText !important;
      outline: none !important;
    }
    :host(:not(:disabled):not([disabled-interactive])[toggle][selected]) .icon,
    :host(:hover:not(:disabled):not([disabled-interactive])[toggle][selected]) .icon,
    :host(:not(:disabled):not([disabled-interactive])[toggle][selected]:focus) .icon {
      forced-color-adjust: none;
      color: ButtonFace !important;
      background-color: ButtonText !important;
    }
    :host(:disabled) .base,
    :host([disabled-interactive]) .base {
      outline-color: GrayText !important;
      background-color: unset !important;
    }
    :host(:disabled) .icon,
    :host([disabled-interactive]) .icon {
      color: GrayText !important;
    }
    .base {
      outline-style: solid;
    }
    :host(:is(:state(--extra-small), :--extra-small)) .base {
      outline-offset: calc(0px - var(--m3e-icon-button-extra-small-outline-thickness, 1px));
      outline-width: var(--m3e-icon-button-extra-small-outline-thickness, 1px);
    }
    :host(:is(:state(--small), :--small)) .base {
      outline-offset: calc(0px - var(--m3e-icon-button-small-outline-thickness, 1px));
      outline-width: var(--m3e-icon-button-small-outline-thickness, 1px);
    }
    :host(:is(:state(--medium), :--medium)) .base {
      outline-offset: calc(0px - var(--m3e-icon-button-medium-outline-thickness, 1px));
      outline-width: var(--m3e-icon-button-medium-outline-thickness, 1px);
    }
    :host(:is(:state(--large), :--large)) .base {
      outline-offset: calc(0px - var(--m3e-icon-button-large-outline-thickness, 2px));
      outline-width: var(--m3e-icon-button-large-outline-thickness, 2px);
    }
    :host(:is(:state(--extra-large), :--extra-large)) .base {
      outline-offset: calc(0px - var(--m3e-icon-button-extra-large-outline-thickness, 3px));
      outline-width: var(--m3e-icon-button-extra-large-outline-thickness, 3px);
    }
  }
  @media (prefers-reduced-motion) {
    :host(:is(:state(--grouped), :--grouped):not(:is(:state(--connected), :--connected))),
    :host(:is(:state(--grouped), :--grouped):not(:is(:state(--connected), :--connected))) .wrapper,
    :host(:is(:state(--pressed), :--pressed)) .base,
    :host(:is(:state(--resting), :--resting)) .base,
    .base,
    .wrapper,
    .icon {
      transition: none;
    }
  }
`;
