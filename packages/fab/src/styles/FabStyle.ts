import { css, CSSResultGroup, unsafeCSS } from "lit";

import { DesignToken } from "@m3e/core";

/**
 * Baseline styles for `M3eFabElement`.
 * @internal
 */
export const FabStyle: CSSResultGroup = css`
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
  :host(:not([extended])) ::slotted([slot="label"]),
  .base.-with-menu ::slotted([slot="label"]),
  .base:not(.-with-menu) ::slotted([slot="close-icon"]),
  .base:not(.-with-menu) .close-icon,
  :host([aria-expanded="true"]) .base.-with-menu ::slotted(:not([slot])),
  :host([aria-expanded="false"]) .base.-with-menu ::slotted([slot="close-icon"]),
  :host([aria-expanded="false"]) .base.-with-menu .close-icon {
    display: none;
  }
  :host([aria-expanded="true"]) .base.-with-menu {
    border-radius: var(--m3e-fab-menu-close-button-container-shape, ${DesignToken.shape.corner.full});
    height: calc(var(--m3e-fab-menu-close-button-container-height, 3.5rem) + ${DesignToken.density.calc(-3)});
  }
  :host([aria-expanded="true"]) .base.-with-menu .wrapper {
    padding-inline-start: calc(var(--m3e-fab-menu-close-button-leading-space, 1rem) + ${DesignToken.density.calc(-3)});
    padding-inline-end: calc(var(--m3e-fab-menu-close-button-trailing-space, 1rem) + ${DesignToken.density.calc(-3)});
  }
  :host([aria-expanded="true"]) .base.-with-menu .icon {
    font-size: calc(var(--m3e-fab-menu-close-button-icon-size, 1.5rem) + ${DesignToken.density.calc(-3)});
    --m3e-icon-size: calc(var(--m3e-fab-menu-close-button-icon-size, 1.5rem) + ${DesignToken.density.calc(-3)});
  }
  .base.-with-menu {
    transition: height ${DesignToken.motion.spring.fastSpatial};
  }
  .base.-with-menu .wrapper {
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
