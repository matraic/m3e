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
 * @summary
 * A chip users interact with to perform a smart or automated action that can span multiple applications.
 *
 * @description
 * The `m3e-assist-chip` component presents a Material 3 assist chip, providing users with quick access to
 * contextually relevant actions. It is designed for use cases like suggested actions, quick filters, or
 * secondary operations, and supports accessibility, keyboard interaction, and expressive state styling
 * in line with Material 3 guidelines.  Appearance variants include `elevated` and `outlined`, enabling visual
 * differentiation and contextual emphasis.
 *
 * @example
 * The following example illustrates use of the `m3e-assist-chip`.  In this example, multiple chips are nested inside
 * a `m3e-chip-set` container to create a cohesive set of chips. The container is given the ARIA `role="group"` to convey
 * to assistive technologies that the chips are part of a related set of element.
 * ```html
 * <m3e-chip-set role="group" aria-label="Quick actions">
 *  <m3e-assist-chip><m3e-icon slot="icon" name="edit"></m3e-icon>Edit</m3e-assist-chip>
 *  <m3e-assist-chip><m3e-icon slot="icon" name="delete"></m3e-icon>Delete</m3e-assist-chip>
 *  <m3e-assist-chip><m3e-icon slot="icon" name="content_copy"></m3e-icon>Copy</m3e-assist-chip>
 *  <m3e-assist-chip><m3e-icon slot="icon" name="share"></m3e-icon>Share</m3e-assist-chip>
 * </m3e-chip-set>
 * ```
 *
 * @tag m3e-assist-chip
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
@customElement("m3e-assist-chip")
export class M3eAssistChipElement extends FormSubmitter(
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
    "m3e-assist-chip": M3eAssistChipElement;
  }
}
