import React from "react";
import { createComponent } from "@lit/react";

import { M3eActionListElement } from "@m3e/list";
export type { M3eActionListElement } from "@m3e/list";

/**
 * React wrapper for the `m3e-action-list` web component from `@m3e/list`.
 *
 * This component renders the underlying `<m3e-action-list>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-action-list>` instance for imperative access.
 *
 * See the `m3e-action-list` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eActionList = createComponent({
  tagName: "m3e-action-list",
  elementClass: M3eActionListElement,
  react: React,
});
