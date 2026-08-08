import { css, CSSResultGroup, html, LitElement, PropertyValues, unsafeCSS } from "lit";
import { property, query } from "lit/decorators.js";

import { M3eStateLayerElement } from "./StateLayerElement";

import { AttachInternals, HtmlFor, ReconnectedCallback, Role, SuppressInitialAnimation } from "../mixins";
import { PressedController } from "../controllers";
import { customElement } from "../decorators";
import { DesignToken } from "../tokens";
import { prefersReducedMotion } from "../utils";

/**
 * Provides selection, focus, and hover state layer treatment for an interactive element that supports selection.
 *
 * @description
 * The `m3e-selection-indicator` component is an absolute positioned element used to depict a selected state
 * including hover and focus overlays. The parenting element must be a relative positioned element.
 *
 * This element can be attached to an interactive element using the `for` attribute or programmatically using the `attach` method.
 * The indicator's state layer is displayed when the interactive element is either hovered or focused.  This can be disabled using
 * the `disabled` attribute.  The `selected` attribute controls whether to present a selected state.
 *
 * @tag m3e-selection-indicator
 *
 * @attr bounce - Whether the indicator presents a bounce animation when selected.
 * @attr centered - Whether the selection animation always originates from the center of the element's bounds, rather than originating from the location of the click event.
 * @attr disabled - Whether hover and focus events will not trigger the indicator's state layer. State layers can still be controlled manually using the `show` and `hide` methods.
 * @attr selected - Whether the indicator is selected.
 *
 * @cssprop --m3e-selection-indicator-color - Color of the indicator.
 * @cssprop --m3e-selection-indicator-state-layer-duration - Duration of state layer changes.
 * @cssprop --m3e-selection-indicator-state-layer-easing - Easing curve of state layer changes.
 * @cssprop --m3e-selection-indicator-state-layer-focus-color - Color on focus.
 * @cssprop --m3e-selection-indicator-state-layer-focus-opacity - Opacity on focus.
 * @cssprop --m3e-selection-indicator-state-layer-hover-color - Color on hover.
 * @cssprop --m3e-selection-indicator-state-layer-hover-opacity - Opacity on hover.
 * @cssprop --m3e-selection-indicator-state-layer-pressed-color - Color on pressed.
 * @cssprop --m3e-selection-indicator-state-layer-pressed-opacity - Opacity on pressed.
 */
