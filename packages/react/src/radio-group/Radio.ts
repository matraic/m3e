import React from "react";
import { createComponent } from "@lit/react";

import { M3eRadioElement } from "@m3e/radio-group";
export type { M3eRadioElement } from "@m3e/radio-group";

/**
 * React wrapper for the `m3e-radio` web component from `@m3e/radio-group`.
 *
 * This component renders the underlying `<m3e-radio>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-radio>` instance for imperative access.
 *
 * See the `m3e-radio` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eRadio = createComponent({
  tagName: "m3e-radio",
  elementClass: M3eRadioElement,
  react: React,
  events: {
    onInput: "input",
    onChange: "change",
    onClick: "click",
  },
});
