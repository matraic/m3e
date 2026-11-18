import { css, CSSResultGroup } from "lit";

import { CarouselItemToken } from "./CarouselItemToken";

/**
 * Baseline styles for `M3eCarouselItemActionElement`.
 * @internal
 */
export const CarouselItemActionStyle: CSSResultGroup = css`
  :host {
    display: block;
    position: relative;
    outline: none;
    border-radius: inherit;
    pointer-events: none;
    --m3e-elevation-hover-level: ${CarouselItemToken.hover.elevation};
    --_carousel-item-outline-color: ${CarouselItemToken.outlineColor};
    --m3e-state-layer-hover-color: ${CarouselItemToken.hover.stateLayerColor};
    --m3e-state-layer-hover-opacity: ${CarouselItemToken.hover.stateLayerOpacity};
    --m3e-state-layer-focus-color: ${CarouselItemToken.focus.stateLayerColor};
    --m3e-state-layer-focus-opacity: ${CarouselItemToken.focus.stateLayerOpacity};
    --m3e-ripple-color: ${CarouselItemToken.ripple.color};
    --m3e-ripple-opacity: ${CarouselItemToken.ripple.opacity};
    cursor: pointer;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  :host(:hover) {
    --_carousel-item-outline-color: ${CarouselItemToken.hover.outlineColor};
  }
  :host(:active) {
    --_carousel-item-outline-color: ${CarouselItemToken.pressed.outlineColor};
  }
  :host([disabled]) {
    cursor: default;
    --_carousel-item-outline-color: color-mix(
      in srgb,
      ${CarouselItemToken.disabled.outlineColor} ${CarouselItemToken.disabled.outlineOpacity},
      transparent
    );
  }
  .surface {
    position: absolute;
    inset: 0 calc(-1 * var(--_carousel-surface-right, 0px)) 0 calc(-1 * var(--_carousel-surface-left, 0px));
    border-radius: inherit;
  }
  .base {
    position: relative;
    inline-size: 100%;
    block-size: 100%;
    border-radius: inherit;
    overflow: hidden;
    pointer-events: auto;
    clip-path: inset(0 round var(--_carousel-current-shape));
    transition: clip-path ${CarouselItemToken.shapeMotion};
  }
  .base::after {
    content: "";
    position: absolute;
    inset: 0;
    box-sizing: border-box;
    border: ${CarouselItemToken.outlineWidth} solid var(--_carousel-item-outline-color);
    border-radius: inherit;
    pointer-events: none;
    z-index: 1;
  }
  m3e-state-layer,
  m3e-focus-ring,
  m3e-ripple {
    z-index: 1;
  }
  a {
    position: absolute;
    inset: 0;
    z-index: 2;
    border-radius: inherit;
  }
  @media (prefers-reduced-motion) {
    .base {
      transition: none;
    }
  }
  @media (forced-colors: active) {
    .base::after {
      border-color: ButtonText;
    }
    :host([disabled]) .base::after {
      border-color: GrayText;
    }
  }
`;
