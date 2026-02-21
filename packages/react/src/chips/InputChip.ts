import React from "react";
import { createComponent } from "@lit/react";

import { M3eInputChipElement } from "@m3e/chips";
export type { M3eInputChipElement } from "@m3e/chips";

/**
 * React wrapper for the `m3e-input-chip` web component from `@m3e/chips`.
 *
 * This component renders the underlying `<m3e-input-chip>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-input-chip>` instance for imperative access.
 *
 * See the `m3e-input-chip` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eInputChip = createComponent({
  tagName: "m3e-input-chip",
  elementClass: M3eInputChipElement,
  react: React,
  events: {
    onClick: "click",
    onRemove: "remove",
  },
});
