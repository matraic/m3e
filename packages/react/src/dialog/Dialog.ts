import React from "react";
import { createComponent } from "@lit/react";

import { M3eDialogElement } from "@m3e/web/dialog";
export type { M3eDialogElement } from "@m3e/web/dialog";

/**
 * React binding for the `m3e-dialog` Web Component from `@m3e/web/dialog`.
 *
 * This component renders the underlying `<m3e-dialog>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-dialog>` instance for imperative access.
 *
 * See the `m3e-dialog` documentation in `@m3e/dialog` for full details on behavior,
 * styling, accessibility, and supported events.
 */
export const M3eDialog = createComponent({
  tagName: "m3e-dialog",
  elementClass: M3eDialogElement,
  react: React,
  events: {
    onOpening: "opening",
    onOpened: "opened",
    onClosing: "closing",
    onClosed: "closed",
    onCancel: "cancel",
  },
});
