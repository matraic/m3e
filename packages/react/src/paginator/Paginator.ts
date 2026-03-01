import React from "react";
import { createComponent, EventName } from "@lit/react";

import { M3ePaginatorElement, PageEventDetail } from "@m3e/web/paginator";
export type { M3ePaginatorElement, PageEventDetail } from "@m3e/web/paginator";

/**
 * React binding for the `m3e-paginator` Web Component from `@m3e/web/paginator`.
 *
 * This component renders the underlying `<m3e-paginator>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-paginator>` instance for imperative access.
 *
 * See the `m3e-paginator` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */

// Checking if the code is running in the browser
const isBrowser = typeof window !== "undefined";

// Defining element
export const M3ePaginator = isBrowser ? createComponent({
  tagName: "m3e-paginator",
  elementClass: M3ePaginatorElement,
  react: React,
  events: {
    onPage: "page" as EventName<CustomEvent<PageEventDetail>>,
  },
}) : null;
