import React from "react";
import { createComponent } from "@lit/react";

import { M3eBottomSheetTriggerElement } from "@m3e/web/bottom-sheet";
export type { M3eBottomSheetTriggerElement } from "@m3e/web/bottom-sheet";

/**
 * React binding for the `m3e-bottom-sheet-trigger` Web Component from `@m3e/bottom-sheet`.
 *
 * This component renders the underlying `<m3e-bottom-sheet-trigger>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-bottom-sheet-trigger>` instance for imperative access.
 *
 * See the `m3e-bottom-sheet-trigger` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eBottomSheetTrigger = createComponent({
  tagName: "m3e-bottom-sheet-trigger",
  elementClass: M3eBottomSheetTriggerElement,
  react: React,
});
