import React from "react";
import { createComponent } from "@lit/react";

import { M3eTimepickerElement } from "@m3e/web/timepicker";
export type {
  M3eTimepickerElement,
  TimepickerFormat,
  TimepickerMode,
  TimepickerOrientation,
  TimepickerPeriod,
  TimepickerView,
  TimepickerVariant,
} from "@m3e/web/timepicker";

/**
 * React binding for the `m3e-timepicker` Web Component from `@m3e/web/timepicker`.
 *
 * This component renders the underlying `<m3e-timepicker>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-timepicker>` instance for imperative access.
 *
 * See the `m3e-timepicker` documentation for full details on behavior,
 * styling, accessibility, and supported events.
 */
export const M3eTimepicker = createComponent({
  tagName: "m3e-timepicker",
  elementClass: M3eTimepickerElement,
  react: React,
  events: {
    onChange: "change",
    onBeforeToggle: "beforetoggle",
    onToggle: "toggle",
  },
});
