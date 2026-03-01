import React from "react";
import { createComponent } from "@lit/react";

import { M3eAutocompleteElement } from "@m3e/web/autocomplete";
export type { M3eAutocompleteElement } from "@m3e/web/autocomplete";

/**
 * React binding for the `m3e-autocomplete` Web Component from `@m3e/web/autocomplete`.
 *
 * This component renders the underlying `<m3e-autocomplete>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-autocomplete>` instance for imperative access.
 *
 * See the `m3e-autocomplete` documentation in `@m3e/autocomplete` for full details on behavior,
 * styling, accessibility, and supported events.
 */

// Checking if the code is running in the browser
const isBrowser = typeof window !== "undefined";

// Defining element

export const M3eAutocomplete = isBrowser ? createComponent({
  tagName: "m3e-autocomplete",
  elementClass: M3eAutocompleteElement,
  react: React,
  events: {
    onToggle: "toggle",
  },
}) : null;
