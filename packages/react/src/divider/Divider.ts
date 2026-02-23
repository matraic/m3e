import React from "react";
import { createComponent } from "@lit/react";

import { M3eDividerElement } from "@m3e/web/divider";
export type { M3eDividerElement } from "@m3e/web/divider";

/**
 * React binding for the `m3e-divider` Web Component from `@m3e/divider`.
 *
 * This component renders the underlying `<m3e-divider>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-divider>` instance for imperative access.
 *
 * See the `m3e-divider` documentation in `@m3e/divider` for full details on behavior,
 * styling, accessibility, and supported events.
 */
export const M3eDivider = createComponent({
  tagName: "m3e-divider",
  elementClass: M3eDividerElement,
  react: React,
});
