import React from "react";
import { createComponent } from "@lit/react";

import { M3eBreadcrumbElement } from "@m3e/web/breadcrumb";
export type { M3eBreadcrumbElement } from "@m3e/web/breadcrumb";

/**
 * React binding for the `m3e-breadcrumb` Web Component from `@m3e/web/breadcrumb`.
 *
 * This component renders the underlying `<m3e-breadcrumb>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-breadcrumb>` instance for imperative access.
 *
 * See the `m3e-breadcrumb` documentation for full details on behavior,
 * styling, accessibility, and supported events.
 */
export const M3eBreadcrumb = createComponent({
  tagName: "m3e-breadcrumb",
  elementClass: M3eBreadcrumbElement,
  react: React,
});
