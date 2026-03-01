import React from "react";
import { createComponent } from "@lit/react";

import { M3eButtonGroupElement } from "@m3e/web/button-group";
export type { ButtonGroupSize, ButtonGroupVariant, M3eButtonGroupElement } from "@m3e/web/button-group";

/**
 * React binding for the `m3e-button-group` Web Component from `@m3e/web/button-group`.
 *
 * This component renders the underlying `<m3e-button-group>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-button-group>` instance for imperative access.
 *
 * See the `m3e-button-group` documentation in `@m3e/button-group` for full details on behavior,
 * styling, accessibility, and supported events.
 */

// Checking if the code is running in the browser
const isBrowser = typeof window !== "undefined";

// Defining element

export const M3eButtonGroup = isBrowser ? createComponent({
  tagName: "m3e-button-group",
  elementClass: M3eButtonGroupElement,
  react: React,
}) : null;