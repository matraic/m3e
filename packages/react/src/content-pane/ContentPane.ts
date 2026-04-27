import React from "react";
import { createComponent } from "@lit/react";

import { M3eContentPaneElement } from "@m3e/web/content-pane";
export type { M3eContentPaneElement } from "@m3e/web/content-pane";

/**
 * React binding for the `m3e-content-pane` Web Component from `@m3e/web/content-pane`.
 *
 * This component renders the underlying `<m3e-content-pane>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-content-pane>` instance for imperative access.
 *
 * See the `m3e-content-pane` documentation for full details on behavior,
 * styling, accessibility, and supported events.
 */
export const M3eContentPane = createComponent({
  tagName: "m3e-content-pane",
  elementClass: M3eContentPaneElement,
  react: React,
});
