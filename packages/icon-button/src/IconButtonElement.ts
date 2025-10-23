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
  debounce,
  ResizeController,
} from "@m3e/core";

import { IconButtonSize } from "./IconButtonSize";
import { IconButtonShape } from "./IconButtonShape";
import { IconButtonVariant } from "./IconButtonVariant";

import { IconButtonStyle, IconButtonSizeStyle, IconButtonVariantStyle } from "./styles";
import { IconButtonWidth } from "./IconButtonWidth";

/**
 * An icon button users interact with to perform a supplementary action.
 *
 * @description
 * The `m3e-icon-button` component is a semantic, expressive UI primitive for triggering actions with a single icon.
 * Designed according to Material Design 3 guidelines, it supports five four variants, specified using the
 * `variant` attribute—`filled`, `tonal`, `outlined`, and `standard`—each with dynamic elevation, shape morphing, and
 * adaptive color theming. The component responds to interaction states (hover, focus, press, disabled) with smooth motion
 * transitions, ensuring emotional clarity and visual hierarchy.
 *
 * The component is accessible by default, with ARIA roles, contrast-safe color tokens, and strong focus indicators.
 * It supports optional icons and states for binary actions.  When using `m3e-icon` for icons, `filled` is automatically
 * set based on the selected state of a toggle button. It can also function as a link or be used to submit form data.
 *
 * Native disabled `<button>` elements cannot receive focus. This can be problematic in some cases because it can prevent you
 * from telling the user why the button is disabled. You can use the `disabled-interactive` attribute to style a `m3e-icon-button`
 * as disabled but allow for it to receive focus. The button will have `aria-disabled="true"` for assistive technology.
 *
 * @example
 * The following example illustrates changing the appearance from `standard` (default) to `filled` using the `variant`
 * attribute, changing the size using the `size` attribute, and enabling toggle behavior using the `toggle` attribute.
 *
 * ```html
 * <m3e-icon-button variant="filled" size="large" toggle selected>
 *  <m3e-icon name="favorite"></m3e-icon>
 * </m3e-icon-button>
 * ```
 *
 * @tag m3e-icon-button
 *
 * @slot - Renders the icon of the button.
 * @slot selected - Renders an icon, when selected.
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
 * @attr width - The width of the button.
 *
 * @fires input - Dispatched when a toggle button's selected state changes.
 * @fires change - Dispatched when a toggle button's selected state changes.
 * @fires click - Emitted when the element is clicked.
 *
 * @cssprop --m3e-icon-button-extra-small-container-height - Height of the extra-small container.
 * @cssprop --m3e-icon-button-extra-small-outline-thickness - Outline thickness for extra-small.
 * @cssprop --m3e-icon-button-extra-small-icon-size - Icon size for extra-small.
 * @cssprop --m3e-icon-button-extra-small-shape-round - Corner radius for round extra-small.
 * @cssprop --m3e-icon-button-extra-small-shape-square - Corner radius for square extra-small.
 * @cssprop --m3e-icon-button-extra-small-selected-shape-round - Corner radius for selected round extra-small.
 * @cssprop --m3e-icon-button-extra-small-selected-shape-square - Corner radius for selected square extra-small.
 * @cssprop --m3e-icon-button-extra-small-shape-pressed-morph - Corner radius for pressed extra-small.
 * @cssprop --m3e-icon-button-extra-small-narrow-leading-space - Leading space for extra-small (narrow).
 * @cssprop --m3e-icon-button-extra-small-narrow-trailing-space - Trailing space for extra-small (narrow).
 * @cssprop --m3e-icon-button-extra-small-default-leading-space - Leading space for extra-small (default).
 * @cssprop --m3e-icon-button-extra-small-default-trailing-space - Trailing space for extra-small (default).
 * @cssprop --m3e-icon-button-extra-small-wide-leading-space - Leading space for extra-small (wide).
 * @cssprop --m3e-icon-button-extra-small-wide-trailing-space - Trailing space for extra-small (wide).
 * @cssprop --m3e-icon-button-small-container-height - Height of the small container.
 * @cssprop --m3e-icon-button-small-outline-thickness - Outline thickness for small.
 * @cssprop --m3e-icon-button-small-icon-size - Icon size for small.
 * @cssprop --m3e-icon-button-small-shape-round - Corner radius for round small.
 * @cssprop --m3e-icon-button-small-shape-square - Corner radius for square small.
 * @cssprop --m3e-icon-button-small-selected-shape-round - Corner radius for selected round small.
 * @cssprop --m3e-icon-button-small-selected-shape-square - Corner radius for selected square small.
 * @cssprop --m3e-icon-button-small-shape-pressed-morph - Corner radius for pressed small.
 * @cssprop --m3e-icon-button-small-narrow-leading-space - Leading space for small (narrow).
 * @cssprop --m3e-icon-button-small-narrow-trailing-space - Trailing space for small (narrow).
 * @cssprop --m3e-icon-button-small-default-leading-space - Leading space for small (default).
 * @cssprop --m3e-icon-button-small-default-trailing-space - Trailing space for small (default).
 * @cssprop --m3e-icon-button-small-wide-leading-space - Leading space for small (wide).
 * @cssprop --m3e-icon-button-small-wide-trailing-space - Trailing space for small (wide).
 * @cssprop --m3e-icon-button-medium-container-height - Height of the medium container.
 * @cssprop --m3e-icon-button-medium-outline-thickness - Outline thickness for medium.
 * @cssprop --m3e-icon-button-medium-icon-size - Icon size for medium.
 * @cssprop --m3e-icon-button-medium-shape-round - Corner radius for round medium.
 * @cssprop --m3e-icon-button-medium-shape-square - Corner radius for square medium.
 * @cssprop --m3e-icon-button-medium-selected-shape-round - Corner radius for selected round medium.
 * @cssprop --m3e-icon-button-medium-selected-shape-square - Corner radius for selected square medium.
 * @cssprop --m3e-icon-button-medium-shape-pressed-morph - Corner radius for pressed medium.
 * @cssprop --m3e-icon-button-medium-narrow-leading-space - Leading space for medium (narrow).
 * @cssprop --m3e-icon-button-medium-narrow-trailing-space - Trailing space for medium (narrow).
 * @cssprop --m3e-icon-button-medium-default-leading-space - Leading space for medium (default).
 * @cssprop --m3e-icon-button-medium-default-trailing-space - Trailing space for medium (default).
 * @cssprop --m3e-icon-button-medium-wide-leading-space - Leading space for medium (wide).
 * @cssprop --m3e-icon-button-medium-wide-trailing-space - Trailing space for medium (wide).
 * @cssprop --m3e-icon-button-large-container-height - Height of the large container.
 * @cssprop --m3e-icon-button-large-outline-thickness - Outline thickness for large.
 * @cssprop --m3e-icon-button-large-icon-size - Icon size for large.
 * @cssprop --m3e-icon-button-large-shape-round - Corner radius for round large.
 * @cssprop --m3e-icon-button-large-shape-square - Corner radius for square large.
 * @cssprop --m3e-icon-button-large-selected-shape-round - Corner radius for selected round large.
 * @cssprop --m3e-icon-button-large-selected-shape-square - Corner radius for selected square large.
 * @cssprop --m3e-icon-button-large-shape-pressed-morph - Corner radius for pressed large.
 * @cssprop --m3e-icon-button-large-narrow-leading-space - Leading space for large (narrow).
 * @cssprop --m3e-icon-button-large-narrow-trailing-space - Trailing space for large (narrow).
 * @cssprop --m3e-icon-button-large-default-leading-space - Leading space for large (default).
 * @cssprop --m3e-icon-button-large-default-trailing-space - Trailing space for large (default).
 * @cssprop --m3e-icon-button-large-wide-leading-space - Leading space for large (wide).
 * @cssprop --m3e-icon-button-large-wide-trailing-space - Trailing space for large (wide).
 * @cssprop --m3e-icon-button-extra-large-container-height - Height of the extra-large container.
 * @cssprop --m3e-icon-button-extra-large-outline-thickness - Outline thickness for extra-large.
 * @cssprop --m3e-icon-button-extra-large-icon-size - Icon size for extra-large.
 * @cssprop --m3e-icon-button-extra-large-shape-round - Corner radius for round extra-large.
 * @cssprop --m3e-icon-button-extra-large-shape-square - Corner radius for square extra-large.
 * @cssprop --m3e-icon-button-extra-large-selected-shape-round - Corner radius for selected round extra-large.
 * @cssprop --m3e-icon-button-extra-large-selected-shape-square - Corner radius for selected square extra-large.
 * @cssprop --m3e-icon-button-extra-large-shape-pressed-morph - Corner radius for pressed extra-large.
 * @cssprop --m3e-icon-button-extra-large-narrow-leading-space - Leading space for extra-large (narrow).
 * @cssprop --m3e-icon-button-extra-large-narrow-trailing-space - Trailing space for extra-large (narrow).
 * @cssprop --m3e-icon-button-extra-large-default-leading-space - Leading space for extra-large (default).
 * @cssprop --m3e-icon-button-extra-large-default-trailing-space - Trailing space for extra-large (default).
 * @cssprop --m3e-icon-button-extra-large-wide-leading-space - Leading space for extra-large (wide).
 * @cssprop --m3e-icon-button-extra-large-wide-trailing-space - Trailing space for extra-large (wide).
 * @cssprop --m3e-outlined-icon-button-icon-color - Default icon color for outlined variant.
 * @cssprop --m3e-outlined-icon-button-outline-color - Default outline color for outlined variant.
 * @cssprop --m3e-outlined-icon-button-unselected-icon-color - Unselected icon color for outlined variant.
 * @cssprop --m3e-outlined-icon-button-selected-icon-color - Selected icon color for outlined variant.
 * @cssprop --m3e-outlined-icon-button-selected-container-color - Selected container background color for outlined variant.
 * @cssprop --m3e-outlined-icon-button-disabled-container-color - Container background color when disabled (outlined).
 * @cssprop --m3e-outlined-icon-button-disabled-container-opacity - Opacity of container when disabled (outlined).
 * @cssprop --m3e-outlined-icon-button-disabled-icon-color - Icon color when disabled (outlined).
 * @cssprop --m3e-outlined-icon-button-disabled-icon-opacity - Icon opacity when disabled (outlined).
 * @cssprop --m3e-outlined-icon-button-disabled-outline-color - Outline color when disabled (outlined).
 * @cssprop --m3e-outlined-icon-button-hover-icon-color - Icon color on hover (outlined).
 * @cssprop --m3e-outlined-icon-button-hover-outline-color - Outline color on hover (outlined).
 * @cssprop --m3e-outlined-icon-button-hover-state-layer-color - State layer color on hover (outlined).
 * @cssprop --m3e-outlined-icon-button-hover-state-layer-opacity - State layer opacity on hover (outlined).
 * @cssprop --m3e-outlined-icon-button-hover-unselected-icon-color - Unselected icon color on hover (outlined).
 * @cssprop --m3e-outlined-icon-button-hover-unselected-state-layer-color - Unselected state layer color on hover (outlined).
 * @cssprop --m3e-outlined-icon-button-hover-selected-icon-color - Selected icon color on hover (outlined).
 * @cssprop --m3e-outlined-icon-button-hover-selected-state-layer-color - Selected state layer color on hover (outlined).
 * @cssprop --m3e-outlined-icon-button-focus-icon-color - Icon color on focus (outlined).
 * @cssprop --m3e-outlined-icon-button-focus-outline-color - Outline color on focus (outlined).
 * @cssprop --m3e-outlined-icon-button-focus-state-layer-color - State layer color on focus (outlined).
 * @cssprop --m3e-outlined-icon-button-focus-state-layer-opacity - State layer opacity on focus (outlined).
 * @cssprop --m3e-outlined-icon-button-focus-unselected-icon-color - Unselected icon color on focus (outlined).
 * @cssprop --m3e-outlined-icon-button-focus-unselected-state-layer-color - Unselected state layer color on focus (outlined).
 * @cssprop --m3e-outlined-icon-button-focus-selected-icon-color - Selected icon color on focus (outlined).
 * @cssprop --m3e-outlined-icon-button-focus-selected-state-layer-color - Selected state layer color on focus (outlined).
 * @cssprop --m3e-outlined-icon-button-pressed-icon-color - Icon color on pressed (outlined).
 * @cssprop --m3e-outlined-icon-button-pressed-outline-color - Outline color on pressed (outlined).
 * @cssprop --m3e-outlined-icon-button-pressed-state-layer-color - State layer color on pressed (outlined).
 * @cssprop --m3e-outlined-icon-button-pressed-state-layer-opacity - State layer opacity on pressed (outlined).
 * @cssprop --m3e-outlined-icon-button-pressed-unselected-icon-color - Unselected icon color on pressed (outlined).
 * @cssprop --m3e-outlined-icon-button-pressed-unselected-state-layer-color - Unselected state layer color on pressed (outlined).
 * @cssprop --m3e-outlined-icon-button-pressed-selected-icon-color - Selected icon color on pressed (outlined).
 * @cssprop --m3e-outlined-icon-button-pressed-selected-state-layer-color - Selected state layer color on pressed (outlined).
 * @cssprop --m3e-filled-icon-button-icon-color - Default icon color for filled variant.
 * @cssprop --m3e-filled-icon-button-container-color - Default container background color for filled variant.
 * @cssprop --m3e-filled-icon-button-unselected-icon-color - Unselected icon color for filled variant.
 * @cssprop --m3e-filled-icon-button-unselected-container-color - Unselected container background color for filled variant.
 * @cssprop --m3e-filled-icon-button-selected-icon-color - Selected icon color for filled variant.
 * @cssprop --m3e-filled-icon-button-selected-container-color - Selected container background color for filled variant.
 * @cssprop --m3e-filled-icon-button-disabled-container-color - Container background color when disabled (filled).
 * @cssprop --m3e-filled-icon-button-disabled-container-opacity - Opacity of container when disabled (filled).
 * @cssprop --m3e-filled-icon-button-disabled-icon-color - Icon color when disabled (filled).
 * @cssprop --m3e-filled-icon-button-disabled-icon-opacity - Icon opacity when disabled (filled).
 * @cssprop --m3e-filled-icon-button-hover-icon-color - Icon color on hover (filled).
 * @cssprop --m3e-filled-icon-button-hover-state-layer-color - State layer color on hover (filled).
 * @cssprop --m3e-filled-icon-button-hover-state-layer-opacity - State layer opacity on hover (filled).
 * @cssprop --m3e-filled-icon-button-hover-unselected-icon-color - Unselected icon color on hover (filled).
 * @cssprop --m3e-filled-icon-button-hover-unselected-state-layer-color - Unselected state layer color on hover (filled).
 * @cssprop --m3e-filled-icon-button-hover-selected-icon-color - Selected icon color on hover (filled).
 * @cssprop --m3e-filled-icon-button-hover-selected-state-layer-color - Selected state layer color on hover (filled).
 * @cssprop --m3e-filled-icon-button-focus-icon-color - Icon color on focus (filled).
 * @cssprop --m3e-filled-icon-button-focus-state-layer-color - State layer color on focus (filled).
 * @cssprop --m3e-filled-icon-button-focus-state-layer-opacity - State layer opacity on focus (filled).
 * @cssprop --m3e-filled-icon-button-focus-unselected-icon-color - Unselected icon color on focus (filled).
 * @cssprop --m3e-filled-icon-button-focus-unselected-state-layer-color - Unselected state layer color on focus (filled).
 * @cssprop --m3e-filled-icon-button-focus-selected-icon-color - Selected icon color on focus (filled).
 * @cssprop --m3e-filled-icon-button-focus-selected-state-layer-color - Selected state layer color on focus (filled).
 * @cssprop --m3e-filled-icon-button-pressed-icon-color - Icon color on pressed (filled).
 * @cssprop --m3e-filled-icon-button-pressed-state-layer-color - State layer color on pressed (filled).
 * @cssprop --m3e-filled-icon-button-pressed-state-layer-opacity - State layer opacity on pressed (filled).
 * @cssprop --m3e-filled-icon-button-pressed-unselected-icon-color - Unselected icon color on pressed (filled).
 * @cssprop --m3e-filled-icon-button-pressed-unselected-state-layer-color - Unselected state layer color on pressed (filled).
 * @cssprop --m3e-filled-icon-button-pressed-selected-icon-color - Selected icon color on pressed (filled).
 * @cssprop --m3e-filled-icon-button-pressed-selected-state-layer-color - Selected state layer color on pressed (filled).
 * @cssprop --m3e-tonal-icon-button-icon-color - Default icon color for tonal variant.
 * @cssprop --m3e-tonal-icon-button-container-color - Default container background color for tonal variant.
 * @cssprop --m3e-tonal-icon-button-unselected-icon-color - Unselected icon color for tonal variant.
 * @cssprop --m3e-tonal-icon-button-unselected-container-color - Unselected container background color for tonal variant.
 * @cssprop --m3e-tonal-icon-button-selected-icon-color - Selected icon color for tonal variant.
 * @cssprop --m3e-tonal-icon-button-selected-container-color - Selected container background color for tonal variant.
 * @cssprop --m3e-tonal-icon-button-disabled-container-color - Container background color when disabled (tonal).
 * @cssprop --m3e-tonal-icon-button-disabled-container-opacity - Opacity of container when disabled (tonal).
 * @cssprop --m3e-tonal-icon-button-disabled-icon-color - Icon color when disabled (tonal).
 * @cssprop --m3e-tonal-icon-button-disabled-icon-opacity - Icon opacity when disabled (tonal).
 * @cssprop --m3e-tonal-icon-button-hover-icon-color - Icon color on hover (tonal).
 * @cssprop --m3e-tonal-icon-button-hover-state-layer-color - State layer color on hover (tonal).
 * @cssprop --m3e-tonal-icon-button-hover-state-layer-opacity - State layer opacity on hover (tonal).
 * @cssprop --m3e-tonal-icon-button-hover-unselected-icon-color - Unselected icon color on hover (tonal).
 * @cssprop --m3e-tonal-icon-button-hover-unselected-state-layer-color - Unselected state layer color on hover (tonal).
 * @cssprop --m3e-tonal-icon-button-hover-selected-icon-color - Selected icon color on hover (tonal).
 * @cssprop --m3e-tonal-icon-button-hover-selected-state-layer-color - Selected state layer color on hover (tonal).
 * @cssprop --m3e-tonal-icon-button-focus-icon-color - Icon color on focus (tonal).
 * @cssprop --m3e-tonal-icon-button-focus-state-layer-color - State layer color on focus (tonal).
 * @cssprop --m3e-tonal-icon-button-focus-state-layer-opacity - State layer opacity on focus (tonal).
 * @cssprop --m3e-tonal-icon-button-focus-unselected-icon-color - Unselected icon color on focus (tonal).
 * @cssprop --m3e-tonal-icon-button-focus-unselected-state-layer-color - Unselected state layer color on focus (tonal).
 * @cssprop --m3e-tonal-icon-button-focus-selected-icon-color - Selected icon color on focus (tonal).
 * @cssprop --m3e-tonal-icon-button-focus-selected-state-layer-color - Selected state layer color on focus (tonal).
 * @cssprop --m3e-tonal-icon-button-pressed-icon-color - Icon color on pressed (tonal).
 * @cssprop --m3e-tonal-icon-button-pressed-state-layer-color - State layer color on pressed (tonal).
 * @cssprop --m3e-tonal-icon-button-pressed-state-layer-opacity - State layer opacity on pressed (tonal).
 * @cssprop --m3e-tonal-icon-button-pressed-unselected-icon-color - Unselected icon color on pressed (tonal).
 * @cssprop --m3e-tonal-icon-button-pressed-unselected-state-layer-color - Unselected state layer color on pressed (tonal).
 * @cssprop --m3e-tonal-icon-button-pressed-selected-icon-color - Selected icon color on pressed (tonal).
 * @cssprop --m3e-tonal-icon-button-pressed-selected-state-layer-color - Selected state layer color on pressed (tonal).
 * @cssprop --m3e-standard-icon-button-icon-color - Default icon color for standard variant.
 * @cssprop --m3e-standard-icon-button-unselected-icon-color - Unselected icon color for standard variant.
 * @cssprop --m3e-standard-icon-button-selected-icon-color - Selected icon color for standard variant.
 * @cssprop --m3e-standard-icon-button-disabled-container-color - Container background color when disabled (standard).
 * @cssprop --m3e-standard-icon-button-disabled-container-opacity - Opacity of container when disabled (standard).
 * @cssprop --m3e-standard-icon-button-disabled-icon-color - Icon color when disabled (standard).
 * @cssprop --m3e-standard-icon-button-disabled-icon-opacity - Icon opacity when disabled (standard).
 * @cssprop --m3e-standard-icon-button-hover-icon-color - Icon color on hover (standard).
 * @cssprop --m3e-standard-icon-button-hover-state-layer-color - State layer color on hover (standard).
 * @cssprop --m3e-standard-icon-button-hover-state-layer-opacity - State layer opacity on hover (standard).
 * @cssprop --m3e-standard-icon-button-hover-unselected-icon-color - Unselected icon color on hover (standard).
 * @cssprop --m3e-standard-icon-button-hover-unselected-state-layer-color - Unselected state layer color on hover (standard).
 * @cssprop --m3e-standard-icon-button-hover-selected-icon-color - Selected icon color on hover (standard).
 * @cssprop --m3e-standard-icon-button-hover-selected-state-layer-color - Selected state layer color on hover (standard).
 * @cssprop --m3e-standard-icon-button-focus-icon-color - Icon color on focus (standard).
 * @cssprop --m3e-standard-icon-button-focus-state-layer-color - State layer color on focus (standard).
 * @cssprop --m3e-standard-icon-button-focus-state-layer-opacity - State layer opacity on focus (standard).
 * @cssprop --m3e-standard-icon-button-focus-unselected-icon-color - Unselected icon color on focus (standard).
 * @cssprop --m3e-standard-icon-button-focus-unselected-state-layer-color - Unselected state layer color on focus (standard).
 * @cssprop --m3e-standard-icon-button-focus-selected-icon-color - Selected icon color on focus (standard).
 * @cssprop --m3e-standard-icon-button-focus-selected-state-layer-color - Selected state layer color on focus (standard).
 * @cssprop --m3e-standard-icon-button-pressed-icon-color - Icon color on pressed (standard).
 * @cssprop --m3e-standard-icon-button-pressed-state-layer-color - State layer color on pressed (standard).
 * @cssprop --m3e-standard-icon-button-pressed-state-layer-opacity - State layer opacity on pressed (standard).
 * @cssprop --m3e-standard-icon-button-pressed-unselected-icon-color - Unselected icon color on pressed (standard).
 * @cssprop --m3e-standard-icon-button-pressed-unselected-state-layer-color - Unselected state layer color on pressed (standard).
 * @cssprop --m3e-standard-icon-button-pressed-selected-icon-color - Selected icon color on pressed (standard).
 * @cssprop --m3e-standard-icon-button-pressed-selected-state-layer-color - Selected state layer color on pressed (standard).
 */
