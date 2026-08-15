import { css, CSSResultGroup, unsafeCSS } from "lit";

import { DesignToken } from "@m3e/web/core";

/**
 * Baseline styles for `M3eFabElement`.
 * @internal
 */
export const FabStyle: CSSResultGroup = css`
  :host {
    display: inline-block;
    outline: none;
    user-select: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  :host([hidden]) {
    display: none;
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
    height: 48px;
    left: 0;
    right: 0;
  }
  .wrapper {
    width: 100%;
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
  }
  .label {
    white-space: nowrap;
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
  .close-icon,
  ::slotted(:not([slot])),
  ::slotted([slot="close-icon"]) {
    font-size: inherit !important;
    flex: none;
  }
  .close-icon,
  ::slotted(svg:not([slot])),
  ::slotted(svg[slot="close-icon"]) {
    width: 1em;
    height: 1em;
  }
  .base.with-menu ::slotted([slot="label"]),
  .base:not(.with-menu) ::slotted([slot="close-icon"]),
  .base:not(.with-menu) .close-icon,
  :host([aria-expanded="true"]) .base.with-menu ::slotted(:not([slot])),
  :host([aria-expanded="false"]) .base.with-menu ::slotted([slot="close-icon"]),
  :host([aria-expanded="false"]) .base.with-menu .close-icon {
    display: none;
  }
  :host([aria-expanded="true"]) .base.with-menu {
    border-radius: var(--m3e-fab-menu-close-button-container-shape, ${DesignToken.shape.corner.full});
    min-height: calc(var(--m3e-fab-menu-close-button-container-height, 56px) + ${DesignToken.density.calc(-3)});
  }
  :host([aria-expanded="true"]) .base.with-menu .wrapper {
    padding-block-start: calc(
      var(--m3e-fab-menu-close-button-top-space, ${DesignToken.measurement.space200}) +
        ${DesignToken.density.calcHalf(-3)}
    );
    padding-block-end: calc(
      var(--m3e-fab-menu-close-button-bottom-space, ${DesignToken.measurement.space200}) +
        ${DesignToken.density.calcHalf(-3)}
    );
    padding-inline-start: calc(
      var(--m3e-fab-menu-close-button-leading-space, ${DesignToken.measurement.space200}) +
        ${DesignToken.density.calcHalf(-3)}
    );
    padding-inline-end: calc(
      var(--m3e-fab-menu-close-button-trailing-space, ${DesignToken.measurement.space200}) +
        ${DesignToken.density.calcHalf(-3)}
    );
  }
  :host([aria-expanded="true"]) .base.with-menu .icon {
    font-size: calc(var(--m3e-fab-menu-close-button-icon-size, 24px) + ${DesignToken.density.calc(-3)});
    --m3e-icon-size: calc(var(--m3e-fab-menu-close-button-icon-size, 24px) + ${DesignToken.density.calc(-3)});
  }
  .base.with-menu {
    transition: min-height ${DesignToken.motion.spring.fastSpatial};
  }
  .base.with-menu .wrapper {
    transition: padding ${DesignToken.motion.spring.fastSpatial};
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
    .icon {
      transition: none;
    }
    .base {
      outline-style: solid;
    }
    :host(:not(:disabled):not([disabled-interactive])) .base {
      background-color: ButtonFace !important;
      outline-color: ButtonText !important;
    }
    :host(:not(:disabled):not([disabled-interactive])) .label,
    :host(:not(:disabled):not([disabled-interactive])) .icon {
      color: ButtonText !important;
    }
    :host(:disabled) .base,
    :host([disabled-interactive]) .base {
      outline-color: GrayText !important;
      background-color: unset !important;
    }
    :host(:disabled) .label,
    :host([disabled-interactive]) .label,
    :host(:disabled) .icon,
    :host([disabled-interactive]) .icon {
      color: GrayText !important;
    }
    :host(:is(:state(--small), :--small)) .base {
      outline-offset: calc(0px - var(--m3e-button-small-outline-thickness, 1px));
      outline-width: var(--m3e-button-small-outline-thickness, 1px);
    }
    :host(:is(:state(--medium), :--medium)) .base {
      outline-offset: calc(0px - var(--m3e-button-medium-outline-thickness, 1px));
      outline-width: var(--m3e-button-medium-outline-thickness, 1px);
    }
    :host(:is(:state(--large), :--large)) .base {
      outline-offset: calc(0px - var(--m3e-button-large-outline-thickness, 2px));
      outline-width: var(--m3e-button-large-outline-thickness, 2px);
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
