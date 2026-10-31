import { css, CSSResult, unsafeCSS } from "lit";

import { DesignToken } from "@m3e/web/core";

import { AppBarToken } from "./AppBarToken";

/**
 * Baseline styles for `M3eAppBarElement`.
 * @internal
 */
export const AppBarStyle: CSSResult = css`
  :host {
    display: block;
    flex: none;
  }
  :host([hidden]) {
    display: none;
  }
  .base {
    min-height: var(--_app-bar-reserved-height, 0);
    overflow-anchor: none;
  }
  .base:has(.wrapper.compress) {
    pointer-events: none;
  }
  .base > .wrapper.compress {
    pointer-events: auto;
  }
  :host(:is(:state(--small), :--small)) .wrapper,
  :host(:not(:is(:state(--small), :--small))) .heading {
    padding-inline-start: ${AppBarToken.paddingLeft};
    padding-inline-end: ${AppBarToken.paddingRight};
  }
  .wrapper {
    box-sizing: border-box;
    display: flex;
    transition: ${unsafeCSS(
      `background-color ${DesignToken.motion.duration.medium1} ${DesignToken.motion.easing.standard},
      box-shadow ${DesignToken.motion.duration.medium1} ${DesignToken.motion.easing.standard},
      min-height ${DesignToken.motion.spring.fastSpatial}`,
    )};
  }
  .wrapper:not(.on-scroll) {
    background-color: ${AppBarToken.containerColor};
    box-shadow: ${AppBarToken.containerElevation};
  }
  .wrapper.on-scroll {
    background-color: ${AppBarToken.containerColorOnScroll};
    box-shadow: ${AppBarToken.containerElevationOnScroll};
  }
  .wrapper.compress.on-scroll {
    background-color: color-mix(
      in srgb,
      ${AppBarToken.containerColorOnScroll} calc(var(--_progress, 0) * 100%),
      ${AppBarToken.containerColor}
    );
    animation: shadow 1s linear paused both;
    animation-delay: calc(var(--_progress, 0) * -1s);
    transition-property: min-height;
  }
  @keyframes shadow {
    from {
      box-shadow: ${AppBarToken.containerElevation};
    }
    to {
      box-shadow: ${AppBarToken.containerElevationOnScroll};
    }
  }
  .wrapper.compressed {
    overflow: hidden;
  }
  .leading-icon,
  .trailing-icon {
    display: flex;
    flex: none;
    align-items: center;
    --_icon-button-size: auto;
    --_icon-button-min-size: 48px;
  }
  .leading-icon {
    min-width: var(--_leading-icon-min-width);
  }
  .trailing-icon {
    min-width: var(--_trailing-icon-min-width);
  }
  .heading {
    display: flex;
    align-items: center;
  }
  :host(:is(:state(--small), :--small)) .heading {
    flex: 1 1 auto;
  }
  .spacer {
    flex: 1 1 auto;
  }
  .label {
    display: flex;
    flex-direction: column;
    flex: none;
  }
  .title {
    color: ${AppBarToken.titleTextColor};
  }
  .subtitle {
    color: ${AppBarToken.subtitleTextColor};
  }
  .wrapper:not(.with-title) .title,
  .wrapper:not(.with-subtitle) .subtitle,
  .wrapper:not(.with-title):not(.with-subtitle) .label,
  .wrapper:not(.with-trailing-icon) .trailing-icon {
    display: none;
  }
  :host(:is(:state(--small), :--small)) .wrapper {
    align-items: center;
  }
  :host(:is(:state(--small), :--small)) .heading {
    min-width: 0;
  }
  :host(:is(:state(--small), :--small)) .label {
    flex: 1 1 auto;
    min-width: 0;
  }
  :host(:is(:state(--small), :--small)) .title,
  :host(:is(:state(--small), :--small)) .subtitle {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  :host(:not(:is(:state(--small), :--small))) .wrapper {
    flex-direction: column;
  }
  :host([centered]) .title,
  :host([centered]) .subtitle {
    text-align: center;
  }
  @media (prefers-reduced-motion) {
    .wrapper,
    .label {
      transition: none;
    }
  }
  @media (forced-colors: active) {
    .wrapper,
    .label {
      transition: none;
    }
    .wrapper:not(.on-scroll),
    .wrapper.on-scroll,
    .wrapper.compress.on-scroll {
      background-color: Canvas;
      box-shadow: unset;
      animation: none;
    }
    .title {
      color: CanvasText;
    }
    .subtitle {
      color: FieldText;
    }
  }
`;
