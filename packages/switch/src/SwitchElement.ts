import { CSSResultGroup, html, LitElement, PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import {
  Labelled,
  Checked,
  ConstraintValidation,
  Dirty,
  Disabled,
  FormAssociated,
  formValue,
  Touched,
  AttachInternals,
  Role,
  M3eFocusRingElement,
  M3eStateLayerElement,
  Focusable,
  KeyboardClick,
  PressedController,
  HoverController,
} from "@m3e/core";

import { SwitchHandleStyle, SwitchIconStyle, SwitchStateLayerStyle, SwitchStyle, SwitchTrackStyle } from "./styles";

import { SwitchIcons } from "./SwitchIcons";

/**
 * An on/off control that can be toggled by clicking.
 *
 * @description
 * The `m3e-switch` component is a semantic, accessible toggle control that reflects a binary state.
 * Designed according to Material Design 3 guidelines, it supports shape transitions, and adaptive color
 * theming across selected, unselected, and disabled states. The component responds to user interaction
 * with smooth motion and expressive feedback. It supports optional icons (`none`, `selected`, or `both`)
 * and integrates with form-associated behavior, emitting `input` and `change` events when toggled.
 *
 * @example
 * The following example illustrates a switch wrapped by a `label`.
 *
 * ```html
 * <label>Switch label&nbsp;<m3e-switch></m3e-switch></label>
 * ```
 *
 * @example
 * By default, icons are not presented. Use the `icons` attribute to control which icons to show. The next
 * example illustrates showing both the unselected and selected icons.
 *
 * ```html
 * <label>Switch label&nbsp;<m3e-switch icons="both"></m3e-switch></label>
 * ```
 *
 * @tag m3e-switch
 *
 * @attr checked - Whether the element is checked.
 * @attr disabled - Whether the element is disabled.
 * @attr icons - The icons to present.
 * @attr name - The name that identifies the element when submitting the associated form.
 * @attr value - A string representing the value of the switch.
 *
 * @fires input - Emitted when the checked state changes.
 * @fires change - Emitted when the checked state changes.
 * @fires click - Emitted when the element is clicked.
 *
 * @cssprop --m3e-switch-selected-icon-color - Color of the icon when the switch is selected.
 * @cssprop --m3e-switch-selected-icon-size - Size of the icon in the selected state.
 * @cssprop --m3e-switch-unselected-icon-color - Color of the icon when the switch is unselected.
 * @cssprop --m3e-switch-unselected-icon-size - Size of the icon in the unselected state.
 * @cssprop --m3e-switch-track-height - Height of the switch track.
 * @cssprop --m3e-switch-track-width - Width of the switch track.
 * @cssprop --m3e-switch-track-outline-color - Color of the track’s outline.
 * @cssprop --m3e-switch-track-outline-width - Thickness of the track’s outline.
 * @cssprop --m3e-switch-track-shape - Corner shape of the track.
 * @cssprop --m3e-switch-selected-track-color - Track color when selected.
 * @cssprop --m3e-switch-unselected-track-color - Track color when unselected.
 * @cssprop --m3e-switch-unselected-handle-height - Height of the handle when unselected.
 * @cssprop --m3e-switch-unselected-handle-width - Width of the handle when unselected.
 * @cssprop --m3e-switch-with-icon-handle-height - Height of the handle when icons are present.
 * @cssprop --m3e-switch-with-icon-handle-width - Width of the handle when icons are present.
 * @cssprop --m3e-switch-selected-handle-height - Height of the handle when selected.
 * @cssprop --m3e-switch-selected-handle-width - Width of the handle when selected.
 * @cssprop --m3e-switch-pressed-handle-height - Height of the handle during press.
 * @cssprop --m3e-switch-pressed-handle-width - Width of the handle during press.
 * @cssprop --m3e-switch-handle-shape - Corner shape of the handle.
 * @cssprop --m3e-switch-selected-handle-color - Handle color when selected.
 * @cssprop --m3e-switch-unselected-handle-color - Handle color when unselected.
 * @cssprop --m3e-switch-state-layer-size - Diameter of the state layer overlay.
 * @cssprop --m3e-switch-state-layer-shape - Corner shape of the state layer.
 * @cssprop --m3e-switch-disabled-selected-icon-color - Icon color when selected and disabled.
 * @cssprop --m3e-switch-disabled-selected-icon-opacity - Icon opacity when selected and disabled.
 * @cssprop --m3e-switch-disabled-unselected-icon-color - Icon color when unselected and disabled.
 * @cssprop --m3e-switch-disabled-unselected-icon-opacity - Icon opacity when unselected and disabled.
 * @cssprop --m3e-switch-disabled-track-opacity - Track opacity when disabled.
 * @cssprop --m3e-switch-disabled-selected-track-color - Track color when selected and disabled.
 * @cssprop --m3e-switch-disabled-unselected-track-color - Track color when unselected and disabled.
 * @cssprop --m3e-switch-disabled-unselected-track-outline-color - Outline color when unselected and disabled.
 * @cssprop --m3e-switch-disabled-unselected-handle-opacity - Handle opacity when unselected and disabled.
 * @cssprop --m3e-switch-disabled-selected-handle-opacity - Handle opacity when selected and disabled.
 * @cssprop --m3e-switch-disabled-selected-handle-color - Handle color when selected and disabled.
 * @cssprop --m3e-switch-disabled-unselected-handle-color - Handle color when unselected and disabled.
 * @cssprop --m3e-switch-selected-hover-icon-color - Icon color when selected and hovered.
 * @cssprop --m3e-switch-unselected-hover-icon-color - Icon color when unselected and hovered.
 * @cssprop --m3e-switch-selected-hover-track-color - Track color when selected and hovered.
 * @cssprop --m3e-switch-selected-hover-state-layer-color - State layer color when selected and hovered.
 * @cssprop --m3e-switch-selected-hover-state-layer-opacity - State layer opacity when selected and hovered.
 * @cssprop --m3e-switch-unselected-hover-track-color - Track color when unselected and hovered.
 * @cssprop --m3e-switch-unselected-hover-track-outline-color - Outline color when unselected and hovered.
 * @cssprop --m3e-switch-unselected-hover-state-layer-color - State layer color when unselected and hovered.
 * @cssprop --m3e-switch-unselected-hover-state-layer-opacity - State layer opacity when unselected and hovered.
 * @cssprop --m3e-switch-selected-hover-handle-color - Handle color when selected and hovered.
 * @cssprop --m3e-switch-unselected-hover-handle-color - Handle color when unselected and hovered.
 * @cssprop --m3e-switch-selected-focus-icon-color - Icon color when selected and focused.
 * @cssprop --m3e-switch-unselected-focus-icon-color - Icon color when unselected and focused.
 * @cssprop --m3e-switch-selected-focus-track-color - Track color when selected and focused.
 * @cssprop --m3e-switch-selected-focus-state-layer-color - State layer color when selected and focused.
 * @cssprop --m3e-switch-selected-focus-state-layer-opacity - State layer opacity when selected and focused.
 * @cssprop --m3e-switch-unselected-focus-track-color - Track color when unselected and focused.
 * @cssprop --m3e-switch-unselected-focus-track-outline-color - Outline color when unselected and focused.
 * @cssprop --m3e-switch-unselected-focus-state-layer-color - State layer color when unselected and focused.
 * @cssprop --m3e-switch-unselected-focus-state-layer-opacity - State layer opacity when unselected and focused.
 * @cssprop --m3e-switch-selected-focus-handle-color - Handle color when selected and focused.
 * @cssprop --m3e-switch-unselected-focus-handle-color - Handle color when unselected and focused.
 * @cssprop --m3e-switch-selected-pressed-icon-color - Icon color when selected and pressed.
 * @cssprop --m3e-switch-unselected-pressed-icon-color - Icon color when unselected and pressed.
 * @cssprop --m3e-switch-selected-pressed-track-color - Track color when selected and pressed.
 * @cssprop --m3e-switch-selected-pressed-state-layer-color - State layer color when selected and pressed.
 * @cssprop --m3e-switch-selected-pressed-state-layer-opacity - State layer opacity when selected and pressed.
 * @cssprop --m3e-switch-unselected-pressed-track-color - Track color when unselected and pressed.
 * @cssprop --m3e-switch-unselected-pressed-track-outline-color - Outline color when unselected and pressed.
 * @cssprop --m3e-switch-unselected-pressed-state-layer-color - State layer color when unselected and pressed.
 * @cssprop --m3e-switch-unselected-pressed-state-layer-opacity - State layer opacity when unselected and pressed.
 * @cssprop --m3e-switch-selected-pressed-handle-color - Handle color when selected and pressed.
 * @cssprop --m3e-switch-unselected-pressed-handle-color - Handle color when unselected and pressed.
 */
@customElement("m3e-switch")
export class M3eSwitchElement extends Labelled(
  Dirty(
    Touched(
      ConstraintValidation(
        Checked(FormAssociated(KeyboardClick(Focusable(Disabled(AttachInternals(Role(LitElement, "switch")))))))
      )
    )
  )
) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = [
    SwitchStyle,
    SwitchStateLayerStyle,
    SwitchTrackStyle,
    SwitchHandleStyle,
    SwitchIconStyle,
  ];

  /** @private */ @query(".track") private readonly _track?: HTMLElement;
  /** @private */ @query(".focus-ring") private readonly _focusRing?: M3eFocusRingElement;
  /** @private */ @query(".state-layer") private readonly _stateLayer?: M3eStateLayerElement;
  /** @private */ readonly #clickHandler = (e: Event) => this.#handleClick(e);

  /** @private */ readonly #hoverController = new HoverController(this, {
    target: null,
    callback: (hovering) => {
      if (this.disabled) return;
      if (hovering) {
        this._stateLayer?.show("hover");
      } else {
        this._stateLayer?.hide("hover");
      }
    },
  });

  /** @private */ readonly #pressedController = new PressedController(this, {
    target: null,
    callback: (pressed) => this._track?.classList.toggle("pressed", pressed && !this.disabled),
  });

  constructor() {
    super();

    new PressedController(this, {
      isPressedKey: (key) => key === " ",
      callback: (pressed) => this._track?.classList.toggle("pressed", pressed && !this.disabled),
    });
  }

  /**
   * The icons to present.
   * @default "none"
   */
  @property({ reflect: true }) icons: SwitchIcons = "none";

  /**
   * A string representing the value of the switch.
   * @default "on"
   */
  @property() value = "on";

  /** @inheritdoc @private */
  override get [formValue](): string | File | FormData | null {
    return !this.checked ? null : this.value;
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener("click", this.#clickHandler);
    for (const label of this.labels) {
      this.#hoverController.observe(label);
      this.#pressedController.observe(label);
    }
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.removeEventListener("click", this.#clickHandler);
    for (const label of this.labels) {
      this.#hoverController.unobserve(label);
      this.#pressedController.unobserve(label);
    }
  }

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    [this._focusRing, this._stateLayer].forEach((x) => x?.attach(this));
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<m3e-focus-ring class="focus-ring"></m3e-focus-ring>
      <div class="track" aria-hidden="true">
        <div class="touch" aria-hidden="true"></div>
        <div class="handle">
          <m3e-state-layer class="state-layer" ?disabled="${this.disabled}"></m3e-state-layer>
          <div class="base">${this.#renderIcon()}</div>
        </div>
      </div>`;
  }

  /** @private */
  #renderIcon(): unknown {
    return this.checked
      ? html`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z"></path>
        </svg>`
      : html`<svg class="icon" viewBox="0 -960 960 960" fill="currentColor">
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>`;
  }

  /** @private */
  #handleClick(e: Event): void {
    if (e.defaultPrevented) return;
    this.checked = !this.checked;
    if (this.dispatchEvent(new Event("input", { bubbles: true, composed: true, cancelable: true }))) {
      this.dispatchEvent(new Event("change", { bubbles: true }));
    } else {
      this.checked = !this.checked;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-switch": M3eSwitchElement;
  }
}
