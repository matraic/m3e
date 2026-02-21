import React from "react";
import { createComponent } from "@lit/react";

import { M3eCheckboxElement } from "@m3e/checkbox";
export type { M3eCheckboxElement } from "@m3e/checkbox";

/**
 * React wrapper for the `m3e-checkbox` web component from `@m3e/checkbox`.
 *
 * This component renders the underlying `<m3e-checkbox>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-checkbox>` instance for imperative access.
 *
 * See the `m3e-checkbox` documentation in `@m3e/checkbox` for full details on behavior,
 * styling, accessibility, and supported events.
 */
export const M3eCheckbox = createComponent({
  tagName: "m3e-checkbox",
  elementClass: M3eCheckboxElement,
  react: React,
  events: {
    onInput: "input",
    onInvalid: "invalid",
    onChange: "change",
    onClick: "click",
  },
});
