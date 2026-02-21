import React from "react";
import { createComponent } from "@lit/react";

import { M3eDialogActionElement } from "@m3e/dialog";
export type { M3eDialogActionElement } from "@m3e/dialog";

/**
 * React wrapper for the `m3e-dialog-action` web component from `@m3e/dialog`.
 *
 * This component renders the underlying `<m3e-dialog-action>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-dialog-action>` instance for imperative access.
 *
 * See the `m3e-dialog-action` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eDialogAction = createComponent({
  tagName: "m3e-dialog-action",
  elementClass: M3eDialogActionElement,
  react: React,
});
