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
    contain: layout;
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
    grid-template-columns: 0 minmax(0, 1fr);
    gap: ${CarouselGridToken.itemGap};
    inline-size: 100%;
    block-size: 1px;
    visibility: hidden;
    pointer-events: none;
  }
  .collector {
    display: none;
  }
  .item-width-probe {
    position: absolute;
    inline-size: min(100%, ${CarouselGridToken.itemMinWidth});
    block-size: 1px;
  }
  .gap-probe {
    grid-column: 2;
    min-inline-size: 0;
    block-size: 1px;
  }
`;
