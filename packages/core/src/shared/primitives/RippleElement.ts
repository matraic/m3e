import { css, CSSResultGroup, LitElement, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";

import { PressedController } from "../controllers";
import { HtmlFor, Role } from "../mixins";

import { RippleToken } from "./RippleToken";
import { DesignToken } from "../tokens";

/**
 * @summary
 * Connects user input to screen reactions using ripples.
 *
 * @description
 * The `m3e-ripple` component is an absolute positioned element used to depict a ripple.
 * The parenting element must be a relative positioned element.
 *
 * The component can be attached to an interactive element using the `for` attribute or programmatically using the `attach` method.
 * The ripple is displayed when the interactive element is pressed and hidden when released.  This can be disabled using the `disabled` attribute.
 *
 * The pressed state actives either using both pointer and keyboard events. For keyboard events, `SPACE` and `ENTER` activate a ripple.
 * You can disabled whether the `ENTER` key actives a ripple using the `disable-enter` attribute.
 *
 * Alternately, you can use the `show` and `hide` methods to programmatically control the ripple.
 *
 * @example
 * The following example illustrates attaching a ripple to an interactive element. In this example, the parenting div
 * has relative positioning and is given an `id` referenced by `m3e-ripple` using the `for` attribute.  Note that `#myDiv`
 * is not used when specifying the attached element's identifier.  The `#` is inferred.
 *
 * ```html
 * <div id="myDiv" tabindex="0" style="position: relative;">
 *  <m3e-ripple for="myDiv"></m3e-ripple>
 * <div>
 * ```
 *
 * @tag m3e-ripple
 *
 * @attr centered - Whether the ripple always originates from the center of the element's bounds, rather than originating from the location of the click event.
 * @attr disable-enter - Whether the ripple is disabled when the enter key is pressed.
 * @attr disabled - Whether click events will not trigger the ripple.  Ripples can be still controlled manually by using the `show` and 'hide' methods.
 * @attr for - The identifier of the interactive control to which this element is attached.
 * @attr radius - The radius, in pixels, of the ripple.
 * @attr unbounded - Whether the ripple is visible outside the element's bounds.
 *
 * @cssprop --m3e-ripple-color - The color of the ripple.
 * @cssprop --m3e-ripple-enter-duration - The duration for the enter animation (expansion from point of contact).
 * @cssprop --m3e-ripple-exit-duration - The duration for the exit animation (fade-out).
 * @cssprop --m3e-ripple-opacity - The opacity of the ripple.
 * @cssprop --m3e-ripple-scale-factor - The factor by which to scale the ripple.
 * @cssprop --m3e-ripple-shape - The shape of the ripple.
 */
@customElement("m3e-ripple")
export class M3eRippleElement extends HtmlFor(Role(LitElement, "none")) {
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
    }
    :host(:not([unbounded])) {
      overflow: hidden;
    }
    .ripple {
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      transform: scale(0);
      border-radius: ${DesignToken.shape.corner.full};
      background-color: color-mix(in srgb, ${RippleToken.color} ${RippleToken.opacity}, transparent);
      will-change: background-color, opacity;
    }
    .ripple:not(.persistent) {
      animation: ripple ${RippleToken.enterDuration} linear;
    }
    .ripple.persistent {
      animation: persistent-ripple ${RippleToken.enterDuration} linear;
    }
    .ripple.persistent.pressed {
      transform: scale(${RippleToken.scaleFactor});
    }
    .ripple.exit {
      transition: opacity ${RippleToken.exitDuration} cubic-bezier(0, 0, 0.2, 0.1);
      opacity: 0;
    }
    @keyframes persistent-ripple {
      to {
        transform: scale(${RippleToken.scaleFactor});
      }
    }
    @keyframes ripple {
      to {
        transform: scale(${RippleToken.scaleFactor});
      }
    }
    @media (prefers-reduced-motion) {
      .ripple {
        transform: scale(${RippleToken.scaleFactor});
      }
      .ripple:not(.persistent),
      .ripple.persistent {
        animation-duration: 90ms;
      }
      .ripple.exit {
        transition-duration: 10ms;
      }
    }
    @media (forced-colors: active) {
      .ripple {
        display: none;
      }
    }
  `;

  /** @private */ #ripple: HTMLElement | null = null;
  /** @private */ readonly #pressedController = new PressedController(this, {
    target: null,
    isPressedKey: (key) => key === " " || (!this.disableEnter && key === "Enter"),
    callback: (pressed, { x, y }) => this.#handlePressedChange(pressed, x, y),
  });

  /**
   * Whether click events will not trigger the ripple.
   * Ripples can be still controlled manually by using the `show` and 'hide' methods.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * Whether the ripple is disabled when the enter key is pressed.
   * @default false
   */
  @property({ attribute: "disable-enter", type: Boolean, reflect: true }) disableEnter = false;

  /**
   * Whether the ripple always originates from the center of the element's bounds, rather
   * than originating from the location of the click event.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) centered = false;

  /**
   * Whether the ripple is visible outside the element's bounds.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) unbounded = false;

  /**
   * The radius, in pixels, of the ripple.
   * @default null
   */
  @property({ type: Number }) radius: number | null = null;

  /**
   * The element that triggers the ripple when click events are received.
   * @default null
   */
  @property() trigger: string | HTMLElement | null = null;

  /** Whether the ripple is currently visible to the user. */
  get visible() {
    return this.#ripple !== null;
  }

  /**
   * Launches a manual ripple.
   * @param {number} x The x-coordinate, relative to the viewport, at which to present the ripple.
   * @param {number} y The y-coordinate, relative to the viewport, at which to present the ripple.
   * @param {boolean} [persistent=false] Whether the ripple will persist until hidden.
   */
  show(x: number, y: number, persistent: boolean = false): void {
    this.#destroyRipple();

    const bounds = this.getBoundingClientRect();
    if (this.centered) {
      x = bounds.left + bounds.width / 2;
      y = bounds.top + bounds.height / 2;
    }

    let radius = this.radius;

    if (!radius || isNaN(radius)) {
      const distX = Math.max(Math.abs(x - bounds.left), Math.abs(x - bounds.right));
      const distY = Math.max(Math.abs(y - bounds.top), Math.abs(y - bounds.bottom));
      radius = Math.sqrt(distX * distX + distY * distY);
    }

    const offsetX = x - bounds.left;
    const offsetY = y - bounds.top;

    this.#ripple = document.createElement("div");
    this.#ripple.classList.add("ripple");
    if (persistent) {
      this.#ripple.classList.add("persistent");
    }

    this.#ripple.style.left = `${offsetX - radius}px`;
    this.#ripple.style.top = `${offsetY - radius}px`;
    this.#ripple.style.width = `${radius * 2}px`;
    this.#ripple.style.height = `${radius * 2}px`;

    this.#ripple.addEventListener("animationend", () => this.#handleAnimationEnd(persistent), { once: true });
    this.#ripple.addEventListener("transitionend", () => this.#destroyRipple(), { once: true });

    this.shadowRoot?.appendChild(this.#ripple);
  }

  /** Manually hides the ripple. */
  hide(): void {
    this.#ripple?.classList.add("exit");
  }

  /** @inheritdoc */
  override attach(control: HTMLElement): void {
    super.attach(control);
    this.#pressedController.observe(control);
  }

  /** @inheritdoc */
  override detach(): void {
    if (this.control) {
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
    this.#destroyRipple();
  }

  /** @inheritdoc */
  protected override updated(_changedProperties: PropertyValues<this>): void {
    super.updated(_changedProperties);

    if (_changedProperties.has("disabled") && this.disabled) {
      this.hide();
    }
  }

  /** @private */
  #destroyRipple(): void {
    this.#ripple?.remove();
    this.#ripple = null;
  }

  /** @private */
  #handleAnimationEnd(persistent: boolean): void {
    if (persistent) {
      this.#ripple?.classList.add("pressed");
    } else {
      this.hide();
    }
  }

  /** @private */
  #handlePressedChange(pressed: boolean, x: number, y: number): void {
    if (!this.disabled) {
      if (pressed) {
        this.show(x, y, true);
      } else {
        this.hide();
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-ripple": M3eRippleElement;
  }
}
