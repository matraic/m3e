import React from "react";
import { createComponent } from "@lit/react";

import { M3eHeadingElement } from "@m3e/heading";
export type { HeadingLevel, HeadingSize, HeadingVariant, M3eHeadingElement } from "@m3e/heading";

/**
 * React wrapper for the `m3e-heading` web component from `@m3e/heading`.
 *
 * This component renders the underlying `<m3e-heading>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-heading>` instance for imperative access.
 *
 * See the `m3e-heading` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eHeading = createComponent({
  tagName: "m3e-heading",
  elementClass: M3eHeadingElement,
  react: React,
});
