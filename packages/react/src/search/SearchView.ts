import React from "react";
import { createComponent, EventName } from "@lit/react";

import { M3eSearchViewElement, SearchViewQueryEventDetail } from "@m3e/web/search";
export type { M3eSearchViewElement, SearchViewMode, SearchViewQueryEventDetail } from "@m3e/web/search";

/**
 * React binding for the `m3e-search-view` Web Component from `@m3e/web/search`.
 *
 * This component renders the underlying `<m3e-search-view>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-search-view>` instance for imperative access.
 *
 * See the `m3e-search-view` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eSearchView = createComponent({
  tagName: "m3e-search-view",
  elementClass: M3eSearchViewElement,
  react: React,
  events: {
    onClear: "clear",
    onQuery: "query" as EventName<CustomEvent<SearchViewQueryEventDetail>>,
    onBeforeToggle: "beforetoggle",
    onToggle: "toggle",
  },
});
