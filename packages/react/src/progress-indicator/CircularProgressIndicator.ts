import React from "react";
import { createComponent } from "@lit/react";

import { M3eCircularProgressIndicatorElement } from "@m3e/web/progress-indicator";
export type { M3eCircularProgressIndicatorElement } from "@m3e/web/progress-indicator";

/**
 * React binding for the `m3e-circular-progress-indicator` Web Component from `@m3e/web/progress-indicator`.
 *
 * This component renders the underlying `<m3e-circular-progress-indicator>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-circular-progress-indicator>` instance for imperative access.
 *
 * See the `m3e-circular-progress-indicator` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */

// Checking if the code is running in the browser
const isBrowser = typeof window !== "undefined";

// Defining element
export const M3eCircularProgressIndicator = isBrowser ? createComponent({
  tagName: "m3e-circular-progress-indicator",
  elementClass: M3eCircularProgressIndicatorElement,
  react: React,
}) : null;
