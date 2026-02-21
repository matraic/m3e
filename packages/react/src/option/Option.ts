import React from "react";
import { createComponent } from "@lit/react";

import { M3eOptionElement } from "@m3e/option";
export type { M3eOptionElement } from "@m3e/option";

/**
 * React wrapper for the `m3e-option` web component from `@m3e/option`.
 *
 * This component renders the underlying `<m3e-option>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-option>` instance for imperative access.
 *
 * See the `m3e-option` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eOption = createComponent({
  tagName: "m3e-option",
  elementClass: M3eOptionElement,
  react: React,
});
