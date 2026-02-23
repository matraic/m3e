import React from "react";
import { createComponent } from "@lit/react";

import { M3eRichTooltipActionElement } from "@m3e/web/tooltip";
export type { M3eRichTooltipActionElement } from "@m3e/web/tooltip";

/**
 * React binding for the `m3e-rich-tooltip-action` Web Component from `@m3e/tooltip`.
 *
 * This component renders the underlying `<m3e-rich-tooltip-action>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-rich-tooltip-action>` instance for imperative access.
 *
 * See the `m3e-rich-tooltip-action` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eRichTooltipAction = createComponent({
  tagName: "m3e-rich-tooltip-action",
  elementClass: M3eRichTooltipActionElement,
  react: React,
});
