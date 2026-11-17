import { css, CSSResultGroup } from "lit";

import { CarouselToken } from "./CarouselToken";

/**
 * Baseline styles for `M3eCarouselElement`.
 * @internal
 */
export const CarouselStyle: CSSResultGroup = css`
  :host {
    display: block;
    position: relative;
    min-inline-size: 0;
    block-size: ${CarouselToken.height};
    min-block-size: ${CarouselToken.minHeight};
    --_carousel-gap: ${CarouselToken.itemGap};
    --_carousel-inline-gutter: ${CarouselToken.inlineGutter};
  }
  :host([hidden]) {
    display: none;
  }
  :host([variant="fullscreen"]) {
    --m3e-carousel-item-shape: 0px;
    --_carousel-inline-gutter: 0px;
  }
  .viewport-frame {
    contain: layout style paint;
    block-size: 100%;
    overflow: hidden;
    overflow: clip;
  }
  .viewport {
    box-sizing: border-box;
    inline-size: 100%;
    block-size: 100%;
    padding-block: ${CarouselToken.blockGutter};
    overflow-x: auto;
    overflow-y: hidden;
    overscroll-behavior-x: none;
    overscroll-behavior-inline: none;
    scrollbar-width: none;
    touch-action: pan-y;
    user-select: none;
    -webkit-user-select: none;
  }
  .viewport.-overscroll-return {
    transition: transform ${CarouselToken.overscrollMotion};
  }
  .viewport::-webkit-scrollbar {
    display: none;
  }
  .size-probe {
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 0;
    block-size: 1px;
    visibility: hidden;
    pointer-events: none;
  }
  .small-min {
    inline-size: ${CarouselToken.smallItemMinWidth};
  }
  .small-max {
    inline-size: ${CarouselToken.smallItemMaxWidth};
  }
  .large-max {
    inline-size: ${CarouselToken.largeItemMaxWidth};
  }
  .item-width {
    inline-size: ${CarouselToken.itemWidth};
  }
  .item-gap {
    inline-size: var(--_carousel-gap);
  }
  .inline-gutter {
    inline-size: var(--_carousel-inline-gutter);
  }
  :host([variant="fullscreen"]) .item-gap {
    inline-size: ${CarouselToken.fullscreen.itemGap};
  }
  .track {
    box-sizing: content-box;
    display: flex;
    align-items: stretch;
    gap: var(--_carousel-gap);
    /* Safari before 26.4 omits a scroll container's inline-end padding from its scroll extent. */
    padding-inline: var(--_carousel-inline-gutter);
    inline-size: var(--_carousel-track-size, max-content);
    min-inline-size: calc(100% - 2 * var(--_carousel-inline-gutter));
    block-size: 100%;
    min-block-size: 100%;
  }
  .track > slot {
    display: contents;
  }
  ::slotted(*) {
    box-sizing: border-box;
    display: block;
    flex-shrink: 0;
    min-inline-size: 0;
    block-size: 100%;
    transform: translate(var(--_carousel-translate-x, 0px), var(--_carousel-translate-y, 0px));
    clip-path: var(--_carousel-clip, none);
  }
  ::slotted(:not(m3e-carousel-item)) {
    display: none;
  }
  ::slotted([hidden]) {
    display: none;
  }
  ::slotted(m3e-carousel-item) {
    clip-path: none;
  }
  :host([variant="fullscreen"]) .viewport {
    block-size: 100%;
    min-block-size: 0;
    padding: 0;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior-y: none;
    overscroll-behavior-block: none;
    touch-action: pan-x;
  }
  :host([variant="fullscreen"]) .track {
    flex-direction: column;
    inline-size: 100%;
    min-inline-size: 0;
    min-block-size: 100%;
    block-size: auto;
    padding: 0;
    gap: ${CarouselToken.fullscreen.itemGap};
  }
  :host([variant="fullscreen"]) ::slotted(*) {
    inline-size: 100%;
    min-block-size: 100%;
  }
`;
