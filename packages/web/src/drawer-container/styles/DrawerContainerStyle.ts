import { css, CSSResultGroup, unsafeCSS } from "lit";

import { DesignToken } from "@m3e/web/core";

import { DrawerContainerToken } from "./DrawerContainerToken";

/**
 * Styles for `M3eDrawerContainerElement`.
 * @internal
 */
export const DrawerContainerStyle: CSSResultGroup = css`
  :host {
    display: block;
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
    overflow-x: hidden;
    overflow-y: auto;
    scrollbar-width: ${DesignToken.scrollbar.thinWidth};
    scrollbar-color: ${DesignToken.scrollbar.color};
    box-sizing: border-box;
    background-color: ${DrawerContainerToken.containerColor};
    box-shadow: ${DrawerContainerToken.containerElevation};
    transition: ${unsafeCSS(
      `margin ${DesignToken.motion.duration.medium4} ${DesignToken.motion.easing.standard},
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
  }
  :host(:not([start]):not(:dir(rtl))) .start {
    margin-left: calc(0px - var(--_start-drawer-size, ${DrawerContainerToken.containerWidth}));
  }
  :host(:not([start]):dir(rtl)) .start {
    margin-right: calc(0px - var(--_start-drawer-size, ${DrawerContainerToken.containerWidth}));
  }
  :host([start]:not(:dir(rtl))) .start {
    margin-left: 0;
  }
  :host([start]:dir(rtl)) .start {
    margin-right: 0;
  }
  :host(:not([end])) .end {
    visibility: hidden;
  }
  :host(:not([end]):not(:dir(rtl))) .end {
    margin-right: calc(0px - var(--_end-drawer-size, ${DrawerContainerToken.containerWidth}));
  }
  :host(:not([end]):dir(rtl)) .end {
    margin-left: calc(0px - var(--_end-drawer-size, ${DrawerContainerToken.containerWidth}));
  }
  :host([end]:not(:dir(rtl))) .end {
    margin-right: 0;
  }
  :host([end]:dir(rtl)) .end {
    margin-left: 0;
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
    margin-left: 0;
    margin-right: 0;
    transition: ${unsafeCSS(`margin ${DesignToken.motion.duration.medium4} ${DesignToken.motion.easing.standard}`)};
  }
  :host(:state(-start-push)[start]:not(:dir(rtl))) .content,
  :host(:state(-start-side)[start]:not(:dir(rtl))) .content {
    margin-left: var(--_start-drawer-size, ${DrawerContainerToken.containerWidth});
  }
  :host(:state(-start-push)[start]:dir(rtl)) .content,
  :host(:state(-start-side)[start]:dir(rtl)) .content {
    margin-right: var(--_start-drawer-size, ${DrawerContainerToken.containerWidth});
  }
  :host(:state(-end-push)[end]:not(:dir(rtl))) .content,
  :host(:state(-end-side)[end]:not(:dir(rtl))) .content {
    margin-right: var(--_end-drawer-size, ${DrawerContainerToken.containerWidth});
  }
  :host(:state(-end-push)[end]:dir(rtl)) .content,
  :host(:state(-end-side)[end]:dir(rtl)) .content {
    margin-left: var(--_end-drawer-size, ${DrawerContainerToken.containerWidth});
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
  :host(:state(-start-push)[start]) .scrim,
  :host(:state(-end-push)[end]) .scrim,
  :host(:state(-start-over)[start]) .scrim,
  :host(:state(-end-over)[end]) .scrim {
    visibility: visible;
    opacity: ${DrawerContainerToken.scrimOpacity};
  }
  :host(:state(-start-push)) .start,
  :host(:state(-start-over)) .start {
    border-start-end-radius: ${DrawerContainerToken.cornerShape};
    border-end-end-radius: ${DrawerContainerToken.cornerShape};
  }
  :host(:state(-end-push)) .end,
  :host(:state(-end-over)) .end {
    border-start-start-radius: ${DrawerContainerToken.cornerShape};
    border-end-start-radius: ${DrawerContainerToken.cornerShape};
  }
  :host(:state(-start-push)) .start,
  :host(:state(-end-push)) .end,
  :host(:state(-start-over)) .start,
  :host(:state(-end-over)) .end {
    background-color: ${DrawerContainerToken.modalContainerColor};
    box-shadow: ${DrawerContainerToken.modalContainerElevation};
  }
  :host([start-divider]) .start {
    border-inline-end-color: transparent;
    border-inline-end-width: ${DrawerContainerToken.dividerThickness};
    border-inline-end-style: solid;
    box-sizing: border-box;
  }
  :host([start-divider]:state(-start-side)[start]:not(:state(-end-push)[end]):not(:state(-end-over)[end])) .start {
    border-inline-end-color: ${DrawerContainerToken.dividerColor};
  }
  :host([end-divider]) .end {
    border-inline-start-color: transparent;
    border-inline-start-width: ${DrawerContainerToken.dividerThickness};
    border-inline-start-style: solid;
    box-sizing: border-box;
  }
  :host([end-divider]:state(-end-side)[end]:not(:state(-start-push)[start]):not(:state(-start-over)[start])) .end {
    border-inline-start-color: ${DrawerContainerToken.dividerColor};
  }
  :host(:state(-no-animate)) .start,
  :host(:state(-no-animate)) .end,
  :host(:state(-no-animate)) .content {
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
    :host(:state(-start-push)) .start,
    :host(:state(-end-push)) .end,
    :host(:state(-start-over)) .start,
    :host(:state(-end-over)) .end {
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
    :host([start-divider]:state(-start-side)[start]:not(:state(-end-push)[end]):not(:state(-end-over)[end])) .start {
      border-inline-end-color: GrayText;
    }
    :host([end-divider]:state(-end-side)[end]:not(:state(-start-push)[start]):not(:state(-start-over)[start])) .end {
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
