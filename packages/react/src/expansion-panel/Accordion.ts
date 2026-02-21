import React from "react";
import { createComponent } from "@lit/react";

import { M3eAccordionElement } from "@m3e/expansion-panel";
export type { M3eAccordionElement } from "@m3e/expansion-panel";

/**
 * React wrapper for the `m3e-accordion` web component from `@m3e/expansion-panel`.
 *
 * This component renders the underlying `<m3e-accordion>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-accordion>` instance for imperative access.
 *
 * See the `m3e-accordion` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eAccordion = createComponent({
  tagName: "m3e-accordion",
  elementClass: M3eAccordionElement,
  react: React,
});
