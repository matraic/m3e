import React from "react";
import { createComponent } from "@lit/react";

import { M3eChipSetElement } from "@m3e/web/chips";
export type { M3eChipSetElement } from "@m3e/web/chips";

/**
 * React binding for the `m3e-chip-set` Web Component from `@m3e/web/chips`.
 *
 * This component renders the underlying `<m3e-chip-set>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-chip-set>` instance for imperative access.
 *
 * See the `m3e-chip-set` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */

// Checking if the code is running in the browser
const isBrowser = typeof window !== "undefined";

// Defining element

export const M3eChipSet = isBrowser ? createComponent({
  tagName: "m3e-chip-set",
  elementClass: M3eChipSetElement,
  react: React,
}) : null;
