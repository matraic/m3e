import React from "react";
import { createComponent } from "@lit/react";

import { M3eNavPanelElement } from "@m3e/web/nav-bar";
export type { M3eNavPanelElement } from "@m3e/web/nav-bar";

/**
 * React binding for the `m3e-nav-panel` Web Component from `@m3e/web/nav-bar`.
 *
 * This component renders the underlying `<m3e-nav-panel>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-nav-panel>` instance for imperative access.
 *
 * See the `m3e-nav-panel` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eNavPanel = createComponent({
  tagName: "m3e-nav-panel",
  elementClass: M3eNavPanelElement,
  react: React,
});
