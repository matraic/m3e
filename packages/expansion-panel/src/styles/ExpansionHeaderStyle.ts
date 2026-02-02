import { css, unsafeCSS } from "lit";

import { DesignToken } from "@m3e/core";

import { ExpansionHeaderToken } from "./ExpansionHeaderToken";

/**
 * Styles for `M3eExpansionHeaderElement`.
 * @internal
 */
export const ExpansionHeaderStyle = css`
  :host {
    display: block;
    border-radius: inherit;
    outline: none;
    user-select: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    transition: ${unsafeCSS(`height var(--m3e-collapsible-animation-duration, ${DesignToken.motion.duration.medium1})
        ${DesignToken.motion.easing.standard}`)};
  }
  .base {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    display: flex;
    border-radius: inherit;
    outline: none;
    position: relative;
    padding-inline-start: ${ExpansionHeaderToken.paddingLeft};
    padding-inline-end: ${ExpansionHeaderToken.paddingRight};
    font-size: ${ExpansionHeaderToken.fontSize};
    font-weight: ${ExpansionHeaderToken.fontWeight};
    line-height: ${ExpansionHeaderToken.lineHeight};
    letter-spacing: ${ExpansionHeaderToken.tracking};
    column-gap: ${ExpansionHeaderToken.spacing};
  }
  :host(:not(:disabled)) {
    cursor: pointer;
  }
  :host(:not([aria-expanded="true"])) {
    height: ${ExpansionHeaderToken.collapsedHeight};
  }
  :host([aria-expanded="true"]) {
    height: ${ExpansionHeaderToken.expandedHeight};
  }
  :host(:not(:focus-visible)) .state-layer {
    --m3e-state-layer-focus-color: transparent;
  }
  :host([aria-expanded="true"]) .state-layer {
    --m3e-state-layer-hover-color: transparent;
  }
  :host([aria-expanded="true"]) [part="background"],
  .content {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
  }
  .toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    font-size: ${ExpansionHeaderToken.toggleIconSize};
    transition: ${unsafeCSS(`transform var(--m3e-collapsible-animation-duration, ${DesignToken.motion.duration.medium1})
        ${DesignToken.motion.easing.standard}`)};
  }
  :host([toggle-direction="vertical"][aria-expanded="true"]) .toggle {
    transform: rotate(180deg);
  }
  :host([toggle-direction="horizontal"][aria-expanded="true"]) .toggle {
    transform: rotate(var(--_expansion-header-horizontal-expanded-toggle-rotation, 90deg));
  }
  :host([toggle-position="before"]) .toggle {
    margin-inline-start: calc(0px - ${ExpansionHeaderToken.spacing});
  }
  :host([toggle-position="after"]) .toggle {
    margin-inline-end: calc(0px - ${ExpansionHeaderToken.spacing});
  }
  :host([hide-toggle]) .toggle {
    display: none;
  }
  ::slotted([slot="toggle-icon"]) {
    font-size: inherit !important;
    flex: none;
  }
  ::slotted(svg[slot="toggle-icon"]) {
    width: 1em;
    height: 1em;
  }
  @media (prefers-reduced-motion) {
    :host,
    .toggle {
      transition: none;
    }
  }
`;
