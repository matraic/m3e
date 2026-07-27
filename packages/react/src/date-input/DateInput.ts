import React from "react";
import { createComponent } from "@lit/react";

import { M3eDateInputElement } from "@m3e/web/date-input";
export type { M3eDateInputElement, DateInputTimeFormat, DateInputType } from "@m3e/web/date-input";

/**
 * React binding for the `m3e-date-input` Web Component from `@m3e/web/datepicker`.
 *
 * This component renders the underlying `<m3e-date-input>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-date-input>` instance for imperative access.
 *
 * See the `m3e-date-input` documentation for full details on behavior,
 * styling, accessibility, and supported events.
 */
export const M3eDateInput = createComponent({
  tagName: "m3e-date-input",
  elementClass: M3eDateInputElement,
  react: React,
  events: {
    onBeforeInput: "beforeinput",
    onInput: "input",
    onInvalid: "invalid",
    onChange: "change",
  },
});
