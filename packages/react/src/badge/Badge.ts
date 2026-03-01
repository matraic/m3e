import React from "react";
import { createComponent } from "@lit/react";

import { M3eBadgeElement } from "@m3e/web/badge";
export type { BadgeSize, BadgePosition, M3eBadgeElement } from "@m3e/web/badge";

/**
 * React binding for the `m3e-badge` Web Component from `@m3e/web/badge`.
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

// Checking if the code is running in the browser
const isBrowser = typeof window !== "undefined";

// Defining element

export const M3eBadge = isBrowser ? createComponent({
  tagName: "m3e-badge",
  elementClass: M3eBadgeElement,
  react: React,
}) : null;
