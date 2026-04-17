import React from "react";
import { createComponent } from "@lit/react";

import { M3eSkeletonElement } from "@m3e/web/skeleton";
export type { M3eSkeletonElement, SkeletonAnimation, SkeletonShape } from "@m3e/web/skeleton";

/**
 * React binding for the `m3e-skeleton` Web Component from `@m3e/web/skeleton`.
 *
 * This component renders the underlying `<m3e-skeleton>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-skeleton>` instance for imperative access.
 *
 * See the `m3e-skeleton` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eSkeleton = createComponent({
  tagName: "m3e-skeleton",
  elementClass: M3eSkeletonElement,
  react: React,
});
