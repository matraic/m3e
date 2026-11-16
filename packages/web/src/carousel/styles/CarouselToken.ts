import { unsafeCSS } from "lit";

import { DesignToken } from "@m3e/web/core";

/**
 * Component design tokens that control carousel sizing and motion.
 * @internal
 */
export const CarouselToken = {
  height: unsafeCSS("var(--m3e-carousel-height, 205px)"),
  minHeight: unsafeCSS("var(--m3e-carousel-min-height, 0px)"),
  itemGap: unsafeCSS(`var(--m3e-carousel-item-gap, ${DesignToken.measurement.space100})`),
  itemWidth: unsafeCSS("var(--m3e-carousel-item-width, 0px)"),
  smallItemMinWidth: unsafeCSS("var(--m3e-carousel-small-item-min-width, 40px)"),
  smallItemMaxWidth: unsafeCSS("var(--m3e-carousel-small-item-max-width, 56px)"),
  largeItemMaxWidth: unsafeCSS("var(--m3e-carousel-large-item-max-width, 100%)"),

  inlineGutter: unsafeCSS(`max(0px, var(--m3e-carousel-inline-gutter, ${DesignToken.measurement.space200}))`),
  blockGutter: unsafeCSS(`max(0px, var(--m3e-carousel-block-gutter, ${DesignToken.measurement.space100}))`),
  overscrollMotion: DesignToken.motion.spring.fastSpatial,

  fullscreen: {
    itemGap: unsafeCSS(`var(--m3e-carousel-fullscreen-item-gap, ${DesignToken.measurement.space200})`),
  },
};