@customElement("m3e-selection-indicator")
export class M3eSelectionIndicatorElement extends SuppressInitialAnimation(
  ReconnectedCallback(HtmlFor(Role(AttachInternals(LitElement), "none"))),
) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
    }
    .state-layer {
      --m3e-state-layer-hover-color: var(
        --m3e-selection-indicator-state-layer-hover-color,
        ${DesignToken.color.onSurface}
      );
      --m3e-state-layer-hover-opacity: var(
        --m3e-selection-indicator-state-layer-hover-opacity,
        ${DesignToken.state.hoverStateLayerOpacity}
      );
      --m3e-state-layer-focus-color: var(
        --m3e-selection-indicator-state-layer-focus-color,
        ${DesignToken.color.onSurface}
      );
      --m3e-state-layer-focus-opacity: var(
        --m3e-selection-indicator-state-layer-focus-opacity,
        ${DesignToken.state.focusStateLayerOpacity}
      );
      --m3e-state-layer-pressed-color: var(
        --m3e-selection-indicator-state-layer-pressed-color,
        ${DesignToken.color.onSurface}
      );
      --m3e-state-layer-pressed-opacity: var(
        --m3e-selection-indicator-state-layer-pressed-opacity,
        ${DesignToken.state.pressedStateLayerOpacity}
      );
      --m3e-state-layer-duration: var(
        --m3e-selection-indicator-state-layer-duration,
        ${DesignToken.motion.duration.medium1}
      );
      --m3e-state-layer-easing: var(
        --m3e-selection-indicator-state-layer-easing,
        ${DesignToken.motion.easing.standard}
      );
    }
    :host,
    .base,
    .indicator {
      position: absolute;
      inset: 0;
      pointer-events: none;
      border-radius: inherit;
    }
    .indicator {
      opacity: 0;
      will-change: opacity;
    }
    :host(:not([disabled])) .indicator {
      background-color: var(--m3e-selection-indicator-color, ${DesignToken.color.secondaryContainer});
    }
    :host(:not(:is(:state(--no-animate), :--no-animate))) .indicator {
      transition: ${unsafeCSS(
        `opacity var(--m3e-selection-indicator-state-layer-duration, ${DesignToken.motion.duration.medium1}) var(--m3e-selection-indicator-state-layer-easing, ${DesignToken.motion.easing.standard})`,
      )};
    }
    .base {
      contain: layout style paint;
    }
    :host(:not([centered])) .base {
      transform-origin: var(--_pressed-origin-x, center) center;
    }
    :host([centered]) .base {
      transform-origin: center center;
    }
    :host([selected]:not([bounce]):not(:is(:state(--no-animate), :--no-animate))) .base {
      animation: ${unsafeCSS(
        `grow ${DesignToken.motion.duration.medium2} ${DesignToken.motion.easing.standardDecelerate}`,
      )};
    }
    :host([selected][bounce]:not(:is(:state(--no-animate), :--no-animate))) .base {
      animation: ${unsafeCSS(
        `grow-bounce ${DesignToken.motion.duration.medium2} ${DesignToken.motion.easing.standardDecelerate}`,
      )};
    }
    :host([selected]) .indicator {
      opacity: 1;
      transition: none;
    }
    :host(:not(:is(:state(--no-animate), :--no-animate))) .indicator {
      transition: ${unsafeCSS(`opacity ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard}`)};
    }
    @keyframes grow {
      0% {
        transform: scaleX(0);
      }
      100% {
        transform: scaleX(1);
      }
    }
    @keyframes grow-bounce {
      0% {
        transform: scaleX(0);
      }
      60% {
        transform: scaleX(1.05);
      }
      100% {
        transform: scaleX(1);
      }
    }
    @media (prefers-reduced-motion) {
      :host(:not(:is(:state(--no-animate), :--no-animate))) .indicator {
        transition: none;
      }
      :host([selected]:not([bounce]):not(:is(:state(--no-animate), :--no-animate))) .base,
      :host([selected][bounce]:not(:is(:state(--no-animate), :--no-animate))) .base {
        animation: none;
      }
    }
  `;

  /** @private */ readonly #pressedController = new PressedController(this, {
    target: null,
    isPressedKey: (key) => key === " ",
    callback: (pressed, point) => this.#handlePressedChange(pressed, point),
  });

  /** @private */ @query(".base") private readonly _base?: M3eStateLayerElement;
  /** @private */ @query(".state-layer") private readonly _stateLayer?: M3eStateLayerElement;

  /**
   * Whether hover and focus events will not trigger the indicator's state layer. State layers can still
   * be controlled manually using the `show` and `hide` methods.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * Whether the indicator is selected.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) selected = false;

  /**
   * Whether the indicator presents a bounce animation when selected.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) bounce = false;

  /**
   * Whether the selection animation always originates from the center of the element's bounds,
   * rather than originating from the location of the click event.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) centered = false;

  /**
   * Launches a manual state layer for the indicator.
   * @param {"hover" | "focused" | "pressed"} state The state of the indicator's state layer to show.
   */
  show(state: "hover" | "focused" | "pressed"): void {
    this._stateLayer?.show(state);
  }

  /**
   * Hides the state layer for the indicator.
   * @param {"hover" | "focused" | "pressed"} state The state of the indicator's state layer to hide.
   */
  hide(state: "hover" | "focused" | "pressed"): void {
    this._stateLayer?.hide(state);
  }

  /** @inheritdoc */
  override attach(control: HTMLElement): void {
    super.attach(control);
    this.#pressedController.observe(control);
    this._stateLayer?.attach(control);
  }

  /** @inheritdoc */
  override detach(): void {
    if (this.control) {
      this.#pressedController.unobserve(this.control);
      this._stateLayer?.detach();
    }
    super.detach();
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    this.ariaHidden = "true";
    super.connectedCallback();
  }

  /** @inheritdoc */
  override reconnectedCallback(): void {
    super.reconnectedCallback();
    this.#initStateLayer();
  }

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    this.#initStateLayer();
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="base" @animationend=${this.#handleAnimationEnd}>
      <div class="indicator"></div>
      <m3e-state-layer class="state-layer" enable-pressed ?disabled="${this.disabled}"></m3e-state-layer>
    </div>`;
  }

  /** @private */
  #initStateLayer(): void {
    const stateLayer = this._stateLayer;
    if (stateLayer && this.control !== stateLayer.control) {
      if (this.control) {
        stateLayer.attach(this.control);
      } else {
        stateLayer.detach();
      }
    }
  }

  /** @private */
  #handlePressedChange(pressed: boolean, point: { x: number; y: number }): void {
    if (this.disabled || this.selected || this.centered || prefersReducedMotion()) return;
    const base = this._base;
    if (pressed && base) {
      const bounds = base.getBoundingClientRect();
      const x = Math.min(Math.max(point.x - bounds.left, bounds.height), bounds.width - bounds.height);
      base?.style.setProperty("--_pressed-origin-x", `${x}px`);
    }
  }

  /** @private */
  #handleAnimationEnd(): void {
    this._base?.style.removeProperty("--_pressed-origin-x");
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-selection-indicator": M3eSelectionIndicatorElement;
  }
}
