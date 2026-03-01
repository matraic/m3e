import React from "react";
import { createComponent } from "@lit/react";

import { M3eBottomSheetActionElement } from "@m3e/web/bottom-sheet";
export type { M3eBottomSheetActionElement } from "@m3e/web/bottom-sheet";

/**
 * React binding for the `m3e-bottom-sheet-action` Web Component from `@m3e/web/bottom-sheet`.
 *
 * This component renders the underlying `<m3e-bottom-sheet-action>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-bottom-sheet-action>` instance for imperative access.
 *
 * See the `m3e-bottom-sheet-action` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eBottomSheetAction = createComponent({
  tagName: "m3e-bottom-sheet-action",
  elementClass: M3eBottomSheetActionElement,
  react: React,
});
