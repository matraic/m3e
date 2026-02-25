import React from "react";
import { createComponent } from "@lit/react";

import { M3eButtonElement } from "@m3e/web/button";
export type { ButtonShape, ButtonSize, ButtonVariant, M3eButtonElement } from "@m3e/web/button";

/**
 * React binding for the `m3e-button` Web Component from `@m3e/web/button`.
 *
 * This component renders the underlying `<m3e-button>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-button>` instance for imperative access.
 *
 * See the `m3e-button` documentation in `@m3e/button` for full details on behavior,
 * styling, accessibility, and supported events.
 */
export const M3eButton = createComponent({
  tagName: "m3e-button",
  elementClass: M3eButtonElement,
  react: React,
  events: {
    onInput: "input",
    onChange: "change",
    onClick: "click",
  },
});
