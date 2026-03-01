import React from "react";
import { createComponent } from "@lit/react";

import { M3eScrollContainerElement } from "@m3e/web/core";
export type { M3eScrollContainerElement, ScrollDividers } from "@m3e/web/core";

/**
 * React binding for the `m3e-scroll-container` Web Component from `@m3e/web/web/core`.
 *
 * This component renders the underlying `<m3e-scroll-container>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-scroll-container>` instance for imperative access.
 *
 * See the `m3e-scroll-container` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */

// Checking if the code is running in the browser
const isBrowser = typeof window !== "undefined";

// Defining element

export const M3eScrollContainer = isBrowser ? createComponent({
  tagName: "m3e-scroll-container",
  elementClass: M3eScrollContainerElement,
  react: React,
}) : null;
