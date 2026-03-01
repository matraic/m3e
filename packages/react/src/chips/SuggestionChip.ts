import React from "react";
import { createComponent } from "@lit/react";

import { M3eSuggestionChipElement } from "@m3e/web/chips";
export type { M3eSuggestionChipElement } from "@m3e/web/chips";

/**
 * React binding for the `m3e-suggestion-chip` Web Component from `@m3e/web/chips`.
 *
 * This component renders the underlying `<m3e-suggestion-chip>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-suggestion-chip>` instance for imperative access.
 *
 * See the `m3e-suggestion-chip` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eSuggestionChip = createComponent({
  tagName: "m3e-suggestion-chip",
  elementClass: M3eSuggestionChipElement,
  react: React,
  events: {
    onClick: "click",
  },
});
