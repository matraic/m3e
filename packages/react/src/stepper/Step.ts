import React from "react";
import { createComponent } from "@lit/react";

import { M3eStepElement } from "@m3e/web/stepper";
export type { M3eStepElement } from "@m3e/web/stepper";

/**
 * React binding for the `m3e-step` Web Component from `@m3e/web/stepper`.
 *
 * This component renders the underlying `<m3e-step>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-step>` instance for imperative access.
 *
 * See the `m3e-step` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */

// Checking if the code is running in the browser
const isBrowser = typeof window !== "undefined";

// Defining element
export const M3eStep = isBrowser ? createComponent({
  tagName: "m3e-step",
  elementClass: M3eStepElement,
  react: React,
  events: {
    onInput: "input",
    onChange: "change",
    onClick: "click",
  },
}) : null;
