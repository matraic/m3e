import { CSSResultGroup, html, LitElement, nothing, PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import {
  renderPseudoLink,
  AttachInternals,
  Disabled,
  DisabledInteractive,
  Focusable,
  FocusController,
  FormSubmitter,
  LinkButton,
  M3eElevationElement,
  M3eFocusRingElement,
  M3eRippleElement,
  M3eStateLayerElement,
  PressedController,
  Role,
  KeyboardClick,
  hasAssignedNodes,
  ResizeController,
  debounce,
} from "@m3e/core";

import { ButtonShape } from "./ButtonShape";
import { ButtonSize } from "./ButtonSize";
import { ButtonVariant } from "./ButtonVariant";

import { ButtonSizeStyle, ButtonStyle, ButtonVariantStyle } from "./styles";

/**
 * @summary
 * A button users interact with to perform an action.
 *
 * @description
 * The `m3e-button` component is a semantic, expressive UI primitive users interact with to perform an action.
 * Designed according to Material Design 3 guidelines, it supports five visual variants, specified using the
 * `variant` attribute—`filled`, `tonal`, `elevated`, `outlined`, and `text`—each with dynamic elevation,
 * shape morphing, and adaptive color theming. The component responds to interaction states (hover, focus, press, disabled)
 * with smooth motion transitions, ensuring emotional clarity and visual hierarchy.
 *
 * The component is accessible by default, with ARIA roles, contrast-safe color tokens, and strong focus indicators.
 * It supports optional icons and states for binary actions.  When using `m3e-icon` for icons, `filled` is automatically
 * set based on the selected state of a toggle button. It can also function as a link or be used to submit form data.
 *
 * Native disabled `<button>` elements cannot receive focus. This can be problematic in some cases because it can prevent you
 * from telling the user why the button is disabled. You can use the `disabled-interactive` attribute to style a `m3e-button`
 * as disabled but allow for it to receive focus. The button will have `aria-disabled="true"` for assistive technology.
 *
 * @example
 * The following example illustrates changing the appearance from `text` (default), to `tonal` using the `variant` attribute.
 * ```html
 * <m3e-button variant="tonal">Tonal Button</m3e-button>
 * ```
 *
 * @tag m3e-button
 *
 * @slot - Renders the label of the button.
 * @slot icon - Renders an icon before the button's label.
 * @slot selected - Renders the label of the button, when selected.
 * @slot selected-icon - Renders an icon before the button's label, when selected.
 * @slot trailing-icon - Renders an icon after the button's label.
 *
 * @attr disabled - Whether the element is disabled.
 * @attr disabled-interactive - Whether the element is disabled and interactive.
 * @attr download - A value indicating whether the `target` of the link button will be downloaded, optionally specifying the new name of the file.
 * @attr href - The URL to which the link button points.
 * @attr name - The name of the element, submitted as a pair with the element's `value` as part of form data, when the element is used to submit a form.
 * @attr rel - The relationship between the `target` of the link button and the document.
 * @attr selected - Whether the toggle button is selected.
 * @attr shape - The shape of the button.
 * @attr size - The size of the button.
 * @attr target - The target of the link button.
 * @attr toggle - Whether the button will toggle between selected and unselected states.
 * @attr type - The type of the element.
 * @attr value - The value associated with the element's name when it's submitted with form data.
 * @attr variant - The appearance variant of the button.
 *
 * @fires input - Dispatched when a toggle button's selected state changes.
 * @fires change - Dispatched when a toggle button's selected state changes.
 *
 * @cssprop --m3e-button-extra-small-container-height - Height of the button container, for the extra-small size variant.
 * @cssprop --m3e-button-extra-small-outline-thickness - Thickness of the button outline, for the extra-small size variant.
 * @cssprop --m3e-button-extra-small-label-text-font-size - Font size for the label text, for the extra-small size variant.
 * @cssprop --m3e-button-extra-small-label-text-font-weight - Font weight for the label text, for the extra-small size variant.
 * @cssprop --m3e-button-extra-small-label-text-line-height - Line height for the label text, for the extra-small size variant.
 * @cssprop --m3e-button-extra-small-label-text-tracking - Letter tracking for the label text, for the extra-small size variant.
 * @cssprop --m3e-button-extra-small-icon-size - Size of the icon, for the extra-small size variant.
 * @cssprop --m3e-button-extra-small-shape-round - Corner radius for round shape, for the extra-small size variant.
 * @cssprop --m3e-button-extra-small-shape-square - Corner radius for square shape, for the extra-small size variant.
 * @cssprop --m3e-button-extra-small-selected-shape-round - Corner radius when selected (round), for the extra-small size variant.
 * @cssprop --m3e-button-extra-small-selected-shape-square - Corner radius when selected (square), for the extra-small size variant.
 * @cssprop --m3e-button-extra-small-shape-pressed-morph - Corner radius when pressed, for the extra-small size variant.
 * @cssprop --m3e-button-extra-small-leading-space - Space before icon or label, for the extra-small size variant.
 * @cssprop --m3e-button-extra-small-trailing-space - Space after icon or label, for the extra-small size variant.
 * @cssprop --m3e-button-extra-small-icon-label-space - Space between icon and label, for the extra-small size variant.
 * @cssprop --m3e-button-small-container-height - Height of the button container, for the small size variant.
 * @cssprop --m3e-button-small-outline-thickness - Thickness of the button outline, for the small size variant.
 * @cssprop --m3e-button-small-label-text-font-size - Font size for the label text, for the small size variant.
 * @cssprop --m3e-button-small-label-text-font-weight - Font weight for the label text, for the small size variant.
 * @cssprop --m3e-button-small-label-text-line-height - Line height for the label text, for the small size variant.
 * @cssprop --m3e-button-small-label-text-tracking - Letter tracking for the label text, for the small size variant.
 * @cssprop --m3e-button-small-icon-size - Size of the icon, for the small size variant.
 * @cssprop --m3e-button-small-shape-round - Corner radius for round shape, for the small size variant.
 * @cssprop --m3e-button-small-shape-square - Corner radius for square shape, for the small size variant.
 * @cssprop --m3e-button-small-selected-shape-round - Corner radius when selected (round), for the small size variant.
 * @cssprop --m3e-button-small-selected-shape-square - Corner radius when selected (square), for the small size variant.
 * @cssprop --m3e-button-small-shape-pressed-morph - Corner radius when pressed, for the small size variant.
 * @cssprop --m3e-button-small-leading-space - Space before icon or label, for the small size variant.
 * @cssprop --m3e-button-small-trailing-space - Space after icon or label, for the small size variant.
 * @cssprop --m3e-button-small-icon-label-space - Space between icon and label, for the small size variant.
 * @cssprop --m3e-button-medium-container-height - Height of the button container, for the medium size variant.
 * @cssprop --m3e-button-medium-outline-thickness - Thickness of the button outline, for the medium size variant.
 * @cssprop --m3e-button-medium-label-text-font-size - Font size for the label text, for the medium size variant.
 * @cssprop --m3e-button-medium-label-text-font-weight - Font weight for the label text, for the medium size variant.
 * @cssprop --m3e-button-medium-label-text-line-height - Line height for the label text, for the medium size variant.
 * @cssprop --m3e-button-medium-label-text-tracking - Letter tracking for the label text, for the medium size variant.
 * @cssprop --m3e-button-medium-icon-size - Size of the icon, for the medium size variant.
 * @cssprop --m3e-button-medium-shape-round - Corner radius for round shape, for the medium size variant.
 * @cssprop --m3e-button-medium-shape-square - Corner radius for square shape, for the medium size variant.
 * @cssprop --m3e-button-medium-selected-shape-round - Corner radius when selected (round), for the medium size variant.
 * @cssprop --m3e-button-medium-selected-shape-square - Corner radius when selected (square), for the medium size variant.
 * @cssprop --m3e-button-medium-shape-pressed-morph - Corner radius when pressed, for the medium size variant.
 * @cssprop --m3e-button-medium-leading-space - Space before icon or label, for the medium size variant.
 * @cssprop --m3e-button-medium-trailing-space - Space after icon or label, for the medium size variant.
 * @cssprop --m3e-button-medium-icon-label-space - Space between icon and label, for the medium size variant.
 * @cssprop --m3e-button-large-container-height - Height of the button container, for the large size variant.
 * @cssprop --m3e-button-large-outline-thickness - Thickness of the button outline, for the large size variant.
 * @cssprop --m3e-button-large-label-text-font-size - Font size for the label text, for the large size variant.
 * @cssprop --m3e-button-large-label-text-font-weight - Font weight for the label text, for the large size variant.
 * @cssprop --m3e-button-large-label-text-line-height - Line height for the label text, for the large size variant.
 * @cssprop --m3e-button-large-label-text-tracking - Letter tracking for the label text, for the large size variant.
 * @cssprop --m3e-button-large-icon-size - Size of the icon, for the large size variant.
 * @cssprop --m3e-button-large-shape-round - Corner radius for round shape, for the large size variant.
 * @cssprop --m3e-button-large-shape-square - Corner radius for square shape, for the large size variant.
 * @cssprop --m3e-button-large-selected-shape-round - Corner radius when selected (round), for the large size variant.
 * @cssprop --m3e-button-large-selected-shape-square - Corner radius when selected (square), for the large size variant.
 * @cssprop --m3e-button-large-shape-pressed-morph - Corner radius when pressed, for the large size variant.
 * @cssprop --m3e-button-large-leading-space - Space before icon or label, for the large size variant.
 * @cssprop --m3e-button-large-trailing-space - Space after icon or label, for the large size variant.
 * @cssprop --m3e-button-large-icon-label-space - Space between icon and label, for the large size variant.
 * @cssprop --m3e-button-extra-large-container-height - Height of the button container, for the extra-large size variant.
 * @cssprop --m3e-button-extra-large-outline-thickness - Thickness of the button outline, for the extra-large size variant.
 * @cssprop --m3e-button-extra-large-label-text-font-size - Font size for the label text, for the extra-large size variant.
 * @cssprop --m3e-button-extra-large-label-text-font-weight - Font weight for the label text, for the extra-large size variant.
 * @cssprop --m3e-button-extra-large-label-text-line-height - Line height for the label text, for the extra-large size variant.
 * @cssprop --m3e-button-extra-large-label-text-tracking - Letter tracking for the label text, for the extra-large size variant.
 * @cssprop --m3e-button-extra-large-icon-size - Size of the icon, for the extra-large size variant.
 * @cssprop --m3e-button-extra-large-shape-round - Corner radius for round shape, for the extra-large size variant.
 * @cssprop --m3e-button-extra-large-shape-square - Corner radius for square shape, for the extra-large size variant.
 * @cssprop --m3e-button-extra-large-selected-shape-round - Corner radius when selected (round), for the extra-large size variant.
 * @cssprop --m3e-button-extra-large-selected-shape-square - Corner radius when selected (square), for the extra-large size variant.
 * @cssprop --m3e-button-extra-large-shape-pressed-morph - Corner radius when pressed, for the extra-large size variant.
 * @cssprop --m3e-button-extra-large-leading-space - Space before icon or label, for the extra-large size variant.
 * @cssprop --m3e-button-extra-large-trailing-space - Space after icon or label, for the extra-large size variant.
 * @cssprop --m3e-button-extra-large-icon-label-space - Space between icon and label, for the extra-large size variant.
 * @cssprop --m3e-elevated-button-label-text-color - Label color, for the elevated variant.
 * @cssprop --m3e-elevated-button-icon-color - Icon color, for the elevated variant.
 * @cssprop --m3e-elevated-button-container-color - Container background color, for the elevated variant.
 * @cssprop --m3e-elevated-button-container-elevation - Elevation, for the elevated variant.
 * @cssprop --m3e-elevated-button-unselected-label-text-color - Unselected label color, for the elevated variant.
 * @cssprop --m3e-elevated-button-unselected-icon-color - Unselected icon color, for the elevated variant.
 * @cssprop --m3e-elevated-button-unselected-container-color - Unselected container color, for the elevated variant.
 * @cssprop --m3e-elevated-button-selected-label-text-color - Selected label color, for the elevated variant.
 * @cssprop --m3e-elevated-button-selected-icon-color - Selected icon color, for the elevated variant.
 * @cssprop --m3e-elevated-button-selected-container-color - Selected container color, for the elevated variant.
 * @cssprop --m3e-elevated-button-disabled-container-color - Disabled container color, for the elevated variant.
 * @cssprop --m3e-elevated-button-disabled-container-opacity - Disabled container opacity, for the elevated variant.
 * @cssprop --m3e-elevated-button-disabled-icon-color - Disabled icon color, for the elevated variant.
 * @cssprop --m3e-elevated-button-disabled-icon-opacity - Disabled icon opacity, for the elevated variant.
 * @cssprop --m3e-elevated-button-disabled-label-text-color - Disabled label color, for the elevated variant.
 * @cssprop --m3e-elevated-button-disabled-label-text-opacity - Disabled label opacity, for the elevated variant.
 * @cssprop --m3e-elevated-button-disabled-container-elevation - Disabled elevation, for the elevated variant.
 * @cssprop --m3e-elevated-button-hover-icon-color - Hover icon color, for the elevated variant.
 * @cssprop --m3e-elevated-button-hover-label-text-color - Hover label color, for the elevated variant.
 * @cssprop --m3e-elevated-button-hover-state-layer-color - Hover state layer color, for the elevated variant.
 * @cssprop --m3e-elevated-button-hover-state-layer-opacity - Hover state layer opacity, for the elevated variant.
 * @cssprop --m3e-elevated-button-hover-container-elevation - Hover elevation, for the elevated variant.
 * @cssprop --m3e-elevated-button-hover-unselected-icon-color - Hover unselected icon color, for the elevated variant.
 * @cssprop --m3e-elevated-button-hover-unselected-label-text-color - Hover unselected label color, for the elevated variant.
 * @cssprop --m3e-elevated-button-hover-unselected-state-layer-color - Hover unselected state layer color, for the elevated variant.
 * @cssprop --m3e-elevated-button-hover-selected-icon-color - Hover selected icon color, for the elevated variant.
 * @cssprop --m3e-elevated-button-hover-selected-label-text-color - Hover selected label color, for the elevated variant.
 * @cssprop --m3e-elevated-button-hover-selected-state-layer-color - Hover selected state layer color, for the elevated variant.
 * @cssprop --m3e-elevated-button-focus-icon-color - Focus icon color, for the elevated variant.
 * @cssprop --m3e-elevated-button-focus-label-text-color - Focus label color, for the elevated variant.
 * @cssprop --m3e-elevated-button-focus-state-layer-color - Focus state layer color, for the elevated variant.
 * @cssprop --m3e-elevated-button-focus-state-layer-opacity - Focus state layer opacity, for the elevated variant.
 * @cssprop --m3e-elevated-button-focus-container-elevation - Focus elevation, for the elevated variant.
 * @cssprop --m3e-elevated-button-focus-unselected-label-text-color - Focus unselected label color, for the elevated variant.
 * @cssprop --m3e-elevated-button-focus-unselected-icon-color - Focus unselected icon color, for the elevated variant.
 * @cssprop --m3e-elevated-button-focus-unselected-state-layer-color - Focus unselected state layer color, for the elevated variant.
 * @cssprop --m3e-elevated-button-focus-selected-icon-color - Focus selected icon color, for the elevated variant.
 * @cssprop --m3e-elevated-button-focus-selected-label-text-color - Focus selected label color, for the elevated variant.
 * @cssprop --m3e-elevated-button-focus-selected-state-layer-color - Focus selected state layer color, for the elevated variant.
 * @cssprop --m3e-elevated-button-pressed-icon-color - Pressed icon color, for the elevated variant.
 * @cssprop --m3e-elevated-button-pressed-label-text-color - Pressed label color, for the elevated variant.
 * @cssprop --m3e-elevated-button-pressed-state-layer-color - Pressed state layer color, for the elevated variant.
 * @cssprop --m3e-elevated-button-pressed-state-layer-opacity - Pressed state layer opacity, for the elevated variant.
 * @cssprop --m3e-elevated-button-pressed-container-elevation - Pressed elevation, for the elevated variant.
 * @cssprop --m3e-elevated-button-pressed-unselected-label-text-color - Pressed unselected label color, for the elevated variant.
 * @cssprop --m3e-elevated-button-pressed-unselected-icon-color - Pressed unselected icon color, for the elevated variant.
 * @cssprop --m3e-elevated-button-pressed-unselected-state-layer-color - Pressed unselected state layer color, for the elevated variant.
 * @cssprop --m3e-elevated-button-pressed-selected-icon-color - Pressed selected icon color, for the elevated variant.
 * @cssprop --m3e-elevated-button-pressed-selected-label-text-color - Pressed selected label color, for the elevated variant.
 * @cssprop --m3e-elevated-button-pressed-selected-state-layer-color - Pressed selected state layer color, for the elevated variant.
 * @cssprop --m3e-outlined-button-label-text-color - Label color, for the outlined variant.
 * @cssprop --m3e-outlined-button-icon-color - Icon color, for the outlined variant.
 * @cssprop --m3e-outlined-button-outline-color - Outline color, for the outlined variant.
 * @cssprop --m3e-outlined-button-unselected-label-text-color - Unselected label color, for the outlined variant.
 * @cssprop --m3e-outlined-button-unselected-icon-color - Unselected icon color, for the outlined variant.
 * @cssprop --m3e-outlined-button-selected-label-text-color - Selected label color, for the outlined variant.
 * @cssprop --m3e-outlined-button-selected-icon-color - Selected icon color, for the outlined variant.
 * @cssprop --m3e-outlined-button-selected-container-color - Selected container color, for the outlined variant.
 * @cssprop --m3e-outlined-button-disabled-container-color - Disabled container color, for the outlined variant.
 * @cssprop --m3e-outlined-button-disabled-container-opacity - Disabled container opacity, for the outlined variant.
 * @cssprop --m3e-outlined-button-disabled-icon-color - Disabled icon color, for the outlined variant.
 * @cssprop --m3e-outlined-button-disabled-icon-opacity - Disabled icon opacity, for the outlined variant.
 * @cssprop --m3e-outlined-button-disabled-label-text-color - Disabled label color, for the outlined variant.
 * @cssprop --m3e-outlined-button-disabled-label-text-opacity - Disabled label opacity, for the outlined variant.
 * @cssprop --m3e-outlined-button-disabled-outline-color - Disabled outline color, for the outlined variant.
 * @cssprop --m3e-outlined-button-hover-icon-color - Hover icon color, for the outlined variant.
 * @cssprop --m3e-outlined-button-hover-label-text-color - Hover label color, for the outlined variant.
 * @cssprop --m3e-outlined-button-hover-outline-color - Hover outline color, for the outlined variant.
 * @cssprop --m3e-outlined-button-hover-state-layer-color - Hover state layer color, for the outlined variant.
 * @cssprop --m3e-outlined-button-hover-state-layer-opacity - Hover state layer opacity, for the outlined variant.
 * @cssprop --m3e-outlined-button-hover-unselected-icon-color - Hover unselected icon color, for the outlined variant.
 * @cssprop --m3e-outlined-button-hover-unselected-label-text-color - Hover unselected label color, for the outlined variant.
 * @cssprop --m3e-outlined-button-hover-unselected-state-layer-color - Hover unselected state layer color, for the outlined variant.
 * @cssprop --m3e-outlined-button-hover-selected-icon-color - Hover selected icon color, for the outlined variant.
 * @cssprop --m3e-outlined-button-hover-selected-label-text-color - Hover selected label color, for the outlined variant.
 * @cssprop --m3e-outlined-button-hover-selected-state-layer-color - Hover selected state layer color, for the outlined variant.
 * @cssprop --m3e-outlined-button-focus-icon-color - Focus icon color, for the outlined variant.
 * @cssprop --m3e-outlined-button-focus-label-text-color - Focus label color, for the outlined variant.
 * @cssprop --m3e-outlined-button-focus-outline-color - Focus outline color, for the outlined variant.
 * @cssprop --m3e-outlined-button-focus-state-layer-color - Focus state layer color, for the outlined variant.
 * @cssprop --m3e-outlined-button-focus-state-layer-opacity - Focus state layer opacity, for the outlined variant.
 * @cssprop --m3e-outlined-button-focus-unselected-icon-color - Focus unselected icon color, for the outlined variant.
 * @cssprop --m3e-outlined-button-focus-unselected-label-text-color - Focus unselected label color, for the outlined variant.
 * @cssprop --m3e-outlined-button-focus-unselected-state-layer-color - Focus unselected state layer color, for the outlined variant.
 * @cssprop --m3e-outlined-button-focus-selected-icon-color - Focus selected icon color, for the outlined variant.
 * @cssprop --m3e-outlined-button-focus-selected-label-text-color - Focus selected label color, for the outlined variant.
 * @cssprop --m3e-outlined-button-focus-selected-state-layer-color - Focus selected state layer color, for the outlined variant.
 * @cssprop --m3e-outlined-button-pressed-icon-color - Pressed icon color, for the outlined variant.
 * @cssprop --m3e-outlined-button-pressed-label-text-color - Pressed label color, for the outlined variant.
 * @cssprop --m3e-outlined-button-pressed-outline-color - Pressed outline color, for the outlined variant.
 * @cssprop --m3e-outlined-button-pressed-state-layer-color - Pressed state layer color, for the outlined variant.
 * @cssprop --m3e-outlined-button-pressed-state-layer-opacity - Pressed state layer opacity, for the outlined variant.
 * @cssprop --m3e-outlined-button-pressed-unselected-icon-color - Pressed unselected icon color, for the outlined variant.
 * @cssprop --m3e-outlined-button-pressed-unselected-label-text-color - Pressed unselected label color, for the outlined variant.
 * @cssprop --m3e-outlined-button-pressed-unselected-state-layer-color - Pressed unselected state layer color, for the outlined variant.
 * @cssprop --m3e-outlined-button-pressed-selected-icon-color - Pressed selected icon color, for the outlined variant.
 * @cssprop --m3e-outlined-button-pressed-selected-label-text-color - Pressed selected label color, for the outlined variant.
 * @cssprop --m3e-outlined-button-pressed-selected-state-layer-color - Pressed selected state layer color, for the outlined variant.
 * @cssprop --m3e-filled-button-label-text-color - Label color, for the filled variant.
 * @cssprop --m3e-filled-button-icon-color - Icon color, for the filled variant.
 * @cssprop --m3e-filled-button-container-color - Container background color, for the filled variant.
 * @cssprop --m3e-filled-button-container-elevation - Elevation, for the filled variant.
 * @cssprop --m3e-filled-button-unselected-label-text-color - Unselected label color, for the filled variant.
 * @cssprop --m3e-filled-button-unselected-icon-color - Unselected icon color, for the filled variant.
 * @cssprop --m3e-filled-button-unselected-container-color - Unselected container color, for the filled variant.
 * @cssprop --m3e-filled-button-selected-label-text-color - Selected label color, for the filled variant.
 * @cssprop --m3e-filled-button-selected-icon-color - Selected icon color, for the filled variant.
 * @cssprop --m3e-filled-button-selected-container-color - Selected container color, for the filled variant.
 * @cssprop --m3e-filled-button-disabled-container-color - Disabled container color, for the filled variant.
 * @cssprop --m3e-filled-button-disabled-container-opacity - Disabled container opacity, for the filled variant.
 * @cssprop --m3e-filled-button-disabled-icon-color - Disabled icon color, for the filled variant.
 * @cssprop --m3e-filled-button-disabled-icon-opacity - Disabled icon opacity, for the filled variant.
 * @cssprop --m3e-filled-button-disabled-label-text-color - Disabled label color, for the filled variant.
 * @cssprop --m3e-filled-button-disabled-label-text-opacity - Disabled label opacity, for the filled variant.
 * @cssprop --m3e-filled-button-disabled-container-elevation - Disabled elevation, for the filled variant.
 * @cssprop --m3e-filled-button-hover-icon-color - Hover icon color, for the filled variant.
 * @cssprop --m3e-filled-button-hover-label-text-color - Hover label color, for the filled variant.
 * @cssprop --m3e-filled-button-hover-state-layer-color - Hover state layer color, for the filled variant.
 * @cssprop --m3e-filled-button-hover-state-layer-opacity - Hover state layer opacity, for the filled variant.
 * @cssprop --m3e-filled-button-hover-container-elevation - Hover elevation, for the filled variant.
 * @cssprop --m3e-filled-button-hover-unselected-icon-color - Hover unselected icon color, for the filled variant.
 * @cssprop --m3e-filled-button-hover-unselected-label-text-color - Hover unselected label color, for the filled variant.
 * @cssprop --m3e-filled-button-hover-unselected-state-layer-color - Hover unselected state layer color, for the filled variant.
 * @cssprop --m3e-filled-button-hover-selected-icon-color - Hover selected icon color, for the filled variant.
 * @cssprop --m3e-filled-button-hover-selected-label-text-color - Hover selected label color, for the filled variant.
 * @cssprop --m3e-filled-button-hover-selected-state-layer-color - Hover selected state layer color, for the filled variant.
 * @cssprop --m3e-filled-button-focus-icon-color - Focus icon color, for the filled variant.
 * @cssprop --m3e-filled-button-focus-label-text-color - Focus label color, for the filled variant.
 * @cssprop --m3e-filled-button-focus-state-layer-color - Focus state layer color, for the filled variant.
 * @cssprop --m3e-filled-button-focus-state-layer-opacity - Focus state layer opacity, for the filled variant.
 * @cssprop --m3e-filled-button-focus-container-elevation - Focus elevation, for the filled variant.
 * @cssprop --m3e-filled-button-focus-unselected-icon-color - Focus unselected icon color, for the filled variant.
 * @cssprop --m3e-filled-button-focus-unselected-label-text-color - Focus unselected label color, for the filled variant.
 * @cssprop --m3e-filled-button-focus-unselected-state-layer-color - Focus unselected state layer color, for the filled variant.
 * @cssprop --m3e-filled-button-focus-selected-icon-color - Focus selected icon color, for the filled variant.
 * @cssprop --m3e-filled-button-focus-selected-label-text-color - Focus selected label color, for the filled variant.
 * @cssprop --m3e-filled-button-focus-selected-state-layer-color - Focus selected state layer color, for the filled variant.
 * @cssprop --m3e-filled-button-pressed-icon-color - Pressed icon color, for the filled variant.
 * @cssprop --m3e-filled-button-pressed-label-text-color - Pressed label color, for the filled variant.
 * @cssprop --m3e-filled-button-pressed-state-layer-color - Pressed state layer color, for the filled variant.
 * @cssprop --m3e-filled-button-pressed-state-layer-opacity - Pressed state layer opacity, for the filled variant.
 * @cssprop --m3e-filled-button-pressed-container-elevation - Pressed elevation, for the filled variant.
 * @cssprop --m3e-filled-button-pressed-unselected-icon-color - Pressed unselected icon color, for the filled variant.
 * @cssprop --m3e-filled-button-pressed-unselected-label-text-color - Pressed unselected label color, for the filled variant.
 * @cssprop --m3e-filled-button-pressed-unselected-state-layer-color - Pressed unselected state layer color, for the filled variant.
 * @cssprop --m3e-filled-button-pressed-selected-icon-color - Pressed selected icon color, for the filled variant.
 * @cssprop --m3e-filled-button-pressed-selected-label-text-color - Pressed selected label color, for the filled variant.
 * @cssprop --m3e-filled-button-pressed-selected-state-layer-color - Pressed selected state layer color, for the filled variant.
 * @cssprop --m3e-tonal-button-label-text-color - Label color, for the tonal variant.
 * @cssprop --m3e-tonal-button-icon-color - Icon color, for the tonal variant.
 * @cssprop --m3e-tonal-button-container-color - Container background color, for the tonal variant.
 * @cssprop --m3e-tonal-button-container-elevation - Elevation, for the tonal variant.
 * @cssprop --m3e-tonal-button-unselected-label-text-color - Unselected label color, for the tonal variant.
 * @cssprop --m3e-tonal-button-unselected-icon-color - Unselected icon color, for the tonal variant.
 * @cssprop --m3e-tonal-button-unselected-container-color - Unselected container color, for the tonal variant.
 * @cssprop --m3e-tonal-button-selected-label-text-color - Selected label color, for the tonal variant.
 * @cssprop --m3e-tonal-button-selected-icon-color - Selected icon color, for the tonal variant.
 * @cssprop --m3e-tonal-button-selected-container-color - Selected container color, for the tonal variant.
 * @cssprop --m3e-tonal-button-disabled-container-color - Disabled container color, for the tonal variant.
 * @cssprop --m3e-tonal-button-disabled-container-opacity - Disabled container opacity, for the tonal variant.
 * @cssprop --m3e-tonal-button-disabled-icon-color - Disabled icon color, for the tonal variant.
 * @cssprop --m3e-tonal-button-disabled-icon-opacity - Disabled icon opacity, for the tonal variant.
 * @cssprop --m3e-tonal-button-disabled-label-text-color - Disabled label color, for the tonal variant.
 * @cssprop --m3e-tonal-button-disabled-label-text-opacity - Disabled label opacity, for the tonal variant.
 * @cssprop --m3e-tonal-button-disabled-container-elevation - Disabled elevation, for the tonal variant.
 * @cssprop --m3e-tonal-button-hover-icon-color - Hover icon color, for the tonal variant.
 * @cssprop --m3e-tonal-button-hover-label-text-color - Hover label color, for the tonal variant.
 * @cssprop --m3e-tonal-button-hover-state-layer-color - Hover state layer color, for the tonal variant.
 * @cssprop --m3e-tonal-button-hover-state-layer-opacity - Hover state layer opacity, for the tonal variant.
 * @cssprop --m3e-tonal-button-hover-container-elevation - Hover elevation, for the tonal variant.
 * @cssprop --m3e-tonal-button-hover-unselected-icon-color - Hover unselected icon color, for the tonal variant.
 * @cssprop --m3e-tonal-button-hover-unselected-label-text-color - Hover unselected label color, for the tonal variant.
 * @cssprop --m3e-tonal-button-hover-unselected-state-layer-color - Hover unselected state layer color, for the tonal variant.
 * @cssprop --m3e-tonal-button-hover-selected-icon-color - Hover selected icon color, for the tonal variant.
 * @cssprop --m3e-tonal-button-hover-selected-label-text-color - Hover selected label color, for the tonal variant.
 * @cssprop --m3e-tonal-button-hover-selected-state-layer-color - Hover selected state layer color, for the tonal variant.
 * @cssprop --m3e-tonal-button-focus-icon-color - Focus icon color, for the tonal variant.
 * @cssprop --m3e-tonal-button-focus-label-text-color - Focus label color, for the tonal variant.
 * @cssprop --m3e-tonal-button-focus-state-layer-color - Focus state layer color, for the tonal variant.
 * @cssprop --m3e-tonal-button-focus-state-layer-opacity - Focus state layer opacity, for the tonal variant.
 * @cssprop --m3e-tonal-button-focus-container-elevation - Focus elevation, for the tonal variant.
 * @cssprop --m3e-tonal-button-focus-unselected-icon-color - Focus unselected icon color, for the tonal variant.
 * @cssprop --m3e-tonal-button-focus-unselected-label-text-color - Focus unselected label color, for the tonal variant.
 * @cssprop --m3e-tonal-button-focus-unselected-state-layer-color - Focus unselected state layer color, for the tonal variant.
 * @cssprop --m3e-tonal-button-focus-selected-icon-color - Focus selected icon color, for the tonal variant.
 * @cssprop --m3e-tonal-button-focus-selected-label-text-color - Focus selected label color, for the tonal variant.
 * @cssprop --m3e-tonal-button-focus-selected-state-layer-color - Focus selected state layer color, for the tonal variant.
 * @cssprop --m3e-tonal-button-pressed-icon-color - Pressed icon color, for the tonal variant.
 * @cssprop --m3e-tonal-button-pressed-label-text-color - Pressed label color, for the tonal variant.
 * @cssprop --m3e-tonal-button-pressed-state-layer-color - Pressed state layer color, for the tonal variant.
 * @cssprop --m3e-tonal-button-pressed-state-layer-opacity - Pressed state layer opacity, for the tonal variant.
 * @cssprop --m3e-tonal-button-pressed-container-elevation - Pressed elevation, for the tonal variant.
 * @cssprop --m3e-tonal-button-pressed-unselected-icon-color - Pressed unselected icon color, for the tonal variant.
 * @cssprop --m3e-tonal-button-pressed-unselected-label-text-color - Pressed unselected label color, for the tonal variant.
 * @cssprop --m3e-tonal-button-pressed-unselected-state-layer-color - Pressed unselected state layer color, for the tonal variant.
 * @cssprop --m3e-tonal-button-pressed-selected-icon-color - Pressed selected icon color, for the tonal variant.
 * @cssprop --m3e-tonal-button-pressed-selected-label-text-color - Pressed selected label color, for the tonal variant.
 * @cssprop --m3e-tonal-button-pressed-selected-state-layer-color - Pressed selected state layer color, for the tonal variant.
 * @cssprop --m3e-text-button-label-text-color - Label color, for the text variant.
 * @cssprop --m3e-text-button-icon-color - Icon color, for the text variant.
 * @cssprop --m3e-text-button-unselected-label-text-color - Unselected label color, for the text variant.
 * @cssprop --m3e-text-button-unselected-icon-color - Unselected icon color, for the text variant.
 * @cssprop --m3e-text-button-selected-label-text-color - Selected label color, for the text variant.
 * @cssprop --m3e-text-button-selected-icon-color - Selected icon color, for the text variant.
 * @cssprop --m3e-text-button-disabled-container-color - Disabled container color, for the text variant.
 * @cssprop --m3e-text-button-disabled-container-opacity - Disabled container opacity, for the text variant.
 * @cssprop --m3e-text-button-disabled-icon-color - Disabled icon color, for the text variant.
 * @cssprop --m3e-text-button-disabled-icon-opacity - Disabled icon opacity, for the text variant.
 * @cssprop --m3e-text-button-disabled-label-text-color - Disabled label color, for the text variant.
 * @cssprop --m3e-text-button-disabled-label-text-opacity - Disabled label opacity, for the text variant.
 * @cssprop --m3e-text-button-hover-icon-color - Hover icon color, for the text variant.
 * @cssprop --m3e-text-button-hover-label-text-color - Hover label color, for the text variant.
 * @cssprop --m3e-text-button-hover-state-layer-color - Hover state layer color, for the text variant.
 * @cssprop --m3e-text-button-hover-state-layer-opacity - Hover state layer opacity, for the text variant.
 * @cssprop --m3e-text-button-hover-unselected-icon-color - Hover unselected icon color, for the text variant.
 * @cssprop --m3e-text-button-hover-unselected-label-text-color - Hover unselected label color, for the text variant.
 * @cssprop --m3e-text-button-hover-unselected-state-layer-color - Hover unselected state layer color, for the text variant.
 * @cssprop --m3e-text-button-hover-selected-icon-color - Hover selected icon color, for the text variant.
 * @cssprop --m3e-text-button-hover-selected-label-text-color - Hover selected label color, for the text variant.
 * @cssprop --m3e-text-button-hover-selected-state-layer-color - Hover selected state layer color, for the text variant.
 * @cssprop --m3e-text-button-focus-icon-color - Focus icon color, for the text variant.
 * @cssprop --m3e-text-button-focus-label-text-color - Focus label color, for the text variant.
 * @cssprop --m3e-text-button-focus-state-layer-color - Focus state layer color, for the text variant.
 * @cssprop --m3e-text-button-focus-state-layer-opacity - Focus state layer opacity, for the text variant.
 * @cssprop --m3e-text-button-focus-unselected-icon-color - Focus unselected icon color, for the text variant.
 * @cssprop --m3e-text-button-focus-unselected-label-text-color - Focus unselected label color, for the text variant.
 * @cssprop --m3e-text-button-focus-unselected-state-layer-color - Focus unselected state layer color, for the text variant.
 * @cssprop --m3e-text-button-focus-selected-icon-color - Focus selected icon color, for the text variant.
 * @cssprop --m3e-text-button-focus-selected-label-text-color - Focus selected label color, for the text variant.
 * @cssprop --m3e-text-button-focus-selected-state-layer-color - Focus selected state layer color, for the text variant.
 * @cssprop --m3e-text-button-pressed-icon-color - Pressed icon color, for the text variant.
 * @cssprop --m3e-text-button-pressed-label-text-color - Pressed label color, for the text variant.
 * @cssprop --m3e-text-button-pressed-state-layer-color - Pressed state layer color, for the text variant.
 * @cssprop --m3e-text-button-pressed-state-layer-opacity - Pressed state layer opacity, for the text variant.
 * @cssprop --m3e-text-button-pressed-unselected-icon-color - Pressed unselected icon color, for the text variant.
 * @cssprop --m3e-text-button-pressed-unselected-label-text-color - Pressed unselected label color, for the text variant.
 * @cssprop --m3e-text-button-pressed-unselected-state-layer-color - Pressed unselected state layer color, for the text variant.
 * @cssprop --m3e-text-button-pressed-selected-icon-color - Pressed selected icon color, for the text variant.
 * @cssprop --m3e-text-button-pressed-selected-label-text-color - Pressed selected label color, for the text variant.
 * @cssprop --m3e-text-button-pressed-selected-state-layer-color - Pressed selected state layer color, for the text variant.
 */
@customElement("m3e-button")
export class M3eButtonElement extends KeyboardClick(
  LinkButton(FormSubmitter(Focusable(DisabledInteractive(Disabled(AttachInternals(Role(LitElement, "button"), true))))))
) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = [ButtonSizeStyle, ButtonVariantStyle, ButtonStyle];

  /** @private */ @query(".base") private readonly _base?: HTMLElement;
  /** @private */ @query(".elevation") private readonly _elevation?: M3eElevationElement;
  /** @private */ @query(".focus-ring") private readonly _focusRing?: M3eFocusRingElement;
  /** @private */ @query(".state-layer") private readonly _stateLayer?: M3eStateLayerElement;
  /** @private */ @query(".ripple") private readonly _ripple?: M3eRippleElement;

  /** @private */ readonly #clickHandler = (e: Event) => this.#handleClick(e);

  constructor() {
    super();

    new ResizeController(this, {
      callback: () => {
        if (this.grouped) {
          this._handleResize();
        }
      },
    });

    new FocusController(this, {
      callback: (focused) => {
        if (!this.disabledInteractive && this._base) {
          if (focused) {
            this.#updateButtonShape();
          } else if (!this.grouped) {
            this._base?.style.removeProperty("--_button-shape");
          }
        }
      },
    });

    new PressedController(this, {
      isPressedKey: (key) => key === " " || key === "Enter",
      callback: (pressed) => {
        if (!this.disabled && !this.disabledInteractive) {
          this.classList.toggle("-pressed", pressed);
          this.classList.toggle("-resting", !pressed);

          const group = this.closest("m3e-button-group");
          if (group) {
            const clientWidth = this.getBoundingClientRect().width;
            const buttons = [...group.querySelectorAll<HTMLElement>("m3e-button,m3e-icon-button")];
            const index = buttons.indexOf(this);

            for (let i = 0; i < buttons.length; i++) {
              const button = buttons[i];
              if (i === index - 1) {
                button.style.setProperty("--_adjacent-button-width", `${clientWidth}px`);
                button.classList.toggle("-adjacent-pressed", pressed);
              } else if (i === index + 1) {
                button.style.setProperty("--_adjacent-button-width", `${clientWidth}px`);
                button.classList.toggle("-adjacent-pressed", pressed);
              } else {
                button.style.removeProperty("--_adjacent-button-width");
                button.classList.remove("-adjacent-pressed");
              }
            }
          }
        }
      },
    });
  }

  /**
   * The appearance variant of the button.
   * @default "text"
   */
  @property({ reflect: true }) variant: ButtonVariant = "text";

  /**
   * The shape of the button.
   * @default "rounded"
   */
  @property({ reflect: true }) shape: ButtonShape = "rounded";

  /**
   * The size of the button.
   * @default "small"
   */
  @property({ reflect: true }) size: ButtonSize = "small";

  /**
   * Whether the button will toggle between selected and unselected states.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) toggle = false;

  /**
   * Whether the toggle button is selected.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) selected = false;

  /** Whether the button is contained by a button group. */
  get grouped() {
    return this.classList.contains("-grouped");
  }

  /** @inheritdoc */
  override render(): unknown {
    return html`<div class="base">
      <m3e-elevation class="elevation" ?disabled="${this.disabled || this.disabledInteractive}"></m3e-elevation>
      <m3e-state-layer class="state-layer" ?disabled="${this.disabled || this.disabledInteractive}"></m3e-state-layer>
      <m3e-focus-ring class="focus-ring" ?disabled="${this.disabled}"></m3e-focus-ring>
      <m3e-ripple class="ripple" ?disabled="${this.disabled || this.disabledInteractive}"></m3e-ripple>
      <div class="touch" aria-hidden="true"></div>
      ${this[renderPseudoLink]()}
      <div class="wrapper">
        ${this.toggle
          ? html`<slot
              class="icon"
              name="selected-icon"
              aria-hidden="true"
              @slotchange="${this.#handleSelectedIconSlotChange}"
            ></slot>`
          : nothing}
        <slot class="icon" name="icon" aria-hidden="true"></slot>
        <div class="label">
          ${this.toggle && this.selected ? html`<slot name="selected"><slot></slot></slot>` : html`<slot></slot>`}
        </div>
        <slot class="icon" name="trailing-icon" aria-hidden="true"></slot>
      </div>
    </div>`;
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("click", this.#clickHandler);
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    ["-pressed", "-resting", "-grouped", "-connected"].forEach((x) => this.classList.remove(x));
    this._base?.style.removeProperty("--_button-shape");
    this.style.removeProperty("--_button-width");
    this.style.removeProperty("--_adjacent-button-width");
    this.classList.remove("-adjacent-pressed");

    this.removeEventListener("click", this.#clickHandler);
  }

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues<this>): void {
    super.firstUpdated(_changedProperties);
    [this._elevation, this._focusRing, this._stateLayer, this._ripple].forEach((x) => x?.attach(this));
  }

  /** @inheritdoc */
  protected override updated(_changedProperties: PropertyValues<this>): void {
    super.updated(_changedProperties);

    if (
      (_changedProperties.has("disabled") && this.disabled) ||
      (_changedProperties.has("disabledInteractive") && this.disabledInteractive)
    ) {
      this.classList.toggle("-pressed", false);
      this.classList.toggle("-resting", false);
    }

    if (_changedProperties.has("toggle") || _changedProperties.has("selected")) {
      this.ariaPressed = this.toggle ? `${this.selected}` : null;
      if (this.toggle) {
        for (const icon of this.querySelectorAll("m3e-icon")) {
          icon.toggleAttribute("filled", this.selected);
        }
      }
    }
  }

  /** @private */
  #handleClick(e: Event): void {
    if (this.disabled || this.disabledInteractive) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }

    if (this.toggle && !e.defaultPrevented) {
      this.selected = !this.selected;

      // Dispatch an input event and if not prevented, dispatch a change event.
      // Otherwise, reset the selected state.

      if (this.dispatchEvent(new Event("input", { bubbles: true, composed: true, cancelable: true }))) {
        this.dispatchEvent(new Event("change", { bubbles: true }));
      } else {
        this.selected = !this.selected;
      }
    }
  }

  /** @private */
  #handleSelectedIconSlotChange(e: Event): void {
    this._base?.classList.toggle("with-selected-icon", hasAssignedNodes(<HTMLSlotElement>e.target));
  }

  /** @private */
  @debounce(40)
  private _handleResize(): void {
    if (this.grouped && !this.classList.contains("-pressed")) {
      this.style.setProperty("--_button-width", `${this.clientWidth}px`);
      this.#updateButtonShape(true);
    }
  }

  /** @private */
  #updateButtonShape(force = false): void {
    if (!this._base) return;
    const shape = parseFloat(getComputedStyle(this._base).borderRadius);
    if (!isNaN(shape) || force) {
      const adjustedShape = this.clientHeight / 2;
      if (adjustedShape < shape || force) {
        this._base?.style.setProperty("--_button-shape", `${adjustedShape}px`);
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-button": M3eButtonElement;
  }
}
