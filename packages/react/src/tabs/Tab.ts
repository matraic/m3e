import React from "react";
import { createComponent } from "@lit/react";

import { M3eTabElement } from "@m3e/web/tabs";
export type { M3eTabElement } from "@m3e/web/tabs";

/**
 * React binding for the `m3e-tab` Web Component from `@m3e/tabs`.
 *
 * This component renders the underlying `<m3e-tab>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-tab>` instance for imperative access.
 *
 * See the `m3e-tab` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eTab = createComponent({
  tagName: "m3e-tab",
  elementClass: M3eTabElement,
  react: React,
  events: {
    onInput: "input",
    onChange: "change",
    onClick: "click",
  },
});
