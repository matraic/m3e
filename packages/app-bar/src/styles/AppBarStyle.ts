import { css, CSSResult, unsafeCSS } from "lit";

import { DesignToken } from "@m3e/core";

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
  :host([size="small"]) .base,
  :host(:not([size="small"]):not([centered])) .heading {
    padding-inline-start: ${AppBarToken.paddingLeft};
    padding-inline-end: ${AppBarToken.paddingRight};
  }
  .base {
    box-sizing: border-box;
    display: flex;
    transition: ${unsafeCSS(
      `background-color ${DesignToken.motion.duration.medium1} ${DesignToken.motion.easing.standard},
      box-shadow ${DesignToken.motion.duration.medium1} ${DesignToken.motion.easing.standard}`
    )};
  }
  .base:not(.-on-scroll) {
    background-color: ${AppBarToken.containerColor};
    box-shadow: ${AppBarToken.containerElevation};
  }
  .base.-on-scroll {
    background-color: ${AppBarToken.containerColorOnScroll};
    box-shadow: ${AppBarToken.containerElevationOnScroll};
  }
  .leading-icon,
  .trailing-icon {
    display: flex;
    flex: none;
    align-items: center;
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
  :host([size="small"]) .heading {
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
  .base:not(.-with-title) .title,
  .base:not(.-with-subtitle) .subtitle,
  .base:not(.-with-title):not(.-with-subtitle) .label,
  .base:not(.-with-trailing-icon) .trailing-icon {
    display: none;
  }
  :host([size="small"]) .base {
    align-items: center;
  }
  :host([size="small"]) .heading {
    min-width: 0;
  }
  :host([size="small"]) .label {
    flex: 1 1 auto;
    min-width: 0;
  }
  :host([size="small"]) .title,
  :host([size="small"]) .subtitle {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  :host(:not([size="small"])) .base {
    flex-direction: column;
  }
  :host([centered]) .title,
  :host([centered]) .subtitle {
    text-align: center;
  }
  @media (prefers-reduced-motion) {
    :host {
      transition: none;
    }
  }
`;
