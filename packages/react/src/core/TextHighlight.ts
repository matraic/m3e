import React from "react";
import { createComponent } from "@lit/react";

import { M3eTextHighlightElement } from "@m3e/web/core";
export type { M3eTextHighlightElement } from "@m3e/web/core";

/**
 * React binding for the `m3e-text-highlight` Web Component from `@m3e/web/web/core`.
 *
 * This component renders the underlying `<m3e-text-highlight>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-text-highlight>` instance for imperative access.
 *
 * See the `m3e-text-highlight` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */

// Checking if the code is running in the browser
const isBrowser = typeof window !== "undefined";

// Defining element

export const M3eTextHighlight = isBrowser ? createComponent({
  tagName: "m3e-text-highlight",
  elementClass: M3eTextHighlightElement,
  react: React,
}) : null;
