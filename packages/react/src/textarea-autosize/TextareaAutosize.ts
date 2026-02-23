import React from "react";
import { createComponent } from "@lit/react";

import { M3eTextareaAutosizeElement } from "@m3e/web/textarea-autosize";
export type { M3eTextareaAutosizeElement } from "@m3e/web/textarea-autosize";

/**
 * React binding for the `m3e-textarea-autosize` Web Component from `@m3e/textarea-autosize`.
 *
 * This component renders the underlying `<m3e-textarea-autosize>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-textarea-autosize>` instance for imperative access.
 *
 * See the `m3e-textarea-autosize` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eTextareaAutosize = createComponent({
  tagName: "m3e-textarea-autosize",
  elementClass: M3eTextareaAutosizeElement,
  react: React,
});
