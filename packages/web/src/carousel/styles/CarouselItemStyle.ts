import { css, CSSResultGroup, unsafeCSS } from "lit";

import { CarouselItemToken } from "./CarouselItemToken";

/**
 * Baseline styles for `M3eCarouselItemElement`.
 * @internal
 */
export const CarouselItemStyle: CSSResultGroup = css`
  :host {
    box-sizing: border-box;
    display: block;
    min-inline-size: 0;
    block-size: 100%;
    pointer-events: none;
    opacity: var(--_carousel-item-opacity, 1);
    --_carousel-current-shape: ${CarouselItemToken.shape};
    border-radius: var(--_carousel-current-shape);
    transition: ${unsafeCSS(`border-radius ${CarouselItemToken.shapeMotion}`)};
    --_carousel-clip-shape: 0px;
  }
  :host(:is(:state(--pressed), :--pressed):not([disabled])) {
    --_carousel-current-shape: min(${CarouselItemToken.shape}, ${CarouselItemToken.shapePressedMorph});
  }
  :host(:is(:state(--pressed), :--pressed):not([disabled])) .action {
    --_carousel-item-outline-color: ${CarouselItemToken.pressed.outlineColor};
  }
  .base {
    position: relative;
    box-sizing: border-box;
    inline-size: 100%;
    block-size: 100%;
    border-radius: inherit;
  }
  .content {
    position: absolute;
    left: calc(var(--_carousel-surface-left, 0px) - var(--_carousel-inset-left, var(--_carousel-inset-x, 0px)));
    top: calc(-1 * var(--_carousel-inset-y, 0px));
    inline-size: calc(
      100% + var(--_carousel-inset-left, var(--_carousel-inset-x, 0px)) +
        var(--_carousel-inset-right, var(--_carousel-inset-x, 0px)) - var(--_carousel-surface-left, 0px) - var(
          --_carousel-surface-right,
          0px
        )
    );
    block-size: calc(100% + 2 * var(--_carousel-inset-y, 0px));
  }
  .action {
    box-sizing: border-box;
    position: absolute;
    pointer-events: none;
    inset: var(--_carousel-inset-y, 0px) var(--_carousel-inset-right, var(--_carousel-inset-x, 0px))
      var(--_carousel-inset-y, 0px) var(--_carousel-inset-left, var(--_carousel-inset-x, 0px));
    border-radius: inherit;
    clip-path: var(--_carousel-surface-clip, none);
  }
  ::slotted(img),
  ::slotted(video) {
    display: block;
    inline-size: 100%;
    block-size: 100%;
    object-fit: cover;
    object-position: center;
  }
  .text {
    position: absolute;
    inset-inline: 16px;
    inset-block-end: 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    color: ${CarouselItemToken.textColor};
    text-align: start;
    pointer-events: none;
    isolation: isolate;
  }
  .text.has-title {
    --_carousel-title-scrim-opacity: var(--_carousel-title-opacity, 1);
  }
  .text.has-subtitle {
    --_carousel-subtitle-scrim-opacity: var(--_carousel-subtitle-opacity, 1);
  }
  .text::before {
    content: "";
    position: absolute;
    inset: -48px -16px -16px;
    z-index: -1;
    background: linear-gradient(to top, ${CarouselItemToken.scrimColor} calc(100% - 48px), transparent);
    opacity: calc(
      ${CarouselItemToken.scrimOpacity} *
        max(var(--_carousel-title-scrim-opacity, 0), var(--_carousel-subtitle-scrim-opacity, 0))
    );
  }
  .title {
    opacity: var(--_carousel-title-opacity, 1);
    color: ${CarouselItemToken.title.textColor};
    font-size: ${CarouselItemToken.title.fontSize};
    font-weight: ${CarouselItemToken.title.fontWeight};
    line-height: ${CarouselItemToken.title.lineHeight};
    letter-spacing: ${CarouselItemToken.title.tracking};
  }
  .subtitle {
    opacity: var(--_carousel-subtitle-opacity, 1);
    color: ${CarouselItemToken.subtitle.textColor};
    font-size: ${CarouselItemToken.subtitle.fontSize};
    font-weight: ${CarouselItemToken.subtitle.fontWeight};
    line-height: ${CarouselItemToken.subtitle.lineHeight};
    letter-spacing: ${CarouselItemToken.subtitle.tracking};
  }
  ::slotted([slot="title"]),
  ::slotted([slot="subtitle"]) {
    display: block;
    margin: 0;
  }
  @media (prefers-reduced-motion) {
    :host {
      transition: none;
    }
  }
`;
