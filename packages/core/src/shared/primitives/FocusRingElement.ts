import { css, CSSResultGroup, html, LitElement, PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import { FocusController } from "../controllers";
import { HtmlFor, Role } from "../mixins";

import { FocusRingToken } from "./FocusRingToken";

/**
 * @summary
 * A focus ring used to depict a strong focus indicator.
 *
 * @description
 * The `m3e-focus-ring` component is an absolute positioned element used to provide a strong focus indicator.
 * The parenting element must be a relative positioned focusable element and allow for overflow.
 *
 * The component can be attached to an interactive element using the `for` attribute or programmatically using the `attach` method.
 * The focus ring is displayed when the interactive element receives visible focus and hidden when focus is lost.
 * This can be disabled using the `disabled` attribute.
 *
 * Alternately, you can use the `show` and `hide` methods to programmatically control the focus ring.
 *
 * @example
 * The following example illustrates attaching a focus ring to an interactive element. In this example, the parenting div
 * has relative positioning and is given an `id` referenced by `m3e-focus-ring` using the `for` attribute.  Note that `#myDiv`
 * is not used when specifying the attached element's identifier.  The `#` is inferred.
 *
 * ```html
 * <div id="myDiv" tabindex="0" style="position: relative;">
 *  <m3e-focus-ring for="myDiv"></m3e-focus-ring>
 * <div>
 * ```
 *
 * @tag m3e-focus-ring
 *
 * @attr disabled - Whether the focus events will not trigger the focus ring. Focus rings can be still controlled manually by using the `show` and `hide` methods.
 * @attr inward - Whether the focus ring animates inward instead of outward.
 *
 * @cssprop --m3e-focus-ring-color - The color of the focus ring.
 * @cssprop --m3e-focus-ring-duration - The duration of the focus ring animation.
 * @cssprop --m3e-focus-ring-growth-factor - The factor by which the focus ring grows.
 * @cssprop --m3e-focus-ring-thickness - The thickness of the focus ring.
 * @cssprop --m3e-focus-ring-visibility - The visibility of the focus ring.
 */
@customElement("m3e-focus-ring")
export class M3eFocusRingElement extends HtmlFor(Role(LitElement, "none")) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      border-radius: inherit;
      outline: none;
    }
    .outline {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      border-radius: inherit;
      z-index: 1;
      outline-color: ${FocusRingToken.color};
      outline-width: ${FocusRingToken.thickness};
      visibility: ${FocusRingToken.visibility};
    }
    .outline.visible {
      outline-style: solid;
    }
    :host(:not([inward])) .outline {
      outline-offset: calc(${FocusRingToken.thickness} / ${FocusRingToken.growthFactor});
    }
    :host([inward]) .outline {
      outline-offset: calc(0px - ${FocusRingToken.thickness});
    }
    :host(:not([inward])) .outline.visible {
      animation: grow-shrink ${FocusRingToken.duration};
    }
    :host([inward]) .outline.visible {
      animation: shrink-grow ${FocusRingToken.duration};
    }
    @keyframes grow-shrink {
      50% {
        outline-width: calc(${FocusRingToken.thickness} * ${FocusRingToken.growthFactor});
      }
    }
    @keyframes shrink-grow {
      50% {
        outline-offset: calc(0px - calc(${FocusRingToken.thickness} * ${FocusRingToken.growthFactor}));
        outline-width: calc(${FocusRingToken.thickness} * ${FocusRingToken.growthFactor});
      }
    }
    @media (prefers-reduced-motion) {
      :host(:not([inward])) .outline.visible,
      :host([inward]) .outline.visible {
        animation: none;
      }
    }
  `;

  /** @private */
  readonly #focusController = new FocusController(this, {
    target: null,
    callback: (_, focusVisible) => this.#handleFocusChange(focusVisible),
  });

  /** @private */ @query(".outline") private readonly _outline?: HTMLElement;

  /**
   * Whether the focus ring animates inward instead of outward.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) inward = false;

  /**
   * Whether the focus events will not trigger the focus ring.
   * Focus rings can be still controlled manually by using the `show` and `hide` methods.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Launches a manual focus ring. */
  show(): void {
    this._outline?.classList.toggle("visible", true);
  }

  /** Hides the focus ring. */
  hide(): void {
    this._outline?.classList.toggle("visible", false);
  }

  /** @inheritdoc */
  override attach(control: HTMLElement): void {
    super.attach(control);
    this.#focusController.observe(control);
  }

  /** @inheritdoc */
  override detach(): void {
    if (this.control) {
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
    this.hide();
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="outline"></div>`;
  }

  /** @inheritdoc */
  protected override updated(_changedProperties: PropertyValues<this>): void {
    super.updated(_changedProperties);

    if (_changedProperties.has("disabled") && this.disabled) {
      this.hide();
    }
  }

  /** @private */
  #handleFocusChange(focusVisible: boolean): void {
    if (!this.disabled) {
      if (focusVisible) {
        this.show();
      } else {
        this.hide();
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-focus-ring": M3eFocusRingElement;
  }
}
