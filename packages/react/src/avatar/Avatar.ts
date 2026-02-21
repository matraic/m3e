import React from "react";
import { createComponent } from "@lit/react";

import { M3eAvatarElement } from "@m3e/avatar";
export type { M3eAvatarElement } from "@m3e/avatar";
/**
 * React wrapper for the `m3e-avatar` web component from `@m3e/avatar`.
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
export const M3eAvatar = createComponent({
  tagName: "m3e-avatar",
  elementClass: M3eAvatarElement,
  react: React,
});
