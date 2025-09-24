import { CSSResultGroup, html, LitElement, PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import {
  renderPseudoLink,
  AttachInternals,
  Disabled,
  DisabledInteractive,
  Focusable,
  FormSubmitter,
  LinkButton,
  M3eElevationElement,
  M3eFocusRingElement,
  M3eRippleElement,
  M3eStateLayerElement,
  PressedController,
  Role,
  KeyboardClick,
} from "@m3e/core";

import { FabSize } from "./FabSize";
import { FabVariant } from "./FabVariant";

import { FabSizeStyle, FabStyle, FabVariantStyle } from "./styles";

/**
 * @summary
 * A floating action button (FAB) used to present important actions.
 *
 * @description
 * The `m3e-fab` component is a prominent, expressive UI component that represents the primary action on a screen.
 * Designed according to Material Design 3 guidelines, it supports seven visual variants, specified using the
 * `variant` attribute—`primary`, `primary-container`, `secondary`, `secondary-container`, `tertiary`, `tertiary-container`
 * and `surface`—each with dynamic elevation and adaptive color theming.
 *
 * The component is accessible by default, with ARIA roles, contrast-safe color tokens, and strong focus indicators.
 * It can be extended to display a label alongside its icon, and responds to interaction states (hover, focus, press, disabled)
 * with smooth motion transitions, elevation changes, and adaptive color theming. It can also function as a link or be
 * used to submit form data.
 *
 * Native disabled `<button>` elements cannot receive focus. This can be problematic in some cases because it can prevent you
 * from telling the user why the button is disabled. You can use the `disabled-interactive` attribute to style a `m3e-fab`
 * as disabled but allow for it to receive focus. The button will have `aria-disabled="true"` for assistive technology.
 *
 * @example
 * The following example illustrates a basic floating action button.
 * ```html
 * <m3e-fab>
 *  <m3e-icon>add</m3e-icon>
 * </m3e-fab>
 * ```
 *
 * @example
 * The next example illustrates an extended floating action button.
 * ```html
 * <m3e-fab extended>
 *  <m3e-icon>add</m3e-icon>
 *  <span slot="label">Add</span>
 * </m3e-fab>
 * ```
 *
 * @tag m3e-fab
 *
 * @slot - Renders the icon of the button.
 * @slot label - Renders the label of an extended button.
 * @slot close-icon - Renders the close icon when used to open a FAB menu.
 *
 * @attr disabled - Whether the element is disabled.
 * @attr disabled-interactive - Whether the element is disabled and interactive.
 * @attr download - A value indicating whether the `target` of the link button will be downloaded, optionally specifying the new name of the file.
 * @attr extended - Whether the button is extended to show the label.
 * @attr href - The URL to which the link button points.
 * @attr lowered - Whether to present a lowered elevation.
 * @attr name - The name of the element, submitted as a pair with the element's `value` as part of form data, when the element is used to submit a form.
 * @attr rel - The relationship between the `target` of the link button and the document.
 * @attr size - The size of the button.
 * @attr target - The target of the link button.
 * @attr type - The type of the element.
 * @attr value - The value associated with the element's name when it's submitted with form data.
 * @attr variant - The appearance variant of the button.
 *
 * @cssprop --m3e-fab-small-container-height - Height of the small FAB container.
 * @cssprop --m3e-fab-small-label-text-font-size - Font size for the small FAB label text.
 * @cssprop --m3e-fab-small-label-text-font-weight - Font weight for the small FAB label text.
 * @cssprop --m3e-fab-small-label-text-line-height - Line height for the small FAB label text.
 * @cssprop --m3e-fab-small-label-text-tracking - Letter spacing (tracking) for the small FAB label text.
 * @cssprop --m3e-fab-small-icon-size - Icon size for the small FAB.
 * @cssprop --m3e-fab-small-shape - Border radius for the small FAB.
 * @cssprop --m3e-fab-small-leading-space - Leading space for the small FAB.
 * @cssprop --m3e-fab-small-trailing-space - Trailing space for the small FAB.
 * @cssprop --m3e-fab-small-icon-label-space - Space between icon and label for the small FAB.
 * @cssprop --m3e-fab-medium-container-height - Height of the medium FAB container.
 * @cssprop --m3e-fab-medium-label-text-font-size - Font size for the medium FAB label text.
 * @cssprop --m3e-fab-medium-label-text-font-weight - Font weight for the medium FAB label text.
 * @cssprop --m3e-fab-medium-label-text-line-height - Line height for the medium FAB label text.
 * @cssprop --m3e-fab-medium-label-text-tracking - Letter spacing (tracking) for the medium FAB label text.
 * @cssprop --m3e-fab-medium-icon-size - Icon size for the medium FAB.
 * @cssprop --m3e-fab-medium-shape - Border radius for the medium FAB.
 * @cssprop --m3e-fab-medium-leading-space - Leading space for the medium FAB.
 * @cssprop --m3e-fab-medium-trailing-space - Trailing space for the medium FAB.
 * @cssprop --m3e-fab-medium-icon-label-space - Space between icon and label for the medium FAB.
 * @cssprop --m3e-fab-large-container-height - Height of the large FAB container.
 * @cssprop --m3e-fab-large-label-text-font-size - Font size for the large FAB label text.
 * @cssprop --m3e-fab-large-label-text-font-weight - Font weight for the large FAB label text.
 * @cssprop --m3e-fab-large-label-text-line-height - Line height for the large FAB label text.
 * @cssprop --m3e-fab-large-label-text-tracking - Letter spacing (tracking) for the large FAB label text.
 * @cssprop --m3e-fab-large-icon-size - Icon size for the large FAB.
 * @cssprop --m3e-fab-large-shape - Border radius for the large FAB.
 * @cssprop --m3e-fab-large-leading-space - Leading space for the large FAB.
 * @cssprop --m3e-fab-large-trailing-space - Trailing space for the large FAB.
 * @cssprop --m3e-fab-large-icon-label-space - Space between icon and label for the large FAB.
 * @cssprop --m3e-primary-fab-label-text-color - Default label text color for primary FAB.
 * @cssprop --m3e-primary-fab-icon-color - Default icon color for primary FAB.
 * @cssprop --m3e-primary-fab-container-color - Default container background color for primary FAB.
 * @cssprop --m3e-primary-fab-container-elevation - Resting elevation for primary FAB.
 * @cssprop --m3e-primary-fab-lowered-container-elevation - Lowered resting elevation for primary FAB.
 * @cssprop --m3e-primary-fab-disabled-container-color - Container background color when disabled (primary).
 * @cssprop --m3e-primary-fab-disabled-container-opacity - Opacity of container when disabled (primary).
 * @cssprop --m3e-primary-fab-disabled-icon-color - Icon color when disabled (primary).
 * @cssprop --m3e-primary-fab-disabled-icon-opacity - Icon opacity when disabled (primary).
 * @cssprop --m3e-primary-fab-disabled-label-text-color - Label text color when disabled (primary).
 * @cssprop --m3e-primary-fab-disabled-label-text-opacity - Label text opacity when disabled (primary).
 * @cssprop --m3e-primary-fab-disabled-container-elevation - Elevation when disabled (primary).
 * @cssprop --m3e-primary-fab-lowered-disabled-container-elevation - Lowered elevation when disabled (primary).
 * @cssprop --m3e-primary-fab-hover-icon-color - Icon color on hover (primary).
 * @cssprop --m3e-primary-fab-hover-label-text-color - Label text color on hover (primary).
 * @cssprop --m3e-primary-fab-hover-state-layer-color - State layer color on hover (primary).
 * @cssprop --m3e-primary-fab-hover-state-layer-opacity - State layer opacity on hover (primary).
 * @cssprop --m3e-primary-fab-hover-container-elevation - Elevation on hover (primary).
 * @cssprop --m3e-primary-fab-lowered-hover-container-elevation - Lowered elevation on hover (primary).
 * @cssprop --m3e-primary-fab-focus-icon-color - Icon color on focus (primary).
 * @cssprop --m3e-primary-fab-focus-label-text-color - Label text color on focus (primary).
 * @cssprop --m3e-primary-fab-focus-state-layer-color - State layer color on focus (primary).
 * @cssprop --m3e-primary-fab-focus-state-layer-opacity - State layer opacity on focus (primary).
 * @cssprop --m3e-primary-fab-focus-container-elevation - Elevation on focus (primary).
 * @cssprop --m3e-primary-fab-lowered-focus-container-elevation - Lowered elevation on focus (primary).
 * @cssprop --m3e-primary-fab-pressed-icon-color - Icon color on pressed (primary).
 * @cssprop --m3e-primary-fab-pressed-label-text-color - Label text color on pressed (primary).
 * @cssprop --m3e-primary-fab-pressed-state-layer-color - State layer color on pressed (primary).
 * @cssprop --m3e-primary-fab-pressed-state-layer-opacity - State layer opacity on pressed (primary).
 * @cssprop --m3e-primary-fab-pressed-container-elevation - Elevation on pressed (primary).
 * @cssprop --m3e-primary-fab-lowered-pressed-container-elevation - Lowered elevation on pressed (primary).
 * @cssprop --m3e-secondary-fab-label-text-color - Default label text color for secondary FAB.
 * @cssprop --m3e-secondary-fab-icon-color - Default icon color for secondary FAB.
 * @cssprop --m3e-secondary-fab-container-color - Default container background color for secondary FAB.
 * @cssprop --m3e-secondary-fab-container-elevation - Resting elevation for secondary FAB.
 * @cssprop --m3e-secondary-fab-lowered-container-elevation - Lowered resting elevation for secondary FAB.
 * @cssprop --m3e-secondary-fab-disabled-container-color - Container background color when disabled (secondary).
 * @cssprop --m3e-secondary-fab-disabled-container-opacity - Opacity of container when disabled (secondary).
 * @cssprop --m3e-secondary-fab-disabled-icon-color - Icon color when disabled (secondary).
 * @cssprop --m3e-secondary-fab-disabled-icon-opacity - Icon opacity when disabled (secondary).
 * @cssprop --m3e-secondary-fab-disabled-label-text-color - Label text color when disabled (secondary).
 * @cssprop --m3e-secondary-fab-disabled-label-text-opacity - Label text opacity when disabled (secondary).
 * @cssprop --m3e-secondary-fab-disabled-container-elevation - Elevation when disabled (secondary).
 * @cssprop --m3e-secondary-fab-lowered-disabled-container-elevation - Lowered elevation when disabled (secondary).
 * @cssprop --m3e-secondary-fab-hover-icon-color - Icon color on hover (secondary).
 * @cssprop --m3e-secondary-fab-hover-label-text-color - Label text color on hover (secondary).
 * @cssprop --m3e-secondary-fab-hover-state-layer-color - State layer color on hover (secondary).
 * @cssprop --m3e-secondary-fab-hover-state-layer-opacity - State layer opacity on hover (secondary).
 * @cssprop --m3e-secondary-fab-hover-container-elevation - Elevation on hover (secondary).
 * @cssprop --m3e-secondary-fab-lowered-hover-container-elevation - Lowered elevation on hover (secondary).
 * @cssprop --m3e-secondary-fab-focus-icon-color - Icon color on focus (secondary).
 * @cssprop --m3e-secondary-fab-focus-label-text-color - Label text color on focus (secondary).
 * @cssprop --m3e-secondary-fab-focus-state-layer-color - State layer color on focus (secondary).
 * @cssprop --m3e-secondary-fab-focus-state-layer-opacity - State layer opacity on focus (secondary).
 * @cssprop --m3e-secondary-fab-focus-container-elevation - Elevation on focus (secondary).
 * @cssprop --m3e-secondary-fab-lowered-focus-container-elevation - Lowered elevation on focus (secondary).
 * @cssprop --m3e-secondary-fab-pressed-icon-color - Icon color on pressed (secondary).
 * @cssprop --m3e-secondary-fab-pressed-label-text-color - Label text color on pressed (secondary).
 * @cssprop --m3e-secondary-fab-pressed-state-layer-color - State layer color on pressed (secondary).
 * @cssprop --m3e-secondary-fab-pressed-state-layer-opacity - State layer opacity on pressed (secondary).
 * @cssprop --m3e-secondary-fab-pressed-container-elevation - Elevation on pressed (secondary).
 * @cssprop --m3e-secondary-fab-lowered-pressed-container-elevation - Lowered elevation on pressed (secondary).
 * @cssprop --m3e-tertiary-fab-label-text-color - Default label text color for tertiary FAB.
 * @cssprop --m3e-tertiary-fab-icon-color - Default icon color for tertiary FAB.
 * @cssprop --m3e-tertiary-fab-container-color - Default container background color for tertiary FAB.
 * @cssprop --m3e-tertiary-fab-container-elevation - Resting elevation for tertiary FAB.
 * @cssprop --m3e-tertiary-fab-lowered-container-elevation - Lowered resting elevation for tertiary FAB.
 * @cssprop --m3e-tertiary-fab-disabled-container-color - Container background color when disabled (tertiary).
 * @cssprop --m3e-tertiary-fab-disabled-container-opacity - Opacity of container when disabled (tertiary).
 * @cssprop --m3e-tertiary-fab-disabled-icon-color - Icon color when disabled (tertiary).
 * @cssprop --m3e-tertiary-fab-disabled-icon-opacity - Icon opacity when disabled (tertiary).
 * @cssprop --m3e-tertiary-fab-disabled-label-text-color - Label text color when disabled (tertiary).
 * @cssprop --m3e-tertiary-fab-disabled-label-text-opacity - Label text opacity when disabled (tertiary).
 * @cssprop --m3e-tertiary-fab-disabled-container-elevation - Elevation when disabled (tertiary).
 * @cssprop --m3e-tertiary-fab-lowered-disabled-container-elevation - Lowered elevation when disabled (tertiary).
 * @cssprop --m3e-tertiary-fab-hover-icon-color - Icon color on hover (tertiary).
 * @cssprop --m3e-tertiary-fab-hover-label-text-color - Label text color on hover (tertiary).
 * @cssprop --m3e-tertiary-fab-hover-state-layer-color - State layer color on hover (tertiary).
 * @cssprop --m3e-tertiary-fab-hover-state-layer-opacity - State layer opacity on hover (tertiary).
 * @cssprop --m3e-tertiary-fab-hover-container-elevation - Elevation on hover (tertiary).
 * @cssprop --m3e-tertiary-fab-lowered-hover-container-elevation - Lowered elevation on hover (tertiary).
 * @cssprop --m3e-tertiary-fab-focus-icon-color - Icon color on focus (tertiary).
 * @cssprop --m3e-tertiary-fab-focus-label-text-color - Label text color on focus (tertiary).
 * @cssprop --m3e-tertiary-fab-focus-state-layer-color - State layer color on focus (tertiary).
 * @cssprop --m3e-tertiary-fab-focus-state-layer-opacity - State layer opacity on focus (tertiary).
 * @cssprop --m3e-tertiary-fab-focus-container-elevation - Elevation on focus (tertiary).
 * @cssprop --m3e-tertiary-fab-lowered-focus-container-elevation - Lowered elevation on focus (tertiary).
 * @cssprop --m3e-tertiary-fab-pressed-icon-color - Icon color on pressed (tertiary).
 * @cssprop --m3e-tertiary-fab-pressed-label-text-color - Label text color on pressed (tertiary).
 * @cssprop --m3e-tertiary-fab-pressed-state-layer-color - State layer color on pressed (tertiary).
 * @cssprop --m3e-tertiary-fab-pressed-state-layer-opacity - State layer opacity on pressed (tertiary).
 * @cssprop --m3e-tertiary-fab-pressed-container-elevation - Elevation on pressed (tertiary).
 * @cssprop --m3e-tertiary-fab-lowered-pressed-container-elevation - Lowered elevation on pressed (tertiary).
 * @cssprop --m3e-primary-container-fab-label-text-color - Default label text color for primary-container FAB.
 * @cssprop --m3e-primary-container-fab-icon-color - Default icon color for primary-container FAB.
 * @cssprop --m3e-primary-container-fab-container-color - Default container background color for primary-container FAB.
 * @cssprop --m3e-primary-container-fab-container-elevation - Resting elevation for primary-container FAB.
 * @cssprop --m3e-primary-container-fab-lowered-container-elevation - Lowered resting elevation for primary-container FAB.
 * @cssprop --m3e-primary-container-fab-disabled-container-color - Container background color when disabled (primary-container).
 * @cssprop --m3e-primary-container-fab-disabled-container-opacity - Opacity of container when disabled (primary-container).
 * @cssprop --m3e-primary-container-fab-disabled-icon-color - Icon color when disabled (primary-container).
 * @cssprop --m3e-primary-container-fab-disabled-icon-opacity - Icon opacity when disabled (primary-container).
 * @cssprop --m3e-primary-container-fab-disabled-label-text-color - Label text color when disabled (primary-container).
 * @cssprop --m3e-primary-container-fab-disabled-label-text-opacity - Label text opacity when disabled (primary-container).
 * @cssprop --m3e-primary-container-fab-disabled-container-elevation - Elevation when disabled (primary-container).
 * @cssprop --m3e-primary-container-fab-lowered-disabled-container-elevation - Lowered elevation when disabled (primary-container).
 * @cssprop --m3e-primary-container-fab-hover-icon-color - Icon color on hover (primary-container).
 * @cssprop --m3e-primary-container-fab-hover-label-text-color - Label text color on hover (primary-container).
 * @cssprop --m3e-primary-container-fab-hover-state-layer-color - State layer color on hover (primary-container).
 * @cssprop --m3e-primary-container-fab-hover-state-layer-opacity - State layer opacity on hover (primary-container).
 * @cssprop --m3e-primary-container-fab-hover-container-elevation - Elevation on hover (primary-container).
 * @cssprop --m3e-primary-container-fab-lowered-hover-container-elevation - Lowered elevation on hover (primary-container).
 * @cssprop --m3e-primary-container-fab-focus-icon-color - Icon color on focus (primary-container).
 * @cssprop --m3e-primary-container-fab-focus-label-text-color - Label text color on focus (primary-container).
 * @cssprop --m3e-primary-container-fab-focus-state-layer-color - State layer color on focus (primary-container).
 * @cssprop --m3e-primary-container-fab-focus-state-layer-opacity - State layer opacity on focus (primary-container).
 * @cssprop --m3e-primary-container-fab-focus-container-elevation - Elevation on focus (primary-container).
 * @cssprop --m3e-primary-container-fab-lowered-focus-container-elevation - Lowered elevation on focus (primary-container).
 * @cssprop --m3e-primary-container-fab-pressed-icon-color - Icon color on pressed (primary-container).
 * @cssprop --m3e-primary-container-fab-pressed-label-text-color - Label text color on pressed (primary-container).
 * @cssprop --m3e-primary-container-fab-pressed-state-layer-color - State layer color on pressed (primary-container).
 * @cssprop --m3e-primary-container-fab-pressed-state-layer-opacity - State layer opacity on pressed (primary-container).
 * @cssprop --m3e-primary-container-fab-pressed-container-elevation - Elevation on pressed (primary-container).
 * @cssprop --m3e-primary-container-fab-lowered-pressed-container-elevation - Lowered elevation on pressed (primary-container).
 * @cssprop --m3e-secondary-container-fab-label-text-color - Default label text color for secondary-container FAB.
 * @cssprop --m3e-secondary-container-fab-icon-color - Default icon color for secondary-container FAB.
 * @cssprop --m3e-secondary-container-fab-container-color - Default container background color for secondary-container FAB.
 * @cssprop --m3e-secondary-container-fab-container-elevation - Resting elevation for secondary-container FAB.
 * @cssprop --m3e-secondary-container-fab-lowered-container-elevation - Lowered resting elevation for secondary-container FAB.
 * @cssprop --m3e-secondary-container-fab-disabled-container-color - Container background color when disabled (secondary-container).
 * @cssprop --m3e-secondary-container-fab-disabled-container-opacity - Opacity of container when disabled (secondary-container).
 * @cssprop --m3e-secondary-container-fab-disabled-icon-color - Icon color when disabled (secondary-container).
 * @cssprop --m3e-secondary-container-fab-disabled-icon-opacity - Icon opacity when disabled (secondary-container).
 * @cssprop --m3e-secondary-container-fab-disabled-label-text-color - Label text color when disabled (secondary-container).
 * @cssprop --m3e-secondary-container-fab-disabled-label-text-opacity - Label text opacity when disabled (secondary-container).
 * @cssprop --m3e-secondary-container-fab-disabled-container-elevation - Elevation when disabled (secondary-container).
 * @cssprop --m3e-secondary-container-fab-lowered-disabled-container-elevation - Lowered elevation when disabled (secondary-container).
 * @cssprop --m3e-secondary-container-fab-hover-icon-color - Icon color on hover (secondary-container).
 * @cssprop --m3e-secondary-container-fab-hover-label-text-color - Label text color on hover (secondary-container).
 * @cssprop --m3e-secondary-container-fab-hover-state-layer-color - State layer color on hover (secondary-container).
 * @cssprop --m3e-secondary-container-fab-hover-state-layer-opacity - State layer opacity on hover (secondary-container).
 * @cssprop --m3e-secondary-container-fab-hover-container-elevation - Elevation on hover (secondary-container).
 * @cssprop --m3e-secondary-container-fab-lowered-hover-container-elevation - Lowered elevation on hover (secondary-container).
 * @cssprop --m3e-secondary-container-fab-focus-icon-color - Icon color on focus (secondary-container).
 * @cssprop --m3e-secondary-container-fab-focus-label-text-color - Label text color on focus (secondary-container).
 * @cssprop --m3e-secondary-container-fab-focus-state-layer-color - State layer color on focus (secondary-container).
 * @cssprop --m3e-secondary-container-fab-focus-state-layer-opacity - State layer opacity on focus (secondary-container).
 * @cssprop --m3e-secondary-container-fab-focus-container-elevation - Elevation on focus (secondary-container).
 * @cssprop --m3e-secondary-container-fab-lowered-focus-container-elevation - Lowered elevation on focus (secondary-container).
 * @cssprop --m3e-secondary-container-fab-pressed-icon-color - Icon color on pressed (secondary-container).
 * @cssprop --m3e-secondary-container-fab-pressed-label-text-color - Label text color on pressed (secondary-container).
 * @cssprop --m3e-secondary-container-fab-pressed-state-layer-color - State layer color on pressed (secondary-container).
 * @cssprop --m3e-secondary-container-fab-pressed-state-layer-opacity - State layer opacity on pressed (secondary-container).
 * @cssprop --m3e-secondary-container-fab-pressed-container-elevation - Elevation on pressed (secondary-container).
 * @cssprop --m3e-secondary-container-fab-lowered-pressed-container-elevation - Lowered elevation on pressed (secondary-container).
 * @cssprop --m3e-tertiary-container-fab-label-text-color - Default label text color for tertiary-container FAB.
 * @cssprop --m3e-tertiary-container-fab-icon-color - Default icon color for tertiary-container FAB.
 * @cssprop --m3e-tertiary-container-fab-container-color - Default container background color for tertiary-container FAB.
 * @cssprop --m3e-tertiary-container-fab-container-elevation - Resting elevation for tertiary-container FAB.
 * @cssprop --m3e-tertiary-container-fab-lowered-container-elevation - Lowered resting elevation for tertiary-container FAB.
 * @cssprop --m3e-tertiary-container-fab-disabled-container-color - Container background color when disabled (tertiary-container).
 * @cssprop --m3e-tertiary-container-fab-disabled-container-opacity - Opacity of container when disabled (tertiary-container).
 * @cssprop --m3e-tertiary-container-fab-disabled-icon-color - Icon color when disabled (tertiary-container).
 * @cssprop --m3e-tertiary-container-fab-disabled-icon-opacity - Icon opacity when disabled (tertiary-container).
 * @cssprop --m3e-tertiary-container-fab-disabled-label-text-color - Label text color when disabled (tertiary-container).
 * @cssprop --m3e-tertiary-container-fab-disabled-label-text-opacity - Label text opacity when disabled (tertiary-container).
 * @cssprop --m3e-tertiary-container-fab-disabled-container-elevation - Elevation when disabled (tertiary-container).
 * @cssprop --m3e-tertiary-container-fab-lowered-disabled-container-elevation - Lowered elevation when disabled (tertiary-container).
 * @cssprop --m3e-tertiary-container-fab-hover-icon-color - Icon color on hover (tertiary-container).
 * @cssprop --m3e-tertiary-container-fab-hover-label-text-color - Label text color on hover (tertiary-container).
 * @cssprop --m3e-tertiary-container-fab-hover-state-layer-color - State layer color on hover (tertiary-container).
 * @cssprop --m3e-tertiary-container-fab-hover-state-layer-opacity - State layer opacity on hover (tertiary-container).
 * @cssprop --m3e-tertiary-container-fab-hover-container-elevation - Elevation on hover (tertiary-container).
 * @cssprop --m3e-tertiary-container-fab-lowered-hover-container-elevation - Lowered elevation on hover (tertiary-container).
 * @cssprop --m3e-tertiary-container-fab-focus-icon-color - Icon color on focus (tertiary-container).
 * @cssprop --m3e-tertiary-container-fab-focus-label-text-color - Label text color on focus (tertiary-container).
 * @cssprop --m3e-tertiary-container-fab-focus-state-layer-color - State layer color on focus (tertiary-container).
 * @cssprop --m3e-tertiary-container-fab-focus-state-layer-opacity - State layer opacity on focus (tertiary-container).
 * @cssprop --m3e-tertiary-container-fab-focus-container-elevation - Elevation on focus (tertiary-container).
 * @cssprop --m3e-tertiary-container-fab-lowered-focus-container-elevation - Lowered elevation on focus (tertiary-container).
 * @cssprop --m3e-tertiary-container-fab-pressed-icon-color - Icon color on pressed (tertiary-container).
 * @cssprop --m3e-tertiary-container-fab-pressed-label-text-color - Label text color on pressed (tertiary-container).
 * @cssprop --m3e-tertiary-container-fab-pressed-state-layer-color - State layer color on pressed (tertiary-container).
 * @cssprop --m3e-tertiary-container-fab-pressed-state-layer-opacity - State layer opacity on pressed (tertiary-container).
 * @cssprop --m3e-tertiary-container-fab-pressed-container-elevation - Elevation on pressed (tertiary-container).
 * @cssprop --m3e-tertiary-container-fab-lowered-pressed-container-elevation - Lowered elevation on pressed (tertiary-container).
 * @cssprop --m3e-surface-fab-label-text-color - Default label text color for surface FAB.
 * @cssprop --m3e-surface-fab-icon-color - Default icon color for surface FAB.
 * @cssprop --m3e-surface-fab-container-color - Default container background color for surface FAB.
 * @cssprop --m3e-surface-fab-container-elevation - Resting elevation for surface FAB.
 * @cssprop --m3e-surface-fab-lowered-container-elevation - Lowered resting elevation for surface FAB.
 * @cssprop --m3e-surface-fab-lowered-container-color - Lowered container background color for surface FAB.
 * @cssprop --m3e-surface-fab-disabled-container-color - Container background color when disabled (surface).
 * @cssprop --m3e-surface-fab-disabled-container-opacity - Opacity of container when disabled (surface).
 * @cssprop --m3e-surface-fab-disabled-icon-color - Icon color when disabled (surface).
 * @cssprop --m3e-surface-fab-disabled-icon-opacity - Icon opacity when disabled (surface).
 * @cssprop --m3e-surface-fab-disabled-label-text-color - Label text color when disabled (surface).
 * @cssprop --m3e-surface-fab-disabled-label-text-opacity - Label text opacity when disabled (surface).
 * @cssprop --m3e-surface-fab-disabled-container-elevation - Elevation when disabled (surface).
 * @cssprop --m3e-surface-fab-lowered-disabled-container-elevation - Lowered elevation when disabled (surface).
 * @cssprop --m3e-surface-fab-hover-icon-color - Icon color on hover (surface).
 * @cssprop --m3e-surface-fab-hover-label-text-color - Label text color on hover (surface).
 * @cssprop --m3e-surface-fab-hover-state-layer-color - State layer color on hover (surface).
 * @cssprop --m3e-surface-fab-hover-state-layer-opacity - State layer opacity on hover (surface).
 * @cssprop --m3e-surface-fab-hover-container-elevation - Elevation on hover (surface).
 * @cssprop --m3e-surface-fab-lowered-hover-container-elevation - Lowered elevation on hover (surface).
 * @cssprop --m3e-surface-fab-focus-icon-color - Icon color on focus (surface).
 * @cssprop --m3e-surface-fab-focus-label-text-color - Label text color on focus (surface).
 * @cssprop --m3e-surface-fab-focus-state-layer-color - State layer color on focus (surface).
 * @cssprop --m3e-surface-fab-focus-state-layer-opacity - State layer opacity on focus (surface).
 * @cssprop --m3e-surface-fab-focus-container-elevation - Elevation on focus (surface).
 * @cssprop --m3e-surface-fab-lowered-focus-container-elevation - Lowered elevation on focus (surface).
 * @cssprop --m3e-surface-fab-pressed-icon-color - Icon color on pressed (surface).
 * @cssprop --m3e-surface-fab-pressed-label-text-color - Label text color on pressed (surface).
 * @cssprop --m3e-surface-fab-pressed-state-layer-color - State layer color on pressed (surface).
 * @cssprop --m3e-surface-fab-pressed-state-layer-opacity - State layer opacity on pressed (surface).
 * @cssprop --m3e-surface-fab-pressed-container-elevation - Elevation on pressed (surface).
 * @cssprop --m3e-surface-fab-lowered-pressed-container-elevation - Lowered elevation on pressed (surface).
 */
@customElement("m3e-fab")
export class M3eFabElement extends KeyboardClick(
  LinkButton(FormSubmitter(Focusable(DisabledInteractive(Disabled(AttachInternals(Role(LitElement, "button"), true))))))
) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = [FabStyle, FabSizeStyle, FabVariantStyle];

  /** @private */ @query(".base") private readonly _base?: HTMLElement;
  /** @private */ @query(".elevation") private readonly _elevation?: M3eElevationElement;
  /** @private */ @query(".focus-ring") private readonly _focusRing?: M3eFocusRingElement;
  /** @private */ @query(".state-layer") private readonly _stateLayer?: M3eStateLayerElement;
  /** @private */ @query(".ripple") private readonly _ripple?: M3eRippleElement;

  constructor() {
    super();

    new PressedController(this, {
      isPressedKey: (key) => key === " " || key === "Enter",
      callback: (pressed) => {
        if (!this.disabled && !this.disabledInteractive) {
          this._base?.classList.toggle("pressed", pressed);
          this._base?.classList.toggle("resting", !pressed);
        }
      },
    });
  }

  /**
   * The appearance variant of the button.
   * @default "primary-container"
   */
  @property({ reflect: true }) variant: FabVariant = "primary-container";

  /**
   * Whether to present a lowered elevation.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) lowered = false;

  /**
   * The size of the button.
   * @default "medium"
   */
  @property({ reflect: true }) size: FabSize = "medium";

  /**
   * Whether the button is extended to show the label.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) extended = false;

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this._base?.classList.toggle("pressed", false);
    this._base?.classList.toggle("resting", false);
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
      this._base?.classList.toggle("pressed", false);
      this._base?.classList.toggle("resting", false);
    }
  }

  /** @inheritdoc */
  override render(): unknown {
    return html`<div class="base">
      <m3e-elevation class="elevation" ?disabled="${this.disabled || this.disabledInteractive}"></m3e-elevation>
      <m3e-state-layer class="state-layer" ?disabled="${this.disabled || this.disabledInteractive}"></m3e-state-layer>
      <m3e-focus-ring class="focus-ring" ?disabled="${this.disabled}"></m3e-focus-ring>
      <m3e-ripple
        class="ripple"
        ?centered="${!this.extended}"
        ?disabled="${this.disabled || this.disabledInteractive}"
      ></m3e-ripple>
      <div class="touch" aria-hidden="true"></div>
      ${this[renderPseudoLink]()}
      <div class="wrapper">
        <slot class="icon" aria-hidden="true" @slotchange="${this.#handleSlotChange}"></slot>
        <slot class="icon" aria-hidden="true" name="close-icon">
          <svg class="close-icon" viewBox="0 -960 960 960" fill="currentColor">
            <path
              d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
            />
          </svg>
        </slot>
        <div class="label">
          <slot name="label" @slotchange="${this.#handleSlotChange}"></slot>
        </div>
      </div>
    </div>`;
  }

  /** @private */
  #handleSlotChange(): void {
    this._base?.classList.toggle("-with-menu", this.querySelector("m3e-fab-menu-trigger") !== null);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-fab": M3eFabElement;
  }
}
