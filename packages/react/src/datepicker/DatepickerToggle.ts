import React from "react";
import { createComponent } from "@lit/react";

import { M3eDatepickerToggleElement } from "@m3e/web/datepicker";
export type { M3eDatepickerToggleElement } from "@m3e/web/datepicker";

/**
 * React binding for the `m3e-datepicker-toggle` Web Component from `@m3e/web/datepicker`.
 *
 * This component renders the underlying `<m3e-datepicker-toggle>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-datepicker-toggle>` instance for imperative access.
 *
 * See the `m3e-datepicker-toggle` for full details on behavior,
 * styling, accessibility, and supported events.
 */
export const M3eDatepickerToggle = createComponent({
  tagName: "m3e-datepicker-toggle",
  elementClass: M3eDatepickerToggleElement,
  react: React,
});
