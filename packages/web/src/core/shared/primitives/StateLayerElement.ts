import { css, CSSResultGroup, html, LitElement, PropertyValues, unsafeCSS } from "lit";
import { property, query } from "lit/decorators.js";

import { FocusController, HoverController, PressedController } from "../controllers";
import { HtmlFor, Role } from "../mixins";
import { customElement } from "../decorators";

import { StateLayerToken } from "./StateLayerToken";

/**
 * Provides focus and hover state layer treatment for an interactive element.
 *
 * @description
 * The `m3e-state-layer` component is an absolute positioned element used to depict hover and focus overlays.
 * The parenting element must be a relative positioned element.
 *
 * This element can be attached to an interactive element using the `for` attribute or programmatically using the `attach` method.
 * The state layer is displayed when the interactive element is either hovered or focused.  This can be disabled using
 * the `disabled` attribute.
 *
 * @example
 * The following example illustrates attaching a state layer to an interactive element. In this example, the parenting div
 * has relative positioning and is given an `id` referenced by `m3e-state-layer` using the `for` attribute.  Note that `#myDiv`
 * is not used when specifying the attached element's identifier.  The `#` is inferred.
 *
 * ```html
 * <div id="myDiv" tabindex="0" style="position: relative;">
 *  <m3e-state-layer for="myDiv"></m3e-state-layer>
 * <div>
 * ```
 *
 * @tag m3e-state-layer
 *
 * @attr disabled - Whether hover and focus events will not trigger the state layer. State layers can still be controlled manually using the `show` and `hide` methods.
 * @attr disable-hover - Whether hover events will not trigger the state layer. State layers can still be controlled manually using the `show` and `hide` methods.
 * @attr enable-pressed - Whether pressed events will trigger the state layer. State layers can still be controlled manually using the `show` and `hide` methods.
 *
 * @cssprop --m3e-state-layer-duration - Duration of state layer changes.
 * @cssprop --m3e-state-layer-easing - Easing curve of state layer changes.
 * @cssprop --m3e-state-layer-focus-color - Color on focus.
 * @cssprop --m3e-state-layer-focus-opacity - Opacity on focus.
 * @cssprop --m3e-state-layer-hover-color - Color on hover.
 * @cssprop --m3e-state-layer-hover-opacity - Opacity on hover.
 * @cssprop --m3e-state-layer-pressed-color - Color on pressed.
 * @cssprop --m3e-state-layer-pressed-opacity - Opacity on pressed.
 */
@customElement("m3e-state-layer")
export class M3eStateLayerElement extends HtmlFor(Role(LitElement, "none")) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
    }
    :host,
    .layer {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      border-radius: inherit;
    }
    .layer {
      contain: layout style paint;
      will-change: background-color;
      transition: ${unsafeCSS(`background-color ${StateLayerToken.duration} ${StateLayerToken.easing}`)};
    }
    .layer.focused {
      background-color: color-mix(in srgb, ${StateLayerToken.focusColor} ${StateLayerToken.focusOpacity}, transparent);
    }
    .layer.hover {
      background-color: color-mix(in srgb, ${StateLayerToken.hoverColor} ${StateLayerToken.hoverOpacity}, transparent);
    }
    .layer.pressed {
      background-color: color-mix(
        in srgb,
        ${StateLayerToken.pressedColor} ${StateLayerToken.pressedOpacity},
        transparent
      );
    }
    @media (prefers-reduced-motion) {
      .layer {
        transition: none;
      }
    }
    @media (forced-colors: active) {
      .layer {
        display: none;
      }
    }
  `;

  /** @private */
  readonly #hoverController = new HoverController(this, {
    target: null,
    callback: (hovering) => this.#handleHoverChange(hovering),
  });

  /** @private */
  readonly #focusController = new FocusController(this, {
    target: null,
    callback: (_, focusVisible) => this.#handleFocusChange(focusVisible),
  });

  /** @private */ readonly #pressedController = new PressedController(this, {
    target: null,
    capture: true,
    minPressedDuration: 225,
    isPressedKey: (key) => key === " ",
    callback: (pressed) => this.#handlePressedChange(pressed),
  });

  /** @private */ @query(".layer") private readonly _layer?: HTMLElement;

  /**
   * Whether hover and focus events will not trigger the state layer. State layers can still
   * be controlled manually using the `show` and `hide` methods.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * Whether hover events will not trigger the state layer. State layers can still
   * be controlled manually using the `show` and `hide` methods.
   * @default false
   */
  @property({ attribute: "disable-hover", type: Boolean, reflect: true }) disableHover = false;

  /**
   * Whether pressed events will trigger the state layer. State layers can still
   * be controlled manually using the `show` and `hide` methods.
   * @default false
   */
  @property({ attribute: "enable-pressed", type: Boolean, reflect: true }) enablePressed = false;

  /**
   * Launches a manual state layer.
   * @param {"hover" | "focused" | "pressed"} state The state of the layer to show.
   */
  show(state: "hover" | "focused" | "pressed"): void {
    this._layer?.classList.toggle(state, true);
  }

  /**
   * Hides the state layer.
   * @param {"hover" | "focused" | "pressed"} state The state of the layer to hide.
   */
  hide(state: "hover" | "focused" | "pressed"): void {
    this._layer?.classList.toggle(state, false);
  }

  /** @inheritdoc */
  override attach(control: HTMLElement): void {
    super.attach(control);
    this.#focusController.observe(control);
    this.#updateHoverController();
    this.#updatePressedController();
  }

  /** @inheritdoc */
  override detach(): void {
    if (this.control) {
      this.#hoverController.unobserve(this.control);
      this.#focusController.unobserve(this.control);
      this.#pressedController.unobserve(this.control);
    }
    super.detach();
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    this.ariaHidden = "true";
    super.connectedCallback();
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.hide("hover");
    this.hide("focused");
  }

  /** @inheritdoc */
  protected override updated(_changedProperties: PropertyValues<this>): void {
    super.updated(_changedProperties);

    if (_changedProperties.has("disabled") && this.disabled) {
      this.hide("hover");
      this.hide("focused");
    }
    if (_changedProperties.has("disableHover") && this.disableHover) {
      this.#updateHoverController();
      this.hide("hover");
    }
    if (_changedProperties.has("enablePressed") && !this.enablePressed) {
      this.#updatePressedController();
      this.hide("pressed");
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="layer"></div>`;
  }

  /** @private */
  #handleHoverChange(hovering: boolean): void {
    if (!this.disabled && !this.disableHover) {
      if (hovering) {
        this.show("hover");
      } else {
        this.hide("hover");
      }
    }
  }

  /** @private */
  #handleFocusChange(focusVisible: boolean): void {
    if (!this.disabled) {
      if (focusVisible) {
        this.show("focused");
      } else {
        this.hide("focused");
      }
    }
  }

  /** @private */
  #handlePressedChange(pressed: boolean): void {
    if (!this.disabled && this.enablePressed) {
      if (pressed) {
        this.show("pressed");
      } else {
        this.hide("pressed");
      }
    }
  }

  /** @private */
  #updateHoverController(): void {
    if (!this.control) return;
    if (this.disableHover) {
      this.#hoverController.unobserve(this.control);
    } else {
      this.#hoverController.observe(this.control);
    }
  }

  /** @private */
  #updatePressedController(): void {
    if (!this.control) return;
    if (this.enablePressed) {
      this.#pressedController.observe(this.control);
    } else {
      this.#pressedController.unobserve(this.control);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-state-layer": M3eStateLayerElement;
  }
}
