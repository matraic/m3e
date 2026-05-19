import { css, CSSResultGroup, unsafeCSS } from "lit";

import { DesignToken } from "@m3e/web/core";

import { SearchViewToken } from "./SearchViewToken";
import { SearchBarToken } from "./SearchBarToken";

/**
 * Light DOM styles for `M3eSearchViewElement`.
 * @internal
 */
export const SearchViewLightDomStyle = css`
  m3e-search-view input[slot="input"]::placeholder {
    user-select: none;
    color: ${SearchBarToken.supportingTextColor};
    font-size: ${SearchBarToken.supportingTextFontSize};
    font-weight: ${SearchBarToken.supportingTextFontWeight};
    line-height: ${SearchBarToken.supportingTextLineHeight};
    letter-spacing: ${SearchBarToken.supportingTextTracking};
  }
`;

/**
 * Styles for `M3eSearchViewElement`.
 * @internal
 */
export const SearchViewStyle: CSSResultGroup = css`
  :host {
    display: block;
  }
  .base {
    position: relative;
    width: 100%;
  }
  .anchor {
    position: absolute;
    width: 100%;
    visibility: hidden;
  }
  .view {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    outline: none;
    padding: unset;
    margin: unset;
    border: unset;
  }
  .header {
    flex: none;
    display: flex;
    align-items: center;
  }
  .bar {
    flex: 1 1 auto;
  }
  :host(:is(:state(--fullscreen), :--fullscreen)) .bar {
    transition: ${unsafeCSS(`margin ${DesignToken.motion.duration.short2} ${DesignToken.motion.easing.standard}`)};
  }
  :host(:is(:state(--fullscreen), :--fullscreen)[contained]:not([open])) .bar {
    margin-inline-start: ${SearchViewToken.containedLeadingMargin};
    margin-inline-end: ${SearchViewToken.containedTrailingMargin};
  }
  :host(:is(:state(--fullscreen), :--fullscreen)[contained][open]) .bar,
  :host(:is(:state(--fullscreen), :--fullscreen)[contained][open]) .results {
    margin-inline-start: ${SearchViewToken.containedFocusedLeadingMargin};
    margin-inline-end: ${SearchViewToken.containedFocusedTrailingMargin};
  }
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    min-width: 3rem;
  }
  ::slotted([slot="search-icon"]),
  .search-icon,
  ::slotted([slot="close-icon"]),
  .close-icon {
    width: 1em;
    font-size: ${SearchBarToken.iconSize} !important;
  }
  .results {
    overflow: hidden;
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
  }
  .scroll-container {
    flex: 1 1 auto;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-color: ${DesignToken.scrollbar.color};
  }
  .view:not(:popover-open) .results,
  .view.closing .results {
    display: none;
  }
  :host(:not(:is(:is(:state(--clearable), :--clearable), [open]))) .clear {
    display: none;
  }
  ::slotted([slot="clear-icon"]),
  .clear-icon {
    width: 1em;
    font-size: ${SearchBarToken.iconSize} !important;
  }
  slot[name="clear-icon"] {
    --m3e-icon-size: ${SearchBarToken.iconSize};
  }
  :host(:is(:state(--fullscreen), :--fullscreen)) .header {
    transition: height 150ms cubic-bezier(0.2, 0, 0, 1);
  }
  :host(:is(:state(--fullscreen), :--fullscreen)) .view:popover-open:not(.closing) .header {
    height: ${SearchViewToken.fullScreenHeaderContainerHeight};
  }
  :host(:is(:state(--fullscreen), :--fullscreen):not([open])) .header,
  :host(:is(:state(--fullscreen), :--fullscreen)[open]) .view.closing .header {
    height: ${SearchViewToken.containedFullScreenBarContainerHeight};
  }
  :host(:is(:state(--fullscreen), :--fullscreen)[open]) .bar {
    --m3e-search-bar-container-height: ${SearchViewToken.containedFullScreenBarContainerHeight};
  }
  :host(:is(:state(--fullscreen), :--fullscreen)) .anchor {
    height: ${SearchViewToken.containedFullScreenBarContainerHeight};
  }
  :host(:is(:state(--fullscreen), :--fullscreen)) .view:popover-open {
    border-radius: ${SearchViewToken.fullScreenContainerShape};
  }
  :host(:is(:state(--fullscreen), :--fullscreen)[contained]) .view:popover-open {
    background-color: ${SearchViewToken.containedContainerColor};
  }
  :host(:is(:state(--fullscreen), :--fullscreen):not([contained])) .view:popover-open {
    background-color: ${SearchViewToken.containerColor};
  }
  :host(:is(:state(--docked), :--docked)[open]) .header,
  :host(:is(:state(--docked), :--docked)) .anchor {
    height: ${SearchViewToken.dockedHeaderContainerHeight};
  }
  :host(:not([contained])[open]) .results {
    border-top-width: ${SearchViewToken.dividerThickness};
    border-top-style: solid;
    border-top-color: ${SearchViewToken.dividerColor};
  }
  :host(:is(:state(--docked), :--docked)[contained]) .results {
    margin-top: ${SearchViewToken.containedDockedBarResultsGap};
  }
  :host(:is(:state(--docked), :--docked):not([contained])[open]) .view {
    background-color: ${SearchViewToken.containerColor};
    --m3e-search-bar-container-color: ${SearchViewToken.containerColor};
  }
  :host(:is(:state(--docked), :--docked)[contained]) .results {
    background-color: ${SearchViewToken.containerColor};
  }
  :host(:is(:state(--docked), :--docked):not([contained])) .view,
  :host(:is(:state(--docked), :--docked)[contained]) .results {
    border-radius: ${SearchViewToken.dockedContainerShape};
  }
  :host(:is(:state(--docked), :--docked)) .results {
    min-height: calc(${SearchViewToken.dockedContainerMinHeight} - ${SearchViewToken.dockedHeaderContainerHeight});
    max-height: calc(${SearchViewToken.dockedContainerMaxHeight} - ${SearchViewToken.dockedHeaderContainerHeight});
  }
  :host(:is(:state(--docked), :--docked)) .scroll-container {
    scrollbar-width: ${DesignToken.scrollbar.thinWidth};
  }
  :host(:is(:state(--docked), :--docked):not([contained])) .scroll-container {
    padding-bottom: ${SearchViewToken.dockedResultsBottomSpace};
  }
  :host(:is(:state(--docked), :--docked)[contained]) .scroll-container {
    padding: ${SearchViewToken.containedDockedResultsSpace};
  }
  :host(:is(:state(--docked), :--docked)) .results {
    transform-origin: top;
    transition: ${unsafeCSS(
      `transform ${DesignToken.motion.duration.short2} ${DesignToken.motion.easing.standard},
      overlay ${DesignToken.motion.duration.short2} ${DesignToken.motion.easing.standard} allow-discrete,
      display ${DesignToken.motion.duration.short2} ${DesignToken.motion.easing.standard} allow-discrete`,
    )};
  }
  :host(:is(:state(--docked), :--docked):not([open])) .results {
    transform: scaleY(0.8);
  }
  :host(:is(:state(--docked), :--docked)[open]) .results {
    transform: scaleY(1);
  }
  @starting-style {
    :host(:is(:state(--docked), :--docked)[open]) .results {
      transform: scaleY(0.8);
    }
  }
  :host(:is(:state(--docked), :--docked)) .view {
    background-color: transparent;
  }
  :host(:is(:state(--docked), :--docked):not([open])) .view {
    transition: ${unsafeCSS(
      `border-radius ${DesignToken.motion.duration.long2} ${DesignToken.motion.easing.standard},
      background-color ${DesignToken.motion.duration.long2} ${DesignToken.motion.easing.standard}`,
    )};
  }
  :host(:is(:state(--docked), :--docked):not([open])) .view::backdrop {
    transition: ${unsafeCSS(
      `background-color ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard}, 
        overlay ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard} allow-discrete,
        visibility ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard} allow-discrete`,
    )};
  }
  :host(:is(:state(--docked), :--docked)) .view::backdrop {
    background-color: color-mix(in srgb, ${SearchViewToken.dockedScrimColor} 0%, transparent);
    margin-inline-end: -20px;
  }
  :host(:is(:state(--docked), :--docked)[open]) .view::backdrop {
    background-color: color-mix(
      in srgb,
      ${SearchViewToken.dockedScrimColor} ${SearchViewToken.dockedScrimOpacity},
      transparent
    );
    transition: ${unsafeCSS(
      `background-color ${DesignToken.motion.duration.long2} ${DesignToken.motion.easing.standard}, 
        overlay ${DesignToken.motion.duration.long2} ${DesignToken.motion.easing.standard} allow-discrete,
        visibility ${DesignToken.motion.duration.long2} ${DesignToken.motion.easing.standard} allow-discrete`,
    )};
  }
  @starting-style {
    :host(:is(:state(--docked), :--docked)[open]) .view::backdrop {
      background-color: color-mix(in srgb, ${SearchViewToken.dockedScrimColor} 0%, transparent);
    }
  }
  :host(:is(:state(--fullscreen), :--fullscreen)) .view:popover-open {
    width: 100vw;
    width: 100dvw;
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
  }
  @media (prefers-reduced-motion) {
    :host(:is(:state(--fullscreen), :--fullscreen)) .bar,
    :host(:is(:state(--fullscreen), :--fullscreen)) .header,
    :host(:is(:state(--docked), :--docked)) .results,
    :host(:is(:state(--docked), :--docked):not([open])) .view,
    :host(:is(:state(--docked), :--docked):not([open])) .view::backdrop,
    :host(:is(:state(--docked), :--docked)[open]) .view::backdrop {
      transition: none;
    }
  }
  @media (forced-colors: active) {
    :host(:not([contained])[open]) .bar {
      --_search-bar-forced-color-outline-style: none;
    }
    :host(:is(:state(--docked), :--docked):not([contained])[open]) .view,
    :host(:is(:state(--docked), :--docked)[contained]) .results {
      border: 1px solid CanvasText;
    }
    :host(:not([contained])[open]) .results {
      border-top-color: CanvasText;
    }
  }
`;
