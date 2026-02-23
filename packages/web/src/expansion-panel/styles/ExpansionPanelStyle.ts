import { css, unsafeCSS } from "lit";

import { DesignToken } from "@m3e/web/core";

import { ExpansionPanelToken } from "./ExpansionPanelToken";
import { ExpansionHeaderToken } from "./ExpansionHeaderToken";

/**
 * Styles for `M3eExpansionPanelElement`.
 * @internal
 */
export const ExpansionPanelStyle = css`
  :host {
    display: block;
  }
  .base {
    background-color: ${ExpansionPanelToken.containerColor};
    transition: ${unsafeCSS(`box-shadow var(--m3e-collapsible-animation-duration, ${DesignToken.motion.duration.medium1})
        ${DesignToken.motion.easing.standard}`)};
  }
  :host(:not(:disabled)) .base {
    color: ${ExpansionPanelToken.textColor};
  }
  :host(:disabled) .base {
    color: color-mix(
      in srgb,
      ${ExpansionPanelToken.disabledTextColor} ${ExpansionPanelToken.disabledTextOpacity},
      transparent
    );
  }
  :host(:not([open])) .base {
    box-shadow: ${ExpansionPanelToken.collapsedElevation};
    border-radius: ${ExpansionPanelToken.collapsedShape};
  }
  :host([open]) .base {
    box-shadow: ${ExpansionPanelToken.expandedElevation};
    border-radius: ${ExpansionPanelToken.expandedShape};
    margin-block: ${ExpansionPanelToken.expandedSpace};
  }
  .toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${ExpansionHeaderToken.toggleIconSize};
  }
  ::slotted([slot="toggle-icon"]) {
    font-size: inherit !important;
    flex: none;
  }
  .toggle svg,
  ::slotted(svg[slot="toggle-icon"]) {
    width: 1em;
    height: 1em;
  }
  .content {
    padding: ${ExpansionPanelToken.contentPadding};
  }
  :host(:not(.-has-actions)) .actions {
    display: none;
  }
  .actions {
    padding: ${ExpansionPanelToken.actionsPadding};
    border-top-style: solid;
    border-top-width: ${ExpansionPanelToken.actionsDividerThickness};
    border-top-color: ${ExpansionPanelToken.actionsDividerColor};
  }
  ::slotted([slot="actions"]) {
    flex: none;
    display: flex;
    align-items: center;
    column-gap: ${ExpansionPanelToken.actionsSpacing};
  }
  ::slotted([slot="actions"][end]) {
    justify-content: flex-end;
  }
  @media (prefers-reduced-motion) {
    .base {
      transition: none;
    }
  }
  @media (forced-colors: active) {
    .base {
      border: 1px solid CanvasText;
    }
    :host(:disabled) .base {
      color: GrayText;
    }
    .actions {
      border-top-color: GrayText;
    }
  }
`;
