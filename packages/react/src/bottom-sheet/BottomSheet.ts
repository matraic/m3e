import React from "react";
import { createComponent } from "@lit/react";

import { M3eBottomSheetElement } from "@m3e/bottom-sheet";
export type { M3eBottomSheetElement } from "@m3e/bottom-sheet";
/**
 * React wrapper for the `m3e-bottom-sheet` web component from `@m3e/bottom-sheet`.
 *
 * This component renders the underlying `<m3e-bottom-sheet>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-bottom-sheet>` instance for imperative access.
 *
 * See the `m3e-bottom-sheet` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eBottomSheet = createComponent({
  tagName: "m3e-bottom-sheet",
  elementClass: M3eBottomSheetElement,
  react: React,
  events: {
    onOpening: "opening",
    onOpened: "opened",
    onClosing: "closing",
    onClosed: "closed",
    onCancel: "cancel",
  },
});
