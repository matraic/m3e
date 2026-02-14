import { css, CSSResultGroup, unsafeCSS } from "lit";

import { DesignToken } from "@m3e/core";

import { DrawerContainerToken } from "./DrawerContainerToken";

/**
 * Styles for `M3eDrawerContainerElement`.
 * @internal
 */
export const DrawerContainerStyle: CSSResultGroup = css`
  :host {
    position: relative;
    overflow: hidden;
    flex: 1 1 auto;
  }
  .start,
  .end {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 3;
    outline: none;
    overflow: auto;
    box-sizing: border-box;
    background-color: ${DrawerContainerToken.containerColor};
    box-shadow: ${DrawerContainerToken.containerElevation};
    transition: ${unsafeCSS(
      `margin-inline ${DesignToken.motion.duration.medium4} ${DesignToken.motion.easing.standard},
      visibility ${DesignToken.motion.duration.medium4} ${DesignToken.motion.easing.standard} allow-discrete,
      background-color ${DesignToken.motion.duration.medium4} ${DesignToken.motion.easing.standard},
      box-shadow ${DesignToken.motion.duration.medium4} ${DesignToken.motion.easing.standard}`,
    )};
  }
  .start {
    inset-inline-start: 0;
  }
  .end {
    inset-inline-end: 0;
  }
  :host(:not([start])) .start {
    visibility: hidden;
    margin-inline-start: calc(0px - var(--_start-drawer-size, ${DrawerContainerToken.containerWidth}));
  }
  :host([start]) .start {
    margin-inline-start: 0;
  }
  :host(:not([end])) .end {
    visibility: hidden;
    margin-inline-end: calc(0px - var(--_end-drawer-size, ${DrawerContainerToken.containerWidth}));
  }
  :host([end]) .end {
    margin-inline-end: 0;
  }
  ::slotted([slot="start"]),
  ::slotted([slot="end"]) {
    height: 100%;
    width: ${DrawerContainerToken.containerWidth};
    box-sizing: border-box;
  }
  .content {
    position: relative;
    height: 100%;
    overflow: auto;
    margin-inline-start: 0;
    margin-inline-end: 0;
    transition: ${unsafeCSS(
      `margin-inline ${DesignToken.motion.duration.medium4} ${DesignToken.motion.easing.standard}`,
    )};
  }
  :host(.-start-push[start]) .content,
  :host(.-start-side[start]) .content {
    margin-inline-start: var(--_start-drawer-size, ${DrawerContainerToken.containerWidth});
  }
  :host(.-end-push[end]) .content,
  :host(.-end-side[end]) .content {
    margin-inline-end: var(--_end-drawer-size, ${DrawerContainerToken.containerWidth});
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
        visibility ${DesignToken.motion.duration.medium4} ${DesignToken.motion.easing.standard} allow-discrete`,
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
  :host(.-start-push) .start,
  :host(.-start-over) .start {
    border-start-end-radius: ${DrawerContainerToken.cornerShape};
    border-end-end-radius: ${DrawerContainerToken.cornerShape};
  }
  :host(.-end-push) .end,
  :host(.-end-over) .end {
    border-start-start-radius: ${DrawerContainerToken.cornerShape};
    border-end-start-radius: ${DrawerContainerToken.cornerShape};
  }
  :host(.-start-push) .start,
  :host(.-end-push) .end,
  :host(.-start-over) .start,
  :host(.-end-over) .end {
    background-color: ${DrawerContainerToken.modalContainerColor};
    box-shadow: ${DrawerContainerToken.modalContainerElevation};
  }
  :host([start-divider]) .start {
    border-inline-end-color: transparent;
    border-inline-end-width: ${DrawerContainerToken.dividerThickness};
    border-inline-end-style: solid;
    box-sizing: border-box;
  }
  :host([start-divider].-start-side[start]:not(.-end-push[end]):not(.-end-over[end])) .start {
    border-inline-end-color: ${DrawerContainerToken.dividerColor};
  }
  :host([end-divider]) .end {
    border-inline-start-color: transparent;
    border-inline-start-width: ${DrawerContainerToken.dividerThickness};
    border-inline-start-style: solid;
    box-sizing: border-box;
  }
  :host([end-divider].-end-side[end]:not(.-start-push[start]):not(.-start-over[start])) .end {
    border-inline-start-color: ${DrawerContainerToken.dividerColor};
  }
  :host(.-no-animate) .start,
  :host(.-no-animate) .end,
  :host(.-no-animate) .content {
    transition: none;
  }
  @media (forced-colors: active) {
    .start,
    .end {
      background-color: Canvas;
      box-shadow: unset;
      transition: ${unsafeCSS(
        `margin ${DesignToken.motion.duration.medium4} ${DesignToken.motion.easing.standard},
      visibility ${DesignToken.motion.duration.medium4} ${DesignToken.motion.easing.standard} allow-discrete`,
      )};
    }
    :host(.-start-push) .start,
    :host(.-end-push) .end,
    :host(.-start-over) .start,
    :host(.-end-over) .end {
      background-color: Canvas;
      box-shadow: unset;
      border-color: CanvasText;
    }
    .start,
    .end {
      border-style: solid;
      border-color: Canvas;
      border-width: 1px;
    }
    .start {
      border-inline-start-style: none;
    }
    .end {
      border-inline-end-style: none;
    }
    :host([start-divider].-start-side[start]:not(.-end-push[end]):not(.-end-over[end])) .start {
      border-inline-end-color: GrayText;
    }
    :host([end-divider].-end-side[end]:not(.-start-push[start]):not(.-start-over[start])) .end {
      border-inline-start-color: GrayText;
    }
  }
  @media (prefers-reduced-motion) {
    .start,
    .end,
    .content,
    .scrim {
      transition: none;
    }
  }
`;
