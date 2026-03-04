import React from "react";
import { createComponent } from "@lit/react";

import { M3eExpandableListItemElement } from "@m3e/web/list";
export type { M3eExpandableListItemElement } from "@m3e/web/list";

/**
 * React binding for the `m3e-expandable-list-item` Web Component from `@m3e/web/list`.
 *
 * This component renders the underlying `<m3e-expandable-list-item>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-expandable-list-item>` instance for imperative access.
 *
 * See the `m3e-expandable-list-item` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eExpandableListItem = createComponent({
  tagName: "m3e-expandable-list-item",
  elementClass: M3eExpandableListItemElement,
  react: React,
  events: {
    onOpening: "opening",
    onOpened: "opened",
    onClosing: "closing",
    onClosed: "closed",
  },
});
