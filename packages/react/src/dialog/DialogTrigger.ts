import React from "react";
import { createComponent } from "@lit/react";

import { M3eDialogTriggerElement } from "@m3e/web/dialog";
export type { M3eDialogTriggerElement } from "@m3e/web/dialog";

/**
 * React binding for the `m3e-dialog-trigger` Web Component from `@m3e/web/dialog`.
 *
 * This component renders the underlying `<m3e-dialog-trigger>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-dialog-trigger>` instance for imperative access.
 *
 * See the `m3e-dialog-trigger` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eDialogTrigger = createComponent({
  tagName: "m3e-dialog-trigger",
  elementClass: M3eDialogTriggerElement,
  react: React,
});
