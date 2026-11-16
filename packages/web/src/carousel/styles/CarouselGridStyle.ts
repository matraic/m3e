import { css, CSSResultGroup } from "lit";

import { CarouselGridToken } from "./CarouselGridToken";

/**
 * Baseline styles for `M3eCarouselGridElement`.
 * @internal
 */
export const CarouselGridStyle: CSSResultGroup = css`
  :host {
    display: block;
    position: relative;
    min-inline-size: 0;
  }
  :host([hidden]) {
    display: none;
  }
  .collection {
    display: flex;
    flex-direction: column;
    gap: ${CarouselGridToken.itemGap};
  }
  .row {
    display: grid;
    grid-template-columns: repeat(var(--_carousel-grid-columns, 1), minmax(0, 1fr));
    gap: ${CarouselGridToken.itemGap};
    min-inline-size: 0;
  }
  .row > slot {
    display: contents;
  }
  ::slotted(m3e-carousel-item) {
    box-sizing: border-box;
    display: block;
    inline-size: 100%;
    block-size: auto;
    min-inline-size: 0;
    aspect-ratio: ${CarouselGridToken.itemAspectRatio};
  }
  .column-probe {
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 0;
    display: grid;
    inline-size: 100%;
    block-size: 1px;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, ${CarouselGridToken.itemMinWidth}), 1fr));
    gap: ${CarouselGridToken.itemGap};
    visibility: hidden;
    pointer-events: none;
  }
  .collector {
    display: none;
  }
`;
