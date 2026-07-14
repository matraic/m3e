import React from "react";
import { createComponent } from "@lit/react";

import { M3eTimepickerToggleElement } from "@m3e/web/timepicker";
export type { M3eTimepickerToggleElement } from "@m3e/web/timepicker";

/**
 * React binding for the `m3e-timepicker-toggle` Web Component from `@m3e/web/timepicker`.
 *
 * This component renders the underlying `<m3e-timepicker-toggle>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-timepicker-toggle>` instance for imperative access.
 *
 * See the `m3e-timepicker-toggle` for full details on behavior,
 * styling, accessibility, and supported events.
 */
export const M3eTimepickerToggle = createComponent({
  tagName: "m3e-timepicker-toggle",
  elementClass: M3eTimepickerToggleElement,
  react: React,
});
