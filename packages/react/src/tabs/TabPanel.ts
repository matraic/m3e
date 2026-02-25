import React from "react";
import { createComponent } from "@lit/react";

import { M3eTabPanelElement } from "@m3e/web/tabs";
export type { M3eTabPanelElement } from "@m3e/web/tabs";

/**
 * React binding for the `m3e-tab-panel` Web Component from `@m3e/web/tabs`.
 *
 * This component renders the underlying `<m3e-tab-panel>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-tab-panel>` instance for imperative access.
 *
 * See the `m3e-tab-panel` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eTabPanel = createComponent({
  tagName: "m3e-tab-panel",
  elementClass: M3eTabPanelElement,
  react: React,
});
