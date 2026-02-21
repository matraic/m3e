import React from "react";
import { createComponent } from "@lit/react";

import { M3eListActionElement } from "@m3e/list";
export type { M3eListActionElement } from "@m3e/list";

/**
 * React wrapper for the `m3e-list-action` web component from `@m3e/list`.
 *
 * This component renders the underlying `<m3e-list-action>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-list-action>` instance for imperative access.
 *
 * See the `m3e-list-action` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eListAction = createComponent({
  tagName: "m3e-list-action",
  elementClass: M3eListActionElement,
  react: React,
  events: {
    onClick: "click",
  },
});
