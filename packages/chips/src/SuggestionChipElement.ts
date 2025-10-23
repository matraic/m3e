import { nothing } from "lit";
import { customElement } from "lit/decorators.js";

import {
  AttachInternals,
  Disabled,
  DisabledInteractive,
  Focusable,
  FormSubmitter,
  KeyboardClick,
  LinkButton,
  Role,
} from "@m3e/core";

import { M3eChipElement } from "./ChipElement";

/**
 * A chip used to help narrow a user's intent by presenting dynamically generated suggestions, such as
 * suggested responses or search filters.
 *
 * @description
 * The `m3e-suggestion-chip` component presents a suggestion chip, offering users contextually relevant
 * actions or responses. It is designed for dynamic suggestion scenarios, such as search filters or
 * smart replies, and supports accessibility, keyboard interaction, and expressive state styling in line
 * with Material 3 guidelines.  Appearance variants include `elevated` and `outlined`, enabling visual
 * differentiation and contextual emphasis.
 *
 * @example
 * The following example illustrates use of the `m3e-suggestion-chip`.  In this example, multiple chips are nested inside
 * a `m3e-chip-set` container to create a cohesive set of chips. The container is given the ARIA `role="group"` to convey
 * to assistive technologies that the chips are part of a related set of element.
 * ```html
 * <m3e-chip-set role="group" aria-label="Suggested replies">
 *  <m3e-suggestion-chip>Sounds good!</m3e-suggestion-chip>
 *  <m3e-suggestion-chip>Can you clarify?</m3e-suggestion-chip>
 *  <m3e-suggestion-chip>Let's do it.</m3e-suggestion-chip>
 *  <m3e-suggestion-chip>Maybe later.</m3e-suggestion-chip>
 * </m3e-chip-set>
 * ```
 *
 * @tag m3e-suggestion-chip
 *
 * @slot - Renders the label of the chip.
 * @slot icon - Renders an icon before the chip's label.
 *
 * @attr disabled - A value indicating whether the element is disabled.
 * @attr disabled-interactive - A value indicating whether the element is disabled and interactive.
 * @attr download - A value indicating whether the `target` of the link button will be downloaded, optionally specifying the new name of the file.
 * @attr href - The URL to which the link button points.
 * @attr name - The name of the element, submitted as a pair with the element's `value` as part of form data, when the element is used to submit a form.
 * @attr rel - The relationship between the `target` of the link button and the document.
 * @attr target - The target of the link button.
 * @attr type - The type of the element.
 * @attr value - A string representing the value of the chip.
 * @attr variant - The appearance variant of the chip.
 *
 * @fires click - Emitted when the element is clicked.
 *
 * @cssprop --m3e-chip-container-shape - Border radius of the chip container.
 * @cssprop --m3e-chip-container-height - Base height of the chip container before density adjustment.
 * @cssprop --m3e-chip-label-text-font-size - Font size of the chip label text.
 * @cssprop --m3e-chip-label-text-font-weight - Font weight of the chip label text.
 * @cssprop --m3e-chip-label-text-line-height - Line height of the chip label text.
 * @cssprop --m3e-chip-label-text-tracking - Letter spacing of the chip label text.
 * @cssprop --m3e-chip-label-text-color - Label text color in default state.
 * @cssprop --m3e-chip-icon-color - Icon color in default state.
 * @cssprop --m3e-chip-icon-size - Font size of leading/trailing icons.
 * @cssprop --m3e-chip-spacing - Horizontal gap between chip content elements.
 * @cssprop --m3e-chip-padding-start - Default start padding when no icon is present.
 * @cssprop --m3e-chip-padding-end - Default end padding when no trailing icon is present.
 * @cssprop --m3e-chip-with-icon-padding-start - Start padding when leading icon is present.
 * @cssprop --m3e-chip-with-icon-padding-end - End padding when trailing icon is present.
 * @cssprop --m3e-chip-disabled-label-text-color - Base color for disabled label text.
 * @cssprop --m3e-chip-disabled-label-text-opacity - Opacity applied to disabled label text.
 * @cssprop --m3e-chip-disabled-icon-color - Base color for disabled icons.
 * @cssprop --m3e-chip-disabled-icon-opacity - Opacity applied to disabled icons.
 * @cssprop --m3e-elevated-chip-container-color - Background color for elevated variant.
 * @cssprop --m3e-elevated-chip-elevation - Elevation level for elevated variant.
 * @cssprop --m3e-elevated-chip-hover-elevation - Elevation level on hover.
 * @cssprop --m3e-elevated-chip-disabled-container-color - Background color for disabled elevated variant.
 * @cssprop --m3e-elevated-chip-disabled-container-opacity - Opacity applied to disabled elevated background.
 * @cssprop --m3e-elevated-chip-disabled-elevation - Elevation level for disabled elevated variant.
 * @cssprop --m3e-outlined-chip-outline-thickness - Outline thickness for outlined variant.
 * @cssprop --m3e-outlined-chip-outline-color - Outline color for outlined variant.
 * @cssprop --m3e-outlined-chip-disabled-outline-color - Outline color for disabled outlined variant.
 * @cssprop --m3e-outlined-chip-disabled-outline-opacity - Opacity applied to disabled outline.
 */
@customElement("m3e-suggestion-chip")
export class M3eSuggestionChipElement extends FormSubmitter(
  AttachInternals(
    LinkButton(KeyboardClick(Focusable(DisabledInteractive(Disabled(Role(M3eChipElement, "button")))))),
    true
  )
) {
  /** @internal @inheritdoc */
  protected override _renderTrailingIcon(): unknown {
    return nothing;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-suggestion-chip": M3eSuggestionChipElement;
  }
}
