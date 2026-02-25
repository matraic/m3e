import React from "react";
import { createComponent } from "@lit/react";

import { M3eCollapsibleElement } from "@m3e/web/core";
export type { M3eCollapsibleElement } from "@m3e/web/core";

/**
 * React binding for the `m3e-collapsible` Web Component from `@m3e/web/web/core`.
 *
 * This component renders the underlying `<m3e-collapsible>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-collapsible>` instance for imperative access.
 *
 * See the `m3e-collapsible` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eCollapsible = createComponent({
  tagName: "m3e-collapsible",
  elementClass: M3eCollapsibleElement,
  react: React,
  events: {
    onOpening: "opening",
    onOpened: "opened",
    onClosing: "closing",
    onClosed: "closed",
  },
});
