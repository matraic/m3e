import React from "react";
import { createComponent } from "@lit/react";

import { M3eBadgeElement } from "@m3e/badge";
export type { BadgeSize, BadgePosition, M3eBadgeElement } from "@m3e/badge";

/**
 * React wrapper for the `m3e-badge` web component from `@m3e/badge`.
 *
 * This component renders the underlying `<m3e-badge>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-badge>` instance for imperative access.
 *
 * See the `m3e-badge` documentation in `@m3e/badge` for full details on behavior,
 * styling, accessibility, and supported events.
 */
export const M3eBadge = createComponent({
  tagName: "m3e-badge",
  elementClass: M3eBadgeElement,
  react: React,
});
