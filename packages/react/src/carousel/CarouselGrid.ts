import React from "react";
import { createComponent, EventName } from "@lit/react";

import { M3eCarouselGridElement, CarouselChangeDetail } from "@m3e/web/carousel";
export type { M3eCarouselGridElement } from "@m3e/web/carousel";

/**
 * React binding for the `m3e-carousel-grid` Web Component from `@m3e/web/carousel`.
 *
 * This component renders the underlying `<m3e-carousel-grid>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-carousel-grid>` instance for imperative access.
 *
 * See the `m3e-carousel-grid` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eCarouselGrid = createComponent({
  tagName: "m3e-carousel-grid",
  elementClass: M3eCarouselGridElement,
  react: React,
  events: {
    onChange: "change" as EventName<CustomEvent<CarouselChangeDetail>>,
  },
});
