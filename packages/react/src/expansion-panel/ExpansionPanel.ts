import React from "react";
import { createComponent } from "@lit/react";

import { M3eExpansionPanelElement } from "@m3e/web/expansion-panel";
export type {
  ExpansionToggleDirection,
  ExpansionTogglePosition,
  M3eExpansionPanelElement,
} from "@m3e/web/expansion-panel";

/**
 * React binding for the `m3e-expansion-panel` Web Component from `@m3e/web/expansion-panel`.
 *
 * This component renders the underlying `<m3e-expansion-panel>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-expansion-panel>` instance for imperative access.
 *
 * See the `m3e-expansion-panel` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */

// Checking if the code is running in the browser
const isBrowser = typeof window !== "undefined";

// Defining element

export const M3eExpansionPanel = isBrowser ? createComponent({
  tagName: "m3e-expansion-panel",
  elementClass: M3eExpansionPanelElement,
  react: React,
  events: {
    onOpening: "opening",
    onOpened: "opened",
    onClosing: "closing",
    onClosed: "closed",
  },
}) : null;
