import React from "react";
import { createComponent } from "@lit/react";

import { M3eCalendarElement } from "@m3e/web/calendar";
export type { M3eCalendarElement, CalendarView } from "@m3e/web/calendar";

/**
 * React binding for the `m3e-calendar` Web Component from `@m3e/web/calendar`.
 *
 * This component renders the underlying `<m3e-calendar>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-calendar>` instance for imperative access.
 *
 * See the `m3e-calendar` documentation for full details on behavior,
 * styling, accessibility, and supported events.
 */
export const M3eCalendar = createComponent({
  tagName: "m3e-calendar",
  elementClass: M3eCalendarElement,
  react: React,
  events: {
    onChange: "change",
  },
});