@customElement("m3e-icon-button")
export class M3eIconButtonElement extends KeyboardClick(
  LinkButton(FormSubmitter(Focusable(DisabledInteractive(Disabled(AttachInternals(Role(LitElement, "button"), true))))))
) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = [IconButtonSizeStyle, IconButtonVariantStyle, IconButtonStyle];

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
      minPressedDuration: 150,
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
   * @default "standard"
   */
  @property({ reflect: true }) variant: IconButtonVariant = "standard";

  /**
   * The shape of the button.
   * @default "rounded"
   */
  @property({ reflect: true }) shape: IconButtonShape = "rounded";

  /**
   * The size of the button.
   * @default "small"
   */
  @property({ reflect: true }) size: IconButtonSize = "small";

  /**
   * The width of the button.
   * @default "default"
   */
  @property({ reflect: true }) width: IconButtonWidth = "default";

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
      <m3e-state-layer class="state-layer" ?disabled="${this.disabled || this.disabledInteractive}"></m3e-state-layer>
      <m3e-elevation class="elevation" ?disabled="${this.disabled || this.disabledInteractive}"></m3e-elevation>
      <m3e-focus-ring class="focus-ring" ?disabled="${this.disabled}"></m3e-focus-ring>
      <m3e-ripple class="ripple" centered ?disabled="${this.disabled || this.disabledInteractive}"></m3e-ripple>
      <div class="touch" aria-hidden="true"></div>
      ${this[renderPseudoLink]()}
      <div class="wrapper">
        ${this.toggle
          ? html`<slot
              class="icon"
              name="selected"
              aria-hidden="true"
              @slotchange="${this.#handleSelectedIconSlotChange}"
            ></slot>`
          : nothing}
        <slot class="icon" aria-hidden="true"></slot>
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
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-icon-button": M3eIconButtonElement;
  }
}
