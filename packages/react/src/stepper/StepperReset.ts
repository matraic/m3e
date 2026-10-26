import React from "react";
import { createComponent } from "@lit/react";

import { M3eStepperResetElement } from "@pulse/web/stepper";
export type { M3eStepperResetElement } from "@pulse/web/stepper";

/**
 * React binding for the `m3e-stepper-reset` Web Component from `@pulse/web/stepper`.
 *
 * This component renders the underlying `<m3e-stepper-reset>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-stepper-reset>` instance for imperative access.
 *
 * See the `m3e-stepper-reset` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eStepperReset = createComponent({
  tagName: "m3e-stepper-reset",
  elementClass: M3eStepperResetElement,
  react: React,
});
