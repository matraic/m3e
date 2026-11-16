import React from "react";
import { createComponent } from "@lit/react";

import { M3eCarouselItemElement } from "@m3e/web/carousel";
export type { M3eCarouselItemElement } from "@m3e/web/carousel";

/**
 * React binding for the `m3e-carousel-item` Web Component from `@m3e/web/carousel`.
 *
 * This component renders the underlying `<m3e-carousel-item>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-carousel-item>` instance for imperative access.
 *
 * See the `m3e-carousel-item` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eCarouselItem = createComponent({
  tagName: "m3e-carousel-item",
  elementClass: M3eCarouselItemElement,
  react: React,
  events: {
    onClick: "click",
  },
});
