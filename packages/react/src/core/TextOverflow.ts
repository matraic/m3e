import React from "react";
import { createComponent } from "@lit/react";

import { M3eTextOverflowElement } from "@m3e/web/core";
export type { M3eTextOverflowElement } from "@m3e/web/core";

/**
 * React binding for the `m3e-text-overflow` Web Component from `@m3e/web/web/core`.
 *
 * This component renders the underlying `<m3e-text-overflow>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-text-overflow>` instance for imperative access.
 *
 * See the `m3e-text-overflow` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eTextOverflow = createComponent({
  tagName: "m3e-text-overflow",
  elementClass: M3eTextOverflowElement,
  react: React,
});
