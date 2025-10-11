import { css, CSSResultGroup, html, LitElement, PropertyValues, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import { FocusController, HoverController } from "../controllers";
import { HtmlFor, Role } from "../mixins";

import { StateLayerToken } from "./StateLayerToken";

/**
 * @summary
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
 * @attr disabled - Whether hover and focus event will not trigger the state layer.Whether hover and focus event will not trigger the state layer. State layers can still be controlled manually using the `show` and `hide` methods.
 *
 * @cssprop --m3e-state-layer-duration - Duration of state layer changes.
 * @cssprop --m3e-state-layer-easing - Easing curve of state layer changes.
 * @cssprop --m3e-state-layer-focus-color - Color on hover.
 * @cssprop --m3e-state-layer-focus-opacity - Opacity on focus.
 * @cssprop --m3e-state-layer-hover-color - Color on hover.
 * @cssprop --m3e-state-layer-hover-opacity - Opacity on hover.
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
      will-change: background-color;
      transition: ${unsafeCSS(`background-color ${StateLayerToken.duration} ${StateLayerToken.easing}`)};
    }
    .layer.focused {
      background-color: color-mix(in srgb, ${StateLayerToken.focusColor} ${StateLayerToken.focusOpacity}, transparent);
    }
    .layer.hover {
      background-color: color-mix(in srgb, ${StateLayerToken.hoverColor} ${StateLayerToken.hoverOpacity}, transparent);
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
    callback: (focused) => this.#handleFocusChange(focused),
  });

  /** @private */ @query(".layer") private readonly _layer?: HTMLElement;

  /**
   * Whether hover and focus event will not trigger the state layer. State layers can still
   * be controlled manually using the `show` and `hide` methods.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * Launches a manual state layer.
   * @param {"hover" | "focused"} state The state of the layer to show.
   */
  show(state: "hover" | "focused"): void {
    this._layer?.classList.toggle(state, true);
  }

  /**
   * Hides the state layer.
   * @param {"hover" | "focused"} state The state of the layer to hide.
   */
  hide(state: "hover" | "focused"): void {
    this._layer?.classList.toggle(state, false);
  }

  /** @inheritdoc */
  override attach(control: HTMLElement): void {
    super.attach(control);
    this.#hoverController.observe(control);
    this.#focusController.observe(control);
  }

  /** @inheritdoc */
  override detach(): void {
    if (this.control) {
      this.#hoverController.unobserve(this.control);
      this.#focusController.unobserve(this.control);
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
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="layer"></div>`;
  }

  /** @private */
  #handleHoverChange(hovering: boolean): void {
    if (!this.disabled) {
      if (hovering) {
        this.show("hover");
      } else {
        this.hide("hover");
      }
    }
  }

  /** @private */
  #handleFocusChange(focused: boolean): void {
    if (!this.disabled) {
      if (focused) {
        this.show("focused");
      } else {
        this.hide("focused");
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-state-layer": M3eStateLayerElement;
  }
}
