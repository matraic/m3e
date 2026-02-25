import React from "react";
import { createComponent } from "@lit/react";

import { M3eChipElement } from "@m3e/web/chips";
export type { ChipVariant, M3eChipElement } from "@m3e/web/chips";

/**
 * React binding for the `m3e-chip` Web Component from `@m3e/web/chips`.
 *
 * This component renders the underlying `<m3e-chip>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-chip>` instance for imperative access.
 *
 * See the `m3e-chip` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eChip = createComponent({
  tagName: "m3e-chip",
  elementClass: M3eChipElement,
  react: React,
});
