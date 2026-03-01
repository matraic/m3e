import React from "react";
import { createComponent } from "@lit/react";

import { M3eStepPanelElement } from "@m3e/web/stepper";
export type { M3eStepPanelElement } from "@m3e/web/stepper";

/**
 * React binding for the `m3e-step-panel` Web Component from `@m3e/web/stepper`.
 *
 * This component renders the underlying `<m3e-step-panel>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-step-panel>` instance for imperative access.
 *
 * See the `m3e-step-panel` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */

// Checking if the code is running in the browser
const isBrowser = typeof window !== "undefined";

// Defining element
export const M3eStepPanel = isBrowser ? createComponent({
  tagName: "m3e-step-panel",
  elementClass: M3eStepPanelElement,
  react: React,
}) : null;
