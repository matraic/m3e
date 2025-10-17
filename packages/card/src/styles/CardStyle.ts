import { css, CSSResult, unsafeCSS } from "lit";

import { DesignToken } from "@m3e/core";

import { CardToken } from "./CardToken";
import { CardVariantToken } from "./CardVariantToken";

/**
 * Baseline styles for `M3eCardElement`.
 * @internal
 */
export const CardStyle: CSSResult = css`
  :host {
    outline: none;
  }
  :host(:not([inline])) {
    display: block;
  }
  :host(:not([inline])) .base {
    display: flex;
  }
  :host([inline]) {
    display: inline-block;
    vertical-align: middle;
  }
  :host([inline]) .base {
    display: inline-flex;
  }
  .base {
    width: 100%;
    height: 100%;
    position: relative;
    box-sizing: border-box;
    border-radius: ${CardToken.shape};
    transition: ${unsafeCSS(
      `background-color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard},
      border-color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard}`
    )};
  }
  :host([actionable]) .base {
    user-select: none;
  }
  :host([actionable]:not(:disabled):not([disabled-interactive])) {
    cursor: pointer;
  }
  :host([actionable][disabled-interactive]) {
    cursor: not-allowed;
  }
  :host(:not([actionable])) .focus-ring,
  :host(:not([actionable])) .state-layer,
  :host(:not([actionable])) .ripple {
    display: none;
  }
  :host([variant="outlined"]) .base {
    border-style: solid;
  }
  ::slotted([slot="content"]) {
    flex: 1 1 auto;
  }
  :host([orientation="vertical"]) ::slotted([slot="content"]) {
    margin-inline: ${CardToken.padding};
  }
  :host([orientation="vertical"]) ::slotted([slot="content"]:first-child) {
    margin-block-start: ${CardToken.padding};
  }
  :host([orientation="vertical"]) ::slotted([slot="content"]:last-child) {
    margin-block-end: ${CardToken.padding};
  }
  :host([orientation="horizontal"]) ::slotted([slot="content"]) {
    margin-block: ${CardToken.padding};
  }
  :host([orientation="horizontal"]) ::slotted([slot="content"]:first-child) {
    margin-inline-start: ${CardToken.padding};
  }
  :host([orientation="horizontal"]) ::slotted([slot="content"]:last-child) {
    margin-inline-end: ${CardToken.padding};
  }
  :host([orientation="vertical"]) ::slotted([slot="header"]:not(img):not(video)) {
    margin-inline: ${CardToken.padding};
    margin-block-start: ${CardToken.padding};
  }
  :host([orientation="horizontal"]) ::slotted([slot="header"]:not(img):not(video)) {
    margin-inline-start: ${CardToken.padding};
    margin-block: ${CardToken.padding};
  }
  ::slotted(img),
  ::slotted(video) {
    inset: 0;
    object-fit: cover;
  }
  ::slotted(img[slot="header"]),
  ::slotted(video[slot="header"]) {
    border-radius: ${CardToken.shape};
  }
  ::slotted([slot="actions"]) {
    margin-inline: ${CardToken.padding};
    margin-block: ${CardToken.padding};
  }
  ::slotted([slot="actions"][end]) {
    justify-content: flex-end;
  }
  :host([orientation="vertical"]) ::slotted([slot="footer"]) {
    margin-inline: ${CardToken.padding};
    margin-block-end: ${CardToken.padding};
  }
  :host([orientation="horizontal"]) ::slotted([slot="footer"]) {
    margin-block: ${CardToken.padding};
    margin-inline-end: ${CardToken.padding};
  }
  ::slotted([slot="header"]),
  ::slotted([slot="actions"]),
  ::slotted([slot="footer"]) {
    flex: none;
    display: flex;
    align-items: center;
  }
  :host([orientation="vertical"]) .base,
  :host([orientation="horizontal"]) ::slotted([slot="header"]),
  :host([orientation="horizontal"]) ::slotted([slot="actions"]),
  :host([orientation="horizontal"]) ::slotted([slot="footer"]) {
    flex-direction: column;
  }
  :host([orientation="horizontal"]) .base,
  :host([orientation="vertical"]) ::slotted([slot="header"]),
  :host([orientation="vertical"]) ::slotted([slot="actions"]),
  :host([orientation="vertical"]) ::slotted([slot="footer"]) {
    flex-direction: row;
  }
  :host([orientation="horizontal"]) ::slotted(img),
  :host([orientation="horizontal"]) ::slotted(video) {
    aspect-ratio: 16 / 9;
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
    .base {
      transition: none;
    }
    :host([variant]) .base {
      border-style: solid;
      border-color: CanvasText;
      border-width: ${CardVariantToken.outlined.outlineThickness ?? unsafeCSS("unset")};
    }
    :host([actionable][variant]:disabled) .base,
    :host([actionable][variant][disabled-interactive]) .base {
      color: GrayText;
      border-color: GrayText;
    }
  }
  @media (prefers-reduced-motion) {
    .base {
      transition: none;
    }
  }
`;
