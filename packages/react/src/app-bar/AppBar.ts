import React from "react";
import { createComponent } from "@lit/react";

import { M3eAppBarElement } from "@m3e/web/app-bar";
export type { AppBarSize, M3eAppBarElement } from "@m3e/web/app-bar";

/**
 * React binding for the `m3e-app-bar` Web Component from `@m3e/app-bar`.
 *
 * This component renders the underlying `<m3e-app-bar>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-app-bar>` instance for imperative access.
 *
 * See the `m3e-app-bar` documentation in `@m3e/app-bar` for full details on behavior,
 * styling, accessibility, and supported events.
 */
export const M3eAppBar = createComponent({
  tagName: "m3e-app-bar",
  elementClass: M3eAppBarElement,
  react: React,
});
