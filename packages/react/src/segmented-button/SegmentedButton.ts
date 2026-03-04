import React from "react";
import { createComponent } from "@lit/react";

import { M3eSegmentedButtonElement } from "@m3e/web/segmented-button";
export type { M3eSegmentedButtonElement } from "@m3e/web/segmented-button";

/**
 * React binding for the `m3e-segmented-button` Web Component from `@m3e/web/segmented-button`.
 *
 * This component renders the underlying `<m3e-segmented-button>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-segmented-button>` instance for imperative access.
 *
 * See the `m3e-segmented-button` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eSegmentedButton = createComponent({
  tagName: "m3e-segmented-button",
  elementClass: M3eSegmentedButtonElement,
  react: React,
  events: {
    onInput: "input",
    onChange: "change",
  },
});
