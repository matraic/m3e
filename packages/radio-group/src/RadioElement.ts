import { css, CSSResultGroup, html, LitElement, PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import {
  AttachInternals,
  Checked,
  DesignToken,
  Dirty,
  Disabled,
  Focusable,
  FormAssociated,
  formValue,
  HoverController,
  KeyboardClick,
  Labelled,
  M3eFocusRingElement,
  M3eRippleElement,
  M3eStateLayerElement,
  PressedController,
  Role,
  Touched,
} from "@m3e/core";

import { selectionManager } from "@m3e/core/a11y";

/**
 * A radio button that allows a user to select one option from a set of options.
 *
 * @description
 * The `m3e-radio` component represents a radio button that enables users to select an options from a set.
 * It supports selection from mutually exclusive options, emitting `input` and `change` events when its state updates.
 * The component reflects its state through customizable CSS properties for hover, focus, ripple, and icon styling—
 * adapting dynamically based on whether it is selected, unselected, or disabled.
 *
 * Attributes like `checked`, `disabled`, and `value` control its behavior and accessibility, while its visual
 * presentation can be tuned via design tokens such as `--m3e-radio-container-size` and `--m3e-radio-icon-size`.
 *
 * @example
 * The following example illustrates using `m3e-radio-group` and `m3e-radio` to present a group of options.
 * ```html
 * <label for="rdg1">Radio group</label>
 * <br />
 * <m3e-radio-group id="rdg1">
 *  <label><m3e-radio value="1"></m3e-radio> Value 1</label>
 *  <label><m3e-radio value="2"></m3e-radio> Value 2</label>
 *  <label><m3e-radio value="3"></m3e-radio> Value 3</label>
 *  <label><m3e-radio value="4"></m3e-radio> Value 4</label>
 * </m3e-radio-group>
 * ```
 *
 * @tag m3e-radio
 *
 * @attr checked - Whether the element is checked.
 * @attr disabled - Whether the element is disabled.
 * @attr name - The name that identifies the element when submitting the associated form.
 * @attr required - Whether the element is required.
 * @attr value - A string representing the value of the radio.
 *
 * @fires input - Emitted when the checked state changes.
 * @fires change - Emitted when the checked state changes.
 * @fires click - Emitted when the element is clicked.
 *
 * @cssprop --m3e-radio-container-size - Base size of the radio button container.
 * @cssprop --m3e-radio-icon-size - Size of the radio icon inside the wrapper.
 * @cssprop --m3e-radio-unselected-hover-color - Hover state layer color when radio is not selected.
 * @cssprop --m3e-radio-unselected-focus-color - Focus state layer color when radio is not selected.
 * @cssprop --m3e-radio-unselected-ripple-color - Ripple color when radio is not selected.
 * @cssprop --m3e-radio-unselected-icon-color - Icon color when radio is not selected.
 * @cssprop --m3e-radio-selected-hover-color - Hover state layer color when radio is selected.
 * @cssprop --m3e-radio-selected-focus-color - Focus state layer color when radio is selected.
 * @cssprop --m3e-radio-selected-ripple-color - Ripple color when radio is selected.
 * @cssprop --m3e-radio-selected-icon-color - Icon color when radio is selected.
 * @cssprop --m3e-radio-disabled-icon-color - Icon color when radio is disabled.
 * @cssprop --m3e-radio-error-hover-color - Fallback hover color used when the radio is invalid and touched.
 * @cssprop --m3e-radio-error-focus-color - Fallback focus color used when the radio is invalid and touched.
 * @cssprop --m3e-radio-error-ripple-color - Fallback ripple color used when the radio is invalid and touched.
 * @cssprop --m3e-radio-error-icon-color - Fallback icon color used when the radio is invalid and touched.
 */
@customElement("m3e-radio")
export class M3eRadioElement extends Labelled(
  Dirty(
    Touched(
      Checked(KeyboardClick(Focusable(FormAssociated(Disabled(AttachInternals(Role(LitElement, "radio"), true)))))),
    ),
  ),
) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-block;
      outline: none;
      width: fit-content;
      height: fit-content;
      vertical-align: middle;
      user-select: none;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
    :host(:not([aria-disabled="true"])) {
      cursor: pointer;
    }
    .base {
      box-sizing: border-box;
      vertical-align: middle;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
      border-radius: 50%;
      width: calc(var(--m3e-radio-container-size, 2.5rem) + ${DesignToken.density.calc(-3)});
      height: calc(var(--m3e-radio-container-size, 2.5rem) + ${DesignToken.density.calc(-3)});
    }
    .touch {
      position: absolute;
      height: 3rem;
      width: 3rem;
      margin: auto;
    }
    .wrapper {
      box-sizing: border-box;
      pointer-events: none;
      width: var(--m3e-radio-icon-size, 1.25rem);
      height: var(--m3e-radio-icon-size, 1.25rem);
    }
    .circle {
      fill: currentColor;
    }
    :host(:not([checked])) .circle.inner {
      opacity: 0;
    }
    :host(:not([checked])) .base {
      --m3e-state-layer-hover-color: var(--m3e-radio-unselected-hover-color, ${DesignToken.color.onSurface});
      --m3e-state-layer-focus-color: var(--m3e-radio-unselected-focus-color, ${DesignToken.color.onSurface});
      --m3e-ripple-color: var(--m3e-radio-unselected-ripple-color, ${DesignToken.color.onSurface});
      color: var(--m3e-radio-unselected-icon-color, ${DesignToken.color.onSurfaceVariant});
    }
    :host([checked]) .base {
      --m3e-state-layer-hover-color: var(--m3e-radio-selected-hover-color, ${DesignToken.color.primary});
      --m3e-state-layer-focus-color: var(--m3e-radio-selected-focus-color, ${DesignToken.color.primary});
      --m3e-ripple-color: var(--m3e-radio-selected-ripple-color, ${DesignToken.color.primary});
      color: var(--m3e-radio-selected-icon-color, ${DesignToken.color.primary});
    }
    :host([aria-disabled="true"]) .base {
      color: color-mix(in srgb, var(--m3e-radio-disabled-icon-color, ${DesignToken.color.onSurface}) 38%, transparent);
    }
    :host(.-touched.-invalid) .base {
      --m3e-state-layer-hover-color: var(--m3e-radio-error-hover-color, ${DesignToken.color.error});
      --m3e-state-layer-focus-color: var(--m3e-radio-error-focus-color, ${DesignToken.color.error});
      --m3e-ripple-color: var(--m3e-radio-error-ripple-color, ${DesignToken.color.error});
      color: var(--m3e-radio-error-icon-color, ${DesignToken.color.error});
    }
    @media (forced-colors: active) {
      :host(:not([checked])) .base,
      :host([checked]) .base {
        --m3e-state-layer-hover-color: var(--_radio-forced-color, CanvasText);
        --m3e-state-layer-focus-color: var(--_radio-forced-color, CanvasText);
        --m3e-ripple-color: var(--_radio-forced-color, CanvasText);
        color: var(--_radio-forced-color, CanvasText);
      }
      :host([aria-disabled="true"]) .base {
        color: GrayText;
      }
      :host(.-touched.-invalid) .base {
        --_radio-forced-color: Highlight;
        color: Highlight;
      }
    }
  `;

  /** @private */ @query(".focus-ring") private readonly _focusRing?: M3eFocusRingElement;
  /** @private */ @query(".state-layer") private readonly _stateLayer?: M3eStateLayerElement;
  /** @private */ @query(".ripple") private readonly _ripple?: M3eRippleElement;
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
    minPressedDuration: 150,
    callback: (pressed) => {
      if (this.disabled) return;
      if (pressed) {
        this._ripple?.show(0, 0, true);
      } else {
        this._ripple?.hide();
      }
    },
  });

  /**
   * A string representing the value of the radio.
   * @default "on"
   */
  @property() value = "on";

  /** @inheritdoc @internal */
  override get [formValue](): string | File | FormData | null {
    return this.checked && !this.disabled ? this.value : null;
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
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("checked")) {
      this.#notifySelectionChange();
    }
  }

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues<this>): void {
    super.firstUpdated(_changedProperties);
    [this._focusRing, this._stateLayer, this._ripple].forEach((x) => x?.attach(this));
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="base">
      <m3e-state-layer class="state-layer" ?disabled="${this.disabled}"></m3e-state-layer>
      <m3e-focus-ring class="focus-ring" ?disabled="${this.disabled}"></m3e-focus-ring>
      <m3e-ripple class="ripple" centered ?disabled="${this.disabled}"></m3e-ripple>
      <div class="touch" aria-hidden="true"></div>
      <div class="wrapper" aria-hidden="true">${this.#renderIcon()}</div>
    </div>`;
  }

  /** @private */
  #renderIcon(): unknown {
    return html`<svg viewBox="0 0 20 20">
      <mask id="cutout2">
        <rect width="100%" height="100%" fill="white"></rect>
        <circle cx="10" cy="10" r="8" fill="black"></circle>
      </mask>
      <circle class="outer circle" cx="10" cy="10" r="10" mask="url(#cutout2)"></circle>
      <circle class="inner circle" cx="10" cy="10" r="5"></circle>
    </svg>`;
  }

  /** @private */
  #handleClick(e: Event): void {
    if (e.defaultPrevented || this.checked || this.disabled) return;
    this.checked = true;
    if (this.dispatchEvent(new Event("input", { bubbles: true, composed: true, cancelable: true }))) {
      this.#notifySelectionChange();
      this.dispatchEvent(new Event("change", { bubbles: true }));
    } else {
      this.checked = false;
    }
  }

  /** @private */
  #notifySelectionChange(): void {
    const group = this.closest("m3e-radio-group");
    if (group) {
      group[selectionManager].notifySelectionChange(this);
    } else if (this.name && this.checked) {
      // Uncheck any sibling radios of the same name which are also checked.
      [
        ...((this.getRootNode() as ParentNode)?.querySelectorAll<M3eRadioElement>(`m3e-radio[name="${this.name}"]`) ??
          []),
      ]
        .filter((x) => x !== this && x.checked)
        .forEach((x) => (x.checked = false));
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-radio": M3eRadioElement;
  }
}
