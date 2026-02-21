import React from "react";
import { createComponent } from "@lit/react";

import { M3eSplitButtonElement } from "@m3e/split-button";
export type { M3eSplitButtonElement, SplitButtonVariant } from "@m3e/split-button";

/**
 * React wrapper for the `m3e-split-button` web component from `@m3e/split-button`.
 *
 * This component renders the underlying `<m3e-split-button>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-split-button>` instance for imperative access.
 *
 * See the `m3e-split-button` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eSplitButton = createComponent({
  tagName: "m3e-split-button",
  elementClass: M3eSplitButtonElement,
  react: React,
});
