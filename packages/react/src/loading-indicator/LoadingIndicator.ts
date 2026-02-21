import React from "react";
import { createComponent } from "@lit/react";

import { M3eLoadingIndicatorElement } from "@m3e/loading-indicator";
export type { LoadingIndicatorVariant, M3eLoadingIndicatorElement } from "@m3e/loading-indicator";

/**
 * React wrapper for the `m3e-loading-indicator` web component from `@m3e/loading-indicator`.
 *
 * This component renders the underlying `<m3e-loading-indicator>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-loading-indicator>` instance for imperative access.
 *
 * See the `m3e-loading-indicator` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eLoadingIndicator = createComponent({
  tagName: "m3e-loading-indicator",
  elementClass: M3eLoadingIndicatorElement,
  react: React,
});
