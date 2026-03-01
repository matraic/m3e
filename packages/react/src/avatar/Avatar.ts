import React from "react";
import { createComponent } from "@lit/react";

import { M3eAvatarElement } from "@m3e/web/avatar";
export type { M3eAvatarElement } from "@m3e/web/avatar";
/**
 * React binding for the `m3e-avatar` Web Component from `@m3e/web/avatar`.
 *
 * This component renders the underlying `<m3e-avatar>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-avatar>` instance for imperative access.
 *
 * See the `m3e-avatar` documentation in `@m3e/avatar` for full details on behavior,
 * styling, accessibility, and supported events.
 */

// Checking if the code is running in the browser
const isBrowser = typeof window !== "undefined";

// Defining element

export const M3eAvatar = isBrowser ? createComponent({
  tagName: "m3e-avatar",
  elementClass: M3eAvatarElement,
  react: React,
}) : null;
