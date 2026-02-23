import React from "react";
import { createComponent } from "@lit/react";

import { M3eShapeElement } from "@m3e/web/shape";
export type { M3eShapeElement, ShapeName } from "@m3e/web/shape";

/**
 * React binding for the `m3e-shape` Web Component from `@m3e/shape`.
 *
 * This component renders the underlying `<m3e-shape>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-shape>` instance for imperative access.
 *
 * See the `m3e-shape` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eShape = createComponent({
  tagName: "m3e-shape",
  elementClass: M3eShapeElement,
  react: React,
});
