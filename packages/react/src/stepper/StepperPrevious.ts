import React from "react";
import { createComponent } from "@lit/react";

import { M3eStepperPreviousElement } from "@m3e/stepper";
export type { M3eStepperPreviousElement } from "@m3e/stepper";

/**
 * React wrapper for the `m3e-stepper-previous` web component from `@m3e/stepper`.
 *
 * This component renders the underlying `<m3e-stepper-previous>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-stepper-previous>` instance for imperative access.
 *
 * See the `m3e-stepper-previous` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eStepperPrevious = createComponent({
  tagName: "m3e-stepper-previous",
  elementClass: M3eStepperPreviousElement,
  react: React,
});
