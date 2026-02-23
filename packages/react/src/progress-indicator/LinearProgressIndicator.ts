import React from "react";
import { createComponent } from "@lit/react";

import { M3eLinearProgressIndicatorElement } from "@m3e/web/progress-indicator";
export type {
  ProgressIndicatorVariant,
  LinearProgressMode,
  M3eLinearProgressIndicatorElement,
} from "@m3e/web/progress-indicator";

/**
 * React binding for the `m3e-linear-progress-indicator` Web Component from `@m3e/progress-indicator`.
 *
 * This component renders the underlying `<m3e-linear-progress-indicator>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-linear-progress-indicator>` instance for imperative access.
 *
 * See the `m3e-linear-progress-indicator` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eLinearProgressIndicator = createComponent({
  tagName: "m3e-linear-progress-indicator",
  elementClass: M3eLinearProgressIndicatorElement,
  react: React,
});
