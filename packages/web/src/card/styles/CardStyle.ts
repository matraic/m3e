import { css, CSSResult, unsafeCSS } from "lit";

import { DesignToken } from "@m3e/web/core";

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
  :host([hidden]) {
    display: none;
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
  }
  :host([actionable]) .base {
    transition: ${unsafeCSS(
      `background-color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard},
      border-color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard}`,
    )};
  }
  :host([actionable]) {
    user-select: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
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
  :host(:is(:state(--outlined), :--outlined)) .base {
    border-style: solid;
  }
  ::slotted([slot="content"]) {
    flex: 1 1 auto;
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
  ::slotted([slot="actions"][end]) {
    justify-content: flex-end;
  }
  ::slotted([slot="header"]),
  ::slotted([slot="actions"]),
  ::slotted([slot="footer"]) {
    flex: none;
    display: flex;
    align-items: center;
  }
  :host(:is(:state(--vertical), :--vertical)) .base,
  :host(:is(:state(--horizontal), :--horizontal)) ::slotted([slot="header"]),
  :host(:is(:state(--horizontal), :--horizontal)) ::slotted([slot="actions"]),
  :host(:is(:state(--horizontal), :--horizontal)) ::slotted([slot="footer"]) {
    flex-direction: column;
  }
  :host(:is(:state(--horizontal), :--horizontal)) .base,
  :host(:is(:state(--vertical), :--vertical)) ::slotted([slot="header"]),
  :host(:is(:state(--vertical), :--vertical)) ::slotted([slot="actions"]),
  :host(:is(:state(--vertical), :--vertical)) ::slotted([slot="footer"]) {
    flex-direction: row;
  }
  :host(:is(:state(--horizontal), :--horizontal)) ::slotted(img),
  :host(:is(:state(--horizontal), :--horizontal)) ::slotted(video) {
    aspect-ratio: 16 / 9;
  }
  .has-content:not(.has-default) slot[name="content"],
  .has-content.has-default slot:not([name]) {
    display: inherit;
    flex-direction: inherit;
    flex: 1 1 auto;
  }
  .has-header slot[name="header"],
  .has-actions slot[name="actions"],
  .has-footer slot[name="footer"] {
    display: inherit;
    flex-direction: inherit;
    flex: none;
  }
  :host(:is(:state(--vertical), :--vertical)) .has-content:not(.has-default) slot[name="content"] {
    margin-inline: ${CardToken.padding};
  }
  :host(:is(:state(--vertical), :--vertical)) .has-content:not(.has-default):not(.has-header) slot[name="content"] {
    margin-block-start: ${CardToken.padding};
  }
  :host(:is(:state(--vertical), :--vertical))
    .has-content:not(.has-default):not(.has-actions):not(.has-footer)
    slot[name="content"] {
    margin-block-end: ${CardToken.padding};
  }
  :host(:is(:state(--horizontal), :--horizontal)) .has-content:not(.has-default) slot[name="content"] {
    margin-block: ${CardToken.padding};
  }
  :host(:is(:state(--horizontal), :--horizontal)) .has-content:not(.has-default):not(.has-header) slot[name="content"] {
    margin-inline-start: ${CardToken.padding};
  }
  :host(:is(:state(--horizontal), :--horizontal))
    .has-content:not(.has-default):not(.has-actions):not(.has-footer)
    slot[name="content"] {
    margin-inline-end: ${CardToken.padding};
  }
  :host(:is(:state(--vertical), :--vertical)) .has-header:not(.has-header-media) slot[name="header"] {
    margin-inline: ${CardToken.padding};
    margin-block-start: ${CardToken.padding};
  }
  :host(:is(:state(--horizontal), :--horizontal)) .has-header:not(.has-header-media) slot[name="header"] {
    margin-inline-start: ${CardToken.padding};
    margin-block: ${CardToken.padding};
  }
  .has-actions slot[name="actions"] {
    margin-inline: ${CardToken.padding};
    margin-block: ${CardToken.padding};
  }
  :host(:is(:state(--vertical), :--vertical)) .has-footer slot[name="footer"] {
    margin-inline: ${CardToken.padding};
    margin-block-end: ${CardToken.padding};
  }
  :host(:is(:state(--horizontal), :--horizontal)) .has-footer slot[name="footer"] {
    margin-block: ${CardToken.padding};
    margin-inline-end: ${CardToken.padding};
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
    :host([actionable]) .base {
      transition: none;
    }
    .base {
      border-style: solid !important;
      border-color: CanvasText !important;
      border-width: ${CardVariantToken.outlined.outlineThickness ?? unsafeCSS("unset")} !important;
    }
    :host([actionable]:disabled) .base,
    :host([actionable][disabled-interactive]) .base {
      color: GrayText !important;
      border-color: GrayText !important;
    }
  }
  @media (prefers-reduced-motion) {
    :host([actionable]) .base {
      transition: none;
    }
  }
`;
