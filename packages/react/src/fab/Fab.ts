import React from "react";
import { createComponent } from "@lit/react";

import { M3eFabElement } from "@m3e/web/fab";
export type { FabSize, FabVariant, M3eFabElement } from "@m3e/web/fab";

/**
 * React binding for the `m3e-fab` Web Component from `@m3e/web/fab`.
 *
 * This component renders the underlying `<m3e-fab>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-fab>` instance for imperative access.
 *
 * See the `m3e-fab` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eFab = createComponent({
  tagName: "m3e-fab",
  elementClass: M3eFabElement,
  react: React,
  events: {
    onClick: "click",
  },
});
