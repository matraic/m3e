import { css, unsafeCSS } from "lit";

import { DesignToken } from "@m3e/web/core";

import { ToolbarToken } from "./ToolbarToken";

/**
 * Baseline styles for `M3eToolbarElement`.
 * @internal
 */
export const ToolbarStyle = css`
  :host {
    display: inline-block;
    position: relative;
  }
  :host([hidden]) {
    display: none;
  }
  .base {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    transition: ${unsafeCSS(`color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard}`)};
    --_icon-button-size: auto;
    --_icon-button-min-size: 48px;
  }
  :host(:not([vertical])) {
    height: fit-content;
  }
  :host(:not([vertical])) .base {
    min-height: calc(${ToolbarToken.size} + ${DesignToken.density.calc(-3)});
    column-gap: ${ToolbarToken.spacing};
  }
  :host([vertical]) {
    width: fit-content;
  }
  :host([vertical]) .base {
    min-width: calc(${ToolbarToken.size} + ${DesignToken.density.calc(-3)});
  }
  :host([vertical]) .base {
    flex-direction: column;
    justify-content: center;
    row-gap: ${ToolbarToken.spacing};
  }
  .state-layer {
    transition: ${unsafeCSS(
      `background-color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard}`,
    )};
  }
  @media (forced-colors: active) {
    :host(:is(:state(--standard), :--standard)) .state-layer,
    :host(:is(:state(--vibrant), :--vibrant)) .state-layer {
      background-color: Canvas;
    }
    :host(:is(:state(--standard), :--standard)) .base,
    :host(:is(:state(--vibrant), :--vibrant)) .base {
      color: CanvasText;
      outline: 1px solid CanvasText;
    }
    .state-layer,
    .base {
      transition: none;
    }
  }
  @media (prefers-reduced-motion) {
    .state-layer,
    .base {
      transition: none;
    }
  }
`;
