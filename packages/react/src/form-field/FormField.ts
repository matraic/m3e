import React from "react";
import { createComponent } from "@lit/react";

import { M3eFormFieldElement } from "@m3e/web/form-field";
export type { FloatLabelType, FormFieldVariant, FormFieldControl, M3eFormFieldElement } from "@m3e/web/form-field";

/**
 * React binding for the `m3e-form-field` Web Component from `@m3e/form-field`.
 *
 * This component renders the underlying `<m3e-form-field>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-form-field>` instance for imperative access.
 *
 * See the `m3e-form-field` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eFormField = createComponent({
  tagName: "m3e-form-field",
  elementClass: M3eFormFieldElement,
  react: React,
});
