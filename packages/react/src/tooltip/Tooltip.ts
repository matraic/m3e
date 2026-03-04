import React from "react";
import { createComponent } from "@lit/react";

import { M3eTooltipElement } from "@m3e/web/tooltip";
export type { M3eTooltipElement, TooltipPosition, TooltipTouchGestures } from "@m3e/web/tooltip";

/**
 * React binding for the `m3e-tooltip` Web Component from `@m3e/web/tooltip`.
 *
 * This component renders the underlying `<m3e-tooltip>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-tooltip>` instance for imperative access.
 *
 * See the `m3e-tooltip` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eTooltip = createComponent({
  tagName: "m3e-tooltip",
  elementClass: M3eTooltipElement,
  react: React,
});
