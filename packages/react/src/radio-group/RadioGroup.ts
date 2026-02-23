import React from "react";
import { createComponent } from "@lit/react";

import { M3eRadioGroupElement } from "@m3e/web/radio-group";
export type { M3eRadioGroupElement } from "@m3e/web/radio-group";

/**
 * React binding for the `m3e-radio-group` Web Component from `@m3e/radio-group`.
 *
 * This component renders the underlying `<m3e-radio-group>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-radio-group>` instance for imperative access.
 *
 * See the `m3e-radio-group` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eRadioGroup = createComponent({
  tagName: "m3e-radio-group",
  elementClass: M3eRadioGroupElement,
  react: React,
  events: {
    onChange: "change",
  },
});
