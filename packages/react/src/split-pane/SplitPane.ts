import React from "react";
import { createComponent } from "@lit/react";

import { M3eSplitPaneElement } from "@m3e/web/split-pane";
export type { M3eSplitPaneElement, SplitPaneOrientation } from "@m3e/web/split-pane";

/**
 * React binding for the `m3e-split-pane` Web Component from `@m3e/web/split-pane`.
 *
 * This component renders the underlying `<m3e-split-pane>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-split-pane>` instance for imperative access.
 *
 * See the `m3e-split-pane` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eSplitPane = createComponent({
  tagName: "m3e-split-pane",
  elementClass: M3eSplitPaneElement,
  react: React,
  events: {
    onInput: "input",
    onChange: "change",
  },
});
