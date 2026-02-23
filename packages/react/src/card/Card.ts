import React from "react";
import { createComponent } from "@lit/react";

import { M3eCardElement } from "@m3e/web/card";
export type { CardOrientation, CardVariant, M3eCardElement } from "@m3e/web/card";

/**
 * React binding for the `m3e-card` Web Component from `@m3e/card`.
 *
 * This component renders the underlying `<m3e-card>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-card>` instance for imperative access.
 *
 * See the `m3e-card` documentation in `@m3e/card` for full details on behavior,
 * styling, accessibility, and supported events.
 */
export const M3eCard = createComponent({
  tagName: "m3e-card",
  elementClass: M3eCardElement,
  react: React,
  events: {
    onClick: "click",
  },
});
