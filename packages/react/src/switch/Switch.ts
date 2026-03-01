import React from "react";
import { createComponent } from "@lit/react";

import { M3eSwitchElement } from "@m3e/web/switch";
export type { M3eSwitchElement, SwitchIcons } from "@m3e/web/switch";

/**
 * React binding for the `m3e-switch` Web Component from `@m3e/web/switch`.
 *
 * This component renders the underlying `<m3e-switch>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-switch>` instance for imperative access.
 *
 * See the `m3e-switch` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eSwitch = createComponent({
  tagName: "m3e-switch",
  elementClass: M3eSwitchElement,
  react: React,
  events: {
    onInput: "input",
    onChange: "change",
    onClick: "click",
  },
});
