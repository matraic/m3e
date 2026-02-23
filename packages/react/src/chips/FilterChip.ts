import React from "react";
import { createComponent } from "@lit/react";

import { M3eFilterChipElement } from "@m3e/web/chips";
export type { M3eFilterChipElement } from "@m3e/web/chips";

/**
 * React binding for the `m3e-filter-chip` Web Component from `@m3e/chips`.
 *
 * This component renders the underlying `<m3e-filter-chip>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-filter-chip>` instance for imperative access.
 *
 * See the `m3e-filter-chip` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eFilterChip = createComponent({
  tagName: "m3e-filter-chip",
  elementClass: M3eFilterChipElement,
  react: React,
  events: {
    onInput: "input",
    onChange: "change",
    onClick: "click",
  },
});
