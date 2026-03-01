import React from "react";
import { createComponent } from "@lit/react";

import { M3eAssistChipElement } from "@m3e/web/chips";
export type { M3eAssistChipElement } from "@m3e/web/chips";

/**
 * React binding for the `m3e-assist-chip` Web Component from `@m3e/web/chips`.
 *
 * This component renders the underlying `<m3e-assist-chip>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-assist-chip>` instance for imperative access.
 *
 * See the `m3e-assist-chip` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */

// Checking if the code is running in the browser
const isBrowser = typeof window !== "undefined";

// Defining element

export const M3eAssistChip = isBrowser ? createComponent({
  tagName: "m3e-assist-chip",
  elementClass: M3eAssistChipElement,
  react: React,
  events: {
    onClick: "click",
  },
}) : null;
