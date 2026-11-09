import { nothing } from "lit";

import {
  customElement,
  Disabled,
  DisabledInteractive,
  Focusable,
  FormSubmitter,
  KeyboardClick,
  LinkButton,
  Role,
} from "@m3e/web/core";

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
 * Use suggestion chips to offer actions; select the `outlined` or `elevated` variant.
 *
 * ```html
 * <m3e-suggestion-chip>Outlined Suggestion</m3e-suggestion-chip>
 * <m3e-suggestion-chip variant="elevated">Elevated Suggestion</m3e-suggestion-chip>
 * ```
 *
 * @example
 * Use the `icon` slot for a leading icon on a suggestion chip. Import `@m3e/web/icon` for the icons.
 *
 * ```html
 * <m3e-suggestion-chip>
 *   <m3e-icon slot="icon" name="lightbulb"></m3e-icon>
 *   Try budget planner
 * </m3e-suggestion-chip>
 * ```
 *
 * @example
 * Disable a suggestion chip, or use `disabled-interactive` to retain keyboard focusability.
 *
 * ```html
 * <m3e-suggestion-chip disabled>Disabled</m3e-suggestion-chip>
 * <m3e-suggestion-chip disabled-interactive>Disabled Interactive</m3e-suggestion-chip>
 * ```
 *
 * @example
 * Use `href` to make a suggestion chip a link.
 *
 * ```html
 * <m3e-suggestion-chip href="https://www.google.com" target="_blank">
 *   Google
 * </m3e-suggestion-chip>
 * ```
 *
 * @tag m3e-suggestion-chip
 *
 * @slot - Renders the label of the chip.
 * @slot icon - Renders an icon before the chip's label.
 *
 * @attr disabled - Whether the element is disabled.
 * @attr disabled-interactive - Whether the element is disabled and interactive.
 * @attr download - Whether the `target` of the link button will be downloaded, optionally specifying the new name of the file.
 * @attr href - The URL to which the link button points.
 * @attr name - The name of the element, submitted as a pair with the element's `value` as part of form data, when the element is used to submit a form.
 * @attr rel - The relationship between the `target` of the link button and the document.
 * @attr target - The target of the link button.
 * @attr type - The type of the element.
 * @attr value - A string representing the value of the chip.
 * @attr variant - The appearance variant of the chip.
 *
 * @fires click - Dispatched when the element is clicked.
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
  LinkButton(KeyboardClick(Focusable(DisabledInteractive(Disabled(Role(M3eChipElement, "button")))))),
) {
  /** Indicates that this custom element participates in form submission, validation, and form state restoration. */
  static readonly formAssociated = true;

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
