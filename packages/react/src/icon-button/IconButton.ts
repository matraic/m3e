import React from "react";
import { createComponent } from "@lit/react";

import { M3eIconButtonElement } from "@m3e/web/icon-button";
export type {
  IconButtonShape,
  IconButtonSize,
  IconButtonVariant,
  IconButtonWidth,
  M3eIconButtonElement,
} from "@m3e/web/icon-button";

/**
 * React binding for the `m3e-icon-button` Web Component from `@m3e/icon-button`.
 *
 * This component renders the underlying `<m3e-icon-button>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-icon-button>` instance for imperative access.
 *
 * See the `m3e-icon-button` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eIconButton = createComponent({
  tagName: "m3e-icon-button",
  elementClass: M3eIconButtonElement,
  react: React,
  events: {
    onInput: "input",
    onChange: "change",
    onClick: "click",
  },
});
