import React from "react";
import { createComponent } from "@lit/react";

import { M3eTreeItemElement } from "@m3e/web/tree";
export type { M3eTreeItemElement } from "@m3e/web/tree";

/**
 * React binding for the `m3e-tree-item` Web Component from `@m3e/web/tree`.
 *
 * This component renders the underlying `<m3e-tree-item>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-tree-item>` instance for imperative access.
 *
 * See the `m3e-tree-item` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eTreeItem = createComponent({
  tagName: "m3e-tree-item",
  elementClass: M3eTreeItemElement,
  react: React,
  events: {
    onOpening: "opening",
    onOpened: "opened",
    onClosing: "closing",
    onClosed: "closed",
    onClick: "click",
  },
});
