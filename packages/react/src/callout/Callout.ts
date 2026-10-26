import React from "react";
import { createComponent } from "@lit/react";

import { M3eCalloutElement } from "@pulse/web/callout";
export type { M3eCalloutElement, CalloutVariant, CalloutShape } from "@pulse/web/callout";

/**
 * React binding for the `m3e-callout` Web Component from `@pulse/web/callout`.
 *
 * This component renders the underlying `<m3e-callout>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-callout>` instance for imperative access.
 *
 * See the `m3e-callout` documentation for full details on behavior,
 * styling, accessibility, and supported events.
 */
export const M3eCallout = createComponent({
  tagName: "m3e-callout",
  elementClass: M3eCalloutElement,
  react: React,
});
