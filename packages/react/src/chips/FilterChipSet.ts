import React from "react";
import { createComponent } from "@lit/react";

import { M3eFilterChipSetElement } from "@m3e/chips";
export type { M3eFilterChipSetElement } from "@m3e/chips";

/**
 * React wrapper for the `m3e-filter-chip-set` web component from `@m3e/chips`.
 *
 * This component renders the underlying `<m3e-filter-chip-set>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-filter-chip-set>` instance for imperative access.
 *
 * See the `m3e-filter-chip-set` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eFilterChipSet = createComponent({
  tagName: "m3e-filter-chip-set",
  elementClass: M3eFilterChipSetElement,
  react: React,
  events: {
    onInput: "input",
    onChange: "change",
  },
});
