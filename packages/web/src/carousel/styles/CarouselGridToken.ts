import { unsafeCSS } from "lit";

/**
 * Component design tokens that control carousel grid layout.
 * @internal
 */
export const CarouselGridToken = {
  itemMinWidth: unsafeCSS("var(--m3e-carousel-grid-item-min-width, 240px)"),
  itemGap: unsafeCSS("var(--m3e-carousel-grid-item-gap, 16px)"),
  itemAspectRatio: unsafeCSS("var(--m3e-carousel-grid-item-aspect-ratio, 4 / 3)"),
};
