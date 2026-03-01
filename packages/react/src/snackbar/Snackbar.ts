import React from "react";
import { createComponent } from "@lit/react";

import { M3eSnackbarElement } from "@m3e/web/snackbar";
export type { M3eSnackbarElement, SnackbarOptions } from "@m3e/web/snackbar";

/**
 * React binding for the `m3e-snackbar` Web Component from `@m3e/web/snackbar`.
 *
 * This component renders the underlying `<m3e-snackbar>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-snackbar>` instance for imperative access.
 *
 * See the `m3e-snackbar` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */

// Checking if the code is running in the browser
const isBrowser = typeof window !== "undefined";

// Defining element
export const M3eSnackbar = isBrowser ? createComponent({
  tagName: "m3e-snackbar",
  elementClass: M3eSnackbarElement,
  react: React,
}) : null;
