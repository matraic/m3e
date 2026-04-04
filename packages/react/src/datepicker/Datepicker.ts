import React from "react";
import { createComponent } from "@lit/react";

import { M3eDatepickerElement } from "@m3e/web/datepicker";
export type { M3eDatepickerElement, DatepickerVariant } from "@m3e/web/datepicker";

/**
 * React binding for the `m3e-datepicker` Web Component from `@m3e/web/datepicker`.
 *
 * This component renders the underlying `<m3e-datepicker>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-datepicker>` instance for imperative access.
 *
 * See the `m3e-datepicker` documentation for full details on behavior,
 * styling, accessibility, and supported events.
 */
export const M3eDatepicker = createComponent({
  tagName: "m3e-datepicker",
  elementClass: M3eDatepickerElement,
  react: React,
  events: {
    onChange: "change",
  },
});
