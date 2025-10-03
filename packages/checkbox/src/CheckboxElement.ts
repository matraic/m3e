import { css, CSSResultGroup, html, LitElement, nothing, PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import {
  Labelled,
  CheckedIndeterminate,
  ConstraintValidation,
  DesignToken,
  Dirty,
  Disabled,
  FormAssociated,
  formValue,
  Required,
  RequiredConstraintValidation,
  Touched,
  AttachInternals,
  Role,
  M3eFocusRingElement,
  M3eRippleElement,
  M3eStateLayerElement,
  KeyboardClick,
  Focusable,
  HoverController,
  PressedController,
} from "@m3e/core";

/**
 * @summary
 * A checkbox that allows a user to select one or more options from a limited number of choices.
 *
 * @description
 * The `m3e-checkbox` component enables users to select one or more options from a set. It supports selected,
 * unselected, and indeterminate states, and communicates selection through visual cues and accessible semantics.
 * This component reflects user intent, form participation, and validation feedback, adapting to disabled and
 * required contexts. It emits `input` and `change` events to signal state transitions and integrates with form
 * submission via `name` and `value`.
 *
 * @example
 * The following example illustrates wrapping a `m3e-checkbox` within a `label`.
 * ```html
 * <label>
 *  <m3e-checkbox></m3e-checkbox>
 *  Checkbox label
 * </label>
 * ```
 * @example
 * The next example illustrates use of the `for` attribute to label a checkbox.
 * ```html
 * <m3e-checkbox id="chk"></m3e-checkbox>
 * <label for="chk">Checkbox label </label>
 * ```
 *
 * @tag m3e-checkbox
 *
 * @attr checked - Whether the element is checked.
 * @attr disabled - Whether the element is disabled.
 * @attr indeterminate - Whether the element's checked state is indeterminate.
 * @attr name - The name that identifies the element when submitting the associated form.
 * @attr required - Whether the element is required.
 * @attr value - A string representing the value of the checkbox.
 *
 * @fires input - Emitted when the checked state changes.
 * @fires change - Emitted when the checked state changes.
 *
 * @cssprop --m3e-checkbox-icon-size - Size of the checkbox icon inside the container.
 * @cssprop --m3e-checkbox-container-size - Base size of the checkbox container.
 * @cssprop --m3e-checkbox-container-shape - Border radius of the icon container.
 * @cssprop --m3e-checkbox-unselected-outline-thickness - Border thickness for unselected state.
 * @cssprop --m3e-checkbox-unselected-outline-color - Border color for unselected state.
 * @cssprop --m3e-checkbox-unselected-hover-outline-color - Border color on hover when unselected.
 * @cssprop --m3e-checkbox-unselected-disabled-outline-color - Base color for disabled unselected outline.
 * @cssprop --m3e-checkbox-unselected-disabled-outline-opacity - Opacity for disabled unselected outline.
 * @cssprop --m3e-checkbox-unselected-error-outline-color - Border color for invalid unselected state.
 * @cssprop --m3e-checkbox-selected-container-color - Background color for selected container.
 * @cssprop --m3e-checkbox-selected-icon-color - Icon color for selected state.
 * @cssprop --m3e-checkbox-selected-disabled-container-color - Base color for disabled selected container.
 * @cssprop --m3e-checkbox-selected-disabled-container-opacity - Opacity for disabled selected container.
 * @cssprop --m3e-checkbox-selected-disabled-icon-color - Base color for disabled selected icon.
 * @cssprop --m3e-checkbox-selected-disabled-icon-opacity - Opacity for disabled selected icon.
 * @cssprop --m3e-checkbox-unselected-hover-color - Ripple hover color for unselected state.
 * @cssprop --m3e-checkbox-unselected-focus-color - Ripple focus color for unselected state.
 * @cssprop --m3e-checkbox-unselected-ripple-color - Ripple base color for unselected state.
 * @cssprop --m3e-checkbox-selected-hover-color - Ripple hover color for selected state.
 * @cssprop --m3e-checkbox-selected-focus-color - Ripple focus color for selected state.
 * @cssprop --m3e-checkbox-selected-ripple-color - Ripple base color for selected state.
 * @cssprop --m3e-checkbox-unselected-error-hover-color - Ripple hover color for invalid unselected state.
 * @cssprop --m3e-checkbox-unselected-error-focus-color - Ripple focus color for invalid unselected state.
 * @cssprop --m3e-checkbox-unselected-error-ripple-color - Ripple base color for invalid unselected state.
 * @cssprop --m3e-checkbox-selected-error-hover-color - Ripple hover color for invalid selected state.
 * @cssprop --m3e-checkbox-selected-error-focus-color - Ripple focus color for invalid selected state.
 * @cssprop --m3e-checkbox-selected-error-ripple-color - Ripple base color for invalid selected state.
 */
@customElement("m3e-checkbox")
export class M3eCheckboxElement extends Labelled(
  RequiredConstraintValidation(
    Dirty(
      Touched(
        Required(
          ConstraintValidation(
            CheckedIndeterminate(
              FormAssociated(KeyboardClick(Focusable(Disabled(AttachInternals(Role(LitElement, "checkbox")))), false))
            )
          )
        )
      )
    )
  )
) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-block;
      outline: none;
      width: fit-content;
      height: fit-content;
      vertical-align: middle;
    }
    :host(:not(:disabled)) {
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
      width: calc(var(--m3e-checkbox-container-size, 2.5rem) + ${DesignToken.density.calc(-3)});
      height: calc(var(--m3e-checkbox-container-size, 2.5rem) + ${DesignToken.density.calc(-3)});
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
      width: var(--m3e-checkbox-icon-size, 1.125rem);
      height: var(--m3e-checkbox-icon-size, 1.125rem);
      border-radius: var(--m3e-checkbox-container-shape, 0.125rem);
    }
    :host(:not([checked]):not([indeterminate])) .wrapper {
      border-width: var(--m3e-checkbox-unselected-outline-thickness, 0.125rem);
      border-style: solid;
    }
    :host(:not(.-touched.-invalid):not([indeterminate]):not([checked])) .base {
      --m3e-state-layer-hover-color: var(--m3e-checkbox-unselected-hover-color, ${DesignToken.color.onSurface});
      --m3e-state-layer-focus-color: var(--m3e-checkbox-unselected-focus-color, ${DesignToken.color.onSurface});
      --m3e-ripple-color: var(--m3e-checkbox-unselected-ripple-color, ${DesignToken.color.onSurface});
    }
    :host(:not(.-touched.-invalid)[checked]) .base,
    :host(:not(.-touched.-invalid)[indeterminate]) .base {
      --m3e-state-layer-hover-color: var(--m3e-checkbox-selected-hover-color, ${DesignToken.color.primary});
      --m3e-state-layer-focus-color: var(--m3e-checkbox-selected-focus-color, ${DesignToken.color.primary});
      --m3e-ripple-color: var(--m3e-checkbox-selected-ripple-color, ${DesignToken.color.primary});
    }
    :host(:not(:disabled):not(.-touched.-invalid)[checked]) .wrapper,
    :host(:not(:disabled):not(.-touched.-invalid)[indeterminate]) .wrapper {
      background-color: var(--m3e-checkbox-selected-container-color, ${DesignToken.color.primary});
      color: var(--m3e-checkbox-selected-icon-color, ${DesignToken.color.onPrimary});
    }
    :host(:not(:disabled):not(.-touched.-invalid):not([checked]):not([indeterminate]):not(:hover)) .wrapper {
      border-color: var(--m3e-checkbox-unselected-outline-color, ${DesignToken.color.onSurfaceVariant});
    }
    :host(:not(:disabled):not(.-touched.-invalid):not([checked]):not([indeterminate]) :hover) .wrapper {
      border-color: var(--m3e-checkbox-unselected-hover-outline-color, ${DesignToken.color.onSurface});
    }
    :host(:disabled:not([checked]):not([indeterminate])) .wrapper {
      border-color: color-mix(
        in srgb,
        var(--m3e-checkbox-unselected-disabled-outline-color, ${DesignToken.color.onSurface})
          var(--m3e-checkbox-unselected-disabled-outline-opacity, 38%),
        transparent
      );
    }
    :host(:disabled[checked]) .wrapper,
    :host(:disabled[indeterminate]) .wrapper {
      background-color: color-mix(
        in srgb,
        var(--m3e-checkbox-selected-disabled-container-color, ${DesignToken.color.onSurface})
          var(--m3e-checkbox-selected-disabled-container-opacity, 38%),
        transparent
      );
      color: color-mix(
        in srgb,
        var(--m3e-checkbox-selected-disabled-icon-color, ${DesignToken.color.surface})
          var(--m3e-checkbox-selected-disabled-icon-opacity, 100%),
        transparent
      );
    }
    :host(:not(:disabled).-touched.-invalid:not([checked]):not([indeterminate])) .base {
      --m3e-state-layer-hover-color: var(--m3e-checkbox-unselected-error-hover-color, ${DesignToken.color.error});
      --m3e-state-layer-focus-color: var(--m3e-checkbox-unselected-error-focus-color, ${DesignToken.color.error});
      --m3e-ripple-color: var(--m3e-checkbox-unselected-error-ripple-color, ${DesignToken.color.error});
    }
    :host(:not(:disabled).-touched.-invalid[checked]) .base,
    :host(:not(:disabled).-touched.-invalid[indeterminate]) .base {
      --m3e-state-layer-hover-color: var(--m3e-checkbox-selected-error-hover-color, ${DesignToken.color.onError});
      --m3e-state-layer-focus-color: var(--m3e-checkbox-selected-error-focus-color, ${DesignToken.color.onError});
      --m3e-ripple-color: var(--m3e-checkbox-selected-error-ripple-color, ${DesignToken.color.onError});
    }
    :host(:not(:disabled).-touched.-invalid:not([checked]):not([indeterminate])) .wrapper {
      border-color: var(--m3e-checkbox-unselected-error-outline-color, ${DesignToken.color.error});
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
   * A string representing the value of the checkbox.
   * @default "on"
   */
  @property() value = "on";

  /** @inheritdoc @private */
  override get [formValue](): string | File | FormData | null {
    return !this.checked || this.indeterminate ? null : this.value;
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
  protected override firstUpdated(_changedProperties: PropertyValues<this>): void {
    super.firstUpdated(_changedProperties);
    [this._focusRing, this._stateLayer, this._ripple].forEach((x) => x?.attach(this));
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="base">
      <m3e-state-layer class="state-layer" ?disabled="${this.disabled}"></m3e-state-layer>
      <m3e-focus-ring class="focus-ring" ?disabled="${this.disabled}"></m3e-focus-ring>
      <m3e-ripple class="ripple" centered disable-enter ?disabled="${this.disabled}"></m3e-ripple>
      <div class="touch" aria-hidden="true"></div>
      <div class="wrapper" aria-hidden="true">${this.#renderIcon()}</div>
    </div>`;
  }

  /** @private */
  #renderIcon(): unknown {
    if (this.indeterminate) {
      return html`<svg viewBox="0 -960 960 960" fill="currentColor">
        <path Required d="M240-440v-80h480v80H240Z" />
      </svg>`;
    }

    if (this.checked) {
      return html`<svg viewBox="0 -960 960 960" fill="currentColor">
        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
      </svg>`;
    }

    return nothing;
  }

  /** @private */
  #handleClick(e: Event): void {
    if (e.defaultPrevented) return;

    this.checked = !this.checked;
    if (this.dispatchEvent(new Event("input", { bubbles: true, composed: true, cancelable: true }))) {
      this.indeterminate = false;
      this.dispatchEvent(new Event("change", { bubbles: true }));
    } else {
      this.checked = !this.checked;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-checkbox": M3eCheckboxElement;
  }
}
