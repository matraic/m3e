import { css, CSSResultGroup } from "lit";

import { SearchBarToken } from "./SearchBarToken";

/**
 * Light DOM styles for `M3eSearchBarElement`.
 * @internal
 */
export const SearchBarLightDomStyle = css`
  m3e-search-bar input[slot="input"]::placeholder {
    user-select: none;
    color: ${SearchBarToken.supportingTextColor};
    font-size: ${SearchBarToken.supportingTextFontSize};
    font-weight: ${SearchBarToken.supportingTextFontWeight};
    line-height: ${SearchBarToken.supportingTextLineHeight};
    letter-spacing: ${SearchBarToken.supportingTextTracking};
  }
`;

/**
 * Styles for `M3eSearchBarElement`.
 * @internal
 */
export const SearchBarStyle: CSSResultGroup = css`
  :host {
    display: block;
    height: ${SearchBarToken.containerHeight};
  }
  .base {
    cursor: text;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border-radius: ${SearchBarToken.containerShape};
    background-color: ${SearchBarToken.containerColor};
  }
  .clear {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    min-width: 3rem;
  }
  :host(:not(:state(-clearable))) .clear {
    display: none;
  }
  :host(:state(-with-leading)) slot[name="leading"],
  :host(:state(-with-trailing)) slot[name="trailing"] {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    min-width: 3rem;
    padding-inline: 0.25rem;
    column-gap: calc(0.5rem + ${SearchBarToken.actionsGap});
  }
  ::slotted([slot="input"]) {
    flex: 1 1 auto;
    outline: unset;
    border: unset;
    background-color: transparent;
    box-shadow: none;
    min-width: 0;
    padding: unset;
    color: ${SearchBarToken.inputColor};
    font-size: ${SearchBarToken.inputTextFontSize};
    font-weight: ${SearchBarToken.inputTextFontWeight};
    line-height: ${SearchBarToken.inputTextLineHeight};
    letter-spacing: ${SearchBarToken.inputTextTracking};
  }
  :host(:state(-with-leading)) .base {
    padding-inline-start: ${SearchBarToken.leadingSpace};
  }
  :host(:not(:state(-with-leading))) .base {
    padding-inline-start: ${SearchBarToken.noActionsLeadingSpace};
  }
  :host(:is(:state(-with-trailing), :state(-clearable))) .base {
    padding-inline-end: ${SearchBarToken.trailingSpace};
  }
  :host(:not(:is(:state(-with-trailing), :state(-clearable)))) .base {
    padding-inline-end: ${SearchBarToken.noActionsTrailingSpace};
  }
  :host(:state(-with-leading)) ::slotted([slot="input"]) {
    margin-inline-start: ${SearchBarToken.leadingActionsTrailingSpace};
  }
  :host(:is(:state(-with-trailing), :state(-clearable))) ::slotted([slot="input"]) {
    margin-inline-end: ${SearchBarToken.trailingActionsLeadingSpace};
  }
  slot[name="leading"] {
    color: ${SearchBarToken.leadingIconColor};
    --m3e-icon-color: ${SearchBarToken.leadingIconColor};
    --m3e-icon-button-icon-color: ${SearchBarToken.leadingIconColor};
    --m3e-icon-size: ${SearchBarToken.iconSize};
  }
  slot[name="trailing"],
  .clear {
    color: ${SearchBarToken.trailingIconColor};
    --m3e-icon-color: ${SearchBarToken.trailingIconColor};
    --m3e-icon-button-icon-color: ${SearchBarToken.trailingIconColor};
    --m3e-icon-size: ${SearchBarToken.iconSize};
  }
  ::slotted(svg[slot="leading"]),
  ::slotted(svg[slot="trailing"]) {
    width: 1em;
    font-size: ${SearchBarToken.iconSize};
  }
  ::slotted([slot="clear-icon"]),
  .clear-icon {
    width: 1em;
    font-size: ${SearchBarToken.iconSize} !important;
  }
  slot[name="clear-icon"] {
    --m3e-icon-size: ${SearchBarToken.iconSize};
  }
  @media (forced-colors: active) {
    .base {
      border: 1px var(--_search-bar-forced-color-outline-style, solid) CanvasText;
    }
  }
`;
