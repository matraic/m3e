import React from "react";
import { createComponent } from "@lit/react";

import { M3eTocElement } from "@m3e/web/toc";
export type { M3eTocElement } from "@m3e/web/toc";

/**
 * React binding for the `m3e-toc` Web Component from `@m3e/toc`.
 *
 * This component renders the underlying `<m3e-toc>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-toc>` instance for imperative access.
 *
 * See the `m3e-toc` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eToc = createComponent({
  tagName: "m3e-toc",
  elementClass: M3eTocElement,
  react: React,
});
