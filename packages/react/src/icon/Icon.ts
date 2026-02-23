import React from "react";
import { createComponent } from "@lit/react";

import { M3eIconElement } from "@m3e/web/icon";
export type { IconGrade, IconVariant, M3eIconElement } from "@m3e/web/icon";

/**
 * React binding for the `m3e-icon` Web Component from `@m3e/icon`.
 *
 * This component renders the underlying `<m3e-icon>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-icon>` instance for imperative access.
 *
 * See the `m3e-icon` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eIcon = createComponent({
  tagName: "m3e-icon",
  elementClass: M3eIconElement,
  react: React,
});
