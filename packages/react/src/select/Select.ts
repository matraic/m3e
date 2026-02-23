import React from "react";
import { createComponent } from "@lit/react";

import { M3eSelectElement } from "@m3e/web/select";
export type { M3eSelectElement } from "@m3e/web/select";

/**
 * React binding for the `m3e-select` Web Component from `@m3e/select`.
 *
 * This component renders the underlying `<m3e-select>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-select>` instance for imperative access.
 *
 * See the `m3e-select` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eSelect = createComponent({
  tagName: "m3e-select",
  elementClass: M3eSelectElement,
  react: React,
  events: {
    onInput: "input",
    onChange: "change",
  },
});
