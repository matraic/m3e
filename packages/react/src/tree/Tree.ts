import React from "react";
import { createComponent } from "@lit/react";

import { M3eTreeElement } from "@m3e/web/tree";
export type { M3eTreeElement } from "@m3e/web/tree";

/**
 * React binding for the `m3e-tree` Web Component from `@m3e/web/tree`.
 *
 * This component renders the underlying `<m3e-tree>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-tree>` instance for imperative access.
 *
 * See the `m3e-tree` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eTree = createComponent({
  tagName: "m3e-tree",
  elementClass: M3eTreeElement,
  react: React,
  events: {
    onChange: "change",
  },
});
