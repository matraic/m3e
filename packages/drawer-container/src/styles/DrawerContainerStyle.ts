import { css, CSSResultGroup, unsafeCSS } from "lit";

import { DesignToken } from "@m3e/core";

import { DrawerContainerToken } from "./DrawerContainerToken";

/**
 * Styles for `M3eDrawerContainerElement`.
 * @internal
 */
export const DrawerContainerStyle: CSSResultGroup = css`
  :host {
    display: flex;
    flex-direction: row;
    position: relative;
    overflow: hidden;
    flex: 1 1 auto;
  }
  .content {
    height: 100%;
  }
  ::slotted([slot="start"]),
  ::slotted([slot="end"]) {
    display: block;
    height: 100%;
    z-index: 3;
    outline: none;
    box-sizing: border-box;
    flex: none;
    width: ${DrawerContainerToken.containerWidth};
    background-color: ${DrawerContainerToken.containerColor};
    box-shadow: ${DrawerContainerToken.containerElevation};
    transition: ${unsafeCSS(
      `margin ${DesignToken.motion.duration.medium4} ${DesignToken.motion.easing.standard},
      visibility ${DesignToken.motion.duration.medium4} ${DesignToken.motion.easing.standard} allow-discrete,
      background-color ${DesignToken.motion.duration.medium4} ${DesignToken.motion.easing.standard},
      box-shadow ${DesignToken.motion.duration.medium4} ${DesignToken.motion.easing.standard}`
    )};
  }
  :host(.-start-over) ::slotted([slot="start"]) {
    position: absolute;
    top: 0;
    left: 0;
  }
  :host(.-end-over) ::slotted([slot="end"]) {
    position: absolute;
    top: 0;
    right: 0;
  }
  :host(:not([start])) ::slotted([slot="start"]) {
    visibility: hidden;
    margin-inline-start: calc(0px - ${DrawerContainerToken.containerWidth});
  }
  :host([start]) ::slotted([slot="start"]) {
    visibility: visible;
    margin-inline-start: 0;
  }
  :host(:not([end])) ::slotted([slot="end"]) {
    visibility: hidden;
    margin-inline-end: calc(0px - ${DrawerContainerToken.containerWidth});
  }
  :host([end]) ::slotted([slot="end"]) {
    margin-inline-end: 0;
    visibility: visible;
  }
  .content {
    flex: 1 1 auto;
    position: relative;
    height: 100%;
  }
  .scrim {
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 1;
    background-color: ${DesignToken.color.scrim};
    opacity: 0;
    visibility: hidden;
    transition: ${unsafeCSS(
      `opacity ${DesignToken.motion.duration.medium4} ${DesignToken.motion.easing.standard}, 
        visibility ${DesignToken.motion.duration.medium4} ${DesignToken.motion.easing.standard} allow-discrete`
    )};
  }
  @starting-style {
    .scrim {
      opacity: 0;
    }
  }
  :host(.-start-push[start]) .scrim,
  :host(.-end-push[end]) .scrim,
  :host(.-start-over[start]) .scrim,
  :host(.-end-over[end]) .scrim {
    visibility: visible;
    opacity: ${DrawerContainerToken.scrimOpacity};
  }
  :host(.-start-push) ::slotted([slot="start"]),
  :host(.-start-over) ::slotted([slot="start"]) {
    border-start-end-radius: ${DrawerContainerToken.cornerShape};
    border-end-end-radius: ${DrawerContainerToken.cornerShape};
  }
  :host(.-end-push) ::slotted([slot="end"]),
  :host(.-end-over) ::slotted([slot="end"]) {
    border-start-start-radius: ${DrawerContainerToken.cornerShape};
    border-end-start-radius: ${DrawerContainerToken.cornerShape};
  }
  :host(.-start-push) ::slotted([slot="start"]),
  :host(.-end-push) ::slotted([slot="end"]),
  :host(.-start-over) ::slotted([slot="start"]),
  :host(.-end-over) ::slotted([slot="end"]) {
    background-color: ${DrawerContainerToken.modalContainerColor};
    box-shadow: ${DrawerContainerToken.modalContainerElevation};
  }
  :host([start-divider]) ::slotted([slot="start"]) {
    border-inline-end-color: transparent;
    border-inline-end-width: ${DrawerContainerToken.dividerThickness};
    border-inline-end-style: solid;
    box-sizing: border-box;
  }
  :host([start-divider].-start-side[start]:not(.-end-push[end]):not(.-end-over[end])) ::slotted([slot="start"]) {
    border-inline-end-color: ${DrawerContainerToken.dividerColor};
  }
  :host([end-divider]) ::slotted([slot="end"]) {
    border-inline-start-color: transparent;
    border-inline-start-width: ${DrawerContainerToken.dividerThickness};
    border-inline-start-style: solid;
    box-sizing: border-box;
  }
  :host([end-divider].-end-side[end]:not(.-start-push[start]):not(.-start-over[start])) ::slotted([slot="end"]) {
    border-inline-start-color: ${DrawerContainerToken.dividerColor};
  }
  @media (prefers-reduced-motion) {
    ::slotted([slot="start"]),
    ::slotted([slot="end"]),
    .scrim {
      transition: none;
    }
  }
`;
