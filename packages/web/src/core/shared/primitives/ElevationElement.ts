import { css, CSSResultGroup, html, LitElement, PropertyValues, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import { FocusController, HoverController, PressedController } from "../controllers";
import { HtmlFor, Role } from "../mixins";

import { ElevationLevel } from "./ElevationLevel";
import { ElevationToken } from "./ElevationToken";
import { DesignToken } from "../tokens";

/**
 * Visually depicts elevation using a shadow.
 *
 * @description
 * The `m3e-elevation` component is an absolute positioned element used to depict elevation using a shadow.
 * The parenting element must be a relative positioned element and allow for overflow. Use the `level` attribute
 * to specify the elevation level.
 *
 * The component can also be attached to another element using the `for` attribute.  When attached, elevation will
 * be lifted by 1 level on hover. This can be disabled using the `disabled` attribute.
 *
 * Alternately, use the `attach` and `detach` methods to programmatically attach and detach this element to another.
 *
 * @example
 * The following example illustrates basic markup. Note how the parenting element's position is `relative`. A parenting
 * element's position must be `relative` and overflow must be visible.
 *
 * ```html
 * <div style="position: relative;">
 *  <m3e-elevation level="1"></m3e-elevation>
 * <div>
 * ```
 * @example
 * The following example illustrates attaching elevation to an interactive element. In this example, the parenting div
 * is given an `id` referenced by `m3e-elevation` using the `for` attribute.  Note that `#myDiv` is not used when
 * specifying the attached element's identifier.  The `#` is inferred.
 *
 * ```html
 * <div id="myDiv" style="position: relative;">
 *  <m3e-elevation for="myDiv" level="1"></m3e-elevation>
 * <div>
 * ```
 *
 * @tag m3e-elevation
 *
 * @attr disabled - Whether hover and press events will not trigger changes in elevation, when attached to an interactive element.
 * @attr for - The identifier of the interactive control to which this element is attached.
 * @attr level - The level at which to visually depict elevation.
 *
 * @cssprop --m3e-elevation-color - Color used to depict elevation.
 * @cssprop --m3e-elevation-lift-duration - Duration when lifting.
 * @cssprop --m3e-elevation-lift-easing - Easing curve when lifting.
 * @cssprop --m3e-elevation-settle-duration - Duration when settling.
 * @cssprop --m3e-elevation-settle-easing - Easing curve when settling.
 * @cssprop --m3e-elevation-level - Elevation when resting (box-shadow).
 * @cssprop --m3e-elevation-hover-level - Elevation on hover (box-shadow).
 * @cssprop --m3e-elevation-focus-level - Elevation on focus (box-shadow).
 * @cssprop --m3e-elevation-pressed-level - Elevation on pressed (box-shadow).
 */
@customElement("m3e-elevation")
export class M3eElevationElement extends HtmlFor(Role(LitElement, "none")) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
    }
    :host,
    .shadow {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      border-radius: inherit;
    }
    .shadow.resting,
    .shadow.focus,
    .shadow.pressed {
      will-change: box-shadow;
      transition: ${unsafeCSS(`box-shadow ${ElevationToken.settleDuration} ${ElevationToken.settleEasing};`)};
    }
    .shadow.hover {
      will-change: box-shadow;
      transition: ${unsafeCSS(`box-shadow ${ElevationToken.liftDuration} ${ElevationToken.liftEasing};`)};
    }
    .shadow {
      box-shadow: ${ElevationToken.level};
    }
    .shadow.focus {
      box-shadow: ${ElevationToken.focusLevel};
    }
    .shadow.hover {
      box-shadow: ${ElevationToken.hoverLevel};
    }
    .shadow.pressed {
      box-shadow: ${ElevationToken.pressedLevel};
    }
    :host([level="0"]) .shadow {
      --m3e-elevation-level: ${DesignToken.elevation.level0};
      --m3e-elevation-hover-level: ${DesignToken.elevation.level1};
    }
    :host([level="1"]) .shadow {
      --m3e-elevation-level: ${DesignToken.elevation.level1};
      --m3e-elevation-hover-level: ${DesignToken.elevation.level2};
    }
    :host([level="2"]) .shadow {
      --m3e-elevation-level: ${DesignToken.elevation.level2};
      --m3e-elevation-hover-level: ${DesignToken.elevation.level3};
    }
    :host([level="3"]) .shadow {
      --m3e-elevation-level: ${DesignToken.elevation.level3};
      --m3e-elevation-hover-level: ${DesignToken.elevation.level4};
    }
    :host([level="4"]) .shadow {
      --m3e-elevation-level: ${DesignToken.elevation.level4};
      --m3e-elevation-hover-level: ${DesignToken.elevation.level5};
    }
    :host([level="5"]) .shadow {
      --m3e-elevation-level: ${DesignToken.elevation.level5};
      --m3e-elevation-hover-level: ${ElevationToken.level};
    }
    :host([level]) .shadow {
      --m3e-elevation-focus-level: ${ElevationToken.level};
      --m3e-elevation-pressed-level: ${ElevationToken.level};
    }
    @media (prefers-reduced-motion) {
      .shadow.resting,
      .shadow.pressed,
      .shadow.focus,
      .shadow.hover {
        transition: none;
      }
    }
    @media (forced-colors: active) {
      .shadow {
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

  /** @private */
  readonly #pressedController = new PressedController(this, {
    target: null,
    callback: (pressed) => this.#handlePressedChange(pressed),
  });

  @query(".shadow") private readonly _shadow?: HTMLElement;

  /**
   * Whether hover and press events will not trigger changes in elevation, when attached to an interactive element.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * The level at which to visually depict elevation.
   * @default null
   */
  @property({ type: Number, reflect: true }) level: ElevationLevel | null = null;

  /** @inheritdoc */
  override attach(control: HTMLElement): void {
    super.attach(control);

    this.#hoverController.observe(control);
    this.#focusController.observe(control);
    this.#pressedController.observe(control);
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

    this._shadow?.classList.toggle("hover", false);
    this._shadow?.classList.toggle("focus", false);
    this._shadow?.classList.toggle("pressed", false);
    this._shadow?.classList.toggle("resting", false);
  }

  /** @inheritdoc */
  protected override updated(_changedProperties: PropertyValues<this>): void {
    super.updated(_changedProperties);

    if (_changedProperties.has("disabled") && this.disabled) {
      this._shadow?.classList.toggle("hover", false);
      this._shadow?.classList.toggle("focus", false);
      this._shadow?.classList.toggle("pressed", false);
      this._shadow?.classList.toggle("resting", true);
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="shadow"></div>`;
  }

  /** @private */
  #handleHoverChange(hovering: boolean): void {
    if (!this.disabled) {
      this._shadow?.classList.toggle("hover", hovering);
      this._shadow?.classList.toggle("resting", !hovering);
    }
  }

  /** @private */
  #handleFocusChange(focused: boolean): void {
    if (!this.disabled) {
      this._shadow?.classList.toggle("focus", focused);
    }
  }

  /** @private */
  #handlePressedChange(pressed: boolean): void {
    if (!this.disabled) {
      this._shadow?.classList.toggle("pressed", pressed);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-elevation": M3eElevationElement;
  }
}
